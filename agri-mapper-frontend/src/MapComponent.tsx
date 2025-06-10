import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import './MapComponent.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const SignatureCanvas = ({ onSave }: { onSave: (dataUrl: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false); 

  const startDraw = (e: React.MouseEvent) => {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const saveSignature = () => {
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL("image/png"));
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        style={{ border: '1px solid #000' }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />
      <div>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={saveSignature}>Save</button>
      </div>
    </div>
  );
};

const MapComponent: React.FC = () => {
    const [status, setStatus] = useState<null | { message: string; success: boolean }>(null);
  const mapRef = useRef<L.Map | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const drawnLayerRef = useRef<L.Polygon | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const liveMarkerRef = useRef<L.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [name, setName] = useState('');
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById('draw-map');
    if (container && (container as any)._leaflet_id) container.innerHTML = '';

    const map = L.map('draw-map').setView([18.55, 73.89], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    drawnItemsRef.current = drawnItems;
    map.addLayer(drawnItems);

    drawControlRef.current = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
        polygon: { allowIntersection: false, showArea: true },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });

    map.addControl(drawControlRef.current);

    map.on(L.Draw.Event.CREATED, (event: any) => {
      if (drawnItemsRef.current) {
        drawnItemsRef.current.clearLayers();
      }

      const layer = event.layer;
      layer.setStyle({ color: 'red' });
      drawnItems.addLayer(layer);
      drawnLayerRef.current = layer;

      const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
      const coords = latlngs.map((latlng) => [latlng.lat, latlng.lng]);
      setCoordinates(coords);
    });

    // Live GPS tracking
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (!mapRef.current) return;

          if (liveMarkerRef.current) {
            liveMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const marker = L.marker([latitude, longitude]).addTo(mapRef.current);
            // marker.bindPopup("📍 You are here").openPopup();
            liveMarkerRef.current = marker;
          }

          mapRef.current.setView([latitude, longitude], 18);
        },
        (err) => console.warn("Live location error:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );
    }

    return () => {
      if (mapRef.current) mapRef.current.remove();
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleReset = () => {
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
      setCoordinates([]);
    }
  };

  const handleSubmit = async () => {
    if (!name || coordinates.length < 3 || !signature) {
      alert("Please fill name, draw a polygon, and add signature.");
      return;
    }
    setStatus({ success: true, message: "Submitted successfully!" })
    const payload = {
      name,
      polygon: coordinates,
      signature,
    };

    try {
      const res = await fetch("http://localhost:8000/api/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

      if (res.ok) {
        alert("Submitted successfully!");
        handleReset();
        setSignature(null);
        setName("");
      } else {
        alert("Error submitting data.");
      }
    } catch (err) {
      console.error(err);
      alert("Request failed.");
    }
  };

  return (
  <div className="map-wrapper">
    <div className="section">
      <h3>🧑 Name or ID</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name or ID"
      />
    </div>

    <div className="section">
      <h3>🗺️ Mark Area on Map</h3>
      <div id="draw-map" />
      <button onClick={handleReset} style={{ marginTop: 10 }}>
        Reset Polygon
      </button>
    </div>

    <div className="section">
      <h3>✍️ Signature</h3>
      <SignatureCanvas onSave={setSignature} />
      {signature && (
        <img
          src={signature}
          alt="Signature Preview"
          className="signature-preview"
        />
      )}
    </div>

    <div className="section">
      <button onClick={handleSubmit}>✅ Submit</button>
    </div>

    {status && (
      <div
        className={`alert ${
          status.success ? "alert-success" : "alert-error"
        }`}
      >
        {status.message}
      </div>
    )}
  </div>
);
};

export default MapComponent;
