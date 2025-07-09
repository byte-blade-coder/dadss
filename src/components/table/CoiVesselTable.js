import { Col, Row, Form, Select } from "antd";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import {
  ais_type_summary,
  country_list,
  port_list,
  type_list,
  coi_type_list,
} from "../../helper/dropdown";
import countryList from "country-list";
import FilledButton from "../button/FilledButton";

function CoiVesselTable(props) {
  const { vesselForm, disabled, handleSubmit, fixedDisabled,coireport,onTypeChange } = props;
  const [blacklisted, setBlacklisted] = useState(false);

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

  const [selectedType, setSelectedType] = useState(null);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    // Call the callback function passed from Details component
    onTypeChange(value);
  };

  const commonRules = disabled
  ? []
  : [{ required: true, message: "Required Field!" }];

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
                name="ssr_boat_name"
                className="input"
                placeholder={fixedDisabled ? null : "The Mayflower"}
                minLength={3}
                maxLength={15}
                rules={[
                    ...commonRules,
                  ]}
                // rules={[
                //   {
                //     required: true,
                //     message: "Required Field!",
                //   }]}
              />
              <SelectBox
                disabled={disabled}
                showSearch
                label="Country"
                name="ssr_country"
                className="input"
                placeholder={fixedDisabled ? null : "Pakistan (PK)"}
                value="Pakistan (PK)"
                onChange={(value) => setCountryName(value)}
                options={countryOptions}
                //rules={commonRules}
              />
              <SelectBox
                disabled={disabled}
                label="Type"
                name="ssr_boat_type"
                className="input"
                placeholder={fixedDisabled ? null : "Select Type"}
                options={coi_type_list.map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={selectedType}
                onChange={handleTypeChange}
                rules={[
                    ...commonRules,
                  ]}
              />
              <InputBox
                label="Length (meters)"
                name="ssr_boat_length"
                className="input"
                placeholder={fixedDisabled ? null : "Enter length"}
                minLength={3}
                maxLength={15}
                rules={[
                  {
                    pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message: "Please enter a valid length in meters",
                  },
                ]}
              />
              <SelectBox
                disabled={disabled}
                label="Blacklisted"
                placeholder={fixedDisabled ? null : "Blacklisted"}
                className="input"
                name="ssr_legal"
                //rules={commonRules}
                options={booleanOptions}
                onChange={(value) => setBlacklisted(value)}

              />
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11} className="ml-2 mr-2">
              <InputBox
                label="Vessel ID"
                className="input"
                placeholder={fixedDisabled ? null : "to be provided"}
                name="ssr_boat_id"
                minLength={6}
                maxLength={12}
                pattern="/^[0-9]+$/"
                // rules={[
                //   ...commonRules,
                // ]}
              />
              <InputBox
                label="Reg Number"
                name="ssr_boat_regno"
                placeholder={fixedDisabled ? null : "Enter"}
                className="input"
                minLength={3}
                maxLength={15}
                pattern="/^[a-zA-Z0-9]+$/"
                rules={[
                 // ...commonRules,
                  {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message: "Please enter a valid registration number",
                  },
                ]}
              />
              <InputBox
                label="Province"
                name="ssr_village"
                className="input"
                placeholder={fixedDisabled ? null : "Enter Province"}
              />
              <InputBox
                label="Breath (meters)"
                name="ssr_boat_breadth"
                className="input"
                placeholder={fixedDisabled ? null : "Enter breadth"}
                minLength={3}
                maxLength={15}
                rules={[
                  {
                    pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message: "Please enter a valid breath in meters",
                  },
                ]}
              />
              {blacklisted === true && (
                <InputBox
                  label="Remarks"
                  name="ssr_remarks"
                  className="input"
                  placeholder={fixedDisabled ? null : "Enter Remarks"}
                />
              )}
            </Col>
          </Row>
        </Form>
        
      </StyledDiv>
    </div>
  );
}

export default CoiVesselTable;
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

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
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
