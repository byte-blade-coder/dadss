import React, { useEffect, useRef, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneralReport } from "../../src/redux/thunks/generalReportData.js";
import { GeneralReportColumn } from "../../src/helper/DataColumns.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import { decimalToDMS } from "../../src/helper/position.js";
import dayjs from "dayjs";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Button, Checkbox, InputNumber, Select, Tooltip } from "antd";
import { hasPermission } from "../../src/helper/permission.js";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled.js";
import AntdTableIndex from "../../src/components/table/AntdTableIndex.js";
import { MdViewList } from "react-icons/md";
import Forbidden from "../403.jsx";

function Index() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector((state) => state.fetchGeneralReport);
  const dispatch = useDispatch();
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = true;
  const viewPermission = true;

  useEffect(() => {
    dispatch(fetchGeneralReport(searchData));
  }, [searchData]);

  const handleNavigate = () => {
    router.push("/generalreport/addgeneralinput");
  };

  const columns = [
    {
      title: "Platform ID",
      dataIndex: "gr_pf_id",
      key: "gr_pf_id",
      filtertype: 'unique',
      render: (text) => {
        return text;
      },
    },
    {
      title: "Latitude",
      key: "gr_position",
      dataIndex: "gr_position",
      sorter: (a, b) => {
        const latA = a.gr_position ? a.gr_position.coordinates[1] : null;
        const latB = b.gr_position ? b.gr_position.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.gr_position) {
          const val = record.gr_position.coordinates[1];
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
      key: "gr_position",
      title: "Longitude",
      dataIndex: "gr_position",
      sorter: (a, b) => {
        const latA = a.gr_position ? a.gr_position.coordinates[0] : null;
        const latB = b.gr_position ? b.gr_position.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.gr_position) {
          var val = record.gr_position.coordinates[0];
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
      key: "gr_patroltype",
      title: "Patrol Type",
      dataIndex: "gr_patroltype",
      filtertype: 'unique',
      render: (text) => {
        return Array.isArray(text) ? text.join(", ") : text;
      },
    },
    {
      key: "gr_fuelrem",
      title: "Fuel Remaining (%)",
      dataIndex: "gr_fuelrem",
      filtertype: 'number',
      sorttype: 'number',
    },
    {
      key: "gr_dtg",
      title: "Date Time",
      dataIndex: "gr_dtg",
      sorttype: 'date',
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      key: "action",
      title: "View",
      dataIndex: "action",
      checkbox: false,
      render: (text, record) => {
        return (
          <Link
            href={`/generalreport/${record.gr_key}`}
            className="text-midnight font-semibold"
          >
            <MdViewList size={20}/>
          </Link>
        );
      },
    },
  ];


  return (
    <>
      <div>
        <PageHeaderStyled
          title="SITREP By Ship"
          hover="Sitrep submitted by ship every 6-12 hours "
          btnTitle="Add Report"
          btnTitleMedia="Add"
          placeholder="Search by Platform ID / Patrol Type"
          onSearchChange={setSearchData}
          showSearchBox={viewPermission}
          onNavigate={handleNavigate}
          showButton={addPermission}
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
export async function getServerSideProps() {
  return {
    props: {
      data: {
        title: "General Report",
      },
    },
  };
}
