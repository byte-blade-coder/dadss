import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "antd/lib/tooltip/index.js";
import AntdTableIndex from "../table/AntdTableIndex.js";
import { coordinatesToDMS, decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import comdesrondata from "../../data/comdesrondata.json";
import { MdViewList } from "react-icons/md";
import { fetchPatroltypeBasedData } from "../../redux/thunks/patroltypeBasedData.js";
import { fetchStaticSpecialReportData } from "../../redux/thunks/patroltypeBasedData.js";

// function COMDESRONdata({filteredDataSource,setFilteredDataSource})
function COMDESRONdata({apidata}) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [searchData, setSearchData] = useState({ ssr_table: 'COMDESRON' });
  const { data, isLoading } = useSelector(
    (state) => state.fetchStaticSpecialReportData
  );
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = true; // Assuming permission is granted
  
  useEffect(() => {
    dispatch(fetchStaticSpecialReportData(searchData.ssr_table));
  }, [searchData]);

  const columnsapi = [
    {
        key: "ssr_dtg",
        title: "Date",
        dataIndex: "ssr_dtg",
        sorttype: 'date',
        render: (text) => {
          if (!text) return "---";
          const dtg = dayjs(text).format("YYYY-MM-DD");
          return dtg;
        },
    },
    {
        title: "Boat Name",
        key: "ssr_boat_name",
        dataIndex: "ssr_boat_name",
        filtertype: 'search',
    },
    {
        title: "Boat Type",
        key: "ssr_boat_type",
        dataIndex: "ssr_boat_type",
        filtertype: 'unique',
    },
    {
        title: "Reg No",
        key: "ssr_boat_regno",
        dataIndex: "ssr_boat_regno",
        filtertype: 'search',
    },
    {
      title: "Latitude",
      key: "ssr_position",
      dataIndex: "ssr_position",
      sorter: (a, b) => {
        const latA = a.ssr_position ? a.ssr_position.coordinates[1] : null;
        const latB = b.ssr_position ? b.ssr_position.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.ssr_position) {
          const val = record.ssr_position;
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
      key: "ssr_position",
      title: "Longitude",
      dataIndex: "ssr_position",
      sorter: (a, b) => {
        const latA = a.ssr_position ? a.ssr_position.coordinates[0] : null;
        const latB = b.ssr_position ? b.ssr_position.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.ssr_position) {
          var val = record.ssr_position;
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
        title: "Owner Name",
        key: "owner_name",
        dataIndex: "owner_name",
        filtertype: 'search',
    },
    {
        title: "Nakwa Name",
        key: "nakwa_name",
        dataIndex: "nakwa_name",
        filtertype: 'search',
    },
    {
        title: "Crew",
        key: "ssr_no_of_crew",
        dataIndex: "ssr_no_of_crew",
        filtertype: 'number',
        sorttype: 'number',
    },
    {
        title: "Depart Date",
        key: "ssr_dep_date",
        dataIndex: "ssr_dep_date",
        filtertype: 'search',
        sorttype: 'date',
        render: (text) => {
          if (!text) return "---";
          const dtg = dayjs(text).format("DD-MM-YYYY");
          return dtg;
        },
    },
    {
        title: "PC Issue Date",
        key: "ssr_pc_issue_date",
        dataIndex: "ssr_pc_issue_date",
        filtertype: 'search',
        sorttype: 'date',
        render: (text) => {
          if (!text) return "---";
          const dtg = dayjs(text).format("DD-MM-YYYY");
          return dtg;
        },
    },
    {
        title: "PC Issue Place",
        key: "ssr_pc_issue_place",
        dataIndex: "ssr_pc_issue_place",
        filtertype: 'search',
    },
    {
        title: "Total days of PC",
        key: "ssr_pc_days",
        dataIndex: "ssr_pc_days",
        filtertype: 'number',
        sorttype: 'number',
    },
    {
        title: "PC Due Date",
        key: "ssr_pc_expiry_date",
        dataIndex: "ssr_pc_expiry_date",
        filtertype: 'search',
        sorttype: 'date',
        render: (text) => {
          if (!text) return "---";
          const dtg = dayjs(text).format("DD-MM-YYYY");
          return dtg;
        },
    },
    {
        title: "Legal/Illegal",
        key: "ssr_legal",
        dataIndex: "ssr_legal",
        render: (text,record) => {
          console.log(record.ssr_legal)
          if (record.ssr_legal===null) return "";
          else if (record.ssr_legal===true) return "Yes";
          else if (record.ssr_legal===false) return "No";
        },
    },
    {
        title: "Fishing Qty (KG)",
        key: "ssr_qty",
        dataIndex: "ssr_qty",
        filtertype: 'search',
    },
    {
        title: "Fish Type",
        key: "ssr_fish_type",
        dataIndex: "ssr_fish_type",
        filtertype: 'search',
    },
    {
        title: "Fishing Position",
        key: "ssr_fish_position",
        dataIndex: "ssr_fish_position",
        filtertype: 'search',
    },
    {
        title: "Gears",
        key: "ssr_gears",
        dataIndex: "ssr_gears",
        filtertype: 'search',
    },
    {
        title: "Cargo",
        key: "ssr_cargo_type",
        dataIndex: "ssr_cargo_type",
        filtertype: 'search',
    },
    {
        title: "Time",
        key: "ssr_time",
        dataIndex: "ssr_time",
        render: (text) => {
          if (!text) return "---";
          const dtg = dayjs(text).format("MM:SS");
          return dtg;
        },
    },
    {
        title: "Mobile No",
        key: "ssr_mobile_no",
        dataIndex: "ssr_mobile_no",
        filtertype: 'search',
    },
    {
        title: "Remarks",
        key: "ssr_remarks",
        dataIndex: "ssr_remarks",
    },
    {
        title: "Departure Jetty, Owner",
        key: "ssr_dep_jetty",
        dataIndex: "ssr_dep_jetty",
    },
    {
        title: "Trans T Creek",
        key: "ssr_trans",
        dataIndex: "ssr_trans",
    },
    {
        title: "",
        dataIndex: "action",
        key: "action",
        checkbox: false,
        width: 5,
      // render: (text, record) => {
      //   // Define the link path and query parameters based on the source
      //   let linkPath, queryParams;
    
      //   if (record.source === "FISHING") {
      //     linkPath = `fishingvessel/specialreportdetails`;
      //     queryParams = { sr_key: record.sr_key }; // Query parameters for Fishing
      //   } else if (record.source === "MERCHANT") {
      //     linkPath = `merchantvessel/specialreportdetails`;
      //     queryParams = { msr_key: record.msr_key }; // Query parameters for Merchant
      //   }
    
      //   return (
      //     <Link
      //       className="text-midnight font-semibold"
      //       href={{
      //         pathname: linkPath,
      //         query: queryParams, // Use the appropriate query parameters
      //       }}
      //     >
      //       <MdViewList size={20} />
      //     </Link>
      //   );
      // },
    }
      
  ];

  const columns = [
    {
      key: "Date",
      title: "Date",
      dataIndex: "Date",
    },
    {
      key: "Reg NO",
      title: "Reg No",
      dataIndex: "Reg NO",
    },
    {
      key: "Boat Name",
      title: "Boat Name",
      dataIndex: "Boat Name",
      //sorttype: 'none'
    },
    {
      key: "Boat Type",
      title: "Boat Type",
      dataIndex: "Boat Type",
      //sorttype: 'none'
    },
    {
      key: "Owner Name",
      title: "Owner Name",
      dataIndex: "Owner Name",
    },
    {
      key: "NAKWA Name",
      title: "NAKWA Name",
      dataIndex: "NAKWA Name",
    },
    {
      key: "CREW",
      title: "Crew",
      dataIndex: "CREW",
    },
    {
      key: "Departure Date",
      title: "Departure Date",
      dataIndex: "Departure Date",
    },
    {
      key: "PC Issue",
      title: "PC Issuee",
      dataIndex: "PC Issue",
    },
    {
      key: "PC Issue Place",
      title: "PC Issue Place",
      dataIndex: "PC Issue Place",
    },
    {
      key: "Total Days of PC",
      title: "Total Days of PC",
      dataIndex: "Total Days of PC",
    },
    {
      key: "PC Due Date",
      title: "PC Due Date",
      dataIndex: "PC Due Date",
    },
    {
      key: "Legal/Illegal",
      title: "Legal/Illegal",
      dataIndex: "Legal/Illegal",
    },
    {
      key: "Fishing Qty",
      title: "Fishing Qty(KG)",
      dataIndex: "Fishing Qty",
    },
    {
      key: "Fish Type",
      title: "Fish Type",
      dataIndex: "Fishing Type",
    },
    {
      key: "Fishing Position",
      title: "Fishing Position",
      dataIndex: "Fishing Position",
    },
    {
      key: "Gears",
      title: "Gears",
      dataIndex: "Gears",
    },
    {
      key: "Type of Cargo",
      title: "Type of Cargo",
      dataIndex: "Type of Cargo",
    },
    {  key: "Position",
       title: "Position",
       dataIndex: "Position",
    },
    {
      key: "TIME",
      title: "Time",
      dataIndex: "TIME",
    },
    {
      key: "Mobile No",
      title: "Mobile No",
      dataIndex: "Mobile No",
    },
    {
      key: "Remarks",
      title: "Remarks",
      dataIndex: "Remarks",
    },
    {
      key: "Departure Jetty, Owner",
      title: "Departure Jetty, Owner",
      dataIndex: "Departure Jetty, Owner",
    },
    {
      key: "Trans T Creek",
      title: "Trans T Creek",
      dataIndex: "Trans T Creek",
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
      {
        <PageHeaderIndex
          title="COMDESRON-23 Data"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      }
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
            ) : (
            <AntdTableIndex
              columns={columns}
              data={comdesrondata}
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

export default COMDESRONdata;
