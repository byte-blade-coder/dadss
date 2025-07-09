import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Col, Row, Select } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
const { RangePicker } = DatePicker;
function MultiBiDirectionalBar(props) {
  const { title, data, subTitle, src } = props;

  var transformedData = {
    labels: data?.map((item) => item.date),
    datasets: [
      {
        label: "Arrivals",
        data: data?.map((item) => ({ x: item.date, y: item.arrivals })),
        backgroundColor: "green",
      },
      {
        label: "Departures",
        data: data?.map((item) => ({ x: item.date, y: item.departures })),
        backgroundColor: "blue",
      },
    ],
  };

  const options = {
    barPercentage: 0.7,
    categoryPercentage: 0.8,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        // suggestedMin: -100,
        // suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
            family: "Arial",
          },
          color: "black",
        },
      },
    },
  };
  const handleChange = (value) => {
  };
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
          <Bar data={transformedData} style={{width: "200px"}} options={options} chart={Chart} />
        </Col>
      </Row>
    </>
  );
}

export default MultiBiDirectionalBar;
