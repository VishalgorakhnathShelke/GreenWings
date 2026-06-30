import boto3
import os
import re
import urllib.parse
import sqlite3
from pathlib import Path
from dotenv import load_dotenv

# Load env
env_path = Path('.env')
load_dotenv(dotenv_path=env_path)

R2_ENDPOINT_URL = os.environ.get('R2_ENDPOINT_URL')
R2_ACCESS_KEY_ID = os.environ.get('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.environ.get('R2_SECRET_ACCESS_KEY')
R2_BUCKET = os.environ.get('R2_BUCKET', 'greenwings')
BASE_URL = "https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev"

s3 = boto3.client('s3',
    endpoint_url=R2_ENDPOINT_URL,
    aws_access_key_id=R2_ACCESS_KEY_ID,
    aws_secret_access_key=R2_SECRET_ACCESS_KEY
)

def normalize_folder(name):
    # Remove hyphens, underscores, spaces, lowercase
    return re.sub(r'[^a-z0-9]', '', name.lower())

def extract_number(name):
    m = re.search(r'([0-9]+)\.[a-z]+$', name)
    if m:
        return int(m.group(1))
    return 1

def main():
    print("Fetching existing objects from R2 crop-varieties...")
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=R2_BUCKET, Prefix='crop-varieties/')
    
    r2_keys = []
    for page in pages:
        for obj in page.get('Contents', []):
            r2_keys.append(obj['Key'])

    print(f"Found {len(r2_keys)} objects in R2 crop-varieties/")

    # Build lookup: (normalized_folder, number) -> full R2 url
    lookup = {}
    for key in r2_keys:
        parts = key.split('/')
        if len(parts) >= 3:
            folder = parts[1]
            filename = parts[2]
            norm_folder = normalize_folder(folder)
            num = extract_number(filename)
            url = BASE_URL + '/' + urllib.parse.quote(key)
            lookup[(norm_folder, num)] = url
            # Also store with num=0 for fallback
            if (norm_folder, 0) not in lookup:
                lookup[(norm_folder, 0)] = url

    # Connect to database and dump it
    db_path = 'database/greenwings.db'
    dump_path = 'database/dump.sql'
    
    print("Dumping database...")
    os.system(f'sqlite3 {db_path} .dump > {dump_path}')
    
    with open(dump_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all fake URLs
    # Example: https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-varieties/subtype-0126-sunflower-kbsh-44/image_01.webp
    pattern = re.compile(r'https://pub-b4b449ec1942478faeec7dcf924c0abe\.r2\.dev/crop-varieties/subtype-[0-9]+-([^/]+)/image_0?([0-9]+)\.(?:jpg|png|webp|jpeg)')
    
    def replacer(match):
        folder_part = match.group(1) # e.g. sunflower-kbsh-44
        num_part = int(match.group(2)) # e.g. 1
        
        # In the database, the fake URL has sunflower-kbsh-44. Let's see if we can match it.
        # But wait! Mango_Alphonso_Hapus in R2 vs mango-alphonso in DB!
        norm_folder = normalize_folder(folder_part)
        
        # Exact match
        if (norm_folder, num_part) in lookup:
            return lookup[(norm_folder, num_part)]
            
        # Try finding a partial match
        for (f_norm, n), url in lookup.items():
            if n == num_part and (norm_folder in f_norm or f_norm in norm_folder):
                return url
                
        # Try finding ANY image in that folder
        if (norm_folder, 0) in lookup:
            return lookup[(norm_folder, 0)]
            
        for (f_norm, n), url in lookup.items():
            if norm_folder in f_norm or f_norm in norm_folder:
                return url
                
        print(f"WARNING: Could not find match for {folder_part} image {num_part}")
        return match.group(0)

    new_content = pattern.sub(replacer, content)
    
    with open('database/dump_fixed.sql', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("Restoring database...")
    os.system(f'sqlite3 database/greenwings_fixed.db < database/dump_fixed.sql')
    
    # Backup old and replace
    os.replace('database/greenwings.db', 'database/greenwings.db.bak')
    os.replace('database/greenwings_fixed.db', 'database/greenwings.db')
    
    print("Done! Database updated.")

if __name__ == '__main__':
    main()
