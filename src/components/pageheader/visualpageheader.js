import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import moment from "moment";
import { BsArrowLeft } from "react-icons/bs";
import dayjs from "dayjs";
import { harbor_list } from "../../helper/dropdown";
import { RxArrowLeft } from "react-icons/rx";
import { useRouter } from "next/router.js";

const { RangePicker } = DatePicker;


function Visualpageheader(props) {
  const { setDateRange, dateRange, showButton} = props
  const router = useRouter();
  const handleBack = () => {
    router.back();

  };
  return (
    <React.Fragment>
      <Row className="flex items-center ">
        <RxArrowLeft
          onClick={handleBack}
          cursor={"pointer"}
          fontSize={25}
          style={{margin:"1.25rem 0 0 1.25rem"}}
        />
        <span
          onClick={handleBack}
          className="text-sm font-medium cursor-pointer"
          style={{marginTop:"1.25rem"}}
        >
          Back
        </span>
      </Row>
    </React.Fragment>
  );
}

export default Visualpageheader;
