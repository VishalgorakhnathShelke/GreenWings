import os
import boto3
from pathlib import Path
from urllib.parse import quote
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent.parent
GENERAL_PHOTOS_DIR = ROOT / "database" / "General Photos"

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
    
    farmer_photos = [
        "Farmer_with_livestacks.png",
        "Farmers with livestacks.png",
        "Serious disciussion in another farm.png",
        "a few more farmers.png",
        "serious discussion in farm.png"
    ]
    
    print("Uploading Farmer Photos to R2...")
    for filename in farmer_photos:
        filepath = GENERAL_PHOTOS_DIR / filename
        if not filepath.exists():
            print(f"NOT FOUND: {filename}")
            continue
            
        key = f"ui-assets/farmers/{filename.replace(' ', '_')}"
        client.upload_file(str(filepath), bucket, key, ExtraArgs={"ContentType": "image/png"})
        url = public_url(key)
        print(f"Uploaded {filename}:")
        print(f"URL: {url}\n")

if __name__ == "__main__":
    main()
