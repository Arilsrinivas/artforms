import re

def update_nav():
    path = "src/components/site/Nav.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    wa_url = "https://wa.me/918147131315?text=Hello%20Artforms%20Civil%20and%20Interiors%2C%20I%20would%20like%20to%20get%20a%20free%20quote%20for%20my%20project."

    old_btn = re.search(r'<a\s+href="#cta"\s+className=\{`shrink-0.*?Get Free Quote\s+</a>', text, re.DOTALL)
    if old_btn:
        new_btn = f'''<a
          href="{wa_url}"
          target="_blank"
          rel="noopener noreferrer"
          className={{`shrink-0 rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[0.14em] sm:tracking-[0.16em] lg:tracking-[0.2em] transition-all duration-300 inline-block ${{
            scrolled
              ? "border-ink/80 text-ink hover:bg-ink hover:text-canvas"
              : "border-canvas/80 text-canvas hover:bg-canvas hover:text-ink"
          }}`}}
        >
          Get Free Quote
        </a>'''
        text = text[:old_btn.start()] + new_btn + text[old_btn.end():]
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        print("Updated Nav.tsx with direct WhatsApp chat link.")

def update_footer():
    path = "src/components/site/Footer.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    wa_url = "https://wa.me/918147131315?text=Hello%20Artforms%20Civil%20and%20Interiors%2C%20I%20would%20like%20to%20get%20a%20free%20quote%20for%20my%20project."
    
    text = text.replace(
        "<li>+91 98450 12345</li>",
        f'<li><a href="{wa_url}" target="_blank" rel="noopener noreferrer" className="hover:text-clay transition-colors font-medium flex items-center gap-1">+91 81471 31315 (WhatsApp)</a></li>'
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated Footer.tsx with WhatsApp contact.")

def update_cta():
    path = "src/components/site/CTA.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    wa_url = "https://wa.me/918147131315?text=Hello%20Artforms%20Civil%20and%20Interiors%2C%20I%20would%20like%20to%20get%20a%20free%20quote%20for%20my%20project."

    text = text.replace(
        "Visit us at 10th Cross, KR Puram, Hassan · Call +91 98450 12345",
        f'Visit us at 10th Cross, KR Puram, Hassan · WhatsApp: <a href="{wa_url}" target="_blank" rel="noopener noreferrer" className="text-clay hover:underline font-semibold">+91 81471 31315</a>'
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated CTA.tsx with WhatsApp link.")

def update_projects():
    path = "src/routes/projects.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    wa_url = "https://wa.me/918147131315?text=Hello%20Artforms%20Civil%20and%20Interiors%2C%20I%20would%20like%20to%20get%20a%20free%20quote%20for%20my%20project."

    old_btn = '<a\n            href="/#cta"\n            className="rounded-full bg-ink text-canvas hover:bg-clay px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors shrink-0"\n          >\n            Request Free Estimate\n          </a>'
    new_btn = f'<a\n            href="{wa_url}"\n            target="_blank"\n            rel="noopener noreferrer"\n            className="rounded-full bg-ink text-canvas hover:bg-clay px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors shrink-0 shadow-sm"\n          >\n            Get Free Quote on WhatsApp\n          </a>'

    text = text.replace(old_btn, new_btn)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated projects.tsx with WhatsApp quote link.")

if __name__ == "__main__":
    update_nav()
    update_footer()
    update_cta()
    update_projects()
