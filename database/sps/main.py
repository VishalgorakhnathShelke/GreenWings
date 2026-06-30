import csv
import hashlib
import html
import re
import urllib.parse
import urllib.request
from pathlib import Path


# DEFAULT_CSV_PATH = Path(r"C:\Users\Vishal\Downloads\sps\produce_202606291941.csv")
# DEFAULT_IMAGE_FOLDER = Path(r"C:\Users\Vishal\Downloads\sps\images")
DEFAULT_CSV_PATH = Path(r"C:\Users\Vishal\Documents\Codex\2026-06-13\greenwings-react\database\sps\produce.csv")
DEFAULT_IMAGE_FOLDER = Path(r"C:\Users\Vishal\Documents\Codex\2026-06-13\greenwings-react\database\sps\photos")

BING_IMAGES_URL = "https://www.bing.com/images/async"

HEADERS = {
    "User-Agent": (
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

IMAGE_MAGIC = [
    b"\xff\xd8\xff",  # JPEG
    b"\x89PNG\r\n\x1a\n",  # PNG
    b"GIF87a",
    b"GIF89a",
    b"BM",  # BMP
    b"II\x2a\x00",
    b"MM\x00\x2a",  # TIFF
]

IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff", "jfif"}


def is_valid_image(data):
    for magic in IMAGE_MAGIC:
        if data.startswith(magic):
            return True

    return len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP"


def safe_name(value):
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", value.strip())
    return cleaned.strip("_") or "image"


def get_name_column(csv_path=DEFAULT_CSV_PATH):
    with Path(csv_path).open(newline="", encoding="utf-8-sig") as csv_file:
        reader = csv.DictReader(csv_file)
        fieldnames = reader.fieldnames or []

        if "name" in fieldnames:
            return [row["name"] for row in reader]
        if "english_name" in fieldnames:
            return [row["english_name"] for row in reader]
        if "common_name" in fieldnames:
            return [row["common_name"] for row in reader]

        raise ValueError("CSV does not contain a name, english_name, or common_name column.")


def get_produce_rows(csv_path=DEFAULT_CSV_PATH):
    with Path(csv_path).open(newline="", encoding="utf-8-sig") as csv_file:
        return list(csv.DictReader(csv_file))


def first_scientific_name(scientific_name):
    return scientific_name.split("/")[0].strip()


def build_produce_search_query(row):
    name = row.get("english_name") or row.get("name") or row.get("common_name") or ""
    produce_type = (row.get("type") or "").strip().lower()
    category = (row.get("category") or "").strip().lower()
    scientific_name = first_scientific_name(row.get("scientific_name") or "")
    variety_name = (row.get("variety_name") or "").strip()

    if produce_type == "fruit":
        context = "fruit plant photo"
    elif "pulse" in category:
        context = "pulse crop seeds plant photo"
    elif "millet" in category:
        context = "millet grain crop plant photo"
    elif "cereal" in category:
        context = "grain crop plant photo"
    elif "oilseed" in category:
        context = "oilseed crop seeds plant photo"
    elif produce_type == "vegetable":
        context = "vegetable plant photo"
    else:
        context = "crop plant photo"

    if variety_name and variety_name.lower() not in name.lower():
        name = f"{name} {variety_name}"

    if not produce_type and not category:
        context = "produce plant photo"

    parts = [name, scientific_name, context]
    return " ".join(part for part in parts if part).strip()


def get_row_display_name(row):
    return (
        row.get("english_name")
        or row.get("name")
        or row.get("common_name")
        or row.get("variety_name")
        or ""
    ).strip()


def get_existing_image_hashes(folder):
    hashes = set()

    for file_path in Path(folder).glob("*"):
        if not file_path.is_file():
            continue

        try:
            data = file_path.read_bytes()
        except OSError:
            continue

        if is_valid_image(data):
            hashes.add(hashlib.sha256(data).hexdigest())

    return hashes


def get_next_image_number(output_dir, folder_name):
    image_number = 1
    image_prefix = safe_name(folder_name)

    while list(output_dir.glob(f"{image_prefix}_{image_number}.*")):
        image_number += 1

    return image_number


def get_image_extension(content_type, fallback_url):
    content_type = (content_type or "").lower()

    if "png" in content_type: