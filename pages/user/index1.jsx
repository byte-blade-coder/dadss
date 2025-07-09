import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../src/redux/thunks/userAuth.js";
import dayjs from "dayjs";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import { Button, DatePicker, Result, Select } from "antd";
import Link from "next/link.js";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Checkbox } from "antd";
import { AiFillFilter } from "react-icons/ai";
import { extractUniqueValues } from "../../src/helper/filters.js";
import { hasPermission } from "../../src/helper/permission.js";
import Forbidden from "../403.jsx";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled.js";
import AntdTableIndex from "../../src/components/table/AntdTableIndex.js";


function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getUsers);
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const [searchData, setSearchData] = useState("");
  const [currentData, setCurrentData] = useState(data);
  const viewAccess = hasPermission('view_user');
  const addAccess = hasPermission('add_user');

  const handleClick = () => {
    router.push("/user/createuser");
  };

  useEffect(() => {
    dispatch(getAllUsers(searchData));
  }, [searchData]);

  useEffect(() => {
    if (data) {
      setFilteredDataSource(data);
    }
  }, [])


  const columns = [
    {
      title: "UserName",
      dataIndex: "username",
      key: "username",
      ellipsis: false,
      width: 250,
      filters: extractUniqueValues(data, "username"),
      // filterIcon: filtered => <AiFillFilter color={filtered ? "blue" : "gray"} size={15} />,
      sorter: (a, b) => a.username.localeCompare(b.username),
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.username.includes(value),
    },
    {
      title: "Date Joined",
      dataIndex: "date_joined",
      key: "datejoined",
      ellipsis: false,
      width: 250,
      sorter: (a, b) => new Date(a.date_joined) - new Date(b.date_joined),
      render: (text) => {
        if (!text) return "---";

        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return text ? <>{dtg}</> : text;
      },
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      key: "lastlogin",
      ellipsis: false,
      width: 250,
      sorter: (a, b) => new Date(a.last_login) - new Date(b.last_login),
      render: (text) => {
        if (!text) return "---";

        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return text ? <>{dtg}</> : text;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          <Link
            className="text-midnight font-semibold"
            href={{
              pathname: `user/${record.id}`,
              query: { id: record.id, username: record.username },
            }}
          >
            view
          </Link>
        );
      },
    },
  ];

  const [dragColumns, setDragColumns] = useState(columns);
  const defaultCheckedList = columns.map((item) => item.key);

  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  // Set the default checkedList to include the keys of all columns
  const options = columns
    .filter((column) => column.key !== "action") // Exclude the "action" column
    .map(({ key, title }) => ({
      label: title,
      value: key,
    }));

  useEffect(() => {
    setCheckedList(columns.map((item) => item.key));
    setDragColumns(columns);
  }, []);

  // Inside the useEffect hook where you handle checkbox changes
  const handleCheckboxChange = (checkedValues) => {
    setCheckedList(checkedValues);
    const newDragColumns = dragColumns.map((item) => ({
      ...item,
      hidden: !checkedValues.includes(item.key) && item.key !== "action", // Exclude "action" column from hiding
    }));
    setDragColumns(newDragColumns);
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const newColumns = [...dragColumns];
      const item = newColumns.splice(fromIndex, 1)[0];
      newColumns.splice(toIndex, 0, item);
      setDragColumns(newColumns);
    },
    nodeSelector: "th",
  };


  return (
    <>
      <div>
        <PageHeader
          onSearchChange={setSearchData}
          onNavigate={handleClick}
          title="Users"
          btnTitleMedia="+ Add"
          placeholder="Search"
          btnTitle="+ Create User"
          // showButton={true}
          currentData={currentData}
          showButton={addAccess} // Show the button if access is not denied
        />
      </div>
      {viewAccess ? (
        <>
          <ReactDragListView.DragColumn {...dragProps}>
            <AntdTable
              columns={dragColumns.filter((column) => !column.hidden)}
              data={data}
              scrollConfig={{ x: true }}
              setCurrentData={setCurrentData}
            />
          </ReactDragListView.DragColumn>
          <div
            className="fixed-checkbox flex  justify-center "
            style={{
              backgroundColor: "#F5F5F5",
              padding: "20px",
              width: "100%",
              position: "sticky",
              bottom: "0px",
            }}
          >
            <Checkbox.Group
              value={checkedList}
              options={options}
              onChange={handleCheckboxChange}
            />
          </div>
        </>
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
        title: "User",
      },
    },
  };
}
