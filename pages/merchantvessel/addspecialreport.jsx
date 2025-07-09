import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { Button, InputNumber, Select, Tooltip } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredMerchantVessel } from "../../src/redux/thunks/registerMerchantVesselDatas";
import { MerVesselColumn } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Checkbox } from "antd";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";

function SpecialMerchantReport() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector(
    (state) => state.fetchRegisteredMerchantVesselData
  );

  const handleNavigate = () => {
    router.push("/registeredmerchantvessels/vesselmerchantregistration");
  };
  
  const columns = [
    {
      title: "MMSI",
      key: "mv_mmsi",
      dataIndex: "mv_mmsi",
      sorttype: "number",
      filtertype: "number",
    },
    {
      title: "IMO",
      key: "mv_imo",
      dataIndex: "mv_imo",
      sorttype: "number",
      filtertype: "number",
    },
    {
      title: "Ship ID",
      dataIndex: "mv_ship_id",
      key: "mv_ship_id",
      sorttype: "number",
      filtertype: "number",
    },
    {
      title: "Ship Name",
      key: "mv_ship_name",
      dataIndex: "mv_ship_name",
      filtertype: "search",
    },
    {
      title: "Flag",
      dataIndex: "mv_flag",
      key: "mv_flag",
      filtertype: "unique",
    },
    {
      title: "Type",
      dataIndex: "mv_type_name",
      key: "mv_type_name",
      filtertype: "unique",
    },
    {
      title: "AIS Type",
      key: "mv_ais_type_summary",
      dataIndex: "mv_ais_type_summary",
      filtertype: "unique",
    },
    {
      title: "Details",
      dataIndex: "detail",
      key: "view",
      ellipsis: false,
      checkbox: false,
      render: (text, record) => {
        if (record.mv_key) {
          return (
            <Tooltip placement="topLeft" title={text}>
              <a
                className="text-midnight font-semibold"
                onClick={() => handleDetails(record?.mv_key, record)}
              >
                Add Special Report
              </a>
            </Tooltip>
          );
        }
      },
    },
  ];
  // Function to navigate to details page
  const handleDetails = (id, payload) => {
    localStorage.setItem('mer_vessel', JSON.stringify(payload));
    router.push({
      pathname: `/merchantvessel/${id}`,
    });
  };

  // Fetch data when searchData changes
  useEffect(() => {
    dispatch(fetchRegisteredMerchantVessel(searchData));
  }, [searchData]);

  return (
    <div>
      <PageHeaderStyled
        title="Registered Merchant Vessels"
        onSearchChange={(value) => setSearchData(value)}
        placeholder="Search by IMO or Ship Name"
        showButton={true} // Pass true to show the button or false to hide it
        searchBox={true}
        btnTitle="Register New Vessel"
        onNavigate={handleNavigate}
      />
      <AntdTableIndex
        scrollConfig={{ x: true }}
        columns={columns}
        data={data}
        loading={isLoading}
      />
    </div>
  );
}

export default SpecialMerchantReport;
