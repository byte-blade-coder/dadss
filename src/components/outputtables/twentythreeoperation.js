import React, { useState, useRef, useEffect } from "react";
import AntdTableIndex from "../table/AntdTableIndex.js";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import twentythreeoperationdata from "../../data/twentythreeoperationdata.json";
import axios from "axios";
import { fetchCargoDhowData } from "../../redux/thunks/outputTableData.js";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function TwentyThreeOperation() {

  const [searchData, setSearchData] = useState({ ssr_table: '23 OPERATION' });
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
  
  const columns_new = [
    {
      key: "o_date",
      title: "Date",
      dataIndex: "o_date",
      filtertype: 'search',
    },
    {
      key: "o_unit",
      title: "Boat Name",
      dataIndex: "o_unit",
      filtertype: 'search',
      //sorttype: 'none'
    },
    {
      key: "o_operation",
      title: "Operation",
      dataIndex: "o_operation",
      filtertype: 'unique',
      //sorttype: 'none'
    },
    {
      key: "o_area",
      title: "Area",
      dataIndex: "o_area",
      filtertype: 'search',
    },
    {
      key: "o_time",
      title: "Time",
      dataIndex: "o_time",
      // filtertype: 'search',
    },
    {
      key: "o_observed",
      title: "Observed",
      dataIndex: "o_observed",
      filtertype: 'search',
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
          title="23 Operation"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      {viewPermission ? (
        <div>
          <AntdTableIndex
            columns={columns_new}
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

export default TwentyThreeOperation;
