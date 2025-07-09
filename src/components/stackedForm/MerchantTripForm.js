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
import {
  action_list,
  movement_list,
  patrol_type_list,
  port_list,
} from "../../helper/dropdown";
import useFetchOptions from "../../hooks/useFetchOptions";
import DynamicSelectOrInput from "../specialInput/DynamicSelectOrInput";

function MerchantTripForm(props) {
  const { form, disabled } = props;
  const [selectedLpoc, setSelectedLpoc] = useState(null);
  const [selectedNpoc, setSelectedNpoc] = useState(null);

  const commonRules = disabled
    ? []
    : [{ required: true, message: "Required Field!" }];

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
            className="shadow mx-5 my-5  p-5"
            labelCol={{
              flex: "130px",
            }}
          
          >
            <Row className="flex justify-center">
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                {/* <SelectBox
                  disabled={disabled}
                  label="LPOC"
                  placeholder={disabled ? null : "LPOC"}
                  name="msr2_lpoc"
                  options={port_list.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  rules={commonRules}
                /> */}
              <DynamicSelectOrInput
                disabled={disabled}
                label="LPOC"
                form={form}
                name="msr2_lpoc"
                options={portOptions}
                placeholder={disabled ? null : "LPOC"}
                rules={commonRules}
                inputStyle={{ width: "100%"}}
                inputPlaceholder="Enter New Port"
                buttonStyle={buttonStyle}
                setSelectedOpt={setSelectedLpoc}
                selectedOpt={selectedLpoc}
                divStyle= {{position: "relative", display: "flex", width: "100%" }}
              />
                <DateBox
                  label="LPOC Date"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  disabled={disabled}
                  name={disabled ? "datetime" : "msr2_lpocdtg"}
                  rules={[{ required: false }]}
                />
                <SelectBox
                  disabled={disabled}
                  label="Movement"
                  name="msr_movement"
                  placeholder={disabled ? null : "Select"}
                  rules={[{ required: false }]}
                  options={movement_list.map((item) => ({
                    value: item,
                    lable: item,
                  }))}
                />
              </Col>
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                {/* <SelectBox
                  disabled={disabled}
                  label="NPOC"
                  placeholder={disabled ? null : "NPOC"}
                  name="msr2_npoc"
                  options={port_list.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  rules={commonRules}
                /> */}
              <DynamicSelectOrInput
                disabled={disabled}
                label="NPOC"
                form={form}
                name="msr2_npoc"
                options={portOptions}
                placeholder={disabled ? null : "NPOC"}
                rules={commonRules}
                inputStyle={{ width: "100%"}}
                inputPlaceholder="Enter New Port"
                buttonStyle={buttonStyle}
                setSelectedOpt={setSelectedNpoc}
                selectedOpt={selectedNpoc}
                divStyle= {{position: "relative", display: "flex", width: "100%" }}
              />
                <DateBox
                  label="NPOC ETA"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  name={disabled ? "datetime1" : "msr2_npoceta"}
                  rules={[{ required: false }]}
                  disabled={disabled}
                />
              </Col>
            </Row>
          </Form>
        </StyledDiv>
      </div>
    </>
  );
}

export default MerchantTripForm;

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
