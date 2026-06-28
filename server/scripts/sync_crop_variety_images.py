"""sync_crop_variety_images.py

Downloads crop variety images by precisely targeting the species/variety
on Wikimedia Commons and Wikidata, then applies relevance filters before
uploading to Cloudflare R2 and saving public URLs to SQLite.

Search strategy (in order of precision):
  1. Wikidata SPARQL  – look up exact QID for scientific name or variety name,
                        then pull P18 (image) AND P4765 (Commons category).
  2. Commons category – crawl the matched Commons category for the species /
                        variety and collect real photos.
  3. Commons fulltext – targeted search scoped to the scientific name /
                        variety name inside File: namespace.
  4. Google PSE       – fallback if GOOGLE_PSE_API_KEY + GOOGLE_PSE_CX set.
  5. Bing / icrawler  – last-resort (requires icrawler package).

All candidates pass through:
  • Negative-keyword hard rejection (logo, cartoon, recipe, …)
  • Min-resolution guard
  • Duplicate-URL deduplication
  • Relevance scoring (0-100) against species/variety/common name tokens
  • Mandatory minimum score threshold before acceptance

Modes:
  --dry-run         Score and log candidates; no download/upload/DB change.
  --review          Write candidates to a JSON+CSV manifest for human approval.
  --apply-approved  Upload manifest entries marked approved=true, then update DB.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import mimetypes
import os
import re
import sqlite3
import time
from collections import defaultdict
from pathlib import Path
from typing import Any
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DB_PATH = ROOT / "database" / "greenwings.db"
DEFAULT_CACHE_DIR = ROOT / "database" / "media-cache" / "crop-varieties"
DEFAULT_REVIEW_DIR = ROOT / "database" / "media-cache" / "review"

COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php"
WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php"
WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql"

USER_AGENT = "GreenWingsImageSync/3.0 (agricultural data maintenance)"
SUPPORTED_MIME_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}

# Candidates below this score are always rejected.
MIN_RELEVANCE_SCORE = 35

# Hard-reject any candidate whose title contains one of these tokens.
NEGATIVE_KEYWORDS = {
    "logo", "icon", "drawing", "cartoon", "recipe", "packaged", "packaging",
    "market price", "price chart", "seed packet", "fertilizer", "nursery ad",
    "advertisement", "clipart", "vector", "illustration", "isolated on white",
    "white background", "sticker", "label", "brand", "map", "flag",
    "coat of arms", "diagram", "chart", "infographic", "symbol",
}

# Words that indicate a photo of the actual plant/fruit (raise score).
PHOTO_POSITIVE_KEYWORDS = {
    "fruit", "plant", "tree", "crop", "field", "harvest", "flower",
    "leaf", "leaves", "branch", "orchard", "farm", "grove", "seed",
    "seedling", "blossom", "berry", "grain", "pod", "root", "tuber",
}

# Crop-type context words to append to broad searches.
CROP_TYPE_HINTS: dict[str, str] = {
    "fruit": "fruit plant",
    "vegetable": "vegetable plant",
    "grain": "grain crop field",
    "legume": "legume crop",
    "tree": "tree orchard",
    "herb": "herb plant",
    "spice": "spice plant",
    "nut": "nut tree",
    "root": "root tuber crop",
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
    source_url: str       # Attribution / wiki page URL
    file_url: str         # Direct downloadable URL
    thumb_url: str
    mime_type: str
    width: int
    height: int
    license_name: str
    artist: str
    credit: str
    source_name: str      # "wikidata_p18", "commons_category", "commons_search",
                          # "google", "bing"
    relevance_score: int = 0
    rejection_reason: str = ""


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------


def log(msg: str, indent: int = 0) -> None:
    print("  " * indent + msg, flush=True)


# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------


def clean_slug(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower())
    return slug.strip("-")[:90] or "image"


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def parse_existing_urls(value: str | None) -> list[str]:
    if not value:
        return []
    text = value.strip()
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return [str(i) for i in parsed if str(i).strip()]
        if isinstance(parsed, str) and parsed.strip():
            return [parsed.strip()]
    except json.JSONDecodeError:
        pass
    return [p.strip() for p in re.split(r"[\n,;]+", text) if p.strip()]


def html_text(value: Any) -> str:
    if not isinstance(value, dict):
        return ""
    return re.sub(r"<[^>]+>", "", str(value.get("value") or "")).strip()


def http_json(
    url: str,
    params: dict[str, Any],
    timeout: int = 30,
    extra_headers: dict[str, str] | None = None,
) -> dict[str, Any]:
    request_url = f"{url}?{urlencode(params)}"
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    if extra_headers:
        headers.update(extra_headers)
    req = Request(request_url, headers=headers)
    with urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def extension_for(candidate: ImageCandidate) -> str:
    return (
        SUPPORTED_MIME_TYPES.get(candidate.mime_type)
        or mimetypes.guess_extension(candidate.mime_type)
        or ".jpg"
    )


def _tokenise(text: str) -> set[str]:
    return set(re.sub(r"[^a-z0-9 ]+", " ", text.lower()).split())


# ---------------------------------------------------------------------------
# Relevance scoring
# ---------------------------------------------------------------------------


def score_candidate(candidate: ImageCandidate, record: VarietyRecord) -> tuple[int, str]:
    """
    Return (score 0-100, rejection_reason).
    Empty rejection_reason means the candidate passed all hard checks.
    """
    title_lower = (candidate.title or "").lower()

    # ── Hard rejections ────────────────────────────────────────────────────
    for neg in NEGATIVE_KEYWORDS:
        if neg in title_lower:
            return 0, f"negative keyword '{neg}' in title"

    if candidate.width < 1 or candidate.height < 1:
        return 0, "unknown resolution"

    if candidate.width < 300 or candidate.height < 300:
        return 0, f"too small ({candidate.width}×{candidate.height})"

    if candidate.mime_type not in SUPPORTED_MIME_TYPES:
        return 0, f"unsupported mime '{candidate.mime_type}'"

    # ── Positive scoring ───────────────────────────────────────────────────
    score = 0

    sci_tokens = _tokenise(record.scientific_name or "")
    common_tokens = _tokenise(record.common_name)
    variety_tokens = _tokenise(re.sub(r"\([^)]*\)", "", record.variety_name))
    title_tokens = _tokenise(title_lower)

    # Scientific name match in title (+40) — strongest signal
    sci_words = [t for t in sci_tokens if len(t) > 3]
    sci_matches = sum(1 for t in sci_words if t in title_lower)
    if sci_words:
        score += int(40 * sci_matches / len(sci_words))

    # Common name match in title (+25)
    common_words = [t for t in common_tokens if len(t) > 3]
    if common_words and any(t in title_lower for t in common_words):
        score += 25

    # Variety name match in title (+20)
    variety_words = [t for t in variety_tokens if len(t) > 3]
    variety_matches = [t for t in variety_words if t in title_tokens]
    score += min(20, len(variety_matches) * 10)

    # Photo-type keyword bonus (+5)
    if any(kw in title_lower for kw in PHOTO_POSITIVE_KEYWORDS):
        score += 5

    # Trusted source bonus (+10)
    if candidate.source_name in ("wikidata_p18", "commons_category", "commons_search"):
        score += 10

    # Open license bonus (+5)
    lic = (candidate.license_name or "").lower()
    if "cc" in lic or "public domain" in lic:
        score += 5

    # Resolution bonus (+5)
    if candidate.width >= 1200 and candidate.height >= 800:
        score += 5
    elif candidate.width >= 600:
        score += 2

    return min(score, 100), ""


# ---------------------------------------------------------------------------
# Commons helpers
# ---------------------------------------------------------------------------


def _commons_file_info(file_title: str) -> dict[str, Any]:
    """
    Fetch full image metadata from Wikimedia Commons for one File: page.
    Returns dict with keys: url, thumb_url, width, height, mime,
    license, artist, credit.  Returns {} on any error.
    """
    if not file_title.startswith("File:"):
        file_title = f"File:{file_title}"
    try:
        data = http_json(
            COMMONS_API_URL,
            {
                "action": "query",
                "format": "json",
                "prop": "imageinfo",
                "titles": file_title,
                "iiprop": "url|size|mime|extmetadata",
                "iiurlwidth": 1200,
            },
        )
        pages = data.get("query", {}).get("pages", {})
        page = next(iter(pages.values()), {})
        ii = (page.get("imageinfo") or [{}])[0]
        meta = ii.get("extmetadata", {})
        return {
            "url": ii.get("url", ""),
            "thumb_url": ii.get("thumburl", ""),
            "width": ii.get("width", 0),
            "height": ii.get("height", 0),
            "mime": ii.get("mime", "image/jpeg"),
            "license": html_text(meta.get("LicenseShortName", {}))
                       or html_text(meta.get("License", {})),
            "artist": html_text(meta.get("Artist", {})),
            "credit": html_text(meta.get("Credit", {})),
        }
    except Exception:
        return {}


def _file_title_to_candidate(
    file_title: str,
    source_url: str,
    source_name: str,
) -> ImageCandidate | None:
    """Convert a Commons File: title into a full ImageCandidate, or None on failure."""
    info = _commons_file_info(file_title)
    if not info.get("url"):
        return None
    return ImageCandidate(
        title=file_title,
        source_url=source_url,
        file_url=info["url"],
        thumb_url=info.get("thumb_url", ""),
        mime_type=info.get("mime", "image/jpeg"),
        width=info.get("width", 0),
        height=info.get("height", 0),
        license_name=info.get("license", ""),
        artist=info.get("artist", ""),
        credit=info.get("credit", ""),
        source_name=source_name,
    )


# ---------------------------------------------------------------------------
# Source 1 – Wikidata SPARQL: find the exact QID for the species/variety,
#            then pull P18 (image) and P4765 (Commons category).
# ---------------------------------------------------------------------------


def _wikidata_lookup(record: VarietyRecord) -> tuple[str, str, list[str]]:
    """
    Look up the best Wikidata QID for this crop variety via SPARQL.

    Strategy (tried in order):
      a) Exact scientific name label match.
      b) Variety name label match narrowed by "taxon" or "cultivar".
      c) Common name label match.

    Returns (qid, commons_category, [p18_filenames]).
    All values are empty / empty-list if nothing found.
    """
    def sparql(query: str) -> list[dict[str, Any]]:
        try:
            data = http_json(
                WIKIDATA_SPARQL_URL,
                {"query": query, "format": "json"},
                extra_headers={"Accept": "application/sparql-results+json"},
            )
            return data.get("results", {}).get("bindings", [])
        except Exception as exc:
            log(f"  [Wikidata SPARQL] error: {exc}", 1)
            return []

    def label_search(label: str) -> list[dict[str, Any]]:
        """Use Wikidata label search API (faster than SPARQL for exact names)."""
        try:
            data = http_json(
                WIKIDATA_API_URL,
                {
                    "action": "wbsearchentities",
                    "format": "json",
                    "language": "en",
                    "type": "item",
                    "limit": 10,
                    "search": label,
                },
            )
            return data.get("search", [])
        except Exception:
            return []

    def get_p18_and_category(qid: str) -> tuple[str, list[str]]:
        """Given a QID, return (commons_category, [p18_image_filenames])."""
        try:
            data = http_json(
                WIKIDATA_API_URL,
                {
                    "action": "wbgetclaims",
                    "format": "json",
                    "entity": qid,
                    "property": "P18|P373|P4765",  # image | Commons category | Commons category
                },
            )
            claims = data.get("claims", {})

            # P18 = image
            p18_files = []
            for claim in claims.get("P18", []):
                fname = claim.get("mainsnak", {}).get("datavalue", {}).get("value", "")
                if fname:
                    p18_files.append(fname)

            # P373 = Commons category name (string)
            commons_cat = ""
            for claim in claims.get("P373", []):
                val = claim.get("mainsnak", {}).get("datavalue", {}).get("value", "")
                if val:
                    commons_cat = val
                    break

            return commons_cat, p18_files
        except Exception:
            return "", []

    # ── Try scientific name first (most precise) ──────────────────────────
    if record.scientific_name:
        results = label_search(record.scientific_name)
        # Pick the first result whose label exactly matches (case-insensitive)
        sci_lower = record.scientific_name.lower()
        for item in results:
            label = item.get("label", "").lower()
            desc = item.get("description", "").lower()
            # Accept if label matches AND description suggests a taxon/plant
            if label == sci_lower or sci_lower.startswith(label):
                qid = item["id"]
                log(f"  [Wikidata] matched '{item['label']}' → {qid} ({item.get('description','')})", 1)
                cat, p18 = get_p18_and_category(qid)
                if cat or p18:
                    return qid, cat, p18
        # Fuzzy fallback: take top result if it mentions plant/taxon/cultivar
        for item in results[:3]:
            desc = item.get("description", "").lower()
            if any(w in desc for w in ("taxon", "plant", "cultivar", "variety", "species", "crop", "fruit")):
                qid = item["id"]
                log(f"  [Wikidata] fuzzy match '{item['label']}' → {qid} ({item.get('description','')})", 1)
                cat, p18 = get_p18_and_category(qid)
                if cat or p18:
                    return qid, cat, p18

    # ── Try variety name ──────────────────────────────────────────────────
    variety_clean = re.sub(r"\([^)]*\)", "", record.variety_name).strip()
    if variety_clean:
        results = label_search(f"{variety_clean} {record.common_name}")
        for item in results[:5]:
            desc = item.get("description", "").lower()
            if any(w in desc for w in ("taxon", "plant", "cultivar", "variety", "species", "crop", "fruit")):
                qid = item["id"]
                log(f"  [Wikidata] variety match '{item['label']}' → {qid}", 1)
                cat, p18 = get_p18_and_category(qid)
                if cat or p18:
                    return qid, cat, p18

    # ── Try common name ───────────────────────────────────────────────────
    results = label_search(record.common_name)
    for item in results[:5]:
        desc = item.get("description", "").lower()
        if any(w in desc for w in ("taxon", "plant", "cultivar", "variety", "species", "crop", "fruit")):
            qid = item["id"]
            log(f"  [Wikidata] common-name match '{item['label']}' → {qid}", 1)
            cat, p18 = get_p18_and_category(qid)
            if cat or p18:
                return qid, cat, p18

    return "", "", []


def _source_wikidata_p18(record: VarietyRecord) -> tuple[list[ImageCandidate], str]:
    """
    Pull the P18 image(s) for the exact Wikidata entity.
    Also returns the Commons category name so caller can use it next.
    """
    log(f"  [Wikidata P18] looking up '{record.scientific_name or record.variety_name}'", 1)
    qid, commons_cat, p18_files = _wikidata_lookup(record)
    if not qid:
        log("  [Wikidata P18] no QID found", 1)
        return [], ""

    candidates: list[ImageCandidate] = []
    for fname in p18_files[:3]:
        c = _file_title_to_candidate(
            fname,
            source_url=f"https://www.wikidata.org/wiki/{qid}",
            source_name="wikidata_p18",
        )
        if c:
            log(f"  [Wikidata P18] found: {fname}", 1)
            candidates.append(c)
        time.sleep(0.2)

    return candidates, commons_cat


# ---------------------------------------------------------------------------
# Source 2 – Wikimedia Commons category crawl
# ---------------------------------------------------------------------------


def _commons_category_members(category: str, limit: int) -> list[ImageCandidate]:
    """
    List files inside a Wikimedia Commons category and fetch their metadata.
    `category` is the raw category name without the 'Category:' prefix.
    """
    candidates: list[ImageCandidate] = []
    cmtitle = category if category.startswith("Category:") else f"Category:{category}"
    try:
        data = http_json(
            COMMONS_API_URL,
            {
                "action": "query",
                "format": "json",
                "list": "categorymembers",
                "cmtitle": cmtitle,
                "cmtype": "file",
                "cmlimit": min(limit * 3, 30),  # fetch extra, filtering will reduce
                "cmprop": "title",
            },
        )
    except Exception as exc:
        log(f"  [Commons cat] error listing '{category}': {exc}", 1)
        return []

    members = data.get("query", {}).get("categorymembers", [])
    log(f"  [Commons cat] '{category}' → {len(members)} file(s)", 1)

    for member in members:
        title = member.get("title", "")
        if not title:
            continue
        # Skip obvious non-photo files early (SVG, OGG, PDF, etc.)
        ext = title.rsplit(".", 1)[-1].lower()
        if ext in ("svg", "ogg", "ogv", "webm", "pdf", "tif", "tiff"):
            continue
        c = _file_title_to_candidate(
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


def _source_commons_category(
    commons_cat: str, record: VarietyRecord, limit: int
) -> list[ImageCandidate]:
    """
    Try the exact Commons category from Wikidata, then also derive plausible
    Commons category names from scientific / variety / common names.
    """
    if not commons_cat:
        # Derive candidate category names
        sci = record.scientific_name or ""
        variety_clean = re.sub(r"\([^)]*\)", "", record.variety_name).strip()
        commons_cat_candidates = []
        if sci:
            commons_cat_candidates.append(sci)  # e.g. "Mangifera indica"
        if variety_clean:
            commons_cat_candidates.append(variety_clean)
            if sci:
                commons_cat_candidates.append(f"{sci} {variety_clean}")
        commons_cat_candidates.append(record.common_name)
        # Try each derived name
        for cat in commons_cat_candidates:
            results = _commons_category_members(cat, limit)
            if results:
                return results
        return []
    else:
        return _commons_category_members(commons_cat, limit)


# ---------------------------------------------------------------------------
# Source 3 – Wikimedia Commons full-text search (File: namespace)
# ---------------------------------------------------------------------------


def _build_commons_queries(record: VarietyRecord) -> list[str]:
    """
    Build a list of Commons search queries, most-specific first.
    Each query targets the File: namespace and uses exact species/variety terms.
    """
    sci = record.scientific_name or ""
    variety = re.sub(r"\([^)]*\)", "", record.variety_name).strip()
    common = record.common_name
    cat = (record.category_name or "").lower()

    # Pick a type hint
    hint = next(
        (v for k, v in CROP_TYPE_HINTS.items() if k in cat),
        "plant crop",
    )

    queries: list[str] = []

    # 1. Scientific name is the most specific anchor
    if sci:
        queries.append(sci)
        queries.append(f"{sci} {hint}")
    # 2. Variety + common name
    if variety:
        queries.append(f"{variety} {common}")
        if sci:
            queries.append(f"{sci} {variety}")
    # 3. Common name + type hint
    queries.append(f"{common} {hint}")
    queries.append(common)

    # Deduplicate preserving order
    seen: set[str] = set()
    result: list[str] = []
    for q in queries:
        q = q.strip()
        if q.lower() not in seen:
            seen.add(q.lower())
            result.append(q)
    return result


def _commons_fulltext_search(query: str, limit: int) -> list[ImageCandidate]:
    """Search Wikimedia Commons File: namespace using the MediaWiki search API."""
    candidates: list[ImageCandidate] = []
    try:
        data = http_json(
            COMMONS_API_URL,
            {
                "action": "query",
                "format": "json",
                "list": "search",
                "srnamespace": 6,          # File namespace only
                "srsearch": f"{query} filetype:bitmap",
                "srlimit": min(limit * 2, 20),
                "srqiprofile": "classic",  # more predictable ranking
            },
        )
    except Exception as exc:
        log(f"  [Commons search] error: {exc}", 1)
        return []

    for item in data.get("query", {}).get("search", []):
        title = item.get("title", "")
        if not title:
            continue
        ext = title.rsplit(".", 1)[-1].lower()
        if ext in ("svg", "ogg", "ogv", "webm", "pdf"):
            continue
        c = _file_title_to_candidate(
            title,
            source_url=f"https://commons.wikimedia.org/wiki/{quote(title.replace(' ', '_'))}",
            source_name="commons_search",
        )
        if c:
            candidates.append(c)
        time.sleep(0.15)
    return candidates


def _source_commons_search(record: VarietyRecord, limit: int) -> list[ImageCandidate]:
    all_candidates: list[ImageCandidate] = []
    for query in _build_commons_queries(record):
        log(f"  [Commons search] query: '{query}'", 1)
        results = _commons_fulltext_search(query, limit - len(all_candidates) + 5)
        log(f"  [Commons search] {len(results)} result(s)", 1)
        all_candidates.extend(results)
        if len(all_candidates) >= limit * 2:
            break
        time.sleep(0.3)
    return all_candidates


# ---------------------------------------------------------------------------
# Source 4 – Google Programmable Search Engine (fallback)
# ---------------------------------------------------------------------------


def _source_google(record: VarietyRecord, limit: int) -> list[ImageCandidate]:
    api_key = os.environ.get("GOOGLE_PSE_API_KEY", "").strip()
    cx = os.environ.get("GOOGLE_PSE_CX", "").strip()
    if not api_key or not cx:
        return []

    sci = record.scientific_name or ""
    variety = re.sub(r"\([^)]*\)", "", record.variety_name).strip()
    common = record.common_name
    cat = (record.category_name or "").lower()
    hint = next((v for k, v in CROP_TYPE_HINTS.items() if k in cat), "plant")

    queries = []
    if sci:
        queries.append(f'"{sci}" {hint}')
    if variety:
        queries.append(f'"{variety}" {common} {hint}')
    queries.append(f"{common} {hint}")

    neg = "-logo -icon -cartoon -recipe -price -advertisement"

    candidates: list[ImageCandidate] = []
    for query in queries:
        if len(candidates) >= limit:
            break
        full_query = f"{query} {neg}"
        log(f"  [Google PSE] query: '{full_query}'", 1)
        try:
            data = http_json(
                "https://www.googleapis.com/customsearch/v1",
                {
                    "key": api_key,
                    "cx": cx,
                    "q": full_query,
                    "searchType": "image",
                    "num": min(limit - len(candidates), 10),
                    "imgType": "photo",
                    "safe": "active",
                    "imgSize": "large",
                },
            )
        except Exception as exc:
            log(f"  [Google PSE] error: {exc}", 1)
            continue

        for item in data.get("items", []):
            image = item.get("image", {})
            candidates.append(
                ImageCandidate(
                    title=item.get("title", ""),
                    source_url=image.get("contextLink", ""),
                    file_url=item.get("link", ""),
                    thumb_url=image.get("thumbnailLink", ""),
                    mime_type=item.get("mime", "image/jpeg"),
                    width=image.get("width", 0),
                    height=image.get("height", 0),
                    license_name="Unknown (Google Search)",
                    artist="",
                    credit="",
                    source_name="google",
                )
            )
        time.sleep(0.5)

    return candidates


# ---------------------------------------------------------------------------
# Source 5 – Bing / icrawler (last resort)
# ---------------------------------------------------------------------------


def _source_bing(record: VarietyRecord, limit: int) -> list[ImageCandidate]:
    try:
        import logging
        import tempfile
        import glob
        import pathlib
        from icrawler.builtin import BingImageCrawler
    except ImportError:
        log("  [Bing] icrawler not installed — skipping.", 1)
        return []

    sci = record.scientific_name or ""
    common = record.common_name
    variety = re.sub(r"\([^)]*\)", "", record.variety_name).strip()
    query = f'"{sci or variety}" {common} plant' if (sci or variety) else common

    log(f"  [Bing] query: '{query}' (last-resort fallback)", 1)
    candidates: list[ImageCandidate] = []
    temp_dir = tempfile.mkdtemp(prefix="bing_images_")
    try:
        crawler = BingImageCrawler(
            storage={"root_dir": temp_dir},
            log_level=logging.ERROR,
        )
        crawler.crawl(keyword=query, max_num=limit + 5)
        for f in glob.glob(os.path.join(temp_dir, "*")):
            local_uri = pathlib.Path(f).absolute().as_uri()
            candidates.append(
                ImageCandidate(
                    title="Unknown Image (Bing Scraper)",
                    source_url="",
                    file_url=local_uri,
                    thumb_url="",
                    mime_type="image/jpeg",
                    width=800,
                    height=600,
                    license_name="Unknown (Bing Search)",
                    artist="",
                    credit="",
                    source_name="bing",
                )
            )
    except Exception as exc:
        log(f"  [Bing] error: {exc}", 1)
    return candidates


# ---------------------------------------------------------------------------
# Candidate pipeline: collect → filter → score → rank
# ---------------------------------------------------------------------------


def find_candidates(
    record: VarietyRecord,
    count: int,
    min_width: int,
) -> tuple[list[ImageCandidate], list[tuple[ImageCandidate, str]]]:
    """
    Run the full source cascade and return (accepted, rejected_with_reasons).
    """
    seen_urls: set[str] = set()
    accepted: list[ImageCandidate] = []
    rejected: list[tuple[ImageCandidate, str]] = []

    def evaluate(raw: list[ImageCandidate]) -> None:
        for c in raw:
            if len(accepted) >= count:
                return
            if not c.file_url:
                rejected.append((c, "empty file_url"))
                continue
            if c.file_url in seen_urls:
                rejected.append((c, "duplicate URL"))
                continue
            seen_urls.add(c.file_url)

            # Caller's min-width override (hard floor)
            if 0 < c.width < min_width:
                rejected.append((c, f"width {c.width} < min_width {min_width}"))
                continue

            score, reason = score_candidate(c, record)
            c.relevance_score = score
            if reason:
                c.rejection_reason = reason
                rejected.append((c, reason))
            elif score < MIN_RELEVANCE_SCORE:
                c.rejection_reason = f"low score ({score})"
                rejected.append((c, f"low relevance score ({score})"))
            else:
                log(
                    f"  ✓ accepted [{c.source_name}] score={score} "
                    f"{c.width}×{c.height}  {c.file_url[:80]}",
                    1,
                )
                accepted.append(c)

    # ── Source 1: Wikidata P18 ────────────────────────────────────────────
    p18_results, commons_cat = _source_wikidata_p18(record)
    log(f"  [Wikidata P18] {len(p18_results)} image(s), Commons cat: '{commons_cat}'", 1)
    evaluate(p18_results)

    # ── Source 2: Commons category ────────────────────────────────────────
    if len(accepted) < count:
        cat_results = _source_commons_category(commons_cat, record, count * 3)
        log(f"  [Commons cat] {len(cat_results)} image(s) fetched", 1)
        evaluate(cat_results)

    # ── Source 3: Commons full-text search ───────────────────────────────
    if len(accepted) < count:
        search_results = _source_commons_search(record, count * 3)
        log(f"  [Commons search] {len(search_results)} image(s) fetched", 1)
        evaluate(search_results)

    # ── Source 4: Google PSE ──────────────────────────────────────────────
    if len(accepted) < count:
        google_results = _source_google(record, (count - len(accepted)) + 5)
        log(f"  [Google PSE] {len(google_results)} image(s) fetched", 1)
        evaluate(google_results)

    # ── Source 5: Bing / icrawler (last resort) ───────────────────────────
    if len(accepted) < count:
        bing_results = _source_bing(record, (count - len(accepted)) + 5)
        log(f"  [Bing] {len(bing_results)} image(s) fetched", 1)
        evaluate(bing_results)

    # Log rejections
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
# Cloudflare R2 upload (unchanged from v2)
# ---------------------------------------------------------------------------


def r2_client() -> Any:
    try:
        import boto3
    except ImportError as exc:
        raise SystemExit("boto3 not installed. Run: pip install boto3") from exc

    endpoint = os.environ.get("R2_ENDPOINT_URL", "").strip()
    key_id = os.environ.get("R2_ACCESS_KEY_ID", "").strip()
    secret = os.environ.get("R2_SECRET_ACCESS_KEY", "").strip()
    missing = [n for n, v in {"R2_ENDPOINT_URL": endpoint, "R2_ACCESS_KEY_ID": key_id,
                               "R2_SECRET_ACCESS_KEY": secret}.items() if not v]
    if missing:
        raise SystemExit(f"Missing env vars: {', '.join(missing)}")

    import boto3
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=key_id,
        aws_secret_access_key=secret,
        region_name=os.environ.get("R2_REGION", "auto"),
    )


def public_url_for_key(key: str) -> str:
    base = os.environ.get("R2_PUBLIC_BASE_URL", "").strip().rstrip("/")
    if not base:
        raise SystemExit("Missing R2_PUBLIC_BASE_URL in .env/environment.")
    encoded = "/".join(quote(p) for p in key.split("/"))
    return f"{base}/{encoded}"


def upload_to_r2(
    client: Any,
    bucket: str,
    key: str,
    image_path: Path,
    mime_type: str,
    metadata: dict[str, str],
) -> str:
    client.upload_file(
        str(image_path),
        bucket,
        key,
        ExtraArgs={
            "ContentType": mime_type,
            "Metadata": {k: v[:1024] for k, v in metadata.items() if v},
        },
    )
    return public_url_for_key(key)


# ---------------------------------------------------------------------------
# SQLite helpers (unchanged from v2)
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
    limit_sql = "LIMIT ?" if limit else ""
    if limit:
        params.append(limit)
    sql = f"""
        SELECT
            cv.id,
            cv.subtype_id,
            cv.variety_name,
            c.common_name,
            COALESCE(c.scientific_name, '') AS scientific_name,
            COALESCE(cc.name, c.category, '') AS category_name,
            COALESCE(cv.image_url, '') AS current_image_url,
            COALESCE(cv.image_link, '') AS current_image_link
        FROM crop_variety cv
        JOIN crop c ON c.id = cv.crop_id
        LEFT JOIN crop_category cc ON cc.id = c.category_id
        WHERE {' AND '.join(where)}
        ORDER BY cv.subtype_id
        {limit_sql}
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
            """UPDATE crop_variety
               SET image_url = ?, image_link = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ?""",
            (json.dumps(urls, ensure_ascii=False), urls[0], variety_id),
        )
        conn.commit()


