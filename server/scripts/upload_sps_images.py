import os
import re
import json
import sqlite3
import argparse
from pathlib import Path
from typing import Any
from urllib.parse import quote
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent.parent
DB_PATH = ROOT / "database" / "greenwings.db"
PHOTOS_DIR = ROOT / "database" / "sps" / "photos"

def clean_slug(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

def normalize_name(s: str) -> str:
    # Remove all non-alphanumeric and make lowercase for easy matching
    return re.sub(r"[^a-z0-9]", "", s.lower())

def r2_client() -> Any:
    try:
        import boto3
    except ImportError as exc:
        raise SystemExit("boto3 not installed. Run: pip install boto3") from exc
    ep  = os.environ.get("R2_ENDPOINT_URL", "").strip()
    kid = os.environ.get("R2_ACCESS_KEY_ID", "").strip()
    sec = os.environ.get("R2_SECRET_ACCESS_KEY", "").strip()
    missing = [n for n, v in {"R2_ENDPOINT_URL": ep, "R2_ACCESS_KEY_ID": kid, "R2_SECRET_ACCESS_KEY": sec}.items() if not v]
    if missing:
        raise SystemExit(f"Missing env vars: {', '.join(missing)}")
    
    return boto3.client(
        "s3", 
        endpoint_url=ep, 
        aws_access_key_id=kid,
        aws_secret_access_key=sec, 
        region_name=os.environ.get("R2_REGION","auto")
    )

def public_url_for_key(key: str) -> str:
    base = os.environ.get("R2_PUBLIC_BASE_URL", "").strip().rstrip("/")
    if not base:
        raise SystemExit("Missing R2_PUBLIC_BASE_URL")
    return f"{base}/{'/'.join(quote(p) for p in key.split('/'))}"

def upload_to_r2(client: Any, bucket: str, key: str, path: Path) -> str:
    # Guess mime type based on extension
    ext = path.suffix.lower()
    mime = "image/jpeg"
    if ext == ".png": mime = "image/png"
    elif ext == ".webp": mime = "image/webp"
    
    client.upload_file(str(path), bucket, key, ExtraArgs={
        "ContentType": mime,
    })
    return public_url_for_key(key)

def main():
    load_dotenv(ROOT / ".env")
    
    bucket = os.environ.get("R2_BUCKET", "").strip()
    if not bucket:
        raise SystemExit("Missing R2_BUCKET env var.")
    
    r2_prefix = os.environ.get("R2_PREFIX", "crop-varieties").strip() or "crop-varieties"
    
    client = r2_client()
    print(f"Connected to R2, bucket: {bucket}")
    
    # 1. Fetch all varieties from DB
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("""
            SELECT cv.id, cv.subtype_id, cv.variety_name, c.common_name
            FROM crop_variety cv
            JOIN crop c ON c.id = cv.crop_id
            WHERE cv.subtype_id IS NOT NULL
        """).fetchall()
        
    varieties = [dict(r) for r in rows]
    print(f"Loaded {len(varieties)} varieties from database.")
    
    # 2. Iterate through SPS downloaded photos
    if not PHOTOS_DIR.exists():
        raise SystemExit(f"Directory not found: {PHOTOS_DIR}")
    
    for folder in PHOTOS_DIR.iterdir():
        if not folder.is_dir():
            continue
            
        folder_name = folder.name
        # Match logic: we expect folder name to be roughly CropName_VarietyName
        norm_folder = normalize_name(folder_name)
        
        matched_row = None
        for v in varieties:
            # Construct possible expected names
            crop_var1 = f"{v['common_name']}_{v['variety_name']}"
            if normalize_name(crop_var1) == norm_folder:
                matched_row = v
                break
                
            crop_var2 = f"{v['common_name']}{v['variety_name']}"
            if normalize_name(crop_var2) == norm_folder:
                matched_row = v
                break
                
        if not matched_row:
            print(f"WARNING: Could not match folder '{folder_name}' to any database variety.")
            continue
            
        print(f"\nProcessing '{folder_name}' -> Matched Subtype {matched_row['subtype_id']} ({matched_row['common_name']} / {matched_row['variety_name']})")
        
        # Get all images in this folder
        image_files = [f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp')]
        if not image_files:
            print("  No images found.")
            continue
            
        # Sort images so we have a deterministic order
        image_files.sort()
        
        urls = []
        for idx, img_path in enumerate(image_files, start=1):
            sid = matched_row["subtype_id"]
            common_slug = clean_slug(matched_row["common_name"])
            variety_slug = clean_slug(matched_row["variety_name"])
            
            # Use original filename or a clean one
            # e.g. crop-varieties/subtype-0001-mango-alphonso/image_1.jpg
            filename = f"image_{idx:02d}{img_path.suffix.lower()}"
            key = f"{r2_prefix.strip('/')}/subtype-{sid:04d}-{common_slug}-{variety_slug}/{filename}"
            
            print(f"  Uploading {img_path.name} to {key} ...")
            try:
                pub_url = upload_to_r2(client, bucket, key, img_path)
                urls.append(pub_url)
                print(f"    -> {pub_url}")
            except Exception as e:
                print(f"    -> Error uploading {img_path.name}: {e}")
                
        if urls:
            # Update database
            with sqlite3.connect(DB_PATH) as conn:
                conn.execute(
                    "UPDATE crop_variety SET image_url=?, image_link=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
                    (json.dumps(urls, ensure_ascii=False), urls[0], matched_row["id"])
                )
                conn.commit()
            print(f"  OK DB updated for variety_id={matched_row['id']} with {len(urls)} images.")
            
    print("\nDone!")

if __name__ == "__main__":
    main()
