import React , { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import styled from "styled-components";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Col, Row, Select } from "antd";
import {Tooltip  as tt} from "antd";
import { FaRegQuestionCircle  } from "react-icons/fa";
import { LoadingOutlined } from "@ant-design/icons";
import Heading from "../../../src/components/title/Heading";
import { GrCircleInformation } from "react-icons/gr";
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const StackedGroupedBarChart = ({ title, data, chart,subTitle,apiFilter, isGroup }) => {
  console.log(title, data,isGroup,"subTitle:",subTitle)

  const [filteredData, setFilteredData] = useState([]);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const dataStatus = checkData(data);
    console.log(dataStatus)
  
    if(dataStatus === 'containsDatasets')
    {
      setCheck(true)
      // setFilteredData(data);
    }
    else if(dataStatus === 'noData')
    {
      setCheck(false)
      // setFilteredData(null);
   }
  
  }, [data]);

  const checkData = (data) => {
    if (!data || !Array.isArray(data.labels) || data.labels.length === 0 || !Array.isArray(data.datasets) || data.datasets.length === 0) 
    {
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
    else  return 'containsDatasets';
  };

  // Find the maximum and minimum values from the datasets
  const maxValue =  data?.datasets ? data?.datasets?.length >= 0 ? Math.max(...data?.datasets?.flatMap(dataset => dataset.data)) : 0 : 0;
  const minValue =  data?.datasets ? data?.datasets?.length >= 0 ? Math.min(...data?.datasets?.flatMap(dataset => dataset.data)) : 0 : 0;
  
  // console.log("maxValue", maxValue, Math.ceil(maxValue *1.1), "maxValue", minValue, Math.ceil(minValue *1.1))
  
  // const config = {
  //   type: 'bar',
  //   data: data,
   const options= {
      responsive: true,
      // aspectRatio:4,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false,
          text: title,
        },
        legend: {
          display: true,
          // display: apiFilter === "harbor" ? true : false, //chart === "time" && 
          onClick: (e, legendItem, legend) => {
            const chart = legend.chart;
            const datasets = chart.data.datasets;
    
            // Find all datasets with the matching label (both arrival and departure)
            datasets.forEach((dataset) => {
              if (dataset.label === legendItem.text) {
                dataset.hidden = !dataset.hidden;
              }
            });
    
            chart.update();
          },
          // Filter the duplicate legend items
          labels: {
            usePointStyle: true,
            generateLabels: (chart) => {
              const datasets = chart.data.datasets;
              const uniqueLabels = new Set();
              return datasets
                .map((dataset, index) => {
                  // Check if the label is already added
                  if (!uniqueLabels.has(dataset.label)) {
                    uniqueLabels.add(dataset.label);
                    return {
                      text: dataset.label,
                      //color: "purple",
                      fillStyle: dataset.backgroundColor,
                      hidden: dataset.hidden,
                      usePointStyle: true, 
                      pointStyle: 'rect',
                      index,
                    };
                  }
                  return null;
                })
                .filter((item) => item !== null); // Remove null values
            },  
            font: {
              size: 16,
              weight: 500
            },
          },
          position: "top"
        },
        
        // tooltip: {
        //   callbacks: {
        //     label: (context) => {
        //       const arrival = context.raw.y; // Get arrival data
        //       const departure = context.raw.departure; // Get departure data
        //       return `${context.dataset.label}: Arrival = ${arrival}, Departure = ${departure}`;
        //     },
        //   },
        // },
        // tooltip: {
        //   callbacks: {
        //     label: (context) => {
        //       const value = context.raw; // Get the value (arrival or departure)
        //       const label = value < 0 ? `Departure: ${Math.abs(value)}` : `Arrival: ${value}`; // Determine if it's an arrival or departure
        //       return `${context.dataset.label}: ${label}`;
        //     },
        //   },
        // },
      },
      responsive: true,
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            // callback: (value) => {
            //   return data.labels.length > 8 ? value : ''; // Display only for labels when length > 8
            // },
            callback: function(value, index, values) {
              // Assuming the labels are long, split them into multiple lines
              const label = data.labels[index];
              
              // // Check if the label is too long, then split into two lines
              // if (label.length > 10) {
              //   // Split the label into two parts (you can adjust this logic)
              //   const firstLine = label.substring(0, 12); // First 10 characters
              //   const secondLine = label.substring(12); // Rest of the characters
                
              //   return [firstLine, secondLine]; // Returning an array of strings will result in multiple lines
              // } 
              // Check if the label contains spaces and split it there
              // Run the split logic only if data.labels.length > 8
              if (data.labels.length > 8) {
                if (label.includes(' ')) {
                  return label.split(' '); // Split into multiple lines based on spaces
                }
              }
              return label; // If not long, return the label as is
            },
            color: "black",
            font: {
              size:  data?.labels?.length > 7 ? 13 : 16,
              weight: 500
            },
            align: data?.labels?.length > 8 ? "start": "center",
            maxRotation: data?.labels?.length > 8 ? 90 : 0, // Rotate labels if more than 8
            minRotation: data?.labels?.length > 8 ? 90 : 0, // Set vertical if more than 8
          },
          barPercentage: 0.9, // Control bar width
          categoryPercentage: 55, // Control the space between upward and downward bars
        },
        y: {
          title: {
            color: 'black',
            display: true,
            text: 'Vessel Count',
            font: {
              size: 16,
              weight: 500
            }
          },
          stacked: true,
          beginAtZero: true,
          //max: maxValue,
         // min: minValue,
          // max: Math.ceil(maxValue * 1.5),
          // min: Math.ceil(minValue * 1.5),
          ticks: {
            color: "black",
            font: {
              size: 16,
              weight: 600
            },
            callback: function (value) {
              return value < 0 ? Math.abs(value) : value; // Display absolute values on the y-axis
            },
          },
          barPercentage: 0.9, // Control bar width
          categoryPercentage: 1, // Control the space between upward and downward bars
        },
        // x: {
        //   grouped: true,
        // },
        // y: {
        //   grouped: true,
        //   title: "Value",
        //   // ticks: {
        //   //   // Include a dollar sign in the ticks
        //   //   callback: function(value, index, ticks) {
        //   //       return '$' + value;
        //   //   }
        //   // }
        // },
      },
    };
  // };

  console.log("Stack Bar Data: \n", data, "\nShow chart? ", check)

  return (
    <>
     { check ?
      (
      <Row
        style={{
          height: "84vh",
          display: "flex",
          justifyContent: "center",
          background: "white",
          padding: "20px 0px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: 10,
        }}
      >
        <Col span={23}>
          <tt title={subTitle}>
            <div className="flex">
              <Heading className="ml-5" level={3} text={title} />
              {subTitle && <FaRegQuestionCircle  className="ml-1 mt-2" size={18} />}
            </div>
          </tt>
          {/* <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
            <p style={{ fontSize: 24 }}>{title} </p>
            <p style={{ fontSize: 16 }}> {subTitle}</p>
          </div> */}
          
            <ChartCanvas>
              <Bar data={data} options={options} />
            </ChartCanvas>
            {/* // <Bar {...config} /> */}
        </Col>
      </Row>
       ) : (
        <div>
            <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
        </div>
      )} 
    </>
  );
};


export default StackedGroupedBarChart;


const ChartCanvas = styled.div`
  width: 100%;
  // display: flex;
  display: inline-block;
  position: relative;
  canvas{
    height: 550px !important;
  }
`;