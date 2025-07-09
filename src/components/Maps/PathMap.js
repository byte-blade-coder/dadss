import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker"; // Import leaflet-rotatedmarker plugin

const PointMap = ({ flightPathData = [], radioVal }) => {
  const mapRef = useRef(null); // Ref to store the map instance
  const mapContainerRef = useRef(null); // Ref to store the map container

  useEffect(() => {
    if (mapRef.current) return; // Map is already initialized

    // Initialize the map
    mapRef.current = L.map(mapContainerRef.current).setView([25, 64], 7);

    // Add a basemap layer
    L.tileLayer(`${process.env.NEXT_PUBLIC_SERVER_MAPS_ENDPOINT}/my-offline-tiles/DGVtiles/{z}/{x}/{y}.png`, {
    // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" , {
      maxZoom: 7,
    }).addTo(mapRef.current);

    // Function to calculate total distance of the path
    function calculateTotalDistance(path) {
      let totalDistance = 0;
      for (let i = 0; i < path.length - 1; i++) {
        if (mapRef.current) {
          totalDistance += mapRef.current.distance(
            [path[i].lat, path[i].lng],
            [path[i + 1].lat, path[i + 1].lng]
          );
        }
      }
      return totalDistance;
    }

    // Function to calculate bearing between two points
    function calculateBearing(start, end, angle) {
      const startLat = (start.lat * Math.PI) / 180;
      const startLng = (start.lng * Math.PI) / 180;
      const endLat = (end.lat * Math.PI) / 180;
      const endLng = (end.lng * Math.PI) / 180;

      const dLng = endLng - startLng;
      const y = Math.sin(dLng) * Math.cos(endLat);
      const x =
        Math.cos(startLat) * Math.sin(endLat) -
        Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
      const bearing = (Math.atan2(y, x) * 180) / Math.PI;

      return (bearing + angle) % 360; // Normalize to [0, 360]
    }

    // Function to animate the marker and path
    function animateMarker(marker, path, speed, isFlight) {
      let currentIndex = 0;
      let distanceCovered = 0;
      const totalDistance = calculateTotalDistance(path);

      // Create a polyline layer to update as marker moves
      const polyline = L.polyline([], {
        color: "red",
        weight: 2,
        dashArray: "5, 5", // Dotted line style
      }).addTo(mapRef.current);

      function updateMarkerPosition() {
        if (!mapRef.current) return; // Stop animation if map is unmounted

        if (currentIndex >= path.length - 1) {
          // Ensure marker is set to the final position
          marker.setLatLng([
            path[path.length - 1].lat,
            path[path.length - 1].lng,
          ]);
          return; // Stop animation
        }

        const startPoint = path[currentIndex];
        const endPoint = path[currentIndex + 1];
        const segmentDistance = mapRef.current.distance(
          [startPoint.lat, startPoint.lng],
          [endPoint.lat, endPoint.lng]
        );

        if (distanceCovered >= segmentDistance) {
          // Move to the next segment
          distanceCovered -= segmentDistance;
          currentIndex++;
        }

        const segmentProgress = distanceCovered / segmentDistance;
        const lat =
          startPoint.lat + (endPoint.lat - startPoint.lat) * segmentProgress;
        const lng =
          startPoint.lng + (endPoint.lng - startPoint.lng) * segmentProgress;

        marker.setLatLng([lat, lng]);

        // Add the current point to the polyline
        polyline.addLatLng([lat, lng]);

        // Calculate bearing and adjust rotation for ships
        const bearing = calculateBearing(
          startPoint,
          endPoint,
          isFlight ? 360 : 180
        );
        const adjustedBearing =
          !isFlight && startPoint.lng < endPoint.lng
            ? (bearing + 180) % 360
            : bearing;
        marker.setRotationAngle(adjustedBearing); // Rotate the marker

        distanceCovered += speed; // Increment distance covered
        if (
          distanceCovered < segmentDistance ||
          currentIndex < path.length - 1
        ) {
          requestAnimationFrame(updateMarkerPosition); // Continue animation
        }
      }

      updateMarkerPosition(); // Start animation
    }

    // Clear existing layers
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapRef.current.removeLayer(layer);
        }
      });
    }

    // Filter paths based on radioVal and add them to the map
    const isAircrafts = radioVal === "Aircraft";
    const filteredFlightPathData = flightPathData.filter(
      (path) => path.isFlight === isAircrafts
    );

    filteredFlightPathData.forEach((flightPath) => {
      if (!mapRef.current) return; // Skip if map is unmounted

      // Add end markers
      L.marker(
        [
          flightPath.path[flightPath.path.length - 1].lat,
          flightPath.path[flightPath.path.length - 1].lng,
        ],
        {
          icon: L.icon({
            iconUrl: "/assets/dest.svg",
            iconSize: [15, 15],
          }),
        }
      ).addTo(mapRef.current);

      // Animation setup
      const animatedMarker = L.marker(
        [flightPath.path[0].lat, flightPath.path[0].lng],
        {
          icon: flightPath.isFlight
            ? L.icon({
                iconUrl: "/assets/plane.svg",
                iconSize: [35, 35],
                iconAnchor: [15, 15],
              })
            : L.icon({
                iconUrl: "/assets/ship1.svg",
                iconSize: [45, 45],
                iconAnchor: [25, 25],
              }),
        }
      ).addTo(mapRef.current);

      animateMarker(animatedMarker, flightPath.path, 500, flightPath.isFlight); // Pass isFlight parameter
    });

    return () => {
      // Cleanup map on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [flightPathData, radioVal]); // Add flightPathData and radioVal as dependencies

  return (
    <div
      id="mapDiv"
      ref={mapContainerRef}
      style={{ height: "64vh", width: "100%" }}
    ></div>
  );
};

export default PointMap;