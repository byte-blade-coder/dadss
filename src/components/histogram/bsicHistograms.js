import { Histogram } from "@ant-design/plots";
import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { Col, Row, Select } from "antd";

function BasicHistograms(props) {
  const { title, subTitle, data, isGroup } = props;

  // Check if the data prop is undefined or not an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    // Return only title and subTitle when data is not available
    return (
      <div>
        <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
          <p style={{ fontSize: 24 }}>{title} </p>
          <p style={{ fontSize: 16 }}> {subTitle}</p>
        </div>
        <div>No data available for the chart.</div>
      </div>
    );
  }

  const configssss = {
    data,
    xField: "days", // Set the x-axis field to "days"
    yField: "count", // Set the y-axis field to "count"
    //binField: "count",
    binWidth: -10,
    // stackField: "days",
    coloField: "days",
    tooltip: {
      showMarkers: true,
      fields: ["days", "count"], // Show both "days" and "count" in the tooltip
      position: "top",
    },

    interactions: [
      {
        type: "element-highlight",
      },
    ],
    legend: {
      position: "top-right", // You can adjust the legend's position as needed
      marker: {
        symbol: "square", // You can change the legend marker symbol if desired
      },
    },
  };

  return (
    <Row
      style={{
        display: "flex",
        justifyContent: "center",
        background: "white",
        padding: "20px 0px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: 10,
      }}
    >
      <Col span={22}>
        <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
          <p style={{ fontSize: 24 }}>{title} </p>
          <p style={{ fontSize: 16 }}> {subTitle}</p>
        </div>
        {/* <Column {...config} /> */}
        <Histogram {...configssss} />
      </Col>
    </Row>
  );
}

export default BasicHistograms;
