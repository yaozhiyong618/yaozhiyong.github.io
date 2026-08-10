# 项目部署与工作流规则

- **部署方式**：本博客使用 **GitHub Actions** 进行自动化静态部署。
- **发布要求**：对博客内容（如文章 Markdown、配置文件、PDF 或资源文件）修改完成后，必须执行 `git add`、`git commit` 并 `git push` 推送至 GitHub `main` 分支，触发 GitHub Actions 进行线上构建和部署。
