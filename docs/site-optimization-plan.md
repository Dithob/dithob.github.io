# dithob.github.io 优化实施计划

本文是**已确认的实施计划**，融合前期主页分析和 Plan Mode 讨论中确认的关键决策。
关联文档：`docs/site-notes-publishing.md`（笔记发布初稿）。

---

## 一、背景：当前主页的问题

参考前一次分析（针对 https://dithob.github.io/），改进点按优先级排列：

| 优先级 | 问题 | 影响 |
| --- | --- | --- |
| P0 | 简历页仍是占位状态（PDF 未放入、经历未填充） | 对求职/招聘者是负面信号 |
| P0 | 笔记页是“假索引”，3 张卡片全是外链 GitHub 仓库 | 与「证据优先」定位自相矛盾 |
| P0 | 无直接联系方式，只有 GitHub Profile | 转化路径断裂 |
| P1 | sitemap.xml 手写、缺 6 个项目详情页 | 搜索引擎可见性不足 |
| P1 | og:image 是 SVG，社交平台不渲染缩略图 | 分享体验差 |
| P1 | 缺 JSON-LD 结构化数据 | 搜索无法识别个人实体 |
| P2 | 移动导航 `font-size:0` 伪装、主题 menu role 误用、editorial 主题对比度不足 | 可访问性瑕疵 |

## 二、目标

- **求职导向**：主页要能服务 AI 时代的求职场景，项目/笔记/简历三者形成闭环。
- **blog 化**：通过笔记 blog 介绍项目、贴学习笔记和心得。
- **知识库同步**：把 mediareport 知识库里的笔记单向同步到站点。

## 三、已确认的关键决策

| 决策 | 结论 | 理由 |
| --- | --- | --- |
| 笔记同步方向 | **单向**：mediareport → 站点 | 转换产物留在站点，源仓库保留完整副本；双向要处理逆变换和冲突 |
| 笔记分类 | **按主题分类**（AI / Agent、RAG/OCR、测试工程等） | 模仿 quant67.com，比 bugstack 式教程体系更适合求职者 |
| 首页改版 | **保留现有区块形态**，只新增"最新笔记"区块；不改 hero/项目/能力 | 保留 5 套视觉主题，省心 |
| sitemap | **接入 `@astrojs/sitemap`** | 自动生成，避免手写 sitemap 漏新笔记页；项目详情页也自动进入 |
| JSON-LD | 补 Person + sameAs schema | 用主页和 GitHub 的 URL 声明个人实体 |
| 联系方式 | 补 mailto: 或易联系入口 | 消除转化路径断裂 |

## 四、实施清单

### 4.1 笔记系统（核心）

| 文件 | 动作 | 说明 |
| --- | --- | --- |
| `docs/site-notes-publishing.md` | 已存在，作为本次施工的蓝本之一 | 单向同步设计 |
| `D:/TestProjects/mediareport/scripts/publish-notes.mjs` | 调用 | 已存在，驱动同步 |
| `src/content.config.ts` | 新增 | notes collection 与 zod schema |
| `src/content/notes/*.md` | 新增（脚本产出） | mediareport 转换产物 |
| `src/pages/notes.astro` → `src/pages/notes/index.astro` | 改造 | 按主题分类展示笔记 |
| `src/pages/notes/[...slug].astro` | 新增 | 正文渲染页（用 `alternatePath="/en/notes/"` 正确地指向摘要墙） |
| `src/pages/en/notes.astro` → `src/pages/en/notes/index.astro` | 改造 | 英文摘要墙，跳到中文正文 |
| `src/layouts/BaseLayout.astro` | 小改 | 新增 `alternatePath?: string` prop，修正 en 页面 hreflang |
| `public/sitemap.xml` | 删除 | 改用 `@astrojs/sitemap` |
| `astro.config.mjs` | 小改 | 接入 `@astrojs/sitemap` + Shiki css-variables 适配深色皮肤 |
| `scripts/verify-site.mjs` | 必改 | notes 页面路径变了；同时删掉对 `public/sitemap.xml` 的验证 |

### 4.2 首页微调

- **保留现有 hero / 项目 / 能力 / 工作流 / 笔记索引区块**。
- 在 `notes` 区块上方新增 **“最新笔记”**：`getCollection('notes')` 前 3~4 条，卡片列表，跳正文。
- 移除原 `data.ts` 里硬编码的 3 张外链卡片，降级到 `/notes/` 页作为 “延伸阅读”。

### 4.3 SEO / 社交分享

