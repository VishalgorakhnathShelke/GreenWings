import re
from pathlib import Path

path = Path("server/scripts/sync_crop_variety_images.py")
content = path.read_text(encoding="utf-8")

# 1. Update docstring
content = content.replace("Google-first, quota-aware", "DuckDuckGo fallback, local storage")
content = re.sub(r"2\. Google Custom Search API.*?3\. Vision verification", 
                 "2. DuckDuckGo Search\n   • Free tier, no quotas.\n\n3. Vision verification", 
                 content, flags=re.DOTALL)
content = re.sub(r"\s*--daily-limit N.*?\(default 100\)\n", "\n", content)

# 2. Imports
content = content.replace("from urllib.parse import quote, urlencode", "from urllib.parse import quote\nfrom duckduckgo_search import DDGS")

# 3. Constants
content = content.replace('ROOT / "database" / "media-cache" / "crop-varieties"', 'ROOT / "public" / "images" / "crop-varieties"')
content = content.replace('ROOT / "database" / "media-cache" / "review"', 'ROOT / "public" / "images" / "crop-varieties" / "review"')
content = re.sub(r"QUOTA_FILE.*?GOOGLE_SEARCH_URL\s*=\s*\"[^\"]+\"\n", "", content, flags=re.DOTALL)
content = re.sub(r"DEFAULT_DAILY_LIMIT\s*=\s*100[^\n]*\n", "", content)
content = re.sub(r"# Same list as URL-encoded Google.*?GOOGLE_NEG = \([^\)]+\)\n\n", "", content, flags=re.DOTALL)

# 4. Remove GoogleQuota class
content = re.sub(r"# -{75}\n# Google quota tracker\n# -{75}\n\n\nclass GoogleQuota.*?def status\(self\) -> str:\n        return f\"\{self\._count\}/\{self\.daily_limit\} searches used today\"\n", "", content, flags=re.DOTALL)

# 5. Replace Google logic with DDG
ddg_code = """# ---------------------------------------------------------------------------
# DuckDuckGo Search  — PRIMARY fallback source
# ---------------------------------------------------------------------------


def _build_ddg_query(record: VarietyRecord) -> str:
    sci     = record.scientific_name or ""
    variety = re.sub(r"\\([^)]*\\)", "", record.variety_name).strip()
    common  = record.common_name
    hint    = _crop_hint(record)

    if sci:
        core = f'"{sci}"'
        if variety and variety.lower() not in sci.lower():
            core += f' "{variety}"'
    elif variety:
        core = f'"{variety}" {common}'
    else:
        core = common

    return f"{core} {hint}"


def _source_ddg(
    record: VarietyRecord,
    images_wanted: int,
) -> list[ImageCandidate]:
    query = _build_ddg_query(record)
    log(f"  [DDG] query: '{query}'", 1)

    candidates: list[ImageCandidate] = []
    try:
        results = DDGS().images(
            keywords=query,
            max_results=images_wanted + 3,
            safesearch="on",
        )
        for item in results:
            candidates.append(ImageCandidate(
                title       = item.get("title", ""),
                source_url  = item.get("url", ""),
                file_url    = item.get("image", ""),
                thumb_url   = item.get("thumbnail", ""),
                mime_type   = "image/jpeg",
                width       = item.get("width", 0) or 800,
                height      = item.get("height", 0) or 600,
                license_name= "Unknown (DDG)",
                artist      = item.get("source", ""),
                credit      = "",
                source_name = "ddg",
            ))
            
        log(f"  [DDG] {len(candidates)} image(s) returned", 1)
        import time
        time.sleep(2.0)
    except Exception as exc:
        log(f"  [DDG] API error: {exc}", 1)

    return candidates
"""
content = re.sub(r"# -{75}\n# Google Custom Search.*?return candidates\n", ddg_code, content, flags=re.DOTALL)

# 6. Pipeline args
content = content.replace("quota: GoogleQuota,", "")
content = content.replace("quota,", "")
content = content.replace("google_results = _source_google(record, count - len(accepted) + 3, quota)", "ddg_results = _source_ddg(record, count - len(accepted) + 3)")
content = content.replace("evaluate(google_results)", "evaluate(ddg_results)")
content = content.replace("[Google] skipped", "[DDG] skipped")

