# 设计与架构说明（DESIGN.md）

> 本文档说明站点的架构设计与关键实现思路；日常操作与复用指南见 `README.md`。

## 1. 总体设计

| 决策 | 说明 |
| --- | --- |
| **一个事实源，两个发布面** | 身份/项目/简历数据只有一份（`src/data.ts` + `src/content/` + `profile/`），分别驱动个人网站与 GitHub Profile 两个展示面，避免双仓库漂移 |
| **静态优先** | Astro 纯静态输出（`output: 'static'`）+ GitHub Pages，零服务器成本，秒级构建（~1.5s / 26 页） |
| **证据优先** | 每个项目卡片带源码链接、验证证据与明确限制（`evidence / limitations`），简历、笔记、项目三块互为佐证，定位求职场景 |
| **双语镜像** | 中文为主内容，英文为镜像；不做 i18n 运行时路由，而是「每页一对」的静态镜像，保证 SEO 的 canonical/hreflang 干净 |
| **生成物不入编辑流** | `src/content/notes/*.md`、sitemap、og.png 都是生成/产物，源在 mediareport 与 AiDeveloperResume，避免手工编辑被覆盖 |

## 2. 目录结构

```text
dithob.github.io/
├── .github/workflows/
│   ├── deploy.yml           # Pages 部署：push main 时 check + build + 上传 artifact
│   └── sync-profile.yml     # （可选）把 profile/README*.md 同步到 Dithob/Dithob 仓库
├── docs/                    # 设计与维护文档（deployment / profile-maintenance / site-notes-publishing / site-optimization-plan）
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

## 3. 核心设计机制

### 3.1 单一事实源 `src/data.ts`

`site / brand / projects / themes` 全部集中在一个 TypeScript 文件，页面与组件只 import 不复制：

- `site`：`name / shortName / github / website / mail` —— 邮箱是联系方式唯一入口，footer / about / resume 共用；
- `projects`：`slug / code / accent / title / category / status / summary / stack / repository / evidence / limitations`（各含 En 字段）—— 一个对象同时驱动首页精选（`featured`）、项目列表、`/projects/<slug>/` 详情页与 sitemap，共 6×2 = 12 页；
- `themes`：主题菜单文案（与 BaseLayout 的 CSS 变量块、脚本里两处 `validThemes` 三方联动）。

**为什么不抽 CMS**：个人静态站维护量小，Git + TS 数据 + PR 的版本记录 / 预览 / 回滚能力远超 CMS 收益；未来若长文本继续膨胀，再统一迁到 Content Collections，但不应产生第二份事实源。

### 3.2 双语镜像与 SEO 关联

- 每个页面存在 `src/pages/`（zh）与 `src/pages/en/`（en）两份；`<BaseLayout lang="en" path="/en/xxx/">` 自动输出：
  - `<html lang>`、canonical、`hreflang="zh"` / `hreflang="en"` alternate（成对出现）；
- 笔记正文只有中文：详情页通过 `alternatePath="/en/notes/"` 把 alternate 指向英文摘要墙，保证 hreflang 指向真实存在页面、不产生 404；
- `trailingSlash: 'always'`：所有站内 URL 统一带尾斜杠，避免双 URL 收录。

### 3.3 笔记内容集合与单向同步

- `src/content.config.ts` 用 `defineCollection + glob loader + zod schema` 定义 notes 集合；schema 用 Zod 4 写法（如 `z.url()` 而非弃用的 `z.string().url()`），`astro check` 负责校验 frontmatter；
- `src/content/notes/*.md` 是**转换产物**：由 mediareport 仓库的 `scripts/publish-notes.mjs --write` 生成（剥离副产物导航、slug 化文件名、附加结构化 frontmatter）；改正文必须改源仓库再重跑，直接编辑会被覆盖；
- `/notes/` 分组逻辑：不同 `category` ≥ 2 时按主题分组展示；仅 1 个分类时退化为时间倒序列表；底部「延伸阅读」承接原 `data.ts` 硬编码外链卡片（已删除）；
- 首页 `06 / LATEST NOTES` 用 `getCollection('notes')` 取最新 4 篇，与笔记墙共用同一数据源。

### 3.4 视觉主题系统

- 5 套主题（neo-brutalist / editorial / minimalist-flat / bento-grid / geometric-bold）由 CSS 变量驱动（`--bg / --surface / --accent / --shadow ...`），组件样式零主题判断；
- 用户选择存 `localStorage('dithob-visual-theme-v2')`；**初始化脚本内联在 `<head>` 且用 IIFE 隔离作用域**，首帧前即写入 `data-theme`，避免闪变（FOUC）；
- 深色主题 `geometric-bold` 通过 `color-scheme: dark` + 变量反色实现；
- 代码块用 Shiki `css-variables` 主题 + 全局 `--astro-code-*` 变量，任何主题下都是深色卡片，无需逐主题覆盖；
- 增删主题需同步三处：`data.ts` 的 `themes` 数组、BaseLayout 的 CSS 变量块、脚本中两处 `validThemes`。

### 3.5 SEO 与分享

- `@astrojs/sitemap` 构建时自动生成 `/sitemap-index.xml`：自动收录 collection 与项目详情页，`filter` 排除 `/404/`；robots.txt 指向它（手写 `public/sitemap.xml` 已删除，勿恢复）；
- 首页内联 **JSON-LD Person**（`name / url / sameAs / email`），与页面可见信息一致；
- `og:image` 用 `og.png`（1200×630 光栅图）：SVG 在主流平台不渲染，已替换；所有页面共用一张；
- `public/favicon.svg` 与主题色联动（不随主题变，保持品牌一致）。

### 3.6 可访问性

- 导航当前项标 `aria-current="page"`；
- ≤430px 导航：文字用 **clip 视觉隐藏 + `aria-label`**，以 `::after` 字形（↗/CV/✦/◎）呈现——不采用 `font-size:0`（读屏会漏词）；
- 主题菜单语义为 `ul > li > button`（曾误加 `role="listitem"`，已移除）；
- editorial 主题 `--subtle` 对比度从 3.35:1 提到 5.4:1（AA），正文小字 ≥ 4.5:1；
- 笔记标题锚点预留 `scroll-margin-top`，适配 sticky header。

### 3.7 简历与联系方式

- 简历页（`resume.astro` / `en/resume.astro`）承载**真实内容**（腾讯云智测开实习、智能持续测试平台、腾讯地图 Agent、在校成果、教育背景、技能），替代原占位文案；
- PDF 下载 `public/downloads/resume-testdevelop.pdf`：由 AiDeveloperResume 仓库 `build.bat main_testdevelop.tex`（xelatex/MiKTeX）编译复制，网页与 PDF 双形态；
- 邮箱 `site.mail`（2508807574@qq.com）在 footer / about / resume（中英）统一以 `mailto:` 呈现——联系方式只维护一处；
- **注意**：PDF 内含真实姓名与电话，若不想公开，删除 `public/downloads/` 并去掉 resume 页 PDF 链接即可。

### 3.8 GitHub Profile 同步

- `profile/README*.md` 是 `Dithob/Dithob` Profile README 的事实源；
- `sync-profile.yml` 监听 `profile/` 变更，用 `scripts/sync-profile.mjs --publish`（GIT_ASKPASS + fine-grained token）推送到目标仓库；未配置 `PROFILE_REPO_TOKEN` 时只做 `--check` 源校验，自动跳过发布；
- 两个 workflow 互不干扰：sync 不触发 Pages 构建，deploy 不修改源码。

### 3.9 构建与验证链

```text
npm run check   →  astro check：类型 + content schema（frontmatter 不符在这里报）
npm run build   →  dist/（26 页 + sitemap-index.xml + 静态资源）
node scripts/verify-site.mjs → 结构门禁：必需页面/笔记数量/og.png/mailto/简历 PDF
```

发布前最小链：`npm run check && npm run build && node scripts/verify-site.mjs`；push main 后 deploy.yml 自动部署。

## 4. 已知取舍与坑

| 坑 | 处理 |
| --- | --- |
| 手写 sitemap 漏页 | 已用 `@astrojs/sitemap`，不要再添加 `public/sitemap.xml` |
| 笔记正文被覆盖 | `src/content/notes/` 是生成物，改 mediareport 源后重跑脚本 |
| `og:image` 不显示 | 用光栅图（PNG/JPG），保持 1200×630 |
| 移动端导航坏 | 430px 断点用 clip 隐藏文字、图标由 `::after` 提供；新导航项要同步加 nth-child 图标规则 |
| 拼音/中文锚点跳不动 | Astro 默认 github-slugger；升级 Astro 后实测一次笔记内锚点 |
| Windows headless 截图断点不生效 | Chrome 窗口最小宽度钳制（~500px），`--window-size=390` 实际视口 512；真机/DevTools 设备模拟不受影响；验证可临时调断点或改用 CDP `Emulation.setDeviceMetricsOverride` |
| Zod 4 弃用告警 | schema 使用顶层 `z.url()` 等新写法，`astro check` 应保持 0 errors / 0 warnings / 0 hints |

## 5. 演进方向

- 若长文本（About/Resume 详述）继续膨胀：统一迁入 `src/content/` 集合，页面只读不复制；
- 每篇笔记的独立 OG 图（当前全站共用一张）；
- 部署可平滑切到 Cloudflare Pages / Vercel（纯静态，无供应商绑定）。
