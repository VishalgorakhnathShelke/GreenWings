"""sync_crop_variety_images.py  –  v4  (DuckDuckGo fallback, local storage)

Search strategy
───────────────
1. Wikimedia Commons / Wikidata  (free, no quota)
   • Wikidata P18 → canonical species image
   • Commons category crawl → editorial photos
   Only used as a *fast pre-check*: if we get enough good images here
   we skip Google entirely and save quota.

2. DuckDuckGo Search
   • Free tier, no quotas.

3. Vision verification  (Claude Haiku, optional)
   • Downloaded after Google returns URLs — no extra searches needed
   • Confirms the image actually shows the target crop/plant
   • Set ANTHROPIC_API_KEY in .env to enable

All candidates also pass through:
  • Negative-keyword title filter
  • Min-resolution guard
  • Duplicate-URL deduplication
  • Metadata relevance score (0-100)

Modes
─────
  --dry-run          Score and log; no download/upload/DB change
  --review           Write manifest for human approval
  --apply-approved   Upload approved manifest entries → DB
  --skip-vision      Skip AI vision check
"""

from __future__ import annotations

import argparse
import base64
import csv
import hashlib
import json
import mimetypes
import os
import re
import sqlite3
import time
from collections import defaultdict
from datetime import date
from pathlib import Path
from typing import Any
from urllib.parse import quote
from duckduckgo_search import DDGS
from urllib.request import Request, urlopen

# ---------------------------------------------------------------------------
# Paths & constants
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DB_PATH   = ROOT / "database" / "greenwings.db"
DEFAULT_CACHE_DIR = ROOT / "public" / "images" / "crop-varieties"
DEFAULT_REVIEW_DIR= ROOT / "public" / "images" / "crop-varieties" / "review"
ANTHROPIC_API_URL    = "https://api.anthropic.com/v1/messages"

USER_AGENT       = "GreenWingsImageSync/4.0 (agricultural data maintenance)"
SUPPORTED_MIMES  = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}

VISION_MODEL      = "claude-haiku-4-5-20251001"
VISION_MAX_TOKENS = 120
VISION_THUMB_W    = 400

MIN_RELEVANCE_SCORE  = 35

# Hard-reject titles containing any of these.
NEGATIVE_KEYWORDS = {
    "logo","icon","drawing","cartoon","recipe","packaged","packaging",
    "market price","price chart","seed packet","fertilizer","nursery ad",
    "advertisement","clipart","vector","illustration","isolated on white",
    "white background","sticker","label","brand","map","flag",
    "coat of arms","diagram","infographic","symbol","portrait","fashion",
    "model","lifestyle","person","people","woman","man","girl","boy",
}

PHOTO_POSITIVE = {
    "fruit","plant","tree","crop","field","harvest","flower",
    "leaf","leaves","branch","orchard","farm","grove","seed",
    "seedling","blossom","berry","grain","pod","root","tuber",
}

CROP_TYPE_HINTS: dict[str, str] = {
    "fruit":     "fruit plant",
    "vegetable": "vegetable plant",
    "grain":     "grain crop field",
    "legume":    "legume crop",
    "tree":      "tree orchard",
    "herb":      "herb plant",
    "spice":     "spice plant",
    "nut":       "nut tree",
    "root":      "root tuber crop",
}


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------

from dataclasses import dataclass


@dataclass(frozen=True)
class VarietyRecord:
    id: int
    subtype_id: int
    variety_name: str
    common_name: str
    scientific_name: str
    category_name: str
    current_image_url: str
    current_image_link: str


@dataclass
class ImageCandidate:
    title: str
    source_url: str
    file_url: str
    thumb_url: str
    mime_type: str
    width: int
    height: int
    license_name: str
    artist: str
    credit: str
    source_name: str      # "wikidata_p18"|"commons_category"|"google"
    relevance_score: int = 0
    rejection_reason: str = ""


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------


def log(msg: str, indent: int = 0) -> None:
    print("  " * indent + msg, flush=True)


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------


