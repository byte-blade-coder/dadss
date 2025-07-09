import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "antd/lib/tooltip/index.js";
import dayjs from "dayjs";
import Link from "next/link.js";
import { Button, Checkbox, InputNumber, Select, Form } from "antd";
import SelectBox from "../form/SelectBox.js";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import { coordinatesToDMS, decimalToDMS } from "../../helper/position.js";
import AntdTableIndex from "../table/AntdTableIndex.js";
import Forbidden from "../../../pages/403.jsx";
import { MdViewList } from "react-icons/md";
import { fetchPlatformnameBasedData } from "../../redux/thunks/patroltypeBasedData.js";
import {platform_name_list} from "../../helper/dropdown.js";

// function Mangrovescutting({filteredDataSource,setFilteredDataSource})
function FilterByPlatform({apidata}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchPlatformnameBasedData
  );
  const [platformData, setPlatformData] = useState(null);
  const [searchData, setSearchData] = useState({ platform: ['SINC'] });
  // const [searchData, setSearchData] = useState({ platform: ['COMDESRON-23'] });
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = true; // Assuming permission is granted
  // const [selectedOption, setSelectedOption] = useState(["COMDESRON-23"]);
  const [selectedOption, setSelectedOption] = useState(["SINC"]);
  const [platformOptions, setPlatformOptions] = useState([]);

  //console.log("filteredDataSource", filteredDataSource, "\nsetFilteredDataSource", setFilteredDataSource);

  const fetchPlatforms = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`
      );
      if (response.status === 200) {
        const platformIds = response.data.map(item => item.pf_id);
        setPlatformData(response.data);
        setPlatformOptions(platformIds);
        console.log(response.data)
      }
    } catch (error) {
      //router.push("/404");
      console.log("Error while fetching Platforms: ", error)
    }
  }

  useEffect(() => {
    if (!platformData) {
      fetchPlatforms();
    }
  }, []);
  console.log("Platforms data", platformData, "\n Data: ", data,  apidata);

  useEffect(() => {
    console.log("Dispatching: ", searchData.platform)
    dispatch(fetchPlatformnameBasedData(searchData.platform));
  }, [searchData]
  // [searchData.platform, dispatch]
);

  const handleTableChange = (values) => {
    console.log("table change",values);
    setSelectedOption(values);
    setSearchData({ platform: values });   
    //filterDataByPlatform(values);
  };

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
        title:"PF",
        key:"pf_name",
        dataIndex:"pf_name",
        filtertype: 'unique',
    },
    {
        title: "Boat Name",
        key: "boat_name",
        dataIndex: "boat_name",
        filtertype: 'search',
    },
    {
        title: "Boat Type",
        key: "boat_type",
        dataIndex: "boat_type",
        filtertype: 'unique',
    },
    {
        title: "Reg No",
        key: "reg_no",
        dataIndex: "reg_no",
        filtertype: 'search',
    },
    {
        title: "Owner Name",
        key: "owner",
        dataIndex: "owner",
        filtertype: 'search',
    },
    {
        title: "Nakwa Name",
        key: "nakwa",
        dataIndex: "nakwa",
        filtertype: 'search',
    },
    {
        title: "Crew",
        key: "crew",
        dataIndex: "crew",
        filtertype: 'number',
        sorttype: 'number',
    },
    {
        title: "Depart Date",
        key: "depdate",
        dataIndex: "depdate",
        sorttype: 'date',
        filtertype: 'search',
    },
    {
        title: "PC Issue",
        key: "pcissuedt",
        dataIndex: "pcissuedt",
        sorttype: 'date',
        filtertype: 'search',
    },
    {
        title: "PC Issue Place",
        key: "pc",
        dataIndex: "pc",
    },
    {
        title: "Total Days of PC",
        key: "pc_days",
        dataIndex: "pc_days",
        filtertype: 'number',
        sorttype: 'number',
    },
    {
        title: "PC Due Date", //not coming from response
        key: "pcissuedt",
        dataIndex: "pcissuedt",
        sorttype: 'date',
        filtertype: 'search',
    },
    // {
    //     key: "remarks",
    //     title: "Legal/Illegal",
    //     dataIndex: "remarks",
    // },
    {
        key: "value",
        title: "Fishing Qty",
        dataIndex: "value",
        filtertype: 'search',
    },
    {
        key: "goods",
        title: "Fishing Type",
        dataIndex: "goods",
        filtertype: 'search',
    },
    // {
    //     key: "",
    //     title: "Fishing Position",
    //     dataIndex: "",
    // },
    {
        key: "ssr_gears",
        title: "Gears",
        dataIndex: "ssr_gears",
        filtertype: 'search',
    },
    {
        key: "ssr_cargo_type",
        title: "Type of Cargo",
        dataIndex: "ssr_cargo_type",
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
        title: "Time",
        key: "dtg",
        dataIndex: "dtg",
        render: (text) => {
          if (!text) return "---";
          const dtg = dayjs(text).format("HH:mm:ss");
          return dtg;
        },
    },
    // {
    //     key: "remarks",
    //     title: "Mobile No",
    //     dataIndex: "remarks",
    // },
    {
        key: "remarks",
        title: "Remarks",
        dataIndex: "remarks",
    },
    {
        key: "depjetty",
        title: "Departure Jetty",
        dataIndex: "depjetty",
        filtertype: 'search',
    },
    {
        key: "ssr_trans",
        title: "Trans T Creek",
        dataIndex: "ssr_trans",
        filtertype: 'search',
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

  console.log("platformOptions", platformOptions)

  return (
    <>
        <PageHeaderIndex
          title="Data Filtered By Platform"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
          customChildComponent={<Form style={{marginRight: "0.25rem"}}>
            {/* //style={{ float: "right", marginRight: "17rem", top: "-2.5rem", position: "relative",}} */}
          <StyledInput>
            <Select
                mode="multiple"
                allowClear
                style={{ width: 500 }} //marginLeft: "1.5rem", 
                placeholder="Select platform"
                name="Select platform"
                defaultValue={['SINC']}
                onChange={handleTableChange}
                options={platformOptions.map(item => (
                  console.log(item), {
                  value: item,
                  label: item,
                }))}
                rules={[
                  { required: true, message: "Please select a type of table!" },
                ]}
            />
          </StyledInput>
        </Form>}
        />
        
      {viewPermission ? (
        <div>
          <AntdTableIndex
              columns={columnsapi}
              data={data}
              loading={false}
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

export default FilterByPlatform;

// Styled component for custom styling   //.ant-select-multiple .ant-select-allow-clear .ant-select-show-search 
const StyledInput = styled.div`

  .ant-select-clear {
    margin-top: -8px;
    //width: 307px;
  }
  .ant-select-selection-item-remove{
    margin-top: -2.4px;
  }
`;