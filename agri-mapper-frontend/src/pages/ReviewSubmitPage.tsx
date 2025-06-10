import React, { useState } from "react";
import { useSubmission } from "../context/SubmissionContext";
import SignatureCanvas from "../components/SignatureCanvas";
import PolygonPreviewMap from "../components/PolygonPreviewMap";

const ReviewSubmitPage = () => {
  const { data, setData } = useSubmission();
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!data.signature || data.polygon.length < 3) {
      alert("Please sign and select an area");
      return;
    }
    const payload = {
      name: data.name,
      mobile: data.mobile,
      address: data.address,
      polygon: data.polygon,
      signature: data.signature,
    };
    const res = await fetch("http://localhost:8000/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus("✅ Submitted successfully!");
    } else {
      setStatus("❌ Submission failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Step 3: Review & Submit</h2>
      <p><b>Name:</b> {data.name}</p>
      <p><b>Mobile:</b> {data.mobile}</p>
      <p><b>Address:</b> {data.address}</p>
      <p><b>Coordinates:</b> {JSON.stringify(data.polygon)}</p>
      <PolygonPreviewMap polygon={data.polygon} />
      <h4>Signature:</h4>
    
      <SignatureCanvas onSave={(sig) => setData((prev) => ({ ...prev, signature: sig }))} />

      <br />
      <button onClick={handleSubmit}>Submit</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default ReviewSubmitPage;
