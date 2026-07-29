const fs = require('fs');
const path = require('path');

const basePdfDir = path.join(__dirname, '../source/pdf');
const booksFile = path.join(__dirname, '../source/_posts/books.md');
const publicationsFile = path.join(__dirname, '../source/_posts/publications.md');
const coursesFile = path.join(__dirname, '../source/_posts/courses.md');

// Helper to sanitize & auto-ingest a directory
function processCategoryDir(targetDir, targetMdPath, categoryTag, categoryLabel) {
  if (!fs.existsSync(targetDir) || !fs.existsSync(targetMdPath)) return;

  let mdContent = fs.readFileSync(targetMdPath, 'utf8');
  const pdfFiles = fs.readdirSync(targetDir).filter(file => file.endsWith('.pdf'));

  let addedCount = 0;

  pdfFiles.forEach(file => {
    const relativeUrlPath = `/yaozhiyong.github.io/pdf/${path.relative(basePdfDir, path.join(targetDir, file)).replace(/\\/g, '/')}`;
    
    // Check if URL is already in Markdown
    if (!mdContent.includes(file) && !mdContent.includes(relativeUrlPath)) {
      const jsonMetaPath = path.join(targetDir, `${path.basename(file, '.pdf')}.json`);
      let meta = {
        title: path.basename(file, '.pdf'),
        english: path.basename(file, '.pdf').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        topic: `${categoryLabel} / 学术资料`,
        abstract: `收录于姚志勇教授个人学术资料库。`
      };

      // Read custom JSON metadata if exists
      if (fs.existsSync(jsonMetaPath)) {
        try {
          const userMeta = JSON.parse(fs.readFileSync(jsonMetaPath, 'utf8'));
          meta = { ...meta, ...userMeta };
        } catch (e) {
          console.error(`Error parsing ${jsonMetaPath}:`, e);
        }
      }

      const entry = `\n### 《${meta.title}》 (*${meta.english}*)
* **主题 | Topic**：${meta.topic}
* **摘要 | Abstract**：${meta.abstract}
* 📥 **全文下载 | Download**：[📄 在线阅读与下载 PDF 全文 (Read & Download PDF)](${relativeUrlPath})

---
`;

      if (mdContent.includes('> 💡 **提示 | Note**')) {
        mdContent = mdContent.replace('> 💡 **提示 | Note**', `${entry}\n> 💡 **提示 | Note**`);
      } else {
        mdContent += `\n${entry}`;
      }

      addedCount++;
      console.log(`[Auto Ingest] Ingested ${file} into ${path.basename(targetMdPath)} (${categoryLabel})`);
    }
  });

  if (addedCount > 0) {
    fs.writeFileSync(targetMdPath, mdContent, 'utf8');
  }
}

// 1. Process pdf/books/ -> books.md (专著)
processCategoryDir(path.join(basePdfDir, 'books'), booksFile, '专著', '学术专著');

// 2. Process pdf/publications/ -> publications.md (论文)
processCategoryDir(path.join(basePdfDir, 'publications'), publicationsFile, '论文', '学术论文');

// 3. Process pdf/courses/ -> courses.md (课程)
processCategoryDir(path.join(basePdfDir, 'courses'), coursesFile, '课程', '教学课程');

// 4. Process root pdf/ directory for fallback
processCategoryDir(basePdfDir, booksFile, '专著', '学术资料');
