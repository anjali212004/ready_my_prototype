function FileUpload({ onFileProcessed, setError }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["text/plain", "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only TXT and text-selectable PDF files are supported.");
      return;
    }

    setError("");
    onFileProcessed(file);
  };

  return (
    <div className="upload-box">
      <div className="upload-title">Upload your document</div>
      <div className="upload-hint">
        Supported formats: .txt, text-selectable .pdf
      </div>

      <input type="file" accept=".txt,.pdf" onChange={handleChange} />
    </div>
  );
}

export default FileUpload;
