import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import styled from "styled-components";
import { Scatter } from "react-chartjs-2";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
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

const MyChart = () => {
  const scatterData = [
    { lat: 24.8607, lng: 67.0011, label: "Hashish" },
    {
      lat: 26.005539511863745,
      lng: 63.049291499900676,
      label: " Brown Crystal",
    },
    { lat: 25.14036726496694, lng: 62.355666891015886, label: "Cocain" },
  ];
  // Custom marker icon
  // const customIcon = new L.Icon({
  //   iconUrl: "images/point-filled.svg",
  //   // iconSize: [25, 41], // Adjust based on your icon size

  // });

  return (
    <StyledDiv>
      <DensityHeatMap
        data={scatterData}
        center={[24.8607, 67.0011]}
        zoom={6.5}
        maxZoom={9}
        customIconUrl="/images/point-filled.svg"
      >
        {/* Render markers on the map */}
        {scatterData.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lng]}>
            <Popup>{point.label}</Popup>
          </Marker>
        ))}
      </DensityHeatMap>
    </StyledDiv>
  );
};

export default MyChart;
const StyledDiv = styled.div`
  // background-image: url("/images/map.png");
  /* background-position: center; */
  background-size: cover;
  background-repeat: no-repeat;
  /* height: 100vh; */
`;
