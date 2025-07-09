import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { hasPermission } from "../../helper/permission.js";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js"
import AntdTableIndex from "../table/AntdTableIndex.js";
import Forbidden from "../../../pages/403.jsx";
import { fetchCargoDhowData } from "../../redux/thunks/outputTableData.js";
import gaddanishipsboardingops from "../../data/gaddanishipsboardingops.json";
import { fetchShipBreakingReport } from "../../redux/thunks/shipbreakingReportData.js";

function Gaddanishipsboardingops({apidata}) {
 
  const [searchData, setSearchData] = useState({ ssr_table: 'GADDANI SHIPS BOARDING OPS' });
  const { data, isLoading } = useSelector((state) => state.fetchCargoDhowData);
  const [combinedData, setCombinedData] = useState(null);
  const dispatch = useDispatch();

  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const router = useRouter();
  const viewPermission = true; // Assuming permission is granted
  console.log("filteredDataSource", filteredDataSource, "\ndata", data)
  
  useEffect(() => {
    dispatch(fetchCargoDhowData(searchData.ssr_table));
  }, [searchData]);

  // Effect hook to dispatch the fetchRegisteredMerchantVessel action when searchData changes

  const columns_new = [
    {
        key: "gs_date",
        title: "Date",
        dataIndex: "gs_date",
        sorttype: 'date',
        render: (text) => {
          if (!text) return "---";
          const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          return dtg;
        },
    },
    {
      title: "Vessel Name",
      key: "gs_boat_name",
      dataIndex: "gs_boat_name",
      filtertype: 'search',
      // render: (text, record) => {
      //   if (record.merchant_vessel) return record.merchant_vessel.mv_ship_name
      // },
    },
    {
      title: "Flag",
      dataIndex: "gs_country",
      key: "gs_country",
      filtertype: 'unique',
      // render: (text, record) => {
      //   if (record.merchant_vessel) return record.merchant_vessel.mv_flag
      // },
    },
    {
      title: "Type",
      key: "gs_boat_type",
      dataIndex: "gs_boat_type",
      filtertype: 'unique',
      // render: (text, record) => {
      //   if (record.merchant_vessel) return record.merchant_vessel.mv_ais_type_summary
      // },
    },
    {
        title: "IMO NO.",
        key: "gs_imo_no",
        dataIndex: "gs_imo_no",
        filtertype: 'search',
    },
    {
      title: "JMICC Template",
      key: "gs_jmicc",
      dataIndex: "gs_jmicc",
      filtertype: 'search',
    },
    {
      title: "Gaddani Arrival",
      key: "gs_arrival_date",
      dataIndex: "gs_arrival_date",
      filtertype: 'search',
    },
    {
      title: "Owner Name",
      key: "gs_owner_name",
      dataIndex: "gs_owner_name",
      filtertype: 'search',
    },
    {
      title: "Agent Name",
      key: "gs_agent_name",
      dataIndex: "gs_agent_name",
      filtertype: 'search',
    },
    {
      title: "Contact",
      key: "gs_contact",
      dataIndex: "gs_contact",
      filtertype: 'search',
    },
    {
        title: "Crew",
        key: "gs_crew",
        dataIndex: "gs_crew",
        filtertype: 'number',
    },
    {
      title: "Nationality",
      key: "gs_nationality",
      dataIndex: "gs_nationality",
      description: "Crew Members' Nationality",
      filtertype: 'search',
    },
    {
      title: "Boarding By",
      key: "gs_boarding_by",
      dataIndex: "gs_boarding_by",
      filtertype: 'unique',
    },
    {
      title: "Remarks",
      key: "gs_remarks",
      dataIndex: "gs_remarks",
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
      title: "Vessel Name",
      key: "mv_ship_name",
      dataIndex: "Vessel Name",
      filtertype: 'search',
    },
    {
      title: "Flag",
      dataIndex: "Flag",
      key: "mv_flag",
      filtertype: 'unique',
    },
    {
      title: "Type",
      key: "mv_imo",
      dataIndex: "Type",
      filtertype: 'unique',
    },
    {
        title: "IMO NO.",
        key: "mv_imo",
        dataIndex: "IMO NO.",
        filtertype: 'search',
    },
    {
      title: "JMICC Template",
      key: "mv_imo",
      dataIndex: "JMICC Template",
      filtertype: 'search',
    },
    {
      title: "Gaddani Arrival",
      key: "mv_imo",
      dataIndex: "Gaddani Arrival",
      filtertype: 'search',
    },
    {
      title: "Owner Name",
      key: "mv_imo",
      dataIndex: "Owner Name",
      filtertype: 'search',
    },
    {
      title: "Agent Name",
      key: "mv_imo",
      dataIndex: "Agent Name",
      filtertype: 'search',
    },
    {
      title: "Contact",
      key: "mv_imo",
      dataIndex: "Contact",
      filtertype: 'search',
    },
    {
        title: "Crew",
        key: "mv_imo",
        dataIndex: "Crew",
        filtertype: 'search',
    },
    {
      title: "Nationality",
      key: "mv_imo",
      dataIndex: "Nationality",
      filtertype: 'search',
    },
    {
      title: "Boarding By",
      key: "mv_imo",
      dataIndex: "Boarding By",
      filtertype: 'unique',
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

  console.log("filteredDataSource", filteredDataSource, data)
  
  return (
    <>
    <PageHeaderIndex
      title="Gaddani Ships Boarding OPs"
      showSearchBox={viewPermission}
      currentData={viewPermission ? filteredDataSource : null}
      componentRef={viewPermission ? componentRef : null}
    />
    {viewPermission ? (
      <div>
        {apidata? (
          <AntdTableIndex
            columns={columns_new}
            data={data}
            loading={isLoading}
            setFilteredDataSource={setFilteredDataSource}
            componentRef={componentRef}
        />
        ): (
          <AntdTableIndex
            columns={columns}
            data={gaddanishipsboardingops}
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

export default Gaddanishipsboardingops;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Gaddani ships boarding opss Data",
      },
    },
  };
}