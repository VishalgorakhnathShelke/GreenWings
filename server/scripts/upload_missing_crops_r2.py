import boto3
import os
import mimetypes
from pathlib import Path
from dotenv import load_dotenv

# Load env
env_path = Path('.env')
load_dotenv(dotenv_path=env_path)

R2_ENDPOINT_URL = os.environ.get('R2_ENDPOINT_URL')
R2_ACCESS_KEY_ID = os.environ.get('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.environ.get('R2_SECRET_ACCESS_KEY')
R2_BUCKET = os.environ.get('R2_BUCKET', 'greenwings')

s3 = boto3.client('s3',
    endpoint_url=R2_ENDPOINT_URL,
    aws_access_key_id=R2_ACCESS_KEY_ID,
    aws_secret_access_key=R2_SECRET_ACCESS_KEY
)

def main():
    print("Fetching existing objects from R2...")
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=R2_BUCKET)
    
    r2_keys = set()
    for page in pages:
        for obj in page.get('Contents', []):
            r2_keys.add(obj['Key'])

    def sync_dir(local_dir, prefix):
        path = Path(local_dir)
        if not path.exists():
            return
            
        for filepath in path.rglob('*'):
            if filepath.is_file():
                rel_path = filepath.relative_to(path)
                # Convert Windows slashes to forward slashes for R2
                r2_key = f"{prefix}/{str(rel_path).replace(os.sep, '/')}"
                
                if r2_key not in r2_keys:
                    content_type = mimetypes.guess_type(filepath.name)[0] or 'application/octet-stream'
                    print(f"Uploading {filepath} to {r2_key} ...")
                    s3.upload_file(
                        str(filepath),
                        R2_BUCKET,
                        r2_key,
                        ExtraArgs={'ContentType': content_type}
                    )

    print("Uploading missing main_crops...")
    sync_dir('database/sps/main_crops', 'crop-main')
    
    print("Uploading missing photos...")
    sync_dir('database/sps/photos', 'crop-varieties')
    
    print("Done!")

if __name__ == '__main__':
    main()
