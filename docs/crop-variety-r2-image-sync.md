# Crop Variety Image Sync To Cloudflare R2

This utility searches public Wikimedia Commons media for each `crop_variety.subtype_id`, downloads HD images locally, uploads them to Cloudflare R2, and saves the resulting public R2 URLs back into:

- `crop_variety.image_url` as a JSON array of URLs
- `crop_variety.image_link` as the first URL for quick frontend display

The local database path is:

```text
C:\Users\Vishal\Documents\Codex\2026-06-13\greenwings-react\database\greenwings.db
```

## 1. Install Dependency

```powershell
cd "C:\Users\Vishal\Documents\Codex\2026-06-13\greenwings-react"
.\.venv\Scripts\python -m pip install boto3
```

## 2. Add R2 Credentials To `.env`

```env
R2_ENDPOINT_URL=https://82f1dc77da67b739e83efd83f7cc8ac4.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET=greenwings
R2_PUBLIC_BASE_URL=https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev
R2_PREFIX=crop-varieties
```

Upload uses `R2_ENDPOINT_URL`. Display uses `R2_PUBLIC_BASE_URL`.

Do not add the bucket name to `R2_PUBLIC_BASE_URL`. The public URL should be:

```text
https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-varieties/image-name.jpg
```

This is wrong:

```text
https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/greenwings/crop-varieties/image-name.jpg
```

For production, replace the `r2.dev` development URL with a custom Cloudflare domain.

## 3. Test Without Uploading

```powershell
.\.venv\Scripts\python server\scripts\sync_crop_variety_images.py --dry-run --limit-varieties 3 --images-per-subtype 5
```

## 4. Upload One Subtype First

```powershell
.\.venv\Scripts\python server\scripts\sync_crop_variety_images.py --subtype-id 1 --images-per-subtype 5
```

## 5. Upload All Missing Images

```powershell
.\.venv\Scripts\python server\scripts\sync_crop_variety_images.py --images-per-subtype 5
```

## 6. Replace Existing Image URLs

Use `--force` only when you intentionally want to replace existing `image_url` values.

```powershell
.\.venv\Scripts\python server\scripts\sync_crop_variety_images.py --force --images-per-subtype 5
```

## Notes

- The script uses Wikimedia Commons by default because it provides image metadata and licensing information.
- Some exact Indian variety names may not have enough public HD images. The script falls back from variety-level queries to crop-level queries.
- Local downloads are cached under `database/media-cache/crop-varieties`, which is ignored by Git.
- A manifest JSON file is written beside downloaded images for source/license traceability.
