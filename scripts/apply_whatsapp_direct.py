import re

def update_nav():
    path = "src/components/site/Nav.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if "openWhatsAppChat" not in text:
        text = 'import { openWhatsAppChat, getWhatsAppDirectUrl } from "@/lib/whatsapp";\n' + text

    # Update quote button
    old_btn = re.search(r'<a\s+href="https://wa\.me/.*?".*?Get Free Quote\s+</a>', text, re.DOTALL)
    if old_btn:
        new_btn = '''<a
          href={getWhatsAppDirectUrl()}
          onClick={openWhatsAppChat}
          className={`shrink-0 rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[0.14em] sm:tracking-[0.16em] lg:tracking-[0.2em] transition-all duration-300 inline-block cursor-pointer ${
            scrolled
              ? "border-ink/80 text-ink hover:bg-ink hover:text-canvas"
              : "border-canvas/80 text-canvas hover:bg-canvas hover:text-ink"
          }`}
        >
          Get Free Quote
        </a>'''
        text = text[:old_btn.start()] + new_btn + text[old_btn.end():]

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated Nav.tsx with direct WhatsApp app integration.")

def update_footer():
    path = "src/components/site/Footer.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if "openWhatsAppChat" not in text:
        text = 'import { openWhatsAppChat, getWhatsAppDirectUrl } from "@/lib/whatsapp";\n' + text

    old_link = re.search(r'<a\s+href="https://wa\.me/.*?"\s+target="_blank".*?\+91 81471 31315 \(WhatsApp\)</a>', text, re.DOTALL)
    if old_link:
        new_link = '''<a
                href={getWhatsAppDirectUrl()}
                onClick={openWhatsAppChat}
                className="hover:text-clay transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                +91 81471 31315 (WhatsApp)
              </a>'''
        text = text[:old_link.start()] + new_link + text[old_link.end():]

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated Footer.tsx with direct WhatsApp app integration.")

def update_cta():
    path = "src/components/site/CTA.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if "openWhatsAppChat" not in text:
        text = 'import { openWhatsAppChat, getWhatsAppDirectUrl } from "@/lib/whatsapp";\n' + text

    old_link = re.search(r'<a\s+href="https://wa\.me/.*?".*?\+91 81471 31315</a>', text, re.DOTALL)
    if old_link:
        new_link = '''<a
              href={getWhatsAppDirectUrl()}
              onClick={openWhatsAppChat}
              className="text-clay hover:underline font-semibold cursor-pointer"
            >
              +91 81471 31315
            </a>'''
        text = text[:old_link.start()] + new_link + text[old_link.end():]

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated CTA.tsx with direct WhatsApp app integration.")

def update_projects():
    path = "src/routes/projects.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if "openWhatsAppChat" not in text:
        text = 'import { openWhatsAppChat, getWhatsAppDirectUrl } from "@/lib/whatsapp";\n' + text

    old_btn = re.search(r'<a\s+href="https://wa\.me/.*?".*?Get Free Quote on WhatsApp\s+</a>', text, re.DOTALL)
    if old_btn:
        new_btn = '''<a
            href={getWhatsAppDirectUrl()}
            onClick={openWhatsAppChat}
            className="rounded-full bg-ink text-canvas hover:bg-clay px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            Get Free Quote on WhatsApp
          </a>'''
        text = text[:old_btn.start()] + new_btn + text[old_btn.end():]

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated projects.tsx with direct WhatsApp app integration.")

if __name__ == "__main__":
    update_nav()
    update_footer()
    update_cta()
    update_projects()
