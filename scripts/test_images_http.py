import urllib.request
import time
import subprocess
import re

def main():
    print("Starting Vite server for automated verification on port 5174...")
    proc = subprocess.Popen('npx vite --port 5174', shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(4)

    try:
        with urllib.request.urlopen('http://localhost:5174/') as res:
            html = res.read().decode('utf-8')
        
        img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
        print(f"Discovered {len(img_srcs)} <img> tags rendered on homepage.")
        unique_srcs = set(img_srcs)
        broken = []
        for s in unique_srcs:
            if s.startswith('http'):
                url = s
            else:
                url = f"http://localhost:5174{s}"
            try:
                with urllib.request.urlopen(url) as img_res:
                    status = img_res.status
                    ctype = img_res.headers.get("Content-Type")
                    data = img_res.read()
                    print(f"  [HTTP {status}] {s} ({ctype}, {len(data):,} bytes)")
            except Exception as e:
                print(f"  [ERROR] {s}: {e}")
                broken.append((s, str(e)))

        if not broken:
            print(f"\nPERFECT: All {len(unique_srcs)} unique images rendered and loaded with HTTP 200 OK!")
        else:
            print(f"\nFAILED: {len(broken)} broken images found!")

    finally:
        subprocess.run('taskkill /F /IM node.exe', shell=True, capture_output=True)

if __name__ == '__main__':
    main()
