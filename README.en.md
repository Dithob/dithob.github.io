English | [中文](README.md)

# Dithob personal website & profile

A single-source repository for both the personal website and the GitHub profile: **one source of truth, two publication surfaces**.

- **Personal website**: an Astro static site (`src/`), published at <https://dithob.github.io>, with bilingual (Chinese/English) pages and 5 switchable visual themes (neo-brutalist / editorial / minimalist-flat / bento-grid / geometric-bold).
- **GitHub Profile**: `profile/README*.md` is the source copy of the `Dithob/Dithob` profile README; CI can sync them automatically (optional).
- Positioning: an **evidence-first, job-oriented homepage** where projects, resume, and notes form a closed loop — every project ships with source links, verification evidence, and explicit limitations.

> Architecture details and design rationale (directory layout, theme system, SEO strategy, accessibility conventions, ...) live in **[DESIGN.md](DESIGN.md)** (Chinese).

---

## 1. Quick start

Requirements: [Node 22](https://nodejs.org/) (see `.nvmrc`) and npm.

```bash
npm ci                # Install dependencies (use ci, not install, to keep the lockfile consistent)
npm run dev           # Dev server, default http://localhost:4321
```

## 2. Local debugging

### 2.1 Commands

```bash
npm run dev           # Dev mode with hot reload (HMR); the default choice for day-to-day work
npm run check         # astro check: type + content schema validation (bad note frontmatter fails here)
npm run build         # Build into dist/
npm run preview       # Preview the build output locally (validates the artifact, not the dev state)
node scripts/verify-site.mjs   # Structural gate: required pages, note count, og.png, resume mailto/PDF
```

### 2.2 Workflow

| Scenario | How |
| --- | --- |
| Edit styles/components/pages | `npm run dev`, open `http://localhost:4321`, save and it hot-reloads |
| Edit note frontmatter or schema | `npm run check`; errors point to the file and field |
| Validate the build artifact | `npm run build && npm run preview`, then open `http://localhost:4321` (`Ctrl+C` stops preview) |
| Full gate before publishing | `npm run check && npm run build && node scripts/verify-site.mjs` |
| Spot-check a single page | with preview running: `http://localhost:4321/notes/pi-usage-manual/`, `/resume/`, `/projects/<slug>/`, ... |

### 2.3 Tips

- **Responsive**: use Chrome DevTools device toolbar (F12 → toggle device emulation) to verify the ≤430px glyph nav. Note that headless Chrome on Windows clamps the window width to ~500px, so `--window-size=390` screenshots won't hit narrow breakpoints — real devices and DevTools emulation are unaffected;
- **Theme switching**: DevTools → Application → Local Storage shows/clears `dithob-visual-theme-v2`; hard-reload to check the anti-flash init script;
- **sitemap/SEO**: after `preview`, visit `/sitemap-index.xml` and `/robots.txt`; view page source to confirm `<link rel="canonical">` and `hreflang` alternates;
- **Port conflict**: `npm run dev -- --port 4322`;
- **Inline script breakpoints**: theme init lives in an inline `<script>` in the page — set breakpoints in DevTools → Sources.

---

## 3. Reuse guide (turn this architecture into yours)

### 0. Copy it

```bash
git clone <this-repo> my-site && cd my-site
npm ci
npm run dev
```

> If you deploy to a **sub-path repo** (e.g. `username.github.io/repo-name/`), add `base: '/repo-name/'` to `astro.config.mjs` and rewrite all absolute in-site links (`/notes/`, `/projects/`, ...) to include the base. Prefer a `<user>.github.io` repo name to skip this entirely.

### 1. Replace the identity (must-do checklist)

| Item | Location |
| --- | --- |
| Site URL / display name / GitHub link / email | `src/data.ts` → `site` (`name / shortName / github / website / mail`) |
| Positioning & tagline | `src/data.ts` → `brand` (`role / tagline / positioning`, including English) |
| Homepage long copy | `src/pages/index.astro` + `src/pages/en/index.astro` |
| JSON-LD person entity | `src/layouts/BaseLayout.astro` → `personJsonLd` in the frontmatter (name / sameAs / email) |
| Social share image | Replace `public/images/og.png` (must be a 1200×630 raster image) |
| Favicon | `public/favicon.svg` |
| robots / sitemap URL | `public/robots.txt` (only when using a custom domain) |
| Profile copy | `profile/README.md` + `profile/README.en.md` |
| Resume content | `src/pages/resume.astro` + `src/pages/en/resume.astro` (web version; if you want a PDF, de-identify it first, then put it in `public/` and add the link yourself) |
| Domain | `public/CNAME.example` → `public/CNAME` (domain only) + `site` in `astro.config.mjs` |

Then run `npm run check && npm run build && node scripts/verify-site.mjs`.

### 2. Add or edit projects

**Edit only `src/data.ts`**: append an object to `projects` (`slug / code / accent / title(En) / category(En) / status(En) / summary(En) / stack / repository / evidence / limitations(En)`). `accent` accepts `pink/lime/blue/orange/purple/red`; `featured: true` puts the project in the homepage showcase.

Takes effect automatically:

- `/projects/` list and `/projects/<slug>/` detail pages (zh/en)
- sitemap (included automatically at build time)
- Homepage ProjectCard

### 3. Add notes

**Recommended path (wired to the mediareport knowledge base)**:

```bash
# 1. Put the note body in mediareport/media-note/ and add a row to its README.md index table
# 2. Add a matching entry under notes in mediareport/scripts/publish.config.mjs (slug/category/summaries)
# 3. Generate:
cd D:/TestProjects/mediareport
node scripts/publish-notes.mjs            # dry run (report only)
node scripts/publish-notes.mjs --write    # write into src/content/notes/
# 4. Commit from the site repo
```

**Manual path**: drop a `.md` into `src/content/notes/` with frontmatter matching `src/content.config.ts`:

```yaml
---
title: "标题"
titleEn: "English title"
type: "note"            # note | guide | manual
typeLabel: "笔记"
category: "AI / Agent"  # group key: categories are grouped when ≥2 distinct values exist
categoryEn: "AI / Agent"
summary: "中文摘要"
summaryEn: "English summary"
source: "来源名称"
sourceTitle: ""         # optional
sourceUrl: "https://..."
author: ""              # optional
duration: ""            # optional
sourceId: ""            # optional
date: "2026-08-30"
draft: false
---
```

Body is plain Markdown: tables / blockquotes / inline code / code blocks (Shiki `css-variables`, follows the theme) / anchor jumps (sticky header already reserves `scroll-margin-top`) are all styled — no extra config needed.

### 4. Add a regular page

1. Copy a `src/pages/` page into the matching `src/pages/en/` location and rewrite links (`/projects/` → `/en/projects/`);
2. Use `<BaseLayout title=... description=... path="/xxx/">`; `path` must be a trailing-slash in-site path (`trailingSlash: 'always'`); English pages add `lang="en" path="/en/xxx/"`;
3. If the detail page has no English version, pass `alternatePath="/en/xxx/"` pointing to the English wall (see `src/pages/notes/[...slug].astro`);
4. To include it in the structural gate, add the path to the `required` array in `scripts/verify-site.mjs`.

### 5. Theme customization (optional)

A theme lives in three places that must stay in sync:

- `src/data.ts` → the `themes` array (menu labels)
- `src/layouts/BaseLayout.astro` → theme CSS variable blocks (`:root[data-theme='xxx'] {...}`) + per-theme overrides (`[data-theme='xxx'] .xxx {...}`)
- both `validThemes` arrays in the two inline scripts (head init + body interactions)

To remove a theme: keep one entry in `themes`, delete the extra variable blocks, and update both `validThemes` arrays. To add a theme: add a `themes` entry + variable block + overrides as needed, plus a `theme-option-<id>` menu swatch.

Dark themes additionally need `color-scheme: dark` with inverted `--bg/--text`; code blocks use the global `--astro-code-*` variables for a dark card in every theme, so no per-theme override is needed.

### 6. Deployment

- **Default GitHub Pages**: push to main and `.github/workflows/deploy.yml` builds & deploys (the Pages publishing source must stay on GitHub Actions; do not switch back to branch mode or Jekyll will misparse the output).
- **Custom domain**: ① verify the domain in your GitHub account; ② copy `public/CNAME.example` to `public/CNAME` (domain only); ③ update `site` in `astro.config.mjs` and the Sitemap URL in `public/robots.txt`; ④ configure DNS and HTTPS. **Never commit a placeholder like `YOUR_DOMAIN` as an active CNAME**.

### 7. Profile README sync (optional)

- `profile/` is the source of truth; `sync-profile.yml` watches its changes and pushes to the target profile repo (default `Dithob/Dithob`; change `targetRepo` in `scripts/sync-profile.mjs`).
- Cross-repo write access requires the Secret `PROFILE_REPO_TOKEN` (fine-grained token, single repo, Contents Read/Write); without it the workflow only runs `--check` and you copy the files manually.
- Full details and token setup: `docs/profile-maintenance.md`.

---

## 4. Docs index

| Doc | Content |
| --- | --- |
| `DESIGN.md` | Architecture, directory layout, core design mechanisms, pitfalls and evolution (Chinese) |
| `docs/deployment.md` | Deployment details and custom-domain steps |
| `docs/profile-maintenance.md` | Single source of truth for the profile README + auto/manual sync |
| `docs/site-notes-publishing.md` | One-way note publishing design (mediareport → site) |
| `docs/site-optimization-plan.md` | 2026-08 optimization plan + execution record (includes the resume/contact work) |

---

## 5. License and content boundaries

- The code and architecture are free to reuse (personal project; no License is declared, so rights are reserved by default — add a LICENSE file if you want to nominate one).
- **Do not copy the personal content** in this repo (real name, email, internship experience, non-de-identified resume files, project evidence). When reusing, replace it with your own information and make sure anything published publicly is de-identified.
