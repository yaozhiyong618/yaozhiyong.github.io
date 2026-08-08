const fs = require('fs');
const path = require('path');

const basePdfDir = path.join(__dirname, '../source/pdf');
const booksFile = path.join(__dirname, '../source/_posts/books.md');
const publicationsFile = path.join(__dirname, '../source/_posts/publications.md');
const coursesFile = path.join(__dirname, '../source/_posts/courses.md');
const essaysFile = path.join(__dirname, '../source/_posts/essays.md');

// Helper to recursively scan pdf/ppt/pptx files
function getAllFiles(dir, exts = ['.pdf', '.ppt', '.pptx']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else if (exts.some(ext => file.toLowerCase().endsWith(ext))) {
      results.push(fullPath);
    }
  });
  return results;
}

function updateMarkdownSection(targetFile, fileList, categoryTitle, sectionTitle) {
  if (!fs.existsSync(targetFile)) return;
  let content = fs.readFileSync(targetFile, 'utf8');

  // Natural numerical sorting for lecture1, lecture2 ... lecture10, lecture11, lecture12
  fileList.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  fileList.forEach(filePath => {
    const filename = path.basename(filePath);
    const relPath = path.relative(basePdfDir, filePath).replace(/\\/g, '/');
    const rawUrl = `/yaozhiyong.github.io/pdf/${relPath}`;
    const encodedUrl = `/yaozhiyong.github.io/pdf/${relPath.split('/').map(encodeURIComponent).join('/')}`;

    if (!content.includes(filename) && !content.includes(rawUrl) && !content.includes(encodedUrl)) {
      const ext = path.extname(filename);
      const cleanName = path.basename(filename, ext).replace(/_/g, ' ').replace(/-/g, ' ');
      const entry = `\n### 📄 《${cleanName}》
* **分类 | Category**：${categoryTitle}
* 📥 **全文下载 | Download**：[📄 在线阅读与下载 (Read & Download)](${encodedUrl})

---
`;
      if (content.includes('> 💡 **学生交流与答疑 | Contact**')) {
        content = content.replace('> 💡 **学生交流与答疑 | Contact**', `${entry}\n> 💡 **学生交流与答疑 | Contact**`);
      } else if (content.includes('> 💡 **提示 | Note**')) {
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
const essayPdfs = getAllFiles(path.join(basePdfDir, 'essays'));
updateMarkdownSection(essaysFile, essayPdfs, '杂文与微信公众号随笔', '杂文随笔集');

// 2. Ingest Publications (英文论文)
const pubPdfs = getAllFiles(path.join(basePdfDir, 'publications'));
updateMarkdownSection(publicationsFile, pubPdfs, '学术论文 (Publications)', '期刊论文集');

// 3. Ingest Courses (高级微观经济学及课件)
const coursePdfs = getAllFiles(path.join(basePdfDir, 'courses'));
updateMarkdownSection(coursesFile, coursePdfs, '课程与讲义 (Lecture Notes & Outlines)', '教学课程');

// 4. Process root pdf/ directory for fallback
const bookPdfs = getAllFiles(path.join(basePdfDir, 'books'));
updateMarkdownSection(booksFile, bookPdfs, '学术专著 (Monographs)', '学术专著');

console.log('File auto-ingestion completed successfully!');

