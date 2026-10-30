import os
import glob
import fitz
from PIL import Image

def main():
    out_dir = os.path.abspath('catalogue/extracted')
    thumb_dir = os.path.abspath('catalogue/thumbnails')
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(thumb_dir, exist_ok=True)

    # 1. Standalone images in G:/ARTFORM
    artform_imgs = glob.glob('G:/ARTFORM/*.jpeg') + glob.glob('G:/ARTFORM/*.jpg') + glob.glob('G:/ARTFORM/*.png')
    print(f"Found {len(artform_imgs)} standalone images in G:/ARTFORM.")
    for p in artform_imgs:
        fname = os.path.basename(p)
        try:
            im = Image.open(p)
            # Normalize to RGB if RGBA/P
            if im.mode in ('RGBA', 'P'):
                im_rgb = im.convert('RGB')
            else:
                im_rgb = im
            dest_path = os.path.join(out_dir, fname)
            im_rgb.save(dest_path)
            
            thumb = im_rgb.copy()
            thumb.thumbnail((400, 300))
            thumb_name = 'thumb_' + os.path.splitext(fname)[0] + '.jpg'
            thumb.save(os.path.join(thumb_dir, thumb_name), 'JPEG', quality=85)
            print(f"  [IMG] {fname}: {im.size[0]}x{im.size[1]}")
        except Exception as e:
            print(f"  Error processing {fname}: {e}")

    # 2. Extract from PDFs in G:/ARTFORM
    pdfs = glob.glob('G:/ARTFORM/*.pdf')
    print(f"\nFound {len(pdfs)} PDFs in G:/ARTFORM.")
    extracted_count = 0
    for pdf in pdfs:
        pdf_base = os.path.splitext(os.path.basename(pdf))[0]
        # Clean pdf_base for safe filenames
        clean_base = "".join(c if c.isalnum() or c in ('-', '_') else '_' for c in pdf_base)
        try:
            doc = fitz.open(pdf)
            for pno in range(len(doc)):
                page = doc[pno]
                img_list = page.get_images()
                for idx, img in enumerate(img_list):
                    xref = img[0]
                    base = doc.extract_image(xref)
                    width = base['width']
                    height = base['height']
                    ext = base['ext']
                    # Skip tiny logos or icons (< 600px width/height)
                    if width < 600 or height < 500:
                        continue
                    ext_fname = f"{clean_base}_p{pno+1}_img{idx+1}.{ext}"
                    ext_path = os.path.join(out_dir, ext_fname)
                    with open(ext_path, 'wb') as f:
                        f.write(base['image'])
                    
                    im = Image.open(ext_path)
                    if im.mode in ('RGBA', 'P'):
                        im_rgb = im.convert('RGB')
                    else:
                        im_rgb = im
                    thumb = im_rgb.copy()
                    thumb.thumbnail((400, 300))
                    thumb_name = 'thumb_' + os.path.splitext(ext_fname)[0] + '.jpg'
                    thumb.save(os.path.join(thumb_dir, thumb_name), 'JPEG', quality=85)
                    extracted_count += 1
                    print(f"  [PDF-IMG] {ext_fname}: {width}x{height}")
        except Exception as e:
            print(f"  Error reading PDF {pdf}: {e}")

    print(f"\nExtraction complete! Total extracted from PDFs: {extracted_count}")

if __name__ == '__main__':
    main()
