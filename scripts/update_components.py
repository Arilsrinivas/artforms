import re

def update_projects():
    path = 'src/components/site/Projects.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    old_import = """import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import i1 from "@/assets/inspiration-1.jpg";
import i2 from "@/assets/inspiration-2.jpg";
import i3 from "@/assets/inspiration-3.jpg";"""

    new_import = """import p1 from "@/assets/project-1.jpg";
import p1Over from "@/assets/project-1-over.jpg";
import p2 from "@/assets/project-2.jpg";
import p2Over from "@/assets/project-2-over.jpg";
import p3 from "@/assets/project-3.jpg";
import p3Over from "@/assets/project-3-over.jpg";
import p4 from "@/assets/project-4.jpg";
import p4Over from "@/assets/project-4-over.jpg";
import p5 from "@/assets/project-5.jpg";
import p5Over from "@/assets/project-5-over.jpg";"""

    old_featured = """const featured = [
  { title: "Krishnaraja Villa", loc: "KR Puram, Hassan", year: "2024", cover: p1, over: i2 },
  { title: "Ananda Residence", loc: "Vidyanagar, Hassan", year: "2024", cover: p2, over: i3 },
  { title: "Sri Manjunatha Haven", loc: "Shanthi Nagar, Hassan", year: "2023", cover: p3, over: i1 },
  { title: "Apex Commercial Plaza", loc: "BM Road, Hassan", year: "2023", cover: p4, over: i2 },
  { title: "Sampige Luxury Villa", loc: "Kuvempunagar, Hassan", year: "2022", cover: p5, over: i3 },
];"""

    new_featured = """const featured = [
  { title: "Krishnaraja Villa", loc: "KR Puram, Hassan", year: "2024", cover: p1, over: p1Over },
  { title: "Ananda Residence", loc: "Vidyanagar, Hassan", year: "2024", cover: p2, over: p2Over },
  { title: "Sri Manjunatha Haven", loc: "Shanthi Nagar, Hassan", year: "2023", cover: p3, over: p3Over },
  { title: "Apex Commercial Plaza", loc: "BM Road, Hassan", year: "2023", cover: p4, over: p4Over },
  { title: "Sampige Luxury Villa", loc: "Kuvempunagar, Hassan", year: "2022", cover: p5, over: p5Over },
];"""

    content = content.replace(old_import.replace('\n', '\r\n'), new_import.replace('\n', '\r\n'))
    content = content.replace(old_import, new_import)
    content = content.replace(old_featured.replace('\n', '\r\n'), new_featured.replace('\n', '\r\n'))
    content = content.replace(old_featured, new_featured)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated Projects.tsx")

def update_styles():
    path = 'src/components/site/Styles.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    old_import = """import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import i1 from "@/assets/inspiration-1.jpg";"""

    new_import = """import style1 from "@/assets/style-modern-minimalist.jpg";
import style2 from "@/assets/style-contemporary-luxury.jpg";
import style3 from "@/assets/style-traditional-heritage.jpg";
import style4 from "@/assets/style-modular-interiors.jpg";
import style5 from "@/assets/style-commercial-executive.jpg";
import style6 from "@/assets/style-elevation-facade.jpg";"""

    old_styles = """const styles = [
  { name: "Modern Minimalist", img: p1, tone: "Sleek, space-saving, functional" },
  { name: "Contemporary Luxury", img: p2, tone: "Rich textures, premium finishes" },
  { name: "Traditional Heritage", img: p3, tone: "Teak accents, regional elegance" },
  { name: "Modular Interiors", img: p4, tone: "Ergonomic, customizable, clean" },
  { name: "Commercial Executive", img: p5, tone: "Professional, ambient, inviting" },
  { name: "Elevation & Facade", img: i1, tone: "Bold geometry, modern materials" },
];"""

    new_styles = """const styles = [
  { name: "Modern Minimalist", img: style1, tone: "Sleek, space-saving, functional" },
  { name: "Contemporary Luxury", img: style2, tone: "Rich textures, premium finishes" },
  { name: "Traditional Heritage", img: style3, tone: "Teak accents, regional elegance" },
  { name: "Modular Interiors", img: style4, tone: "Ergonomic, customizable, clean" },
  { name: "Commercial Executive", img: style5, tone: "Professional, ambient, inviting" },
  { name: "Elevation & Facade", img: style6, tone: "Bold geometry, modern materials" },
];"""

    content = content.replace(old_import.replace('\n', '\r\n'), new_import.replace('\n', '\r\n'))
    content = content.replace(old_import, new_import)
    content = content.replace(old_styles.replace('\n', '\r\n'), new_styles.replace('\n', '\r\n'))
    content = content.replace(old_styles, new_styles)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated Styles.tsx")

def update_testimonials():
    path = 'src/components/site/Testimonials.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    old_import = """import i2 from "@/assets/inspiration-2.jpg";
import i3 from "@/assets/inspiration-3.jpg";
import p1 from "@/assets/project-1.jpg";"""

    new_import = """import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";"""

    old_quotes = """const quotes = [
  {
    text: "Artforms delivered our home construction and interior work with exceptional quality. The 3D elevation matched the finished home 100%!",
    name: "Rajesh Gowda",
    project: "KR Puram Villa · Hassan",
    img: p1,
  },
  {
    text: "Over 22 years of experience truly shows. From foundation civil work to modular interior installation, everything was handled seamlessly.",
    name: "Suresh & Vidya M.",
    project: "Vidyanagar Residence · Hassan",
    img: i2,
  },
  {
    text: "They handled our commercial showroom's entire civil remodeling and interior design within our budget. Highly recommended contractors in Hassan!",
    name: "Dr. Ramesh Kumar",
    project: "BM Road Commercial · Hassan",
    img: i3,
  },
];"""

    new_quotes = """const quotes = [
  {
    text: "Artforms delivered our home construction and interior work with exceptional quality. The 3D elevation matched the finished home 100%!",
    name: "Rajesh Gowda",
    project: "KR Puram Villa · Hassan",
    img: t1,
  },
  {
    text: "Over 22 years of experience truly shows. From foundation civil work to modular interior installation, everything was handled seamlessly.",
    name: "Suresh & Vidya M.",
    project: "Vidyanagar Residence · Hassan",
    img: t2,
  },
  {
    text: "They handled our commercial showroom's entire civil remodeling and interior design within our budget. Highly recommended contractors in Hassan!",
    name: "Dr. Ramesh Kumar",
    project: "BM Road Commercial · Hassan",
    img: t3,
  },
];"""

    content = content.replace(old_import.replace('\n', '\r\n'), new_import.replace('\n', '\r\n'))
    content = content.replace(old_import, new_import)
    content = content.replace(old_quotes.replace('\n', '\r\n'), new_quotes.replace('\n', '\r\n'))
    content = content.replace(old_quotes, new_quotes)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated Testimonials.tsx")

if __name__ == '__main__':
    update_projects()
    update_styles()
    update_testimonials()