def clean_slug(value: str) -> str:
    return (re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:90]) or "image"


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def parse_existing_urls(value: str | None) -> list[str]:
    if not value:
        return []
    try:
        p = json.loads(value.strip())
        if isinstance(p, list):
            return [str(i) for i in p if str(i).strip()]
        if isinstance(p, str) and p.strip():
            return [p.strip()]
    except json.JSONDecodeError:
        pass
    return [x.strip() for x in re.split(r"[\n,;]+", value) if x.strip()]


def html_text(value: Any) -> str:
    if not isinstance(value, dict):
        return ""
    return re.sub(r"<[^>]+>", "", str(value.get("value") or "")).strip()


def http_json(
    url: str,
    params: dict[str, Any],
    timeout: int = 30,
    extra_headers: dict[str, str] | None = None,
    method: str = "GET",
    body: bytes | None = None,
) -> dict[str, Any]:
    request_url = f"{url}?{urlencode(params)}" if params else url
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    if extra_headers:
        headers.update(extra_headers)
    req = Request(request_url, headers=headers, data=body, method=method)
    with urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def extension_for(c: ImageCandidate) -> str:
    return SUPPORTED_MIMES.get(c.mime_type) or mimetypes.guess_extension(c.mime_type) or ".jpg"


def _tokenise(text: str) -> set[str]:
    return set(re.sub(r"[^a-z0-9 ]+", " ", text.lower()).split())


def _crop_hint(record: VarietyRecord) -> str:
    cat = (record.category_name or "").lower()
    return next((v for k, v in CROP_TYPE_HINTS.items() if k in cat), "plant crop")




# ---------------------------------------------------------------------------
# Relevance scoring
# ---------------------------------------------------------------------------


def score_candidate(c: ImageCandidate, record: VarietyRecord) -> tuple[int, str]:
    """Return (score 0-100, rejection_reason). Empty reason = passed."""
    title = (c.title or "").lower()

    # Whole-word match — avoids 'man' hitting 'Mangifera', 'woman' hitting 'Romania', etc.
    title_words = set(re.sub(r"[^a-z0-9 ]+", " ", title).split())
    for neg in NEGATIVE_KEYWORDS:
        neg_words = neg.split()
        if len(neg_words) == 1:
            if neg_words[0] in title_words:
                return 0, f"negative keyword '{neg}' in title"
        else:
            if neg in title:   # multi-word phrases: substring is fine
                return 0, f"negative keyword '{neg}' in title"

    if c.width < 1 or c.height < 1:
        return 0, "unknown resolution"
    if c.width < 300 or c.height < 300:
        return 0, f"too small ({c.width}×{c.height})"
    if c.mime_type not in SUPPORTED_MIMES:
        return 0, f"unsupported mime '{c.mime_type}'"

    score = 0
    sci_toks  = _tokenise(record.scientific_name or "")
    com_toks  = _tokenise(record.common_name)
    var_toks  = _tokenise(re.sub(r"\([^)]*\)", "", record.variety_name))
    t_toks    = _tokenise(title)

    sci_words = [t for t in sci_toks if len(t) > 3]
    if sci_words:
        score += int(40 * sum(1 for t in sci_words if t in title) / len(sci_words))

    com_words = [t for t in com_toks if len(t) > 3]
    if com_words and any(t in title for t in com_words):
        score += 25

    var_words = [t for t in var_toks if len(t) > 3]
    score += min(20, sum(1 for t in var_words if t in t_toks) * 10)

    if any(kw in title for kw in PHOTO_POSITIVE):
        score += 5
    if c.source_name in ("wikidata_p18", "commons_category"):
        score += 10
    lic = (c.license_name or "").lower()
    if "cc" in lic or "public domain" in lic:
        score += 5
    if c.width >= 1200 and c.height >= 800:
        score += 5
    elif c.width >= 600:
        score += 2

    return min(score, 100), ""


# ---------------------------------------------------------------------------
# Vision verification  (Claude API — optional)
# ---------------------------------------------------------------------------


def _fetch_bytes(url: str, max_bytes: int = 3 * 1024 * 1024) -> tuple[bytes, str]:
    if url.startswith("file://"):
        p = Path(url[7:])
        return p.read_bytes(), mimetypes.guess_type(str(p))[0] or "image/jpeg"
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=30) as resp:
        ct = resp.headers.get("Content-Type", "image/jpeg").split(";")[0].strip()
        buf, total = [], 0
        while chunk := resp.read(65536):
            total += len(chunk)
            if total > max_bytes:
                raise ValueError("image too large")
            buf.append(chunk)
    return b"".join(buf), ct


