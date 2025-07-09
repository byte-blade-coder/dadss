import React, { useEffect, useState ,useRef} from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { Col, Row, Button, message } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import dayjs from "dayjs";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
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

function DurationSea() {
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs('2022-06-01'), 
    dayjs('2023-06-31'), 
  ]);
  const exportRef = useRef();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if(dateRange)
    {
      fetchData();
    }
    else
    {
      setLoading(true)
      messageApi.info({content: "Please select a date range to view the chart.",  
      duration: 8,
      // placement: "topRight",
      style: {
        position: "fixed",
        left: "40%",
        top: "52px"
      },});

    }
  }, [dateRange]);

  const fetchData = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/trip_duration?date_from=${dateFrom}&&date_to=${dateTo}`
      );
      const data = await response.json();


      // Convert the API data to the format expected by the PieChart3D component
      const transformedData = [
        {
          Port: "between 15 and 30 days",
          "No of vessels": data["between 15 and 30 days"],
        },
        {
          Port: "greater than 30 days",
          "No of vessels": data["greater than 30 days"],
        },
        {
          Port: "less than 15 days",
          "No of vessels": data["less than 15 days"],
        },
      ];
      setFilteredData(transformedData);


      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      console.log(error)
      if (error) {
        showToastError(`Error : ${error}.`);
      }
    }
  };



  return (
    <div>
      <div>
        <Visualpageheader/>
        {/* <Link href="/">
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
        </Link> */}
      </div>
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
        <Button onClick={() => exportAsImage(exportRef.current, "Fishing-Sea-Duration", dateRange)}
           className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mt-5">
          <div className="flex items-center gap-x-3">
            <FaFileDownload />
            Save as Image
          </div>
        </Button>
      </div>
      <Row ref={exportRef}>
        {contextHolder}
        <Col span={24}>
          {loading ? (
            <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
          ) : (
            <PieChart3D
              title={"Fishing Vessel - Duration at Sea"}
              data={filteredData}
            />
          )}
        </Col>
      </Row>
      
    </div>
  );
}

export default DurationSea;
