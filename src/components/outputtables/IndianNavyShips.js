import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import { coordinatesToDMS, decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import Tooltip from "antd/lib/tooltip/index.js";
import { hasPermission } from "../../helper/permission.js";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js"
import AntdTableIndex from "../table/AntdTableIndex.js";
import Forbidden from "../../../pages/403.jsx";
import axios from "axios";
import { fetchCargoDhowData } from "../../redux/thunks/outputTableData.js";

function IndianNavyShips() {
  const [searchData, setSearchData] = useState({ ssr_table: 'IN ICG SHIPS' });
  const { data, isLoading } = useSelector((state) => state.fetchCargoDhowData);
  const dispatch = useDispatch();

  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const router = useRouter();
  const viewPermission = true; // Assuming permission is granted
  console.log("filteredDataSource", filteredDataSource, "\ndata", data)
  
  useEffect(() => {
    dispatch(fetchCargoDhowData(searchData.ssr_table));
  }, [searchData]);

  const columns = [
    {
        key: "in_unit",
        title: "Unit",
        dataIndex: "in_unit",
        filtertype: 'unique',
    },
    {
        key: "in_date",
        title: "Date",
        dataIndex: "in_date",
        sorttype: 'date',
        filtertype: 'search',
        // render: (text) => {
        //   if (!text) return "---";
        //   const dtg = dayjs(text).format("MM-YY");
        //   return dtg;
        // },
    },
    {
      title: "Latitude",
      key: "in_position",
      dataIndex: "in_position",
      sorter: (a, b) => {
        const latA = a.in_position ? a.in_position.coordinates[1] : null;
        const latB = b.in_position ? b.in_position.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.in_position) {
          const val = record.in_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          return (
            <Tooltip title={`${latitude}`}>
              <span>{val}</span>
            </Tooltip>
          );
        } else {
          return "N/A"; // or any other placeholder for null or undefined data
        }
      },
    },
    {
      key: "in_position",
      title: "Longitude",
      dataIndex: "in_position",
      sorter: (a, b) => {
        const latA = a.in_position ? a.in_position.coordinates[0] : null;
        const latB = b.in_position ? b.in_position.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.in_position) {
          var val = record.in_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          // return latitude;
          return (
            <Tooltip title={`${longitude}`}>
              <span>{val}</span>
            </Tooltip>
          );
        }
      },
    },
    {
        key: "in_deployment",
        title: "Deployment",
        dataIndex: "in_deployment",
        filtertype: 'search',
    },
    {
        key: "in_ship_name",
        title: "Ship name",
        dataIndex: "in_ship_name",
        filtertype: 'search',
    },
    {
        key: "in_comm",
        title: "Communication",
        dataIndex: "in_comm",
        filtertype: 'search',
    },
    {
        key: "in_remarks",
        title: "Remarks",
        dataIndex: "in_remarks",
    },
    // {
    //     key: "in_rdt",
    //     title: "in_rdt",
    //     dataIndex: "in_rdt",
    // },
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
        title="Indian Navy ICG Ships"
        showSearchBox={viewPermission}
        currentData={viewPermission ? filteredDataSource : null}
        componentRef={viewPermission ? componentRef : null}
      />
    {viewPermission ? (
      <div>
        <AntdTableIndex
          columns={columns}
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

export default IndianNavyShips;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Indian Navy Ships Data",
      },
    },
  };
}