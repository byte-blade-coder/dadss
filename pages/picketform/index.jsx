import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredVessel } from "../../src/redux/thunks/registeredVesselData";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import { BiSolidEdit } from "react-icons/bi";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";

function AddSpecialReport() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector(
    (state) => state.fetchRegisteredVesselData
  );

  const handleNavigate = () => {
    router.push("/registeredvessels/vesselregistration");
  };

  const columns = [
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
      title: "Registration Number",
      key: "rv_regno",
      dataIndex: "rv_regno",
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
    },
    {
      key: "rv_province",
      title: "Province",
      dataIndex: "rv_province",
      filtertype: 'unique',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      width: 100,
      ellipsis: false,
      checkbox: false,
      render: (text, record) => {
        if (record.rv_key) {
          return (
            <div className="flex ml-5">
              <a
                className="text-midnight font-semibold"
                onClick={() => handleDetails(record?.rv_key, record)}
              >
                <BiSolidEdit size={18}/>
              </a>
            </div>
          );
        }
      },
    },

  ];

  const handleDetails = (id, payload) => {
    localStorage.setItem('vessel', JSON.stringify(payload));
    router.push({
      pathname: `/picketform/${id}`,
    });
  };

  useEffect(() => {
    dispatch(fetchRegisteredVessel(searchData));
  }, [searchData]);

  
  return (
    <div>
      <PageHeaderStyled
        title="Fishing Vessels"
        onSearchChange={(value) => setSearchData(value)}
        searchBox={true}
        placeholder="Search by Vessel ID/Name or Reg No"
        // showButton={true} // Pass true to show the button or false to hide it
        // btnTitle="Register New Vessel"
        // onNavigate={handleNavigate}
      />
        <AntdTableIndex
          columns={columns}
           data={data}
          loading={isLoading}
          scrollConfig={{ x: true }}
        />
    
    </div>
  );
}

export default AddSpecialReport;
export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Special Report(Fishing Vessel)",
      },
    },
  };
}
