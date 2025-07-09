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

function SensorPerf() {
  const [searchData, setSearchData] = useState({ ssr_table: 'SENSOR PERFORMANCES' });
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
        key: "sp_unit",
        title: "Unit",
        dataIndex: "sp_unit",
        filtertype: 'unique',
    },
    {
        key: "sp_date",
        title: "Date",
        dataIndex: "sp_date",
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
      key: "sp_position",
      dataIndex: "sp_position",
      sorter: (a, b) => {
        const latA = a.sp_position ? a.sp_position.coordinates[1] : null;
        const latB = b.sp_position ? b.sp_position.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.sp_position) {
          const val = record.sp_position.coordinates[1];
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
      key: "sp_position",
      title: "Longitude",
      dataIndex: "sp_position",
      sorter: (a, b) => {
        const latA = a.sp_position ? a.sp_position.coordinates[0] : null;
        const latB = b.sp_position ? b.sp_position.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.sp_position) {
          var val = record.sp_position.coordinates[0];
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
        key: "sp_radar_ranges",
        title: "Radar Ranges",
        dataIndex: "sp_radar_ranges",
        filtertype: 'search',
    },
    {
        key: "sp_small",
        title: "Small",
        dataIndex: "sp_small",
        filtertype: 'unique',
        //sorttype: 'number'
    },
    {
        key: "sp_med",
        title: "Medium",
        dataIndex: "sp_med",
        filtertype: 'unique',
    },
    {
        key: "sp_large",
        title: "Large",
        dataIndex: "sp_large",
        filtertype: 'unique',
    },
    {
        key: "sp_ais",
        title: "AIS",
        dataIndex: "sp_ais",
        filtertype: 'search',
    },
    {
        key: "sp_ship_max_speed",
        title: "Ship Max Speed",
        dataIndex: "sp_ship_max_speed",
        filtertype: 'search',
    },
    {
        key: "sp_weapon_ops",
        title: "Weapon Ops",
        dataIndex: "sp_weapon_ops",
        // filtertype: 'unique',
        render: (text,record) => {
          console.log(record.sp_weapon_ops)
          if (record.sp_weapon_ops===null) return "";
          else if (record.sp_weapon_ops===true) return "Yes";
          else return "No";
        },
    },
    {
        key: "sp_sensors_ops",
        title: "Sensors Ops",
        dataIndex: "sp_sensors_ops",
        // filtertype: 'unique',
        render: (text,record) => {
          console.log(record.sp_sensors_ops)
          if (record.sp_sensors_ops===null) return "";
          else if (record.sp_sensors_ops===true) return "Yes";
          else if (record.sp_sensors_ops===false) return "No";
        },
    },
    // {
    //     key: "sp_rdt",
    //     title: "Banned Net",
    //     dataIndex: "sp_rdt",
    // },
    {
        key: "sp_remarks",
        title: "Remarks",
        dataIndex: "sp_remarks",
        // filtertype: 'search',
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
        title="Sensor Performances"
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

export default SensorPerf;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Sensor Performances Data",
      },
    },
  };
}