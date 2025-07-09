import React, {useState, useRef} from "react";
import { useRouter } from "next/router";
import { Button, Col, Input, Row, Tooltip, DatePicker, Modal, Radio, Space } from "antd";
import exportAsImage from "../../utils/exportAsImg"
import { CSVLink } from "react-csv";
import { ExclamationCircleFilled } from '@ant-design/icons';
import ReactToPrint from "react-to-print";
import { FaFileDownload, FaPrint } from "react-icons/fa";
import { GrCircleInformation } from "react-icons/gr";
const { confirm } = Modal;

function PageHeaderIndex({
    title,
    showSearchBox = true,
    searchBox = false,  
    showDatePicker = false,
    currentData,
    newData,
    columns,
    componentRef,
    reportView,
    dateRange,
    wordRef}) {

  const router = useRouter();
  console.log("props:", currentData, columns, wordRef, componentRef)
  // console.log("props:", currentData, componentRef?.current?.children)
  // console.log("selectedMonth HEader:", selectedMonth)

  const [value, setValue] = useState(null);
  const valueRef = useRef(null);

  return (
    <>
      <Row className="flex w-full" >
        <Col
          xs={24}
          sm={24}
          md={8}
          lg={10}
          xl={10}
          xxl={10}
          className="flex"
        >
          {/* {showSearchBox && ( */}
          <div className=" flex custom-margin-pageheader mt-[1.4rem]">
            {/* {showDatePicker && (
              <DatePicker
                picker="month"
                onChange={props.handleMonthChange}
                format={props.format}
                defaultValue={props.selectedMonth}
                className="mr-1 mb-1"
              />
            )} */}
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
             {/* <Button onClick={exportPDF} type="primary" style={{ marginTop: 16 }}>
              Export to PDF
            </Button> */}
            {componentRef && (
              <ReactToPrint
                trigger={() => (
                  <Button
                    className="rounded border-darkgray bg-darkgray text-white  mr-1 inline-flex items-center custom-css-pageheaderButton mb-1"
                    onClick={() => {
                      //handlePrint(null,
                      handlePrint(null, () => {
                        componentRef.current;
                      });
                    }}
                  >
                    <div className="flex items-center gap-x-3">
                      <FaPrint />
                      PRINT
                    </div>
                  </Button>
                )}
                content={() => componentRef.current}
              />
            )}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default PageHeaderIndex;
