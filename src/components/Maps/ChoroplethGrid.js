import React from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import testingData from "./tempData";

// Function to determine color based on intensity percentage
// const getColorByIntensity = (percentage) => {
//   console.log(percentage)
//   if (percentage > 90) return "#800026";
//   if (percentage > 80) return "#BD0026";
//   if (percentage > 50) return "#FD8D3C";
//   if (percentage > 40) return "#FEB24C";
//   if (percentage > 20) return "#FFEDA0";
//   if (percentage > 10) return "#FFFDAB";
//   if (percentage > 5) return "#FFFFCA";
//   if (percentage > 0) return "#FFFFFD";
//   return "#FFFFFF15";
//   // return "#A0C8FF";
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

// const getColorByIntensity = (percentage) => {
//   console.log(percentage)
//   if (percentage > 90) return "#800026"; // Dark red
//   if (percentage > 80) return "#BD0026"; // Light red
//   if (percentage > 70) return "#E31A1C"; // Moderate red
//   if (percentage > 60) return "#FC4E2A"; // Orange-red
//   if (percentage > 50) return "#FD8D3C"; // Light orange
//   if (percentage > 40) return "#FEB24C"; // Light yellow-orange
//   if (percentage > 30) return "#FED976"; // Light yellow
//   if (percentage > 20) return "#FFEDA0"; // Very light yellow
//   if (percentage > 10) return "#A0C8FF"; // Light blue
//   if (percentage > 5) return "#74A3FF"; // Moderate blue
//   return "#3F7DFF"; // Dark blue (near zero)
// };

const ChoroplethGridMap = ({ geojsonData, coordinates }) => {
  // Define the size of each smaller rectangle
  const smallRectHeight = 0.3; // Size of each small rectangle in terms of latitude
  const smallRectWidth = 0.3; // Size of each small rectangle in terms of longitude

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
        <TileLayer 
        url={`${process.env.NEXT_PUBLIC_SERVER_MAPS_ENDPOINT}/my-offline-tiles/DGVtiles/{z}/{x}/{y}.png`} />
      </MapContainer>
    );
  }

  return (
    <MapContainer
      center={[24, 65]}
      zoom={6}
      style={{ height: "70vh", width: "100%" }}
      maxZoom={7}
      minZoom={2}
    >
      <TileLayer 
        url={`${process.env.NEXT_PUBLIC_SERVER_MAPS_ENDPOINT}/my-offline-tiles/DGVtiles/{z}/{x}/{y}.png`}/>
      {coordinates.map((coords, index) => {
        const topLeft = coords.topLeft; // [lat, lng]
        const bottomRight = coords.bottomRight; // [lat, lng]

        console.log(coordinates)
        let sectTotalIntensity = 0;
        // Calculate total intensity for the entire section
        testingData.map((test) => {
          // console.log(test.geometry.coordinates[0], bottomRight[1],test.geometry.coordinates[0], topLeft[1],  test.geometry.coordinates[0] < bottomRight[1] &&
          //   test.geometry.coordinates[0] > topLeft[1])
            // console.log( test.geometry.coordinates[0] > topLeft[1])
          if (
            test.geometry.coordinates[0] < bottomRight[1] &&
            test.geometry.coordinates[0] > topLeft[1]
          )
            sectTotalIntensity += test.properties.intensity;
        });

        const rectangles = [];

        // Loop to create smaller rectangles within the larger rectangle
        for (
          let lat = topLeft[0];
          lat > bottomRight[0];
          lat -= smallRectHeight
        ) {
          for (
            let lng = topLeft[1];
            lng < bottomRight[1];
            lng += smallRectWidth
          ) {
            // Define the four corners of each small rectangle
            const topLeftSmall = [lat, lng];
            const topRightSmall = [lat, lng + smallRectWidth];
            const bottomRightSmall = [
              lat - smallRectHeight,
              lng + smallRectWidth,
            ];
            const bottomLeftSmall = [lat - smallRectHeight, lng];

            // Calculate the total intensity within this small rectangle
            let smallRectIntensity = 0;
            testingData.forEach((test) => {
              const testLat = test.geometry.coordinates[1];
              const testLng = test.geometry.coordinates[0];
              if (
                testLat <= topLeftSmall[0] &&
                testLat >= bottomLeftSmall[0] &&
                testLng >= topLeftSmall[1] &&
                testLng <= topRightSmall[1]
              ) {
                smallRectIntensity += test.properties.intensity;
              }
            });

            // Calculate intensity percentage
            // const intensityPercentage = (smallRectIntensity / sectTotalIntensity) * 100;
            const intensityPercentage = smallRectIntensity;

            // Determine color based on intensity percentage
            const fillColor = getColorByIntensity(intensityPercentage);

            // Log the total intensity for the current small rectangle
            // console.log(
            //   `Small Rectangle [${lat}, ${lng}] \nTotal Intensity: ${smallRectIntensity}`
            // );

            // Create an array of coordinates for each small rectangle
            const smallRectCoords = [
              topLeftSmall,
              topRightSmall,
              bottomRightSmall,
              bottomLeftSmall,
            ];

            // console.log(smallRectCoords)
            // Push the small rectangle into the array
            rectangles.push({
              coords: smallRectCoords,
              intensity: smallRectIntensity,
              percentage: intensityPercentage,
              color: fillColor,
            });
          }
        }

        console.log(rectangles)

        // Render all the small rectangles within the large one
        return rectangles.map((rect, rectIndex) => (
          <Polygon
            key={`${index}-${rectIndex}`}
            positions={rect.coords}
            color="black"
            fillColor={rect.color}
            fillOpacity={0.7}
          >
            
          {/* {console.log(rect)} */}
            {/* Add a tooltip to show the intensity on hover */}
            <Tooltip>
              <span>Total Intensity: {rect.intensity}%</span>
              <br />
              <span>Intensity: {rect.percentage.toFixed(2)}%</span>
            </Tooltip>
          </Polygon>
        ));
      })}
    </MapContainer>
  );
};

export default ChoroplethGridMap;