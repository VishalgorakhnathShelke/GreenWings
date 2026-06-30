import boto3
import os
import re
import urllib.parse
import sqlite3
import json
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
            if (norm_folder, 0) not in lookup:
                lookup[(norm_folder, 0)] = url

    # Connect with timeout to avoid lock issues
    conn = sqlite3.connect('database/greenwings.db', timeout=20.0)
    cursor = conn.cursor()
    
    pattern = re.compile(r'https://pub-b4b449ec1942478faeec7dcf924c0abe\.r2\.dev/crop-varieties/subtype-[0-9]+-([^/]+)/image_0?([0-9]+)\.(?:jpg|png|webp|jpeg)')
    
    def replacer(match):
        folder_part = match.group(1)
        num_part = int(match.group(2))
        norm_folder = normalize_folder(folder_part)
        
        if (norm_folder, num_part) in lookup:
            return lookup[(norm_folder, num_part)]
            
        for (f_norm, n), url in lookup.items():
            if n == num_part and (norm_folder in f_norm or f_norm in norm_folder):
                return url
                
        if (norm_folder, 0) in lookup:
            return lookup[(norm_folder, 0)]
            
        for (f_norm, n), url in lookup.items():
            if norm_folder in f_norm or f_norm in norm_folder:
                return url
                
        return match.group(0)
        
    def fix_string(s):
        if not s:
            return s
        new_s = pattern.sub(replacer, s)
        return new_s
        
    # Fix subtypes table
    cursor.execute("SELECT subtype_id, image_link FROM subtypes")
    rows = cursor.fetchall()
    for row in rows:
        sid = row[0]
        link = row[1]
        new_link = fix_string(link)
        if new_link != link:
            cursor.execute("UPDATE subtypes SET image_link = ? WHERE subtype_id = ?", (new_link, sid))
            
    # Fix crop_variety table
    cursor.execute("SELECT id, image_url, image_link FROM crop_variety")
    rows = cursor.fetchall()
    for row in rows:
        cid = row[0]
        url = row[1]
        link = row[2]
        new_url = fix_string(url)
        new_link = fix_string(link)
        if new_url != url or new_link != link:
            cursor.execute("UPDATE crop_variety SET image_url = ?, image_link = ? WHERE id = ?", (new_url, new_link, cid))
            
    # Skipping subtype_translations

    conn.commit()
    conn.close()
    print("Database rows updated successfully!")

if __name__ == '__main__':
    main()
