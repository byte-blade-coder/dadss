import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const LeafletHeatMap = ({ data, title }) => {
  const mapRef = useRef(null); // Reference for the map instance
  const mapContainerRef = useRef(null); // Reference for the map container

  useEffect(() => {
    if (mapRef.current) return; // If map is already initialized

    // Initialize the map
    mapRef.current = L.map(mapContainerRef.current).setView([24, 64], 7);

    // Add a basemap layer
    L.tileLayer(`${process.env.NEXT_PUBLIC_SERVER_MAPS_ENDPOINT}/my-offline-tiles/WOtiles/{z}/{x}/{y}.png`, {
      maxZoom: 7,
      minZoom: 3,
    }).addTo(mapRef.current);

    // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" , {
    //   maxZoom: 7,
    //   minZoom: 3,
    // }).addTo(mapRef.current);

    // Check if data is available and properly formatted
    if (data && Array.isArray(data) && data.length > 0) {
      // Convert data to heatmap format with scaled counts
      const heatData = data.map((item) => [
        item.lat,
        item.lng,
        item.count * 10,
      ]); // Scale up counts

      // Define custom gradient colors with higher contrast
      const gradient = {
        0.0: "rgba(0,0,255,0)", // Transparent blue
        0.1: "#0000ff", // Blue
        0.3: "#00ffff", // Cyan
        0.5: "#00ff00", // Green
        0.7: "#ffff00", // Yellow
        0.9: "#ff0000", // Red
        1.0: "#ff0000", // Red
      };

      // Add heatmap layer to the map with adjusted radius and blur
      L.heatLayer(heatData, {
        radius: 15, // Increase radius
        blur: 30, // Reduce blur
        gradient: gradient,
      }).addTo(mapRef.current);
    } else {
      console.error("Invalid data provided for the heatmap.");
    }

    return () => {
      // Cleanup map on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [data]);

  return (
    <>
      <p style={{ fontSize: 24 }}>{title}</p>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "70vh" }}
      ></div>
    </>
  );
};

export default LeafletHeatMap;
