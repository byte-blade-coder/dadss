import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import moment from "moment";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import { BsArrowLeft } from "react-icons/bs";
import dayjs from "dayjs";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";

const { RangePicker } = DatePicker;
const DemoLine = dynamic(
  () => import("../../../src/components/linechart/MultiLine"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const FishingActivityTrends = () => {
  // State to control loading state
  const [loading, setLoading] = useState(true);
  // State to store error message, if any
  const [error, setError] = useState(null);
  // State to store filtered data
  const [filteredData, setFilteredData] = useState([]);
  // State to manage date range for the DatePicker
  const [dateRange, setDateRange] = useState([
    dayjs('2020-01-01'), 
    dayjs('2023-02-28'), 
  ]);
  const exportRef = useRef();
  // Fetch data whenever the dateRange changes
  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    // Function to fetch data from the API based on the selected date range
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/trip_count?date_from=${dateFrom}&&date_to=${dateTo}`
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
      //concatinate the month and year value
      const extractedData = data.map((item) => {
        const { Month, Year, ...rest } = item;
        return {
          data: Object.entries(rest).map(([location, value]) => ({
            location,
            value,
            monthYear: `${item.Month} ${item.Year}`, // Add monthYear field to each data entry
          })),
        };
      });


      //location extracted
      const locations = extractedData.flatMap((item) =>
        item.data.map((entry) => entry.location)
      );
      const uniqueLocations = [...new Set(locations)];

      //grouped the location according to the month  and year
      const groupedData = uniqueLocations.map((location) => ({
        location,
        data: extractedData.flatMap((item) =>
          item.data.filter((entry) => entry.location === location)
        ),
      }));
      setFilteredData(groupedData);
      setLoading(false); // Set loading state to false after data is fetched
    } catch (error) {
      setError(error.message); // Set error state if data fetching fails
      setLoading(false); // Set loading state to false after data is fetched
      console.error("Error fetching data:", error);
      // console.log(error)
      if (error.message) {
        showToastError(`Error : ${error.message}.`);
      }
    }
  };

  return (
    <>
      <div style={{ overflowY: "hidden" }}>

        <Visualpageheader/>

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
          <Button onClick={() => exportAsImage(exportRef.current, "Defender-Activity-Trend", dateRange)}
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
              <DemoLine
                title="Defender Activity"
                subTitle="Year to year"
                data={filteredData}
              />
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FishingActivityTrends;
