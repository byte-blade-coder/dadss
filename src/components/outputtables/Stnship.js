import React, { useMemo, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { hasPermission } from "../../helper/permission.js";
import axios from "axios";
import { fetchCargoDhowData } from "../../redux/thunks/outputTableData.js";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js"
import AntdTableIndex from "../table/AntdTableIndex.js";
import Forbidden from "../../../pages/403.jsx";
import stationaryships from "../../data/stationaryships.json";
import { DatePicker, Space, Select } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;

function Stationaryships() {
  const [searchData, setSearchData] = useState({ ssr_table: 'STATIONARY SHIP' });
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

 const [selectedMonth, setSelectedMonth] = useState("January_2023");
//  console.log("selectedMonth", selectedMonth)

  const columns_new = [
    {
      title: "Date",
      key: "ss_date",
      dataIndex: "ss_date",
      filtertype: 'search',
      sorttype: 'date'
    },
    {
      title: "Vessel Name",
      key: "ss_boat_name",
      dataIndex: "ss_boat_name",
      filtertype: 'search',
    },
    {
      title: "Position",
      key: "ss_position",
      dataIndex: "ss_position",
      filtertype: 'search',
    },
    {
      title: "Type",
      key: "ss_boat_type",
      dataIndex: "ss_boat_type",
      filtertype: 'unique',
    },
    {
      title: "STN Since",
      key: "ss_stn_since",
      dataIndex: "ss_stn_since",
      filtertype: 'search',
      sorttype: 'date'
    },
    {
      title: "Remarks",
      key: "ss_remarks",
      dataIndex: "ss_remarks",
      filtertype: 'search',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];

  const handleMonthChange = (date, dateString) => {
    // console.log("selectedMonth dateString", dateString)
    setSelectedMonth(dateString);
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    const selectedMonthDate = dayjs(selectedMonth, "MMMM_YYYY");
    return data.filter((item) => {
      const itemMonth = dayjs(item.ss_stn_since);
      return itemMonth.isSame(selectedMonthDate, 'month');
    });
  }, [data, selectedMonth]);

  return (
    <>
    <PageHeaderIndex
      title="Stationary Ships (Monthly)"
      showSearchBox={viewPermission}
      currentData={viewPermission ? filteredDataSource : null}
      componentRef={viewPermission ? componentRef : null}
      showDatePicker={true}
      handleMonthChange={handleMonthChange}
      format="MMMM_YYYY"
      selectedMonth={dayjs(selectedMonth, "MMMM_YYYY")}
    />
    {/* <DatePicker
      picker="month"
      onChange={handleMonthChange}
      format="MMMM_YYYY"
      defaultValue={dayjs(selectedMonth, "MMMM_YYYY")}
    /> */}
    {viewPermission ? (
      <div>
        <AntdTableIndex
          columns={columns_new}
          data={filteredData}
          // data={stationaryships.find((item) => item.month === selectedMonth)?.data}
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

