import React from "react";
import { RxArrowLeft } from "react-icons/rx";
import { useRouter } from "next/router.js";
import { Button, Col, Dropdown, Input, Row, Tooltip, Segmented } from "antd";
import Heading from "../title/Heading";
import FilledButton from "../button/FilledButton";
import { SearchOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import { FaFileDownload, FaPrint } from "react-icons/fa";
import { VscAdd } from "react-icons/vsc";
import { GrCircleInformation } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { fetchRegisteredVessel } from "../../redux/thunks/registeredVesselData";
import {fetchTripDetailsData} from "../../redux/thunks/tripDetails";
import styled from "styled-components";

function PageHeader(props) {
  const {
    title,
    onNameSearchChange,
    onRegNoSearchChange,
    onIDSearchChange,
    btnTitle,
    onNavigate,
    placeholderFirst,
    placeholderSecond,
    placeholderThird,
    showButton,
    showSearchBox = false,
    localStorage,
    btnTitleMedia,
    currentData,
    componentRef,
    hover,
    apidata,
    searchData,
    searchName,
    searchID,
    searchRegNo,
    setFilteredData,
    setCurrentPage,
    vesselStatus,
    handleStatusChange,
  } = props;
  const router = useRouter();

  const handleBack = () => {
    if (typeof localStorage === "function") {
      localStorage();
    }
    router.back();
  };

  const handleSearch = () => {
    const searchData = {
      searchID: searchID,
      searchRegNo: searchRegNo,
      searchName: searchName,
      vesselStatus: vesselStatus === "return" ? "return" : "",
    };

    if (vesselStatus === "departure") {
      // Call API for departures
      dispatch(fetchRegisteredVessel(searchData)).then((response) => {
        if (response?.payload) {
          setFilteredData(response.payload);
          setCurrentPage(1); // Reset to first page on new search
        }
      });
    } else if (vesselStatus === "return") {
      console.log("vesselStatus", vesselStatus)
      // Call API for returns
      dispatch(fetchRegisteredVessel(searchData)).then((response) => {
        if (response?.payload) {
          setFilteredData(response.payload);
          setCurrentPage(1); // Reset to first page on new search
        }
      });
    }
  };
  
  
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      {apidata?(<Row className="flex items-center mt-5 justify-content-start" >
        <RxArrowLeft
          onClick={handleBack}
          cursor={"pointer"}
          className="ml-5"
          fontSize={25}
        />
        <span
          onClick={handleBack}
          className="text-sm font-medium cursor-pointer"
        >
          Back
        </span>
      </Row>) :("")}
      <Row className=" mt-5">
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={14}
          xl={14}
          xxl={14}
          className="flex justify-start "
        >
          <Tooltip title={hover}>
            <div className="flex items-center">
              <Heading className="ml-5" level={3} text={title} />
              {/* <GrCircleInformation className="ml-1 mb-3" size={13} /> */}
              {hover && <GrCircleInformation className="ml-1 mb-3" size={13} />}
            </div>
          </Tooltip>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={8}
          lg={10}
          xl={10}
          xxl={10}
          className="justify-end items-center"
        >
          <div className=" flex custom-margin-pageheader">

            {currentData && (
              // <CSVLink
              // filename={title + ".csv"}
              // data={currentData ? currentData : []}
              // >
              //   <Button
              //    className="rounded yellow-midnight bg-yellow text-black ml-2 inline-flex items-center custom-css-pageheaderButton"
              //    >
              //     <FaFileDownload />
              //     DOWNLOAD
              //   </Button>
              // </CSVLink>
              <Button className="rounded yellow-midnight bg-yellow text-black   mr-1 inline-flex items-center custom-css-pageheaderButton mb-1">
                <CSVLink
                  filename={title + ".csv"}
                  data={currentData ? currentData : []}
                >
                  <div className="flex items-center gap-x-3">
                    <FaFileDownload />
                    DOWNLOAD
                  </div>
                </CSVLink>
              </Button>
            )}
            {componentRef && (
              <ReactToPrint
                trigger={() => (
                  <Button
                    className="rounded border-darkgray bg-darkgray text-white  mr-1 inline-flex items-center custom-css-pageheaderButton mb-1"
                    onClick={() => {
                      handlePrint(null, () => {
                        componentRef.current;
                      });
                    }}
                  >
                    <div className="flex items-center gap-x-3">
                      <FaPrint />
                      PRINT
                    </div>
                    {/* <FaPrint />
                    PRINT */}
                  </Button>
                )}
                content={() => componentRef.current}
              />
            )}
            {showButton && (
              <>
                <Button
                  onClick={onNavigate}
                  className="rounded border-navyblue bg-navyblue text-white  mr-1 inline-flex items-center "
                  // className="rounded border-lightgreen bg-lightgreen text-white ml-2  custom-css-pageheaderButton"
                >
                  <div className="flex items-center gap-x-3 ">
                    <VscAdd color="white"></VscAdd>
                    {btnTitle ? btnTitle : "Add"}
                  </div>
                  {/* <VscAdd color="white"></VscAdd>
                  {btnTitle ? btnTitle : "Add"} */}
                </Button>
              </>
            )}
            
          </div>
          {/* )} */}
        </Col>
      </Row>
      <Row className="flex justify-center items-center">     
         <Col
          xs={24}
          sm={24}
          md={8}
          lg={24}
          xl={24}
          xxl={24}
          className="justify-end items-center"
        >
          <InputFieldsBox className=" flex custom-margin-pageheader">
            {showSearchBox && (
              <>
              {
                vesselStatus && (
                <div className="btn-input status-box">
                  <div className="label-box">
                    <p className="font-medium">Select Boat Status:</p>
                  </div>
                  <Segmented
                      options={[
                        { label: 'Departure', value: 'departure',},
                        { label: 'Return', value: 'return',},
                      ]}
                      onChange={handleStatusChange}
                      value={vesselStatus}
                      defaultValue={vesselStatus}
                      // style={{
                      //   marginBottom: 24,
                      // }}
                    />
                </div>)
              }
              {[
                { placeholder: placeholderFirst, value: searchID, onChange: onIDSearchChange, searchField: "Vessel ID" },
                { placeholder: placeholderSecond, value: searchRegNo, onChange: onRegNoSearchChange, searchField: "Reg No" },
                { placeholder: placeholderThird, value: searchName, onChange: onNameSearchChange, searchField: "Vessel Name" },
              ].map(({ placeholder, value, onChange, searchField }) => (
                <div key={searchField} className="flex items-center input-box">
                  <div className="label-box">
                    <p className="font-medium">Search by {searchField}:</p>
                  </div>
                  <Input
                    size="xl:medium lg:medium md:medium sm:small"
                    allowClear
                    prefix={<SearchOutlined />}
                    className="search-input custom-css-pageheaderSearch input-field-box"
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    // style={{ width: "210px" }}
                  />
                </div>
              ))}
              <div className="btn-input button-box">
                {console.log(searchName || searchID || searchRegNo)}
                <Button
                  onClick={() => handleSearch()}
                  disabled={(searchName || searchID || searchRegNo) ? false : true}
                  className=" rounded border-navyblue bg-navyblue text-white  mr-1 inline-flex items-center "
                >                  
                  <div className="flex items-center gap-x-3 ">
                    {btnTitle ? btnTitle : "Submit"}
                  </div>
                </Button>
                </div>
            </>
            )}
          </InputFieldsBox>
          {/* )} */}
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default PageHeader;

const InputFieldsBox = styled.div`
  padding: 0.5rem 1.6rem;
  border-radius: 20px;
  border-color: lightgray;

  
  .ant-segmented{
    display: inline-flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    transition: border 0.2s, box-shadow 0.2s;
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px !important;
    padding: 0px 0px 0px;
    background-color: #fff
  }
  .ant-segmented-group{
    // gap: 0.2rem;
  }
  .ant-segmented-item{
    padding: 0px 0px 1px;
  }
  .ant-segmented-item:hover{
    background-color: lightgray;
    font-weight: 600;
  }
  .ant-segmented .ant-segmented-item-selected {
    //  #4096ff;
    background-color: rgba(6,57,112,0.9);
    color: rgba(255, 255, 255, 0.88);
    font-weight: 700;
  }
  .ant-segmented .ant-segmented-item-label {
    padding: 3px 8px 0px;
    line-height: 20px;
  }

  .btn-input{
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  .label-box{
    margin-right: 1rem;
    margin-bottom: 0rem;
  }

  .input-field-box{
    margin-right: 1rem;
    width: 210px;
  }

   @media (max-width: 1024px) and (min-width: 768px) {
    display: flex;
    // flex-wrap: wrap;
    justify-content: center;
    gap: 0.7rem;
    padding: 0.5rem 1.4rem;
    align-items: flex-end;

    .status-box,
    .input-box,
    .button-box {
      // flex: 1 1 100%; /* Make each element take full width */
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      // margin-bottom: 1rem;
    }

    .input-box input {
      width: 100%; /* Input field spans full width */
      font-size: 13px;
    }

    .button-box button {
      width: auto; /* Keep button size dynamic */
    }

    .ant-segmented {
      font-size: 13px !important;
    }

    .ant-segmented-item {
      font-size: 13px;
      padding: 2px;
    }

    .ant-segmented .ant-segmented-item-label {
      padding: 2px 4px 0px;
      line-height: 18px;
    }

    .ant-input-affix-wrapper {
      padding: 5px 11px;
    }

    p {
      font-size: 13px;
    }

    .btn-input{
      display: flex;
      align-items: flex-start;
      margin-right: 0px;
    }

    .label-box{
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .input-field-box{
      margin-right: 0rem;
      width: 160px;
    }
  }

  @media (max-width: 768px) and (min-width: 425px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem 0.8rem;

    .input-box,
    .button-box,
    .status-box {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .input-box input,
    .button-box button {
      width: 100%;
    }

    .ant-segmented {
      font-size: 12px !important;
    }

    .ant-segmented-item {
      font-size: 12px;
      padding: 4px;
    }

    p {
      font-size: 14px;
    }

    .btn-input{
      display: flex;
      align-items: center;
      margin-right: 0px;
    }
  }

   @media (max-width: 425px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem 0.8rem;

    .input-box,
    .button-box,
    .status-box {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .input-box input,
    .button-box button {
      width: 100%;
    }

    .ant-segmented {
      font-size: 12px !important;
    }

    .ant-segmented-item {
      font-size: 12px;
      padding: 4px;
    }

    p {
      font-size: 12px;
      // font-family: Arial, sans-serif;
    }

    .btn-input{
      display: flex;
      align-items: center;
      margin-right: 0px;
    }
  }
`;