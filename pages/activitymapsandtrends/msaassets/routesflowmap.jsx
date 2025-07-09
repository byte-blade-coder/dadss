// import React, { use, useEffect, useState } from "react";
// import { LoadingOutlined } from "@ant-design/icons";
// import dynamic from "next/dynamic";
// import Link from "next/link";
// import { BsArrowLeft } from "react-icons/bs";
// import { Checkbox, Col, Radio, Row, Select } from "antd";
// import { DatePicker } from "antd";
// const { RangePicker } = DatePicker;

// const ShipPositionMap = dynamic(
//   () => import("../../../src/components/heatmap/FlightShipMap"),
//   {
//     ssr: false,
//     loading: () => (
//       <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
//     ),
//   }
// );

// function RoutesFlowMap() {
//   // State to control loading state
//   const [loading, setLoading] = useState(true);
//   // State to store error message, if any
//   const [error, setError] = useState(null);
//   const [filteredData, setFilteredData] = useState([]);
//   const [shidID, setShipID] = useState();

//   const handleChange = (value) => {
//     //console.log(`selected ${value}`);
//   };
//   const onHandleChange = (checked) => {
//     //console.log(`switch to ${checked}`);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARINE_DATA}/vessel_position`
//       );

//       const data = await response.json();
//       //console.log("API Response Data:", data);
//       const shipPathData = data.map((ship) => ({
//         ship_id: ship.ship_id, // Ensure 'ship_id' matches your API response key
//         latitude: ship.latitude,
//         longitude: ship.longitude,
//         timestamp: ship.timestamp,
//       }));
//       //console.log(shipPathData);
//       setFilteredData(data);
//     } catch (error) {
//       //console.log("Error fetching data from API:", error);
//       setError(error.message); // Set error state if data fetching fails
//       setLoading(false); // Set loading state to false after data is fetched
//     }
//   };

//   const handleChangeShip = (value) => {
//     //console.log(`selected ${value}`);

//   };
//   return (
//     <div>
//       <div>
//         <Link href="/">
//           <BsArrowLeft size={30} />
//           back to
//           <span
//             style={{
//               fontSize: 20,
//               fontWeight: "bold",
//               color: "#0659ED",
//               paddingLeft: 5,
//             }}
//           >
//             Dashboard
//           </span>
//         </Link>
//       </div>
//       <Row className="p-4 flex items-center">
//         <Col span={12}>
//           <Radio
//             defaultChecked
//             onChange={onHandleChange}
//             checked
//             style={{ fontSize: 16 }}
//           >
//             Aircraft
//           </Radio>
//           <Radio onChange={onHandleChange} style={{ fontSize: 16 }}>
//             Surface Ships
//           </Radio>
//         </Col>
//         {/* <Col span={6}>
//           <label className="px-2">Year</label>
//           <Select
//             defaultValue="View all"
//             style={{
//               width: 150,
//             }}
//             onChange={handleChange}
//             options={[
//               {
//                 value: "View all",
//                 label: "View all",
//               },
//               {
//                 value: "Small",
//                 label: "Small",
//               },
//               {
//                 value: "Medium",
//                 label: "Medium",
//               },
//               {
//                 value: "Large",
//                 label: "Large",
//               },
//             ]}
//           />
//         </Col> */}
//         <Col span={12} className="flex justify-end items-center">
//           <RangePicker />
//         </Col>
//       </Row>
//       <ShipPositionMap data={filteredData} onIconClick={handleChangeShip} />
//     </div>
//   );
// }

// export default RoutesFlowMap;

// old code without api integrated

