import urllib.request
import subprocess
import time
import os
import sys

def test_projects_page():
    # Start vite dev server
    proc = subprocess.Popen(
        ["npx", "vite", "--port", "5177"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        shell=True
    )
    time.sleep(3)

    try:
        url = "http://localhost:5177/projects"
        print(f"Requesting {url}...")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            html = resp.read().decode('utf-8')
            print(f"  Status: {status}")
            print(f"  Length: {len(html)} bytes")
            assert status == 200, "Expected status 200"
            assert "Architectural" in html or "Projects" in html or "projects" in html.lower(), "Page title/content missing"

        # Check a PDF file status
        pdf_url = "http://localhost:5177/projects/pdfs/ashok-luxury-residence.pdf"
        print(f"Testing PDF asset {pdf_url}...")
        with urllib.request.urlopen(pdf_url, timeout=10) as resp:
            print(f"  PDF Status: {resp.status}, Content-Length: {resp.headers.get('Content-Length')}")
            assert resp.status == 200

        # Check a project image status
        img_url = "http://localhost:5177/projects/images/proj-civil-site-001.webp"
        print(f"Testing Image asset {img_url}...")
        with urllib.request.urlopen(img_url, timeout=10) as resp:
            print(f"  Image Status: {resp.status}, Content-Length: {resp.headers.get('Content-Length')}")
            assert resp.status == 200

        # Check an Ashok project image status
        img_ashok = "http://localhost:5177/projects/images/proj-ashok-081.webp"
        print(f"Testing Ashok Image asset {img_ashok}...")
        with urllib.request.urlopen(img_ashok, timeout=10) as resp:
            print(f"  Image Status: {resp.status}, Content-Length: {resp.headers.get('Content-Length')}")
            assert resp.status == 200

        # Check PDF cover image
        cov_url = "http://localhost:5177/projects/images/pdf-covers/cover-ashok.webp"
        print(f"Testing Cover asset {cov_url}...")
        with urllib.request.urlopen(cov_url, timeout=10) as resp:
            print(f"  Cover Status: {resp.status}, Content-Length: {resp.headers.get('Content-Length')}")
            assert resp.status == 200

        print("\nAll HTTP tests passed successfully!")
    finally:
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)], capture_output=True, shell=True)

if __name__ == "__main__":
    test_projects_page()