def _resize(data: bytes, max_w: int) -> tuple[bytes, str]:
    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(data))
        if img.width > max_w:
            img = img.resize((max_w, max(1, int(img.height * max_w / img.width))), Image.LANCZOS)
        out = io.BytesIO()
        fmt = img.format if img.format in ("JPEG", "PNG", "WEBP") else "JPEG"
        img.save(out, format=fmt)
        return out.getvalue(), f"image/{fmt.lower()}"
    except Exception:
        return data, "image/jpeg"


def vision_verify(c: ImageCandidate, record: VarietyRecord) -> tuple[bool, str]:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        return True, "skipped (no ANTHROPIC_API_KEY)"

    img_url = c.thumb_url or c.file_url
    if not img_url:
        return False, "no image URL"

    try:
        raw, mime = _fetch_bytes(img_url)
        img_b, mime = _resize(raw, VISION_THUMB_W)
    except Exception as exc:
        try:
            raw, mime = _fetch_bytes(c.file_url)
            img_b, mime = _resize(raw, VISION_THUMB_W)
        except Exception as exc2:
            return True, f"skipped (download error: {exc2})"

    if mime not in SUPPORTED_MIMES:
        mime = "image/jpeg"

    b64 = base64.standard_b64encode(img_b).decode()
    sci  = f" ({record.scientific_name})" if record.scientific_name else ""
    prompt = (
        f"You are a strict agricultural image verifier.\n"
        f"Target crop: {record.common_name}{sci}, variety: {record.variety_name}.\n\n"
        f"Answer ONLY:\n"
        f"YES  – image clearly shows the {record.common_name} plant, fruit, tree, "
        f"leaves, flower or harvest.\n"
        f"NO: <short reason>  – if it shows a person, logo, wrong crop, packaged "
        f"product, recipe, or anything else.\n"
        f"Your answer:"
    )
    payload = {
        "model": VISION_MODEL,
        "max_tokens": VISION_MAX_TOKENS,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": mime, "data": b64}},
                {"type": "text",  "text": prompt},
            ],
        }],
    }
    try:
        req = Request(
            ANTHROPIC_API_URL,
            data=json.dumps(payload).encode(),
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            method="POST",
        )
        with urlopen(req, timeout=45) as resp:
            result = json.loads(resp.read())
        answer = result.get("content", [{}])[0].get("text", "").strip()
        log(f"  [Vision] {answer!r}", 1)
        if answer.upper().startswith("YES"):
            return True, answer
        reason = answer[3:].strip(" :-") if len(answer) > 3 else "not the target crop"
        return False, reason
    except Exception as exc:
        log(f"  [Vision] API error: {exc} — allowing through", 1)
        return True, f"skipped (API error: {exc})"


# ---------------------------------------------------------------------------
# Wikimedia helpers  (free pre-check, no quota)
# ---------------------------------------------------------------------------


def _commons_file_info(file_title: str) -> dict[str, Any]:
    if not file_title.startswith("File:"):
        file_title = f"File:{file_title}"
    try:
        data = http_json(COMMONS_API_URL, {
            "action": "query", "format": "json", "prop": "imageinfo",
            "titles": file_title, "iiprop": "url|size|mime|extmetadata", "iiurlwidth": 1200,
        })
        pages = data.get("query", {}).get("pages", {})
        ii = (next(iter(pages.values()), {}).get("imageinfo") or [{}])[0]
        meta = ii.get("extmetadata", {})
        return {
            "url":       ii.get("url", ""),
            "thumb_url": ii.get("thumburl", ""),
            "width":     ii.get("width", 0),
            "height":    ii.get("height", 0),
            "mime":      ii.get("mime", "image/jpeg"),
            "license":   html_text(meta.get("LicenseShortName", {})) or html_text(meta.get("License", {})),
            "artist":    html_text(meta.get("Artist", {})),
            "credit":    html_text(meta.get("Credit", {})),
        }
    except Exception:
        return {}


