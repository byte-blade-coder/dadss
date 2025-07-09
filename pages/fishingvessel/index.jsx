import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchFishingData } from "../../src/redux/thunks/fishingVesselData";
import dayjs from "dayjs";
import { decimalToDMS } from "../../src/helper/position";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import Forbidden from "../403";
import { MdViewList } from "react-icons/md";
import { Tooltip } from "antd";

function SpecialReportFishing() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchFishingVesselReport
  );
  const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = true;
  const viewPermission = true;

  useEffect(() => {
    dispatch(fetchFishingData(searchData));
  }, [searchData]);

  const handleDetails = (sr_key, payload) => {
    router.push({
      pathname: `/fishingvessel/specialreportdetails`,
      query: {
        sr_key: sr_key,
      },
    });
  };

  const handleNavigate = () => {
    router.push("/fishingvessel/addspecialreport");
  };

  const columns = [
    {
      title: "Platform ID",
      dataIndex: "sr_pf_id",
      key: "sr_pf_id",
      filtertype: "unique",
      render: (text) => {
        return text;
      },
    },
    {
      title: "Vessel Name",
      dataIndex: "rvessel",
      key: "rvessel",
      filtertype: "unique",
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "Date Time",
      key: "sr_dtg",
      dataIndex: "sr_dtg",
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
      dataIndex: "sr_position",
      sorter: (a, b) => {
        const latA = a.sr_position ? a.sr_position.coordinates[1] : null;
        const latB = b.sr_position ? b.sr_position.coordinates[1] : null;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.sr_position) {
          var val = record.sr_position.coordinates[1];
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
      dataIndex: "sr_position",
      sorter: (a, b) => {
        const latA = a.sr_position ? a.sr_position.coordinates[0] : null;
        const latB = b.sr_position ? b.sr_position.coordinates[0] : null;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.sr_position) {
          var val = record.sr_position.coordinates[0];
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
      key: "sr_patroltype",
      title: "Patrol Type",
      dataIndex: "sr_patroltype",
      filtertype: "unique",
      render: (text) => {
        return Array.isArray(text) ? text.join(", ") : text;
      },
    },
    {
      key: "sr_action",
      title: "Action",
      dataIndex: "sr_action",
      filtertype: "unique",
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
        if (record.sr_key) {
          return (
            <div>
              <a
                className="text-midnight font-semibold"
                onClick={() => handleDetails(record?.sr_key, record)}
              >
                <MdViewList size={20} />
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
          title="Fishing Special Report"
          hover="Data regarding query or boarding of a fishing vessel "
          btnTitle="Add Special Report"
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
    // <div>
    //   <PageHeader
    //     title="Special Report Fishing Vessels (List View)"
    //     onSearchChange={(value) => setSearchData(value)}
    //     placeholder="Search by Vessel ID/Name or Reg No"
    //     btnTitle="+ Add Special Report"
    //     onNavigate={handleClick}
    //     currentData={currentData}
    //     showButton={true} // Pass true to show the button or false to hide it
    //   />
    //   <ReactDragListView.DragColumn {...dragProps}>
    //     <AntdTable
    //       // columns={columns}
    //       columns={dragColumns.filter((column) => !column.hidden)}
    //       data={data}
    //       // data={filteredDataSource || []}
    //       loading={isLoading}
    //       scrollConfig={{ x: true }}
    //       setCurrentData={setCurrentData}
    //     />
    //   </ReactDragListView.DragColumn>
    //   <div
    //     className="fixed-checkbox flex  justify-center "
    //     style={{
    //       backgroundColor: "#F5F5F5",
    //       padding: "20px",
    //       width: "100%",
    //       position: "sticky",
    //       bottom: "0px",
    //     }}
    //   >
    //     <Checkbox.Group
    //       value={checkedList}
    //       options={options}
    //       onChange={handleCheckboxChange}
    //     />
    //   </div>
    // </div>
  );
}

export default SpecialReportFishing;
