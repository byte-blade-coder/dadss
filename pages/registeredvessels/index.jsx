import React, { useEffect, useRef, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredVessel } from "../../src/redux/thunks/registeredVesselData";
import Link from "next/link";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Button, InputNumber, Result, Select } from "antd";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Checkbox } from "antd";
import Forbidden from "../403";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import { hasPermission } from "../../src/helper/permission";
import { MdViewList } from "react-icons/md";

function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector(
    (state) => state.fetchRegisteredVesselData
  );
  const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = hasPermission('add_rvessels');
  const viewPermission = hasPermission('view_rvessels');

  const handleNavigate = () => {
    router.push("/registeredvessels/vesselregistration");
  };

  useEffect(() => {
    dispatch(fetchRegisteredVessel(searchData));
  }, [searchData]);

  const columns = [
    {
      title: "Registration Number",
      key: "rv_regno",
      dataIndex: "rv_regno",
      filtertype: 'search',
      render: (text) => {
        return text;
      },
    },
    {
      title: "Vessel ID Number",
      dataIndex: "rv_id",
      key: "rv_id",
      filtertype: 'search',
      render: (text) => {
        return text;
      },
    },
    {
      key: "rv_name",
      title: "Vessel Name",
      dataIndex: "rv_name",
      filtertype: 'search',
      render: (text) => {
        return text;
      },
    },
    {
      key: "rv_type",
      title: "Type",
      dataIndex: "rv_type",
      filtertype: 'unique',
      render: (text) => {
        return text;
      },
    },
    {
      key: "rv_flag",
      title: "Flag",
      dataIndex: "rv_flag",
      filtertype: 'unique',
      ellipsis: ".."
    },
    {
      key: "rv_province",
      title: "Province",
      dataIndex: "rv_province",
      filtertype: 'unique',
    },
    {
      title: "View",
      dataIndex: "action",
      key: "action",
      checkbox: false,
      render: (text, record) => (
        <Link
          className="text-midnight font-semibold"
          href={{
            pathname: `registeredvessels/${record.rv_key}`,
            query: { rv_key: record.rv_key }, // Pass rv_key as a query parameter
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
          title="Registered Fishing Vessels "
          btnTitle={"Register Vessel"} // Render the button only if access is not denied
          btnTitleMedia="+ Add"
          onSearchChange={setSearchData}
          placeholder="Search by Vessel ID, Name or Reg No"
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
export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Registered Vessel Data",
      },
    },
  };
}
