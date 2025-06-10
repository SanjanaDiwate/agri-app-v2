import React, { useRef } from "react";

const SignaturePad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    console.log("Signature Base64:", dataUrl);
    // 🔁 Send to backend as base64 string
  };

  return (
    <div>
      <h3>✍️ Touch Signature</h3>
      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        style={{ border: "1px solid black" }}
        onMouseDown={(e) => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (ctx) ctx.beginPath();
        }}
        onMouseMove={(e) => {
        const canvas = canvasRef.current;
        if (canvas && e.buttons === 1) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            }
        }
        }}

      />
      <div>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={saveSignature}>Save Signature</button>
      </div>
    </div>
  );
};

export default SignaturePad;