- **接入 `@astrojs/sitemap`**，每篇 `/notes/<slug>/`、每个 `/projects/<slug>/` 自动进入 sitemap。
- **改写 `public/images/og.svg` 为 PNG/JPG**（1200×630），或准备 jpg/png fallback；主流平台不渲染 SVG。
- **补 JSON-LD Person**（在 `BaseLayout.astro` 的 head 里注入，针对全站首页）：
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "wujue / Dithob",
    "url": "https://dithob.github.io/",
    "sameAs": ["https://github.com/Dithob"]
  }
  ```

### 4.4 可访问性打磨

- `src/layouts/BaseLayout.astro` ≤430px 导航改 `aria-label` + 保留的文字节点隐藏方案（不用 `font-size:0`）。
- 主题菜单按钮 `role="listitem"` 移除，改用 `ul > li > button`。
- 修 editorial 主题 `#8d8173` 小字对比度至 AA（4.5:1）。
- 新增 `aria-current` 于当前导航项。
- 主题切换脚本移到 head（或不变，但确保初始渲染不闪变）。

### 4.5 联系方式 & 简历页

- docs/readme 说明：简历页 PDF 未放入只有占位。若简历可公开，则在 resume.astro 加入 PDF 链接。
- 新增联系方式：在 `src/data.ts` 增加 `site.mail = 'you@example.com'`，在 about/resume/首页 footer 展示 mailto。

## 五、验收标准

- `npm run check`、`npm run build`、`npm run preview` 全部通过。
- `/notes/<slug>/` 路径可达，正文表格/引用/代码块/prism css 变量有样式。
- `node ../mediareport/scripts/publish-notes.mjs --write` 正确落地 `src/content/notes/*.md`。
- `@astrojs/sitemap` 生效后 `/sitemap-index.xml` 自动生成，时不再依赖 `public/sitemap.xml`。
- 在 `/notes/` 页看到按主题分类的列表，主题（category）≥ 2 时有分组效果；≤1 时退化到时间倒序列表。
- 新增 JSON-LD 后 Lighthouse SEO 提升，接 og:image 换成 PNG/JPG 后分享缩略图正常显示。
- About / Resume / Footer 都能看到 mailto: 联系方式。

## 六、假设与默认值

- **单向同步**、**主题分类**、**保留首页 5 套视觉主题**是 Plan Mode 中已确认的决策。
- `@astrojs/sitemap`、`JSON-LD Person`、`og:image PNG/JPG`、**联系方式（mailto）**、**对比度修** 是低风险默认项。
- 简历页若为占位状态，简历填充属于用户本人动作，不在本次改造范围。
- `mediareport` 源仓库、发布脚本 `publish-notes.mjs` 与配置 `publish.config.mjs` 均已存在；本计划只调用它，不重写它。

## 七、执行记录（2026-08-31）

本次已按本计划 + 用户补充要求全部落地：

| 范围 | 结果 |
| --- | --- |
| 笔记系统 | `src/content.config.ts`、`src/content/notes/*.md`（由 `publish-notes.mjs --write` 产出 2 篇）、`/notes/` 主题分组页、`/notes/<slug>/` 正文页、`/en/notes/` 摘要墙。仅 1 个主题时退化到时间倒序列表 ✓ |
| 首页 | 新增 06 LATEST NOTES（collection 前 4 篇），原 notes 区块顺延为 07；`data.ts` 硬编码卡片移除，降级为 `/notes/` 页「延伸阅读」 |
| SEO | `@astrojs/sitemap` 接入（`/sitemap-index.xml`，过滤 `/404/`），删除 `public/sitemap.xml`；`og.svg` → `og.png`（1200×630，System.Drawing 绘制）；JSON-LD Person + sameAs 注入首页 |
| 可访问性 | ≤430px 导航改用视觉隐藏文本 + `aria-label`（去掉 `font-size:0`）；主题菜单改 `ul > li > button`（移除 `role=listitem`）；`aria-current` 标当前位置；editorial `--subtle` 改为 `#6b6054`（AA 5.4:1）；主题初始化脚本移入 head 防闪变 |
| 正文样式 | 表格/引用/行内代码/代码块/hr/标题 `scroll-margin` 全量补齐；Shiki `css-variables` + 全局 `--astro-code-*` 深色卡片适配全部皮肤 |
| 联系方式 | `site.mail = 2508807574@qq.com`（取自 git config 与 AiDeveloperResume `profile.tex`），footer / about / resume（中英）均展示 mailto |
| 简历页 | 占位文案移除，改为真实内容（腾讯实习、智能持续测试平台、腾讯地图 Agent、在校成果、教育背景、技能），入口 `public/downloads/resume-testdevelop.pdf`（由 AiDeveloperResume `build.bat main_testdevelop.tex` 编译产出） |
| 验收 | `npm run check` 0 错误、`npm run build` 26 页、`npm run preview` 各关键路径 200、`verify-site.mjs` 输出 `VERIFY_SITE_OK` |

**提醒**：简历 PDF 与邮箱含真实个人信息（姓名洪波、邮箱、电话 19823825660——电话只见于 PDF 内部，网页仅公开邮箱）。若不想公开 PDF，删除 `public/downloads/` 并去掉 resume 页 PDF 链接即可；若要改邮箱，`site.mail` 与 profile README 两处同步。
