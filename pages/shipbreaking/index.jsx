import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchShipBreakingReport } from "../../src/redux/thunks/shipbreakingReportData.js";
import dayjs from "dayjs";
import { hasPermission } from "../../src/helper/permission.js";
import AntdTableIndex from "../../src/components/table/AntdTableIndex.js";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled.js";
import { MdViewList } from "react-icons/md";

import Forbidden from "../403.jsx";

function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchShipBreakingReport
  );
  const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = hasPermission('add_shipbreaking');
  const viewPermission = hasPermission('view_shipbreaking');

  // Effect hook to dispatch the fetchRegisteredMerchantVessel action when searchData changes
  useEffect(() => {
    dispatch(fetchShipBreakingReport(searchData));
  }, [searchData]);

  //handle button click and navigate to a new page
  const handleNavigate = () => {
    router.push("/shipbreaking/register");
  };

  // Columns configuration for the AntdTable component
  const columns = [
    {
      title: "Date Time",
      dataIndex: "sb_dtg",
      key: "sb_dtg",
      sorttype: 'date',
      render: (text) => {
        const dtg = text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "---";
        return dtg;
      },
    },
    {
      title: "IMO",
      dataIndex: "mv_imo",
      key: "mv_imo",
      filtertype: 'number',
      sorttype: 'number',
      render: (text) => {
        return text;
      },
    },
    {
      title: "IMO Verified",
      key: "sb_imo_verified",
      dataIndex: "sb_imo_verified",
      sorter: (a, b) =>
        a.sb_imo_verified === b.sb_imo_verified
          ? 0
          : a.sb_imo_verified
            ? 1
            : -1,
      render: (value) => (value ? "Yes" : "No"),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record.sb_imo_verified === value,
    },
    {
      title: "LPOC",
      key: "sb_lpoc",
      dataIndex: "sb_lpoc",
      filtertype: 'unique',
    },
    {
      title: "Ex Name",
      key: "sb_ex_name",
      dataIndex: "sb_ex_name",
      filtertype: 'unique',
    },
    {
      title: "Embossed",
      key: "sb_emb_name",
      dataIndex: "sb_emb_name",
      filtertype: 'unique',
    },
    {
      title: "View",
      dataIndex: "action",
      key: "action",
      checkbox: false,
      render: (text, record) => {
        return (
          <IconsStylingWrap>
            <Link
              href={{
                pathname: `/shipbreaking/${record.sb_key}`,
                query: { sb_key: record.sb_key }, // Pass ir_key as a query parameter
              }}
              className="text-midnight ml-2 font-semibold"
            >
              <MdViewList size={20}/>
            </Link>
          </IconsStylingWrap>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <PageHeaderStyled
          title="Ship Breaking"
          btnTitle="Add Report"
          btnTitleMedia="+ Add"
          placeholder="Search by Ex Name"
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
    //     title="Ship Breaking (List View)"
    //     btnTitle="+ Add Report"
    //     onSearchChange={setSearchData}
    //     onNavigate={handleNavigate}
    //     placeholder="Search by Ex Name"
    //     // showButton={true}
    //     showButton={accessDeniedAdd === false} // Show the button if access is not denied
    //     btnTitleMedia="+ Add"
    //     currentData={currentData}
    //   />

    //   {accessDenied ? (
    //     <Result
    //       status="403"
    //       title="403 Forbidden"
    //       subTitle="You don't have permission to access this resource."
    //       extra={
    //         <Button type="primary" onClick={() => router.push("/dashboard")}>
    //           Back Home
    //         </Button>
    //       }
    //     />
    //   ) : (
    //     <ReactDragListView.DragColumn {...dragProps}>
    //       <AntdTable
    //         // columns={columns}
    //         columns={dragColumns.filter((column) => !column.hidden)}
    //         // data={data}
    //         data={filteredDataSource || []}
    //         loading={isLoading}
    //         scrollConfig={{ x: true }}
    //         setCurrentData={setCurrentData}
    //       />
    //     </ReactDragListView.DragColumn>
    //   )}
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