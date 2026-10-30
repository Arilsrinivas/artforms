import os
import glob
import shutil
import fitz
from PIL import Image

def process():
    pdf_out = os.path.abspath('public/projects/pdfs')
    img_out = os.path.abspath('public/projects/images')
    cover_out = os.path.abspath('public/projects/images/pdf-covers')
    os.makedirs(pdf_out, exist_ok=True)
    os.makedirs(img_out, exist_ok=True)
    os.makedirs(cover_out, exist_ok=True)

    # Mapping of PDF filenames on G:
    pdf_mapping = [
        {
            "id": "ashok",
            "file": "20261029-INTERIOR RENDERS-Mr.Ashok.pdf",
            "dest_name": "ashok-luxury-residence.pdf",
            "title": "Mr. Ashok Luxury Villa",
            "client": "Mr. Ashok",
            "location": "KR Puram, Hassan",
            "category": "Residential",
            "pages": 33,
            "badge": "Turnkey Luxury Villa & Interiors",
            "description": "Complete architectural 3D elevation, grand foyer, living hall, fluted teak partitions, carved pooja mandir, master suites, and walk-in wardrobe."
        },
        {
            "id": "sandeep",
            "file": "20260909-INTERIOR RENDERS-Mr.Sandeep.pdf",
            "dest_name": "sandeep-duplex-residence.pdf",
            "title": "Mr. Sandeep Residence",
            "client": "Mr. Sandeep",
            "location": "Vidyanagar, Hassan",
            "category": "Residential",
            "pages": 22,
            "badge": "Double-Height Lounge & Interiors",
            "description": "Double-height family lounge, bespoke teak pooja sanctum, modular kitchen with breakfast counter, and modern master bedrooms."
        },
        {
            "id": "thilak",
            "file": "20260608- Mr.Thilak.pdf",
            "dest_name": "thilak-architectural-villa.pdf",
            "title": "Mr. Thilak Villa",
            "client": "Mr. Thilak",
            "location": "Hassan",
            "category": "Architecture & Interior",
            "pages": 21,
            "badge": "Duplex 3D Elevation & Planning",
            "description": "Duplex exterior 3D elevation design, modern staircase, modular kitchen, pooja room, and master suites."
        },
        {
            "id": "dhanush",
            "file": "20260825-Mr dhanush.pdf",
            "dest_name": "dhanush-residential-interiors.pdf",
            "title": "Mr. Dhanush Residence",
            "client": "Mr. Dhanush",
            "location": "Hassan",
            "category": "Residential",
            "pages": 13,
            "badge": "Modern Residential Interior",
            "description": "Clean lines, ergonomic modular kitchen, cozy dining area, and ambient bedroom designs."
        },
        {
            "id": "dharmaphal",
            "file": "20261013- Mr. DHARMAPHAL RENDERS.pdf",
            "dest_name": "dharmaphal-modular-residence.pdf",
            "title": "Mr. Dharmaphal Residence",
            "client": "Mr. Dharmaphal",
            "location": "Hassan",
            "category": "Interior",
            "pages": 11,
            "badge": "Contemporary Modular Living",
            "description": "Parallel modular kitchen, stylish living room TV console, and modern space-saving wardrobes."
        },
        {
            "id": "dr-nischay",
            "file": "20260901-Dr.Nischay- renders..pdf",
            "dest_name": "dr-nischay-commercial-clinic.pdf",
            "title": "Dr. Nischay Commercial Clinic & Pharmacy",
            "client": "Dr. Nischay",
            "location": "BM Road, Hassan",
            "category": "Commercial",
            "pages": 5,
            "badge": "Commercial Healthcare Space",
            "description": "Turnkey commercial clinic execution with custom pharmacy dispensing counter, medical inventory racks, and consultation room."
        }
    ]

    print("Copying PDFs and rendering high-res covers...")
    pdf_catalog = []
    for item in pdf_mapping:
        src_path = os.path.join("G:/ARTFORM", item["file"])
        dest_pdf = os.path.join(pdf_out, item["dest_name"])
        shutil.copy2(src_path, dest_pdf)
        size_mb = os.path.getsize(dest_pdf) / (1024 * 1024)

        # Render first page as high-res cover image
        doc = fitz.open(src_path)
        first_page = doc[0]
        pix = first_page.get_pixmap(dpi=150)
        cover_filename = f"cover-{item['id']}.jpg"
        cover_webp = f"cover-{item['id']}.webp"
        cover_path = os.path.join(cover_out, cover_filename)
        cover_webp_path = os.path.join(cover_out, cover_webp)
        pix.save(cover_path)
        
        # Also save webp
        im_cov = Image.open(cover_path)
        im_cov.save(cover_webp_path, "WEBP", quality=88)

        pdf_catalog.append({
            "id": item["id"],
            "title": item["title"],
            "client": item["client"],
            "location": item["location"],
            "category": item["category"],
            "badge": item["badge"],
            "description": item["description"],
            "pages": len(doc),
            "size": f"{size_mb:.1f} MB",
            "pdfUrl": f"/projects/pdfs/{item['dest_name']}",
            "coverUrl": f"/projects/images/pdf-covers/{cover_webp}",
            "filename": item["dest_name"]
        })
        print(f"  Processed PDF: {item['dest_name']} ({len(doc)} pages, {size_mb:.2f} MB)")

    # Optimize all 128 images from catalogue/extracted
    print("\nOptimizing 128 authentic project images...")
    extracted_files = glob.glob("catalogue/extracted/*.*")
    images_catalog = []

    # Helper to categorize extracted image
    def get_meta(fname):
        fn = os.path.basename(fname).lower()
        if "ashok" in fn:
            return "ashok", "Mr. Ashok Luxury Villa", "Residential", "KR Puram, Hassan", "3D Interior Render"
        elif "sandeep" in fn:
            return "sandeep", "Mr. Sandeep Residence", "Residential", "Vidyanagar, Hassan", "Interior Walkthrough"
        elif "thilak" in fn:
            return "thilak", "Mr. Thilak Villa", "Architecture & Interior", "Hassan", "Duplex Elevation & Interior"
        elif "dhanush" in fn:
            return "dhanush", "Mr. Dhanush Residence", "Residential", "Hassan", "Interior Design"
        elif "dharmaphal" in fn:
            return "dharmaphal", "Mr. Dharmaphal Residence", "Interior", "Hassan", "Modular Living & Kitchen"
        elif "nischay" in fn:
            return "dr-nischay", "Dr. Nischay Clinic & Pharmacy", "Commercial", "BM Road, Hassan", "Commercial Clinic"
        else:
            return "civil-site", "Civil Construction Execution", "Civil Works", "Project Site, Hassan", "On-Site Structural Construction"

    img_idx = 1
    for f in sorted(extracted_files):
        base_name = os.path.basename(f)
        try:
            im = Image.open(f)
            if im.mode in ('RGBA', 'P'):
                im = im.convert('RGB')
            
            # Max width 1600
            max_w = 1600
            if im.width > max_w:
                ratio = max_w / float(im.width)
                new_h = int(float(im.height) * ratio)
                im_opt = im.resize((max_w, new_h), Image.Resampling.LANCZOS)
            else:
                im_opt = im

            proj_id, proj_title, category, location, space_type = get_meta(base_name)
            clean_name = f"proj-{proj_id}-{img_idx:03d}"
            
            webp_path = os.path.join(img_out, f"{clean_name}.webp")
            jpg_path = os.path.join(img_out, f"{clean_name}.jpg")
            
            im_opt.save(webp_path, "WEBP", quality=85)
            im_opt.save(jpg_path, "JPEG", quality=85)

            images_catalog.append({
                "id": f"img-{img_idx}",
                "projectId": proj_id,
                "projectTitle": proj_title,
                "category": category,
                "location": location,
                "spaceType": space_type,
                "url": f"/projects/images/{clean_name}.webp",
                "fallbackUrl": f"/projects/images/{clean_name}.jpg",
                "width": im_opt.width,
                "height": im_opt.height,
                "aspectRatio": round(im_opt.width / im_opt.height, 2)
            })
            img_idx += 1
        except Exception as e:
            print(f"  Error processing image {base_name}: {e}")

    print(f"Successfully processed {len(images_catalog)} images.")

    # Project groupings
    projects_list = [
        {
            "id": "all",
            "name": "All Works",
            "count": len(images_catalog),
            "pdfCount": len(pdf_catalog)
        },
        {
            "id": "ashok",
            "name": "Mr. Ashok Luxury Villa",
            "category": "Residential",
            "location": "KR Puram, Hassan",
            "badge": "Turnkey Villa & Luxury Interiors",
            "count": sum(1 for img in images_catalog if img["projectId"] == "ashok"),
            "pdf": next((p for p in pdf_catalog if p["id"] == "ashok"), None)
        },
        {
            "id": "sandeep",
            "name": "Mr. Sandeep Residence",
            "category": "Residential",
            "location": "Vidyanagar, Hassan",
            "badge": "Double-Height Lounge & Modular",
            "count": sum(1 for img in images_catalog if img["projectId"] == "sandeep"),
            "pdf": next((p for p in pdf_catalog if p["id"] == "sandeep"), None)
        },
        {
            "id": "thilak",
            "name": "Mr. Thilak Villa",
            "category": "Architecture & Interior",
            "location": "Hassan",
            "badge": "Duplex 3D Elevation & Planning",
            "count": sum(1 for img in images_catalog if img["projectId"] == "thilak"),
            "pdf": next((p for p in pdf_catalog if p["id"] == "thilak"), None)
        },
        {
            "id": "dhanush",
            "name": "Mr. Dhanush Residence",
            "category": "Residential",
            "location": "Hassan",
            "badge": "Modern Residential Interior",
            "count": sum(1 for img in images_catalog if img["projectId"] == "dhanush"),
            "pdf": next((p for p in pdf_catalog if p["id"] == "dhanush"), None)
        },
        {
            "id": "dharmaphal",
            "name": "Mr. Dharmaphal Residence",
            "category": "Interior",
            "location": "Hassan",
            "badge": "Modular Kitchen & Living",
            "count": sum(1 for img in images_catalog if img["projectId"] == "dharmaphal"),
            "pdf": next((p for p in pdf_catalog if p["id"] == "dharmaphal"), None)
        },
        {
            "id": "dr-nischay",
            "name": "Dr. Nischay Commercial Clinic",
            "category": "Commercial",
            "location": "BM Road, Hassan",
            "badge": "Commercial Healthcare Interior",
            "count": sum(1 for img in images_catalog if img["projectId"] == "dr-nischay"),
            "pdf": next((p for p in pdf_catalog if p["id"] == "dr-nischay"), None)
        },
        {
            "id": "civil-site",
            "name": "Hassan Civil Construction Execution",
            "category": "Civil Works",
            "location": "Ongoing Sites, Hassan",
            "badge": "Foundation, Reinforcement & Structural",
            "count": sum(1 for img in images_catalog if img["projectId"] == "civil-site"),
            "pdf": None
        }
    ]

    # Write TypeScript data file
    os.makedirs("src/data", exist_ok=True)
    import json
    ts_content = f"""// Auto-generated Artforms authentic projects and architectural presentations catalog
export interface ProjectImage {{
  id: string;
  projectId: string;
  projectTitle: string;
  category: string;
  location: string;
  spaceType: string;
  url: string;
  fallbackUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
}}

export interface ProjectPdf {{
  id: string;
  title: string;
  client: string;
  location: string;
  category: string;
  badge: string;
  description: string;
  pages: number;
  size: string;
  pdfUrl: string;
  coverUrl: string;
  filename: string;
}}

export interface ProjectGroup {{
  id: string;
  name: string;
  category?: string;
  location?: string;
  badge?: string;
  count: number;
  pdfCount?: number;
  pdf?: ProjectPdf | null;
}}

export const PROJECT_PDFS: ProjectPdf[] = {json.dumps(pdf_catalog, indent=2)};

export const PROJECT_GROUPS: ProjectGroup[] = {json.dumps(projects_list, indent=2)};

export const PROJECT_IMAGES: ProjectImage[] = {json.dumps(images_catalog, indent=2)};
"""
    with open("src/data/projects-catalog.ts", "w", encoding="utf-8") as f:
        f.write(ts_content)
    print("\nSaved src/data/projects-catalog.ts successfully!")

if __name__ == "__main__":
    process()
