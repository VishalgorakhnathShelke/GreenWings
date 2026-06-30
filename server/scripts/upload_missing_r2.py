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

def upload_folder(local_folder, s3_prefix):
    path = Path(local_folder)
    if not path.exists():
        print(f"Skipping {local_folder}, doesn't exist.")
        return
        
    for file in path.iterdir():
        if file.is_file():
            content_type = mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
            key = f"{s3_prefix}/{file.name}"
            # Special case for HomePage.tsx which uses underscores:
            if 'Serious disciussion' in file.name:
                s3.upload_file(str(file), R2_BUCKET, f"{s3_prefix}/{file.name.replace(' ', '_')}", ExtraArgs={'ContentType': content_type})
                
            print(f"Uploading {file.name} to {key} ...")
            s3.upload_file(
                str(file),
                R2_BUCKET,
                key,
                ExtraArgs={'ContentType': content_type}
            )

def main():
    print("Uploading General photos...")
    upload_folder('database/sps/General photos', 'general-photos')
    
    print("\nUploading Success stories farmers...")
    upload_folder('database/sps/Success stories farmers', 'ui-assets/farmers/real')
    
    print("\nDone!")

if __name__ == '__main__':
    main()
