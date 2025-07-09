import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { hasPermission } from "../../helper/permission.js";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js"
import AntdTableIndex from "../table/AntdTableIndex.js";
import Forbidden from "../../../pages/403.jsx";
import pmsaflyinghours from "../../data/pmsaflyinghours.json";
import axios from "axios";
import { fetchCargoDhowData } from "../../redux/thunks/outputTableData.js";
// function PMSAFlyingHours({filteredDataSource,setFilteredDataSource})
function PMSAFlyingHours() {
  
  const [selectedMonth, setSelectedMonth] = useState("Apr-21");

  const [searchData, setSearchData] = useState({ ssr_table: 'PMSA 93 SQN FLYING HOURS' });
  const { data, isLoading } = useSelector((state) => state.fetchCargoDhowData);
  const [combinedData, setCombinedData] = useState(null);
  const dispatch = useDispatch();

  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const router = useRouter();
  const viewPermission = true; // Assuming permission is granted
  console.log("filteredDataSource", filteredDataSource, "\ndata", data)
  
  useEffect(() => {
    dispatch(fetchCargoDhowData(searchData.ssr_table));
  }, [searchData]);
  
  console.log("data", pmsaflyinghours)
  
  const handleMonthChange = (date, dateString) => {
    console.log("selectedMonth dateString", dateString)
    setSelectedMonth(dateString);
  };
  const columns = [
    {
        key: "Month",
        title: "Month",
        dataIndex: "Month",
        sorttype: 'date',
        filtertype: 'search',
        // render: (text) => {
        //   if (!text) return "---";
        //   const dtg = dayjs(text).format("MM-YY");
        //   return dtg;
        // },
    },
    {
        key: "Flying Hours",
        title: "Flying Hours",
        dataIndex: "Flying Hours",
        filtertype: 'number',
        //sorttype: 'number'
    },
    {
        title: "",
        dataIndex: "action",
        key: "action",
        checkbox: false,
      }
  ];  

  const columnsnew = [
    {
        key: "p_date",
        title: "Date",
        dataIndex: "p_date",
        sorttype: 'date',
        filtertype: 'search',
        // render: (text) => {
        //   if (!text) return "---";
        //   const dtg = dayjs(text).format("MM-YY");
        //   return dtg;
        // },
    },
    {
        key: "p_flying_hrs",
        title: "Flying Hours",
        dataIndex: "p_flying_hrs",
        filtertype: 'number',
        //sorttype: 'number'
    },
    {
        title: "",
        dataIndex: "action",
        key: "action",
        checkbox: false,
    }
  ];  

  return (
    <>
      <PageHeaderIndex
        title="PMSA Flying Hours"
        showSearchBox={viewPermission}
        currentData={viewPermission ? filteredDataSource : null}
        componentRef={viewPermission ? componentRef : null}
        // showDatePicker={true}
        // handleMonthChange={handleMonthChange}
        // format="MMM-YY"
        // selectedMonth={dayjs(selectedMonth, "MM-YY")}
      />
    {viewPermission ? (
      <div>
        <AntdTableIndex
          columns={columnsnew}
          data={data}
          loading={isLoading}
          setFilteredDataSource={setFilteredDataSource}
          componentRef={componentRef}
        />
      </div>
    ) : (
      <Forbidden></Forbidden>
    )}
  </>
  );
}

export default PMSAFlyingHours;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "PMSA Flying Hours Data",
      },
    },
  };
}