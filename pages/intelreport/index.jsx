import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchIntelReport } from "../../src/redux/thunks/intelReportData.js";
import dayjs from "dayjs";
import { hasPermission } from "../../src/helper/permission.js";
import Forbidden from "../403.jsx";
import AntdTableIndex from "../../src/components/table/AntdTableIndex.js";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled.js";
import { MdViewList } from "react-icons/md";

function Index() {
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector((state) => state.fetchIntelReport);
  const dispatch = useDispatch();
  const router = useRouter();
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = hasPermission('add_intelreport');
  const viewPermission = hasPermission('view_intelreport');

  // Navigation handler to the add intel input page
  const handleNavigate = () => {
    router.push("/intelreport/addintelinput");
  };

  // Effect hook to fetch intel report data when searchData changes
  useEffect(() => {
    dispatch(fetchIntelReport(searchData));
  }, [searchData]);

  // Table columns configuration, including additional "Details" action
  const columns = [
    {
      title: "Platform ID",
      dataIndex: "ir_pf_id",
      key: "ir_pf_id",
      filtertype: "unique",
      render: (text) => {
        return text;
      },
    },
    {
      title: "Reporter Name",
      dataIndex: "ir_reporter_name",
      key: "ir_reporter_name",
      filtertype: "unique",
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "Reporting DateTime",
      dataIndex: "ir_reporting_time",
      key: "ir_reporting_time",
      sorttype: "date",
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("DD-YY-YYYY HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "Jetty",
      key: "ir_jetty",
      filtertype: "unique",
      dataIndex: "ir_jetty",
    },
    {
      title: "Boats",
      dataIndex: "ir_total_boats",
      key: "ir_total_boats",
      filtertype: 'number',
      sorttype: 'number',
    },
    {
      title: "View",
      key: "action",
      dataIndex: "action",
      checkbox: false,
      render: (text, record) => (
        <Link
          className="text-midnight font-semibold"
          href={{
            pathname: `intelreport/${record.ir_key}`,
            query: { ir_key: record.ir_key }, // Pass ir_key as a query parameter
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
          title="Intel Report"
          btnTitle="Add Report"
          btnTitleMedia="+ Add"
          placeholder="Search by Reporter Name or Jetty"
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

export default Index;

// const IconsStylingWrap = styled.div`
//   display: flex;
//   .editIcon {
//     color: #28387e;
//     background-color: #f0f3f8;
//     border-radius: 20px;
//     font-size: 25px;
//     padding: 5px;
//     margin-right: 10px;
//     cursor: pointer;
//   }
//   .deleteIcon {
//     color: #e96162;
//     background-color: #f9e7e8;
//     border-radius: 20px;
//     font-size: 25px;
//     padding: 5px;
//     cursor: pointer;
//   }
//   .details {
//     color: #28387e;
//     padding: 5px;
//     cursor: pointer;
//   }
// `;