def _file_to_candidate(title: str, source_url: str, source_name: str) -> ImageCandidate | None:
    info = _commons_file_info(title)
    if not info.get("url"):
        return None
    return ImageCandidate(
        title=title, source_url=source_url, file_url=info["url"],
        thumb_url=info.get("thumb_url", ""), mime_type=info.get("mime", "image/jpeg"),
        width=info.get("width", 0), height=info.get("height", 0),
        license_name=info.get("license", ""), artist=info.get("artist", ""),
        credit=info.get("credit", ""), source_name=source_name,
    )


def _wikidata_p18_and_cat(record: VarietyRecord) -> tuple[list[ImageCandidate], str]:
    """
    Look up the Wikidata entity for the species and return
    (P18 image candidates, commons category name).
    Uses label search API — no SPARQL needed.
    """
    def label_search(q: str) -> list[dict[str, Any]]:
        try:
            return http_json(WIKIDATA_API_URL, {
                "action": "wbsearchentities", "format": "json",
                "language": "en", "type": "item", "limit": 8, "search": q,
            }).get("search", [])
        except Exception:
            return []

    def p18_cat(qid: str) -> tuple[str, list[str]]:
        try:
            claims = http_json(WIKIDATA_API_URL, {
                "action": "wbgetclaims", "format": "json",
                "entity": qid, "property": "P18|P373",
            }).get("claims", {})
            p18 = [
                c.get("mainsnak", {}).get("datavalue", {}).get("value", "")
                for c in claims.get("P18", [])
                if c.get("mainsnak", {}).get("datavalue", {}).get("value")
            ]
            cat = next(
                (c.get("mainsnak", {}).get("datavalue", {}).get("value", "")
                 for c in claims.get("P373", [])
                 if c.get("mainsnak", {}).get("datavalue", {}).get("value")),
                "",
            )
            return cat, p18
        except Exception:
            return "", []

    plant_words = {"taxon", "plant", "cultivar", "variety", "species", "crop", "fruit"}

    search_terms = []
    if record.scientific_name:
        search_terms.append(record.scientific_name)
    variety_clean = re.sub(r"\([^)]*\)", "", record.variety_name).strip()
    if variety_clean:
        search_terms.append(f"{variety_clean} {record.common_name}")
    search_terms.append(record.common_name)

    commons_cat = ""
    for term in search_terms:
        for item in label_search(term)[:5]:
            desc = item.get("description", "").lower()
            if any(w in desc for w in plant_words):
                qid = item["id"]
                log(f"  [Wikidata] '{item['label']}' → {qid} ({desc[:60]})", 1)
                cat, p18_files = p18_cat(qid)
                if cat:
                    commons_cat = cat
                if p18_files:
                    candidates = []
                    for fname in p18_files[:3]:
                        c = _file_to_candidate(
                            fname,
                            source_url=f"https://www.wikidata.org/wiki/{qid}",
                            source_name="wikidata_p18",
                        )
                        if c:
                            candidates.append(c)
                        time.sleep(0.2)
                    return candidates, commons_cat
    return [], commons_cat


def _commons_category_images(category: str, limit: int) -> list[ImageCandidate]:
    if not category:
        return []
    cmtitle = category if category.startswith("Category:") else f"Category:{category}"
    try:
        data = http_json(COMMONS_API_URL, {
            "action": "query", "format": "json", "list": "categorymembers",
            "cmtitle": cmtitle, "cmtype": "file",
            "cmlimit": min(limit * 3, 30), "cmprop": "title",
        })
    except Exception as exc:
        log(f"  [Commons cat] error: {exc}", 1)
        return []

    members = data.get("query", {}).get("categorymembers", [])
    log(f"  [Commons cat] '{category}' → {len(members)} file(s)", 1)
    candidates = []
    for m in members:
        title = m.get("title", "")
        ext = title.rsplit(".", 1)[-1].lower()
        if ext in ("svg", "ogg", "ogv", "webm", "pdf"):
            continue
        c = _file_to_candidate(
            title,
            source_url=f"https://commons.wikimedia.org/wiki/{quote(cmtitle.replace(' ', '_'))}",
            source_name="commons_category",
        )
        if c:
            candidates.append(c)
        time.sleep(0.15)
        if len(candidates) >= limit:
            break
    return candidates


