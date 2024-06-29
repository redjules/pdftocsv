import fs from 'fs';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.js';
import Papa from 'papaparse';

// Use a CDN for the workerSrc
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

async function pdfToCsv(pdfPath, csvPath) {
    const loadingTask = getDocument(pdfPath);
    const pdf = await loadingTask.promise;

    let data = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        textContent.items.forEach(item => {
            data.push({ text: item.str });
        });
    }

    const csv = Papa.unparse(data);
    fs.writeFileSync(csvPath, csv);
}

// Replace 'path/to/your/pdf.pdf' and 'output.csv' with your actual paths
pdfToCsv('path/to/your/pdf.pdf', 'output.csv');
