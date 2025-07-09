import React, { useState, useRef, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { BsArrowLeft } from "react-icons/bs";
import { Checkbox, Col, Radio, Row, Select, Button } from "antd";
import { DatePicker } from "antd";
import Heading from "../../../src/components/title/Heading";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
const { RangePicker } = DatePicker;
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";
import { fetchMerchantRoutesData } from "../../../src/redux/thunks/merchantVesselData";

const RouteMap = dynamic(
  () => import("../../../src/components/heatmap/MerchantRoutes"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function RoutesFlowMap() {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(12, "month"),
    dayjs(),
  ]);
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const [onClickData, setOnClickData] = useState("false");
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
        { lat: 24.78685276936791, lng: 67.00251822303747 },
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
        { lng: 67.5337762348795, lat: 22.1111313864063 },
        { lng: 68.14955979326709, lat: 23.561399750044373 },
        { lng: 68.31935550318673, lat: 25.342759422224333 },
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
        { lng: 63.06010684882676, lat: 25.98852905689654 },
        { lng: 60.73346439509612, lat: 26.389259867418772 },
        { lng: 56.29727306002647, lat: 27.17087002091843 },
      ],
      currentIndex: 0,
    },
  ];
  const exportRef = useRef();
  const { data, isLoading, error } = useSelector(
    (state) => state.fetchMerchantRoutesData
  )
  const [alternateData, setAlternateData] = useState("");

  useEffect(() => {
    dispatch(fetchMerchantRoutesData(searchData))
  }, [searchData])

  // Function to get route flow of single merchant vessel
  const onIconClick = (shipIndex) => {
    setOnClickData("true");
    setAlternateData(shipIndex);
    let updatedData = [];
     console.log(shipIndex)
  }

  console.log(data)
  return (
    <div>
      <Visualpageheader />

      <div className="grid grid-cols-12 grid-rows-1 gap-4 p-4 items-center ">

        <div className="col-span-2 col-start-9">
          <div className="px-2">
            <div>
              <p className="font-bold">Select a Date </p>
            </div>
            <RangePicker format="DD-MM-YYYY" />
            
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
    
      {/* <RouteMap data={onClickData==="true" ? alternateData : data} singleShipRoute={onClickData} onIconClick={(shipIndex) => onIconClick(shipIndex)}/> */}
      <RouteMap data={data} singleShipRoute={onClickData} onIconClick={(shipIndex) => onIconClick(shipIndex)}/>
    </div>
  );
}

export default RoutesFlowMap;
