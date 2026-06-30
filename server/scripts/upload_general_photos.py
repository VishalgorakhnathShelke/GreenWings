import os
import boto3
from pathlib import Path
from urllib.parse import quote
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent.parent
GENERAL_PHOTOS_DIR = ROOT / "database" / "sps" / "General photos"

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
    
    print("Uploading General Photos to R2...")
    for img_path in GENERAL_PHOTOS_DIR.glob("*.*"):
        if img_path.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.webp']: continue
        
        # We replace spaces with underscores for safety
        key = f"ui-assets/farmers/{img_path.name.replace(' ', '_')}"
        client.upload_file(
            str(img_path), 
            bucket, 
            key, 
            ExtraArgs={"ContentType": f"image/{img_path.suffix.lower().lstrip('.')}"}
        )
        url = public_url(key)
        print(f"Uploaded {img_path.name} -> {url}")

if __name__ == "__main__":
    main()
