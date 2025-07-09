import React from "react";
import { RxArrowLeft } from "react-icons/rx";
import { useRouter } from "next/router.js";
import { Button, Col, Dropdown, Input, Row, Tooltip, DatePicker } from "antd";
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
function PageHeaderIndex(props) {
  const {
    title,
    onSearchChange,
    btnTitle,
    onNavigate,
    placeholder,
    showButton,
    showSearchBox = true,
    searchBox = false,  
    showDatePicker = false,
    localStorage,
    btnTitleMedia,
    currentData,
    componentRef,
    hover,
    selectedMonth,
    handleMonthChange,
    customChildComponent,
    reportView,
    dateRange,
    wordRef
  } = props;
  const router = useRouter();
  // console.log("props:", props)
  // console.log("selectedMonth HEader:", selectedMonth)
  return (
    <React.Fragment>
      <Row className="flex -mt-1 w-full" >
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={14}
          xl={14}
          xxl={14}
          className="flex justify-start"
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
          className="  custome-pageheader-media-column-css  "
        >
          {/* {showSearchBox && ( */}
          <div className=" flex custom-margin-pageheader ml-5 mr-5  ">
            {showDatePicker && (
              <DatePicker
                picker="month"
                onChange={props.handleMonthChange}
                format={props.format}
                defaultValue={props.selectedMonth}
                className="mr-1 mb-1"
              />
            )}
            {customChildComponent && (
              customChildComponent
            )}
            {currentData && (
              <>
                {
                  reportView==="chart" ? (
                    <Button onClick={() => exportAsImage(componentRef.current, title, dateRange)}
                      className="rounded yellow-midnight bg-yellow text-black mr-1 inline-flex items-center custom-css-pageheaderButton mb-1">
                      <div className="flex items-center gap-x-3">
                        <FaFileDownload />
                        Save as Image
                      </div>
                    </Button>
                  ) : (
                    <>                  
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
                    </>
                  )
                }
              </>
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
          </div>
          {/* )} */}
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default PageHeaderIndex;
