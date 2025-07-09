import React, { useEffect, useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { BsArrowLeft } from "react-icons/bs";
import { Col, Row, Select, Button } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";
import { harbor_list, merchant_harbor_list, ais_type_summary } from "../../../src/helper/dropdown";

const { RangePicker } = DatePicker;
const MultiBiDirectionalBar = dynamic(
  () => import("../../../src/components/barchart/MultiBiDirectionalBar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const Sunburst = dynamic(
  () => import("../../../src/components/sunburstChart/sunBurst"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const StackBar = dynamic(
  () => import("../../../src/components/barchart/stackbar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);


function EnteringLeavingHarbour() {
  
  const [harbor, setHarbor] = useState("");
  const [dateRange, setDateRange] = useState([
    dayjs('2023-08-01'), 
    dayjs('2023-10-31'), 
  ]);
  const [filteredData, setFilteredData] = useState("");
  const [currentChart, setCurrentChart] = useState("bar");
  const [sunburstApi, setSunburstApi] = useState("");

  const handleChartChange = (chartType) => {
    setCurrentChart(chartType);
  };
  const exportRef = useRef();
  
  useEffect(() => {
    handleApiChange();
  }, [harbor, dateRange]);

  const handleApiChange = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/mer_leave_enter?date_from=${dateFrom}&&date_to=${dateTo}&&boat_location=${harbor}`
      );
      //for sunburst using this api
      const apiResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/mer_mv_leave_enter?date_from=${dateFrom}&&date_to=${dateTo}&&boat_location=${harbor}`
      );
      if (response.status === 200 || apiResponse.status === 200) {
        setFilteredData(response.data);
        console.log(filteredData)

        function transformData(apiResponse) {
          const root = {
            name: "Root",
            children: [],
          };

          apiResponse.data.forEach((item) => {
            const locationNames = Object.keys(item).filter(
              (key) => key !== "date"
            );
            locationNames.forEach((locationName) => {
              // Check if the location node exists, create if not
              let locationNode = root.children.find(
                (node) => node.name === locationName
              );
              if (!locationNode) {
                locationNode = {
                  name: locationName,
                  children: [],
                };
                root.children.push(locationNode);
              }

              const rawDate = item.date;
              const [month, year] = rawDate.split(" ");
              console.log(rawDate)
              if (month && year) {
                // Check if the year node exists, create if not
                let yearNode = locationNode.children.find(
                  (node) => node.name === year
                );
                if (!yearNode) {
                  yearNode = {
                    name: year,
                    children: [],
                  };
                  locationNode.children.push(yearNode);
                }

                // Check if the month node exists, create if not
                let monthNode = yearNode.children.find(
                  (node) => node.name === month
                );
                if (!monthNode) {
                  monthNode = {
                    name: month,
                    children: [],
                    value: item[locationName].arrivals,
                    // value: item[locationName].departures,
                  };
                  yearNode.children.push(monthNode);
                }
              }
            });
          });
          return root;
        }
        const transformedData = transformData(apiResponse);
        setSunburstApi(transformedData);
         console.log("transformedData", transformedData, "sunburstApi", sunburstApi)
      }
    } catch (error) {
      console.log(error)
      if (error.message) {
        showToastError(`Error : ${error.message}.`);
      }
    }
  };

  return (
    <div>
      <Visualpageheader/>
      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="col-start-5 row-start-1">
          {" "}
          <div className="px-2">
            <div>
              <p className="font-bold">Harbour</p>
            </div>
            <Select
              placeholder="View all"
              style={{
                width: 150,
              }}
              onChange={(value) => setHarbor(value)}
              options={[{ value: "", label: "View all" }].concat(
                merchant_harbor_list.map((item) => ({
                  value: item,
                  lable: item,
                }))
              )}
            />
          </div>
        </div>
        <div className="col-start-6 row-start-1">
          {" "}
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
        </div>
        <div className="col-start-4 row-start-1">
          {" "}
          <div className="px-2">
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
              <Option value="sunBurst">Sunburst Chart</Option>
              {/* <Option value="stackBar">Stack Bar Graph</Option> */}
            </Select>
          </div>
        </div>
        <div className="col-start-7 row-start-1">
        <div className="px-2" >
          <Button onClick={() => exportAsImage(exportRef.current, "Merchant-Harbour-Trend", dateRange)}
            className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mt-5">
            <div className="flex items-center gap-x-3">
              <FaFileDownload />
              Save as Image
            </div>
          </Button>
        </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }} ref={exportRef}>
        {currentChart === "bar" ? (
          <MultiBiDirectionalBar
            title={"Merchant Boats Leaving and Entering Harbour"}
            data={filteredData ? filteredData : [{}]}
            src={"Merchant"}
          />
        ) : currentChart === "sunBurst" ? (
          <Sunburst
            data={sunburstApi}
            title={"Merchant Boats Leaving and Entering Harbour"}
          />
        ) : (
          <StackBar
            // data={data}
            title={"Merchant Boats Leaving and Entering Harbour"}
          />
        )}
      </div>
    </div>
  );
}

export default EnteringLeavingHarbour;
export async function getServerSideProps(context) {
  return {
    props: {
      title: `Entering and Leaving Harbor`,
    },
  };
}
