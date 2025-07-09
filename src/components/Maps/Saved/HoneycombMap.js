// import React from "react";
// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// const ChoroplethMap = ({ geojsonData }) => {
//   // Define the color scale for intensity
//   const getColor = (intensity) => {
//     return intensity > 80
//       ? "#800026" // Dark red for high intensity
//       : intensity > 60
//       ? "#BD0026" // Red
//       : intensity > 40
//       ? "#E31A1C" // Light red
//       : intensity > 20
//       ? "#FC4E2A" // Orange
//       : intensity > 10
//       ? "#FD8D3C" // Yellow-Orange
//       : "#FFEDA0"; // Light yellow for low intensity
//   };

//   // Style for each feature based on intensity
//   const style = (feature) => {
//     console.log("feature", feature); // This should log a GeoJSON feature object

//     // Access the intensity from the feature properties
//     const intensity = feature.properties?.value;

//     return {
//       fillColor: getColor(intensity), // Pass the intensity value to getColor
//       weight: 2,
//       opacity: 1,
//       color: "white",
//       dashArray: "3",
//       fillOpacity: 0.7,
//     };
//   };

//   // Highlight feature on hover
//   const highlightFeature = (e) => {
//     const layer = e.target;
//     layer.setStyle({
//       weight: 5,
//       color: "#666",
//       dashArray: "",
//       fillOpacity: 0.7,
//     });

//     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
//       layer.bringToFront();
//     }
//   };

//   // Reset highlight on mouseout
//   const resetHighlight = (e) => {
//     geojsonRef.current.resetStyle(e.target);
//   };

//   // When feature is clicked
//   const onEachFeature = (feature, layer) => {
//     layer.on({
//       mouseover: highlightFeature,
//       mouseout: resetHighlight,
//     });

//     // Add a popup to each feature
//     layer.bindPopup(`
//         <div>
//         <strong>Area Name:</strong>  ${feature.properties.name} <br>
//         <strong>Count</strong><em>(Intensity)</em><strong>:</strong> ${feature.properties.value}
//         </div>
//       `);
//   };

//   const geojsonRef = React.useRef(null);

//   return (
//     <MapContainer
//       style={{ height: "70vh", width: "100%" }}
//       center={[24, 65]}
//       zoom={6}
//       scrollWheelZoom={true}
//       maxZoom={7}
//       minZoom={1}
//     >
//       <TileLayer url="http://localhost:8001/{z}/{x}/{y}.png" />
//       <GeoJSON
//         ref={geojsonRef}
//         data={geojsonData}
//         style={style}
//         onEachFeature={onEachFeature}
//       />
//     </MapContainer>
//   );
// };

// export default ChoroplethMap;

// import React from "react";
// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// const classBreakStyles = {
//   "< 35%": {
//     fillColor: "rgba(124, 185, 232, 0.5)",
//     weight: 3,
//     color: "rgba(124, 185, 232, 1)",
//     fillOpacity: 0.5,
//   },
//   "35 - 50%": {
//     fillColor: "rgba(0, 255, 255, 0.5)",
//     weight: 3,
//     color: "rgba(0, 255, 255, 1)",
//     fillOpacity: 0.5,
//   },
//   "50 - 75%": {
//     fillColor: "rgba(0, 127, 255, 0.5)",
//     weight: 3,
//     color: "rgba(0, 127, 255, 1)",
//     fillOpacity: 0.5,
//   },
//   "> 75%": {
//     fillColor: "rgba(0, 48, 143, 0.5)",
//     weight: 3,
//     color: "rgba(0, 48, 143, 1)",
//     fillOpacity: 0.5,
//   },
// };

// const getStyle = (feature) => {
//   const value = feature.properties.value;
//   if (value <= 35) {
//     return classBreakStyles["< 35%"];
//   } else if (value <= 50) {
//     return classBreakStyles["35 - 50%"];
//   } else if (value <= 75) {
//     return classBreakStyles["50 - 75%"];
//   } else {
//     return classBreakStyles["> 75%"];
//   }
// };