# ---------------------------------------------------------------------------
# DuckDuckGo Search  — PRIMARY fallback source
# ---------------------------------------------------------------------------


def _build_ddg_query(record: VarietyRecord) -> str:
    sci     = record.scientific_name or ""
    variety = re.sub(r"\([^)]*\)", "", record.variety_name).strip()
    common  = record.common_name
    hint    = _crop_hint(record)

    if sci:
        core = f'"{sci}"'
        if variety and variety.lower() not in sci.lower():
            core += f' "{variety}"'
    elif variety:
        core = f'"{variety}" {common}'
    else:
        core = common

    return f"{core} {hint}"


def _source_ddg(
    record: VarietyRecord,
    images_wanted: int,
) -> list[ImageCandidate]:
    query = _build_ddg_query(record)
    log(f"  [DDG] query: '{query}'", 1)

    candidates: list[ImageCandidate] = []
    try:
        results = DDGS().images(
            keywords=query,
            max_results=images_wanted + 3,
            safesearch="on",
        )
        for item in results:
            candidates.append(ImageCandidate(
                title       = item.get("title", ""),
                source_url  = item.get("url", ""),
                file_url    = item.get("image", ""),
                thumb_url   = item.get("thumbnail", ""),
                mime_type   = "image/jpeg",
                width       = item.get("width", 0) or 800,
                height      = item.get("height", 0) or 600,
                license_name= "Unknown (DDG)",
                artist      = item.get("source", ""),
                credit      = "",
                source_name = "ddg",
            ))
            
        log(f"  [DDG] {len(candidates)} image(s) returned", 1)
        import time
        time.sleep(2.0)
    except Exception as exc:
        log(f"  [DDG] API error: {exc}", 1)

    return candidates


# ---------------------------------------------------------------------------
# Candidate pipeline
# ---------------------------------------------------------------------------


def find_candidates(
    record: VarietyRecord,
    count: int,
    min_width: int,
    
    vision_enabled: bool = True,
) -> tuple[list[ImageCandidate], list[tuple[ImageCandidate, str]]]:
    """
    Full pipeline:
      1. Wikidata P18 + Commons category  (free, no quota consumed)
      2. Google PSE  (1 search, ≤10 results, quota−1)
      Filter each candidate through:
        a. Duplicate URL check
        b. Min-width floor
        c. Metadata relevance score
        d. AI vision verify  (if enabled)
    """
    seen_urls: set[str] = set()
    accepted:  list[ImageCandidate] = []
    rejected:  list[tuple[ImageCandidate, str]] = []

    def evaluate(raw: list[ImageCandidate]) -> None:
        for c in raw:
            if len(accepted) >= count:
                return

            if not c.file_url:
                rejected.append((c, "empty file_url")); continue
            if c.file_url in seen_urls:
                rejected.append((c, "duplicate URL")); continue
            seen_urls.add(c.file_url)

            if 0 < c.width < min_width:
                rejected.append((c, f"width {c.width} < {min_width}")); continue

            score, reason = score_candidate(c, record)
            c.relevance_score = score
            if reason:
                c.rejection_reason = reason
                rejected.append((c, reason)); continue
            if score < MIN_RELEVANCE_SCORE:
                c.rejection_reason = f"low score ({score})"
                rejected.append((c, f"low score ({score})")); continue

            if vision_enabled:
                ok, explanation = vision_verify(c, record)
                if not ok:
                    c.rejection_reason = f"vision: {explanation}"
                    rejected.append((c, f"vision: {explanation}"))
                    log(f"  ✗ vision rejected [{c.source_name}]: {explanation}", 1)
                    continue
                log(f"  ✓ vision OK [{c.source_name}]: {explanation[:60]}", 1)

            log(f"  ✓ accepted [{c.source_name}] score={score} {c.width}×{c.height}  {c.file_url[:80]}", 1)
            accepted.append(c)

    # ── Step 1: Wikimedia (free) ──────────────────────────────────────────
    log("  [Wikidata] looking up P18 + Commons category…", 1)
    p18_results, commons_cat = _wikidata_p18_and_cat(record)
    log(f"  [Wikidata] P18: {len(p18_results)} image(s)  Commons cat: '{commons_cat}'", 1)
    evaluate(p18_results)

    if len(accepted) < count and commons_cat:
        cat_results = _commons_category_images(commons_cat, count * 3)
        evaluate(cat_results)

    # ── Step 2: Google PSE (1 search, up to 10 images) ───────────────────
    if len(accepted) < count:
        ddg_results = _source_ddg(record, count - len(accepted) + 3)
        evaluate(ddg_results)
    else:
        log(f"  [DDG] skipped — Wikimedia gave enough images ({len(accepted)})", 1)

    # ── Summary ───────────────────────────────────────────────────────────
    for c, reason in rejected:
        log(f"  ✗ rejected [{c.source_name}] {reason}: {(c.file_url or c.title)[:70]}", 1)

    return accepted, rejected


