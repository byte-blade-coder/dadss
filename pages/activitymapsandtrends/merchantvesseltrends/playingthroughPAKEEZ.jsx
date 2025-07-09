import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import Heading from "../../../src/components/title/Heading";
import { Col, Row, Select, Switch, Button } from "antd";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import axios from "axios";
import dayjs from "dayjs";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import { type_list } from "../../../src/helper/dropdown";
import { DatePicker } from "antd";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";

const { RangePicker } = DatePicker;
const PieChart3D = dynamic(
  () => import("../../../src/components/piechart/PieChart3D"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function PlayingThroughPAKEEZ() {
  const [harbor, setHarbor] = useState("");
  const [season, setSeason] = useState("");
  const [vesselType, setVesselType] = useState("");
  // const [dateRange, setDateRange] = useState([
  //   dayjs().subtract(12, "month"),
  //   dayjs(),
  // ]);
  const [dateRange, setDateRange] = useState([
    dayjs('2023-08-01'),
    dayjs('2023-10-31'),
  ]);
  const [filteredData, setFilteredData] = useState("");
  const [loading, setLoading] = useState(true);
  const exportRef = useRef();
  useEffect(() => {
    handleApiChange();
  }, [harbor, vesselType, season, dateRange]);

  const handleApiChange = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARINE_DATA}/ship_counts?date_from=${dateFrom}&&date_to=${dateTo}`
      );
      const data = response.data; // Use response.data instead of response.json()
  

      // Convert the API data to the format expected by the PieChart3D component
      const transformedData = Object.keys(data).map((key) => ({
        "No of vessels": data[key],
        Port: key,
      }));
      setFilteredData(transformedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
      if (error.message) {
        showToastError(`Error : ${error.message}.`);
      }
    }
  };

  return (
    <>
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
        <Button onClick={() => exportAsImage(exportRef.current, "MVs Plying through Pak EEZ", dateRange)}
            className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mt-5">
            <div className="flex items-center gap-x-3">
              <FaFileDownload />
              Save as Image
            </div>
          </Button>
      </div>
      <div ref={exportRef}>
        <PieChart3D
          title="MVs Plying through Pak EEZ "
          subTitle=" Data Source (AIS)"
          data={filteredData}
        />
      </div>
    </>
  );
}

export default PlayingThroughPAKEEZ;
export async function getServerSideProps(context) {
  return {
    props: {
      title: `PlayingThroughPAKEEZ`,
    },
  };
}
