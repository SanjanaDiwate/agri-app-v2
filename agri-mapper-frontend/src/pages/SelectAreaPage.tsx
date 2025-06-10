import React from "react";
import { useNavigate } from "react-router-dom";
import { useSubmission } from "../context/SubmissionContext";
import MapSelector from "../components/MapSelector";

const SelectAreaPage = () => {
  const { setData } = useSubmission();
  const navigate = useNavigate();

  const handlePolygonSelect = (coords: number[][]) => {
    setData((prev) => ({ ...prev, polygon: coords }));
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "40px auto", borderRadius: 16, background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: 24, textAlign: "center", color: "#333" }}>📍 Step 2: Select Your Land on the Map</h2>

      <MapSelector onPolygonSelect={handlePolygonSelect} />

      <button
        onClick={() => navigate("/review-submit")}
        style={{ width: "100%", padding: "12px", backgroundColor: "#2e7d32", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", fontSize: 16, cursor: "pointer", marginTop: 20 }}
      >
        Proceed ➡️
      </button>
    </div>
  );
};

export default SelectAreaPage;
