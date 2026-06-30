import os
import sqlite3
import boto3
from pathlib import Path
from urllib.parse import quote
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent.parent
FARMERS_DIR = ROOT / "database" / "Success stories farmers"
DB_PATH = ROOT / "database" / "greenwings.db"

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
    
    farmer_photos = {
        "Gorakhnath Shelke.jpeg": "Mr. Gorakhanath Namdeorao Shelke",
        "Pravin Malhari Jadhav.jpeg": "Mr. Pravin Malhari Jadhav"
    }
    
    updates = {}
    print("Uploading real Farmer Photos to R2...")
    for filename, db_name in farmer_photos.items():
        filepath = FARMERS_DIR / filename
        if not filepath.exists():
            print(f"NOT FOUND: {filename}")
            continue
            
        key = f"ui-assets/farmers/real/{filename.replace(' ', '_')}"
        client.upload_file(str(filepath), bucket, key, ExtraArgs={"ContentType": "image/jpeg"})
        url = public_url(key)
        print(f"Uploaded {filename}:")
        print(f"URL: {url}\n")
        updates[db_name] = url

    # Update database
    if updates:
        print("Updating database...")
        with sqlite3.connect(DB_PATH) as conn:
            for db_name, url in updates.items():
                conn.execute(
                    "UPDATE success_stories SET profileImage=?, coverImage=? WHERE farmerName=?",
                    (url, url, db_name)
                )
            conn.commit()
        print("Database updated successfully!")

if __name__ == "__main__":
    main()
