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
        return "png"
    if "webp" in content_type:
        return "webp"
    if "gif" in content_type:
        return "gif"
    if "bmp" in content_type:
        return "bmp"
    if "tiff" in content_type:
        return "tiff"
    if "jpeg" in content_type or "jpg" in content_type:
        return "jpg"

    path = urllib.parse.urlsplit(fallback_url).path
    suffix = Path(path).suffix.lower().lstrip(".")
    if suffix in IMAGE_EXTENSIONS:
        return "jpg" if suffix in {"jpeg", "jfif"} else suffix

    return "jpg"


def normalize_image_url(image_url):
    parsed = urllib.parse.urlsplit(html.unescape(image_url))
    return urllib.parse.urlunsplit(
        (
            parsed.scheme,
            parsed.netloc,
            urllib.parse.quote(parsed.path, safe="/:@!$&'()*+,;="),
            urllib.parse.quote(parsed.query, safe="=&+%:@!$'()*,;"),
            parsed.fragment,
        )
    )


def bing_image_search_urls(query, first_result=0, page_size=35):
    params = urllib.parse.urlencode(
        {
            "q": query,
            "first": first_result,
            "count": page_size,
            "adlt": "strict",
            "safeSearch": "strict",
            "qft": "+filterui:photo-photo",
        }
    )
    request_url = f"{BING_IMAGES_URL}?{params}"
    request = urllib.request.Request(request_url, headers=HEADERS)

    with urllib.request.urlopen(request, timeout=60) as response:
        page = response.read().decode("utf-8", errors="ignore")

    links = re.findall(r'murl&quot;:&quot;(.*?)&quot;', page)
    if not links:
        links = re.findall(r'"murl":"(.*?)"', page)

    return [normalize_image_url(link) for link in links]


def save_image(image_url, file_path_without_suffix):
    request = urllib.request.Request(image_url, headers=HEADERS)

    with urllib.request.urlopen(request, timeout=60) as response:
        data = response.read()
        content_type = response.headers.get("Content-Type", "")

    if not is_valid_image(data):
        raise ValueError(f"Invalid image, not saving {image_url}")

    extension = get_image_extension(content_type, image_url)
    file_path = file_path_without_suffix.with_suffix(f".{extension}")
    file_path.write_bytes(data)

    return file_path, hashlib.sha256(data).hexdigest()


def download_images(image_name, number_of_images, folder_address):
    return download_bing_images(
        search_query=image_name,
        number_of_images=number_of_images,
        folder_address=folder_address,
        folder_name=image_name,
    )


def download_bing_images(search_query, number_of_images, folder_address, folder_name=None):
    folder_name = folder_name or search_query
    output_folder = Path(folder_address) / safe_name(folder_name)
    output_folder.mkdir(parents=True, exist_ok=True)

    seen_urls = set()
    seen_hashes = get_existing_image_hashes(output_folder)
    saved_count = len(seen_hashes)
    next_image_number = get_next_image_number(output_folder, folder_name)
    first_result = 0
    page_size = 35

    print(f"Searching Bing for: {search_query}")
    print(f"Saving {number_of_images} images into: {output_folder}")

    if saved_count >= number_of_images:
        print(f"[%] Already have {saved_count} unique images. Nothing to download.\n")
        return saved_count

    while saved_count < number_of_images:
        try:
            image_urls = bing_image_search_urls(search_query, first_result, page_size)
        except Exception as error:
            print(f"[!] Bing search failed for '{search_query}': {error}")
            break

        if not image_urls:
            print(f"[%] No more Bing image results for '{search_query}'.\n")
            break

        print(f"[%] Found {len(image_urls)} image URLs from result {first_result}.")

        downloaded_this_page = False
        for image_url in image_urls:
            if saved_count >= number_of_images:
                break

            if image_url in seen_urls:
                continue

            seen_urls.add(image_url)
            file_path_without_suffix = output_folder / f"{safe_name(folder_name)}_{next_image_number}"

            try:
                print(f"[%] Downloading image #{next_image_number}")
                saved_path, image_hash = save_image(image_url, file_path_without_suffix)
            except Exception as error:
                print(f"[!] Skipped image URL: {error}")
                continue

            if image_hash in seen_hashes:
                saved_path.unlink(missing_ok=True)
                print("[%] Duplicate image skipped.\n")
                continue

            seen_hashes.add(image_hash)
            saved_count += 1
            next_image_number = get_next_image_number(output_folder, folder_name)
            downloaded_this_page = True
            print(f"[%] File downloaded: {saved_path}\n")

        first_result += page_size

        if not downloaded_this_page and first_result > page_size * 5:
            print("[%] Stopping because later pages are not producing new images.\n")
            break

    return saved_count


def download_images_from_csv(csv_path=DEFAULT_CSV_PATH, number_of_images=8, folder_address=DEFAULT_IMAGE_FOLDER):
    rows = get_produce_rows(csv_path)

    for row in rows:
        name = get_row_display_name(row)
        if not name:
            continue

        search_query = build_produce_search_query(row)
        print(f"\n=== {name} ===")
        download_bing_images(search_query, number_of_images, folder_address, folder_name=name)


def main():
    download_images_from_csv()


if __name__ == "__main__":
    main()
