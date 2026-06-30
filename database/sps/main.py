import os
import re
import urllib.request
import urllib.parse
from pathlib import Path
from bs4 import BeautifulSoup

def safe_name(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower().strip()).strip("-")

def download_bing_images(query, num_images, output_dir, folder_name=None):
    if not folder_name:
        folder_name = safe_name(query)
    
    save_dir = Path(output_dir) / folder_name
    save_dir.mkdir(parents=True, exist_ok=True)
    
    # Just in case we already downloaded
    existing = list(save_dir.glob("*.*"))
    if existing:
        return
        
    url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}"
    headers = {"User-Agent": "Mozilla/5.0"}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        
        count = 0
        for a in soup.find_all('a', class_='iusc'):
            if count >= num_images:
                break
            try:
                m = a.get('m')
                import json
                m_dict = json.loads(m)
                img_url = m_dict.get('murl')
                
                if img_url:
                    req_img = urllib.request.Request(img_url, headers=headers)
                    img_data = urllib.request.urlopen(req_img, timeout=5).read()
                    
                    ext = ".jpg"
                    if "png" in img_url.lower(): ext = ".png"
                    elif "webp" in img_url.lower(): ext = ".webp"
                    
                    file_path = save_dir / f"{folder_name}_{count+1}{ext}"
                    with open(file_path, "wb") as f:
                        f.write(img_data)
                    count += 1
            except Exception as e:
                pass
    except Exception as e:
        pass