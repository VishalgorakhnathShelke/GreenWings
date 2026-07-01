import mimetypes
import os
import sqlite3
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

import boto3
from dotenv import load_dotenv


ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "database" / "greenwings.db"
PEOPLE_DIR = ROOT / "database" / "sps" / "People behind greenwings"
SHANKAR_IMAGE = ROOT / "database" / "sps" / "Success stories farmers" / "Shankar Shinde.jpeg"

load_dotenv(ROOT / ".env")

R2_ENDPOINT_URL = os.environ.get("R2_ENDPOINT_URL")
R2_ACCESS_KEY_ID = os.environ.get("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.environ.get("R2_SECRET_ACCESS_KEY")
R2_BUCKET = os.environ.get("R2_BUCKET", "greenwings")
R2_PUBLIC_BASE_URL = os.environ.get("R2_PUBLIC_BASE_URL", "").rstrip("/")

if not R2_PUBLIC_BASE_URL:
    raise SystemExit("Missing R2_PUBLIC_BASE_URL in .env.")

s3 = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT_URL,
    aws_access_key_id=R2_ACCESS_KEY_ID,
    aws_secret_access_key=R2_SECRET_ACCESS_KEY,
)


def public_url_for_key(r2_key: str) -> str:
    return f"{R2_PUBLIC_BASE_URL}/{urllib.parse.quote(r2_key)}"


def upload_file(local_path: Path, r2_key: str) -> str:
    content_type = mimetypes.guess_type(local_path)[0] or "application/octet-stream"
    print(f"Uploading {local_path} to {r2_key} ...")
    s3.upload_file(
        str(local_path),
        R2_BUCKET,
        r2_key,
        ExtraArgs={"ContentType": content_type},
    )
    return public_url_for_key(r2_key)


def member_name_from_file(filepath: Path) -> str:
    return filepath.stem.replace("_", " ")


def upsert_success_story(cursor: sqlite3.Cursor, story: dict[str, object]) -> None:
    cursor.execute(
        "SELECT id FROM success_stories WHERE slug = ? AND language = ?",
        (story["slug"], story["language"]),
    )
    existing = cursor.fetchone()

    if existing:
        update_keys = [key for key in story if key != "createdAt"]
        assignments = ", ".join(f"{key} = ?" for key in update_keys)
        values = [story[key] for key in update_keys]
        cursor.execute(
            f"UPDATE success_stories SET {assignments} WHERE slug = ? AND language = ?",
            values + [story["slug"], story["language"]],
        )
        print(f"Updated {story['language']} success story for {story['slug']}.")
        return

    columns = ", ".join(story.keys())
    placeholders = ", ".join(["?"] * len(story))
    cursor.execute(f"INSERT INTO success_stories ({columns}) VALUES ({placeholders})", tuple(story.values()))
    print(f"Inserted {story['language']} success story for {story['slug']}.")


def upload_leadership_images(cursor: sqlite3.Cursor) -> None:
    if not PEOPLE_DIR.exists():
        print(f"Warning: leadership image folder not found: {PEOPLE_DIR}")
        return

    for filepath in sorted(PEOPLE_DIR.glob("*.jpeg")):
        safe_filename = filepath.name.replace(" ", "_")
        r2_key = f"ui-assets/team/{safe_filename}"
        url = upload_file(filepath, r2_key)
        member_name = member_name_from_file(filepath)

        cursor.execute(
            "UPDATE leadership_members SET image = ?, imageUrl = ? WHERE fullName = ?",
            (url, url, member_name),
        )
        if cursor.rowcount == 0:
            print(f"Warning: no leadership member matched {member_name}")
        else:
            print(f"Updated leadership image for {member_name}")


def upload_shankar_image() -> str:
    if not SHANKAR_IMAGE.exists():
        print(f"Warning: Shankar Shinde image not found: {SHANKAR_IMAGE}")
        return ""

    return upload_file(SHANKAR_IMAGE, "ui-assets/farmers/real/Shankar_Shinde.jpeg")


def shankar_story(shankar_url: str, display_order: int) -> dict[str, object]:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "farmerName": "Mr. Shankar Nanasaheb Shinde",
        "farmerPhone": "",
        "title": "NAFED Onion Marketing",
        "slug": "shankar-shinde-nafed",
        "location": "Maharashtra",
        "village": "",
        "district": "",
        "cropType": "Onion",
        "landArea": "",
        "storyCategory": "Market Support",
        "shortQuote": "By selling through GreenWings to NAFED, I received a price ₹100 to ₹500 per quintal higher than the prevailing market rates.",
        "shortSummary": "Mr. Shankar Shinde sold his onion produce to NAFED through the company's marketing support, earning higher rates and receiving direct bank payments.",
        "fullStory": "During the Rabi 2023-24 and Kharif 2023-24 seasons, Mr. Shankar Shinde sold his onion produce to NAFED through the company's marketing support.\n\nBy selling through this channel, he received a price that was ₹100 to ₹500 per quintal higher than the prevailing market rates. The payments were made directly to his bank account, ensuring a transparent and reliable transaction process.\n\nAs a result of the better prices received, Mr. Shinde earned an additional income of at least ₹5,000 per tractor trolley compared to selling through conventional market channels.\n\nBased on his experience, the company's support in facilitating sales to NAFED helped him obtain better market prices, secure payments, and improve the overall profitability of his onion farming business.",
        "challenge": "Selling onion produce through conventional market channels often yields lower market rates and unpredictable payment cycles.",
        "solution": "GreenWings facilitated the sale of Mr. Shinde's onion produce directly to NAFED during the Rabi 2023-24 and Kharif 2023-24 seasons.",
        "result": "Secured prices ₹100 to ₹500 higher per quintal than market rates and ensured transparent, direct bank payments.",
        "yieldBefore": "",
        "yieldAfter": "",
        "priceBenefit": "₹100 to ₹500 higher per quintal",
        "additionalIncome": "At least ₹5,000 additional income per tractor trolley",
        "fertilizerUsed": "",
        "seedUsed": "",
        "marketSupport": "Direct marketing and sale facilitation to NAFED",
        "profileImage": shankar_url,
        "coverImage": shankar_url,
        "language": "en",
        "displayOrder": display_order,
        "featured": 1,
        "status": "published",
        "createdAt": now,
        "updatedAt": now,
        "user_id": None,
    }


def main() -> None:
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()

        upload_leadership_images(cursor)
        shankar_url = upload_shankar_image()

        cursor.execute("SELECT MAX(displayOrder) FROM success_stories")
        display_order = (cursor.fetchone()[0] or 0) + 1
        upsert_success_story(cursor, shankar_story(shankar_url, display_order))

        conn.commit()

    print("All content tasks completed.")


if __name__ == "__main__":
    main()