# ---------------------------------------------------------------------------
# Image download
# ---------------------------------------------------------------------------


def download_image(file_url: str, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    req = Request(file_url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=60) as resp:
        target.write_bytes(resp.read())




# ---------------------------------------------------------------------------
# SQLite
# ---------------------------------------------------------------------------


def fetch_varieties(
    db_path: Path,
    subtype_ids: list[int] | None,
    limit: int | None,
    force: bool,
) -> list[VarietyRecord]:
    where = ["cv.subtype_id IS NOT NULL"]
    params: list[Any] = []
    if subtype_ids:
        ph = ",".join("?" * len(subtype_ids))
        where.append(f"cv.subtype_id IN ({ph})")
        params.extend(subtype_ids)
    if not force:
        where.append("(cv.image_url IS NULL OR TRIM(cv.image_url) = '')")
    if limit:
        params.append(limit)
    sql = f"""
        SELECT cv.id, cv.subtype_id, cv.variety_name, c.common_name,
               COALESCE(c.scientific_name,'') AS scientific_name,
               COALESCE(cc.name, c.category,'') AS category_name,
               COALESCE(cv.image_url,'') AS current_image_url,
               COALESCE(cv.image_link,'') AS current_image_link
        FROM crop_variety cv
        JOIN crop c ON c.id = cv.crop_id
        LEFT JOIN crop_category cc ON cc.id = c.category_id
        WHERE {' AND '.join(where)}
        ORDER BY cv.subtype_id
        {"LIMIT ?" if limit else ""}
    """
    with sqlite3.connect(db_path) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(sql, params).fetchall()
    return [VarietyRecord(**dict(r)) for r in rows]


def save_urls(db_path: Path, variety_id: int, urls: list[str]) -> None:
    if not urls:
        return
    with sqlite3.connect(db_path) as conn:
        conn.execute(
            "UPDATE crop_variety SET image_url=?, image_link=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
            (json.dumps(urls, ensure_ascii=False), urls[0], variety_id),
        )
        conn.commit()


# ---------------------------------------------------------------------------
# Review manifest
# ---------------------------------------------------------------------------

MANIFEST_FILENAME = "review_manifest.json"


def load_manifest(review_dir: Path) -> list[dict[str, Any]]:
    p = review_dir / MANIFEST_FILENAME
    return json.loads(p.read_text()) if p.exists() else []


def save_manifest(review_dir: Path, entries: list[dict[str, Any]]) -> None:
    review_dir.mkdir(parents=True, exist_ok=True)
    p = review_dir / MANIFEST_FILENAME
    p.write_text(json.dumps(entries, ensure_ascii=False, indent=2))
    csv_p = review_dir / "review_manifest.csv"
    if entries:
        with csv_p.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(entries[0].keys()))
            w.writeheader(); w.writerows(entries)
    log(f"\n  Manifest → {p}")
    log(f"  CSV      → {csv_p}")
    log("  Set 'approved': true then run --apply-approved")


def accepted_to_manifest(record: VarietyRecord, accepted: list[ImageCandidate]) -> list[dict[str, Any]]:
    return [{
        "variety_id": record.id, "subtype_id": record.subtype_id,
        "common_name": record.common_name, "variety_name": record.variety_name,
        "scientific_name": record.scientific_name,
        "candidate_url": c.file_url, "source_page": c.source_url,
        "title": c.title, "license": c.license_name, "author": c.artist,
        "width": c.width, "height": c.height,
        "relevance_score": c.relevance_score, "source_name": c.source_name,
        "mime_type": c.mime_type, "approved": False,
    } for c in accepted]


