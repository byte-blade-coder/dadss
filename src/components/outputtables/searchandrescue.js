import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Button, InputNumber, Result, Select, Tooltip } from "antd";
import { Checkbox } from "antd";
import Forbidden from "../../../pages/403";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import AntdTableIndex from "../../components/table/AntdTableIndex";
import { hasPermission } from "../../helper/permission";
import { MdViewList } from "react-icons/md";
import searchandrescue from "../../data/searchandrescue.json";
import PageHeaderIndex from "../../components/pageheader/pageHeaderIndex.js";
import { fetchSARData } from "../../redux/thunks/searchandrescue.js";

function SAR({apidata}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector(
    (state) => state.fetchSARData
  );

  const [searchData, setSearchData] = useState({ sar_table: 'SAR' });
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = true;
  const viewPermission = true

  useEffect(() => {
    dispatch(fetchSARData(searchData.sar_table));
  }, [searchData]);

//    const filteredData = useMemo(() => {
//     if (!data) return [];

//     if (table === "Sar") {
//       return data.filter((item) => item.sar_table === "SAR");
//     } else {
//       return data.filter((item) => item.sar_table === "SAR_FORM");
//     }
//   }, [data, table]);

  const columnsapi = [
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
      title: "Sorties",
      key: "sar_unit",
      dataIndex: "sar_unit",
      filtertype: 'unique',
    },
    {
      title: "Time",
      description: "Time expeded on sorties",
      dataIndex: "Time expeded on sorties",
      key: "mv_flag",
    },
    {
      title: "Ship/Boat Rescued",
      dataIndex: "sar_boat_name",
      key: "sar_boat_name",
      filtertype: 'search',
    },
    {
      title: "Size",
      description: "Size of Units Assisted and Assistance Rendered",
      dataIndex: "sar_unit_size",
      key: "sar_unit_size",
      filtertype: 'unique',
    },
    {
        title: "Flag",
        dataIndex: "sar_country",
        key: "sar_country",
        filtertype: 'unique',
    },
    {
      title: "Lives Saved",
      key: "sar_lives_saved",
      dataIndex: "sar_lives_saved",
      filtertype: 'number',
      sorttype: 'number',
    },
    {
      title: "Lives Lost",
      key: "sar_lives_lost",
      dataIndex: "sar_lives_lost",
      filtertype: 'number',
      sorttype: 'number',
    },
    {
      title: "Other",
      description: "Persons otherwise assisted",
      key: "sar_person_assisted",
      dataIndex: "sar_person_assisted",
      filtertype: 'search',
    },
    {
      title: "Property Saved Value",
      description: "Value of Property Saved/ Assisted",
      key: "sar_value_property_saved",
      dataIndex: "sar_value_property_saved",
      filtertype: 'search',
    },
    {
        title: "Property Lost Value",
        description: "Value of Property Lost",
        key: "sar_value_property_lost",
        dataIndex: "sar_value_property_lost",
        filtertype: 'search',
    },
    {
        title: "Loss Prevented",
        description: "Property Loss Prevented",
        key: "sar_prevented_property_lost",
        dataIndex: "sar_prevented_property_lost",
        filtertype: 'search',
    },
    {
        title: "Alerting Means",
        description: "Type of Alerting Means",
        key: "sar_alerting_type",
        dataIndex: "sar_alerting_type",
        filtertype: 'search',
    },
    {
        title: "Incidents",
        key: "sar_incidents",
        dataIndex: "sar_incidents",
        filtertype: 'search',
    },
    {
      title: "Responses",
      key: "sar_response",
      dataIndex: "sar_response",
      filtertype: 'search',
    },
    {
      title: "Method of Locating Distress",
      description: "Method of Locating The Distressed Person Or Property",
      key: "sar_distress_method",
      dataIndex: "sar_distress_method",
      filtertype: 'search',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];  

  const columns = [
    {
      key: "S NO",
      title: "S NO.",
      dataIndex: "S NO",
      filtertype: 'unique',
    },
    {
      title: "DTG YEAR",
      key: "dtg_year",
      dataIndex: "DTG YEAR",
      filtertype: 'search',
    },
    {
      key: "Position",
      title: "Position/ Distance Offshore",
      dataIndex: "Position/ Distance Offshore",
      filtertype: 'search',
    },
    {
      title: "Sorties (Ships/ A/Cs)",
      key: "mv_imo",
      dataIndex: "Sorties (Ships/ A/Cs)",
      filtertype: 'unique',
    },
    {
        title: "Time expeded on sorties",
        dataIndex: "Time expeded on sorties",
        key: "mv_flag",
        filtertype: 'unique',
    },
    {
        title: "Ship/ boat Rescued",
        dataIndex: "Ship/ boat Rescued",
        key: "mv_flag",
        filtertype: 'unique',
    },
    {
        title: "Size of Units Assisted and Assistance Rendered",
        dataIndex: "Size of Units Assisted and Assistance Rendered",
        key: "mv_flag",
        filtertype: 'unique',
    },
    {
        title: "Flag",
        dataIndex: "FLAG",
        key: "mv_flag",
        filtertype: 'unique',
    },
    {
      title: " Lives Saved",
      key: "mv_imo",
      dataIndex: " Lives Saved",
      filtertype: 'search',
    },
    {
      title: "Lives Lost",
      key: "mv_imo",
      dataIndex: "Lives Lost",
      filtertype: 'search',
    },
    {
      title: "Persons otherwise assisted",
      key: "mv_imo",
      dataIndex: "Persons otherwise assisted",
      filtertype: 'search',
    },
    {
      title: "Value of Property Saved/ Assisted",
      key: "mv_imo",
      dataIndex: "Value of Property Saved/ Assisted",
      filtertype: 'search',
    },
    {
        title: "Value of Property Lost",
        key: "mv_imo",
        dataIndex: "Value of Property Lost",
        filtertype: 'search',
    },
    {
        title: "Property Loss Prevented",
        key: "mv_imo",
        dataIndex: "Property Loss Prevented",
        filtertype: 'search',
    },
    {
        title: "Type of Alerting Means",
        key: "mv_imo",
        dataIndex: "Type of Alerting Means",
        filtertype: 'search',
    },
    {
        title: "Incidents",
        key: "mv_imo",
        dataIndex: "Incidents",
        filtertype: 'search',
    },
    {
      title: "Responses",
      key: "mv_imo",
      dataIndex: "Responses",
      filtertype: 'search',
    },
    {
      title: "Method of Locating The Distressed Person Or Property",
      key: "mv_imo",
      dataIndex: "Method of Locating The Distressed Person Or Property",
      filtertype: 'search',
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
          title="Search and Rescue"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      </div>
      {viewPermission ? (
        <div>
          {/* { apidata? ( */}
            <AntdTableIndex
              columns={columnsapi}
              data={data}
              loading={isLoading}
              setFilteredDataSource={setFilteredDataSource}
              componentRef={componentRef}
            />
          {/* ) : (
            <AntdTableIndex
              columns={columns}
              data={searchandrescue}
              // loading={isLoading}
              setFilteredDataSource={setFilteredDataSource}
              componentRef={componentRef}
            />)} */}
        </div>
      ) : (
        <Forbidden></Forbidden>
      )}
    </>
  );
}

export default SAR;
export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Search and Rescue Data",
      },
    },
  };
}
