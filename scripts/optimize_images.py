import os
from PIL import Image

ASSETS_DIR = os.path.abspath('src/assets')
os.makedirs(ASSETS_DIR, exist_ok=True)

MAPPING = {
    # 1. Hero Slides
    "hero-1": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p3_img1.jpeg",
        "target_name": "hero-1",
        "descriptive": "artforms-hero-ashok-living-room",
        "max_w": 1600,
        "max_h": 900
    },
    "hero-2": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p32_img1.jpeg",
        "target_name": "hero-2",
        "descriptive": "artforms-hero-ashok-front-elevation",
        "max_w": 1600,
        "max_h": 900
    },
    "hero-3": {
        "src": "catalogue/extracted/20260909-INTERIOR_RENDERS-Mr_Sandeep_p22_img1.jpeg",
        "target_name": "hero-3",
        "descriptive": "artforms-hero-sandeep-double-height-hall",
        "max_w": 1600,
        "max_h": 900
    },

    # 2. Projects Section
    "project-1": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p2_img1.jpeg",
        "target_name": "project-1",
        "descriptive": "artforms-project-ashok-foyer",
        "max_w": 1400,
        "max_h": 875
    },
    "project-1-over": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p9_img1.jpeg",
        "target_name": "project-1-over",
        "descriptive": "artforms-project-ashok-pooja",
        "max_w": 800,
        "max_h": 1000
    },
    "project-2": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p8_img1.jpeg",
        "target_name": "project-2",
        "descriptive": "artforms-project-ashok-dining-partition",
        "max_w": 1400,
        "max_h": 875
    },
    "project-2-over": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p12_img1.jpeg",
        "target_name": "project-2-over",
        "descriptive": "artforms-project-ashok-vanity",
        "max_w": 800,
        "max_h": 1000
    },
    "project-3": {
        "src": "catalogue/extracted/20260909-INTERIOR_RENDERS-Mr_Sandeep_p5_img1.jpeg",
        "target_name": "project-3",
        "descriptive": "artforms-project-sandeep-modular-kitchen",
        "max_w": 1400,
        "max_h": 875
    },
    "project-3-over": {
        "src": "catalogue/extracted/20260909-INTERIOR_RENDERS-Mr_Sandeep_p8_img1.jpeg",
        "target_name": "project-3-over",
        "descriptive": "artforms-project-sandeep-pooja-room",
        "max_w": 800,
        "max_h": 1000
    },
    "project-4": {
        "src": "catalogue/extracted/20260901-Dr_Nischay-_renders__p2_img1.jpeg",
        "target_name": "project-4",
        "descriptive": "artforms-project-nischay-clinic-counter",
        "max_w": 1400,
        "max_h": 875
    },
    "project-4-over": {
        "src": "catalogue/extracted/20260901-Dr_Nischay-_renders__p3_img1.jpeg",
        "target_name": "project-4-over",
        "descriptive": "artforms-project-nischay-storage-rack",
        "max_w": 800,
        "max_h": 1000
    },
    "project-5": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p14_img1.jpeg",
        "target_name": "project-5",
        "descriptive": "artforms-project-ashok-master-bedroom",
        "max_w": 1400,
        "max_h": 875
    },
    "project-5-over": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p16_img1.jpeg",
        "target_name": "project-5-over",
        "descriptive": "artforms-project-ashok-walkin-wardrobe",
        "max_w": 800,
        "max_h": 1000
    },

    # 3. Journal Articles
    "inspiration-1": {
        "src": "catalogue/extracted/WhatsApp Image 2026-10-30 at 12.59.05 PM.jpeg",
        "target_name": "inspiration-1",
        "descriptive": "artforms-journal-site-foundation",
        "max_w": 1000,
        "max_h": 1250
    },
    "inspiration-2": {
        "src": "catalogue/extracted/20261013-_Mr__DHARMAPHAL_RENDERS_p4_img1.jpeg",
        "target_name": "inspiration-2",
        "descriptive": "artforms-journal-modular-kitchen",
        "max_w": 1000,
        "max_h": 1250
    },
    "inspiration-3": {
        "src": "catalogue/extracted/20260608-_Mr_Thilak_p4_img1.jpeg",
        "target_name": "inspiration-3",
        "descriptive": "artforms-journal-3d-elevation",
        "max_w": 1000,
        "max_h": 1250
    },

    # 4. Styles Section (6 specific design styles)
    "style-1": {
        "src": "catalogue/extracted/FEATURE WALL.jpeg",
        "target_name": "style-modern-minimalist",
        "descriptive": "artforms-style-modern-minimalist",
        "max_w": 900,
        "max_h": 1200
    },
    "style-2": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p29_img1.jpeg",
        "target_name": "style-contemporary-luxury",
        "descriptive": "artforms-style-contemporary-luxury",
        "max_w": 900,
        "max_h": 1200
    },
    "style-3": {
        "src": "catalogue/extracted/20260608-_Mr_Thilak_p8_img1.jpeg",
        "target_name": "style-traditional-heritage",
        "descriptive": "artforms-style-traditional-heritage",
        "max_w": 900,
        "max_h": 1200
    },
    "style-4": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p5_img1.jpeg",
        "target_name": "style-modular-interiors",
        "descriptive": "artforms-style-modular-interiors",
        "max_w": 900,
        "max_h": 1200
    },
    "style-5": {
        "src": "catalogue/extracted/20260901-Dr_Nischay-_renders__p4_img1.jpeg",
        "target_name": "style-commercial-executive",
        "descriptive": "artforms-style-commercial-executive",
        "max_w": 900,
        "max_h": 1200
    },
    "style-6": {
        "src": "catalogue/extracted/20261029-INTERIOR_RENDERS-Mr_Ashok_p33_img1.jpeg",
        "target_name": "style-elevation-facade",
        "descriptive": "artforms-style-elevation-facade",
        "max_w": 900,
        "max_h": 1200
    },

    # 5. Testimonials Section
    "testimonial-1": {
        "src": "catalogue/extracted/20260909-INTERIOR_RENDERS-Mr_Sandeep_p13_img1.jpeg",
        "target_name": "testimonial-1",
        "descriptive": "artforms-testimonial-kr-puram",
        "max_w": 900,
        "max_h": 1125
    },
    "testimonial-2": {
        "src": "catalogue/extracted/20260825-Mr_dhanush_p7_img1.jpeg",
        "target_name": "testimonial-2",
        "descriptive": "artforms-testimonial-vidyanagar",
        "max_w": 900,
        "max_h": 1125
    },
    "testimonial-3": {
        "src": "catalogue/extracted/20260901-Dr_Nischay-_renders__p2_img1.jpeg",
        "target_name": "testimonial-3",
        "descriptive": "artforms-testimonial-bm-road",
        "max_w": 900,
        "max_h": 1125
    }
}

