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

function MachineryStatus() {
  const [searchData, setSearchData] = useState({ ssr_table: 'MACHINERY STATUS' });
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
        key: "es_unit",
        title: "Unit",
        dataIndex: "es_unit",
        filtertype: 'unique',
    },
    {
        key: "es_date",
        title: "Date",
        dataIndex: "es_date",
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
      key: "es_position",
      dataIndex: "es_position",
      sorter: (a, b) => {
        const latA = a.es_position ? a.es_position.coordinates[1] : null;
        const latB = b.es_position ? b.es_position.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.es_position) {
          const val = record.es_position.coordinates[1];
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
      key: "es_position",
      title: "Longitude",
      dataIndex: "es_position",
      sorter: (a, b) => {
        const latA = a.es_position ? a.es_position.coordinates[0] : null;
        const latB = b.es_position ? b.es_position.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.es_position) {
          var val = record.es_position.coordinates[0];
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
        key: "es_status",
        title: "Status",
        dataIndex: "es_status",
        filtertype: 'unique',
    },
    // {
    //     key: "es_runn_hrs",
    //     title: "Running Hours",
    //     dataIndex: "es_runn_hrs",
    //     filtertype: 'number',
    //     //sorttype: 'number'
    // },
    {
        key: "es_trails",
        title: "Trails",
        dataIndex: "es_trails",
        filtertype: 'unique',
    },
    {
        key: "es_remarks",
        title: "Remarks",
        dataIndex: "es_remarks",
    },
    // {
    //     key: "v_other",
    //     title: "Other",
    //     dataIndex: "v_other",
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
        title="Machinery Status"
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

export default MachineryStatus;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Machinery Status Data",
      },
    },
  };
}