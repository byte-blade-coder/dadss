import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const ChoroplethMap = ({ geojsonData }) => {
  // Define the color scale for intensity
  const getColor = (intensity) => {
    return intensity > 80
      ? "#800026" // Dark red for high intensity
      : intensity > 60
      ? "#BD0026" // Red
      : intensity > 40
      ? "#E31A1C" // Light red
      : intensity > 20
      ? "#FC4E2A" // Orange
      : intensity > 10
      ? "#FD8D3C" // Yellow-Orange
      : "#FFEDA0"; // Light yellow for low intensity
  };

  // Style for each feature based on intensity
  const style = (feature) => {
    console.log("feature", feature); // This should log a GeoJSON feature object

    // Access the intensity from the feature properties
    const intensity = feature.properties?.value;

    return {
      fillColor: getColor(intensity), // Pass the intensity value to getColor
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  // Highlight feature on hover
  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  // Reset highlight on mouseout
  const resetHighlight = (e) => {
    geojsonRef.current.resetStyle(e.target);
  };

  // When feature is clicked
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });

    // Add a popup to each feature
    layer.bindPopup(`
        <div>
        <strong>Area Name:</strong>  ${feature.properties.name} <br>
        <strong>Count</strong><em>(Intensity)</em><strong>:</strong> ${feature.properties.value}
        </div>
      `);
  };

  const geojsonRef = React.useRef(null);

  return (
    <MapContainer
      style={{ height: "70vh", width: "100%" }}
      center={[24, 65]}
      zoom={6}
      scrollWheelZoom={true}
      maxZoom={7}
      minZoom={1}
    >
      <TileLayer url={`${process.env.NEXT_PUBLIC_SERVER_MAPS_ENDPOINT}/my-offline-tiles/DGVtiles/{z}/{x}/{y}.png`} />
      <GeoJSON
        ref={geojsonRef}
        data={geojsonData}
        style={style}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default ChoroplethMap;
