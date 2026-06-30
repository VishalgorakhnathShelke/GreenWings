import os
import re
import sys
import boto3
from pathlib import Path
from urllib.parse import quote
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT / "database" / "sps"))
from main import download_bing_images, safe_name

OUTPUT_DIR = ROOT / "database" / "sps" / "main_crops"
CATALOG_DIR = ROOT / "src" / "data" / "catalog"

def r2_client():
    load_dotenv(ROOT / ".env")
    ep  = os.environ.get("R2_ENDPOINT_URL", "").strip()
    kid = os.environ.get("R2_ACCESS_KEY_ID", "").strip()
    sec = os.environ.get("R2_SECRET_ACCESS_KEY", "").strip()
    return boto3.client("s3", endpoint_url=ep, aws_access_key_id=kid, aws_secret_access_key=sec, region_name="auto")

def public_url(key: str) -> str:
    base = os.environ.get("R2_PUBLIC_BASE_URL", "").strip().rstrip("/")
    return f"{base}/{'/'.join(quote(p) for p in key.split('/'))}"

def main():
    client = r2_client()
    bucket = os.environ.get("R2_BUCKET", "").strip()
    
    for ts_file in CATALOG_DIR.glob("*.ts"):
        if ts_file.name == "index.ts": continue
        
        content = ts_file.read_text(encoding="utf-8")
        pattern_crop = re.compile(r"name:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*heroImage:\s*'([^']+)'")
        crop_matches = pattern_crop.finditer(content)
        
        modified = False
        for match in crop_matches:
            name = match.group(1)
            slug = match.group(2)
            current_hero = match.group(3)
            
            query = f"{name} crop plant fresh produce photo"
            print(f"\nProcessing Crop: {name} ({slug}) in {ts_file.name}")
            
            download_bing_images(query, 1, OUTPUT_DIR, folder_name=slug)
            
            folder = OUTPUT_DIR / safe_name(slug)
            if not folder.exists():
                continue
                
            images = list(folder.glob("*.*"))
            if not images:
                continue
                
            img_path = images[0]
            
            key = f"crop-main/{slug}/{img_path.name}"
            print(f"Uploading to R2: {key}")
            
            client.upload_file(str(img_path), bucket, key, ExtraArgs={"ContentType": f"image/{img_path.suffix.lower().lstrip('.')}"})
            
            url = public_url(key)
            print(f"URL: {url}")
            
            block_pattern = rf"(slug:\s*'{slug}',\s*heroImage:\s*)'{re.escape(current_hero)}'"
            new_content = re.sub(block_pattern, rf"\g<1>'{url}'", content, count=1)
            if new_content != content:
                content = new_content
                modified = True
                
        if modified:
            ts_file.write_text(content, encoding="utf-8")
            print(f"Updated {ts_file.name} successfully!")

if __name__ == "__main__":
    main()
