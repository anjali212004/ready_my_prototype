/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload";
import DocumentViewer from "./components/DocumentViewer";
import { parseTxt } from "./utils/parseTxt";
import { parsePdf } from "./utils/parsePdf";
import { splitParagraphs } from "./utils/splitParagraph";

function App() {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");

  // Restore document from localStorage on refresh
  useEffect(() => {
    const saved = localStorage.getItem("document");
    if (saved) {
      setDocument(JSON.parse(saved));
    }
  }, []);

  const handleFileProcessed = async (file) => {
    try {
      setError(""); // clear previous errors

      let extractedText = "";

      if (file.type === "text/plain") {
        extractedText = await parseTxt(file);
      } else if (file.type === "application/pdf") {
        extractedText = await parsePdf(file);
      } else {
        setError("Unsupported file type.");
        return;
      }

      const paragraphs = splitParagraphs(extractedText);

      const data = {
        rawText: extractedText,
        paragraphs,
      };

      localStorage.setItem("document", JSON.stringify(data));
      setDocument(data);
    } catch (err) {
      setError(err.message || "Something went wrong while processing the file.");
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-card">
        <h1>Reading Workflow Prototype</h1>
        <p className="subtitle">
          Upload a document to begin reading
        </p>

        {!document && (
          <>
            <FileUpload
              onFileProcessed={handleFileProcessed}
              setError={setError}
            />

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}
          </>
        )}

        {document && (
          <DocumentViewer document={document} />
        )}
      </div>
    </div>
  );
}

export default App;
