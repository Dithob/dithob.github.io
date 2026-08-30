[English](README.en.md) | 中文

# Dithob personal website & profile

个人主页 + GitHub Profile 的一体化仓库：**一个事实源，两个发布面**。

- **个人网站**：Astro 静态站（`src/`），默认发布于 <https://dithob.github.io>，提供中英双语与 5 套可切换视觉主题（neo-brutalist / editorial / minimalist-flat / bento-grid / geometric-bold）。
- **GitHub Profile**：`profile/README*.md` 是 `Dithob/Dithob` Profile README 的源副本，二者由 CI（可选）自动同步。
- 定位是**求职导向的证据优先主页**：项目、简历、笔记三者闭环，每个项目都带源码、验证证据和明确限制。

---

## 一、架构总览

### 目录结构

```text
dithob.github.io/
├── .github/workflows/
│   ├── deploy.yml           # Pages 部署：push main 时 check + build + 上传 artifact
│   └── sync-profile.yml     # （可选）把 profile/README*.md 同步到 Dithob/Dithob 仓库
├── docs/                    # 设计与维护文档（见下文「文档索引」）
├── profile/                 # GitHub Profile README 源文件（中英，与本仓库其他内容同仓库管理）
│   ├── README.md
│   └── README.en.md
├── public/                  # 静态资源，构建时原样拷入 dist 根目录
│   ├── CNAME.example        # 自定义域名占位（配好域名后改名为 CNAME）
│   ├── downloads/
│   │   └── resume-testdevelop.pdf   # 简历 PDF（AiDeveloperResume 编译产物）
│   ├── favicon.svg
│   ├── images/og.png        # 社交分享图 1200×630（SVG 不渲染，勿换回 svg）
│   └── robots.txt           # 指向 /sitemap-index.xml
├── scripts/
│   ├── verify-site.mjs      # 结构检查（存在性 + 内容红线），发布前本地运行
│   └── sync-profile.mjs     # profile 同步脚本（--check / --publish）
├── src/
│   ├── components/
│   │   └── ProjectCard.astro        # 项目卡片组件（zh/en 复用）
│   ├── content.config.ts            # 内容集合定义：notes collection + zod schema
│   ├── content/
│   │   └── notes/                   # 笔记正文（由 mediareport 发布脚本生成，勿手改）
│   │       ├── pi-usage-manual.md
│   │       └── superpowers-harness-engineering.md
│   ├── data.ts                      # ★ 单一事实源：site / brand / projects / themes / signals ...
│   ├── layouts/
│   │   └── BaseLayout.astro         # ★ 公共布局：head(SEO/JSON-LD/og)、导航、主题菜单、footer、全部全局样式
│   └── pages/
│       ├── index.astro              # 首页（zh）
│       ├── about.astro              # 关于（zh）
│       ├── resume.astro             # 在线简历（zh）
│       ├── 404.astro                # 404（zh）
│       ├── notes/
│       │   ├── index.astro          # 笔记墙：按主题分组（主题数 < 2 退化为时间倒序）+ 延伸阅读
│       │   └── [...slug].astro      # 笔记正文页（渲染 markdown + 来源 facts）
│       ├── projects/
│       │   ├── index.astro          # 项目列表
│       │   └── [slug].astro         # 项目详情页（由 data.ts 自动生成）
│       ├── 404.astro                # 404（zh）
│       └── en/                      # 英文镜像：与上层一一对应（index/about/resume/404/notes/projects）
├── astro.config.mjs         # Astro 配置：site URL、trailingSlash、@astrojs/sitemap、Shiki css-variables
├── package.json
├── tsconfig.json
└── .nvmrc                   # Node 22
```

> `public/` 里的 `CNAME.example` 只有在绑定自定义域名时才启用；`og.svg` 已删除（社交平台不渲染 SVG），请保持 `og.png`。

### 核心设计

| 机制 | 说明 |
| --- | --- |
| **数据驱动项目** | 全部项目在 `src/data.ts` 的 `projects` 数组中定义；首页精选、项目列表、`/projects/<slug>/` 详情页（中英 6×2 = 12 页）全部由它生成，不存在第二份项目数据 |
| **双语镜像** | 每个页面有 `src/pages/`（zh）与 `src/pages/en/`（en）两个版本；`BaseLayout` 根据 `path`/`lang` 自动生成 canonical + `hreflang` alternate。笔记正文只有中文，详情页通过 `alternatePath="/en/notes/"` 把 alternate 指向英文摘要墙，避免 404 |
| **笔记单向同步** | `src/content/notes/*.md` 是**转换产物**：由 `mediareport` 仓库的 `scripts/publish-notes.mjs --write` 生成（剥离副产物导航、slug 化、附 frontmatter）。改正文请改源仓库再重新生成，勿直接编辑站点里的 md |
| **主题系统** | 5 套主题由 CSS 变量驱动（`--bg/--surface/--accent/--shadow...`）；用户选择存 `localStorage('dithob-visual-theme-v2')`，初始化脚本位于 `<head>` 内联执行，避免首屏闪变；深色 `geometric-bold` 通过 `color-scheme: dark` + 变量切换 |
| **SEO 自动生成** | `@astrojs/sitemap` 构建时生成 `/sitemap-index.xml`（自动含全部 collection 与项目详情页，filter 掉 `/404/`）；首页内联 JSON-LD Person（name/url/sameAs/email）；所有页面共用 `og.png`（1200×630） |
| **可访问性约定** | 导航当前项 `aria-current="page"`；≤430px 时导航文字用视觉隐藏（clip）+ `aria-label`，以图标呈现（不用 `font-size:0`）；主题菜单为 `ul > li > button`；editorial 主题正文小字对比度 ≥ 4.5:1 |
| **Profile 同步** | `profile/README*.md` 为事实源，`sync-profile.yml` 在 push 时用 `scripts/sync-profile.mjs --publish` 推送到 `Dithob/Dithob`（无需 token 时自动跳过发布只做校验），详见 `docs/profile-maintenance.md` |

