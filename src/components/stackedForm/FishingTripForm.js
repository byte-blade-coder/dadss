import { useState } from "react";
import { Col, Row, Form, Modal } from "antd";
import Heading from "../title/Heading";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import dayjs from "dayjs";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import DateBox from "../form/DateBox";
import PositionBox from "../form/PositionBox";
import DynamicSelectOrInput from "../specialInput/DynamicSelectOrInput";
import {
  action_list,
  movement_list,
  movement_list_coi,
  patrol_type_list,
  port_list,
} from "../../helper/dropdown";
import useFetchOptions from "../../hooks/useFetchOptions"; 

function FishingTripForm(props) {
  const { form, disabled, coireport } = props;

  const [selectedDepJetty, setSelectedDepJetty] = useState(null);
  const commonRules = disabled
    ? []
    : []; //{ required: true, message: "Required Field!" }
   const portOptions = useFetchOptions("ports", "p_name", "p_name");

  const buttonStyle = {
    position: "absolute",
    right: 19,
    top: -5,
    border: "none",
    background: "none",
    color: "blue",
    cursor: "pointer",
    fontSize: 20,
    fontWeight: "bold",
  };

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
                <DynamicSelectOrInput
                  form={form}
                  label="Departure"
                  name={ coireport ? "ssr_dep_jetty" : "sr_depjetty"}
                  options={portOptions}
                  placeholder={disabled ? null : "Select Source"}
                  inputPlaceholder="Enter New Port"
                  rules={coireport ? null : commonRules}
                  buttonStyle={buttonStyle}
                  selectedOpt={selectedDepJetty}
                  setSelectedOpt={setSelectedDepJetty}
                  disabled={disabled} 
                  style={{ width: "100%"}}
                  inputStyle={{ width: "100%"}}
                  divStyle= {{position: "relative", display: "flex", width: "100%" }}
                />
                {/* <SelectBox
                  disabled={disabled}
                  label="Departure"
                  placeholder={disabled ? null : "Source"}
                  name={ coireport ? "ssr_dep_jetty" : "sr_depjetty"}
                  // options={port_list.map((item) => ({
                  //   value: item,
                  //   label: item,
                  // }))}
                  options={portOptions}
                  rules={coireport ? null : commonRules}
                /> */}
                {coireport ? (
                  <DateBox
                    label="Departure Date"
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    disabled={disabled}
                    name={disabled ? "datetime" : "ssr_dep_date"}
                    rules={coireport ? null : commonRules}
                  />
                ) : (
                  <DateBox
                    label="Departure Date"
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    disabled={disabled}
                    name={disabled ? "datetime" : "sr_depdt"}
                    rules={coireport ? null : commonRules}
                  />
                )}
                {coireport ? (
                  <SelectBox
                    disabled={disabled}
                    label="Movement"
                    name="ssr_speed"
                    placeholder={disabled ? null : "Select"}
                    rules={coireport ? null : commonRules}
                    options={movement_list_coi.map((item) => ({
                      value: item,
                      lable: item,
                    }))}
                />
                ) : (
                  <SelectBox
                    disabled={disabled}
                    label="Movement"
                    name="sr_movement"
                    placeholder={disabled ? null : "Select"}
                    rules={coireport ? null : commonRules}
                    options={movement_list.map((item) => ({
                      value: item,
                      lable: item,
                    }))}
                  />
                )}
              </Col>
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                <InputBox
                  label="PC"
                  placeholder={disabled ? null : "PC"}
                  name={coireport ? "ssr_pc_issue_place": "sr_pc"}
                  rules={coireport ? null : commonRules}
                />
                <InputBox
                  label="PC Days"
                  placeholder={disabled ? null : "Days"}
                  name={coireport ? "ssr_pc_days": "sr_pcdays"}
                  type="number"
                  rules={coireport ? null : commonRules}
                />
                {coireport ? (
                  <DateBox
                  label="PC Issue Date"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  name={disabled ? "datetime1" : "ssr_pc_issue_date"}
                  rules={coireport ? null : commonRules}
                  disabled={disabled}
                />
                ) : (
                  <DateBox
                    label="PC Issue Date"
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    name={disabled ? "datetime1" : "sr_pcissuedt"}
                    rules={coireport ? null : commonRules}
                    disabled={disabled}
                  />
                )}
              </Col>
            </Row>
          </Form>
        </StyledDiv>
      </div>
    </>
  );
}

export default FishingTripForm;

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
