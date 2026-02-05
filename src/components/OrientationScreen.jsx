import { useState } from "react";

function OrientationScreen({ onContinue }) {
  const [isClarified, setIsClarified] = useState(false);

  const originalText =
    "This app helps you read a document step by step. " +
    "You will read one paragraph at a time and explain it " +
    "before moving forward.";

  const clarifiedText =
    "This app helps you understand text more easily. " +
    "You will read small parts and explain them simply.";

  return (
    <div>
      <h2>How this works</h2>

      <div
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          padding: "16px",
          border: "1px solid #1f2937",
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      >
        {isClarified ? clarifiedText : originalText}
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onContinue}>
          Continue to reading
        </button>

        {!isClarified ? (
          <button onClick={() => setIsClarified(true)}>
            Make this clearer
          </button>
        ) : (
          <button onClick={() => setIsClarified(false)}>
            Revert clarification
          </button>
        )}
      </div>
    </div>
  );
}

export default OrientationScreen;
