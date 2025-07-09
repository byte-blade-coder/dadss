import React, { useState,useRef, useEffect, useMemo } from "react";
import AntdTableIndex from "../table/AntdTableIndex.js";
import dayjs from "dayjs";
import axios from "axios";
import Link from "next/link.js";
import Tooltip from "antd/lib/tooltip/index.js";
import { useRouter } from "next/router";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import cargodhowdata from "../../data/cargodhowdata.json";
import { coordinatesToDMS, decimalToDMS } from "../../helper/position.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchCargoDhowData } from "../../redux/thunks/outputTableData.js";
import { MdViewList } from "react-icons/md";

function CargoDhowdata({apidata}) {
  
  const [searchData, setSearchData] = useState({ ssr_table: 'CARGO %26 DHOW DATA' });
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

  // useEffect(() => {
  //   if (data) {
  //     const filteredData = data.filter(item => item.mr_table === 'CARGO & DHOW DATA');
  //     setFilteredDataSource(filteredData);
  //   }
  // }, [data]);

   const columnsapi = [
    {
      key: "mr_rdt",
      title: "DTG",
      dataIndex: "mr_rdt",
      sorttype: 'date',
      filtertype: 'search',
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      key: "mr_regno",
      title: "Reg No",
      dataIndex: "mr_regno",
      filtertype: 'search',
    },
    {
      key: "mr_dhow_name",
      title: "DHOW Name",
      dataIndex: "mr_dhow_name",
      filtertype: 'search',
    },
    {
      key: "mr_country",
      title: "Country",
      dataIndex: "mr_country",
      filtertype: 'unique',
    },
    {
      key: "mr_lpoc",
      title: "LPOC",
      dataIndex: "mr_lpoc",
      filtertype: 'unique',
    },
    {
      key: "mr_npoc",
      title: "NPOC",
      dataIndex: "mr_npoc",
      filtertype: 'unique',
    },
    {
      key: "mr_remarks",
      title: "Remarks",
      dataIndex: "mr_remarks",
    },
    {
      key: "mr_cargo",
      title: "Cargo",
      dataIndex: "mr_cargo",
      filtertype: 'search',
    },
    {
      key: "mr_no_of_days",
      title: "No of Days",
      dataIndex: "mr_no_of_days",
      filtertype: 'number',
      sorttype: 'number', 
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
      // render: (text, record) => (
      //   <Link
      //     className="text-midnight font-semibold"
      //     // href={`registeredvessels/${record.rv_key}`}
      //     href={{
      //       pathname: `missionreport/${record.mr_key}`,
      //       query: { mr_key: record.mr_key }, // Pass mr_key as a query parameter
      //     }}
      //   >
      //     <MdViewList size={20}/>
      //   </Link>
      // ),
    },
  ];
 
  const columns = [
    {
      key: "DTG",
      title: "DTG",
      dataIndex: "DTG",
    },
    {
      key: "Reg",
      title: "Reg",
      dataIndex: "Reg",
    },
    {
      key: "DHOW Name",
      title: "DHOW Name",
      dataIndex: "DHOW Name",
    },
    {
      key: "Country",
      title: "Country",
      dataIndex: "Country",
    },
    {
      key: "LPOC",
      title: "LPOC",
      dataIndex: "LPOC",
    },
    {
      key: "NPOC",
      title: "NPOC",
      dataIndex: "NPOC",
    },
    {
      key: "REMARKS",
      title: "Remarks",
      dataIndex: "REMARKS",
    },
    {
      key: "Cargo",
      title: "Cargo",
      dataIndex: "Cargo",
    },
    {
      key: "No of Days",
      title: "No of Days",
      dataIndex: "No of Days",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];

  // const filteredData = useMemo(() => data.filter(item => item.mr_table === 'CARGO & DHOW DATA'), [data]);

  return (
    <>
        <PageHeaderIndex
          title="Cargo and DHOW Data"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      {viewPermission ? (
        <div>
          {apidata? (
            <AntdTableIndex
            columns={columnsapi}
            data={data}
            loading={isLoading}
            setFilteredDataSource={setFilteredDataSource}
            componentRef={componentRef}
          />
          ): (
            <AntdTableIndex
            columns={columns}
            data={cargodhowdata}
            loading={false}
            setFilteredDataSource={setFilteredDataSource}
            componentRef={componentRef}
          />
          )}
        </div>
      ) : (
        <Forbidden></Forbidden>
      )}
    </>
  );
}

export default CargoDhowdata;