---

## 二、本地开发

前置要求：[Node 22](https://nodejs.org/)（见 `.nvmrc`）、npm。

```bash
npm ci                # 安装依赖（用 ci 而不是 install，保证 lockfile 一致）
npm run dev           # 开发服务器，默认 http://localhost:4321
npm run check         # astro check：类型与内容 schema 校验（笔记 frontmatter 不匹配会在这里报）
npm run build         # 构建到 dist/
npm run preview       # 本地预览构建产物
node scripts/verify-site.mjs   # 结构门禁：必需文件、笔记数量、og.png、简历 mailto/PDF
```

发布（推送到 main 即自动触发）前最小检查链：

```bash
npm run check && npm run build && node scripts/verify-site.mjs
```

---

## 三、复用操作指南（把此架构改造成你自己的）

### 0. 直接复制

```bash
git clone <本仓库> my-site && cd my-site
npm ci
npm run dev
```

> 如果你部署到的是**子路径仓库**（如 `username.github.io/repo-name/`），需在 `astro.config.mjs` 增加 `base: '/repo-name/'`，并把站内所有绝对链接（`/notes/`、`/projects/` 等）改为带 base 的相对形式；建议直接使用 `<user>.github.io` 仓库名以省去这一步。

### 1. 替换成你的身份（必改清单）

| 内容 | 位置 |
| --- | --- |
| 站点 URL / 昵称 / GitHub 链接 / 邮箱 | `src/data.ts` → `site`（`name / shortName / github / website / mail`） |
| 定位与口号 | `src/data.ts` → `brand`（`role / tagline / positioning`，含英文） |
| 首页 long copy | `src/pages/index.astro` + `src/pages/en/index.astro` |
| JSON-LD 个人实体 | `src/layouts/BaseLayout.astro` → 前端 `personJsonLd`（name / sameAs / email） |
| 社交分享图 | 替换 `public/images/og.png`（必须 1200×630 光栅图） |
| 站点图标 | `public/favicon.svg` |
| robots/sitemap URL | `public/robots.txt`（若自定义域名） |
| profile 文案 | `profile/README.md` + `profile/README.en.md` |
| 简历内容 | `src/pages/resume.astro` + `src/pages/en/resume.astro` + `public/downloads/*.pdf` |
| 域名 | `public/CNAME.example` → `public/CNAME`（只含域名）+ `astro.config.mjs` 的 `site` |

改完后跑一遍 `npm run check && npm run build && node scripts/verify-site.mjs`。

### 2. 新增 / 修改项目

**只编辑 `src/data.ts`**：在 `projects` 数组加一个对象（`slug / code / accent / title(En) / category(En) / status(En) / summary(En) / stack / repository / evidence / limitations(En)`）。`accent` 可选 `pink/lime/blue/orange/purple/red`；`featured: true` 会出现在首页精选区。

自动生效：

- `/projects/` 列表页与 `/projects/<slug>/` 详情页（中英）
- sitemap（构建时自动收录）
- 首页 ProjectCard

### 3. 新增笔记

**推荐路径（与 mediareport 知识库联动）**：

```bash
# 1. 在 mediareport/media-note/ 放正文，并在其 README.md 索引表加一行
# 2. 在 mediareport/scripts/publish.config.mjs 的 notes 里加同一条目（slug/分类/摘要）
# 3. 生成：
cd D:/TestProjects/mediareport
node scripts/publish-notes.mjs            # 预演（只报告）
node scripts/publish-notes.mjs --write    # 写入 src/content/notes/
# 4. 回站点仓库提交
```

**手写路径**：直接在 `src/content/notes/` 放 `.md`，frontmatter 必须匹配 `src/content.config.ts` 的 schema：

```yaml
---
title: "标题"
titleEn: "English title"
type: "note"            # note | guide | manual
typeLabel: "笔记"
category: "AI / Agent"  # 分组键：≥2 个不同分类时按主题分组
categoryEn: "AI / Agent"
summary: "中文摘要"
summaryEn: "English summary"
source: "来源名称"
sourceTitle: ""         # 可空
sourceUrl: "https://..."
author: ""              # 可空
duration: ""            # 可空
sourceId: ""            # 可空
date: "2026-08-30"
draft: false
---
```

正文直接写 Markdown：表格 / 引用 / 行内代码 / 代码块（Shiki `css-variables`，跟随主题）/ 锚点跳转（sticky header 已预留 `scroll-margin-top`）均有样式，无需额外配置。

### 4. 新增普通页面

1. 复制一份 `src/pages/` 页面到 `src/pages/en/` 对应位置，反向改写链接（`/projects/` → `/en/projects/`）；
2. `<BaseLayout title=... description=... path="/xxx/">`，`path` 必须是带尾斜杠的站内路径（`trailingSlash: 'always'`）；英文页加 `lang="en" path="/en/xxx/"`；
3. 若详情页无英文版，给 zh 页面传 `alternatePath="/en/xxx/"` 指向英文墙（参考 `src/pages/notes/[...slug].astro`）；
4. 如需纳入 CI 门禁，把新路径加进 `scripts/verify-site.mjs` 的 `required` 数组。

### 5. 视觉主题改造（可选）

主题由「数组 + CSS 变量块 + 菜单样式」三处组成：

- `src/data.ts` → `themes` 数组（菜单文案）
- `src/layouts/BaseLayout.astro` → 主题 CSS 变量块（`:root[data-theme='xxx'] {...}`）+ 各主题覆盖样式（`[data-theme='xxx'] .xxx {...}`）
- 脚本里两处 `validThemes`（head 初始化 + body 交互）要同步增删主题 id

删除主题：只留一个时，`themes` 数组留一项、删除多余 CSS 变量块即可；`validThemes` 两处同步。新增主题：`themes` 加一项 + 变量块 + 需要时加覆盖样式，并补 `theme-option-<id>` 的菜单配色。

深色主题额外注意：`color-scheme: dark` + `--bg/--text` 反色；代码块用全局 `--astro-code-*` 变量统一为深色卡片，无需逐主题覆盖。

### 6. 部署

- **默认 GitHub Pages**：push 到 main 即由 `.github/workflows/deploy.yml` 构建部署（Pages 发布源必须保持 GitHub Actions；不要切回 branch 模式，否则 Jekyll 会误解析）。
- **自定义域名**：① 在 GitHub 账户验证域名；② `public/CNAME.example` 复制为 `public/CNAME`（只含域名）；③ 更新 `astro.config.mjs` 的 `site` 与 `public/robots.txt` 的 Sitemap URL；④ 配置 DNS 与 HTTPS。**不要提交 `YOUR_DOMAIN` 这类占位 CNAME**。

### 7. Profile README 同步（可选）

- 仓库内 `profile/` 是事实源，`sync-profile.yml` 监听其变更并自动推送到目标 Profile 仓库（默认 `Dithob/Dithob`，改 `scripts/sync-profile.mjs` 的 `targetRepo`）。
- 需要跨仓库写权限时配置 Secret `PROFILE_REPO_TOKEN`（fine-grained token，仅目标仓库、Contents Read/Write）；不配置则只执行 `--check` 校验，Profile 仓库需手动复制。
- 完整说明与 token 创建步骤：`docs/profile-maintenance.md`。

### 8. 常见坑

| 坑 | 处理 |
| --- | --- |
| 移动端导航断了主题切换/折叠 | `BaseLayout` 的 430px 断点用 clip 隐藏文字、图标由 `::after` 提供；新导航项要同步加 nth-child 图标规则 |
| 手写 sitemap 漏页 | 已用 `@astrojs/sitemap`，不要再添加 `public/sitemap.xml` |
| 笔记正文改了被覆盖 | 站点内 `src/content/notes/` 是生成物，改 mediareport 源后重跑脚本 |
| `og:image` 不显示 | 用光栅图（PNG/JPG），`og.png` 已被引用；换图保持 1200×630 |
| 拼音/中文锚点跳不动 | Astro 默认 github-slugger；升级 Astro 后实测一次笔记内锚点（`#附录-aasr-还原对照表` 这类） |

---

## 四、文档索引

| 文档 | 内容 |
| --- | --- |
| `docs/deployment.md` | 部署方式与自定义域名步骤 |
| `docs/profile-maintenance.md` | Profile README 的单一事实源与自动/手动同步 |
| `docs/site-notes-publishing.md` | 笔记单向发布方案（mediareport → 站点） |
| `docs/site-optimization-plan.md` | 2026-08 优化计划 + 执行记录（含简历/联系方式落地说明） |

---

## 五、License 与内容边界

- 代码/架构可直接复用（个人项目，未指定 License 时默认保留权利；如需声明请补充 LICENSE 文件）。
- **请勿直接复制本仓库中的个人内容**（真实姓名、邮箱、实习经历、简历 PDF、项目证据）；复用时应替换为自己的真实信息，且注意：公开网站上的任何内容都必须已脱敏。
