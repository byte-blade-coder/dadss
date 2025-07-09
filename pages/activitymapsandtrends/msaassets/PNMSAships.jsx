import React, { useEffect, useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { Checkbox, Col, Row, Select } from "antd";
import { DatePicker } from "antd";
import "leaflet/dist/leaflet.css";
import geoJSONData from "../../../src/components/cholorpleth/data";
import Data from "../../../src/components/calendar/calendarData";

const BasicBar = dynamic(
  () => import("../../../src/components/barchart/BasicBar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const Choropleth = dynamic(
  () => import("../../../src/components/cholorpleth/chloroplethMap"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

// const Choropleth = dynamic(
//   () => import("../../../src/components/Maps/ChoroplethCustomMap"),
//   {
//     ssr: false,
//     loading: () => (
//       <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
//     ),
//   }
// );

const CalendarWeekly = dynamic(
  () => import("../../../src/components/calendar/calendarWeeklyMap"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const CalendarMonthly = dynamic(
  () => import("../../../src/components/calendar/calendarMontlhyMapCopy"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const CalendarDaily = dynamic(
  () => import("../../../src/components/calendar/calendarDailyMap"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const PNMSAaircraft = ({ currentChart }) => {
  useEffect(() => {
    handleApiChange();
  }, []);

  const [shipData, setShipData] = useState();
  const [loading, setLoading] = useState(true);

  const exportRef = useRef();
  const handleApiChange = async () => {
    const response = [
      { ship: "Ship 1", number: 56 },
      { ship: "Ship 2", number: 82 },
      { ship: "Ship 3", number: 15 },
      { ship: "Ship 4", number: 33 },
      { ship: "Ship 5", number: 71 },
      { ship: "Ship 6", number: 29 },
      { ship: "Ship 7", number: 91 },
      { ship: "Ship 8", number: 47 },
      { ship: "Ship 9", number: 64 },
      { ship: "Ship 10", number: 88 },
    ];


    // Format the data for the bar chart
    const formattedData = response.map(({ ship, number }) => ({
      date: ship, // x-axis: air
      value: number, // y-axis: number
      name: ship, // labels
    }));

    setShipData(formattedData);
    setLoading(false);
  };


  return (
    <div>
      <div>
        {!shipData ? (
          loading ? (
            <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
          ) : null
        ) : currentChart === "bar" ? (
          <BasicBar
            isGroup={false}
            title={"Deployment/ Employment of MSA Assets at Sea"}
            subTitle={"Monthly Flying Hours of PMSA Defenders"}
            data={shipData}
          />
        ) : currentChart === "choropethGraph" ? (
          <Choropleth
            // geoJSONData={geoJSONData}
          data={geoJSONData}
          title={"Deployment/ Employment of MSA Assets at Sea"}
          subTitle={"Monthly Flying Hours of PMSA Defenders"}
          />
        ) : currentChart === "calenderGrph" ? (
          <CalendarWeekly
            datas={Data}
            title={"Deployment/ Employment of MSA Assets at Sea"}
            subTitle={"Weekly Calendar"}
          />
        ) : currentChart === "monthlyCalendar" ? (
          <CalendarMonthly
            datas={Data}
            title={"Deployment/ Employment of MSA Assets at Sea"}
            subTitle={"Monthly Calendar"}
          />
        ) : currentChart === "dailyCalendar" ? (
          <CalendarDaily
            datas={Data}
            title={"Deployment/ Employment of MSA Assets at Sea"}
            subTitle={"DailyCalendar"}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PNMSAaircraft;