import React, { useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";
import { BsArrowLeft } from "react-icons/bs";
import { Checkbox, Col, Radio, Row, Select, Button } from "antd";
import { DatePicker } from "antd";
import Heading from "../../../src/components/title/Heading";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
const { RangePicker } = DatePicker;
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";

const DensityMap = dynamic(
  // () => import("../../../src/components/heatmap/FlightShipMap"),
  () => import("../../../src/components/Maps/PathMap"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function RoutesFlowMap() {
  const [radioVal, setRadioVal] = useState('Aircraft')
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(12, "month"),
    dayjs(),
  ]);
  const flightPathData = [
    {
      id: 1,
      isFlight: false, // Set this to true for flights, false for ships
      path: [
        { lat: 25.14036726496694, lng: 62.355666891015886 },
        { lat: 24.82224984947709, lng: 62.576636045265786 },
        { lat: 24.5978980023702, lng: 62.9535834260449 },
        { lat: 24.621533006065846, lng: 63.53850177552994 },
        { lat: 24.757347485886925, lng: 64.31189381540653 },
        { lat: 24.757347485886925, lng: 65.05928948419293 },
        { lat: 24.68650622204639, lng: 65.97566156505275 },
        { lat: 24.62744105909455, lng: 66.59307537839797 },
        { lat: 24.52744105909455, lng: 66.49307537839797 },
        { lat: 24.12744105909455, lng: 66.09307537839797 },
        { lat: 25.14036726496694, lng: 62.355666891015886 },
        // Add more coordinates for the second flight path
      ],
      currentIndex: 0,
    },
    {
      id: 2,
      isFlight: false, // Set this to true for flights, false for ships
      path: [
        { lat: 24.85688756, lng: 66.95006999 },
        { lat: 24.74912287, lng: 66.65363611 },
        { lat: 24.96288203, lng: 66.2086719 },
        { lat: 24.9185403, lng: 65.61432314 },
        { lat: 25.01402571, lng: 65.05382968 },
        { lat: 25.1741379, lng: 64.64756597 },
        { lat: 25.03106888, lng: 64.24130226 },
        { lat: 25.08218417, lng: 63.74099602 },
        { lat: 25.26262043, lng: 63.48520035 },
        // Add more coordinates for the second flight path
      ],
      currentIndex: 0,
    },
    {
      id: 3,
      isFlight: true, // Set this to true for flights, false for ships
      path: [
        { lat: 24.829455892841807, lng: 66.66449006827983 },
        { lat: 26.005539511863745, lng: 63.049291499900676 },
        // Add more coordinates for the second flight path
      ],
      currentIndex: 0,
    },
    {
      id: 4,
      isFlight: false,
      path: [
        { lng: 67.4545743294606, lat: 24.145832309362234 },
        { lng: 66.56741759411872, lat: 24.035393288515607 },
        { lng: 65.57944759339699, lat: 24.366423989101122 },
        { lng: 64.17478276243983, lat: 23.949430564778766 },
        { lng: 62.817454197396415, lat: 23.99623869628215 },
        { lng: 61.66543494536194, lat: 24.390060360346354 },
        { lng: 61.74403001697053, lat: 25.04241615729576 },
      ],
      currentIndex: 0,
    },
    {
      id: 5,
      isFlight: true,
      path: [
        { lng: 60.642237056859585, lat: 25.292215736826748 },
        { lng: 60.37859730604532, lat: 24.405984862400956 },
        { lng: 60.630253431822894, lat: 23.480520383029727 },
        { lng: 61.650983790366524, lat: 23.508520825257264 },
        { lng: 64.72941947442456, lat: 22.88480327603355 },
        { lng: 65.41241505874913, lat: 23.713835827353734 },
      ],
      currentIndex: 0,
    },
    {
      id: 6,
      isFlight: true,
      path: [
        { lng: 66.49077153133169, lat: 25.409809296829877 },
        { lng: 65.62671820046063, lat: 25.197176380360048 },
        { lng: 65.07339228968425, lat: 25.507883880925476 },
        { lng: 64.08971282650015, lat: 26.08241372912805 },
      ],
      currentIndex: 0,
    },
  ];

  const exportRef = useRef();
  
  const onHandleChange = (e) => {
    setRadioVal(e.target.value);
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
      <div className="grid grid-cols-12 grid-rows-1 gap-4 p-4 items-center ">
        <div className="col-span-3">
          <div>
            <p className="font-bold invisible ... ">c</p>
          </div>
          <div>
            <Radio.Group value={radioVal} onChange={onHandleChange}>
              <Radio
                value={'Aircraft'}
                defaultChecked
                style={{ fontSize: 16 }}
              >
                Aircraft
              </Radio>
              <Radio
                value={'Surface Ships'}
                style={{ fontSize: 16 }}
              >
                Surface Ships
              </Radio>
            </Radio.Group>
          </div>
        </div>
        {/* <div className="col-start-8">
          <div className="px-2">
            <Button onClick={() => exportAsImage(exportRef.current, "MSA-Assets-Route Flow Map", dateRange)}
              className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mt-5">
              <div className="flex items-center gap-x-3">
                <FaFileDownload />
                Save as Image
              </div>
            </Button>
          </div>
        </div> */}
        <div className="col-span-3 col-start-8">
          <div className="px-2">
            <div>
              <p className="font-bold">Select a Date </p>
            </div>
            <RangePicker />

          </div>
        </div>
        <div className="col-start-11">
          <div className="">
            <Button onClick={() => exportAsImage(exportRef.current, "MSA-Assets-Route Flow Map", dateRange)}
              className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mt-5">
              <div className="flex items-center gap-x-3">
                <FaFileDownload />
                Save as Image
              </div>
            </Button>
          </div>
        </div>
      </div>
      <Heading
        className="whitespace-nowrap font-normal "
        level={3}
        text="Route Flow Map"
      />
      <DensityMap flightPathData={flightPathData} radioVal={radioVal}/>
    </div>
  );
}

export default RoutesFlowMap;
