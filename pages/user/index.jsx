import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../src/redux/thunks/userAuth.js";
import dayjs from "dayjs";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import axios from "axios";
import Link from "next/link.js";
import AntdTableIndex from "../../src/components/table/AntdTableIndex.js";
import { extractUniqueValues } from "../../src/helper/filters.js";
import { hasPermission } from "../../src/helper/permission.js";
import Forbidden from "../403.jsx";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled.js";
import { MdViewList } from "react-icons/md";


function Index() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getUsers);
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = hasPermission('view_user');
  const addPermission = hasPermission('add_user');

  const handleClick = () => {
    router.push("/user/createuser");
  };

  useEffect(() => {
    dispatch(getAllUsers(searchData));
  }, [searchData]);

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
      filtertype: 'search',
    },
    {
      title: "Date Joined",
      dataIndex: "date_joined",
      key: "date_joined",
      sorttype: "date",
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("DD-MM-YYYY HH:mm:ss");
        return text ? <>{dtg}</> : text;
      },
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      key: "last_login",
      sorttype: "date",
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("DD-MM-YYYY HH:mm:ss");
        return text ? <>{dtg}</> : text;
      },
    },
    {
      title: "View",
      dataIndex: "action",
      checkbox: false,
      render: (text, record) => {
        return (
          <Link
            className="text-midnight font-semibold"
            href={{
              pathname: `user/${record.id}`,
              query: { id: record.id, username: record.username },
            }}
          >
            <MdViewList size={20}/>
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <PageHeaderStyled
          onSearchChange={setSearchData}
          onNavigate={handleClick}
          title="Users"
          btnTitleMedia="+ Add"
          placeholder="Search"
          btnTitle="Create User"
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
            setFilteredDataSource={setFilteredDataSource}
            componentRef={componentRef}
            pagination={true}
          />
        </div>
      ) : (
        <Forbidden></Forbidden>
      )}
    </>
  );
}

export default Index;

// export async function getServerSideProps(context) {
//   try {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/user?search=`
//     );
//     if (response.status === 200) return response.data;
//   } catch (error) {
//     console.log(error)
//   } return {
//     props: {
//       data: {
//         title: "User",
//       },
//     },
//   };
// }
