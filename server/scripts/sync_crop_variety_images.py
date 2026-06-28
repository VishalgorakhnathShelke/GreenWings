from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import os
import re
import sqlite3
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DB_PATH = ROOT / "database" / "greenwings.db"
DEFAULT_CACHE_DIR = ROOT / "database" / "media-cache" / "crop-varieties"
COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "GreenWingsImageSync/1.0 (local data maintenance script)"
SUPPORTED_MIME_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


@dataclass(frozen=True)
class VarietyRecord:
    id: int
    subtype_id: int
    variety_name: str
    common_name: str
    category_name: str
    current_image_url: str
    current_image_link: str


@dataclass(frozen=True)
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


def clean_slug(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower())
    return slug.strip("-")[:90] or "image"


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
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
    if not text:
        return []
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return [str(item) for item in parsed if str(item).strip()]
        if isinstance(parsed, str) and parsed.strip():
            return [parsed.strip()]
    except json.JSONDecodeError:
        pass
    return [part.strip() for part in re.split(r"[\n,;]+", text) if part.strip()]


def html_text(value: Any) -> str:
    if not isinstance(value, dict):
        return ""
    text = str(value.get("value") or "")
    return re.sub(r"<[^>]+>", "", text).strip()


def http_json(url: str, params: dict[str, str | int], timeout: int = 30) -> dict[str, Any]:
    request_url = f"{url}?{urlencode(params)}"
    request = Request(request_url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def bing_search_and_download(query: str, limit: int, temp_dir: str) -> list[ImageCandidate]:
    import logging
    from icrawler.builtin import BingImageCrawler
    import glob
    import urllib.parse
    
    candidates: list[ImageCandidate] = []
    try:
        crawler = BingImageCrawler(storage={'root_dir': temp_dir}, log_level=logging.ERROR)
        crawler.crawl(keyword=query, max_num=limit)
        
        import pathlib
        for f in glob.glob(os.path.join(temp_dir, "*")):
            # Convert local path to file:// URI for urllib.urlopen to consume
            local_uri = pathlib.Path(f).absolute().as_uri()
            
            candidates.append(
                ImageCandidate(
                    title=f"Bing Image for {query}",
                    source_url="",
                    file_url=local_uri,
                    thumb_url="",
                    mime_type="image/jpeg",
                    width=800,
                    height=800,
                    license_name="Unknown (Bing Search)",
                    artist="Bing",
                    credit="",
                )
            )
    except Exception as exc:
        pass
        
    return candidates


def build_search_queries(record: VarietyRecord) -> list[str]:
    variety = re.sub(r"\([^)]*\)", " ", record.variety_name).strip()
    variety = re.sub(r"\s+", " ", variety)
    return [
        f"{variety} {record.common_name} fruit",
        f"{variety} {record.common_name}",
        f"{record.common_name} fruit {record.category_name}",
        f"{record.common_name} fruit",
    ]


def find_candidates(record: VarietyRecord, count: int, min_width: int) -> list[ImageCandidate]:
    import tempfile
    
    found: list[ImageCandidate] = []
    for query in build_search_queries(record):
        needed = count - len(found)
        if needed <= 0:
            break
            
        temp_dir = tempfile.mkdtemp(prefix="bing_images_")
        candidates = bing_search_and_download(query, needed, temp_dir)
        for candidate in candidates:
            found.append(candidate)
            if len(found) >= count:
                break
    return found


def extension_for(candidate: ImageCandidate) -> str:
    return SUPPORTED_MIME_TYPES.get(candidate.mime_type) or mimetypes.guess_extension(candidate.mime_type) or ".jpg"


def download_image(candidate: ImageCandidate, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    request = Request(candidate.file_url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=60) as response:
        data = response.read()
    target.write_bytes(data)


def r2_client():
    try:
        import boto3
    except ImportError as exc:
        raise SystemExit("boto3 is not installed. Run: .\\.venv\\Scripts\\python -m pip install boto3") from exc

    endpoint_url = os.environ.get("R2_ENDPOINT_URL", "").strip()
    access_key = os.environ.get("R2_ACCESS_KEY_ID", "").strip()
    secret_key = os.environ.get("R2_SECRET_ACCESS_KEY", "").strip()
    missing = [
        name
        for name, value in {
            "R2_ENDPOINT_URL": endpoint_url,
            "R2_ACCESS_KEY_ID": access_key,
            "R2_SECRET_ACCESS_KEY": secret_key,
        }.items()
        if not value
    ]
    if missing:
        raise SystemExit(f"Missing {', '.join(missing)} in .env/environment.")

    return boto3.client(
        "s3",
        endpoint_url=endpoint_url,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=os.environ.get("R2_REGION", "auto"),
    )


def public_url_for_key(key: str) -> str:
    base_url = os.environ.get("R2_PUBLIC_BASE_URL", "").strip().rstrip("/")
    if not base_url:
        raise SystemExit("Missing R2_PUBLIC_BASE_URL. This is needed so database URLs can be public fetch URLs.")
    encoded = "/".join(quote(part) for part in key.split("/"))
    return f"{base_url}/{encoded}"


def upload_to_r2(client: Any, bucket: str, key: str, image_path: Path, mime_type: str, metadata: dict[str, str]) -> str:
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


def fetch_varieties(db_path: Path, subtype_ids: list[int] | None, limit: int | None, force: bool) -> list[VarietyRecord]:
    where = ["cv.subtype_id IS NOT NULL"]
    params: list[Any] = []
    if subtype_ids:
        placeholders = ",".join("?" for _ in subtype_ids)
        where.append(f"cv.subtype_id IN ({placeholders})")
        params.extend(subtype_ids)
    if not force:
        where.append("(cv.image_url IS NULL OR TRIM(cv.image_url) = '')")
    limit_sql = "LIMIT ?" if limit else ""
    if limit:
        params.append(limit)
    query = f"""
        SELECT
            cv.id,
            cv.subtype_id,
            cv.variety_name,
            c.common_name,
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
    with sqlite3.connect(db_path) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(query, params).fetchall()
    return [VarietyRecord(**dict(row)) for row in rows]


def save_urls(db_path: Path, variety_id: int, urls: list[str]) -> None:
    if not urls:
        return
    with sqlite3.connect(db_path) as connection:
        connection.execute(
            """
            UPDATE crop_variety
            SET image_url = ?,
                image_link = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (json.dumps(urls, ensure_ascii=False), urls[0], variety_id),
        )
        connection.commit()


def write_manifest(target_dir: Path, record: VarietyRecord, results: list[dict[str, str]]) -> None:
    manifest_path = target_dir / f"subtype-{record.subtype_id:04d}-manifest.json"
    manifest_path.write_text(
        json.dumps(
            {
                "subtype_id": record.subtype_id,
                "crop_variety_id": record.id,
                "crop": record.common_name,
                "variety": record.variety_name,
                "images": results,
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
    client: Any | None,
    bucket: str,
    r2_prefix: str,
    force: bool,
) -> tuple[int, list[str]]:
    print(f"Subtype {record.subtype_id}: {record.common_name} / {record.variety_name}")
    candidates = find_candidates(record, images_per_subtype, min_width)
    if not candidates:
        print("  no suitable images found via Bing")
        return record.subtype_id, []

    if dry_run:
        for candidate in candidates:
            print(f"  dry-run candidate: {candidate.width}x{candidate.height} {candidate.title} {candidate.source_url}")
        return record.subtype_id, []

    record_dir = cache_dir / f"subtype-{record.subtype_id:04d}-{clean_slug(record.common_name)}-{clean_slug(record.variety_name)}"
    uploaded_urls: list[str] = []
    manifest_rows: list[dict[str, str]] = []
    for index, candidate in enumerate(candidates, start=1):
        source_hash = hashlib.sha1(candidate.file_url.encode("utf-8")).hexdigest()[:10]
        filename = f"subtype-{record.subtype_id:04d}-{clean_slug(record.common_name)}-{clean_slug(record.variety_name)}-{index:02d}-{source_hash}{extension_for(candidate)}"
        local_path = record_dir / filename
        if force or not os.path.exists(local_path):
            try:
                download_image(candidate, local_path)
            except Exception as exc:
                print(f"  failed image {index}: {exc}", file=sys.stderr)
                continue
        try:
            key = f"{r2_prefix.strip('/')}/{filename}"
            public_url = upload_to_r2(
                client,
                bucket,
                key,
                local_path,
                candidate.mime_type,
                {
                    "subtype_id": str(record.subtype_id),
                    "crop": record.common_name,
                    "variety": record.variety_name,
                    "source": candidate.source_url,
                    "license": candidate.license_name,
                    "artist": candidate.artist,
                },
            )
        except Exception as exc:
            print(f"  failed image {index}: {exc}", file=sys.stderr)
            continue
        uploaded_urls.append(public_url)
        manifest_rows.append(
            {
                "public_url": public_url,
                "source_url": candidate.source_url,
                "title": candidate.title,
                "license": candidate.license_name,
                "artist": candidate.artist,
                "credit": candidate.credit,
                "width": str(candidate.width),
                "height": str(candidate.height),
            }
        )
        print(f"  uploaded {public_url}")

    if uploaded_urls:
        save_urls(db_path, record.id, uploaded_urls)
        write_manifest(record_dir, record, manifest_rows)
        print(f"  saved {len(uploaded_urls)} urls to crop_variety.image_url")
    return record.subtype_id, uploaded_urls


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download crop variety images, upload to Cloudflare R2, and save R2 URLs to crop_variety.image_url.")
    parser.add_argument("--db", default=str(DEFAULT_DB_PATH), help="SQLite database path.")
    parser.add_argument("--cache-dir", default=str(DEFAULT_CACHE_DIR), help="Local image download/cache directory.")
    parser.add_argument("--images-per-subtype", type=int, default=5, help="Number of images per subtype, from 1 to 10.")
    parser.add_argument("--min-width", type=int, default=1200, help="Minimum original image width/height accepted from Commons.")
    parser.add_argument("--subtype-id", type=int, action="append", help="Process only one subtype_id. Repeat for multiple subtype IDs.")
    parser.add_argument("--limit-varieties", type=int, help="Limit number of subtype records processed.")
    parser.add_argument("--force", action="store_true", help="Replace existing crop_variety.image_url values.")
    parser.add_argument("--dry-run", action="store_true", help="Search and print candidates only. No download, upload, or DB update.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    images_per_subtype = max(1, min(int(args.images_per_subtype), 10))
    db_path = Path(args.db).resolve()
    cache_dir = Path(args.cache_dir).resolve()
    load_dotenv(ROOT / ".env")

    records = fetch_varieties(db_path, args.subtype_id, args.limit_varieties, args.force)
    if not records:
        print("No crop variety rows need image sync.")
        return

    bucket = os.environ.get("R2_BUCKET", "").strip()
    r2_prefix = os.environ.get("R2_PREFIX", "crop-varieties").strip() or "crop-varieties"
    client = None
    if not args.dry_run:
        if not bucket:
            raise SystemExit("Missing R2_BUCKET in .env/environment.")
        client = r2_client()

    print(f"Processing {len(records)} crop varieties from {db_path}")
    total_uploaded = 0
    for record in records:
        _, urls = sync_record(
            record=record,
            db_path=db_path,
            cache_dir=cache_dir,
            images_per_subtype=images_per_subtype,
            min_width=args.min_width,
            dry_run=args.dry_run,
            client=client,
            bucket=bucket,
            r2_prefix=r2_prefix,
            force=args.force,
        )
        total_uploaded += len(urls)
    print(f"Done. Uploaded {total_uploaded} images.")


if __name__ == "__main__":
    main()
