// import React, { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Polyline,
//   Marker,
//   Popup,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const shipIcon = new L.Icon({
//   iconUrl: "/images/circle-filled.svg",
//   iconSize: [12,12],
//   iconAnchor: [16, 16],
//   popupAnchor: [0, -10],
// });

// const prominentIcon = new L.Icon({
//   iconUrl: "/images/point-filled.svg",
//   iconSize: [10,10],
// });

// const Path = ({ data, onIconClick }) => {
//   //console.log("data for ship positiion", data);
//   const [shipPaths, setShipPaths] = useState([]);
//   const [selectedMarker, setSelectedMarker] = useState({
//     type: null, // 'flight' or 'ship'
//     index: null,
//   });
//   const [visibleShipPaths, setVisibleShipPaths] = useState([]); // For managing visibility of ship paths
//   const [currentShipIndices, setCurrentShipIndices] = useState(
//     new Array(data.length).fill(0)
//   );
//   const [map, setMap] = useState(null);
//   const [previousMapState, setPreviousMapState] = useState(null);
//   const [selectedIconIndex, setSelectedIconIndex] = useState(null);
//   const [intermediatePoints, setIntermediatePoints] = useState([]);

//   const handleBackClick = () => {
//     if (previousMapState) {
//       const { center, zoom } = previousMapState;
//       if (map) {
//         map.flyTo(center, zoom);
//       }
//     }
//   };

//   const handleMapMove = (e) => {
//     // Save the previous map state when the map is moved
//     setPreviousMapState({
//       center: e.target.getCenter(),
//       zoom: e.target.getZoom(),
//     });
//   };

//   const handleIconClick = (index) => {
//     setSelectedIconIndex(index);
//   };

//   const handleBackClicks = () => {
//     setSelectedIconIndex(null);
//   };

//   // Initialize flightPaths when flightPathData changes
//   useEffect(() => {
//     setShipPaths(
//       data.map((ship) => ({
//         id: ship.ship_id,
//         path: [{ lat: ship.latitude, lng: ship.longitude }],
//         currentIndex: 0,
//         completedPath: [],
//         color: getRandomColor(),
//       }))
//     );
//     setVisibleShipPaths(new Array(data.length).fill(false));
//   }, [data]);
//   //unction to add flight points to the completed path of each flight
//   useEffect(() => {
//     const addShipPoint = (shipIndex) => {
//       setShipPaths((prevShipPaths) => {
//         const updatedShipPaths = [...prevShipPaths];
//         const ship = updatedShipPaths[shipIndex];
//         if (ship && ship.path && ship.currentIndex < ship.path.length) {
//           ship.completedPath.push(ship.path[ship.currentIndex]);
//           ship.currentIndex++;
//           setCurrentShipIndices((prevIndices) => {
//             const updatedIndices = [...prevIndices];
//             updatedIndices[shipIndex] = ship.currentIndex;
//             return updatedIndices;
//           });
//         }
//         return updatedShipPaths;
//       });
//     };

//     const intervals = [];

//     data.forEach((ship, index) => {
//       intervals.push(setInterval(() => addShipPoint(index), 1000));
//     });
//     data.forEach((ship, index) => {
//       if (ship.path && ship.currentIndex === ship.path.length) {
//         clearInterval(intervals[index]);
//       }
//     });

//     // data.forEach((ship, index) => {
//     //   if (ship.currentIndex === ship.path.length) {
//     //     clearInterval(intervals[index + flightPathData.length]); // Shift index to account for flight intervals
//     //   }
//     // });

//     return () => {
//       // Clear all intervals when the component is unmounted
//       intervals.forEach((interval) => clearInterval(interval));
//     };
//   }, []);

//   // Function to generate a random color
//   const getRandomColor = () => {
//     const letters = "0123456789ABCDEF";
//     let color = "#0F217C";
//     // for (let i = 0; i < 6; i++) {
//     //   color += letters[Math.floor(Math.random() * 16)];
//     // }
//     return color;
//   };

