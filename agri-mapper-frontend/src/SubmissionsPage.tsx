import React, { useEffect, useState } from "react";

interface Submission {
  id: string;
  name: string;
  polygon: number[][];
  signature_url: string | null;
}

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/submissions")
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load submissions:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🗃️ All Submitted Data</h2>
      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        submissions.map((sub) => (
          <div
            key={sub.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 15,
              borderRadius: 8,
            }}
          >
            <p><strong>Name / ID:</strong> {sub.name}</p>
            <p><strong>Coordinates:</strong> {JSON.stringify(sub.polygon)}</p>
            {sub.signature_url ? (
              <img
                src={sub.signature_url}
                alt="Signature"
                style={{ width: 300, marginTop: 10 }}
              />
            ) : (
              <p>No signature available</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SubmissionsPage;
