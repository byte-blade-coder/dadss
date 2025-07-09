import React, { useState, useRef, useEffect } from "react";
import AntdTableIndex from "../table/AntdTableIndex.js";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import unnamedboats from "../../data/unnamedboats.json";
import axios from "axios";
import { fetchCargoDhowData } from "../../redux/thunks/outputTableData.js";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Unnamedboats() {

  const [searchData, setSearchData] = useState({ ssr_table: 'UNNAMED BOATS' });
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
      key: "ub_date",
      title: "Date",
      dataIndex: "ub_date",
      filtertype: 'search',
    },
    {
      key: "ub_unit",
      title: "Querried by Unit(s)",
      dataIndex: "ub_unit",
      filtertype: 'unique',
    },
    {
      key: "ub_no_of_boats",
      title: "No of Boats",
      dataIndex: "ub_no_of_boats",
      filtertype: 'number',
      sorttype: 'number'
    },
    {
      key: "ub_crew",
      title: "Crew",
      dataIndex: "ub_crew",
      filtertype: 'number',
      sorttype: 'number'
    },
    {
      key: "ub_position",
      title: "Location",
      dataIndex: "ub_position",
      filtertype: 'search',
    },
    {
      key: "ub_village_jetty",
      title: "Village/Jetty",
      dataIndex: "ub_village_jetty",
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
          title="Unnamed Boats"
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
            loading={false}
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

export default Unnamedboats;