# ---------------------------------------------------------------------------
# Manifest (review mode)
# ---------------------------------------------------------------------------

MANIFEST_FILENAME = "review_manifest.json"


def load_manifest(review_dir: Path) -> list[dict[str, Any]]:
    path = review_dir / MANIFEST_FILENAME
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def save_manifest(review_dir: Path, entries: list[dict[str, Any]]) -> None:
    review_dir.mkdir(parents=True, exist_ok=True)
    path = review_dir / MANIFEST_FILENAME
    path.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8")
    csv_path = review_dir / "review_manifest.csv"
    if entries:
        with csv_path.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=list(entries[0].keys()))
            writer.writeheader()
            writer.writerows(entries)
    log(f"\n  Manifest → {path}")
    log(f"  CSV      → {csv_path}")
    log("  Set 'approved': true for images you want, then: --apply-approved")


def accepted_to_manifest_entries(
    record: VarietyRecord, accepted: list[ImageCandidate]
) -> list[dict[str, Any]]:
    return [
        {
            "variety_id": record.id,
            "subtype_id": record.subtype_id,
            "common_name": record.common_name,
            "variety_name": record.variety_name,
            "scientific_name": record.scientific_name,
            "candidate_url": c.file_url,
            "source_page": c.source_url,
            "title": c.title,
            "license": c.license_name,
            "author": c.artist,
            "width": c.width,
            "height": c.height,
            "relevance_score": c.relevance_score,
            "source_name": c.source_name,
            "mime_type": c.mime_type,
            "approved": False,
        }
        for c in accepted
    ]


