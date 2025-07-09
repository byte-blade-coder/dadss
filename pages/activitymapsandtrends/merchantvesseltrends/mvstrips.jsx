import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
// import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Button, Select, Tooltip, DatePicker, message } from "antd";
import AntdTableIndex from "../../../src/components/table/AntdTableIndex.js";
import Forbidden from "../../403.jsx";
import ReportsPageHeader from "../../../src/components/pageheader/polReportsPageheader.js";
import { LoadingOutlined } from "@ant-design/icons";
import {generateColors} from "../../../src/helper/colorPalette.js";
import { showToastError } from "../../../src/helper/MyToast.js";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import PageHeaderStyled from "../../../src/components/pageheader/pageHeaderStyled";

const { RangePicker } = DatePicker;

const DivergingBarChart = dynamic(
  () => import("../../../src/components/barchart/StackedBarChart2Directional"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const BasicBar = dynamic(
  () => import("../../../src/components/barchart/BasicBar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function Index() {
  const[ isLoading , setIsLoading ] = useState(true);
  const [data, setData] = useState([])
  const [reportView, setReportView] = useState("table");
  const wordRef = useRef();
  const componentRef = useRef(null);
  const [visualData, setVisualData] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const addPermission = true;
  const viewPermission = true;
  const [dateRange, setDateRange] = useState([
    dayjs('2023-08-15'), 
    dayjs('2023-08-31'), 
    // dayjs().subtract(3, "month"),
    // dayjs(),
  ]);
  const [messageApi, contextHolder] = message.useMessage();

  // Function to fetch data from the API based on the selected date range
  const fetchData = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/mv_trips?date_from=${dateFrom}&&date_to=${dateTo}&&group_by=day`
      );
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        return responseData;
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
    finally {
      setIsLoading(false); // Stop loading state
    }
    return null;
  };

  useEffect(() => {
    if(dateRange) 
    {
      fetchData();
    }
    else{
      setIsLoading(true)
      messageApi.info({content: "Please select a date range to view the chart.",  
        duration: 8,
        style: {
          position: "fixed",
          left: "40%",
          // transform: "translateX(-50%)",
          top: "52px"
        },});
    }

  }, [dateRange]);

  
  const handleVisualData = (data) => {
    console.log("handleVisualData", data)
    const transformData = (data) => {
    
    };
    
    // Usage
    const transformedData = transformData(data);

    setVisualData(transformedData);
  }

  const handleViewChange = (value) => {
    setReportView(value);
    // Reset the apiFilter based on the visual type
    if (value === "table") {
      // setFilteredData([]);
    }
    else if (value === "chart" && dateRange) {
      handleVisualData(filteredDataSource);
    }
    else{
      showToastError(`Set date to load data`)
    }
    console.log("handleChartChange:", value)
  }

  const columns = [
    {
      title: 'Ship Name',
      dataIndex: 'mv_ship_name',
      key: 'mv_ship_name',
      filtertype: 'search',
      sorttype: 'number',
    },
    {
      title: 'Total Trips',
      dataIndex: 'trip_count',
      key: 'trip_count',
      filtertype: 'number',
      sorttype: 'number',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    },
  ];


  return (
    <>
      <Visualpageheader/>
        {contextHolder}
      <div >
        <PageHeaderStyled
          title="Merchant Vessel Trips Summary"
          showSearchBox={viewPermission}
          showButton={false}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
          customChildComponent = {<div className="flex items-baseline mr-1">
          <p className="font-bold mr-2">Select a Date </p>
          <RangePicker
            onChange={(value) => setDateRange(value)}
            defaultValue={dateRange}
                format="DD-MM-YYYY"
          />
        </div>}
        />
      </div>
      {viewPermission ? (
        <AntdTableIndex
          columns={columns}
          data={data}
          loading={isLoading}
          setFilteredDataSource={setFilteredDataSource}
          componentRef={componentRef}
          titletext={"Merchant Vessel Trips Summary"}
          dateRange={dateRange}
        />
      ) : (
        <Forbidden></Forbidden>
      )}
    </>
  );
}

export default Index;
export async function getServerSideProps() {
  return {
    props: {
      data: {
        title: "Merchant Vessel Trips Summary",
      },
    },
  };
}