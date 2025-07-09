

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, InputNumber, Row, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import { fetchMultiplePatroltypeBasedData } from "../../../src/redux/thunks/patroltypeBasedData.js";
import "leaflet/dist/leaflet.css";
import Heading from "../../../src/components/title/Heading.js";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader.js";

const NarcoticsHeatMap = dynamic(
  () => import("../../../src/components/heatmap/NarcoticsChart.js"),
  {
    ssr: false,
    // loading: () => (
    //   <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    // ),
  }
);

const PatrolHeatMap = dynamic(
  () => import("../../../src/components/heatmap/PatrolMap.js"),
  {
    ssr: false,
    // loading: () => (
    //   <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    // ),
  }
);

const Index = () => {
  const { data, isLoading } = useSelector(
    (state) => state.fetchMultiplePatroltypeBasedData
  );
  const [searchData, setSearchData] = useState({ patroltype:  ['Anti-Poaching']  });
  const [patrolTypes, setPatrolTypes] = useState([]);
  console.log("Data: ", data)
  const [dateRange, setDateRange] = useState("");
  const dispatch = useDispatch();

  const [showPopup, setShowPopup] = useState(null);
  const [scatterData, setScatterData] = useState([]);

  useEffect(() => {
    console.log("Dispatching: ", searchData.patroltype)
    dispatch(fetchMultiplePatroltypeBasedData(searchData.patroltype));
  }, []);

  const fetchPatrolTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/patroltype`
      );
      const types = response?.data?.map((item) => (
        console.log(item),
        {
        value: item.ssrpt_name,
        label: item.ssrpt_name,
        key: item.ssrpt_key,
      }));
      setPatrolTypes(types);
    } catch (error) {
      console.error("Error fetching platform types:", error);
      if (error) {
        console.error(`Error : ${error.response}.`)
        // showToastError(`Error : ${error.response.statusText}.`);
      }
    }
  };

  useEffect(() => {
    fetchPatrolTypes();
  }, []);

  const getIconUrl = (patroltype) => {
    switch (patroltype) {
      case "Anti-Smuggling":
        return "/images/point-filled-blue.svg";
      case "Anti-Poaching":
        return "/images/point-filled-yellow.svg";
      case "Anti-Narco":
        return "/images/point-filled.svg";
      case "Mangroves Cutting":
        return "/images/point-filled-orange.svg";
      default:
        return "/images/point-filled-grey.svg"; // default icon
    }
  };

  useEffect(() => {
   // console.log("SearchData: ", searchData, "\nDATA: ", data)
    if(data)
    {
      console.log(data)
      const newScatterData = data?.filter(point => point.latitude && point.longitude)
      .map(point => {
        // console.log("point check: ", point)
        return {
        lat: point.latitude,
        lng: point.longitude,
        label: point.boat_name,
        iconUrl: getIconUrl(point.patroltype)
      }});

      setScatterData(prevScatterData => [...prevScatterData, ...newScatterData]);
    }
  }, [data, isLoading, searchData]);

  const handleApiChange = async (patroltype) => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    const patroltypeQueryString = searchData.patroltype.map(pt => `patroltype=${pt}`).join('&');
    let queryString = "";
    if (patroltype && patroltype.length > 0) {
      queryString = patroltype.map(patroltype => `patroltype=${patroltype}`).join('&&');
    }
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_MSA_BACKEND_API
        }/special_reports?${patroltypeQueryString}&&date_from=${dateFrom}&&date_to=${dateTo}`
      );
      if (response.status === 200) {
        // setDataSource(response.data);
        const newScatterData = response.data?.filter(point => point.latitude && point.longitude)
        .map(point => ({
          lat: point.latitude,
          lng: point.longitude,
          label: point.boat_name,
          iconUrl: getIconUrl(point.patroltype)
        }));
        setScatterData(newScatterData);
        console.log("Dispatching: ", searchData.patroltype)
        //dispatch(fetchMultiplePatroltypeBasedData(searchData.patroltype));
      }
    } catch (error) {
      console.log("Error while updating data for patrol type: ", error)
      console.error("Error while updating data for patrol type:", error);
      if (error) {
        showToastError(`Error : ${error}.`);
      }
    }
  };
  
  const handleChange = (value) => {
    setSearchData({ patroltype: value })
  };

  console.log("scatterData", scatterData)

  return (
    <div>
      <Row className="flex flex-wrap">
      <Col xs={24} sm={12} md={12} lg={7} xl={7}>
        <div className="flex justify-start space-between items-center p-6">
            <div className="px-2">
              <div>
                <p className="font-bold">Select Patrol Type </p>
              </div>
              <Select mode="multiple"
                allowClear
                defaultValue={["Anti-Poaching"]} 
                onChange={handleChange} 
                style={{  width: 300 }}
                placeholder="Select patrol type"
                name="Select patrol type"
                options={patrolTypes.map(item => ({
                  value: item.value,
                  label: item.value,
                }))}>
              </Select>
            </div>
          </div>
      </Col>
      {/* <Col xs={24} sm={12} md={12} lg={7} xl={7}>
        <div className="flex justify-start space-between items-center p-6">
          <div className="px-2">
            <div>
              <p className="font-bold">Net Worth</p>
            </div>
            <div className="flex items-center">
              <InputNumber
                onChange={(value) =>
                  setNetWorth({ ...netWorth, netWorthMin: value })
                }
                min={0}
                addonAfter="<="
              />
              <InputNumber
                min={0}
                addonBefore=">="
                onChange={(value) =>
                  setNetWorth({ ...netWorth, netWorthMax: value })
                }
              />
            </div>
          </div>
        </div>
      </Col> */}
      <Col xs={24} sm={12} md={12} lg={7} xl={7}>
        <div className="flex justify-start space-between items-center p-6">
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
      </Col>   
      <Col xs={24} sm={12} md={12} lg={3} xl={3}>
        <div className="flex justify-end items-center p-11">
          <div className="px-2">
            <Button onClick={handleApiChange}>View</Button>
          </div>
        </div>
      </Col>
      </Row>
      <div style={{ height: "70vh" }}>
      <PatrolHeatMap scatterData={scatterData} data={data}></PatrolHeatMap>
   
      </div>
    </div>
  );
};

export default Index;

// Import necessary modules and libraries

export async function getServerSideProps(context) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/special_reports?patroltype=Anti-Poaching&&date_from=&&date_to=`
    );

    if (response.status === 200) {
      return {
        props: {
          data: response.data,
          title: `Contraband/Drug Confiscation`,
        },
      };
    } else {
      console.error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Return a default value or an empty object in case of an error
  return {
    props: {
      data: [],
      title: `Contraband/Drug Confiscation`,
    },
  };
}
