const fs = require('fs');
const PDFJS = require('pdfjs-dist');
const Papa = require('papaparse');

async function pdfToCsv(pdfPath, csvPath) {
  const loadingTask = PDFJS.getDocument(pdfPath);
  const pdf = await loadingTask.promise;
  
  let data = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    textContent.items.forEach(item => {
      data.push(item.str);
    });
  }
  
  const csv = Papa.unparse(data);
  fs.writeFileSync(csvPath, csv);
}

pdfToCsv('path/to/your/pdf.pdf', 'output.csv');
