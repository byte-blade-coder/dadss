import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import testingData from "./tempData";

const ChoroplethHexagonMap = ({ coordinates }) => {
  const [zoomLevel, setZoomLevel] = useState(6); // Track the current zoom level

  // const getColorByIntensity = (percentage) => {
  //   if (percentage > 90) return "#800026";
  //   if (percentage > 80) return "#BD0026";
  //   if (percentage > 50) return "#FD8D3C";
  //   if (percentage > 40) return "#FEB24C";
  //   if (percentage > 20) return "#FFEDA0";
  //   if (percentage > 10) return "#FFFDAB";
  //   if (percentage > 5) return "#FFFFCA";
  //   if (percentage > 0) return "#FFFFFD";
  //   return "#FFFFFF15";
  // };

  const getColorByIntensity = (percentage) => {
    console.log(percentage)
    if (percentage > 90) return "#800026";
    if (percentage > 80) return "#BD0026";
    if (percentage > 50) return "#E31A1C";
    if (percentage > 40) return "#FC4E2A";
    if (percentage > 20) return "#FD8D3C";
    if (percentage > 10) return "#FEB24C";
    if (percentage > 5) return "#FED976";
    if (percentage > 0) return "#FFEDA0";
    return "#FFFFFD";
  };
  // Check if any coordinates are provided
  if (!coordinates || coordinates.length === 0) {
    return (
      <MapContainer
        center={[24, 65]}
        zoom={6}
        style={{ height: "70vh", width: "100%" }}
        maxZoom={7}
        minZoom={2}
      >
        <TileLayer url={`${process.env.NEXT_PUBLIC_SERVER_MAPS_ENDPOINT}/my-offline-tiles/DGVtiles/{z}/{x}/{y}.png`}/>
      </MapContainer>
    );
  }

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
    [centerLat + radius, centerLng], // Top
    [centerLat + radius / 2, centerLng + (radius * Math.sqrt(3)) / 2], // Top right
    [centerLat - radius / 2, centerLng + (radius * Math.sqrt(3)) / 2], // Bottom right
    [centerLat - radius, centerLng], // Bottom
    [centerLat - radius / 2, centerLng - (radius * Math.sqrt(3)) / 2], // Bottom left
    [centerLat + radius / 2, centerLng - (radius * Math.sqrt(3)) / 2], // Top left
  ];

  // Define small hexagon properties
  const smallHexRadius = 0.2; // Radius for small hexagons
  const hexWidth = smallHexRadius * Math.sqrt(3);
  const hexHeight = smallHexRadius * 2;

  // Create the hexagons for each set of coordinates
  return (
    <MapContainer
      center={[24, 65]} // Center the map on the rectangle
      zoom={zoomLevel}
      style={{ height: "70vh", width: "100%" }}
      maxZoom={7}
      minZoom={3}
    >
      <TileLayer url={`${process.env.NEXT_PUBLIC_SERVER_MAPS_ENDPOINT}/my-offline-tiles/DGVtiles/{z}/{x}/{y}.png`} />
      <MapEventHandler />
      {coordinates.map((coords, index) => {
        const topLeft = coords.topLeft; // [lat, lng]
        const bottomRight = coords.bottomRight; // [lat, lng]

        let sectTotalIntensity = 0;
        testingData.forEach((test) => {
          const testLng = test.geometry.coordinates[0];
          const testLat = test.geometry.coordinates[1];
          if (
            testLng >= topLeft[1] &&
            testLng <= bottomRight[1] &&
            testLat <= topLeft[0] &&
            testLat >= bottomRight[0]
          ) {
            sectTotalIntensity += test.properties.intensity;
          }
        });

        const smallHexagons = [];

        // Loop to create smaller hexagons within the larger rectangle
        for (
          let lat = topLeft[0], row = 0;
          lat >= bottomRight[0];
          lat -= hexHeight * 0.75, row++
        ) {
          for (let lng = topLeft[1]; lng <= bottomRight[1]; lng += hexWidth) {
            const adjustedLng = lng + (row % 2 === 1 ? hexWidth / 2 : 0); // Adjust for honeycomb structure

            // Define hexagon bounding box
            const hexTop = lat + smallHexRadius;
            const hexBottom = lat - smallHexRadius;
            const hexLeft = adjustedLng - (smallHexRadius * Math.sqrt(3)) / 2;
            const hexRight = adjustedLng + (smallHexRadius * Math.sqrt(3)) / 2;

            let smallHexIntensity = 0;

            // Calculate the intensity for the current small hexagon
            testingData.forEach((test) => {
              const testLng = test.geometry.coordinates[0];
              const testLat = test.geometry.coordinates[1];

              // Check if the point falls within the bounding box of the hexagon
              if (
                testLat <= hexTop &&
                testLat >= hexBottom &&
                testLng >= hexLeft &&
                testLng <= hexRight
              ) {
                smallHexIntensity += test.properties.intensity;
              }
            });

            // Calculate intensity percentage
            const intensityPercentage =
              (smallHexIntensity / sectTotalIntensity) * 100;

            // Determine color based on intensity percentage
            const fillColor = getColorByIntensity(intensityPercentage);

            smallHexagons.push({
              coords: createHexagon(adjustedLng, lat, smallHexRadius),
              intensity: smallHexIntensity,
              fillColor,
              intensityPercentage: intensityPercentage
            });
          }
        }

        // Render all the small hexagons within the large one
        return (
          <>
            {smallHexagons.map((hex, hexIndex) => (
              <Polygon
                key={`${index}-${hexIndex}`}
                positions={hex.coords}
                color="black"
                fillColor={hex.fillColor}
                fillOpacity={0.7}
              >
                <Tooltip>
                  <span>Total Intensity: {hex.intensity}</span>
                  <br />
                  <span>% Intensity: {hex.intensityPercentage.toFixed(2)}%</span>
                </Tooltip>
              </Polygon>
            ))}
          </>
        );
      })}
    </MapContainer>
  );
};

export default ChoroplethHexagonMap;
