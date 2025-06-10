import React, { useRef } from "react";

const SignatureCanvas = ({ onSave }: { onSave: (sig: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const startDraw = (e: React.MouseEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.beginPath();
    ctx?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx?.stroke();
  };

  const endDraw = () => {
    drawing.current = false;
  };

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const save = () => {
    if (canvasRef.current) onSave(canvasRef.current.toDataURL("image/png"));
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        style={{ border: "1px solid black" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
      />
      <div>
        <button onClick={clear}>Clear</button>
        <button onClick={save}>Save</button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
