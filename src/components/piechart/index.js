import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";
import { Col, Row, Select } from "antd";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import Link from "next/link";

const PieChart = () => {
  const data = [
    {
      type: "分类一",
      value: 27,
    },
    {
      type: "分类二",
      value: 25,
    },
    {
      type: "分类三",
      value: 18,
    },
    {
      type: "分类四",
      value: 15,
    },
    {
      type: "分类五",
      value: 10,
    },
    {
      type: "其他",
      value: 5,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    color: ["#3AE09A", "#407FFF"],
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [
      {
        type: "pie-legend-active",
      },
      {
        type: "element-active",
      },
    ],
  };
  const handleChange = (value) => {
  };
  return (
    <>
      <Row style={{ marginBottom: 30, padding: 20 }}>
        <Col span={4}>
          <Link href="/">
            back to{" "}
            <span
              style={{ fontSize: 20, fontWeight: "bold", color: "#0659ED" }}
            >
              Dashboard
            </span>
          </Link>
        </Col>
        <Col span={6}>
          <label className="px-2">Vessel type:</label>
          <Select
            defaultValue="View all"
            style={{
              width: 150,
            }}
            onChange={handleChange}
            options={[
              {
                value: "View all",
                label: "View all",
              },
              {
                value: "Vessel 1",
                label: "Vessel 1",
              },
              {
                value: "Vessel 2",
                label: "Vessel 2",
              },
            ]}
          />
        </Col>
        <Col span={6}>
          <label className="px-2">Year</label>
          <Select
            defaultValue="View all"
            style={{
              width: 150,
            }}
            onChange={handleChange}
            options={[
              {
                value: "View all",
                label: "View all",
              },
              {
                value: "Year 2016",
                label: "Year 2016",
              },
              {
                value: "Year 2022",
                label: "Year 2022",
              },
            ]}
          />
        </Col>
        <Col span={6}>
          <RangePicker format="DD-MM-YYYY"/>
        </Col>
      </Row>
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Col span={16}>
          <Pie {...config} />
        </Col>
      </Row>
    </>
  );
};

export default PieChart;
