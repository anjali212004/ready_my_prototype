/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload";
import DocumentViewer from "./components/DocumentViewer";
import OrientationScreen from "./components/OrientationScreen";
import { parseTxt } from "./utils/parseTxt";
import { parsePdf } from "./utils/parsePdf";
import { splitParagraphs } from "./utils/splitParagraph";

function App() {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");
  const [orientationCompleted, setOrientationCompleted] = useState(false);

  // Restore document + orientation state on refresh
  useEffect(() => {
    const saved = localStorage.getItem("document");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDocument(parsed);
      setOrientationCompleted(parsed.orientationCompleted || false);
    }
  }, []);

  const handleFileProcessed = async (file) => {
    try {
      setError("");

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
        orientationCompleted: false, // 🔑 important
      };

      localStorage.setItem("document", JSON.stringify(data));
      setDocument(data);
      setOrientationCompleted(false);
    } catch (err) {
      setError(err.message || "Something went wrong while processing the file.");
    }
  };

  const handleOrientationContinue = () => {
    const updated = {
      ...document,
      orientationCompleted: true,
    };

    localStorage.setItem("document", JSON.stringify(updated));
    setDocument(updated);
    setOrientationCompleted(true);
  };

  return (
    <div className="app-wrapper">
      <div className="app-card">
        <h1>Reading Workflow Prototype</h1>
        <p className="subtitle">
          Upload a document to begin reading
        </p>

        {/* STEP 1: Upload */}
        {!document && (
          <>
            <FileUpload
              onFileProcessed={handleFileProcessed}
              setError={setError}
            />
            {error && <div className="error-box">{error}</div>}
          </>
        )}

        {/* STEP 2: Orientation (ONCE) */}
        {document && !orientationCompleted && (
          <OrientationScreen onContinue={handleOrientationContinue} />
        )}

        {/* STEP 3: Reading placeholder */}
        {document && orientationCompleted && (
          <DocumentViewer document={document} />
        )}
      </div>
    </div>
  );
}

export default App;
