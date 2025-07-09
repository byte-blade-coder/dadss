import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { DatePicker, Button } from "antd";
const { RangePicker } = DatePicker;
import ReactMapGL, { Source, Layer } from "react-map-gl";
import dayjs from "dayjs";
import Link from "next/link";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import { BsArrowLeft } from "react-icons/bs";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";
const DensityHeatMap = dynamic(
  // () => import("../../../src/components/heatmap/FishingDesnityHeatMap"),
  () => import("../../../src/components/LeafletMap/map"),

  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const Heatmap = () => {
  const [harbor, setHarbor] = useState("");
  const [season, setSeason] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(24, "month"),
    dayjs(),
  ]);
  // const [filteredData, setFilteredData] = useState("");
  const [filteredData, setFilteredData] = useState(() => {
    // Retrieve data from local storage when the component is initialized
    const storedData = localStorage.getItem("filteredData");
    return storedData ? JSON.parse(storedData) : "";
  });
  const exportRef = useRef();
  useEffect(() => {
    handleApiChange();
  }, [harbor, vesselType, season, dateRange]);

  const handleApiChange = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fv_con?date_from=${dateFrom}&&date_to=${dateTo}&&season=${season}&&harbor=${harbor}&&type=${vesselType}`
      );
      if (response.status === 200) {
        const transformedData = response.data.map((feature) => {
          const coordinates = feature.geometry.coordinates;
          const intensity = feature.properties.intensity;

          return {
            lat: coordinates[1],
            lng: coordinates[0],
            count: intensity,
          };
        });

        setFilteredData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      console.log(error)
      if (error) {
        showToastError(`Error : ${error}.`);
      }
    }
  };
  return (
    <div>
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
        <Button onClick={() => exportAsImage(exportRef.current, "COI-Heatmap", dateRange)}
            className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mt-5">
            <div className="flex items-center gap-x-3">
              <FaFileDownload />
              Save as Image
            </div>
          </Button>
      </div>
      
      <div ref={exportRef}>
          <DensityHeatMap
            title="COI Density Heat Map"
            heatmapData={filteredData}
            //  data={filteredData}
          />
      </div>
    </div>
  );
};

export default Heatmap;
export async function getServerSideProps(context) {
  return {
    props: {
      title: `Heat Map`,
    },
  };
}
