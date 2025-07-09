import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Button, InputNumber, Result, Select, Tooltip } from "antd";
import { Checkbox } from "antd";
import Forbidden from "../../../pages/403.jsx";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import AntdTableIndex from "../../components/table/AntdTableIndex.js";
import PageHeaderIndex from "../../components/pageheader/pageHeaderIndex.js";
import { fetchMedicalAssistanceData } from "../../redux/thunks/searchandrescue.js";

function Index() {
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector(
    (state) => state.fetchMedicalAssistanceData
  );
  const [searchData, setSearchData] = useState({ sar_table: 'MEDICAL ASSISTANCE' });
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = true;
  const viewPermission = true;
  
  useEffect(() => {
    dispatch(fetchMedicalAssistanceData(searchData.sar_table));
  }, [searchData]);

//   const filteredData = useMemo(() => {
//     if (!data) return [];

//     if (table === "Med") {
//       return data.filter((item) => item.sar_table === "MEDICAL ASSISTANCE");
//     } else {
//       // return data.filter((item) => item.sar_table === "MEDICALASSISTANCE_FORM");
//       return data.filter((item) => item.sar_table === "MEDICAL ASSISTANCE");
//     }
//   }, [data, table]);

  const columns = [
    {
      title: "DTG",
      key: "sar_rdt",
      dataIndex: "sar_rdt",
      sorttype: 'date',
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD");
        return dtg;
      },
    },
    {
      title: "Boat Name",
      key: "sar_boat_name",
      dataIndex: "sar_boat_name",
      filtertype: 'search',
    },
    {
      title: "Sorties",
      key: "sar_unit",
      dataIndex: "sar_unit",
      filtertype: 'unique',
    },
    {
      title: "Reg No",
      key: "sar_regno",
      dataIndex: "sar_regno",
      filtertype: 'search',
    },
    {
      title: "Crew",
      key: "sar_crew",
      dataIndex: "sar_crew",
      filtertype: 'number',
      sorttype: 'number',
    },
    {
      title: "Latitude",
      key: "sar_position",
      dataIndex: "sar_position",
      sorter: (a, b) => {
        const latA = a.sar_position ? a.sar_position.coordinates[1] : null;
        const latB = b.sar_position ? b.sar_position.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.sar_position) {
          const val = record.sar_position.coordinates[1];
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
      key: "sar_position",
      title: "Longitude",
      dataIndex: "sar_position",
      sorter: (a, b) => {
        const latA = a.sar_position ? a.sar_position.coordinates[0] : null;
        const latB = b.sar_position ? b.sar_position.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.sar_position) {
          var val = record.sar_position.coordinates[0];
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
      title: "Nature of Injury/ Illness",
      dataIndex: "sar_nature",
      key: "sar_nature",
      filtertype: 'search',
    },
    {
      title: "Type of Assistance",
      dataIndex: "sar_assistance_type",
      key: "sar_assistance_type",
      filtertype: 'unique',
    },
    {
      title: "Remarks",
      dataIndex: "sar_remarks",
      key: "sar_remarks",
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
      <div>
        <PageHeaderIndex
          title="Medical Assistance"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      </div>
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

export default Index;
export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Search and Rescue Data",
      },
    },
  };
}
