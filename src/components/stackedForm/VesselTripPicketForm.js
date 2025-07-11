import { useState } from "react";
import { Col, Row, Form, Modal } from "antd";
import Heading from "../title/Heading";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import dayjs from "dayjs";
import InputBox from "../form/InputBox";
import DateBox from "../form/DateBox";


function VesselTripPicketForm(props) {
  const { form, disabled, vesselStatus } = props;

  const commonRules = disabled
    ? []
    : []; //{ required: true, message: "Required Field!" }

  return (
    <>
      <div>
        <Heading
          className=" whitespace-nowrap ml-5 flex justify-start "
          level={4}
          text="Trip Details"
        />
      </div>
      <div className="mb-10">
        <StyledDiv>
          <Form
            form={form}
            // layout="vertical"
            // className="shadow mx-5 px-3 py-5 bg-white"
            disabled={disabled}
            layout="horizontal"
            className="shadow mx-5 my-5 p-5"
            labelCol={{
              flex: "130px",
            }}
          >
            <Row className="flex justify-center">
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>  
                <DateBox
                  label="Departure Date"
                  showTime
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY HH:mm:ss"
                  disabled={vesselStatus==="return" ? true : disabled}
                  name={disabled? "datetime" : "rvt_depdate"}
                  // name={vesselStatus==="return" ? "datetime" : "rvt_depdate"}
                  rules={commonRules}
                />
                <DateBox
                  label="Return Date"
                  showTime
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY HH:mm:ss"
                  disabled={vesselStatus==="departure" ? true : disabled}
                  name={disabled ? "datetime1" : "rvt_arrivaldate"}
                  rules={commonRules}
                />
              </Col>
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                <DateBox
                  label="PC Issue Date"
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  name={disabled ? "datetime2" : "rvt_pcissuedate"}
                  rules={commonRules}
                  disabled={vesselStatus==="return" ? true : disabled}
                />
                <InputBox
                  label="PC Days"
                  placeholder={disabled ? null : "Days"}
                  name={"rvt_pcdays"}
                  type="number"
                  rules={commonRules}
                  disabled={vesselStatus==="return" ? true : disabled}
                />
              </Col>
            </Row>
          </Form>
        </StyledDiv>
      </div>
    </>
  );
}

export default VesselTripPicketForm;

const StyledDiv = styled.div`
  .custom.ant-form-item-label {
    margin-top: -15px !important;
    display: flex;
    align-items: center;
  }
  .ant-row .ant-form-item-row {
    margin-right: 25px;
    margin-bottom: 20px;
  }
  .ant-form-item-label {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
  }
  .ant-form-item .ant-form-item-label > label::after {
    content: "";
  }
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

// Styled component for custom styling
const StyledInput = styled.div`
  //   .ant-form-item-explain-error {
  //     font-size: 12px;
  //   }
  .ant-row .ant-form-item-row {
    margin-right: 10px;
  }
`;
const IconsStylingWrap = styled.div`
  display: flex;
  /* gap: 20px; */
  .editIcon {
    color: #28387e;
    background-color: #f0f3f8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .deleteIcon {
    color: #e96162;
    background-color: #f9e7e8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    cursor: pointer;
  }
`;
