const fs = require('fs');
const path = require('path');

const pdfDir = path.join(__dirname, '../source/pdf');
const booksFile = path.join(__dirname, '../source/_posts/books.md');

if (!fs.existsSync(pdfDir) || !fs.existsSync(booksFile)) {
  console.log('Directory or books.md not found, skipping pdf auto ingest.');
  process.exit(0);
}

let booksContent = fs.readFileSync(booksFile, 'utf8');
const pdfFiles = fs.readdirSync(pdfDir).filter(file => file.endsWith('.pdf'));

let newAdded = 0;

pdfFiles.forEach((file) => {
  // Check if PDF file path already exists in books.md
  if (!booksContent.includes(file)) {
    const rawName = path.basename(file, '.pdf');
    // Format human readable title
    const formattedTitle = rawName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    const newBookEntry = `\n### 《${rawName}》 (*${formattedTitle}*)
* **主题 | Topic**：学术著作 / 电子书全文
* **摘要 | Abstract**：收录于姚志勇教授个人学术图书馆与著作库。
* 📥 **全文下载 | Download**：[📄 在线阅读与下载 PDF 全文 (Read & Download PDF)](/yaozhiyong.github.io/pdf/${file})

---
`;

    // Append before the ending note or at the end of file
    if (booksContent.includes('> 💡 **提示 | Note**')) {
      booksContent = booksContent.replace('> 💡 **提示 | Note**', `${newBookEntry}\n> 💡 **提示 | Note**`);
    } else {
      booksContent += `\n${newBookEntry}`;
    }
    newAdded++;
    console.log(`Auto ingested new PDF into books.md: ${file}`);
  }
});

if (newAdded > 0) {
  fs.writeFileSync(booksFile, booksContent, 'utf8');
  console.log(`Successfully auto-ingested ${newAdded} new PDF(s) into books.md.`);
} else {
  console.log('All PDF files are already registered in books.md.');
}
