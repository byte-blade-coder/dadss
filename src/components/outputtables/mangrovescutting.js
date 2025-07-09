import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "antd/lib/tooltip/index.js";
import dayjs from "dayjs";
import Link from "next/link.js";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import { coordinatesToDMS, decimalToDMS } from "../../helper/position.js";
import { InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import AntdTableIndex from "../table/AntdTableIndex.js";
import Forbidden from "../../../pages/403.jsx";
import { fetchPatroltypeBasedData } from "../../redux/thunks/patroltypeBasedData.js";
import { MdViewList } from "react-icons/md";
import mangrovescutting from "../../data/mangrovescutting.json";
import truncateText from "../../helper/textTruncate.js";

function Mangrovescutting({apidata}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchPatroltypeBasedData
  );
  const [searchData, setSearchData] = useState({ patroltype: 'Mangroves Cutting' });
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = true; // Assuming permission is granted
  //MANGROVES CUTTING
  console.log("filteredDataSource", filteredDataSource, "\nsetFilteredDataSource", setFilteredDataSource)
  console.log("Mangroves Cutting data",data, apidata)
  
  useEffect(() => {
    dispatch(fetchPatroltypeBasedData(searchData.patroltype));
  }, [searchData]);

  const columnsapi = [
    // {
    //   key: "s_no",
    //   title: "S No",
    //   dataIndex: "s_no",
    // },
    {
        key: "dtg",
        title: "Date",
        dataIndex: "dtg",
        sorttype: 'date',
        render: (text) => {
          if (!text) return "---";
          const dtg = dayjs(text).format("YYYY-MM-DD");
          return dtg;
        },
    },
    {
      title: "Unit",
      key: "",
      dataIndex: "",
      filtertype: 'unique',
    },
    {
      title: "Latitude",
      key: "latitude",
      dataIndex: "latitude",
      sorter: (a, b) => {
        const latA = a.latitude ? a.latitude.coordinates[1] : null;
        const latB = b.latitude ? b.latitude.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.latitude) {
          const val = record.latitude;
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
      key: "longitude",
      title: "Longitude",
      dataIndex: "longitude",
      sorter: (a, b) => {
        const latA = a.longitude ? a.longitude.coordinates[0] : null;
        const latB = b.longitude ? b.longitude.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.longitude) {
          var val = record.longitude;
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
        title: "Apprehended by",
        key: "pf_name",
        dataIndex: "pf_name",
        filtertype: 'unique',
    },
    {
        title: "Reg No",
        key: "reg_no",
        dataIndex: "reg_no",
        filtertype: 'search',
    },
    {
        title: "Name of Crew",
        key: "crew_details.ssrp_name",
        dataIndex: "crew_details.ssrp_name",
        filtertype: 'search',
        render: (text, record) => {
          if (record?.crew_details) {
              const crewNames = record.crew_details.map(item => item.ssrp_name).join(", ");
              const truncatedCrewNames = truncateText(crewNames, 30); // Adjust 30 to your preferred length
                return (
                    <Tooltip title={crewNames}>
                        <span>{truncatedCrewNames}</span>
                    </Tooltip>
                )
          } else {
              return "N/A";
          }
      },
    },
    {
        title: "CNIC of Crew",
        key: "crew_details",
        dataIndex: "crew_details",
        filtertype: 'search',
        render: (text, record) => {
          if (record?.crew_details) {
              const crewCNICs = record.crew_details.map(item => item.ssrp_cnic).join(", ");
              const truncatedCrewNamesCNICs = truncateText(crewCNICs, 20); // Adjust 30 to your preferred length
              return (
                  <Tooltip title={crewCNICs}>
                      <span>{truncatedCrewNamesCNICs}</span>
                  </Tooltip>
              );
          } else {
              return "N/A";
          }
        },
    },
    {
        title: "No of Crew",
        key: "crew",
        dataIndex: "crew",
        sorttype: 'number',
        filtertype: 'number',
    },
    {
        title: "Village",
        key: "village",
        dataIndex: "village",
        filtertype: 'search',
        render: (text, record) => {
          if (record?.village) {
              const villages = truncateText(record.village, 20); // Adjust 30 to your preferred length
              return (
                  <Tooltip title={record.village}>
                      <span>{villages}</span>
                  </Tooltip>
              );
          } else {
              return "N/A";
          }
        },
    },
    {
      title: "View",
      dataIndex: "action",
      key: "action",
      checkbox: false,
      width: 20,
      render: (text, record) => {
        // Define the link path and query parameters based on the source
        let linkPath, queryParams;
    
        if (record.source === "FISHING") {
          linkPath = `fishingvessel/specialreportdetails`;
          queryParams = { sr_key: record.sr_key }; // Query parameters for Fishing
        } else if (record.source === "MERCHANT") {
          linkPath = `merchantvessel/specialreportdetails`;
          queryParams = { msr_key: record.msr_key }; // Query parameters for Merchant
        }
    
        if(record.source === "FISHING" || record.source === "MERCHANT")
        {
          return (
            <Link
              className="text-midnight font-semibold"
              href={{
                pathname: linkPath,
                query: queryParams, // Use the appropriate query parameters
              }}
            >
              <MdViewList size={20} />
            </Link>
          );
        }
        // else
        // {
        //   return(
        //     <InfoCircleOutlined style={{marginLeft: "3"}} size={20} />
        //   )
        // }
      },
    }
      
  ];
  
  const columns = [
    {
      key: "S. NO",
      title: "S. NO",
      dataIndex: "S. NO",
    },
    {
      key: "Unit",
      title: "Unit",
      dataIndex: "Unit",
    },
    {
      key: "Date",
      title: "Date",
      dataIndex: "Date",
    },
    {
      key: "Boat Apprehended",
      title: "Boat Apprehended",
      dataIndex: "Boat Apprehended",
    },
    {
      key: "Position",
      title: "Position",
      dataIndex: "Position",
    },
    {
      key: "Reg NO",
      title: "Reg No",
      dataIndex: "Reg NO",
    },

    {
      key: "Name of Crew",
      title: "Name of Crew",
      dataIndex: "Name of Crew",
    },
    {
      key: "CNIC of Crew",
      title: "CNIC of Crew",
      dataIndex: "CNIC of Crew",
    },
    {
      key: "No of Crew",
      title: "No of Crew",
      dataIndex: "No of Crew",
    },
    {
      key: "Village",
      title: "Village",
      dataIndex: "Village",
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
          title="Mangroves Cutting"
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
              data={mangrovescutting}
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

export default Mangrovescutting;
