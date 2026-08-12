---
name: deploy-blog-assets
description: >-
  部署 Hexo 静态博客资源与文章（如 source/ 下的 PDF、Markdown 等），并包含关联文章（如 source/_posts/courses.md）的更新与部署流程。
  执行 Git 添加、提交并推送至 origin/main，触发 GitHub Actions 部署。
---

# 静态博客内容与资源部署 Skill

本 Skill 用于将 `source/` 目录下新增或修改的资源（如 PDF 文件、课件、图片等）以及对应的前台文章/页面更新部署到 Hexo 博客，并触发 GitHub Actions 线上构建。

---

## 完整工作流与操作步骤

### 步骤 1：部署/上传资源文件
将新新增的文件（如 PDF 课件）放置到 `source/` 对应子目录中（例如 `source/pdf/courses/`）。

### 步骤 2：更新博客文章/索引页面
新增资源后，必须检索并更新展示该资源的 Markdown 文章（例如 [`source/_posts/courses.md`](file:///D:/Yaozhiyong618/yaozhiyong.github.io/source/_posts/courses.md)），在文章中补充新增资源的模块描述及下载/阅读链接：
1. **链接 URL 规范**：使用相对根路径或 URL 编码路径（如 `/yaozhiyong.github.io/pdf/courses/中文文件名.pdf` 或 URL 编码后的路径）。
2. **文本排版**：按讲义/课件章节建立明确的层级和下载按钮图标（如 `📥 [📄 阅读与下载 PDF](...)`）。

### 步骤 3：提交与推送部署
在 PowerShell 环境下，检查 Git 状态并提交修改（包括资源文件和 updated markdown 文章）：

1. **查看变更**：
   ```powershell
   git status
   ```

2. **提交与推送**（推荐在 PowerShell 中使用 `;` 分隔多条命令，避免 `&&` 语法报错）：
   ```powershell
   git add source/pdf/courses/ source/_posts/courses.md ; git commit -m "feat: add course pdfs and update courses markdown post" ; git push origin main
   ```

---

## 部署验证
推送至 GitHub `main` 分支后，GitHub Actions 自动化流水线将自动运行 `hexo generate` 并将最终静态页面发布至站点。可通过以下命令确认本地提交状态：
```powershell
git log -n 1
```
