# 主页第一轮优化：首屏信息 + 笔记类型分面

## 摘要

本次改造重点解决两个高频痛点：首屏抽象信息无法名片化，笔记列表在“笔记 vs 项目阅读笔记”概念间无法区分。采用保留 hero 结构但重排层级、保留 5 套皮肤默认 neo-brutalist、笔记新增「阅读笔记」类型的组合方案。

已锁定的决策：
- 首页 hero：保留现有结构，原 h1 抽象文案降级为 hero-aside 的 "HOW I WORK"，h1 改为 「姓名 · AI 应用工程师」；身份信息（学校/邮箱）显式放入 aside。
- 笔记类型：在现有 `notes` collection 基础上，新增「项目阅读笔记」类型（`type: 'note' | 'guide' | 'manual' | 'review'`），列表按类型分组展示。
- 默认皮肤：保留 neo-brutalist（成本低，用户体验好）。

## 计划

### 1. 首页 hero 重排

- **文件**：`src/pages/index.astro` 与 `src/pages/en/index.astro` 一致性修改。
- **改动点**：
  - `h1` 内容暂不抽象化，改为 `「名字 · AI 应用工程师」。` 名字取 `site.name`（wujue / Dithob），首字母大写、拉丁字母直接写。
  - 原抽象文案 `「构建可运行、可解释、可核验的 AI 工具。」` 放入 `hero-aside` 顶部一个新的 `hero-aside-block`（`HOW I WORK`），改写为这段文案本身而不是新文字。
  - `hero-aside` 顶部新增一个 block：`NAME / wujue / Dithob`；第二个 block 增加 `SCHOOL / 重庆邮电大学 · 计算机技术（硕士）`。
  - `brand.positioning` / `positioningEn` 保持原有但降级为 `.lead` 段落内容（`p.lead` 会用 `brand.positioning`/`positioningEn`），不再作为 h1。
  - `hero-actions` 保持现有项目/简历/笔记三枚按钮。
  - `signal-strip` 移动端保持 2 列 `grid-template-columns: repeat(2, 1fr)`，更大屏 4 列不变。
- **英文页面**：h1 同样改为 `name + title`（`wujue / AI Applications Engineer`），`hero-aside` 新增对应 block。

### 2. 笔记类型分面

- **新增字段**：`type` 目前为 `['note','guide','manual']`，新增 'review'（项目阅读笔记），`typeLabel` 对应命名「项目阅读笔记 / 阅读笔记」。
- **publish-notes.mjs 类型推导**（mediareport 侧）：
  - 脚本目前支持 `['笔记','指南','手册']`，把新增类型 `「阅读」` 映射到 `review`。
  - 对已有 2 篇笔记，当前类型为 `'笔记'`，不影响。
- ** /notes/ 页面类型分面**：
  - 现有数据 `categories` 从 category 改为 type（按 typeLabel 分组），分组顺序固定 `note, guide, manual, review`。
  - 每组标题显示 `typeLabel`；页面顶部保留原有 `ALL NOTES` 或 `按类型` 判断逻辑。
  - 未来如果新增阅读笔记，`type: 'note' | 'guide' | 'manual' | 'review'` 将分组展示，如果没有 review 类型则只有前 3 类。
  - **首屏与 `/en/notes/`** 保持原样（按 category 或 typeLabel 渲染）。

### 3. 假设和默认值

- publish-notes  schema 需要新增 `'阅读'` 分支；如果 mediareport 里没有强行改动，`/notes/` 则把已有 2 篇高亮升级为原类型。
- 英文页面 `notes/` 所有 type 对应 `titleEn` / `summaryEn` 在 publish.config.mjs 中由作者提供，本计划不详细推导。
- 默认主题（neo-brutalist）在实施后真正生效，同时保留其他 4 套可供选择。

### 4. 验证

- `npm run check` + `npm run build` 通过。
- `/notes/` 有明显的类型分面（「项目阅读笔记」分组≥1 时出现）。
- `dist/sitemap-0.xml` 包含 `/notes/review-post/`（如未来出现） 或安原本出现。
- hero 区域首屏抽象文案消失，改为 `「wujue / AI 应用工程师」` + 在 `hero-aside` 中提供原 slogan。

## 显式假设

1. schema 的 `review` 类型和 `typeLabel` 由 mediareport 侧 `publish.config.mjs` 修正并重新同步；这一变化会把类型加入 zod enum，组装时不强制有 review 类型存在。
2. 「阅读笔记」在渲染时不会单独展示现有类型，而是出现在 `/notes/` 的 type 分组逻辑中。原类别（category）会保留作为排序键但展示在 typeLabel 分组标题和每卡片的小标签中。
3. 「wujue / Dithob」会大部分在 `site.name` 里写；如果之后出现真名 / 常用名，则 hero 更更新为常用名。

## 不在本次范围内（后续迭代）

- 默认皮肤仍为 neo-brutalist，不启用对应构建。
- 简历页面 `resume` 的真名/联系方式输入。
- editorial 主题对比度问题。

---

## 执行记录（2026-08-31）

已按本计划全部落地：

| 项 | 结果 |
| --- | --- |
| 首页 hero | `h1` = `wujue / Dithob · AI 应用工程师`（`site.name` + 职位）；原 slogan（`brand.tagline/En`）移入 hero-aside 的 `HOW I WORK` block；aside 新增 `NAME`（site.name）与 `SCHOOL`（重庆邮电大学 · 计算机技术（硕士） / Chongqing University of Posts and Telecommunications · Computer Technology (M.S.)）block；`lead` 仍用 `brand.positioning/En`；按钮与 signal-strip 未动（≤780px 已是 2 列） |
| hero 字号 | 给 `.hero-content h1` 单独 `clamp(2.4rem, 5.2vw, 5rem)` + `max-width: 16ch`，原全局 `9ch` 限制放不下「名字 · 职位」格式 |
| 类型分面 | schema `type` 新增 `review`；`/notes/` 按 type 分组（固定顺序 note/guide/manual/review），组标题用映射 `笔记/指南/手册/项目阅读笔记`，卡片小标签改为 `category · date`；≥2 个类型才分组，否则时间倒序；`/en/notes/` 与首屏 LATEST NOTES 保持原样 |
| mediareport | `publish-notes.mjs` 的 `TYPES` 新增 `阅读: 'review'`（未重跑 --write，现有 2 篇类型不变） |
| 验证 | `npm run check` 0 errors / 0 warnings / 0 hints；`npm run build` 26 页；preview 截图确认 hero 与 /notes/ 分面渲染；`verify-site.mjs` → `VERIFY_SITE_OK` |

意外收获：现有 2 篇笔记本来就是不同类型（Pi 使用手册 = manual、Superpowers = note），因此「按类型」分面立即生效（「笔记」「手册」两组各 1 篇），无需等新笔记出现。