# ---------------------------------------------------------------------------
# Per-record processing
# ---------------------------------------------------------------------------


def _slug_filename(record: VarietyRecord, index: int, url: str, ext: str) -> str:
    h = hashlib.sha1(url.encode()).hexdigest()[:10]
    return (
        f"subtype-{record.subtype_id:04d}"
        f"-{clean_slug(record.common_name)}"
        f"-{clean_slug(record.variety_name)}"
        f"-{index:02d}-{h}{ext}"
    )


def _write_record_manifest(
    record_dir: Path, record: VarietyRecord, rows: list[dict[str, str]]
) -> None:
    (record_dir / f"subtype-{record.subtype_id:04d}-manifest.json").write_text(
        json.dumps(
            {
                "subtype_id": record.subtype_id,
                "crop_variety_id": record.id,
                "crop": record.common_name,
                "variety": record.variety_name,
                "images": rows,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


def sync_record(
    record: VarietyRecord,
    db_path: Path,
    cache_dir: Path,
    images_per_subtype: int,
    min_width: int,
    dry_run: bool,
    review_mode: bool,
    client: Any | None,
    bucket: str,
    r2_prefix: str,
    force: bool,
) -> tuple[int, list[str], list[dict[str, Any]]]:
    log(f"\n{'─' * 64}")
    log(f"Subtype {record.subtype_id}: {record.common_name} / {record.variety_name}")
    if record.scientific_name:
        log(f"  Scientific : {record.scientific_name}", 1)
    log(f"  Category   : {record.category_name}", 1)

    accepted, rejected = find_candidates(record, images_per_subtype, min_width)

    log(f"  → accepted: {len(accepted)}  rejected: {len(rejected)}", 1)

    if not accepted:
        log("  ⚠ No suitable images found.", 1)
        return record.subtype_id, [], []

    # ── Dry run ─────────────────────────────────────────────────────────────
    if dry_run:
        for c in accepted:
            log(
                f"  dry-run [{c.source_name}] score={c.relevance_score} "
                f"{c.width}×{c.height} {c.license_name}  {c.file_url[:80]}",
                1,
            )
        return record.subtype_id, [], []

    # ── Review mode ──────────────────────────────────────────────────────────
    if review_mode:
        return record.subtype_id, [], accepted_to_manifest_entries(record, accepted)

    # ── Live mode: download → upload → DB ────────────────────────────────────
    record_dir = (
        cache_dir
        / f"subtype-{record.subtype_id:04d}"
          f"-{clean_slug(record.common_name)}"
          f"-{clean_slug(record.variety_name)}"
    )
    uploaded_urls: list[str] = []
    manifest_rows: list[dict[str, str]] = []

    for idx, c in enumerate(accepted, start=1):
        filename = _slug_filename(record, idx, c.file_url, extension_for(c))
        local_path = record_dir / filename

        if force or not local_path.exists():
            try:
                download_image(c.file_url, local_path)
            except Exception as exc:
                log(f"  ✗ download failed #{idx}: {exc}", 1)
                continue

        try:
            key = f"{r2_prefix.strip('/')}/{filename}"
            public_url = upload_to_r2(
                client, bucket, key, local_path, c.mime_type,
                {
                    "subtype_id": str(record.subtype_id),
                    "crop": record.common_name,
                    "variety": record.variety_name,
                    "source": c.source_url,
                    "license": c.license_name,
                    "artist": c.artist,
                },
            )
        except Exception as exc:
            log(f"  ✗ upload failed #{idx}: {exc}", 1)
            continue

        uploaded_urls.append(public_url)
        manifest_rows.append({
            "public_url": public_url,
            "source_url": c.source_url,
            "title": c.title,
            "license": c.license_name,
            "artist": c.artist,
            "width": str(c.width),
            "height": str(c.height),
            "score": str(c.relevance_score),
            "source_name": c.source_name,
        })
        log(f"  ✓ uploaded [{c.source_name}] → {public_url}", 1)

    if uploaded_urls:
        save_urls(db_path, record.id, uploaded_urls)
        _write_record_manifest(record_dir, record, manifest_rows)
        log(f"  ✓ saved {len(uploaded_urls)} URL(s) to DB", 1)

    return record.subtype_id, uploaded_urls, []


# ---------------------------------------------------------------------------
# Apply-approved mode
# ---------------------------------------------------------------------------


def apply_approved(
    review_dir: Path,
    db_path: Path,
    cache_dir: Path,
    client: Any,
    bucket: str,
    r2_prefix: str,
) -> None:
    entries = load_manifest(review_dir)
    if not entries:
        log("No review manifest found — nothing to apply.")
        return

    approved = [e for e in entries if e.get("approved")]
    log(f"Applying {len(approved)} approved image(s)…")
    by_variety: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for e in approved:
        by_variety[e["variety_id"]].append(e)

    total = 0
    for variety_id, items in by_variety.items():
        uploaded: list[str] = []
        common = items[0]["common_name"]
        variety = items[0]["variety_name"]
        subtype_id = items[0]["subtype_id"]
        record_dir = (
            cache_dir
            / f"subtype-{subtype_id:04d}-{clean_slug(common)}-{clean_slug(variety)}"
        )

        for idx, e in enumerate(items, start=1):
            file_url = e["candidate_url"]
            mime = e.get("mime_type", "image/jpeg")
            ext = SUPPORTED_MIME_TYPES.get(mime, ".jpg")
            filename = (
                f"subtype-{subtype_id:04d}"
                f"-{clean_slug(common)}-{clean_slug(variety)}"
                f"-{idx:02d}-{hashlib.sha1(file_url.encode()).hexdigest()[:10]}{ext}"
            )
            local_path = record_dir / filename
            if not local_path.exists():
                try:
                    download_image(file_url, local_path)
                except Exception as exc:
                    log(f"  ✗ re-download failed: {exc}", 1)
                    continue
            try:
                key = f"{r2_prefix.strip('/')}/{filename}"
                pub = upload_to_r2(
                    client, bucket, key, local_path, mime,
                    {"subtype_id": str(subtype_id), "crop": common, "variety": variety,
                     "source": e.get("source_page", ""), "license": e.get("license", ""),
                     "artist": e.get("author", "")},
                )
                uploaded.append(pub)
                log(f"  ✓ {pub}", 1)
                total += 1
            except Exception as exc:
                log(f"  ✗ upload failed: {exc}", 1)

        if uploaded:
            save_urls(db_path, variety_id, uploaded)
            log(f"  ✓ DB updated for variety_id={variety_id}", 1)

    log(f"\nDone. Uploaded {total} approved image(s).")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Sync crop variety images: Wikimedia-first, scored, to R2 + SQLite."
    )
    p.add_argument("--db", default=str(DEFAULT_DB_PATH))
    p.add_argument("--cache-dir", default=str(DEFAULT_CACHE_DIR))
    p.add_argument("--review-dir", default=str(DEFAULT_REVIEW_DIR))
    p.add_argument("--images-per-subtype", type=int, default=5)
    p.add_argument("--min-width", type=int, default=600, help="Minimum image width in pixels.")
    p.add_argument("--subtype-id", type=int, action="append")
    p.add_argument("--limit-varieties", type=int)
    p.add_argument("--force", action="store_true")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--review", action="store_true",
                   help="Write candidates to review manifest; do not upload.")
    p.add_argument("--apply-approved", action="store_true",
                   help="Upload manifest entries with approved=true, then update DB.")
    return p.parse_args()


def main() -> None:
    args = parse_args()
    images_per_subtype = max(1, min(args.images_per_subtype, 10))
    db_path = Path(args.db).resolve()
    cache_dir = Path(args.cache_dir).resolve()
    review_dir = Path(args.review_dir).resolve()
    load_dotenv(ROOT / ".env")

    bucket = os.environ.get("R2_BUCKET", "").strip()
    r2_prefix = os.environ.get("R2_PREFIX", "crop-varieties").strip() or "crop-varieties"
    client: Any | None = None

    if args.apply_approved:
        if not bucket:
            raise SystemExit("Missing R2_BUCKET.")
        apply_approved(review_dir, db_path, cache_dir, r2_client(), bucket, r2_prefix)
        return

    if not args.dry_run and not args.review:
        if not bucket:
            raise SystemExit("Missing R2_BUCKET.")
        client = r2_client()

    records = fetch_varieties(db_path, args.subtype_id, args.limit_varieties, args.force)
    if not records:
        log("No crop variety rows need image sync.")
        return

    mode = "DRY-RUN" if args.dry_run else ("REVIEW" if args.review else "LIVE")
    log(f"\n{'=' * 64}")
    log(f"GreenWings Image Sync  [{mode}]")
    log(f"  Records     : {len(records)}")
    log(f"  Images/sub  : {images_per_subtype}")
    log(f"  Min width   : {args.min_width}px")
    log(f"  Min score   : {MIN_RELEVANCE_SCORE}")
    log(f"{'=' * 64}")

    total_uploaded = 0
    all_review_entries: list[dict[str, Any]] = []

    for record in records:
        _, urls, review_entries = sync_record(
            record=record,
            db_path=db_path,
            cache_dir=cache_dir,
            images_per_subtype=images_per_subtype,
            min_width=args.min_width,
            dry_run=args.dry_run,
            review_mode=args.review,
            client=client,
            bucket=bucket,
            r2_prefix=r2_prefix,
            force=args.force,
        )
        total_uploaded += len(urls)
        all_review_entries.extend(review_entries)

    if args.review and all_review_entries:
        existing = load_manifest(review_dir)
        seen = {e["candidate_url"] for e in existing}
        new = [e for e in all_review_entries if e["candidate_url"] not in seen]
        save_manifest(review_dir, existing + new)
    elif not args.dry_run and not args.review:
        log(f"\n{'=' * 64}")
        log(f"Done. Uploaded {total_uploaded} image(s) total.")


if __name__ == "__main__":
    main()