# 7. Remove R2
content = re.sub(r"# -{75}\n# Cloudflare R2\n# -{75}\n\n\ndef r2_client.*?return public_url_for_key\(key\)\n", "", content, flags=re.DOTALL)

# 8. sync_record params
content = content.replace("client: Any | None, bucket: str, r2_prefix: str,\n    force: bool, quota: GoogleQuota, vision_enabled: bool,", "force: bool, vision_enabled: bool,")
content = re.sub(r"\s*log\(f\"  Google     : \{quota\.status\(\)\}\", 1\)\n", "\n", content)

old_upload = """        try:
            key = f"{r2_prefix.strip('/')}/{filename}"
            pub = upload_to_r2(client, bucket, key, local, c.mime_type, {
                "subtype_id": str(record.subtype_id), "crop": record.common_name,
                "variety": record.variety_name, "source": c.source_url,
                "license": c.license_name, "artist": c.artist,
            })
        except Exception as exc:
            log(f"  ✗ upload failed #{idx}: {exc}", 1); continue

        uploaded.append(pub)"""

new_upload = """        pub = f"/images/crop-varieties/subtype-{record.subtype_id:04d}-{clean_slug(record.common_name)}-{clean_slug(record.variety_name)}/{filename}"
        uploaded.append(pub)"""
content = content.replace(old_upload, new_upload)

old_apply = """            try:
                key = f"{r2_prefix.strip('/')}/{fn}"
                pub = upload_to_r2(client, bucket, key, lp, mime, {
                    "subtype_id": str(sid), "crop": common, "variety": variety,
                    "source": e.get("source_page",""), "license": e.get("license",""),
                    "artist": e.get("author",""),
                })
                uploaded.append(pub); total += 1
                log(f"  ✓ {pub}", 1)
            except Exception as exc:
                log(f"  ✗ upload: {exc}", 1)"""

new_apply = """            pub = f"/images/crop-varieties/subtype-{sid:04d}-{clean_slug(common)}-{clean_slug(variety)}/{fn}"
            uploaded.append(pub); total += 1
            log(f"  ✓ {pub}", 1)"""
content = content.replace(old_apply, new_apply)

# apply_approved params
content = content.replace("client: Any, bucket: str, r2_prefix: str", "")

# 9. Main CLI updates
content = re.sub(r"\s*p\.add_argument\(\"--daily-limit\".*?\(default 100\)\.\"\)\n", "\n", content, flags=re.DOTALL)

content = re.sub(r"\s*bucket\s*=\s*os\.environ\.get\(\"R2_BUCKET\".*?client:\s*Any\s*\|\s*None\s*=\s*None\n", "", content, flags=re.DOTALL)
content = re.sub(r"\s*quota = GoogleQuota\(daily_limit=args\.daily_limit\)\n", "", content)

content = re.sub(r"\s*if args\.apply_approved:\n\s*if not bucket:\n\s*raise SystemExit\(\"Missing R2_BUCKET\.\"\)\n\s*apply_approved\(review_dir, db_path, cache_dir, r2_client\(\), bucket, r2_prefix\)", "\n    if args.apply_approved:\n        apply_approved(review_dir, db_path, cache_dir)", content)

content = re.sub(r"\s*if not args\.dry_run and not args\.review:\n\s*if not bucket:\n\s*raise SystemExit\(\"Missing R2_BUCKET\.\"\)\n\s*client = r2_client\(\)\n", "", content)

content = content.replace("client=client, bucket=bucket, r2_prefix=r2_prefix,\n            ", "")

content = re.sub(r"\s*log\(f\"  Google quota.*?quota exhausted\"\)\n", "\n", content, flags=re.DOTALL)

content = re.sub(r"\s*if quota\.exhausted and not args\.dry_run:\n.*?break\n", "\n", content, flags=re.DOTALL)

content = re.sub(r"\s*log\(f\"Google quota used: \{quota\.status\(\)\}\"\)\n", "\n", content)

content = content.replace("Google-first, quota-aware, vision-verified", "DuckDuckGo fallback, local storage, vision-verified")

path.write_text(content, encoding="utf-8")
print("Migration completed.")
