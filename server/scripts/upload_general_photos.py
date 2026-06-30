import os
import boto3
from pathlib import Path
from urllib.parse import quote
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent.parent
GENERAL_PHOTOS_DIR = ROOT / "database" / "General Photos"

load_dotenv(ROOT / ".env")

bucket = os.environ.get("R2_BUCKET", "").strip()
ep  = os.environ.get("R2_ENDPOINT_URL", "").strip()
kid = os.environ.get("R2_ACCESS_KEY_ID", "").strip()
sec = os.environ.get("R2_SECRET_ACCESS_KEY", "").strip()
base = os.environ.get("R2_PUBLIC_BASE_URL", "").strip().rstrip("/")

client = boto3.client(
    "s3", 
    endpoint_url=ep, 
    aws_access_key_id=kid,
    aws_secret_access_key=sec, 
    region_name="auto"
)

def public_url_for_key(key: str) -> str:
    return f"{base}/{'/'.join(quote(p) for p in key.split('/'))}"

print(f"Uploading files from {GENERAL_PHOTOS_DIR} to R2 bucket '{bucket}' under 'general-photos/' prefix...")

for file_path in GENERAL_PHOTOS_DIR.glob("*.png"):
    filename = file_path.name
    key = f"general-photos/{filename}"
    
    print(f"Uploading {filename}...")
    client.upload_file(str(file_path), bucket, key, ExtraArgs={
        "ContentType": "image/png",
    })
    
    pub_url = public_url_for_key(key)
    print(f"URL: {pub_url}")

print("Done!")
