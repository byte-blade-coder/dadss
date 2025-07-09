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

function AircraftQueried() {
  const [searchData, setSearchData] = useState({ ssr_table: 'AIRCRAFT QUERIED' });
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
        key: "a_unit",
        title: "Unit",
        dataIndex: "a_unit",
        filtertype: 'unique',
    },
    {
        key: "a_date",
        title: "Date",
        dataIndex: "a_date",
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
      key: "a_position",
      dataIndex: "a_position",
      sorter: (a, b) => {
        const latA = a.a_position ? a.a_position.coordinates[1] : null;
        const latB = b.a_position ? b.a_position.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.a_position) {
          const val = record.a_position.coordinates[1];
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
      key: "a_position",
      title: "Longitude",
      dataIndex: "a_position",
      sorter: (a, b) => {
        const latA = a.a_position ? a.a_position.coordinates[0] : null;
        const latB = b.a_position ? b.a_position.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.a_position) {
          var val = record.a_position.coordinates[0];
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
        key: "a_boat_name",
        title: "Boat Name",
        dataIndex: "a_boat_name",
        filtertype: 'search',
    },
    {
        key: "a_regno",
        title: "Reg No.",
        dataIndex: "a_regno",
        filtertype: 'unique',
    },
    // {
    //     key: "a_aircraft",
    //     title: "Aircraft",
    //     dataIndex: "a_aircraft",
    //     filtertype: 'unique',
    // },
    // {
    //     key: "a_comm_ch",
    //     title: "Communication Channel",
    //     dataIndex: "a_comm_ch",
    //     filtertype: 'unique',
    // },
    {
        key: "a_crew",
        title: "Crew",
        dataIndex: "a_crew",
        filtertype: 'number',
        sorttype: 'number',
    },
    {
        key: "a_country",
        title: "Country",
        dataIndex: "a_country",
        filtertype: 'unique',
    },
    {
        key: "a_remarks",
        title: "Remarks",
        dataIndex: "a_remarks",
    },
    // {
    //     key: "a_rdt",
    //     title: "a_rdt",
    //     dataIndex: "a_rdt",
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
        title="Aircraft Queried"
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

export default AircraftQueried;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Aircraft Queried Data",
      },
    },
  };
}