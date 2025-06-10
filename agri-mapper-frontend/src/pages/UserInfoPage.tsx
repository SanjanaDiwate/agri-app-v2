import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmission } from "../context/SubmissionContext";

const UserInfoPage = () => {
  const { setData } = useSubmission();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [projectType, setProjectType] = useState("Survey");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!name || !mobile || !address) {
      alert("Please fill all required fields");
      return;
    }
    setData((prev) => ({
      ...prev,
      name,
      mobile,
      address,
    }));
    navigate("/select-area");
  };

  return (
    <div style={{ padding: 24, maxWidth: 480, margin: "40px auto", borderRadius: 16, background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: 24, textAlign: "center", color: "#333" }}>🧑 Farmer Information</h2>

      {[
        { label: "Name / Farmer ID", value: name, setter: setName, type: "text", placeholder: "Enter full name or ID" },
        { label: "Mobile Number", value: mobile, setter: setMobile, type: "tel", placeholder: "10-digit mobile number", maxLength: 10 },
        { label: "Address", value: address, setter: setAddress, type: "textarea", placeholder: "Enter full address" },
        { label: "District", value: district, setter: setDistrict, type: "text", placeholder: "District name" },
        { label: "Village", value: village, setter: setVillage, type: "text", placeholder: "Village name" },
      ].map(({ label, value, setter, type, placeholder, maxLength }) => (
        <div key={label} style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4 }}>{label}</label>
          {type === "textarea" ? (
            <textarea
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: '1px solid #ccc', resize: "vertical" }}
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
            />
          )}
        </div>
      ))}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Date of Visit</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Project Type</label>
        <select
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        >
          <option value="Survey">Survey</option>
          <option value="Ownership Verification">Ownership Verification</option>
          <option value="Fertility Report">Fertility Report</option>
          <option value="Crop Assessment">Crop Assessment</option>
        </select>
      </div>

      <button
        onClick={handleNext}
        style={{ width: "100%", padding: "12px", backgroundColor: "#2e7d32", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", fontSize: 16, cursor: "pointer" }}
      >
        Proceed ➡️
      </button>
    </div>
  );
};

export default UserInfoPage;