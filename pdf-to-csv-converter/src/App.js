import React, { useState } from 'react';
import './App.css';
import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist/webpack';

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleConvert = async () => {
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const textContent = await extractTextFromPDF(pdf);

      // Simple parsing logic (customize based on your PDF structure)
      const rows = textContent.split('\n').map(row => row.split(/\s+/));
      const csv = Papa.unparse(rows);

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'converted.csv';
      link.click();
    } else {
      alert('Please upload a PDF file first.');
    }
  };

  const extractTextFromPDF = async (pdf) => {
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      text += pageText + '\n';
    }
    return text;
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Upload a PDF file to convert it to CSV.</p>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleConvert}>Convert to CSV</button>
      </header>
    </div>
  );
}

export default App;
