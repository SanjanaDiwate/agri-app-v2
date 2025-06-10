import React, { useState } from "react";

interface PlotFormProps {
  onSubmit: (data: { id: number; name: string }) => void;
}

const PlotForm: React.FC<PlotFormProps> = ({ onSubmit }) => {
  const [id, setId] = useState<number>(1);
  const [name, setName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id, name });
    setId(id + 1); // Auto-increment for demo
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>🧾 Enter Plot Details</h3>
      <div>
        <label>Plot Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <button type="submit">Save Plot</button>
    </form>
  );
};

export default PlotForm;
