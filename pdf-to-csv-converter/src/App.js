import React, { useState } from 'react';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
import { parse } from 'papaparse';

function App() {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const convertPdfToCsv = async () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdfDoc = await getDocument(typedArray).promise;
        const page = await pdfDoc.getPage(11); // Assuming the relevant data is on page 11
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map(item => item.str);

        // Convert extracted text to CSV format
        const headers = ["Data"];
        const csvRows = textItems.map(item => ({ Data: item }));

        // Convert JSON to CSV
        const csv = parse(csvRows, { headers: true });
        setCsvData(csv.data);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="App">
      <h1>PDF to CSV Converter</h1>
      <input type="file" onChange={handleFileChange} accept="application/pdf" />
      <button onClick={convertPdfToCsv}>Convert to CSV</button>
      <textarea value={csvData} readOnly style={{ width: "100%", height: "200px" }} />
    </div>
  );
}

export default App;
