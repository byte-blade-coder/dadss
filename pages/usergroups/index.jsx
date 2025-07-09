import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { useRouter } from "next/router";
import Link from "next/link";
import PageHeader from "../../src/components/pageheader/pageHeader";
import axios from "axios";
import { Button, Result } from "antd";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import { MdViewList } from "react-icons/md";

function Index() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [accessDenied, setAccessDenied] = useState(false);
  const [filterValue, setFilterValue] = useState(""); // State for filter value
  const [filteredData, setFilteredData] = useState(groupList);


  const handleSearch = (value) => {
    setSearchData(value.toLowerCase()); // Update searchData with lowercase value
    if (value === "") {
      setFilteredData(groupList);
    } else {
      const filteredData = groupList.filter((item) =>
        item.name.toLowerCase().includes(value)
      );
      setFilteredData(filteredData);
    }
  };

  const handleGroupRoles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/group_list`,

      );
      if (response.status === 200) {
        setGroupList(response.data.Groups);
        setAccessDenied(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const errorMessage = error.response.data.detail;
        setAccessDenied(true);
      }
    }
  };

  const columns = [
    {
      title: "User Roles",
      dataIndex: "name",
      key: "name",
      width: 250,
      checkbox: false,
      render: (text) => {
        return text;
      },
    },
    {
      title: "View",
      dataIndex: "View",
      key: "view",
      width: 250,
      checkbox: false,
      render: (text, record) => (
        <div>
          <Link
            className="text-midnight font-semibold"
            href={{
              pathname: `usergroups/grouproledetails`,
              query: { name: record.name }, // Pass the group name as a query parameter
            }}
          >
            <MdViewList size={20} />
          </Link>
        </div>
      ),
    },
  ];

  const handleClick = () => {
    router.push("/usergroups/adduserreole");
  };

  useEffect(() => {
    handleGroupRoles();
  }, []);

  useEffect(() => {
    if (searchData.trim() !== "") {
      const filteredData = groupList.filter((item) =>
        item.name.toLowerCase().includes(searchData.toLowerCase())
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(groupList);
    }
  }, [searchData, groupList]);


  return (
    <>
      <PageHeaderStyled
        title="User Roles"
        btnTitle="User Role"
        btnTitleMedia="+ Add"
        onSearchChange={handleSearch}
        onNavigate={handleClick}
        placeholder="Search "
        showButton={true}
      />
      {accessDenied ? (
        <Result
          status="403"
          title="403 Forbidden"
          subTitle="You don't have permission to access this resource."
          extra={
            <Button type="primary" onClick={() => router.push("/dashboard")}>
              Back Home
            </Button>
          }
        />
      ) : (
        <div>
          <AntdTableIndex columns={columns} data={filteredData} />
        </div>
      )}
    </>
  );
}

export default Index;
export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "User Groups",
      },
    },
  };
}
