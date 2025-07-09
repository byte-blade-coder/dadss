import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Tooltip from "antd/lib/tooltip/index.js";
import dayjs from "dayjs";
import Link from "next/link.js";
import { hasPermission } from "../../helper/permission.js";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import { coordinatesToDMS, decimalToDMS } from "../../helper/position.js";
import AntdTableIndex from "../table/AntdTableIndex.js";
import Forbidden from "../../../pages/403.jsx";
import { fetchPatroltypeBasedData } from "../../redux/thunks/patroltypeBasedData.js";
import { MdViewList } from "react-icons/md";
import antinarcotics from "../../data/antinarcotics.json";
import Visual from "../Visual.js";
// const Visual = dynamic(() => import("../Visual.js"), {
//   ssr: false,
//   loading: () => (
//     <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
//   ),
// });

function Antinarcotics({apidata, viewType}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchPatroltypeBasedData
  );
  const [searchData, setSearchData] = useState({ patroltype: 'Anti-Narco' });
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
 const addPermission = true;
 const viewPermission = true;
 const [currentViewType, setCurrentViewType] = useState(viewType);

  console.log("data", antinarcotics)
  console.log("AntiNarco data",data, apidata, viewType, "\ncurrent: ", currentViewType)
  
  useEffect(() => {
    dispatch(fetchPatroltypeBasedData(searchData.patroltype));
  }, [searchData]);
/* call a useEffect like this in the tabledisplay api page, for rerendering the narcotics (or any other) table
dependency should be the viewtype*/
  // useEffect(() => {
  //   setCurrentViewType(viewType);
  // }, [viewType]);

  const columnsapi = [
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
      title: "Year",
      key: "year",
      dataIndex: "year",
      filtertype: 'search',
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
        title: "Own Ship/Boat Participated",
        key: "pf_name",
        dataIndex: "pf_name",
        filtertype: 'unique',
    },
    // {
    //     title: "Name of Boats",
    //     key: "no_of_boats",
    //     dataIndex: "no_of_boats",
    //     filtertype: 'search',
    //     ellipsis: true,
    // },
    {
        title: "Country",
        key: "country",
        dataIndex: "country",
        filtertype: 'unique',
    },
    {
        title: "Crew",
        key: "crew",
        dataIndex: "crew",
        filtertype: 'search',
        sorttype: 'number',
    },
    {
        title: "Boat Sail",
        key: "value",
        dataIndex: "value",
        filtertype: 'search',
    },
    {
        title: "Intel Detail",
        key: "goods",
        dataIndex: "goods",
        filtertype: 'search',
        ellipsis: true,
        // width: 200,
        // checkbox: false,
    },
    {
        title: "Price",
        key: "value",
        dataIndex: "value",
        filtertype: 'search',
    },
    {
      title: "Drug & Liquor/Diesel",
      key: "remarks",
      dataIndex: "remarks",
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
      },
    }
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
      title: "Year",
      key: "mv_ship_name",
      dataIndex: "Year",
      filtertype: 'search',
    },
    {
      title: "Location",
      dataIndex: "Location",
      key: "mv_flag",
      filtertype: 'unique',
    },
    {
      title: "OWN SHIP/ BOAT PARTICIPATED",
      key: "mv_imo",
      dataIndex: "OWN SHIP/ BOAT PARTICIPATED",
      filtertype: 'search',
    },
    {
        title: "Boat Name",
        key: "mv_imo",
        dataIndex: "Boat Name",
        filtertype: 'search',
    },
    {
        title: "Country",
        key: "mv_imo",
        dataIndex: "Country",
        filtertype: 'search',
    },
    {
        title: "Crew",
        key: "mv_imo",
        dataIndex: "Crew",
        filtertype: 'search',
    },
    {
      title: "Boat Sail",
      key: "mv_imo",
      dataIndex: "Boat Sail",
      filtertype: 'search',
    },
    {
        title: "Intel Detail",
        key: "mv_imo",
        dataIndex: "Intel Detail",
        filtertype: 'search',
    },
    {
        title: "Price",
        key: "mv_imo",
        dataIndex: "Price",
        filtertype: 'search',
    },
    {
        title: "Remarks",
        key: "mv_imo",
        dataIndex: "Remarks",
        filtertype: 'search',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];  
  console.log("filteredDataSource", filteredDataSource, "\nsetFilteredDataSource", setFilteredDataSource)
  return (
    <>
    <PageHeaderIndex
      title="Anti Narcotics"
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
          // <> 
          // {currentViewType === "table" ? 
          //   (
            
          //   ) : (
          //     <Visual 
          //       loading={isLoading}
          //       setFilteredDataSource={setFilteredDataSource}
          //       componentRef={componentRef} 
          //     />
          //   )}
          // </>
        ) : (
          <AntdTableIndex
          columns={columns}
          data={antinarcotics}
          //loading={isLoading}
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

export default Antinarcotics;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Antinarcotics Data",
      },
    },
  };
}