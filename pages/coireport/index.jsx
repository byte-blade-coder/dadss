import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoiData } from "../../src/redux/thunks/coiVesselData";
import dayjs from "dayjs";
import { decimalToDMS } from "../../src/helper/position";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import Forbidden from "../403";
import { MdViewList } from "react-icons/md";
import { Tooltip } from "antd";

function SpecialReportCoi() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchCoiVesselReport
  );
  const [searchData, setSearchData] = useState({ssr_table: "COI_FORM"});
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = true;
  const viewPermission = true;

  useEffect(() => {
    dispatch(fetchCoiData(searchData.ssr_table));
  }, [searchData]);

  const handleDetails = (ssr_key, payload) => {
    router.push({
      pathname: `/coireport/specialreportdetails`,
      query: {
        ssr_key: ssr_key,
      },
    });
  };

  const handleNavigate = () => {
    router.push("/coireport/addspecialreport");
  };

  const columns = [
    {
      title: "Platform ID",
      dataIndex: "ssr_own_ship",
      key: "ssr_own_ship",
      filtertype: "unique",
      render: (text) => {
        return text;
      },
    },
    {
      title: "Vessel Name",
      dataIndex: "ssr_boat_name",
      key: "ssr_boat_name",
      filtertype: "search",
    },
    {
      title: "Date Time",
      key: "ssr_dtg",
      dataIndex: "ssr_dtg",
      sorttype: "date",
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      key: "latitude",
      title: "Latitude",
      dataIndex: "ssr_position",
      sorter: (a, b) => {
        const latA = a.ssr_position ? a.ssr_position.coordinates[1] : null;
        const latB = b.ssr_position ? b.ssr_position.coordinates[1] : null;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.ssr_position) {
          var val = record.ssr_position.coordinates[1];
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
      dataIndex: "ssr_position",
      sorter: (a, b) => {
        const latA = a.ssr_position ? a.ssr_position.coordinates[0] : null;
        const latB = b.ssr_position ? b.ssr_position.coordinates[0] : null;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.ssr_position) {
          var val = record.ssr_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          // return longitude;
          return (
            <Tooltip title={`${longitude}`}>
              <span>{val}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      key: "ssr_patroltype",
      title: "Patrol Type",
      dataIndex: "ssr_patroltype",
      filtertype: "unique",
      render: (text) => {
        return text;
      },
    },
    {
      key: "ssr_actiontype",
      title: "Action",
      dataIndex: "ssr_actiontype",
      filtertype: "unique",
      render: (text) => {
        return text;
      },
    },
    {
      title: "View",
      dataIndex: "ssr_key",
      key: "ssr_key",
      checkbox: false,
      render: (text, record) => {
        if (record.ssr_key) {
          return (
            <div>
              <a
                className="text-midnight font-semibold"
                onClick={() => handleDetails(record?.ssr_key, record)}
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
          title="COI Special Report"
          hover="Data regarding query or boarding of a COI vessel "
          btnTitle="Add Special Report"
          btnTitleMedia="Add"
          placeholder="Search by COI ID/Name or Reg No"
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

export default SpecialReportCoi;