// const MapComponent = ({ initialGeoJSONData }) => {
//   return (
//     <MapContainer
//       center={[24, 65]} // Adjust center as needed
//       zoom={6} // Adjust zoom level as needed
//       style={{ height: "72vh", width: "100%" }}
//     >
//       {/* Base Tile Layer */}
//       <TileLayer url="http://localhost:8001/{z}/{x}/{y}.png" />

//       {/* GeoJSON Layer */}
//       {initialGeoJSONData && (
//         <GeoJSON
//           data={initialGeoJSONData}
//           style={getStyle}
//           onEachFeature={(feature, layer) => {
//             if (feature.properties && feature.properties.name) {
//               layer.bindPopup(feature.properties.name);
//             }
//           }}
//         />
//       )}
//     </MapContainer>
//   );
// };

// export default MapComponent;

import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";

const HexagonMap = () => {
  const [zoomLevel, setZoomLevel] = useState(6); // Track the current zoom level

  // Define your top-left and bottom-right coordinates in [lng, lat] format
  const topLeft = [25.61624178848396, 64.50091719639852]; // [longitude, latitude]
  const bottomRight = [22.97298800739017, 66.96113016728302];

  // Calculate the center of the rectangle
  const centerLat = (topLeft[1] + bottomRight[1]) / 2;
  const centerLng = (topLeft[0] + bottomRight[0]) / 2;

  // Define hexagon properties
  const largeHexRadius = 2; // Large hexagon radius for low zoom
  const smallHexRadius = 0.2; // Smaller hexagons radius for higher zoom
  const hexWidth = smallHexRadius * Math.sqrt(3); // Width of each hexagon
  const hexHeight = smallHexRadius * 2; // Height of each hexagon

  // Listen to zoom changes and update the zoom level
  const MapEventHandler = () => {
    useMapEvents({
      zoomend(e) {
        setZoomLevel(e.target.getZoom());
      },
    });
    return null;
  };

  // Create a function to calculate hexagon vertices
  const createHexagon = (centerLng, centerLat, radius) => [
    [centerLng, centerLat + radius], // Top
    [centerLng + (radius * Math.sqrt(3)) / 2, centerLat + radius / 2], // Top right
    [centerLng + (radius * Math.sqrt(3)) / 2, centerLat - radius / 2], // Bottom right
    [centerLng, centerLat - radius], // Bottom
    [centerLng - (radius * Math.sqrt(3)) / 2, centerLat - radius / 2], // Bottom left
    [centerLng - (radius * Math.sqrt(3)) / 2, centerLat + radius / 2], // Top left
  ];

  // Render large hexagon if zoom is low
  const largeHexagon = createHexagon(centerLng, centerLat, largeHexRadius);

  // Create smaller hexagons if zoom is high enough
  const smallHexagons = [];
  if (zoomLevel >= 6) {
    for (
      let lat = topLeft[1], row = 0;
      lat <= bottomRight[1];
      lat += hexHeight * 0.75, row++
    ) {
      // 0.75 for vertical spacing
      for (let lng = bottomRight[0]; lng <= topLeft[0]; lng += hexWidth) {
        // Adjust odd rows for hexagon positioning (honeycomb structure)
        const adjustedLng = lng + (row % 2 === 1 ? hexWidth / 2 : 0); // Only shift odd rows (starting from second row)
        smallHexagons.push(createHexagon(adjustedLng, lat, smallHexRadius));
      }
    }
  }

  return (
    <MapContainer
      center={[centerLng, centerLat]}
      zoom={6}
      style={{ height: "70vh", width: "100%" }}
      maxZoom={7}
      minZoom={3}
    >
      <TileLayer
        url="http://localhost:8001/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEventHandler />
      {zoomLevel < 6 ? (
        <Polygon positions={largeHexagon} color="blue" />
      ) : (
        smallHexagons.map((coords, index) => (
          <Polygon key={index} positions={coords} color="red" />
        ))
      )}
    </MapContainer>
  );
};

export default HexagonMap;
