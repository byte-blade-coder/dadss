import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Button, InputNumber, Result, Select, Tooltip } from "antd";
import { Checkbox } from "antd";
import Forbidden from "../403";
import { decimalToDMS } from "../../src/helper/position.js";
import dayjs from "dayjs";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import { hasPermission } from "../../src/helper/permission";
import { MdViewList } from "react-icons/md";
import searchandrescue from "../../src/data/searchandrescue.json";
import PageHeaderIndex from "../../src/components/pageheader/pageHeaderIndex.js";
import { fetchSARData } from "../../src/redux/thunks/searchandrescue.js";

function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector(
    (state) => state.fetchSARData
  );

  const [searchData, setSearchData] = useState({ sar_table: 'SAR_FORM' });
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = true;
  const viewPermission = true;
  
  const handleNavigate = () => {
    router.push("/searchandrescue/addsearchandrescuedetails");
  };

  useEffect(() => {
    dispatch(fetchSARData(searchData.sar_table));
  }, [searchData]);

  //  const filteredData = useMemo(() => {
  //   if (!data) return [];

  //   if (table === "Sar") {
  //     return data.filter((item) => item.sar_table === "SAR");
  //   } else {
  //     return data.filter((item) => item.sar_table === "SAR_FORM");
  //   }
  // }, [data, table]);

  const handleClick = () => {
    const theme = 'searchAndRescue'; // or your dynamic logic
    const filter = `"vessel_flag" = 'PAK'`;

    router.push({
      pathname: '/activitymapsandtrends/qgis/searchrescue',
      query: { f: filter },
    });
  };

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
    // {
    //   title: "Sorties",
    //   key: "sar_unit",
    //   dataIndex: "sar_unit",
    //   filtertype: 'unique',
    // },
    {
      title: "Ship/Boat Rescued",
      dataIndex: "sar_boat_name",
      key: "sar_boat_name",
      filtertype: 'unique',
    },
    {
        title: "Size",
        description: "Size of Units Assisted and Assistance Rendered",
        dataIndex: "sar_unit_size",
        key: "sar_unit_size",
        filtertype: 'unique',
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
        title: "Flag",
        dataIndex: "sar_country",
        key: "sar_country",
        filtertype: 'unique',
    },
    {
      title: "Lives Saved",
      key: "sar_lives_saved",
      dataIndex: "sar_lives_saved",
      filtertype: 'search',
    },
    {
      title: "Lives Lost",
      key: "sar_lives_lost",
      dataIndex: "sar_lives_lost",
      filtertype: 'search',
    },
    // {
    //   title: "Other",
    //   description: "Persons otherwise assisted",
    //   key: "sar_person_assisted",
    //   dataIndex: "sar_person_assisted",
    //   filtertype: 'search',
    // },
    // {
    //   title: "Property Saved Value",
    //   description: "Value of Property Saved/ Assisted",
    //   key: "sar_value_property_saved",
    //   dataIndex: "sar_value_property_saved",
    //   filtertype: 'search',
    // },
    // {
    //     title: "Property Lost Value",
    //     description: "Value of Property Lost",
    //     key: "sar_value_property_lost",
    //     dataIndex: "sar_value_property_lost",
    //     filtertype: 'search',
    // },
    // {
    //     title: "Loss Prevented",
    //     description: "Property Loss Prevented",
    //     key: "sar_prevented_property_lost",
    //     dataIndex: "sar_prevented_property_lost",
    //     filtertype: 'search',
    // },
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
      title: "Response",
      key: "sar_response",
      dataIndex: "sar_response",
      filtertype: 'search',
    },
    // {
    //   title: "Method of Locating Distress",
    //   description: "Method of Locating The Distressed Person Or Property",
    //   key: "sar_distress_method",
    //   dataIndex: "sar_distress_method",
    //   filtertype: 'search',
    // },
    {
      title: "View",
      dataIndex: "action",
      key: "action",
      checkbox: false,
      render: (text, record) => (
        <Link
          className="text-midnight font-semibold"
          href={{
            pathname: `searchandrescue/${record.sar_key}`,
            query: { sar_key: record.sar_key }, // Pass rv_key as a query parameter
          }}
        >
          <MdViewList size={20}/>
        </Link>
      ),
    },
  ];  

  return (
    <>
      <div>
        <PageHeaderStyled
          title="Search and Rescue"
          btnTitle={"Add"} // Render the button only if access is not denied
          btnTitleMedia="+ Add"
          onSearchChange={setSearchData}
          placeholder="Search by Vessel ID, Name or Reg No"
          showSearchBox={viewPermission}
          onNavigate={handleNavigate}
          showButton={addPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
          customChildComponent={
            <div>
               <Button type="primary" onClick={handleClick} 
                  className="rounded border-navyblue bg-navyblue text-white  mr-1 inline-flex items-center ">
                  View on Map
                </Button>
            </div>
          }
        />
      </div>
      {viewPermission ? (
        <div>
          <AntdTableIndex
            columns={columnsapi}
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
