import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PolygonPreviewMapProps {
  polygon: number[][]; // [lat, lng]
}

const PolygonPreviewMap: React.FC<PolygonPreviewMapProps> = ({ polygon }) => {
  const mapContainerId = "polygon-preview-map";

  useEffect(() => {
    // 🧹 Clean up previously attached map
    const container = L.DomUtil.get(mapContainerId);
 if (container != null) {
  (container as any)._leaflet_id = undefined;
}


    const map = L.map(mapContainerId, {
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    if (polygon.length >= 3) {
      const latLngs = polygon.map(([lat, lng]) => L.latLng(lat, lng));
      const polygonLayer = L.polygon(latLngs, { color: "blue" }).addTo(map);
      map.fitBounds(polygonLayer.getBounds(), { padding: [10, 10] });
    } else {
      map.setView([18.55, 73.89], 13);
    }

    return () => {
      map.remove();
    };
  }, [polygon]);

  return <div id={mapContainerId} style={{ height: "300px", width: "100%", marginTop: 10 }} />;
};

export default PolygonPreviewMap;
