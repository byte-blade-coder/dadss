import React from "react";
import { Col, Row } from "antd";
import { Pie } from "@ant-design/plots";
import {generateColors} from "../../helper/colorPalette";

const PieChart3D = (props) => {
  const data = props.data;
  console.log("Pie chart props",props)
  const colorPalette = {
    Deck: "#FF9800", // Orange - For the ship's deck and exterior
    Sea: "#1976D2", // Royal Blue - For the open sea and water
    Lifeboat: "#FF5722", // Deep Orange - For lifeboats and safety equipment
    Anchor: "#795548", // Brown - For ship anchors and chains
    Mast: "#FFEB3B", // Yellow - For the ship's mast and rigging
    Flag: "#D32F2F", // Red - For ship flags and signals
    Navigation: "#9C27B0", // Purple - For navigation lights and equipment
    // New: "#FF94702",
    New2: "#BE5A83", 
    New435: "#825B32",
    New345: "#D32F2F",
    New5: "#D2DE32",
    New6: "#56ab56",
    New7: "#9C27B0",
    New8: "#F88A8A",
    New9:"#6C48C5",
    New10:"#95D2B3",
    New11:"#FA7070",
    New12: "#0D0DEB",
    // Add more colors for additional ship-related elements as needed
  };

  // Check if the data prop is undefined, empty object, or an empty array
  // if (!data || (typeof data === "object" && Object.keys(data).length === 0))
  if (!data || !Array.isArray(data) || data.length === 0) {
    // Return only title and subTitle when data is not available
    return (
      <div>
        <p> </p>
        {/* <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
          <p style={{ fontSize: 24 }}>{props.title} </p>
          <p style={{ fontSize: 16 }}> {props.subTitle}</p>
        </div>
        <div>No data available for the chart.</div> */}
      </div>
    );
  }

  // Filtering data
  const filteredData = data.filter((item) => item["No of vessels"] > 0);

  const uniqueSeries = [...new Set(data.map(item => item.name))]; // Assuming 'name' is the series field
  const colors = generateColors(uniqueSeries.length, 'Paired');

  const config = {
    appendPadding: 10,
    data: filteredData,
    angleField: "No of vessels",
    colorField: "Port",
    radius: 0.85,
    label: {
      type: "spider", //inner, outer, spider
      labelHeight: 28,
      content: "{name}\n{percentage}",
      formatter: (datum) => {
        return datum["No of vessels"] > 0 ? `${datum.Port}: ${datum["No of vessels"]}` : "";
      },
    },
    color: Object.values(colorPalette),
    // color: colors,
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
      {
        type: "pie-statistic-active",
      },
    ],
  };

  return (
    <Row
      style={{
        display: "flex",
        justifyContent: "center",
        background: "white",
        padding: 20,
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: 10,
      }}
    >
      <Col span={22}>
        <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
          <p style={{ fontSize: 24 }}>{props.title} </p>
          <p style={{ fontSize: 16 }}> {props.subTitle}</p>
          {props.total && (<p style={{ fontSize: 16 }}> Total: {props.total}</p>)}
        </div>
        <div>
          <Pie {...config}/>
        </div>
      </Col>
    </Row>
  );
};

export default PieChart3D;