# ---------------------------------------------------------------------------
# Per-record sync
# ---------------------------------------------------------------------------


def _slug(record: VarietyRecord, idx: int, url: str, ext: str) -> str:
    h = hashlib.sha1(url.encode()).hexdigest()[:10]
    return f"subtype-{record.subtype_id:04d}-{clean_slug(record.common_name)}-{clean_slug(record.variety_name)}-{idx:02d}-{h}{ext}"


def sync_record(
    record: VarietyRecord,
    db_path: Path, cache_dir: Path,
    images_per_subtype: int, min_width: int,
    dry_run: bool, review_mode: bool,
    force: bool,  vision_enabled: bool,
) -> tuple[int, list[str], list[dict[str, Any]]]:

    log(f"\n{'─'*64}")
    log(f"Subtype {record.subtype_id}: {record.common_name} / {record.variety_name}")
    if record.scientific_name:
        log(f"  Scientific : {record.scientific_name}", 1)
    log(f"  Category   : {record.category_name}", 1)

    accepted, rejected = find_candidates(
        record, images_per_subtype, min_width,  vision_enabled,
    )
    log(f"  → accepted: {len(accepted)}  rejected: {len(rejected)}", 1)

    if not accepted:
        log("  ⚠ No suitable images found.", 1)
        return record.subtype_id, [], []

    if dry_run:
        for c in accepted:
            log(f"  dry-run [{c.source_name}] score={c.relevance_score} {c.width}×{c.height} {c.file_url[:80]}", 1)
        return record.subtype_id, [], []

    if review_mode:
        return record.subtype_id, [], accepted_to_manifest(record, accepted)

    record_dir = cache_dir / f"subtype-{record.subtype_id:04d}-{clean_slug(record.common_name)}-{clean_slug(record.variety_name)}"
    uploaded: list[str] = []
    manifest_rows: list[dict[str, str]] = []

    for idx, c in enumerate(accepted, 1):
        filename  = _slug(record, idx, c.file_url, extension_for(c))
        local     = record_dir / filename

        if force or not local.exists():
            try:
                download_image(c.file_url, local)
            except Exception as exc:
                log(f"  ✗ download failed #{idx}: {exc}", 1); continue

        pub = f"/images/crop-varieties/subtype-{record.subtype_id:04d}-{clean_slug(record.common_name)}-{clean_slug(record.variety_name)}/{filename}"
        uploaded.append(pub)
        manifest_rows.append({"public_url": pub, "source_url": c.source_url,
            "title": c.title, "license": c.license_name, "artist": c.artist,
            "width": str(c.width), "height": str(c.height),
            "score": str(c.relevance_score), "source_name": c.source_name})
        log(f"  ✓ uploaded [{c.source_name}] → {pub}", 1)

    if uploaded:
        save_urls(db_path, record.id, uploaded)
        manifest_path = record_dir / f"subtype-{record.subtype_id:04d}-manifest.json"
        record_dir.mkdir(parents=True, exist_ok=True)
        manifest_path.write_text(json.dumps({
            "subtype_id": record.subtype_id, "crop": record.common_name,
            "variety": record.variety_name, "images": manifest_rows,
        }, ensure_ascii=False, indent=2))
        log(f"  ✓ saved {len(uploaded)} URL(s) to DB", 1)

    return record.subtype_id, uploaded, []


# ---------------------------------------------------------------------------
# Apply-approved mode
# ---------------------------------------------------------------------------


