import React, { useState, useEffect, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row, Select, Button } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";

const { RangePicker } = DatePicker;
const DemoColumn = dynamic(
  () => import("../../../src/components/barchart/BasicBar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function OverStay() {
  //store the vessel type
  const [vesselType, setVesselType] = useState("");
  // State to control loading state
  const [loading, setLoading] = useState(true);
  // State to store error message, if any
  const [error, setError] = useState(null);
  // State to store filtered data
  const [filteredData, setFilteredData] = useState([]);
  // State to manage date range for the DatePicker
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(12, "month"), // Initial start date: 12 months ago from today
    dayjs(), // Initial end date: today
  ]);
  const exportRef = useRef();
  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/overstay?date_from=${dateFrom}&&date_to=${dateTo}`
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();


      // Format the data for the bar chart
      const formattedData = Object.entries(data).flatMap(([key, value]) => ({
        date: key, // x-axis: key
        value: value, // y-axis: value
        name: key, // labels
      }));

      setFilteredData(formattedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.log(error)
      if (error.message) {
        showToastError(`Error : ${error.message}.`);
      }
    }
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

      <div className="flex justify-end items-center p-6">
        <div className="px-2">
          <div>
            <p className="font-bold">Select a Date </p>
          </div>
          <RangePicker
            onChange={(value) => setDateRange(value)}
            defaultValue={dateRange}
                format="DD-MM-YYYY"
          />
        </div>
        <Button onClick={() => exportAsImage(exportRef.current, "MSA-Assets-Overstay", dateRange)}
            className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mt-5">
            <div className="flex items-center gap-x-3">
              <FaFileDownload />
              Save as Image
            </div>
          </Button>
      </div>
      <Row ref={exportRef}>
        <Col span={24}>
          {loading ? (
            <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
          ) : (
            <DemoColumn
              isGroup={false}
              title={"MSA Own Platform - Overstay"}
              data={filteredData}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default OverStay;
