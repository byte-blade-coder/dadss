import React, { useEffect, useState } from "react";
import { Col, Row, Select } from "antd";
//import ZoomableSunburst from "react-d3-zoomable-sunburst";
import * as d3 from "d3"; // Import D3 library
import { last } from "@antv/util";
import { Sunburst } from "@ant-design/plots";

function SunburstChart(props) {
  const { title, data, subTitle } = props;
  // Check if the data prop is undefined, empty object, or an empty array
  // if (!data || (typeof data === "object" && Object.keys(data).length === 0))
  if (data.length === null || data.length === 0) {
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
  // year wise
  function transformDatas(data) {
    const root = {
      name: "Root",
      children: [],
    };

    data.forEach((item) => {
      const locationNames = Object.keys(item).filter((key) => key !== "date");

      locationNames.forEach((locationName) => {
        // Check if the location node exists, create if not
        let locationNode = root.children.find(
          (node) => node.name === locationName
        );
        if (!locationNode) {
          locationNode = {
            name: locationName,
            children: [],
          };
          root.children.push(locationNode);
        }

        const rawDate = item.date;
        const [month, year] = rawDate.split(", ");

        if (month && year) {
          // Check if the year node exists, create if not
          let yearNode = locationNode.children.find(
            (node) => node.name === year
          );
          if (!yearNode) {
            yearNode = {
              name: year,
              children: [],
            };
            locationNode.children.push(yearNode);
          }

          // Check if the month node exists, create if not
          let monthNode = yearNode.children.find((node) => node.name === month);
          if (!monthNode) {
            monthNode = {
              name: month,
              children: [],
            };
            yearNode.children.push(monthNode);
          }

          const arrivalData = {
            name: "Arrivals",
            type: "Arrival",
            value: item[locationName].arrivals,
          };

          const departureData = {
            name: "Departures",
            type: "Departure",
            value: item[locationName].departures,
          };

          // Add arrivals and departures as children to the month node
          monthNode.children.push(arrivalData, departureData);
        }
      });
    });

    return root;
  }

  const colorSchemes = {
    locations: d3.schemeCategory10,
    years: d3.schemeSet3,
    months: d3.schemePaired,
    types: d3.schemePastel1,
  };

  const getColor = (node) => {
    const depth = node.depth;
    const index = node.index;

    if (depth === 1) {
      // Locations/Ports
      return colorSchemes.locations[index % colorSchemes.locations.length];
    } else if (depth === 2) {
      // Years
      return colorSchemes.years[index % colorSchemes.years.length];
    } else if (depth === 3) {
      // Months
      return colorSchemes.months[index % colorSchemes.months.length];
    } else if (depth === 4) {
      // Types
      return colorSchemes.types[index % colorSchemes.types.length];
    }

    return "#ccc"; // Default color
  };

  const config = {
    data: data,
    innerRadius: 0.5,
    radius: 1,
    interactions: [
      {
        type: "element-active",
      },
    ],
    colorField: 'name',
    hierarchyConfig: {
      field: "value",
    },
    label: {
      layout: [
        {
          type: "limit-in-shape",
        },
      ],
      style: {
        fill: "black", // Change the text color to black
      },
    },
    animate: {
      enter: { type: 'waveIn' }
    },
    width: 100, // Set the desired width of the chart
    height: 600, // Set the desired height of the chart
    legend: {
      position: "top", // Display the legend at the top of the chart
      layout: "horizontal", // Display the legend items horizontally

      offsetY: 1, // Adjust the vertical offset if needed
      itemName: {
        style: {
          fill: "rgba(0, 0, 0, 0.65)", // Customize the text color of legend items
        },
      },
    },
    ///color: (node) => getColor(node),
    
  };
  console.log(config)

  return (
    <>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          background: "white",
          padding: "20px 5px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: 10,
        }}
      >
        <Col span={22}>
          <p style={{ fontSize: 24 }}>{title}</p>
          <p style={{ paddingBottom: 20 }}>{subTitle}</p>
          <Sunburst {...config} />
        </Col>
      </Row>
    </>
  );
}

export default SunburstChart;
