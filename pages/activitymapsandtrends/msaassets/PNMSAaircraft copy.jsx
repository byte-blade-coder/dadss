import React, { useEffect, useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { Button, Checkbox, Col, Input, InputNumber, Radio, Row, Select } from "antd";
import { DatePicker } from "antd";
import "leaflet/dist/leaflet.css";
import geoJSONData from "../../../src/components/cholorpleth/data";
import Data from "../../../src/components/calendar/calendarData";

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

// const Chloropleth = dynamic(
//   () => import("../../../src/components/cholorpleth/chloroplethMap"),
//   {
//     ssr: false,
//     loading: () => (
//       <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
//     ),
//   }
// );

const ChoroplethGridMap = dynamic(
  () => import("../../../src/components/Maps/ChoroplethGrid"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const ChoroplethHoneyCombMap = dynamic(
  () => import("../../../src/components/Maps/ChoroplethHoneycombMap"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  })

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
  const [coordSet1, setCoordSet1] = useState("")
  const [coordSet2, setCoordSet2] = useState("")
  const [coordSets, setCoordSets] = useState("")

  const [currentMapView, setCurrentMapView] = useState('grid')
  const mapStyles = {
    height: "600px",
    width: "100%",
    // Add any other styling props you want to customize
  };
  useEffect(() => {
    handleApiChange();
  }, []);
  const exportRef = useRef();
  const [airCraftData, setAirCraftData] = useState();
  const [loading, setLoading] = useState(true);

  const handleApiChange = async () => {
    const response = [
      { air: "Aircarft 1", number: 56 },
      { air: "Aircarft 2", number: 82 },
      { air: "Aircarft 3", number: 15 },
      { air: "Aircarft 4", number: 33 },
      { air: "Aircarft 5", number: 71 },
      { air: "Aircarft 6", number: 29 },
      { air: "Aircarft 7", number: 91 },
      { air: "Aircarft 8", number: 47 },
      { air: "Aircarft 9", number: 64 },
      { air: "Aircarft 10", number: 88 },
    ];

    // Format the data for the bar chart
    const formattedData = response.map(({ air, number }) => ({
      date: air, // x-axis: air
      value: number, // y-axis: number
      name: air, // labels
    }));

    setAirCraftData(formattedData);
    setLoading(false);
  };

  const handleMapViewChange = (mapView) => {
    setCurrentMapView(mapView);
    setCoordSet1("")
    setCoordSet2("")
  };

  const handleCoordSet1Input = (event) => {
    event.preventDefault(); // Prevent the default form action if needed
    const newValue = event.target.value; // Assuming it's from an input field
    setCoordSet1(newValue); // Update the state
  };

  const handleCoordSet2Input = (event) => {
    event.preventDefault(); // Prevent the default form action if needed
    const newValue = event.target.value; // Assuming it's from an input field
    setCoordSet2(newValue); // Update the state
  };

  const handleOnAddCoordBtn = () => {
    try {
      // Split and parse coordinates to floats, assuming they're comma-separated
      const topLeft = coordSet1.split(',').map(coord => parseFloat(coord.trim()));
      const bottomRight = coordSet2.split(',').map(coord => parseFloat(coord.trim()));

      // Check that both topLeft and bottomRight contain exactly two coordinates
      if (topLeft.length === 2 && bottomRight.length === 2) {
        // Ensure coordSets is properly initialized as an array and update it with new coordinates
        setCoordSets(prevSets => [...prevSets, { topLeft, bottomRight }]);
        setCoordSet1("");
        setCoordSet2("");
      } else {
        alert("Please enter valid coordinates in the format: Lat, Lng");
      }
    } catch (error) {
      alert("Invalid coordinate format. Please ensure the values are valid numbers.");
    }
  };


  return (
    <div>
      <div>
        {!airCraftData ? (
          loading ? (
            <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
          ) : null
        ) : currentChart === "bar" ? (
          <BasicBar
            isGroup={false}
            title={"Deployment/ Employment of MSA Assets at Sea"}
            subTitle={"Monthly Flying Hours of PMSA Defenders"}
            data={airCraftData}
          />
        ) : currentChart === "choropethGraph" ? (
          <>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
              <div style={{ display: "flex", margin: "20px 15px", width: "60%" }}>
                <Input
                  placeholder="Enter Start Co-ordinates - Top Left (Lat, Lng)"
                  style={{ height: "fit-content", marginRight: "10px" }}
                  onChange={handleCoordSet1Input}
                  value={coordSet1}
                />
                <Input
                  placeholder="Enter Bottom Co-ordinates - Bottom Right (Lat, Lng)"
                  style={{ height: "fit-content", marginRight: "10px" }}
                  onChange={handleCoordSet2Input}
                  value={coordSet2}
                />
                <Button onClick={handleOnAddCoordBtn}>Add Coordinates</Button>
              </div>
              <div style={{ margin: "20px 15px", display: "flex", justifyContent: "flex-end" }}>
                <Radio
                  defaultChecked
                  onChange={() => handleMapViewChange("grid")}
                  checked={currentMapView === "grid"}
                  style={{ fontSize: 16 }}
                >
                  Grid View
                </Radio>
                <Radio
                  onChange={() => handleMapViewChange("honeyComb")}
                  checked={currentMapView === "honeyComb"}
                  style={{ fontSize: 16 }}
                >
                  Honey-Comb View
                </Radio>
                {/* <Radio
                  onChange={() => handleMapViewChange("custom")}
                  checked={currentMapView === "custom"}
                  style={{ fontSize: 16 }}
                >
                  Custom View
                </Radio> */}
              </div>
            </div>
            {currentMapView === "grid" ?
              <ChoroplethGridMap geojsonData={geoJSONData} coordinates={coordSets} />
              : currentMapView === "honeyComb" ?
                <ChoroplethHoneyCombMap coordinates={coordSets} />
                : null
            }
          </>
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
