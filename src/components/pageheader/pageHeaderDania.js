import React, { useEffect, useState } from "react";
import { RxArrowLeft } from "react-icons/rx";
import { useRouter } from "next/router.js";
import { Button, Checkbox, Col, Dropdown, Input, Menu, Modal, Row } from "antd";
import Heading from "../title/Heading";
import FilledButton from "../button/FilledButton";
import { SearchOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import { GiFishingBoat } from "react-icons/gi";
import { IoIosAdd } from "react-icons/io";
import { FaFileDownload, FaPrint } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { SettingOutlined } from "@ant-design/icons";
import styled from "styled-components";

const StyledCheckbox = styled.div`
  // .ant-checkbox .ant-checkbox-inner {
  //   width: 25px;
  //   height: 25px;
  //   background-color: red;
  //   border-color: red;
  // }

  // .ant-checkbox-disabled .ant-checkbox-inner {
  //   width: 25px;
  //   height: 25px;
  //   background-color: gray;
  //   border-color: gray;
  // }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #549e97;
    border-color: black;
  }
`;
function PageHeaderDania(props) {
  const {
    title,
    onSearchChange,
    btnTitle,
    onNavigate,
    placeholder,
    showButton,
    showSearchBox = true,
    localStorage,
    btnTitleMedia,
    currentData,
    componentRef,
    showDots = true,
    checkedList,
    handleCheckboxChange,
    options,
  } = props;
  const router = useRouter();

  const handleBack = () => {
    if (typeof localStorage === "function") {
      localStorage();
    }
    router.back();
  };
  const handleMenuClick = (e) => {
    console.log("Menu item clicked:", e.key);
    // Implement actions based on menu item click
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Option 1</Menu.Item>
      <Menu.Item key="2">Option 2</Menu.Item>
      <Menu.Item key="3">Option 3</Menu.Item>
    </Menu>
  );

  const [current, setCurrent] = useState("SubMenu");
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  //  const menus = (
  //    <Menu onClick={handleMenuClick}>
  //      <Menu.Item style={{ display: "block" }}>
  //        <StyledCheckbox>
  //          <Checkbox.Group
  //            value={checkedList}
  //            options={options}
  //            onChange={handleCheckboxChange}
  //          />
  //        </StyledCheckbox>
  //      </Menu.Item>
  //    </Menu>
  //  );

  const menus = (
    <Menu onClick={handleMenuClick}>
      {options.map((option) => (
        <Menu.Item key={option.value} style={{ display: "block" }}>
          <StyledCheckbox>
            <Checkbox
              value={option.value}
              checked={checkedList.includes(option.value)}
              onChange={(e) =>
                handleCheckboxChange(
                  e.target.checked
                    ? [...checkedList, option.value]
                    : checkedList.filter((item) => item !== option.value)
                )
              }
            >
              {option.label}
            </Checkbox>
          </StyledCheckbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <React.Fragment>
      <Row className="flex items-center mt-5">
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
      </Row>
      <Row className="flex flex-wrap mt-5">
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={14}
          xl={12}
          xxl={12}
          className="flex justify-start "
        >
          <Heading className="  ml-5" level={4} text={title} />
        </Col>
        <Col xs={24} sm={24} md={10} lg={10} xl={12} xxl={12}>
          {showSearchBox && (
            <div className="flex justify-end mr-5">
              {/* <Input
                size="large"
                allowClear
                prefix={<SearchOutlined />}
                className="search-input custom-css-pageheaderSearch"
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
              /> */}
              {currentData && (
                // <Button className="rounded-full border-midnight bg-midnight text-white ml-2 custom-css-pageheaderButton">
                <Button className="rounded yellow-midnight bg-yellow text-black ml-2 inline-flex items-center custom-css-pageheaderButton">
                  <FaFileDownload />
                  <CSVLink
                    filename={title + ".csv"}
                    data={currentData ? currentData : []}
                  >
                    DOWNLOAD
                  </CSVLink>
                </Button>
              )}
              {componentRef && (
                <ReactToPrint
                  trigger={() => (
                    <Button
                      className="rounded border-darkgray bg-darkgray text-white ml-2 inline-flex items-center custom-css-pageheaderButton"
                      onClick={() => {
                        handlePrint(null, () => {
                          componentRef.current;
                        });
                      }}
                    >
                      <FaPrint />
                      PRINT
                    </Button>
                  )}
                  content={() => componentRef.current}
                />
              )}
              {showButton && (
                <>
                  <Button
                    onClick={onNavigate}
                    className="rounded border-navyblue bg-navyblue text-white ml-2 inline-flex items-center"
                  >
                    <IoIosAdd color="white" size={25}></IoIosAdd>
                    Add
                  </Button>
                  <FilledButton
                    text={btnTitleMedia}
                    className="rounded-full border-midnight bg-midnight text-white ml-2 custom-css-pageheaderButtonMedia"
                    onClick={onNavigate}
                  />
                </>
              )}

              {showDots && (
                <Dropdown
                  overlay={menus}
                  trigger={["click"]} // Use the custom component as overlay
                >
                  <Button className="rounded border-navyblue bg-navyblue text-white ml-2 inline-flex items-center">
                    <SettingOutlined color="white" size={25} />
                    Settings
                  </Button>
                </Dropdown>
              )}
            </div>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default PageHeaderDania;
