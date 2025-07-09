import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { Col, Row, Select, Tooltip } from "antd";
import styled from "styled-components";
import {generateColors} from "../../helper/colorPalette";
import { FaRegQuestionCircle  } from "react-icons/fa";
import Heading from "../../../src/components/title/Heading";
import { GrCircleInformation } from "react-icons/gr"; 

const DemoColumn = (props) => {
  const { title, subTitle, data, isGroup, chart, currentGroup } = props;
  console.log(props)
  // Check if the data prop is undefined or not an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    // Return only title and subTitle when data is not available
    return (
      <div>
        <p> </p>
        {/* <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
          <p style={{ fontSize: 24 }}>{title} </p>
          <p style={{ fontSize: 16 }}> {subTitle}</p>
        </div>
        <div>No data available for the chart.</div> */}
      </div>
    );
  }

  const uniqueSeries = [...new Set(data.map(item => item.name))]; // Assuming 'name' is the series field
  const colors = generateColors(uniqueSeries.length, 'Paired');
  const xField = "date";
  const uniqueXLabels = [...new Set(data.map(item => item[xField]))]; 

  const config = {
    data: data,
    isGroup: isGroup,
    xField: "date", // x-axis: 'name' for OverStay and 'date' for VisitingPakistan
    yField: "value", // y-axis: 'value' for both
    seriesField: "name", // series field: 'name' for OverStay (key) and 'name' for VisitingPakistan (year)
    color: chart === "entering leaving" && currentGroup === "harbor" ? ["green", "blue"] : chart === "entering leaving" 
    && currentGroup === "type" ?  ["green", "blue"] : colors,
    barStyle: {
      fill: "l(0) 0:#3e5bdb 1:#dd3121",
    },
    marginRatio: 0.1,
    // width: 800,
    height: uniqueXLabels.length > 8 ? 560 : 520,
    padding: uniqueXLabels.length > 8 ? [50, 10, 200, 80] : [40, 10, 120, 70],
    xAxis: {
      label: {
        autoRotate: false,
        rotate: uniqueXLabels.length > 8 ? -(Math.PI) / 2 : 0,
        offset: uniqueXLabels.length > 8 ? 20: 15, // Adjust label offset to prevent overlap with the chart
        style: {
          fontSize: currentGroup === "time" ? uniqueXLabels.length > 7 ? 12 : 16 : 15,
          fill: 'black',
          fontWeight: 500,
          textAlign: uniqueXLabels.length > 8 ? 'right' : 'center', // Align text right when rotated
          textBaseline: uniqueXLabels.length > 8 ? 'middle' : 'top', // Vertical alignment when rotated
          //textAlign: 'center',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fontSize: 16,
          fill: "444555", 
          fontWeight: 500,
        },
      },
      title: {
        style: {
          // fill: "gray", 
          fill: "#444555",
          fontWeight: 600,
          fontSize: 16,
          text: "Vessel Count"
        },
      },
    },
    legend: {
      position: 'top',
      layout: 'horizontal',
      offsetX: 20,
      // offsetY: 2, 
      itemName: {
        style: {
          fontSize: 15,
          fill: "#444555",
          fontWeight: 600,
        },
      },
    },
    // tooltip: {
    //   // Ensure your charting library supports these settings for tooltips
    //   //itemTpl: `<div style="font-size: 12px; color: #000000; font-weight: 700;">{name}: {value}</div>`,
    //   // Alternatively, if you have access to tooltip styling through CSS or other means:
      // style: {
      //   fontSize: 16,
      //   color: "#000000",
      //   fontWeight: 600,
      // },
    // },
    // background: "#ffffff", 
  };

  return (
    <>
      <Row
        style={{
          height: uniqueXLabels.length > 8 ? "80vh" : "72vh",
          // height: "600px",
          display: "flex",
          justifyContent: "center",
          background: "white",
          padding: "20px 0px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: 10,
        }}
      >
        <Col span={22} >
            <Tooltip title={subTitle} placement="left">
              <div className="flex">
                <Heading className="ml-5" level={3} text={title} />
                {subTitle && <FaRegQuestionCircle className="ml-1 mt-2" size={18} />}
              </div>
            </Tooltip>
          {/* <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
            <p style={{ fontSize: 24 }}>{title} </p>
            <p style={{ fontSize: 16 }}> {subTitle}</p>
          </div> */}
          <Column {...config} />
        </Col>
      </Row>
    </>
  );
};

export default DemoColumn;

const Wrapper = styled.div`
  .ant-tooltip .ant-tooltip-placement-top
  {
    left: 500px !important;
    top: 90px !important;

  }
`;

  // //Spectral, Viridis, Inferno, Magma, Plasma, Warm, Cool, Cubehelix, RdYlBu BuGn YlOrRd
  // rgb - Linear interpolation in RGB color space.
  // lab - Linear interpolation in LAB color space.
  // lch - Linear interpolation in LCH (Lightness, Chroma, Hue) color space.
  // hsl - Linear interpolation in HSL (Hue, Saturation, Lightness) color space.
  // hcl - Linear interpolation in HCL (Hue, Chroma, Lightness) color space (similar to LCH).
 
  //Set1, Paired, Dark2