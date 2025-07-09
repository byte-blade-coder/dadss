import React, { useEffect, useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { Col, Row, Select, Button, message, DatePicker } from "antd";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import dayjs from "dayjs";
import axios from "axios";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";

const { RangePicker } = DatePicker;
const BasicBar = dynamic(
  () => import("../../../src/components/barchart/BasicBar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function VisitingPakistan() {
  // State to store filtered data
  const [filteredData, setFilteredData] = useState([]);
  // New state to track data loading status
  const [loading, setLoading] = useState(true);
  // State to manage date range for the DatePicker
  // const [dateRange, setDateRange] = useState([
  //   dayjs().subtract(6, "month"), // Initial start date: 12 months ago from today
  //   dayjs(), // Initial end date: today
  // ]);
  const [dateRange, setDateRange] = useState([
    dayjs('2023-07-21'), 
    dayjs('2023-10-31'), 
  ]);
  const exportRef = useRef();
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch data whenever dateRange changes
  useEffect(() => {
    if(dateRange)
    {
      handleApiChange();
    }
    else{
      setLoading(true)
      messageApi.info({content: "Please select a date range to view the chart.",  
        duration: 8,
        style: {
          position: "fixed",
          left: "40%",
          // transform: "translateX(-50%)",
          top: "52px"
        },});
    }
  }, [dateRange]);

  // Function to fetch and handle data from the API
  const handleApiChange = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    if (dateFrom && dateTo) {
      try {
        setLoading(true); // Start loading state
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARINE_DATA}/mv_trips_count?date_from=${dateFrom}&&date_to=${dateTo}`
        );
        if (response.status === 200) {
          console.log(response)

          const transformedData = response.data.flatMap((item) => {
          console.log(item)
            return {
              name: item.trip_count, // Use the port name as the "name"
              date: `${item.trip_count} trips`,
              value: item.ship_count, // Use the count value as the "value"
            }
            //   return {
            //   name: item.ship_count, // Use the port name as the "name"
            //   date: `${item.ship_count} ships`,
            //   value: item.trip_count, // Use the count value as the "value"
            // }
          });

          setFilteredData(transformedData);
        }
      } catch (error) {
        console.log(error)
        if (error.message) {
          showToastError(`Error : ${error?.response?.statusText}.`);
        }
      } finally {
        setLoading(false); // Stop loading state
      }
    } else {
      setFilteredData([]);
      setLoading(false); // Stop loading state
    }
  };
  return (
    <div>
      <Visualpageheader/>
        {contextHolder}
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
        <Button onClick={() => exportAsImage(exportRef.current, "Mechant-Vessels-Visiting-Pakistan", dateRange)}
            className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mt-5">
            <div className="flex items-center gap-x-3">
              <FaFileDownload />
              Save as Image
            </div>
          </Button>
      </div>
      <div ref={exportRef}>
        {loading ? (
          <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
        ) : (
          <BasicBar
            isGroup={false}
            title={"Mechant Vessels (MV's) Trip Count"}
            subTitle={"Data Source (AIS)"}
            data={filteredData}
          />
        )}
      </div>
    </div>
  );
}

export default VisitingPakistan;

export async function getServerSideProps(context) {
  return {
    props: {
      title: `Visiting Pakistan`,
    },
  };
}
