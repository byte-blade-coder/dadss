import React, { useState,useRef, useEffect } from "react";
import AntdTableIndex from "../table/AntdTableIndex.js";
import { Col, Row, Table, Form, Modal } from "antd";
import Tooltip from "antd/lib/tooltip/index.js";
import { decimalToDMS } from "../../helper/position.js";
import { useRouter } from "next/router.js";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import coidatanazim from "../../data/coidatanazim.json";
import { fetchCoiData } from "../../redux/thunks/patroltypeBasedData.js";

// function COIdatanazim({filteredDataSource,setFilteredDataSource})
function COIdatanazim({coiReport,setCoiReport,apidata}) {
  const [searchData, setSearchData] = useState({ ssr_table: 'COI DATA NAZIM' });
  const router = useRouter();
  const { data, isLoading } = useSelector(
    (state) => state.fetchCoiData
  );
  const dispatch = useDispatch();
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = true; // Assuming permission is granted
  
  useEffect(() => {
    dispatch(fetchCoiData(searchData.ssr_table));
  }, [searchData]);


  const columns = [
    {
      key: "Reg NO",
      title: "Reg No",
      dataIndex: "Reg NO",
    },
    {
      key: "Boat Name",
      title: "Boat Name",
      dataIndex: "Boat Name",
      filtertype: 'search',
    },
    {
      key: "NAKWA Name",
      title: "NAKWA Name",
      dataIndex: "NAKWA Name",
      filtertype: 'search',
    },
    {
      key: "Owner Name",
      title: "Owner Name",
      dataIndex: "Owner Name",
      filtertype: 'search',
    },
    {
      key: "Owner CNIC",
      title: "Owner CNIC",
      dataIndex: "Owner CNIC",
      filtertype: 'search',
    },
    {
      key: "Location",
      title: "Location",
      dataIndex: "Location",
      filtertype: 'unique',
    },

    {
      key: "No of Crew",
      title: "No of Crew",
      dataIndex: "No of Crew",
      filtertype: 'number',
    },
    {
      key: "Departure Date",
      title: "Departure Date",
      dataIndex: "Departure Date",
      filtertype: 'search',
    },
    {
      key: "PC Expiry Date",
      title: "PC Expiry Date",
      dataIndex: "PC Expiry Date",
      filtertype: 'search',
    },
    {
      key: "PC Overdue",
      title: "PC Overdue",
      dataIndex: "PC Overdue",
      // filtertype: 'search',
    },
    {
      key: "Reason",
      title: "Reason",
      dataIndex: "Reason",
      // filtertype: 'search',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];
  const columnsapi = [
    {
      key: "ssr_boat_regno",
      title: "Reg No",
      dataIndex: "ssr_boat_regno",
      filtertype: 'search',
    },
    {
      key: "ssr_boat_name",
      title: "Name",
      dataIndex: "ssr_boat_name",
      filtertype: 'search',
    },
    {
      key: "nakwa_name",
      title: "NAKWA Name",
      dataIndex: "nakwa_name",
      filtertype: 'search',
      render: (text, record) => {
        if (record.nakwa_name)
        {
          return record.nakwa_name
        }
        else return "---";
      },
    },
    {
      key: "ssr_person",
      title: "Owner Name",
      dataIndex: "owner_name",
      filtertype: 'search',
      render: (text, record) => {
        if (record.owner_name)
        {
          return record.owner_name
        }
        else return "---";
      },
    },
    {
      key: "owner_cnic",
      title: "Owner CNIC",
      dataIndex: "owner_cnic",
      filtertype: 'search',
      // render: (text, record) => {
      //   if (record.owner_cnic)
      //   {
      //     return record.owner_cnic
      //   }
      //   else return "---";
      // },
    },
    // {
    //   title: "Latitude",
    //   key: "latitude",
    //   dataIndex: "latitude",
    //   sorter: (a, b) => {
    //     const latA = a.ssr_position.latitude ? a.ssr_position.latitude.coordinates[1] : null;
    //     const latB = b.ssr_position.latitude ? b.ssr_position.latitude.coordinates[1] : null;
    //     // Handle null or undefined values
    //     if (latA === null || latA === undefined) return -1;
    //     if (latB === null || latB === undefined) return 1;
    //     return latA - latB;
    //   },
    //   render: (text, record) => {
    //     if (record.ssr_position) {
    //       const val = record.ssr_position.latitude;
    //       const latitude = decimalToDMS(val, 1);
    //       return (
    //         <Tooltip title={`${val}`}>
    //           <span>{latitude}</span>
    //         </Tooltip>
    //       );
    //     } else {
    //       return ""; // or any other placeholder for null or undefined data
    //     }
    //   },
    // },
    // {
    //   key: "longitude",
    //   title: "Longitude",
    //   dataIndex: "longitude",
    //   sorter: (a, b) => {
    //     const latA = a.ssr_position.longitude ? a.ssr_position.longitude.coordinates[0] : null;
    //     const latB = b.ssr_position.longitude ? b.ssr_position.longitude.coordinates[0] : null;

    //     // Handle null or undefined values
    //     if (latA === null || latA === undefined) return -1;
    //     if (latB === null || latB === undefined) return 1;
    //     return latA - latB;
    //   },
    //   render: (text, record) => {
    //     if (record.ssr_position) {
    //       var val = record.ssr_position.longitude;
    //       const longitude = decimalToDMS(val, 0);
    //       // return latitude;
    //       return (
    //         <Tooltip title={`${val}`}>
    //           <span>{longitude}</span>
    //         </Tooltip>
    //       );
    //     }
    //   },
    // },
    {
      key: "ssr_location",
      title: "Location",
      dataIndex: "ssr_location",
      filtertype: 'unique',
    },
    {
      key: "ssr_no_of_crew",
      title: "Crew",
      dataIndex: "ssr_no_of_crew",
      filtertype: 'number',
      sorttype: 'number',
    },
    {
      key: "ssr_dep_date",
      title: "Departure Date",
      dataIndex: "ssr_dep_date",
      filtertype: 'search',
      sorttype: 'date',
      width: 250,
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD");
        return dtg;
      },
    },
    {
      key: "ssr_pc_expiry_date",
      title: "PC Expiry Date",
      dataIndex: "ssr_pc_expiry_date",
      sorttype: 'date',
      filtertype: 'search',
      width: 250,
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD");
        return dtg;
      },
    },
    {
      key: "ssr_pc_overdue",
      title: "PC Overdue",
      dataIndex: "ssr_pc_overdue",
      sorttype: 'date',
      // filtertype: 'search',
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD");
        return dtg;
      },
    },
    {
      key: "ssr_reason",
      title: "Reason",
      dataIndex: "ssr_reason",
      // filtertype: 'search',
      //sorttype: 'none'
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
          title="COI Data NAZIM"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      {viewPermission ? (
        <div>
          { apidata? (
            <AntdTableIndex
              columns={columnsapi}
              data={data}
              loading={isLoading}
              setFilteredDataSource={setFilteredDataSource}
              componentRef={componentRef}
            />
          ) : (
            <AntdTableIndex
              columns={columns}
              data={coidatanazim}
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

export default COIdatanazim;
