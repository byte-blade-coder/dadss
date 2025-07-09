import React , { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import styled from "styled-components";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Col, Row, Select } from "antd";
import {Tooltip  as tt} from "antd";
import { FaRegQuestionCircle  } from "react-icons/fa";
import { LoadingOutlined } from "@ant-design/icons";
import Heading from "../title/Heading";
import { GrCircleInformation } from "react-icons/gr";
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = ({ title, data, chart,subTitle,apiFilter, isGroup }) => {
  // console.log(title, data,isGroup,"subTitle:",subTitle)

  const [check, setCheck] = useState(false);

  useEffect(() => {
    const dataStatus = checkData(data);
  
    if(dataStatus === 'containsDatasets')
    {
      setCheck(true)
    }
    else if(dataStatus === 'noData')
    {
      setCheck(false)
    }
  
  }, [data]);

  const checkData = (data) => {
    if (!data || !Array.isArray(data.labels) || data.labels.length === 0 || !Array.isArray(data.datasets) || data.datasets.length === 0) 
    {
      return 'noData';
    }
    else  return 'containsDatasets';
  };

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
        onClick: (e, legendItem, legend) => {
          const chart = legend.chart;
          const datasets = chart.data.datasets;
          const monthLabel = legendItem.text; // The clicked month label
  
          // Toggle visibility for both Arrival and Departure datasets for the clicked month
          datasets.forEach((dataset) => {
            if (dataset.label.includes(monthLabel)) {
              dataset.hidden = !dataset.hidden;
            }
          });
  
          chart.update();
        },
        labels: {
          usePointStyle: true,
          generateLabels: (chart) => {
            const labels = chart.data.labels;
            const datasets = chart.data.datasets;
  
            return labels?.map((label, index) => {
              const backgroundColor = datasets[0].backgroundColor[index];
  
              return {
                text: label, // Use the month label (e.g., "August 2023")
                fillStyle: backgroundColor, // Use the corresponding color for that month
                hidden: datasets[0].data[index] === null && datasets[1].data[index] === null, // Check if both Arrival and Departure are hidden
                usePointStyle: true,
                pointStyle: 'rect',
              };
            });
          },
          font: {
            size: 16,
            weight: 500
          }
        },
      },
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
          maxRotation: data?.labels?.length > 8 ? 90 : 0, // Rotate labels if more than 8
          minRotation: data?.labels?.length > 8 ? 90 : 0, // Set vertical if more than 8
          color: "black",
          font: {
            size: 16,
            weight: 500
          },
          align: data?.labels?.length > 8 ? "center": "center",
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
        ticks: {
          color: "black",
          align: "start",
          font: {
            size: 16,
            weight: 600
          }
        //   callback: function (value, index, ticks) {
        //     // Custom labels only at the max and min points
        //     const maxValue = ticks[ticks.length - 1].value;
        //     const minValue = ticks[0].value;
  
        //     // Label only the highest positive and the lowest negative points
        //     if (value === maxValue) {
        //       return `Arrivals`; // Display at the highest tick
        //     } else if (value === minValue) {
        //       return `Departures`; // Display at the lowest tick
        //     }
        //     return null; // Do not display other labels
        //   },
        },
      },
    },
   };

  // console.log("Stack Bar Data: \n", data, "\nShow chart? ", check)

  return (
    <>
     { check ?
      (
      <Row
        style={{
          height: "75vh",
          // height: "100%",
          display: "flex",
          justifyContent: "center",
          background: "white",
          padding: "20px 0px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: 10,
        }}
      >
        <Col span={22}>
          <tt title={subTitle}>
            <div className="flex">
              <Heading className="ml-5" level={3} text={title} />
              {subTitle && <FaRegQuestionCircle  className="ml-1 mt-2" size={18} />}
            </div>
          </tt>
            <ChartCanvas>
              <Bar data={data} options={options}/>
            </ChartCanvas>
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


export default BarChart;

const ChartCanvas = styled.div`
  //height:40vh; 
  // width:80vw;
  width: 100%;
  display: inline-block;
  position: relative;
  canvas{
    // width: 1327px !important;
    // max-height
    // max-width
    height: 480px !important;
    //height: calc(80% - 300px) !important;
  }
`;