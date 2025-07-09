import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import { coordinatesToDMS, decimalToDMS } from "../../helper/position.js";
import Tooltip from "antd/lib/tooltip/index.js";
import dayjs from "dayjs";
import { hasPermission } from "../../helper/permission.js";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js"
import AntdTableIndex from "../table/AntdTableIndex.js";
import Forbidden from "../../../pages/403.jsx";
import axios from "axios";
import { fetchCargoDhowData } from "../../redux/thunks/outputTableData.js";

function Violation() {
  const [searchData, setSearchData] = useState({ ssr_table: 'VIOLATION' });
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
        key: "v_unit",
        title: "Unit",
        dataIndex: "v_unit",
        filtertype: 'unique',
    },
    {
        key: "v_date",
        title: "Date",
        dataIndex: "v_date",
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
      key: "v_position",
      dataIndex: "v_position",
      sorter: (a, b) => {
        const latA = a.v_position ? a.v_position.coordinates[1] : null;
        const latB = b.v_position ? b.v_position.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.v_position) {
          const val = record.v_position.coordinates[1];
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
      key: "v_position",
      title: "Longitude",
      dataIndex: "v_position",
      sorter: (a, b) => {
        const latA = a.v_position ? a.v_position.coordinates[0] : null;
        const latB = b.v_position ? b.v_position.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.v_position) {
          var val = record.v_position.coordinates[0];
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
        key: "v_regno",
        title: "Reg No.",
        dataIndex: "v_regno",
        filtertype: 'search',
    },
    {
        key: "v_pc",
        title: "PC",
        dataIndex: "v_pc",
        filtertype: 'number',
        sorttype: 'number'
    },
    {
        key: "v_solas",
        title: "SOLAS",
        dataIndex: "v_solas",
        filtertype: 'number',
        sorttype: 'number'
    },
    {
        key: "v_cod_end",
        title: "Cod End",
        dataIndex: "v_cod_end",
        filtertype: 'search',
    },
    {
        key: "v_child_labour",
        title: "Child Labour",
        dataIndex: "v_child_labour",
        filtertype: 'search',
    },
    {
        key: "v_ted",
        title: "TED",
        dataIndex: "v_ted",
        filtertype: 'number',
        sorttype: 'number'
    },
    {
        key: "v_usf",
        title: "USF",
        dataIndex: "v_usf",
        filtertype: 'number',
        sorttype: 'number'
    },
    {
        key: "v_doc_not_held",
        title: "Documents Not Held",
        dataIndex: "v_doc_not_held",
        filtertype: 'search',
    },
    {
        key: "v_banned_net",
        title: "Banned Net",
        dataIndex: "v_banned_net",
        filtertype: 'search',
    },
    {
        key: "v_other",
        title: "Other",
        dataIndex: "v_other",
        // filtertype: 'unique',
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
        title="Violation"
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

export default Violation;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Violation Data",
      },
    },
  };
}