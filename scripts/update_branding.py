import os
import re

def update_root():
    path = "src/routes/__root.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    # Normalize meta
    text = re.sub(
        r'\{ title: ".*?" \}',
        '{ title: "Artforms Civil and Interiors Hassan — Architectural Planning, Construction & Interiors" }',
        text,
        count=1
    )
    text = re.sub(
        r'\{ name: "author", content: ".*?" \}',
        '{ name: "author", content: "Artforms Civil and Interiors Hassan" }',
        text,
        count=1
    )
    text = re.sub(
        r'\{ property: "og:title", content: ".*?" \}',
        '{ property: "og:title", content: "Artforms Civil and Interiors Hassan — Architectural Planning, Construction & Interiors" }',
        text,
        count=1
    )
    text = re.sub(
        r'\{ name: "description", content: ".*?" \}',
        '{ name: "description", content: "Artforms Civil and Interiors in Hassan, Karnataka. Over 22 years of expertise in civil construction, 3D elevation, architectural planning, and turnkey interior design." }',
        text,
        count=1
    )
    text = re.sub(
        r'\{ property: "og:description", content: ".*?" \}',
        '{ property: "og:description", content: "Hassan\'s premier one-stop solution for civil construction, 3D elevation, architectural planning, and turnkey interiors." }',
        text,
        count=1
    )

    if 'og:image' not in text:
        text = text.replace(
            '{ property: "og:type", content: "website" },',
            '{ property: "og:image", content: "/logo.jpg" },\n      { property: "og:type", content: "website" },\n      { name: "twitter:title", content: "Artforms Civil and Interiors Hassan" },\n      { name: "twitter:image", content: "/logo.jpg" },'
        )

    if 'apple-touch-icon' not in text:
        text = text.replace(
            '{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" },',
            '{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" },\n      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },'
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated __root.tsx successfully.")

def update_nav():
    path = "src/components/site/Nav.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    # Import logo images if not present
    if "afMarkDark" not in text:
        import_stmt = 'import afMarkDark from "@/assets/logo/af-mark-dark.png";\nimport afMarkWhite from "@/assets/logo/af-mark-white.png";\n'
        text = import_stmt + text

    # Replace logo container in Link
    old_link = re.search(r'<Link to="/" className="flex items-center gap-2 shrink-0">.*?</Link>', text, re.DOTALL)
    if old_link:
        new_link = '''<Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
          <img
            src={scrolled ? afMarkDark : afMarkWhite}
            alt="Artforms Civil and Interiors"
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col leading-none">
            <span
              className={`font-[family-name:var(--font-display)] text-xl sm:text-2xl tracking-[0.04em] font-medium transition-colors ${
                scrolled ? "text-ink" : "text-canvas"
              }`}
            >
              ARTFORMS
            </span>
            <span
              className={`text-[8px] sm:text-[9.5px] tracking-[0.24em] uppercase font-light transition-colors mt-0.5 ${
                scrolled ? "text-ink/70" : "text-canvas/80"
              }`}
            >
              Civil and Interiors
            </span>
          </div>
        </Link>'''
        text = text[:old_link.start()] + new_link + text[old_link.end():]

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated Nav.tsx successfully.")

def update_footer():
    path = "src/components/site/Footer.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if "logoBlack" not in text:
        text = 'import logoBlack from "@/assets/logo/artforms-logo-black.png";\n' + text

    # Replace brand text block
    old_brand = re.search(r'<div className="font-\[family-name:var\(--font-display\)\] text-2xl text-ink">.*?</div>', text, re.DOTALL)
    if old_brand:
        new_brand = '''<Link to="/" className="flex items-center gap-3 group mb-4">
            <img
              src={logoBlack}
              alt="Artforms Civil and Interiors"
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <span className="font-[family-name:var(--font-display)] text-2xl tracking-[0.04em] font-medium text-ink">
                ARTFORMS
              </span>
              <span className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground font-light mt-1">
                Civil and Interiors
              </span>
            </div>
          </Link>'''
        text = text[:old_brand.start()] + new_brand + text[old_brand.end():]

    # Update copyright
    text = re.sub(
        r'Artforms Civil & Interior, Hassan',
        'Artforms Civil and Interiors, Hassan',
        text
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated Footer.tsx successfully.")

def update_updates_feed():
    path = "src/routes/updates.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if "avatarBadge" not in text:
        text = 'import avatarBadge from "@/assets/logo/artforms-avatar-badge.png";\nimport afMarkWhite from "@/assets/logo/af-mark-white.png";\n' + text

    # Update Route head
    if "head: () =>" not in text:
        text = text.replace(
            'export const Route = createFileRoute("/updates")({\n  component: UpdatesPage,\n});',
            '''export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Business Updates & Live Projects | Artforms Civil and Interiors Hassan" },
      { property: "og:title", content: "Business Updates & Live Projects | Artforms Civil and Interiors Hassan" },
      { property: "og:description", content: "Latest project milestones, walkthroughs, and architectural updates from Artforms Civil and Interiors Hassan." },
    ],
  }),
  component: UpdatesPage,
});'''
        )

    # Update Hero banner badge
    text = re.sub(
        r'<span>Artforms Civil & Interior</span>',
        r'<img src={afMarkWhite} alt="AF" className="h-4 w-auto object-contain opacity-80 inline-block mr-1" /><span>Artforms Civil and Interiors</span>',
        text
    )

    # Update Post Card Avatar
    old_avatar = '''                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-ink flex items-center justify-center font-[family-name:var(--font-display)] text-canvas text-lg font-light italic">
                        A
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-ink">Artforms Civil & Interior</span>'''
    
    new_avatar = '''                    <div className="flex items-center gap-3">
                      <img
                        src={avatarBadge}
                        alt="Artforms Civil and Interiors"
                        className="h-10 w-10 rounded-full object-cover border border-ink/10 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-ink tracking-tight">Artforms Civil and Interiors</span>'''
    
    text = text.replace(old_avatar, new_avatar)

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated updates.tsx successfully.")

def update_admin_login():
    path = "src/routes/admin.login.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if "logoBlack" not in text:
        text = 'import logoBlack from "@/assets/logo/artforms-logo-black.png";\n' + text

    # Add Route head
    if "head: () =>" not in text:
        text = text.replace(
            'export const Route = createFileRoute("/admin/login")({\n  component: AdminLoginPage,\n});',
            '''export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Portal | Artforms Civil and Interiors Hassan" },
    ],
  }),
  component: AdminLoginPage,
});'''
        )

    # Replace ShieldCheck with authentic logo in admin login box
    old_header = re.search(r'<div className="text-center mb-8">.*?<h1.*?Admin Portal.*?</h1>.*?<p.*?</div>', text, re.DOTALL)
    if old_header:
        new_header = '''<div className="text-center mb-8">
            <Link to="/" className="inline-block transition-transform hover:scale-105 mb-3">
              <img
                src={logoBlack}
                alt="Artforms Civil and Interiors"
                className="h-14 sm:h-16 w-auto object-contain mx-auto"
              />
            </Link>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-light tracking-tight text-ink">
              Admin Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              Artforms Civil and Interiors · Hassan Owner Portal
            </p>
          </div>'''
        text = text[:old_header.start()] + new_header + text[old_header.end():]
        if "Link," not in text and 'import { createFileRoute, useNavigate }' in text:
            text = text.replace('import { createFileRoute, useNavigate }', 'import { createFileRoute, useNavigate, Link }')

    # Update toast text
    text = text.replace("Artforms Civil & Interior Hassan", "Artforms Civil and Interiors Hassan")

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated admin.login.tsx successfully.")

def update_admin_updates():
    path = "src/routes/admin.business-updates.tsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if "afMarkWhite" not in text:
        text = 'import afMarkWhite from "@/assets/logo/af-mark-white.png";\n' + text

    # Add Route head
    if "head: () =>" not in text:
        text = text.replace(
            'export const Route = createFileRoute("/admin/business-updates")({\n  component: AdminBusinessUpdatesPage,\n});',
            '''export const Route = createFileRoute("/admin/business-updates")({
  head: () => ({
    meta: [
      { title: "Business Updates Dashboard | Artforms Civil and Interiors Admin" },
    ],
  }),
  component: AdminBusinessUpdatesPage,
});'''
        )

    # Add logo mark to admin banner
    old_banner_tag = '<div className="mb-2 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-canvas/50">\n              <span className="h-px w-8 bg-canvas/30" />\n              <span>Admin Dashboard</span>\n            </div>'
    new_banner_tag = '<div className="mb-2 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-canvas/50">\n              <img src={afMarkWhite} alt="AF" className="h-4 w-auto object-contain opacity-70" />\n              <span>Artforms Civil and Interiors · Admin Dashboard</span>\n            </div>'
    text = text.replace(old_banner_tag, new_banner_tag)

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated admin.business-updates.tsx successfully.")

def update_misc():
    # Hero.tsx
    hero_path = "src/components/site/Hero.tsx"
    with open(hero_path, "r", encoding="utf-8") as f:
        h_text = f.read()
    h_text = h_text.replace("Artforms Civil & Interior", "Artforms Civil and Interiors")
    with open(hero_path, "w", encoding="utf-8") as f:
        f.write(h_text)
    print("Updated Hero.tsx")

    # CTA.tsx
    cta_path = "src/components/site/CTA.tsx"
    with open(cta_path, "r", encoding="utf-8") as f:
        c_text = f.read()
    c_text = c_text.replace("Artforms Civil & Interior", "Artforms Civil and Interiors")
    with open(cta_path, "w", encoding="utf-8") as f:
        f.write(c_text)
    print("Updated CTA.tsx")

    # FeaturedPostPopup.tsx
    popup_path = "src/components/site/FeaturedPostPopup.tsx"
    with open(popup_path, "r", encoding="utf-8") as f:
        p_text = f.read()
    if "avatarBadge" not in p_text:
        p_text = 'import avatarBadge from "@/assets/logo/artforms-avatar-badge.png";\n' + p_text
    
    old_announcement = '<span className="text-[10px] uppercase tracking-[0.25em] text-clay font-bold block mb-1">\n                  NEW PROJECT ANNOUNCEMENT\n                </span>'
    new_announcement = '<div className="flex items-center gap-2 mb-2">\n                  <img src={avatarBadge} alt="Artforms" className="h-6 w-6 rounded-full object-cover" />\n                  <span className="text-[10px] uppercase tracking-[0.22em] text-clay font-bold">\n                    Artforms Civil and Interiors\n                  </span>\n                </div>'
    p_text = p_text.replace(old_announcement, new_announcement)
    with open(popup_path, "w", encoding="utf-8") as f:
        f.write(p_text)
    print("Updated FeaturedPostPopup.tsx")

if __name__ == "__main__":
    update_root()
    update_nav()
    update_footer()
    update_updates_feed()
    update_admin_login()
    update_admin_updates()
    update_misc()
