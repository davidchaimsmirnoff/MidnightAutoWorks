

import { View, StyleSheet } from "react-native";
import { useRef, useEffect } from "react";

type Props = {
  location: { latitude: number; longitude: number } | null;
};

export default function MapComponent({ location }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const lat = location?.latitude ?? 37.78825;
    const lng = location?.longitude ?? -122.4324;

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = (window as any).L;
      if (!mapRef.current) return;

      // Init map
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([lat, lng], 16);

      mapInstanceRef.current = map;

      // Normal readable tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Custom orange pin icon
      const orangeIcon = L.divIcon({
        html: `
          <div style="
            position: relative;
            width: 24px;
            height: 24px;
          ">
            <div style="
              width: 24px;
              height: 24px;
              background: #ff6a00;
              border: 3px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 0 12px rgba(255,106,0,0.8), 0 2px 6px rgba(0,0,0,0.4);
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -28],
        className: "",
      });

      // Draggable marker
      const marker = L.marker([lat, lng], {
        draggable: true,
        icon: orangeIcon,
      }).addTo(map);

      markerRef.current = marker;

      // Style the popup
      const popupStyle = `
        color: #fff;
        background: #111;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-family: monospace;
        border: 1px solid #ff6a00;
        letter-spacing: 0.5px;
        white-space: nowrap;
      `;

      marker.bindPopup(
        `<div style="${popupStyle}">📍 Drag to set exact location</div>`,
        { closeButton: false }
      ).openPopup();

      // Update popup with coords after drag
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        marker.bindPopup(
          `<div style="${popupStyle}">
            ✅ Location set<br/>
            <span style="color:#ff6a00">${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}</span>
          </div>`,
          { closeButton: false }
        ).openPopup();
      });

      // Fix tile rendering bug (tiles sometimes don't load until resize)
      setTimeout(() => map.invalidateSize(), 200);
    };

    document.head.appendChild(script);

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [location]);

  return (
    <View style={styles.container}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" as any },
});

