import { Col, Row, Form, Upload, Select, Button, Modal, Image, Input } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import SelectBox from "../form/SelectBox";
import { port_authorities_list } from "../helper/dropdown.js";
import countryList from "country-list";
import FilledButton from "../button/FilledButton";

function PortAuthorityForm(props) {
  const { vesselForm, disabled, fixedDisabled, portAuthority, setPortAuthority } = props;
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
  
    const handlePortAuthorityChange = (e) => {
    console.log(e)
    setPortAuthority(e);
  }

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
          
          // style={{ float: "left", position: "relative",}}
        >
          <Row className="flex">
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>           
              <SelectBox
                style={{ marginLeft: "1.5rem", width: 300 }}
                placeholder="Select port"
                name="m_portauthority"
                label= "Port Authority"
                options={port_authorities_list?.map((item) => ({
                  value: item,
                  label: item,
                }))}
                defaultValue={"KPT"}
                view={portAuthority}
                onChange={handlePortAuthorityChange}
                rules={[
                  { required: true, message: "Please select a port!" },
                ]}
              />
            </Col>
          </Row>
        </Form>
        
      </StyledDiv>
    </div>
  );
}

export default PortAuthorityForm;
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