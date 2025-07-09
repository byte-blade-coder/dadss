import React, { useEffect, useRef, useState } from "react";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, InputNumber, Select, Tooltip } from "antd";
import { fetchFishingData } from "../../src/redux/thunks/fishingVesselData";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import AntdTable from "../../src/components/table/AntdTable";
import { fetchMerchantData } from "../../src/redux/thunks/merchantVesselData";
import dayjs from "dayjs";
import { decimalToDMS } from "../../src/helper/position";
import Link from "next/link";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import Forbidden from "../403";
import { MdViewList } from "react-icons/md";
function SpecialReportMerchant() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchMerchantVesselReport
  );
  const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = true;
  const viewPermission = true;

  useEffect(() => {
    dispatch(fetchMerchantData(searchData));
  }, [searchData]);

  const handleNavigate = () => {
    router.push("/merchantvessel/addspecialreport");
  };

  const handleDetails = (msr_key, payload) => {
    router.push({
      pathname: `/merchantvessel/specialreportdetails`,
      query: {
        msr_key: msr_key,
      },
    });
  };

  const columns = [
    {
      title: "Platform ID",
      dataIndex: "msr_pf_id",
      key: "msr_pf_id",
      render: (text) => {
        return text;
      },
    },
    {
      title: "Date Time",
      key: "msr_dtg",
      dataIndex: "msr_dtg",
      sorttype: 'date',
      render: (text) => {
        if (!text) return "---";

        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "Vessel Name",
      dataIndex: "mv_ship_name",
      key: "mv_ship_name",
      filtertype: "unique",
      render: (text, record) => {
        return text;
      },
    },
    {
      key: "latitude",
      title: "Latitude",
      dataIndex: "msr_position",
      sorter: (a, b) => {
        const latA = a.msr_position ? a.msr_position.coordinates[1] : null;
        const latB = b.msr_position ? b.msr_position.coordinates[1] : null;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.msr_position) {
          var val = record.msr_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          // return latitude;
          return (
            <Tooltip title={`${latitude}`}>
              <span>{val}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      key: "longitude",
      title: "Longitude",
      dataIndex: "msr_position",
      sorter: (a, b) => {
        const latA = a.msr_position ? a.msr_position.coordinates[0] : null;
        const latB = b.msr_position ? b.msr_position.coordinates[0] : null;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.msr_position) {
          var val = record.msr_position.coordinates[0];
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
      key: "msr_patroltype",
      title: "Patrol Type",
      dataIndex: "msr_patroltype",
      filtertype: 'unique',
      render: (text) => {
        return Array.isArray(text) ? text.join(", ") : text;
      },
    },
    {
      key: "msr_action",
      title: "Action",
      dataIndex: "msr_action",
      filtertype: 'unique',
      render: (text) => {
        return text;
      },
    },
    {
      title: "View",
      dataIndex: "action",
      key: "action",
      checkbox: false,
      render: (text, record) => {
        if (record.msr_key) {
          return (
            <div>
              <a
                className="text-midnight font-semibold"
                onClick={() => handleDetails(record?.msr_key, record)}
              >
                <MdViewList size={20}/>
              </a>
            </div>
          );
        }
      },
    },
  ];

  return (
    <>
      <div>
        <PageHeaderStyled
          title="Merchant Special Report"
          hover="Data regarding query or boarding of a merchant vessel "
          btnTitle="Add Report"
          btnTitleMedia="Add"
          placeholder="Search by Vessel ID/Name or Reg No"
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

export default SpecialReportMerchant;