//   // Function to get dotted line segments from a path
//   const getDottedLineSegments = (path) => {
//     const dottedSegments = [];
//     for (let i = 0; i < path.length - 1; i++) {
//       const segment = [path[i], path[i + 1]];
//       dottedSegments.push(segment);
//     }
//     return dottedSegments;
//   };
//   const handleMarkerClicks = async (type, index) => {
//     // const updatedVisibleShipPaths = visibleShipPaths.map((_, i) => i === index);
//     // setVisibleShipPaths(updatedVisibleShipPaths);
//     const updatedVisibleShipPaths = new Array(data.length).fill(false);
//     updatedVisibleShipPaths[index] = true;
//     setVisibleShipPaths(updatedVisibleShipPaths);

//     // Hide other icons and paths
//     for (let i = 0; i < visibleShipPaths.length; i++) {
//       if (i !== index) {
//         updatedVisibleShipPaths[i] = false;
//       }
//     }

//     setVisibleShipPaths(updatedVisibleShipPaths);
//     //console.log(updatedVisibleShipPaths);

//     const selectedShip = shipPaths[index]; // Get the selected ship
//     //console.log("selected particular ship ", selectedShip);
//     setSelectedMarker({ type: "ship", index });

//     if (selectedShip) {
//       const shipId = selectedShip.id; // Get the selected ship's ID
//       try {
//         const response = await fetch(
//           `http://127.0.0.1:8001/vessel_position?ship_id=${shipId}`
//         );
//         const newData = await response.json();

//         const newPath = newData.map((ship) => {
//           const timestamp = ship.timestamp; // Assuming timestamp is in the format "2023-08-27 07:35:52.000000 +0500"
//           if (timestamp) {
//             const parts = timestamp.split(" ");
//             const time = parts[1].split(".")[0]; // Extract the time and remove milliseconds
//             //console.log(time);
//             return {
//               lat: ship.latitude,
//               lng: ship.longitude,
//               timestamp: time, // Store the formatted date and time
//             };
//           } else {
//             return {
//               lat: ship.latitude,
//               lng: ship.longitude,
//               timestamp: "N/A", // or any default value you prefer
//             };
//           }
//         });
//         //console.log("new data fetch form ID ", newPath);
//         // Now you can set the new path for the selected ship

//         // const intermediatePoints = [];

//         // // Add the first point if it exists
//         // if (newPath.length > 0) {
//         //   intermediatePoints.push(newPath[0]);
//         // }

//         // // Add intermediate points
//         // if (newPath.length > 2) {
//         //   for (let i = 1; i < newPath.length - 1; i++) {
//         //     intermediatePoints.push(newPath[i]);
//         //   }
//         // }

//         // // Add the last point if it exists
//         // if (newPath.length > 1) {
//         //   intermediatePoints.push(newPath[newPath.length - 1]);
//         // }

//         //  setIntermediatePoints(intermediatePoints);

//         const intermediatePoints = [];

//         // Add all points to intermediatePoints
//         for (let i = 0; i < newPath.length; i++) {
//           intermediatePoints.push(newPath[i]);
//         }

//         setIntermediatePoints(intermediatePoints);

//         setShipPaths((prevShipPaths) => {
//           const updatedShipPaths = [...prevShipPaths];
//           updatedShipPaths[index].completedPath = newPath;
//           return updatedShipPaths;
//         });
//         // Set intermediate points
//       } catch (error) {
//         //console.log("Error fetching ship data:", error);
//       }
//     }
//   };

//   const calculateRotationAngle = (ship) => {
//     const lat1 = ship.path[0].lat;
//     const lon1 = ship.path[0].lng;
//     const heading = ship.heading; // Assuming you have a heading property in your ship data
//     const angle = 90 - heading; // Adjust as needed based on your data
//     return angle;
//   };

