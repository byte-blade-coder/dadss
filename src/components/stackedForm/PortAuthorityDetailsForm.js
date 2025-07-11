import { Col, Row, Form, Upload, Select, Button, Modal, Image, Input } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import {
  ais_type_summary,
  country_list,
  port_list,
  type_list,
} from "../../helper/dropdown";
import countryList from "country-list";
import FilledButton from "../button/FilledButton";

function PortAuthorityDetailsForm(props) {
  const { vesselForm, disabled, handleSubmit, fixedDisabled, status } = props;
  // State to manage the selected flag
  const [countryName, setCountryName] = useState("");

  // Generate country options for the flag select box
  const countryOptions = countryList.getNames().map((country) => {
    const countryCode = countryList.getCode(country);
    const label = `${country} (${countryCode})`;
    return {
      label,
      value: country, // Set the short country code as the value
    };
  });
  const booleanOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];
  const commonRules = disabled
    ? []
    : [
        
      ]; //{
      //   required: true,
      //   message: "Required Field!",
      // },
    // useEffect(() => {
    //   vesselForm.setFieldsValue({ rv_images: [] });
    // }, [vesselForm]);

  return (
    <div className="mb-10">
      <StyledDiv>
        <Form
          form={vesselForm}
          disabled={disabled}
          layout="horizontal"
          className="shadow mx-5 my-5 p-5"
          labelCol={{
            flex: "130px",
          }}
        >
          <Row className="flex justify-center">
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>           
              <InputBox
                label="Vessel Name"
                name="m_name"
                className="input"
                placeholder={fixedDisabled ? null : "The Mayflower"}
                minLength={3}
                maxLength={15}
                rules={commonRules}
              />
              <SelectBox
                disabled={disabled}
                showSearch
                label="Flag"
                name="m_flag"
                className="input"
                placeholder={fixedDisabled ? null : "Pakistan (PK)"}
                value="Pakistan (PK)"
                onChange={(value) => setCountryName(value)}
                options={countryOptions}
                rules={commonRules}
              />
              <SelectBox
                disabled={disabled}
                label="Vessel Type"
                name="m_type"
                className="input"
                placeholder={fixedDisabled ? null : "Select Type"}
                options={type_list.map((item) => ({
                  value: item,
                  label: item,
                }))}
                rules={commonRules}
              />
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11} className="ml-2 mr-2">
            
              <DateBox
                label={status==="Departed" ? "Unberth Time" : status==="anchored" ? "Time of Arrival" : "Berthed Time"}
                showTime
                style={{ width: "100%" }}
                format="DD-MM-YYYY HH:mm:ss"
                disabled={disabled}
                name={"m_datetime"}
                rules={commonRules}
              />
              <InputBox
                label={status==="anchored" ? "Distance from MPT" : "Location/Number of Berth"}
                className="input"
                placeholder={fixedDisabled ? null : "to be provided"}
                name={status==="anchored" ? "m_distance_from_mpt" : "m_location"}
                // maxLength={12}
                // minLength={6}
                rules={[
                  ...commonRules
                  // m_movement
                  // {
                  //   pattern: /^[0-9]+$/,
                  //   message: "ID Number can only contain numbers.",
                  // },
                  // {
                  //   min: 6,
                  //   message: "User ID must be at least 6 characters long.",
                  // },
                  // {
                  //   max: 12,
                  //   message: "User ID cannot be more than 12 characters long.",
                  // },
                ]}
              />

            </Col>
            
          </Row>
        </Form>
        
      </StyledDiv>
    </div>
  );
}

export default PortAuthorityDetailsForm;
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
  .ant-form-item .ant-form-item-label {
  overflow: visible;
`;