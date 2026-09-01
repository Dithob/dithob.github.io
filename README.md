[English](README.en.md) | 中文

# Dithob personal website & profile

个人主页 + GitHub Profile 的一体化仓库：**一个事实源，两个发布面**。

- **个人网站**：Astro 静态站（`src/`），默认发布于 <https://dithob.github.io>，提供中英双语与 5 套可切换视觉主题（neo-brutalist / editorial / minimalist-flat / bento-grid / geometric-bold）。
- **GitHub Profile**：`profile/README*.md` 是 `Dithob/Dithob` Profile README 的源副本，二者由 CI（可选）自动同步。
- 定位是**求职导向的证据优先主页**：项目、简历、笔记三者闭环，每个项目都带源码、验证证据和明确限制。

> 架构细节与设计思路（目录结构、主题系统、SEO 策略、可访问性约定等）见 **[DESIGN.md](DESIGN.md)**。

---

## 一、快速开始

前置要求：[Node 22](https://nodejs.org/)（见 `.nvmrc`）、npm。

```bash
npm ci                # 安装依赖（用 ci 而不是 install，保证 lockfile 一致）
npm run dev           # 开发服务器，默认 http://localhost:4321
```

## 二、本地调试

### 2.1 常用命令

```bash
npm run dev           # 开发模式：改代码即时热更新（HMR），日常调试首选
npm run check         # astro check：类型 + 内容 schema 校验（笔记 frontmatter 不符会在这里报）
npm run build         # 构建到 dist/
npm run preview       # 本地预览构建产物（验证「最终产物」而不是开发态）
node scripts/verify-site.mjs   # 结构门禁：必需页面、笔记数量、og.png、简历 mailto/PDF
```

### 2.2 工作流

| 场景 | 做法 |
| --- | --- |
| 改样式/组件/页面 | `npm run dev`，浏览器访问 `http://localhost:4321`，保存即刷新 |
| 改笔记 frontmatter 或 schema | `npm run check`，报错会指出文件与字段 |
| 验证构建产物 | `npm run build && npm run preview`，再访问 `http://localhost:4321`（`preview` 按 `Ctrl+C` 停止） |
| 发布前全量门禁 | `npm run check && npm run build && node scripts/verify-site.mjs` |
| 抽查单页 | preview 运行中访问 `http://localhost:4321/notes/pi-usage-manual/`、`/about/`、`/projects/<slug>/` 等 |

### 2.3 调试技巧

- **响应式**：Chrome DevTools 的 Devices 模式（F12 → 切换设备工具栏）验证 ≤430px 导航图标形态；注意 Windows 下 headless 截图窗口最小宽度 ~500px 会「吃掉」窄断点，真机与 DevTools 设备模拟不受影响；
- **主题切换**：DevTools → Application → Local Storage 可查看/清除 `dithob-visual-theme-v2`，强制刷新验证初始化脚本（防闪变）；
- **sitemap/SEO**：preview 后访问 `/sitemap-index.xml`、`/robots.txt`；查看页面源码确认 `<link rel="canonical">` 与 `hreflang` alternate；
- **端口冲突**：`npm run dev -- --port 4322` 换端口；
- **前端脚本断点**：主题初始化等内联脚本在 DevTools → Sources → 页面内联 `<script>` 中打断点。

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
| 简历内容 | `src/pages/about.astro` + `src/pages/en/about.astro`（已合并进关于页；下载入口指向 `public/resume.pdf`，请先脱敏再放入该路径） |
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
4. 如需纳入结构门禁，把新路径加进 `scripts/verify-site.mjs` 的 `required` 数组。

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

---

## 四、文档索引

| 文档 | 内容 |
| --- | --- |
| `DESIGN.md` | 架构设计、目录结构、核心设计机制、已知坑与演进方向 |
| `docs/deployment.md` | 部署方式与自定义域名步骤 |
| `docs/profile-maintenance.md` | Profile README 的单一事实源与自动/手动同步 |
| `docs/site-notes-publishing.md` | 笔记单向发布方案（mediareport → 站点） |
| `docs/site-optimization-plan.md` | 2026-08 优化计划 + 执行记录（含简历/联系方式落地说明） |

---

## 五、License 与内容边界

- 代码/架构可直接复用（个人项目，未指定 License 时默认保留权利；如需声明请补充 LICENSE 文件）。
- **请勿直接复制本仓库中的个人内容**（真实姓名、邮箱、实习经历、未脱敏的简历文件、项目证据）；复用时应替换为自己的真实信息，且注意：公开网站上的任何内容都必须已脱敏。