def optimize_and_save(src_path, dest_base_name, max_w, max_h):
    if not os.path.exists(src_path):
        print(f"Warning: Source not found: {src_path}")
        return

    im = Image.open(src_path)
    if im.mode in ('RGBA', 'P'):
        im = im.convert('RGB')

    # Maintain original aspect ratio without distortion
    orig_w, orig_h = im.size
    ratio = min(max_w / orig_w, max_h / orig_h, 1.0) # only downscale if larger
    new_w = int(orig_w * ratio)
    new_h = int(orig_h * ratio)

    if ratio < 1.0:
        im_resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
    else:
        im_resized = im

    # 1. Save optimized WebP
    webp_path = os.path.join(ASSETS_DIR, f"{dest_base_name}.webp")
    im_resized.save(webp_path, "WEBP", quality=88, method=6)

    # 2. Save optimized JPEG
    jpg_path = os.path.join(ASSETS_DIR, f"{dest_base_name}.jpg")
    im_resized.save(jpg_path, "JPEG", quality=88, progressive=True, optimize=True)

    webp_size = os.path.getsize(webp_path) / 1024
    jpg_size = os.path.getsize(jpg_path) / 1024
    print(f"  Optimized {dest_base_name}: {new_w}x{new_h} | WebP: {webp_size:.1f} KB | JPG: {jpg_size:.1f} KB")

def main():
    print(f"Optimizing {len(MAPPING)} authentic image assets...")
    for key, cfg in MAPPING.items():
        src = os.path.abspath(cfg["src"])
        # Save with target_name (e.g. hero-1, project-1, style-modern-minimalist)
        optimize_and_save(src, cfg["target_name"], cfg["max_w"], cfg["max_h"])
        # Also save with descriptive_name
        optimize_and_save(src, cfg["descriptive"], cfg["max_w"], cfg["max_h"])
    print("\nOptimization complete! All WebP and high-res JPEG assets generated.")

if __name__ == '__main__':
    main()
