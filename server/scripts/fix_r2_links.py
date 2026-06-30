import boto3
import os
import re
from pathlib import Path
from dotenv import load_dotenv
import urllib.parse

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

def normalize(name):
    # Remove extension, lowercase, replace underscores with spaces
    n = name.split('/')[-1].rsplit('.', 1)[0].lower().replace('_', ' ')
    # Also remove url encoding %20
    n = urllib.parse.unquote(n)
    return n

def main():
    print("Fetching all objects from R2...")
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=R2_BUCKET)
    
    r2_keys = []
    for page in pages:
        for obj in page.get('Contents', []):
            r2_keys.append(obj['Key'])
            
    print(f"Found {len(r2_keys)} objects in R2.")
    
    # Build a lookup for normalized filename -> full R2 key
    # If multiple have the same name, we'll store a list
    lookup = {}
    for key in r2_keys:
        norm = normalize(key)
        if norm not in lookup:
            lookup[norm] = []
        lookup[norm].append(key)

    # Scan src/
    src_dir = Path('src')
    changes_made = 0
    
    for filepath in src_dir.rglob('*'):
        if filepath.suffix in ['.ts', '.tsx']:
            content = filepath.read_text('utf-8')
            new_content = content
            
            # Find all R2 links
            urls = re.findall(r'https://pub-b4b449ec1942478faeec7dcf924c0abe\.r2\.dev/([^"\'`\s]+)', content)
            for url_path in urls:
                # url_path might be URL-encoded, e.g. general-photos/Grains%20%26%20Cereals.png
                unquoted_path = urllib.parse.unquote(url_path)
                
                # If exact key exists, it's fine!
                if unquoted_path in r2_keys:
                    # Make sure the URL in code is properly encoded if it has spaces
                    proper_url = BASE_URL + '/' + urllib.parse.quote(unquoted_path)
                    current_full_url = BASE_URL + '/' + url_path
                    if proper_url != current_full_url:
                        new_content = new_content.replace(current_full_url, proper_url)
                    continue
                
                # It doesn't exist. Let's find a match.
                norm = normalize(unquoted_path)
                if norm in lookup:
                    matches = lookup[norm]
                    # Try to find the closest match based on folder
                    best_match = None
                    for match in matches:
                        if match.split('/')[0] == unquoted_path.split('/')[0]:
                            best_match = match
                            break
                    if not best_match:
                        best_match = matches[0] # Just pick first
                    
                    proper_url = BASE_URL + '/' + urllib.parse.quote(best_match)
                    current_full_url = BASE_URL + '/' + url_path
                    
                    print(f"Fixing {current_full_url} -> {proper_url} in {filepath.name}")
                    new_content = new_content.replace(current_full_url, proper_url)
                else:
                    print(f"Warning: Could not find replacement for {url_path} in {filepath.name}")
                    
            if new_content != content:
                filepath.write_text(new_content, 'utf-8')
                changes_made += 1
                
    print(f"Done! Modified {changes_made} files.")

if __name__ == '__main__':
    main()
