import React from "react";
import { RxArrowLeft } from "react-icons/rx";
import { useRouter } from "next/router.js";
import { Button, Col, Dropdown, Input, Row, Tooltip } from "antd";
import Heading from "../title/Heading";
import FilledButton from "../button/FilledButton";
import { SearchOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import { GiFishingBoat } from "react-icons/gi";
import { IoIosAdd } from "react-icons/io";
import { FaFileDownload, FaPrint } from "react-icons/fa";
import { VscAdd } from "react-icons/vsc";
import { GrCircleInformation } from "react-icons/gr";
// VIS styled page header
function PageHeaderStyled(props) {
  const {
    title,
    onSearchChange,
    btnTitle,
    onNavigate,
    placeholder,
    showButton,
    showSearchBox = true,
    searchBox = false,
    localStorage,
    btnTitleMedia,
    currentData,
    componentRef,
    hover,
    apidata,
    customChildComponent
  } = props;
  const router = useRouter();

  const handleBack = () => {
    if (typeof localStorage === "function") {
      localStorage();
    }
    router.back();
  };

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
              {hover && <GrCircleInformation className="ml-1 mb-1" size={13} />}
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
          className="  custome-pageheader-media-column-css  "
        >
          {/* {showSearchBox && ( */}
          <div className=" flex custom-margin-pageheader ml-5 mr-5  ">
            {searchBox && (
              <Input
                size="medium"
                allowClear
                prefix={<SearchOutlined />}
                className="search-input custom-css-pageheaderSearch mb-2 mr-1 "
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
              />
            )}
            {customChildComponent && (
              customChildComponent
            )}
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
              <Button className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mb-1">
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
                    className="rounded border-darkgray bg-darkgray text-white mr-1 inline-flex items-center custom-css-pageheaderButton mb-1"
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
    </React.Fragment>
  );
}

export default PageHeaderStyled;
