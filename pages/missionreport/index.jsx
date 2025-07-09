import React, { useEffect, useRef, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissionReport } from "../../src/redux/thunks/missionReportData.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import { Missioncolumns } from "../../src/helper/DataColumns.js";
import dayjs from "dayjs";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Checkbox } from "antd";
import Forbidden from "../403.jsx";
import AntdTableIndex from "../../src/components/table/AntdTableIndex.js";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled.js";
import { hasPermission } from "../../src/helper/permission.js";
import { MdViewList } from "react-icons/md";

function Index() {
  const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const { data, isLoading } = useSelector((state) => state.fetchMissionReport);
  const dispatch = useDispatch();
  const router = useRouter();
  const componentRef = useRef();
  const addPermission = hasPermission('add_missionreport');
  const viewPermission = hasPermission('view_missionreport');

  // Navigation handler to the add intel input page
  const handleNavigate = () => {
    router.push("/missionreport/addmissioninput");
  };

  // Effect hook to fetch mission report data when searchData changes
  useEffect(() => {
    dispatch(fetchMissionReport(searchData));
  }, [searchData]);
  
  // Table columns configuration, including additional "Details" action
  const columns = [
    {
      title: "Platform ID",
      key: "mr_pf_id",
      dataIndex: "mr_pf_id",
      filtertype: 'unique',
    },
    {
      title: "Date Time",
      dataIndex: "mr_dtg",
      key: "mr_dtg",
      sorttype: 'date',
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("DD-MM-YYYY HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "Registered ON",
      key: "mr_rdt",
      dataIndex: "mr_rdt",
      sorttype: 'date',
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("DD-MM-YYYY HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "View",
      dataIndex: "action",
      key: "action",
      checkbox: false,
      render: (text, record) => (
        <Link
          className="text-midnight font-semibold"
          // href={`registeredvessels/${record.rv_key}`}
          href={{
            pathname: `missionreport/${record.mr_key}`,
            query: { mr_key: record.mr_key }, // Pass mr_key as a query parameter
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
          title="SITREP By Air Craft"
          hover="Sitrep submitted by air-craft on landing from air trip"
          btnTitle="Add Report"
          btnTitleMedia="Add"
          placeholder="Search by platform ID"
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
    //     title="Mission Report (List View)"
    //     btnTitle="+ Add Report"
    //     onSearchChange={setSearchData}
    //     onNavigate={handleNavigate}
    //     placeholder="Search by platform ID"
    //     showButton={true}
    //     btnTitleMedia="+ Add"
    //     currentData={filteredDataSource}
    //     // componentRef={viewPermission ? componentRef : null}
    //   />
    //   <ReactDragListView.DragColumn {...dragProps}>
    //     <AntdTable
    //       // columns={columns}
    //       // data={data}
    //       data={filteredDataSource || []}
    //       columns={dragColumns.filter((column) => !column.hidden)}
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

export default Index;

const IconsStylingWrap = styled.div`
  display: flex;
  .editIcon {
    color: #28387e;
    background-color: #f0f3f8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .deleteIcon {
    color: #e96162;
    background-color: #f9e7e8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    cursor: pointer;
  }
  .details {
    color: #28387e;
    padding: 5px;
    cursor: pointer;
  }
`;

