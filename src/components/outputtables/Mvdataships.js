import React, { useState, useRef, useEffect, useMemo } from "react";
import AntdTableIndex from "../table/AntdTableIndex.js";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link.js";
import Tooltip from "antd/lib/tooltip/index.js";
import { useRouter } from "next/router";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import { coordinatesToDMS, decimalToDMS } from "../../helper/position.js";
import mvdataships from "../../data/mvdataships.json";
import { useDispatch, useSelector } from "react-redux";
import { MdViewList } from "react-icons/md";
import { fetchCargoDhowData } from "../../redux/thunks/outputTableData.js";

// function Mvdataships({filteredDataSource,setFilteredDataSource}) 
function Mvdataships({apidata}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const [searchData, setSearchData] = useState({ ssr_table: 'MV DATA SHIPS' });
  const { data, isLoading } = useSelector((state) => state.fetchCargoDhowData);
  const [combinedData, setCombinedData] = useState(null);
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const viewPermission = true; // Assuming permission is granted
  console.log("filteredDataSource", filteredDataSource, "\ndata", data)
  
  useEffect(() => {
    dispatch(fetchCargoDhowData(searchData.ssr_table));
  }, [searchData]);

  // const filteredData = useMemo(() => data.filter(item => item.mr_table === 'MV DATA SHIPS'), [data]);

  // Table columns configuration, including additional "Details" action
  const columnsapi = [
    {
      title: "Date",
      dataIndex: "mr_date",
      key: "mr_date",
      sorttype: 'date',
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD");
        return dtg;
      },
    },
    {
      title: "Time",
      dataIndex: "mr_time",
      key: "mr_time",
      sorttype: 'date',
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("HH:mm");
        return dtg;
      },
    },
    {
      title: "Reported By",
      key: "mr_unit",
      dataIndex: "mr_unit",
      filtertype: 'unique',
    },
    // {
    //   key: "mrd_position",
    //   title: "Position",
    //   dataIndex: "mrd_position",
    // },
    {
      title: "Latitude",
      key: "mr_position",
      dataIndex: "mr_position",
      sorter: (a, b) => {
        const latA = a.mr_position ? a.mr_position.coordinates[1] : null;
        const latB = b.mr_position ? b.mr_position.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.mr_position) {
          const val = record.mr_position.coordinates[1];
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
      key: "mr_position",
      title: "Longitude",
      dataIndex: "mr_position",
      sorter: (a, b) => {
        const latA = a.mr_position ? a.mr_position.coordinates[0] : null;
        const latB = b.mr_position ? b.mr_position.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.mr_position) {
          var val = record.mr_position.coordinates[0];
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
      key: "mr_mv_name",
      title: "MV-FBs Name",
      dataIndex: "mr_mv_name",
      filtertype: 'search',
    },
    {
      key: "mr_imo_no",
      title: "IMO No",
      dataIndex: "mr_imo_no",
      filtertype: 'search',
    },
    {
      key: "mr_crew",
      title: "Crew",
      dataIndex: "mr_crew",
      filtertype: 'number',
      sorttype: 'number',
    },
    {
      key: "mr_country",
      title: "Flag",
      dataIndex: "mr_country",
      filtertype: 'unique',
    },
    {
      key: "mr_mv_type",
      title: "Type",
      dataIndex: "mr_mv_type",
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
      key: "Date",
      title: "Date",
      dataIndex: "Date",
    },
    {
      key: "TIME",
      title: "Time",
      dataIndex: "TIME",
    },
    {
      key: "REPORTED BY",
      title: "Reported By",
      dataIndex: "REPORTED BY",
    },
    {
      key: "POSITION",
      title: "Position",
      dataIndex: "POSITION",
    },
    {
      key: "MV-FBs NAME",
      title: "MV-FBs Name",
      dataIndex: "MV-FBs NAME",
      //sorttype: 'none'
    },
    {
      key: "IMO NO",
      title: "IMO No",
      dataIndex: "IMO NO",
    },
    {
      key: "CREW",
      title: "Crew",
      dataIndex: "CREW",
    },
    {
      key: "FLAG",
      title: "Flag",
      dataIndex: "FLAG",
    },
    {
      key: "TYPE",
      title: "Type",
      dataIndex: "TYPE",
    },
    {
      key: "LPOC",
      title: "LPOC",
      dataIndex: "LPOC",
      ellipsis: true,
    },
    {
      key: "NPOC",
      title: "NPOC",
      dataIndex: "NPOC",
      ellipsis: true,
    },
    {
      key: "REMARKS",
      title: "Remarks",
      dataIndex: "REMARKS",
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
          title="MV Data Ships"
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
          //  loading={isLoadingMission || isLoadingGeneral}
           setFilteredDataSource={setFilteredDataSource}
           componentRef={componentRef}
         />
         ) : (
          <AntdTableIndex
          columns={columns}
          data={mvdataships}
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

export default Mvdataships;
