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
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchShipBreakingReport
  );
  const [combinedData, setCombinedData] = useState(null);
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
 const addPermission = hasPermission("Can add merchant_ vessel");
 const viewPermission = hasPermission("Can view merchant_ vessel");
  console.log("data", gaddanishipsboardingops)

  // Effect hook to dispatch the fetchRegisteredMerchantVessel action when searchData changes
  useEffect(() => {
    dispatch(fetchShipBreakingReport(searchData));
  }, [searchData]);
  
  const fetchMissionReportID = async () => {
   if(data)
    {
      try{
        console.log("Data before dispatch: ", data)
            
        const detailsPromises = data.map(async (item) =>
          {
            console.log("ITEMMM: ", item)
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ship_breaking/${item.sb_key}`
            );
            if (response.status === 200) {
              console.log(response)
              return response.data;
            }
          }
        );

        const details = await Promise.all(detailsPromises);
        console.log("After dispacthded:", detailsPromises, details)
        const combined = data.flatMap((item, index) => {
        
          console.log("item, index", item, index, details),
          console.log("SHI_BREAK_REP DEETS: ", details[index])
          return details.map((detail) => (
            console.log("SHI_BREAK_Rep INSIDE", detail, item),
            {
            ...item,
            ...detail,
            merchant_vessel: {
                  ...detail.merchant_vessel, 
                },
            // shipbreakingcrew: {
            //       ...detail.shipbreakingcrew,
            // }
            shipbreakingcrew: detail.shipbreakingcrew.map(member => member.sbc_name).join(', '),
          }));
        }
      ) 
      console.log("RIGHHTTTT: ",combined)
      setCombinedData(combined);

    } catch (error) {
        console.error("Failed to fetch mission report details:", error);
      }
    }
  };

  
  useEffect(() => {
    if (!data) {
      fetchMissionReportID();
    }
    else
    {
      fetchMissionReportID();
    }
  }, []);

   console.log("Details: ", combinedData)

  const columnsapi = [
    {
        key: "shipbreakingcrew",
        title: "CREW",
        dataIndex: "shipbreakingcrew",
        render: (text, record) => {
          if (record.shipbreakingcrew) {
            console.log("crew: ",record.shipbreakingcrew, text)
            return text;
          }
          return text;
        },
    },
    {
        key: "sb_dtg",
        title: "Date",
        dataIndex: "sb_dtg",
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
      dataIndex: "mv_ship_name",
      filtertype: 'search',
      render: (text, record) => {
        if (record.merchant_vessel) return record.merchant_vessel.mv_ship_name
      },
    },
    {
      title: "Flag",
      dataIndex: "mv_flag",
      key: "mv_flag",
      filtertype: 'unique',
      render: (text, record) => {
        if (record.merchant_vessel) return record.merchant_vessel.mv_flag
      },
    },
    {
      title: "Type",
      key: "mv_ais_type_summary",
      dataIndex: "mv_ais_type_summary",
      filtertype: 'unique',
      render: (text, record) => {
        if (record.merchant_vessel) return record.merchant_vessel.mv_ais_type_summary
      },
    },
    {
        title: "IMO NO.",
        key: "mv_imo",
        dataIndex: "mv_imo",
        filtertype: 'search',
    },
    {
      title: "JMICC Template",
      key: "sb_rdt",
      dataIndex: "sb_rdt",
      filtertype: 'search',
    },
    {
      title: "Gaddani Arrival",
      key: "sb_lpoc",
      dataIndex: "sb_lpoc",
      filtertype: 'search',
    },
    {
      title: "Owner Name",
      key: "sb_owner_name",
      dataIndex: "sb_owner_name",
      filtertype: 'search',
    },
    {
      title: "Agent Name",
      key: "sb_locshipping_agent_name",
      dataIndex: "sb_locshipping_agent_name",
      filtertype: 'search',
    },
    {
      title: "Contact",
      key: "sb_owner_num",
      dataIndex: "sb_owner_num",
      filtertype: 'search',
    },
    {
        title: "Crew",
        key: "sb_crew",
        dataIndex: "sb_crew",
        filtertype: 'search',
    },
    {
      title: "Nationality",
      key: "sb_mast_nationality",
      dataIndex: "sb_mast_nationality",
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
            columns={columnsapi}
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