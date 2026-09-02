---
title: "从「手动配 codex 中转站」到「模型配置自动化」：一个 pi skill 的完整诞生记"
titleEn: "From manual codex relay config to automated model provisioning: the birth of a pi skill"
type: "note"
typeLabel: "笔记"
category: "AI / Agent"
categoryEn: "AI / Agent"
summary: "从一个真实需求（给 pi 接 codex 中转站）出发，记录「逐模型实测 → skill 化 → 通用化 → npm 发布 → pi.dev 上架」的完整链路，含 npm 2FA 三重 403、市场索引延迟等 6 个可复制的坑。"
summaryEn: "From a real need (wiring a Codex relay station into pi) through per-model probing, skill generalization, npm publishing, and pi.dev listing — with six reproducible pitfalls including npm 2FA and marketplace index lag."
source: "pi-relay-config 项目实践"
sourceTitle: "Dithob/pi-relay-config"
sourceUrl: "https://github.com/Dithob/pi-relay-config"
author: ""
duration: ""
sourceId: ""
date: "2026-09-02"
draft: false
---

> 来源：[Dithob/pi-relay-config](https://github.com/Dithob/pi-relay-config)（原创项目复盘）
> 整理日期：2026-09-02

一个完全真实的、每天都会发生的需求，最终长成了一个可以发布、可以给别人装的包。这条路不难，但坑不少——这篇是完整路线图 + 踩坑实录。

## 先说结果

| 环节 | 状态 |
|---|---|
| 真实需求落地 | ✅ 11 个模型中 7 个可用，已写入 `~/.pi/agent/models.json` |
| 沉淀为 skill | ✅ `pi-relay-config`（8 厂商速查表 + 三协议探测 + 报错矩阵） |
| 发布为 npm 包 | ✅ `pi-relay-config@0.1.0`（MIT，5 文件，9.4 kB） |
| GitHub 仓库 | ✅ `github.com/Dithob/pi-relay-config`，main + `v0.1.0` tag |
| pi.dev 市场 | ✅ 详情页已可访问；搜索索引待 npm 搜索索引收录后自动出现 |
| 安装验证 | ✅ `pi install npm:pi-relay-config` 通过 |

## 1. 起于一个真实需求：给 pi 接 codex 中转站

用户的原话是「给 pi-agent 配置 codex 的中转站」。调研后第一件事就发现一个反直觉的事实：

> **pi 内置的 `openai-codex` provider 走 ChatGPT Plus/Pro 的 OAuth 登录（`/login openai-codex`），不能指向第三方中转站。**

中转站接入必须走 `~/.pi/agent/models.json` 自定义 provider 路线。也就是说，**正确的接入方式不是改内置配置，而是注册一个自定义 provider**。这是整个项目的地基。

## 2. 一切以实测为准：探测出来的才是能用的

拿到中转站地址（`qyapi.cjyyswq.com`）和 key 后，核心方法论只有一句话：

> **中转站声明支持什么不重要，用 curl 探测出来的才算数。**

### 2.1 模型清单：11 个，但只有 7 个能用

`/v1/models` 返回 11 个模型，实测后发现大量"列表里有、实际用不了"：

| 现象 | 结论 |
|---|---|
| `gpt-5.4-openai-compact` 等 4 个 compact 变体全部不可用 | `not supported by any configured account in this group` / `Upstream request failed` → 账号组绑定问题，**从 models.json 删除** |
| `codex-auto-review` | 评审专用非对话模型 → 不注册 |
| 其余 7 个 | 注册 + 全链路冒烟通过 |

### 2.2 协议探测：三个协议挨个试

`/v1/chat/completions` 和 `/v1/responses` 都通。**意外发现**：该中转站连 `/v1/messages`（Anthropic Messages）都返回完整格式响应——**一个中转站同时支持三种协议**。

决策：`api: "openai-responses"`，理由：Codex/GPT-5.x 系模型原生、reasoning/tool calling 传递最稳、能正确显示缓存计费。

由此沉淀出多协议优先序：`openai-responses` > `openai-completions` ≈ `anthropic-messages`。

### 2.3 图片多模态：不实测=白搭

用 4x4 纯色 PNG 逐模型测试：

- `gpt-5.4-mini` ✅ 正确回答"红色"
- `gpt-5.6` ✅ 正确识别
- `gpt-5.3-codex-spark` ❌ `model does not support image input`

结论：**同一模型家族也可能单点不支持图片，`input` 字段必须逐模型实测**。

## 3. 从「能用」到「可复用」：skill 化 + 通用化

一次配置不值钱，能复用的方法才值钱。于是做了三件事：

1. **沉淀为 skill**：`pi-codex-relay-config` → 通用化改名 `pi-relay-config`
2. **扩展到 8 厂商**：Claude、GLM 智谱、Grok/xAI、Kimi、DeepSeek、Qwen、Gemini，各厂商速查表（baseUrl / api 选择 / 已知坑位）
3. **沉淀两个矩阵**：Anthropic Messages compat 矩阵（`eager_input_streaming`、空签名、Bearer 认证等 6 个常见坑）+ 报错处置矩阵

配套 `probe-relay.sh` 一键脚本：模型清单 + 三协议探测 + 逐模型可用性/图片支持测试，任何中转站接入前先跑它。

## 4. 产品化：npm 包 + GitHub 仓库

- `package.json`：`keywords: ["pi-package", ...]`（这是市场索引的入场券）+ `pi.skills` 清单 + `pi.image` 预览图
- `npm pack --dry-run` 验证产物：5 文件 / 9.4 kB
- GitHub 仓库落地：占位符 `YOUR_GITHUB_USER` → 真实账号，`git init` → commit → push → tag

## 5. 发布实录：三个环节的关键坑

### 坑 1：占位符总是漏改（git 环节）

`YOUR_GITHUB_USER` 散落在 `package.json` 和 `README.md` 多处。**教训：`repository.url` 和 `pi.image` 里的占位符要一次全改，且 `pi.image` 指向的 `preview.png` 必须真实存在**，否则图库卡片 404。

### 坑 2：preview.png 别用 macOS 系统工具渲染（图片环节）

用 `qlmanage -t -s 1280` 渲染 SVG 缩略图，结果缩放到 1280×1280、内容错乱、文字被裁切。**正确姿势**：先用 Playwright Chromium `page.goto(file://...svg)` + `page.screenshot()`，viewport 设为 1280×640，一次成型。

### 坑 3：npm 2FA 三连（发布环节，最耗时）

1. 直接 `npm login` → 非交互环境挂起 → 改用 `npm login --auth-type=web` 浏览器授权
2. 授权成功但 `npm publish` 仍然 **403 Forbidden**——提示 *Two-factor authentication ... is required to publish packages*。原因：npm 11 对带 2FA 的账号，**只在收到 401 OTP challenge 时才弹验证码输入框**，收到 403 就直接失败，不提示
3. 解法：`npm publish --otp=123456`（TOTP 30 秒有效，先看码再跑）；**根治方案**：npmjs Settings 里用 Google Authenticator（TOTP 扫码）开启 2FA，以后 `npm publish` 会自动提示 OTP；或用 Granular Access Token + Bypass 2FA 走 CI 发布

**理解误区澄清**：登录时收到的**邮箱验证码 ≠ 2FA**。邮箱码是登录会话验证；发布 2FA 是独立的 TOTP，两者不是一回事。

### 其他细节

- 发布前跑 `npm pkg fix`，npm 会把 `repository.url` 规范化为 `git+https://...`，顺手提交
- tag 要对齐实际发布的 commit（发布后再 `git tag -f v0.1.0` 修正一次）

## 6. 上架 pi.dev：搜不到的真相

发布的包在 [pi.dev/packages](https://pi.dev/packages) **详情页能打开，但搜索框搜不到**？这不是失败，是三层数据的不一致：

| 层 | 数据 | 时效 |
|---|---|---|
| npm registry 元数据 | `npm view pi-relay-config` 直连 | 发布即生效 |
| npm 搜索索引 | `npm search pi-relay-config` | **延迟几分钟～几小时** |
| pi.dev 图库索引 | 基于 npm 搜索/发布流抓取 | 跟在 npm 索引后面 |

- 详情页 `https://pi.dev/packages/pi-relay-config` 是**按 slug 实时从 npm 拉取渲染**，所以立即能看
- 列表/搜索用的**缓存索引**，索引里没有就显示 `0 / 5625, No packages match`
- 搜索参数是 `?name=xxx`（不是 `?q=`），直接访问 `https://pi.dev/packages?name=pi-relay-config` 能实时确认索引进度

**结论：包本身没问题，等索引刷新即可（npm 搜索索引收录后，pi.dev 下一轮抓取自动上架）。**

## 7. 经验与维护建议

### 六条经验教训

1. **「列表里有」≠「能用」**：中转站 `/v1/models` 转发的是整个模型池，账号组绑定才决定可用性
2. **图片支持必须逐模型实测**：同一家族也可能单点不支持
3. **协议选择由端点决定**，不由品牌决定；多协议优先 responses（Codex 系）
4. **密钥三处明文 = 泄露**：shell history、zshrc、models.json，采集前先提醒轮换
5. **名称即资产**：npm 通用包名要尽快注册，防止被抢注
6. **索引延迟不是 bug**：发布成功后搜索不到是正常现象，等待即可

### 维护机制（避免版本漂移）

- **双份同步**：`~/.agents/skills/pi-relay-config/`（本地即时生效）+ `~/CodeFiles/pi-relay-config/`（发布源），改版后双向同步
- **版本递增**：每次发布 version +1，用户 `pi update` 才收得到
- **时效性**：厂商速查表现在是"官方文档事实 + 建议值"，有真机 key 实测后补结论再发 0.2.0

## 附录：完整命令清单（一次跑通）

```bash
# 仓库初始化
cd ~/CodeFiles/pi-relay-config
git init -b main && git add -A && git commit -m "pi skill: relay config"
git remote add origin https://github.com/Dithob/pi-relay-config.git
git push -u origin main

# 预览图（Playwright 渲染，不要用 qlmanage）
node -e '...chromium viewport 1280x640 screenshot preview.png'

# 发布
npm pkg fix && git commit -am "chore: npm pkg fix"
npm login --auth-type=web          # 浏览器授权；邮箱验证码 ≠ 2FA
npm publish --otp=123456           # TOTP：先看认证器 App 再跑
git tag v0.1.0 && git push --tags

# 验证
npm view pi-relay-config           # registry 元数据
pi install npm:pi-relay-config && pi list   # 安装链路
# 市场索引进度：https://pi.dev/packages?name=pi-relay-config
```
