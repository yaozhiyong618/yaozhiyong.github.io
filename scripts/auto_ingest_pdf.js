const fs = require('fs');
const path = require('path');

const basePdfDir = path.join(__dirname, '../source/pdf');
const booksFile = path.join(__dirname, '../source/_posts/books.md');
const publicationsFile = path.join(__dirname, '../source/_posts/publications.md');
const coursesFile = path.join(__dirname, '../source/_posts/courses.md');
const essaysFile = path.join(__dirname, '../source/_posts/essays.md');

// Helper to recursively scan pdf files
function getAllPdfs(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllPdfs(fullPath));
    } else if (file.endsWith('.pdf')) {
      results.push(fullPath);
    }
  });
  return results;
}

function updateMarkdownSection(targetFile, pdfList, categoryTitle, sectionTitle) {
  if (!fs.existsSync(targetFile)) return;
  let content = fs.readFileSync(targetFile, 'utf8');

  pdfList.forEach(pdfPath => {
    const filename = path.basename(pdfPath);
    const relUrl = `/yaozhiyong.github.io/pdf/${path.relative(basePdfDir, pdfPath).replace(/\\/g, '/')}`;

    if (!content.includes(filename) && !content.includes(relUrl)) {
      const cleanName = path.basename(filename, '.pdf').replace(/_/g, ' ').replace(/-/g, ' ');
      const entry = `\n### 📄 《${cleanName}》
* **分类 | Category**：${categoryTitle}
* 📥 **全文下载 | Download**：[📄 在线阅读与下载 PDF 全文 (Read & Download PDF)](${relUrl})

---
`;
      if (content.includes('> 💡 **提示 | Note**')) {
        content = content.replace('> 💡 **提示 | Note**', `${entry}\n> 💡 **提示 | Note**`);
      } else {
        content += `\n${entry}`;
      }
      console.log(`Ingested ${filename} into ${path.basename(targetFile)}`);
    }
  });

  fs.writeFileSync(targetFile, content, 'utf8');
}

// 1. Ingest Essays (杂文)
const essayPdfs = getAllPdfs(path.join(basePdfDir, 'essays'));
updateMarkdownSection(essaysFile, essayPdfs, '杂文与微信公众号随笔', '杂文随笔集');

// 2. Ingest Publications (英文论文)
const pubPdfs = getAllPdfs(path.join(basePdfDir, 'publications'));
updateMarkdownSection(publicationsFile, pubPdfs, '学术论文 (Publications)', '期刊论文集');

// 3. Ingest Courses (高级微观经济学及课件)
const coursePdfs = getAllPdfs(path.join(basePdfDir, 'courses'));
updateMarkdownSection(coursesFile, coursePdfs, '课程与讲义 (Lecture Notes & Outlines)', '教学课程');

// 4. Process root pdf/ directory for fallback (disabled to prevent duplicate/unformatted entries)
// processCategoryDir(basePdfDir, booksFile, '专著', '学术资料');
const bookPdfs = getAllPdfs(path.join(basePdfDir, 'books'));
updateMarkdownSection(booksFile, bookPdfs, '学术专著 (Monographs)', '学术专著');

console.log('PDF auto-ingestion completed successfully!');
