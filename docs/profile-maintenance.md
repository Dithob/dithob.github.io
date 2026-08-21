# 主页内容维护指南

## 推荐做法：一个源文件，两个发布面

这个项目采用“网站仓库作为内容源、Profile 仓库作为发布镜像”的方式：

```text
/Users/wujue/CodeFiles/selfprofile/profile/README.md
/Users/wujue/CodeFiles/selfprofile/profile/README.en.md
                │
                ├── GitHub Profile：Dithob/Dithob/README*.md
                └── 个人网站：通过网站页面引用同一套定位与项目数据
```

**日常只编辑网站仓库中的 `profile/` 源文件**，不要同时手改 `Dithob/Dithob`，避免两个仓库漂移。

## 自动同步

`.github/workflows/sync-profile.yml` 只监听以下内容：

- `profile/README.md`
- `profile/README.en.md`
- 同步脚本和同步 Workflow 本身

它不会触发 Pages 构建，因为 Pages Workflow 仍然只负责网站部署；Profile 同步 Workflow 也不会修改网站源码。

### 你到底需不需要 `PROFILE_REPO_TOKEN`

这是一个**可选的 GitHub 凭据**，只在你希望“提交网站仓库后，自动修改另一个 Profile 仓库”时需要。

```text
Dithob/dithob.github.io
  └── 自动把 profile/README*.md 写入 Dithob/Dithob/README*.md
```

如果你暂时不配置它：

- 网站仍然可以正常部署；
- Workflow 仍然会执行源文件检查；
- Profile 仓库不会自动更新；
- 你可以手动复制两个 README 文件。

如果你配置它，才会启用跨仓库自动同步。它不是网站域名、不是 Astro 配置，也不是你的 GitHub 密码。

首次启用前，在 `Dithob/dithob.github.io` 的：

```text
Settings → Secrets and variables → Actions → New repository secret
```

新增：

```text
Name:  PROFILE_REPO_TOKEN
Value:  你刚刚创建的 fine-grained token
```

Token 权限只需要：

```text
Repository access: Only select repositories → Dithob/Dithob
Repository permissions: Contents → Read and write
```

不要把 token 写入文件、命令行、提交记录或聊天消息。GitHub Actions 会在没有该 Secret 时跳过发布，只执行源文件检查，因此可以先提交 Workflow，再配置 Secret。

### 创建 Token 的最短步骤

1. 打开 GitHub 头像菜单 → **Settings**。
2. 进入 **Developer settings** → **Personal access tokens** → **Fine-grained tokens**。
3. 点击 **Generate new token**。
4. Repository access 选择 **Only select repositories**，只选 `Dithob/Dithob`。
5. Repository permissions 只设置：

   ```text
   Contents → Read and write
   ```

6. 创建后只复制一次 Token，并立即回到 `Dithob/dithob.github.io` 的 Repository secrets 页面。
7. Secret 名称填写 `PROFILE_REPO_TOKEN`，Secret 值粘贴刚刚复制的 Token。

Token 的实际值不要发给我，也不要提交进仓库。GitHub 官方建议优先使用 fine-grained token，并按最小权限和单仓库范围配置。

## 手动维护方式

如果暂时不想启用 Secret：

```bash
# 1. 编辑源文件
$EDITOR profile/README.md
$EDITOR profile/README.en.md

# 2. 检查
node scripts/sync-profile.mjs --check

# 3. 复制到已克隆的 Profile 仓库（仅在没有自动同步时）
cp profile/README.md /path/to/Dithob/README.md
cp profile/README.en.md /path/to/Dithob/README.en.md

# 4. 在 Profile 仓库提交并推送
```

如果自动同步已启用，推荐直接提交并推送 `dithob.github.io` 的 `profile/` 文件，Workflow 会完成第 3、4 步。

## 哪些内容改哪里

| 内容 | 编辑位置 |
| --- | --- |
| GitHub Profile 中英 README | `profile/README.md`、`profile/README.en.md` |
| 首页项目、能力、主题、Workflow 数据 | `src/data.ts` |
| 首页布局与长文案 | `src/pages/index.astro`、`src/pages/en/index.astro` |
| About / Resume / Notes 长文本 | 对应 `src/pages/` 页面；首版暂未全部抽成 CMS |
| 视觉主题与公共组件 | `src/layouts/BaseLayout.astro` |
| 部署与同步 | `.github/workflows/` |

修改网站内容前运行：

```bash
npm run check
npm run build
node scripts/verify-site.mjs
```

## 为什么不直接使用 CMS

对个人静态主页，最常见的维护方式仍是 Git 仓库 + Markdown/TypeScript 数据 + PR。它的优点是版本记录、预览、回滚和与项目源码同一套工作流。CMS、Notion 或 Git-based CMS 可以作为以后降低编辑门槛的入口，但不应再生成第二份事实源。

如果未来希望不改 Astro 页面源码，下一步应把 About、Resume、Notes 和项目详情中的长文本统一迁移到 `src/content/` Markdown Content Collections；主题仍只读这些内容，不复制五份页面数据。