def apply_approved(review_dir: Path, db_path: Path, cache_dir: Path,
                   ) -> None:
    entries = load_manifest(review_dir)
    if not entries:
        log("No manifest found."); return

    approved = [e for e in entries if e.get("approved")]
    log(f"Applying {len(approved)} approved image(s)…")
    by_variety: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for e in approved:
        by_variety[e["variety_id"]].append(e)

    total = 0
    for vid, items in by_variety.items():
        common  = items[0]["common_name"]
        variety = items[0]["variety_name"]
        sid     = items[0]["subtype_id"]
        rdir    = cache_dir / f"subtype-{sid:04d}-{clean_slug(common)}-{clean_slug(variety)}"
        uploaded: list[str] = []

        for idx, e in enumerate(items, 1):
            furl = e["candidate_url"]
            mime = e.get("mime_type", "image/jpeg")
            ext  = SUPPORTED_MIMES.get(mime, ".jpg")
            fn   = f"subtype-{sid:04d}-{clean_slug(common)}-{clean_slug(variety)}-{idx:02d}-{hashlib.sha1(furl.encode()).hexdigest()[:10]}{ext}"
            lp   = rdir / fn
            if not lp.exists():
                try:
                    download_image(furl, lp)
                except Exception as exc:
                    log(f"  ✗ re-download: {exc}", 1); continue
            pub = f"/images/crop-varieties/subtype-{sid:04d}-{clean_slug(common)}-{clean_slug(variety)}/{fn}"
            uploaded.append(pub); total += 1
            log(f"  ✓ {pub}", 1)

        if uploaded:
            save_urls(db_path, vid, uploaded)
            log(f"  ✓ DB updated variety_id={vid}", 1)

    log(f"\nDone. Uploaded {total} approved image(s).")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="GreenWings image sync — DuckDuckGo fallback, local storage, vision-verified."
    )
    p.add_argument("--db",                 default=str(DEFAULT_DB_PATH))
    p.add_argument("--cache-dir",          default=str(DEFAULT_CACHE_DIR))
    p.add_argument("--review-dir",         default=str(DEFAULT_REVIEW_DIR))
    p.add_argument("--images-per-subtype", type=int, default=5)
    p.add_argument("--min-width",          type=int, default=600)
    p.add_argument("--subtype-id",  type=int, action="append")
    p.add_argument("--limit-varieties", type=int)
    p.add_argument("--force",        action="store_true")
    p.add_argument("--dry-run",      action="store_true")
    p.add_argument("--review",       action="store_true")
    p.add_argument("--apply-approved", action="store_true")
    p.add_argument("--skip-vision",  action="store_true",
                   help="Disable AI vision check (faster, less accurate).")
    return p.parse_args()


def main() -> None:
    args = parse_args()
    images_per_subtype = max(1, min(args.images_per_subtype, 10))
    db_path    = Path(args.db).resolve()
    cache_dir  = Path(args.cache_dir).resolve()
    review_dir = Path(args.review_dir).resolve()
    load_dotenv(ROOT / ".env")
    if args.apply_approved:
        apply_approved(review_dir, db_path, cache_dir)
        return
    records = fetch_varieties(db_path, args.subtype_id, args.limit_varieties, args.force)
    if not records:
        log("No crop variety rows need image sync."); return

    vision_enabled = not args.skip_vision
    mode = "DRY-RUN" if args.dry_run else ("REVIEW" if args.review else "LIVE")

    log(f"\n{'='*64}")
    log(f"GreenWings Image Sync  [{mode}]")
    log(f"  Records         : {len(records)}")
    log(f"  Images/subtype  : {images_per_subtype}")
    log(f"  Min width       : {args.min_width}px")
    log(f"  Vision verify   : {'ON' if vision_enabled else 'OFF (--skip-vision)'}")
    log(f"{'='*64}")

    total_uploaded = 0
    all_review_entries: list[dict[str, Any]] = []

    for record in records:

        _, urls, review_entries = sync_record(
            record=record, db_path=db_path, cache_dir=cache_dir,
            images_per_subtype=images_per_subtype, min_width=args.min_width,
            dry_run=args.dry_run, review_mode=args.review,
            force=args.force, vision_enabled=vision_enabled,
        )
        total_uploaded += len(urls)
        all_review_entries.extend(review_entries)

    if args.review and all_review_entries:
        existing = load_manifest(review_dir)
        seen = {e["candidate_url"] for e in existing}
        new  = [e for e in all_review_entries if e["candidate_url"] not in seen]
        save_manifest(review_dir, existing + new)
    elif not args.dry_run and not args.review:
        log(f"\n{'='*64}")
        log(f"Done. Uploaded {total_uploaded} image(s) total.")


if __name__ == "__main__":
    main()
