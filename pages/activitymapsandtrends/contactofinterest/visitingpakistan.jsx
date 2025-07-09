import React, { useEffect, useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { Col, Row, Select,Button } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import dayjs from "dayjs";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import axios from "axios";
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
  //store the vessel type
  const [vesselType, setVesselType] = useState("");
  // State to store filtered data
  const [filteredData, setFilteredData] = useState([]);
  // New state to track data loading status
  const [loading, setLoading] = useState(true);
  // State to manage date range for the DatePicker
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(6, "month"), // Initial start date: 12 months ago from today
    dayjs(), // Initial end date: today
  ]);

  const exportRef = useRef();

  // Fetch data whenever vesselType or dateRange changes
  useEffect(() => {
    handleApiChange();
  }, [vesselType, dateRange]);

  // Function to fetch and handle data from the API
  const handleApiChange = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    if (dateFrom && dateTo) {
      try {
        setLoading(true); // Start loading state
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARINE_DATA}/ship_counts_week?date_from=${dateFrom}&&date_to=${dateTo}`
        );
        if (response.status === 200) {
    

          const transformedData = response.data.flatMap((item) => {
            const startDate = item["Week Start"];
            const endDate = item["Week End"];

            return Object.entries(item.Counts).map(([name, value]) => ({
              name: name, // Use the port name as the "name"
              date: `${startDate} - ${endDate}`, // Combine start and end dates as the "date"
              value: value, // Use the count value as the "value"
            }));
          });

          setFilteredData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log(error)
        if (error) {
          showToastError(`Error : ${error}.`);
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
        <Button onClick={() => exportAsImage(exportRef.current, "COI-Vessels-Visiting-Pakistan", dateRange)}
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
            isGroup={true}
            title={"COI Vessels Visiting Pakistan"}
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
