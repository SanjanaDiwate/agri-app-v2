import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapSelectorProps {
  onPolygonSelect: (coords: number[][]) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onPolygonSelect }) => {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const [polygonLocked, setPolygonLocked] = useState(false);

  const initMap = (position: [number, number]) => {
   const container = L.DomUtil.get("map-selector");
if (container != null && (container as any)._leaflet_id !== undefined) {
  (container as any)._leaflet_id = undefined; // Reset the Leaflet ID
}

const map = L.map("map-selector").setView(position, 17);
map.dragging.enable();
map.touchZoom.enable();
map.doubleClickZoom.enable();
map.scrollWheelZoom.enable();
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add current location marker
    L.marker(position).addTo(map).openPopup();

    map.addLayer(drawnItemsRef.current);

    drawControlRef.current = new L.Control.Draw({
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItemsRef.current,
        edit: false,
        remove: false,
      },
    });

    map.addControl(drawControlRef.current);

    map.on(L.Draw.Event.CREATED, (event: any) => {
      drawnItemsRef.current.clearLayers();
      const layer = event.layer;

      // 🔴 Make polygon red and lock it
      layer.setStyle({ color: "red" });

      drawnItemsRef.current.addLayer(layer);
      const latlngs = (layer.getLatLngs()[0] as L.LatLng[]).map((pt) => [pt.lat, pt.lng]);

      onPolygonSelect(latlngs);
      setPolygonLocked(true);

      // Remove draw controls after selection
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }
    });
  };

  useEffect(() => {
    // Get live GPS location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        initMap(coords);
      },
      (err) => {
        console.warn("Location error:", err);
        initMap([18.55, 73.89]); // fallback location
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  const handleReset = () => {
    setPolygonLocked(false);
    drawnItemsRef.current.clearLayers();
    if (mapRef.current && drawControlRef.current) {
      mapRef.current.addControl(drawControlRef.current);
    }
  };

  return (
    <div>
      <div id="map-selector" style={{ height: 500, width: "100%" }} />
      {polygonLocked && (
        <button style={{ marginTop: 10 }} onClick={handleReset}>
          🔄 Reset Polygon
        </button>
      )}
    </div>
  );
};

export default MapSelector;
