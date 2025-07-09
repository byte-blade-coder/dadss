
import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import Chart from "chart.js/auto";
import styled from "styled-components";
import { Scatter } from "react-chartjs-2";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchMultiplePatroltypeBasedData } from "../../redux/thunks/patroltypeBasedData.js";
import { LoadingOutlined } from "@ant-design/icons";

const DensityHeatMap = dynamic(
  () => import("../LeafletMap/mappatrol"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const PatrolMap = ({scatterData, data}) => {

  // const { data, isLoading } = useSelector(
  //   (state) => state.fetchMultiplePatroltypeBasedData
  // );
  // const [searchData, setSearchData] = useState({ patroltype:  ['Anti-Poaching']  });
  console.log("Data props: \nScatter :", scatterData, "\nAPI :", data)
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   console.log("Dispatching: ", searchData.patroltype)
  //   dispatch(fetchMultiplePatroltypeBasedData(searchData.patroltype));
  // }, [searchData]);

  // let scatterData = [];

  return (
    <StyledDiv>
      <DensityHeatMap
        data={scatterData}
        center={[24.8607, 67.0011]}
        zoom={6.5}
        maxZoom={9}
        customIconUrl= {scatterData.map(point => point.iconUrl)}
        /*default: Narcotics, blue: smuggling, yellow; Poaching, gray: Mangroves*/
      >
        
        {/* Render markers on the map */}
        {data?.map((point, index) => (
          // console.log(point, index),
          <Marker key={index} position={[point.latitude, point.longitude]}>
            <Popup>
              {/* {point.label} */}
              <div>
                <p>Drug: {point.item}</p>
                <p>Quantity: {point.quantity}</p>
                <p>Flag: {point.flag}</p>
                <p>Value: {point.value}</p>
                <p>Vessel Name: {point.vessel_name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </DensityHeatMap>
    </StyledDiv>
  );
};

export default PatrolMap;
const StyledDiv = styled.div`
  // background-image: url("/images/map.png");
  /* background-position: center; */
  background-size: cover;
  background-repeat: no-repeat;
  /* height: 100vh; */
`;
