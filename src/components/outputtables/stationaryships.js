import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { hasPermission } from "../../helper/permission.js";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js"
import AntdTableIndex from "../table/AntdTableIndex.js";
import Forbidden from "../../../pages/403.jsx";
import stationaryships from "../../data/stationaryships.json";
import { DatePicker, Space } from 'antd';
const onChange = (date, dateString) => {
  console.log(date, dateString);
};

import { Select } from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;

function Stationaryships({filteredDataSource,setFilteredDataSource}) {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const componentRef = useRef();
 const addPermission = true;
 const viewPermission = true;
  console.log("data", stationaryships)
  const [filteredData, setFilteredData] = useState(stationaryships);
  const [filterMonth, setFilterMonth] = useState(null);
  const [filterYear, setFilterYear] = useState(null);

  // const handleDateChange = (dates, dateStrings) => {
  //   if (dates && dates.length === 2) {
  //     const [start, end] = dates;
  //     const startMonth = start.month() + 1;
  //     const startYear = start.year();
  //     const endMonth = end.month() + 1;
  //     const endYear = end.year();
  //     setFilterMonth(startMonth);
  //     setFilterYear(startYear);
  //     filterData(startMonth, startYear);
  //   }
  // };

  // const filterData = (month, year) => {
  //   const filtered = stationaryships.filter((item) => {
  //     const date = dayjs(item.Date, "DD/MM/YYYY");
  //     return date.month() + 1 === parseInt(month) && date.year() === parseInt(year);
  //   });
  //   setFilteredData(filtered);
  //   setFilteredDataSource(filtered);
  // };

  // useEffect(() => {
  //   if (filterMonth && filterYear) {
  //     filterData(filterMonth, filterYear);
  //   }
  // }, [filterMonth, filterYear]);

  const columns = [
    {
        key: "S NO.",
        title: "S NO.",
        dataIndex: "S.NO",
    },
    // {
    //   key: "Date",
    //   title: "Date",
    //   dataIndex: "DATE",
    //   sorttype: 'date',
    //   // render: (text) => {
    //   //   if (!text) return "---";
    //   //   const dtg = dayjs(text).format("MM-YY");
    //   //   return dtg;
    //   // },
    // },
    {
      title: "Vessel Name",
      key: "mv_ship_name",
      dataIndex: "NAME",
      filtertype: 'search',
    },
    {
      key: "Position",
      title: "Position",
      dataIndex: "POSN",
      filtertype: 'search',
    },
    {
      title: "Flag",
      dataIndex: "FLAG",
      key: "mv_flag",
      filtertype: 'unique',
    },
    {
      title: "Type",
      key: "mv_imo",
      dataIndex: "TYPE",
      filtertype: 'search',
    },
    {
      title: "STN Since",
      key: "mv_imo",
      dataIndex: "STN SINCE",
      filtertype: 'search',
    },
    {
      title: "Remarks",
      key: "mv_imo",
      dataIndex: "Remarks",
      filtertype: 'search',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];  
  console.log("filteredDataSource", filteredDataSource, "\nsetFilteredDataSource", setFilteredDataSource)
  return (
    <>
    <PageHeaderIndex
      title="Stationary Ships (Monthly)"
      showSearchBox={viewPermission}
      currentData={viewPermission ? filteredDataSource : null}
      componentRef={viewPermission ? componentRef : null}
    />
    
    {/* <div style={{ marginBottom: 20 }}>
      <DatePicker onChange={handleDateChange} picker="month" />
    </div> */}
    {viewPermission ? (
      <div>
        <AntdTableIndex
          columns={columns}
          data={stationaryships}
          //loading={isLoading}
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

export default Stationaryships;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Stationary ships Data",
      },
    },
  };
}