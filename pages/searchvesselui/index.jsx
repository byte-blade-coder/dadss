import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import PageHeader from "../../src/components/pageheader/pageHeaderWithMultipleSearchBars";
import { fetchRegisteredVessel } from "../../src/redux/thunks/registeredVesselData";
import { fetchTripDetailsData } from "../../src/redux/thunks/tripDetails";
import { Pagination, Card } from "antd";
import { BiSolidEdit } from "react-icons/bi";
import styled from "styled-components";
import ReactCountryFlag from "react-country-flag";

function AddSpecialReport() {
  const router = useRouter();
  const dispatch = useDispatch();
  // const [searchData, setSearchData] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchID, setSearchID] = useState("");
  const [searchRegNo, setSearchRegNo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [vesselStatus, setVesselStatus] = useState('departure')
  const { data, isLoading } = useSelector(
    (state) => state.fetchRegisteredVesselData
  );

  const handleStatusChange = (value) => {
    const status = value;
    console.log(status, value)
    setVesselStatus(status);

    // Call respective API
    if (status === "departure") {
      setFilteredData();
      // setSearchID('');
      // setSearchName('');
      // setSearchRegNo('');
      // fetchLeavingBoats();
    } else if (status === "return") {
      setFilteredData();
      // setSearchID('');
      // setSearchName('');
      // setSearchRegNo('');
      // fetchEnteringBoats(status);
    }
  };

  const fetchEnteringBoats = (status) => {
    const searchData = {vesselStatus: status}
    dispatch(fetchRegisteredVessel(searchData)).then((response) => {
      if (response?.payload) {
        setFilteredData(response.payload);
        setCurrentPage(1); // Reset to first page on new search
        console.log(`Return search performed,`);
      }
    });
  }

  const fetchLeavingBoats = () => {
    dispatch(fetchRegisteredVessel()).then((response) => {
      if (response?.payload) {
        setFilteredData(response.payload);
        setCurrentPage(1); // Reset to first page on new search
        console.log(`Departure search performed,`);
      }
    });
  }

  const handleDetails = (id, payload, status) => {
    localStorage.setItem("vessel", JSON.stringify(payload));
    localStorage.setItem("vessel_status", JSON.stringify(status));
    router.push({
      pathname: `/picketform/${id}`,
    });
  };

  // // Update filtered data and reset pagination when searchData changes
  // Replace inside your component

useEffect(() => {
  const dummyData = [
    {
      rv_key: "1",
      rv_name: "Fisher King",
      rv_regno: "REG123",
      rv_id: "VID001",
      rv_type: "Trawler",
      rv_flag: "Pakistan",
      rv_country_code: "PK",
      rv_province: "Sindh",
      tripDetails: [
        {
          rvt_tripstatus: "ongoing"
        }
      ]
    },
    {
      rv_key: "2",
      rv_name: "Sea Queen",
      rv_regno: "REG456",
      rv_id: "VID002",
      rv_type: "Longliner",
      rv_flag: "Iran",
      rv_country_code: "IR",
      rv_province: "Balochistan",
      tripDetails: [
        {
          rvt_tripstatus: "completed"
        }
      ]
    },
    {
      rv_key: "3",
      rv_name: "Ocean Pearl",
      rv_regno: "REG789",
      rv_id: "VID003",
      rv_type: "Dragger",
      rv_flag: "Oman",
      rv_country_code: "OM",
      rv_province: "Sindh",
      tripDetails: []
    }
  ];

  setFilteredData(dummyData);
  setCurrentPage(1);
}, []);

  // Pagination logic
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData?.slice(startIndex, endIndex);

  return (
    <>
      <PageHeader
        title="Fishing Vessels"
        onRegNoSearchChange={(value) => setSearchRegNo(value)}
        onNameSearchChange={(value) => setSearchName(value)}
        onIDSearchChange={(value) => setSearchID(value)}
        showSearchBox={true} // shows the search bar
        placeholderFirst="Search by Vessel ID"
        placeholderSecond="Search by Reg No"
        placeholderThird="Search by Vessel Name"
        // searchData={searchData}
        searchName = {searchName}
        searchID = {searchID}
        searchRegNo = {searchRegNo}
        setFilteredData={setFilteredData}
        setCurrentPage={setCurrentPage}
        vesselStatus = {vesselStatus}
        handleStatusChange = {handleStatusChange}
      /> 

      <SearchedContent>
      {/* Cards Display */}

        {
          filteredData && filteredData?.length > 0 ? (
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4"
              // style={{ width: "82vw" }}
            >
              {paginatedData.map((record) => {
                const hasTripDetails = record.tripDetails[0]?.rvt_tripstatus==="ongoing" && vesselStatus==="departure";
                const cardStyle = hasTripDetails
                  ? {
                      backgroundColor: "#f5f5f5", // Slight gray
                      // color: "darkgray",
                    }
                  : {};
                const iconColor = hasTripDetails ? "darkgray" : "#012169";

                return (
                  <Card
                    key={record.rv_key}
                    loading={isLoading}
                    className="flex flex-col justify-between"
                    style={{ height: "100%", ...cardStyle }}
                  >
                    <div className="flex justify-between items-center px-4">
                      <div className="flex items-center">
                        <h2 className="text-lg font-bold">{record.rv_name}</h2>
                        {hasTripDetails && (
                          <span className="text-darkgray font-semibold ml-2">
                            (Status: {record.tripDetails[0].rvt_tripstatus})
                          </span>
                        )}
                      </div>
                      <a
                        className="font-semibold"
                        onClick={ hasTripDetails
                          ? undefined // No action if hasTripDetails is true
                          : () =>
                              handleDetails(
                                vesselStatus === "departure"
                                  ? record?.rv_key
                                  : record?.rv_key,
                                record,
                                vesselStatus
                              )
                        }
                        style={{ color: iconColor }}
                      >
                        <BiSolidEdit size={18} />
                      </a>
                    </div>
                    <div className="my-2 space-y-1 px-4">
                      <div
                        className="HEADINGS grid"
                        style={{
                          gridTemplateColumns: "1fr 1fr 1fr 1fr",
                          columnGap: "10px",
                        }}
                      >
                        <span className="font-semibold">Reg No.</span>
                        <span className="font-semibold">Vessel ID</span>
                        <span className="font-semibold">Type</span>
                      </div>
                      <div
                        className="DATA grid"
                        style={{
                          gridTemplateColumns: "1fr 1fr 1fr 1fr",
                          columnGap: "10px",
                        }}
                      >
                        <span>{record.rv_regno || "-"}</span>
                        <span>{record.rv_id || "-"}</span>
                        <span>{record.rv_type || "-"}</span>
                      </div>
                    </div>
                    <div
                      className="flex bg-[#063970]  mt-auto"
                      style={{ borderRadius: "0px 0px 8px 2px" }}
                    >
                      <div className="innerdiv my-2">
                        <span className="font-semibold">Flag:</span>
                        <span className="flex items-center gap-2">
                          <ReactCountryFlag
                            countryCode={record.rv_country_code || ""}
                            svg
                          />
                          {record.rv_flag || "-"}
                        </span>
                        <span className="font-semibold mx-1">|</span>
                        <span className="font-semibold">Province:</span>
                        <span>{record.rv_province || "-"}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
           
            (searchID.length > 0 ||
              searchRegNo.length > 0 ||
              searchName.length > 0) &&
            filteredData?.length < 1 &&
            (
              <div
                className="p-4 text-center"
              >
                NO RECORDS
              </div>
            )
          )
        }

      {/* Pagination */}
      {filteredData?.length > 10 && (
       <PaginationBox>
         <Pagination
          className="mt-4"
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          onChange={(page) => setCurrentPage(page)}
        />
       </PaginationBox>
      )}
      </SearchedContent>
    </>
  );
}

export default AddSpecialReport;

export async function getServerSideProps(context) {
  return {
    props: {
      title: "Picket Data Input Form",
    },
  };
}

const PaginationBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  .ant-pagination-item {
    border-radius: 20px;
    padding: 0px 15px 0px 15px;
    align-items: center;
    display: block;
  }

  .ant-pagination .ant-pagination-item-active {
    font-weight: 600;
    background-color: #ffffff;
    border-color: #1677ff;
  }

  .ant-pagination-prev {
    background-color: midnightblue;
    display: flex;
    align-items: center;
    margin: 0 8px;
    font-size: 16px;
  }

  .ant-pagination-next {
    background-color: midnightblue;
    display: flex;
    align-items: center;
    margin: 0 8px;
    font-size: 16px;
  }
  
  .ant-pagination-item-link button{
    color: white !important;
    cursor: pointer;
  }

  .ant-pagination .ant-pagination-prev .ant-pagination-item-link{
    color: white;
  }
  
  .ant-pagination .ant-pagination-next .ant-pagination-item-link{
    color: white;
  }

`
const SearchedContent = styled.div`
  display: block;
  justify-content: start;
  margin: 0rem 0.5rem;

  .ant-card{
    border-left: 4px solid #063970;
  }

  .ant-card .ant-card-body{
    padding: 16px 0px 0px;
  }

  .ant-card-meta-detail{  
    // border-left-style: solid;
    // border-color: #012169;
  }

  .ant-card-meta-title{
    font-size: 20px;
    color: #012169;
  }

  // .ant-card-meta-description

  .innerdiv{
    display: flex;
    gap: 20px;
    // justify-content: space-between;
    padding: 0 18.5px;
    align-items: center;
    width: 100%;
    color: white;
  }

`