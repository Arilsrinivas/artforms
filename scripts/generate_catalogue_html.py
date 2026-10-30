import os
import glob
import hashlib
from PIL import Image

def get_file_hash(filepath):
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        buf = f.read(65536)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(65536)
    return hasher.hexdigest()

def main():
    extracted_dir = os.path.abspath('catalogue/extracted')
    thumb_dir = os.path.abspath('catalogue/thumbnails')
    html_out = os.path.abspath('catalogue/index.html')

    # Group files by project/source
    groups = {
        "Standalone Site & Project Photos": [],
        "Mr. Ashok Residence (Luxury Villa & 3D Elevation)": [],
        "Mr. Sandeep Residence (Interiors & Double Height)": [],
        "Mr. Thilak Residence (Turnkey Civil & Interior)": [],
        "Mr. Dharmaphal Residence (Interior Renders)": [],
        "Mr. Dhanush Residence (Spatial Planning & Interiors)": [],
        "Dr. Nischay Commercial / Clinic Interiors": [],
        "Other Assets": []
    }

    files = sorted(glob.glob(os.path.join(extracted_dir, '*.*')))
    print(f"Total extracted files to catalogue: {len(files)}")

    hash_map = {}
    duplicates = set()

    for f in files:
        fhash = get_file_hash(f)
        if fhash in hash_map:
            duplicates.add(f)
            duplicates.add(hash_map[fhash])
        else:
            hash_map[fhash] = f

    for f in files:
        fname = os.path.basename(f)
        thumb_name = 'thumb_' + os.path.splitext(fname)[0] + '.jpg'
        thumb_path = os.path.join(thumb_dir, thumb_name)
        if not os.path.exists(thumb_path):
            thumb_path = f # fallback

        im = Image.open(f)
        w, h = im.size
        ar = w / h
        if ar > 1.15:
            orient = "Landscape"
        elif ar < 0.85:
            orient = "Portrait"
        else:
            orient = "Square"

        item = {
            "name": fname,
            "width": w,
            "height": h,
            "ar": f"{ar:.2f}",
            "orientation": orient,
            "thumb": os.path.relpath(thumb_path, os.path.dirname(html_out)).replace('\\', '/'),
            "src": os.path.relpath(f, os.path.dirname(html_out)).replace('\\', '/'),
            "is_dup": f in duplicates,
            "size_kb": f"{os.path.getsize(f) / 1024:.1f} KB"
        }

        # Categorize
        if fname.startswith("20261029-INTERIOR_RENDERS-Mr_Ashok"):
            groups["Mr. Ashok Residence (Luxury Villa & 3D Elevation)"].append(item)
        elif fname.startswith("20260909-INTERIOR_RENDERS-Mr_Sandeep"):
            groups["Mr. Sandeep Residence (Interiors & Double Height)"].append(item)
        elif fname.startswith("20260608-_Mr_Thilak"):
            groups["Mr. Thilak Residence (Turnkey Civil & Interior)"].append(item)
        elif fname.startswith("20261013-_Mr__DHARMAPHAL"):
            groups["Mr. Dharmaphal Residence (Interior Renders)"].append(item)
        elif fname.startswith("20260825-Mr_dhanush"):
            groups["Mr. Dhanush Residence (Spatial Planning & Interiors)"].append(item)
        elif fname.startswith("20260901-Dr_Nischay"):
            groups["Dr. Nischay Commercial / Clinic Interiors"].append(item)
        elif "WhatsApp" in fname or "FEATURE" in fname or "TV UNIT" in fname or fname in ["123.jpeg", "12.jpeg", "012.jpeg", "0000.jpeg"]:
            groups["Standalone Site & Project Photos"].append(item)
        else:
            groups["Other Assets"].append(item)

    # Generate HTML
    html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Artforms - Authentic Visual Image Catalogue</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #121214; color: #E4E4E7; padding: 32px 24px; line-height: 1.5; }
    header { max-width: 1400px; margin: 0 auto 36px; padding-bottom: 24px; border-bottom: 1px solid #27272A; }
    h1 { font-size: 28px; font-weight: 300; letter-spacing: -0.02em; color: #FAFAFA; }
    h1 em { font-style: italic; color: #D97706; }
    p.subtitle { color: #A1A1AA; font-size: 14px; margin-top: 6px; }
    .stats { display: flex; gap: 24px; margin-top: 16px; flex-wrap: wrap; }
    .stat-badge { background: #27272A; border-radius: 6px; padding: 6px 14px; font-size: 12px; color: #F4F4F5; }
    .stat-badge strong { color: #F59E0B; }
    .group-section { max-width: 1400px; margin: 0 auto 48px; }
    .group-title { font-size: 20px; font-weight: 500; color: #F4F4F5; margin-bottom: 18px; padding-left: 8px; border-left: 4px solid #D97706; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .card { background: #18181B; border: 1px solid #27272A; border-radius: 10px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; display: flex; flex-col; justify-content: space-between; }
    .card:hover { transform: translateY(-3px); border-color: #D97706; }
    .thumb-wrap { position: relative; width: 100%; aspect-ratio: 16/10; background: #09090B; overflow: hidden; }
    .thumb-wrap img { width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.3s; }
    .thumb-wrap:hover img { transform: scale(1.04); }
    .badge { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); font-size: 10px; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge.dup { top: 8px; left: 8px; right: auto; background: #DC2626; color: #FFF; }
    .info { padding: 14px; }
    .filename { font-size: 12px; font-weight: 600; color: #FAFAFA; word-break: break-all; margin-bottom: 6px; line-height: 1.3; }
    .meta { font-size: 11px; color: #71717A; display: flex; justify-content: space-between; margin-top: 4px; }
    .meta span strong { color: #A1A1AA; }
    .view-btn { display: inline-block; margin-top: 10px; font-size: 11px; color: #D97706; text-decoration: none; font-weight: 500; }
    .view-btn:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <h1>Artforms Authentic <em>Photograph & Render Catalogue</em></h1>
    <p class="subtitle">Complete inventory of authentic project renders, site photographs, and architectural documentation scanned from external storage.</p>
    <div class="stats">
      <div class="stat-badge">Total Discovered: <strong>""" + str(len(files)) + """ assets</strong></div>
      <div class="stat-badge">Standalone High-Res Photos: <strong>""" + str(len(groups["Standalone Site & Project Photos"])) + """</strong></div>
      <div class="stat-badge">Extracted Project PDF Renders: <strong>""" + str(len(files) - len(groups["Standalone Site & Project Photos"])) + """</strong></div>
      <div class="stat-badge">Client Projects Represented: <strong>6 major Hassan residences & clinics</strong></div>
    </div>
  </header>
"""

    for grp_name, items in groups.items():
        if not items:
            continue
        html += f"""
  <div class="group-section">
    <h2 class="group-title">{grp_name} ({len(items)} items)</h2>
    <div class="grid">
"""
        for it in items:
            dup_badge = '<span class="badge dup">Duplicate</span>' if it["is_dup"] else ''
            html += f"""
      <div class="card">
        <div>
          <div class="thumb-wrap">
            <a href="{it["src"]}" target="_blank">
              <img src="{it["thumb"]}" alt="{it["name"]}" loading="lazy" />
            </a>
            {dup_badge}
            <span class="badge">{it["orientation"]} · {it["ar"]}</span>
          </div>
          <div class="info">
            <div class="filename">{it["name"]}</div>
            <div class="meta">
              <span>Dim: <strong>{it["width"]}×{it["height"]}</strong></span>
              <span>Size: <strong>{it["size_kb"]}</strong></span>
            </div>
            <a href="{it["src"]}" target="_blank" class="view-btn">Inspect Full Resolution ↗</a>
          </div>
        </div>
      </div>
"""
        html += """
    </div>
  </div>
"""

    html += """
</body>
</html>
"""

    with open(html_out, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Catalogue HTML generated successfully at {html_out}!")

if __name__ == '__main__':
    main()
