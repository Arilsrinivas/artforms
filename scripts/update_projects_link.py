with open('src/components/site/Projects.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

if 'import { Link }' not in text:
    text = text.replace(
        'import { useEffect, useState } from "react";',
        'import { useEffect, useState } from "react";\nimport { Link } from "@tanstack/react-router";'
    )

text = text.replace(
    'View Project →',
    'View All Projects & PDFs →'
)
text = text.replace(
    '<span className="text-[12px] uppercase tracking-[0.24em] text-ink story-link">',
    '<Link to="/projects" className="text-[12px] uppercase tracking-[0.24em] text-ink story-link">'
).replace(
    'View All Projects & PDFs →\n                  </span>',
    'View All Projects & PDFs →\n                  </Link>'
)

extra_btn = '''      <div className="mt-10 flex justify-center">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-3 text-xs uppercase tracking-[0.2em] font-medium text-ink hover:bg-ink hover:text-canvas transition-all duration-300 shadow-sm hover:shadow"
        >
          Explore All 128+ Photos & Architectural PDFs →
        </Link>
      </div>
    </section>'''

text = text.replace('    </section>', extra_btn)

with open('src/components/site/Projects.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated Projects.tsx')

with open('src/components/site/Footer.tsx', 'r', encoding='utf-8') as f:
    f_text = f.read()

if '/projects' not in f_text:
    f_text = f_text.replace(
        '<Link to="/updates"',
        '<Link to="/projects" className="text-clay hover:underline block font-medium">All Projects & PDFs</Link>\n            </li>\n            <li className="block">\n              <Link to="/updates"'
    )
    with open('src/components/site/Footer.tsx', 'w', encoding='utf-8') as f:
        f.write(f_text)
    print('Updated Footer.tsx')
