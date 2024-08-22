import React, { useState } from 'react';
import './PdfUpload.css';
import { FaPaperclip, FaEye } from 'react-icons/fa';

const PdfUpload = ({ handlePdfUpload, handlePdfPreview }) => {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pdfFile) {
      handlePdfUpload(pdfFile);
      handlePdfPreview(pdfFile);
      setPdfFile(null);
    }
  };

  return (
    <div className="pdf-upload-container" blue-theme>
      <form onSubmit={handleSubmit} className="pdf-upload-form">
        <div className="pdf-upload-header">
          <h2>Upload Your PDF</h2>
        </div>
        <label htmlFor="pdf-upload" className="pdf-upload-label">
          <FaPaperclip size={20} className="upload-icon" />
          Choose PDF file
        </label>
        <input
          type="file"
          id="pdf-upload"
          accept="application/pdf"
          onChange={handleFileChange}
          className="pdf-upload-input"
        />
        <button type="submit" className="pdf-upload-button">
          Upload PDF
        </button>
        {pdfFile && <div className="pdf-file-name">{pdfFile.name}</div>}
      </form>
      {pdfFile && (
        <div className="pdf-preview-container">
          <div className="pdf-preview-header">
            <FaEye size={20} className="preview-icon" />
            <h3>PDF Preview</h3>
          </div>
          <iframe
            src={URL.createObjectURL(pdfFile)}
            title="PDF Preview"
            className="pdf-preview-frame"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;