//   return (
//     <div className="Path">
//       <MapContainer
//         center={[23.297156873648902, 64.22090651659775]}
//         zoom={7.5}
//         style={{ height: "640px" }}
//         whenCreated={setMap}
//         onMove={handleMapMove}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {shipPaths.map((ship, shipIndex) => (
//           <React.Fragment key={ship.id}>
//             <Marker
//               eventHandlers={{
//                 click: () => {
//                   onIconClick(shipIndex); // Call onIconClick when marker is clicked
//                   handleMarkerClicks("ship", shipIndex);
//                   setSelectedIconIndex(shipIndex); // Update selected icon index
//                 },
//               }}
//               position={ship.path[0]}
//               icon={shipIcon}
//             >
//               <Popup>
//                 Ship ID: {ship.id} <br />
//                 {/* Timestamp : {ship.path.timestamp} <br /> */}
//                 {/* Timestamp :{" "}
//                 {ship.completedPath.length > 0
//                   ? ship.completedPath[0].timestamp
//                   : "N/A"}{" "}
//                 <br /> */}
//                 Timestamp :{" "}
//                 {selectedIconIndex === shipIndex && ship.completedPath[0]
//                   ? ship.completedPath[0].timestamp
//                   : "N/A"}{" "}
//                 <br />
//                 Latitude: {ship.path[0].lng} <br />
//                 Longitude: {ship.path[0].lat}
//               </Popup>
//             </Marker>
//             {visibleShipPaths[shipIndex] && (
//               <>
//                 {/* {selectedIconIndex === shipIndex && (
//                   <> */}
//                 {/* {ship.path.length > 0 &&
//                   ship.path.map((point, index) => (
//                     <React.Fragment key={index}>
//                       <Marker
//                         eventHandlers={{
//                           click: () => {
//                             setSelectedMarker({ type: "ship", index });
//                           },
//                         }}
//                         key={index}
//                         position={point}
//                         icon={
//                           index === currentShipIndices[shipIndex]
//                             ? prominentIcon
//                             : index === 0
//                             ? shipIcon
//                             : prominentIcon
//                         }
//                       >
//                         {index === 0 && (
//                           <Popup>
//                             Ship ID: {ship.id} <br />
//                             Timestamp : {point.timestamp} <br />
//                             Latitude: {point.latitude} <br />
//                             Longitude: {point.longitude}
//                           </Popup>
//                         )}
//                         {index > 0 && <Popup>Intermediate Point {index}</Popup>}
//                       </Marker>
//                     </React.Fragment>
//                   ))} */}
//                 {/* </>
//                 )} */}

//                 {ship.completedPath.length > 1 &&
//                   getDottedLineSegments(ship.completedPath).map(
//                     (segment, index) => (
//                       <Polyline
//                         key={index}
//                         positions={segment}
//                         color={ship.color}
//                         weight={5} // Adjust the weight to make the line thicker
//                         dashArray="10, 10" // Adjust the dashArray for longer dashes
//                         className="animated-polyline"
//                       />
//                     )
//                   )}

//                 {/* Render intermediate points as dotted lines
//                 // {selectedIconIndex === shipIndex && (
//                 //   <Polyline
//                 //     positions={intermediatePoints}
//                 //     color="red" // You can adjust the color
//                 //     dashArray="5, 5" // Dotted line style
//                 //   />
//                 // )} */}

//                 {selectedIconIndex === shipIndex &&
//                   intermediatePoints.map((point, index) => (
//                     <React.Fragment key={index}>
//                       <Marker
//                         eventHandlers={{
//                           click: () => {
//                             setSelectedMarker({ type: "ship", index });
//                           },
//                         }}
//                         position={point}
//                         icon={prominentIcon}
//                       >
//                         <Popup>
//                           Intermediate Point {index + 1} <br />
//                           timestamp : {point.timestamp} <br />
//                           Latitude: {point.lat} <br />
//                           Longitude: {point.lng}
//                         </Popup>
//                       </Marker>
//                     </React.Fragment>
//                   ))}
//               </>
//             )}
//           </React.Fragment>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

// export default Path;

// old code with out api integrated

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

