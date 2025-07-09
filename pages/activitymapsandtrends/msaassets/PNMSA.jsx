
import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { Checkbox, Col, Radio, Row, Select } from "antd";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import { DatePicker } from "antd";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";
const { Option } = Select;
const { RangePicker } = DatePicker;

const Aircarft = dynamic(() => import("../msaassets/PNMSAaircraft"), {
  ssr: false,
  loading: () => (
    <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
  ),
});

const Ships = dynamic(() => import("../msaassets/PNMSAships"), {
  ssr: false,
  loading: () => (
    <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
  ),
});

function PNMSA() {
  const [currentPage, setCurrentPage] = useState("air");
  const [currentChart, setCurrentChart] = useState("bar");
  const [showAdditionalDropdown, setShowAdditionalDropdown] = useState(false);

  const isCalendarChart = currentChart === "calenderGrph";
  const isMonthlyCalendarChart = currentChart === "monthlyCalendar";

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChartChange = (chartType) => {
    setCurrentChart(chartType);
    // Set showAdditionalDropdown to true when "calenderGrph" is selected
    setShowAdditionalDropdown(
      chartType === "calenderGrph" ||
      chartType === "dailyCalendar" ||
      chartType === "monthlyCalendar"
    );
  };

  return (
    <div>
      {/* <div>
        <Link href="/">
          <BsArrowLeft size={30} />
          back to
          <span
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#0659ED",
              paddingLeft: 5,
            }}
          >
            Dashboard
          </span>
        </Link>
      </div> */}
      <Visualpageheader />

      <div className="grid grid-cols-12 grid-rows-1 gap-4 mb-4 mt-3 ">
        <div className="col-span-3">
          <div>
            <p className="font-bold invisible ... ">c</p>
          </div>
          <div>
            <Radio
              defaultChecked
              onChange={() => handlePageChange("air")}
              checked={currentPage === "air"}
              style={{ fontSize: 16 }}
            >
              Aircraft
            </Radio>
            <Radio
              onChange={() => handlePageChange("ship")}
              checked={currentPage === "ship"}
              style={{ fontSize: 16 }}
            >
              Surface Ships
            </Radio>
          </div>
        </div>
        <div
          //  className="col-span-2 col-start-8"
          className={`col-span-2 ${currentChart === "calenderGrph" ||
            currentChart === "dailyCalendar" ||
            currentChart === "monthlyCalendar"
            ? "col-start-9"
            : "col-start-11"
            }`}
        >
          <div>
            <p className="font-bold">Visuals</p>
          </div>
          <Select
            placeholder="Select Chart"
            style={{
              width: 150,
            }}
            onChange={handleChartChange}
            value={currentChart}
          >
            <Option value="bar">Bar Graph</Option>
            <Option value="choropethGraph">Choropleth</Option>
            <Option value="calenderGrph">Calendar</Option>
            <Option
              style={{
                display: currentChart === "calenderGrph" ? "none" : "none",
              }}
              className="invisible ..."
              value="monthlyCalendar"
            >
              Calendar
            </Option>
            <Option
              style={{
                display: currentChart === "calenderGrph" ? "none" : "none",
              }}
              className="invisible ..."
              value="dailyCalendar"
            >
              Calendar
            </Option>
          </Select>
        </div>
        {showAdditionalDropdown && (
          <div className="col-span-2 col-start-11">
            <div>
              <p className="font-bold">Calendar Visuals</p>
            </div>
            <Select
              placeholder="Select Chart"
              style={{
                width: 150,
              }}
              onChange={handleChartChange}
              value={currentChart}
            >
              <Option value="monthlyCalendar">Monthly Calendar</Option>
              <Option value="calenderGrph">Weekly Calendar</Option>
              <Option value="dailyCalendar">Daily Calendar</Option>
            </Select>
          </div>
        )}
        {/* <div className="col-span-3 col-start-10">
          <div className="px-2">
            <div>
              <p className="font-bold">Select a Date </p>
            </div>
            <RangePicker format="DD-MM-YYYY" />
          </div>
        </div> */}
      </div>

      {/* <Row className="p-4 flex items-center">
        <Col span={12} className="flex">
          <Radio
            defaultChecked
            onChange={() => handlePageChange("air")}
            checked={currentPage === "air"}
            style={{ fontSize: 16 }}
          >
            Aircraft
          </Radio>
          <Radio
            onChange={() => handlePageChange("ship")}
            checked={currentPage === "ship"}
            style={{ fontSize: 16 }}
          >
            Surface Ships
          </Radio>
        </Col>

        <Col span={4}>
          <div className="px-2 flex items-center">
            <label className="px-2">Visuals</label>
            <Select
              placeholder="Select Chart"
              style={{
                width: 150,
              }}
              onChange={handleChartChange}
              value={currentChart}
            >
              <Option value="bar">Bar Graph</Option>
              <Option value="chloropethGraph">Chloropleth</Option>
              <Option value="calenderGrph">Calendar</Option>
            </Select>
          </div>
        </Col>
        <Col span={4}>
          <div className="px-2 flex items-center">
            <label className="px-2">Visuals</label>
            <Select
              placeholder="Select Chart"
              style={{
                width: 150,
              }}
              onChange={handleChartChange}
              value={currentChart}
            >
              <Option value="bar">Bar Graph</Option>
              <Option value="chloropethGraph">Chloropleth</Option>
              <Option value="calenderGrph">Calendar</Option>
            </Select>
          </div>
        </Col>
        <Col span={6} className="flex justify-end items-center">
          <div className="px-2">
            <RangePicker />
          </div>
        </Col>
      </Row> */}

      <div>
        {currentPage === "air" ? (
          <Aircarft currentChart={currentChart} />
        ) : (
          <Ships currentChart={currentChart} />
        )}
      </div>
    </div>
  );
}

export default PNMSA;
