import { Col, Row, Form, Select } from "antd";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { ais_type_summary, port_list } from "../../helper/dropdown";
import countryList from "country-list";
import FilledButton from "../button/FilledButton";

function ShipDataTable(props) {
  const { shipDataForm, disabled, handleSubmit, fixedDisabled } = props;

  // State to manage the selected flag
  const [flag, setFlag] = useState("Pakistan");
  const [countryName, setCountryName] = useState("");

  // Generate country options for the flag select box
  const countryOptions = countryList.getNames().map((country) => {
    const countryCode = countryList.getCode(country);
    const label = `${country} (${countryCode})`;
    return {
      label,
      value: countryCode, // Set the short country code as the value
    };
  });
  // Handle flag (country) change
  const handleCountryChange = (value) => {
    setCountryName(value);
  };

  const commonRules = [
    {
      required: true,
      message: "Required Field!",
    },
  ];
  const refactoredRules = [
    {
      pattern: /^[a-zA-Z0-9\s]+$/,
      message: "Please enter a valid value",
    },
  ];
  const booleanOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  return (
    <div className="mb-10">
      <StyledDiv>
        <Form
          form={shipDataForm}
          // layout="vertical"
          // className="shadow mx-5 px-3 pt-5 pb-3 bg-white"
          disabled={disabled}
          layout="horizontal"
          className="shadow mx-5 my-5 pt-10 pb-5"
          labelCol={{
            flex: "130px",
          }}
          labelAlign="left"
          labelWrap
          wrapperCol={{
            flex: 1,
          }}
        >
          <Row className="flex justify-center">
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <InputBox
                label="IMO"
                placeholder={fixedDisabled ? null : "12346789"}
                name="mv_imo"
                className="input"
                rules={commonRules}
                disabled={fixedDisabled}
              />
              <InputBox
                label="Ship Name"
                name="mv_ship_name"
                className="input"
                placeholder={fixedDisabled ? null : "The Mayflower"}
                minLength={3}
                maxLength={15}
                rules={commonRules}
                disabled={fixedDisabled}
              />
              <SelectBox
                disabled={disabled}
                showSearch
                label="Flag"
                name="mv_flag"
                className="input"
                placeholder={fixedDisabled ? null : "Pakistan (PK)"}
                value={flag}
                onChange={handleCountryChange}
                options={countryOptions}
                rules={commonRules}
              />
              <SelectBox
                disabled={disabled}
                label="Vessel Type"
                name="mv_ais_type_summary"
                className="input"
                placeholder={fixedDisabled ? null : "Select Type"}
                rules={commonRules}
                options={ais_type_summary.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
              <SelectBox
                disabled={disabled}
                label="LPOC"
                name="sb_lpoc"
                className="input"
                placeholder={fixedDisabled ? null : "Select"}
                options={port_list.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
              <InputBox
                label="Master"
                name="sb_mast_name"
                className="input"
                placeholder={fixedDisabled ? null : "Master Name"}
                rules={refactoredRules}
              />
              <InputBox
                label="Master Nationality"
                name="sb_mast_nationality"
                className="input"
                placeholder={fixedDisabled ? null : "Pakistani"}
              />
              <InputBox
                label="Buyer Co.Name"
                name="sb_buyer_comp_name"
                className="input"
                placeholder={fixedDisabled ? null : "Company name"}
                rules={refactoredRules}
              />
              <InputBox
                label="Buyer Co.Cell"
                name="sb_buyer_comp_num"
                className="input"
                placeholder={fixedDisabled ? null : "0334-2525356"}
                minLength={13}
                maxLength={15}
                pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
                rules={[
                  {
                    pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                    message: "Please enter a valid mobile number!",
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: "Please enter a valid 11-digit mobile number!",
                  },
                ]}
              />

              <InputBox
                label="Owner"
                name="sb_owner_name"
                className="input"
                placeholder={fixedDisabled ? null : "Owner name"}
                rules={refactoredRules}
              />
              <InputBox
                label="Owner Cell"
                name="sb_owner_num"
                className="input"
                placeholder={fixedDisabled ? null : "0334-2525356"}
                minLength={13}
                maxLength={15}
                pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
                rules={[
                  {
                    pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                    message: "Please enter a valid mobile number!",
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: "Please enter a valid 11-digit mobile number!",
                  },
                ]}
              />
              <InputBox
                label="Local Shipping Agent"
                name="sb_locshipping_agent_name"
                className="input"
                placeholder={fixedDisabled ? null : "Agent name"}
                rules={refactoredRules}
              />
              <InputBox
                label="Local Shipping Co.Name"
                name="sb_locshipping_comp_name"
                className="input "
                placeholder={fixedDisabled ? null : "Shipping company name "}
                rules={refactoredRules}
              />
              <InputBox
                label="Local Shipping Agent Cell"
                name="sb_locshipping_agent_num"
                className="input"
                placeholder={fixedDisabled ? null : "0334-2525356"}
                minLength={13}
                maxLength={15}
                pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
                rules={[
                  {
                    pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                    message: "Please enter a valid mobile number!",
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: "Please enter a valid 11-digit mobile number!",
                  },
                ]}
              />
              <InputBox
                label="Embossed"
                name="sb_emb_name"
                className="input"
                placeholder={fixedDisabled ? null : "to be provided"}
                maxLength={25}
                rules={refactoredRules}
              />
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11} className="ml-2 mr-2">
              <DateBox
                // style={{ width: "180px" }}
                label="Date Time"
                className="input w-full"
                name={disabled ? "sb_datetime" : "sb_dtg"}
                disabled={disabled}
                initValue={shipDataForm.getFieldsValue()}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
              />
              <SelectBox
                disabled={disabled}
                label="IMO Verified"
                placeholder={fixedDisabled ? null : "IMO Verified"}
                className="input"
                name="sb_imo_verified"
                rules={commonRules}
                options={booleanOptions}
              />
              <SelectBox
                disabled={disabled}
                label="Ship flag Registry "
                className="input nowrap"
                name="sb_flag_reg_cert"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />

              <SelectBox
                disabled={disabled}
                label="Memo Agreement"
                className="input nowrap"
                name="sb_agreement_memo"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />

              <SelectBox
                disabled={disabled}
                label="Letter Credit"
                className="input nowrap"
                name="sb_credit_let"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />

              <SelectBox
                disabled={disabled}
                label="Security Team "
                className="input nowrap"
                name="sb_sec_team"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />

              <SelectBox
                disabled={disabled}
                label="Hazardeous Material "
                className="input nowrap"
                name="sb_haz_material"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />

              <SelectBox
                disabled={disabled}
                label="Gas Free  "
                className="input nowrap"
                name="sb_gas_free_cert"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />

              <SelectBox
                disabled={disabled}
                label="Nuclear Waste Free "
                className="input nowrap"
                name="sb_waste_free_cert"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />
              <SelectBox
                disabled={disabled}
                label="Import General Manifest"
                className="input nowrap"
                name="sb_import_gen_manifest"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />
              <SelectBox
                disabled={disabled}
                label="Good Deceleration "
                className="input nowrap"
                name="sb_goods_dec_doc"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />
              <SelectBox
                disabled={disabled}
                label="Deletion Certificate"
                name="sb_del_cert"
                className="input"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />
              <SelectBox
                disabled={disabled}
                label="ISO  "
                className="input"
                name="sb_iso_cert"
                placeholder={fixedDisabled ? null : "Select"}
                rules={commonRules}
                options={booleanOptions}
              />
              <Form.Item
                label="Equipment List"
                name="sb_comm_equip_list"
                rules={commonRules}
              >
                <Select
                  mode="tags"
                  className="input"
                  style={{
                    width: "100%",
                  }}
                  placeholder={fixedDisabled ? null : "Enter multiple items"}
                  tokenSeparators={[","]}
                />
              </Form.Item>
              <InputBox
                label="Ex Name"
                name="sb_ex_name"
                className="input nowrap"
                placeholder={fixedDisabled ? null : "to be provided"}
                maxLength={25}
                rules={refactoredRules}
              />
            </Col>
          </Row>
          {handleSubmit && (
            <Row className="mt-5 flex justify-center">
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="flex justify-end text-center mb-3 lg:text-right lg:mb-2 "
              >
                <Form.Item>
                  <FilledButton
                    text="Next"
                    onClick={handleSubmit}
                    className=" rounded font-semibold pl-10 pr-10 border-midnight bg-midnight text-white ml-3 mr-3 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block  "
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </StyledDiv>
    </div>
  );
}

export default ShipDataTable;

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