const DensityHeatMap = dynamic(
  () => import("../../../src/components/LeafletMap/map"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

// Define custom icons for markers
const airplaneIcon = new L.Icon({
  iconUrl: "/images/flight-takeoff.svg",
  iconSize: [24, 24],
  iconAnchor: [16, 16],
  popupAnchor: [0, -10],
});

const shipIcon = new L.Icon({
  iconUrl: "/images/ship.svg",
  iconSize: [24, 24],
  iconAnchor: [16, 16],
  popupAnchor: [0, -10],
});

const prominentIcon = new L.Icon({
  iconUrl: "/images/point-filled.svg",
  iconSize: [18, 18],
});

const Path = ({ flightPathData, lng, lat }) => {
  const [flightPaths, setFlightPaths] = useState([]);
  const [colorMap, setColorMap] = useState({});

  // Initialize flightPaths when flightPathData changes
  useEffect(() => {
    setFlightPaths(
      flightPathData.map((flight) => ({ ...flight, completedPath: [] }))
    );
  }, [flightPathData]);

  // Function to add flight points to the completed path of each flight
  useEffect(() => {
    const addFlightPoint = (flightIndex) => {
      setFlightPaths((prevFlightPaths) => {
        const updatedPaths = [...prevFlightPaths];
        const flight = updatedPaths[flightIndex];
        if (flight.currentIndex < flight.path.length) {
          flight.completedPath.push(flight.path[flight.currentIndex]);
          flight.currentIndex++;
        }
        return updatedPaths;
      });
    };

    const intervals = [];

    // Create an interval for each flight to update its path
    flightPathData.forEach((flight, index) => {
      intervals.push(setInterval(() => addFlightPoint(index), 300));
    });

    // Clear intervals when all points are added for their respective flights
    flightPathData.forEach((flight, index) => {
      if (flight.currentIndex === flight.path.length) {
        clearInterval(intervals[index]);
      }
    });

    return () => {
      // Clear all intervals when the component is unmounted
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [flightPathData]);

  // Function to generate a random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Function to get dotted line segments from a path
  const getDottedLineSegments = (path) => {
    const dottedSegments = [];
    for (let i = 0; i < path.length - 1; i++) {
      const segment = [path[i], path[i + 1]];
      dottedSegments.push(segment);
    }
    return dottedSegments;
  };

  // Assign random colors and initialize completedPath for each flight
  useEffect(() => {
    setFlightPaths(
      flightPathData.map((flight) => ({
        ...flight,
        completedPath: [],
        color: getRandomColor(), // Assign a random color to each flight
      }))
    );
  }, [flightPathData]);

  return (
    <div className="Path">
      <MapContainer
        center={[25.297156873648902, 64.22090651659775]}
        zoom={8}
        style={{ height: "600px" }}
      >
        <TileLayer
          url="/WOtiles/{z}/{x}/{y}.png"
          //  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {flightPaths.map((flight) => (
          <React.Fragment key={flight.id}>
            {flight.path.length > 0 && (
              <Marker
                position={flight.path[0]}
                icon={flight.isFlight ? airplaneIcon : shipIcon}
              >
                <Popup>{flight.isFlight ? "Flight" : "Ship"}</Popup>
              </Marker>
            )}

            {flight.completedPath.length > 1 &&
              flight.completedPath.map((point, index) => (
                <Marker
                  key={index}
                  position={point}
                  icon={
                    index === 0
                      ? flight.isFlight
                        ? airplaneIcon
                        : shipIcon
                      : prominentIcon
                  }
                >
                  {index > 0 && <Popup>Intermediate Point {index}</Popup>}
                </Marker>
              ))}

            {flight.completedPath.length > 1 &&
              getDottedLineSegments(flight.completedPath).map(
                (segment, index) => (
                  <Polyline
                    key={index}
                    positions={segment}
                    color={flight.color} // Assign a random color to each path
                    dashArray="10, 10"
                    className="animated-polyline"
                  />
                )
              )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default Path;
