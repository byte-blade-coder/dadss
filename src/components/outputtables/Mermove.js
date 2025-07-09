import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import { hasPermission } from "../../helper/permission.js";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js"
import AntdTableIndex from "../table/AntdTableIndex.js";
import Forbidden from "../../../pages/403.jsx";
import { fetchCargoDhowData } from "../../redux/thunks/outputTableData.js";
import mermove from "../../data/mermove.json";
import { MdViewList } from "react-icons/md";

// function Mermove({filteredDataSource,setFilteredDataSource})
function Mermove({apidata}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const [searchData, setSearchData] = useState({ ssr_table: 'MERMOVE KPT PQA GPA' });
  const { data, isLoading } = useSelector((state) => state.fetchCargoDhowData);
  const [combinedData, setCombinedData] = useState(null);
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const viewPermission = true; // Assuming permission is granted
  
  useEffect(() => {
    dispatch(fetchCargoDhowData(searchData.ssr_table));
  }, [searchData]);

  const columnsapi = [
    {
        key: "mr_date",
        title: "Date",
        dataIndex: "mr_date",
        sorttype: 'date',
        render: (text) => {
          if (!text) return "---";
          const dtg = dayjs(text).format("YYYY-MM-DD");
          return dtg;
        },
    },
    {
    title: "Port",
    dataIndex: "mr_port",
    key: "mr_port",
    filtertype: 'search',
    },
    {
      title: "Ship Name",
      key: "mr_mv_name",
      dataIndex: "mr_mv_name",
      filtertype: 'search',
    },
    {
      title: "Flag",
      dataIndex: "mr_country",
      key: "mr_country",
      filtertype: 'unique',
    },
    {
        title: "Movement",
        key: "mr_movement",
        dataIndex: "mr_movement",
        filtertype: 'search',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    },
  ];  
  const columns = [
    {
        key: "Date",
        title: "Date",
        dataIndex: "Date",
        sorttype: 'date',
        render: (text) => {
          if (!text) return "---";
          const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          return dtg;
        },
    },
    {
      title: "Port",
      dataIndex: "Port",
      key: "mv_port",
      filtertype: 'unique',
    },
    {
      title: "Ship Name",
      key: "mv_ship_name",
      dataIndex: "Name of MV",
      filtertype: 'search',
    },
    {
      title: "Flag",
      dataIndex: "Flag",
      key: "mv_flag",
      filtertype: 'unique',
    },
    {
        title: "Movement",
        key: "mv_imo",
        dataIndex: "Movement",
        filtertype: 'search',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];  

  // const filteredData = useMemo(() => data.filter(item => item.mr_table === 'MERMOVE KPT PQA GPA'), [data] );

  return (
    <>
    <PageHeaderIndex
      title="Merchant Movement KPT PQA GPA"
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
          data={mermove}
          loading={isLoading}
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

export default Mermove;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Registered Merchant Vessel Data",
      },
    },
  };
}