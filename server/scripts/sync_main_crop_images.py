import os
import re
import sys
import sqlite3
import boto3
from pathlib import Path
from urllib.parse import quote
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT / "database" / "sps"))
from main import download_bing_images, safe_name

DB_PATH = ROOT / "database" / "greenwings.db"
OUTPUT_DIR = ROOT / "database" / "sps" / "main_crops"
CATALOG_DIR = ROOT / "src" / "data" / "catalog"

def r2_client():
    load_dotenv(ROOT / ".env")
    ep  = os.environ.get("R2_ENDPOINT_URL", "").strip()
    kid = os.environ.get("R2_ACCESS_KEY_ID", "").strip()
    sec = os.environ.get("R2_SECRET_ACCESS_KEY", "").strip()
    
    return boto3.client(
        "s3", 
        endpoint_url=ep, 
        aws_access_key_id=kid,
        aws_secret_access_key=sec, 
        region_name="auto"
    )

def public_url(key: str) -> str:
    base = os.environ.get("R2_PUBLIC_BASE_URL", "").strip().rstrip("/")
    return f"{base}/{'/'.join(quote(p) for p in key.split('/'))}"

def main():
    client = r2_client()
    bucket = os.environ.get("R2_BUCKET", "").strip()
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        crops = conn.execute("SELECT id, common_name FROM crop").fetchall()
    
    updates = {}
    
    for crop in crops:
        name = crop["common_name"]
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower().strip()).strip("-")
        
        # Download 1 image using bing search logic
        query = f"{name} crop plant fresh produce photo"
        print(f"\nProcessing Crop: {name} ({slug})")
        
        # download_bing_images(search_query, number_of_images, folder_address, folder_name=None)
        download_bing_images(query, 1, OUTPUT_DIR, folder_name=slug)
        
        folder = OUTPUT_DIR / safe_name(slug)
        if not folder.exists():
            continue
            
        images = list(folder.glob("*.*"))
        if not images:
            continue
            
        # Get the first image
        img_path = images[0]
        
        # Upload to R2 under 'crop-main/'
        key = f"crop-main/{slug}/{img_path.name}"
        print(f"Uploading to R2: {key}")
        
        client.upload_file(str(img_path), bucket, key, ExtraArgs={"ContentType": f"image/{img_path.suffix.lower().lstrip('.')}"})
        
        url = public_url(key)
        updates[slug] = url
        print(f"URL: {url}")
        
        # Update DB just in case
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute("UPDATE crop SET image_url=?, image_link=? WHERE id=?", (url, url, crop["id"]))
            conn.commit()
            
    # Now update frontend TS files
    print("\nUpdating frontend catalog files...")
    for ts_file in CATALOG_DIR.glob("*.ts"):
        if ts_file.name == "index.ts": continue
        
        content = ts_file.read_text(encoding="utf-8")
        modified = False
        
        for slug, url in updates.items():
            # regex to match: slug: 'mango', [optional whitespace/newlines] heroImage: '...'
            pattern = rf"(slug:\s*'{slug}',\s*heroImage:\s*)'.*?'"
            new_content = re.sub(pattern, rf"\g<1>'{url}'", content, flags=re.DOTALL)
            if new_content != content:
                content = new_content
                modified = True
                
        if modified:
            ts_file.write_text(content, encoding="utf-8")
            print(f"Updated {ts_file.name}")
            
    print("\nDone!")

if __name__ == "__main__":
    main()
