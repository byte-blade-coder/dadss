import { Col, Row, Form, Select, Modal, Image } from "antd";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import {
  aisTypeSummaryNames,
  ais_type_summary,
  country_list,
  port_list,
} from "../../helper/dropdown";
import countryList from "country-list";
import CustomImageUpload from "../form/UploadBtn";
import FilledButton from "../button/FilledButton";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

function MerchantVesselTable(props) {
  const { vesselForm, disabled, handleSubmit, fixedDisabled, 
  handleImageAdd, handleImageRemove, hasPicture, fileList, sreport,tripDetails } = props;
  const pf_id = localStorage.getItem("u_pf_id");
  // State to manage the selected flag
  const [countryName, setCountryName] = useState("");
  // State for managing selected category and subcategory
  const [selectedCategory, setSelectedCategory] = useState(
    vesselForm.getFieldValue("mv_ais_type_summary")
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    vesselForm.getFieldValue("mv_type_name")
  );
  // Generate country options for the flag select box
  const countryOptions = countryList.getNames().map((country) => {
    const countryCode = countryList.getCode(country);
    const label = `${country} (${countryCode})`;
    return {
      label,
      value: country, // Set the short country code as the value
    };
  });

  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };
  const commonRules = disabled
  ? [] : [ { required: true, message: "Required Field!",},]; 

  const refactoredRules = [
    {
      pattern: /^[a-zA-Z0-9\s]+$/,
      message: "Please enter a valid value",
    },
  ];

  return (
    <div className="mb-10">
      <StyledDiv>
        <Form
          form={vesselForm}
          // layout="vertical"
          // className="shadow mx-5 px-3 py-10 bg-white"
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
                label="Platform ID"
                name="mv_pf_id"
                // defaultValue={pf_id}
                className="input"
                disabled={true}
              />
              <InputBox
                label="MMSI"
                name="mv_mmsi"
                className="input"
                placeholder={fixedDisabled ? null : "Enter 9 digit MMSI"}
                maxLength={9}
                rules={[
                  {
                    required: false,
                  },
                  {
                    len: 9,
                    message: "MMSI must be exactly 9 digits!",
                  },
                  {
                    pattern: /^\d+$/,
                    message: "MMSI must contain only digits!",
                  },
                ]}
              />
              <InputBox
                label="IMO"
                name="mv_imo"
                className="input"
                placeholder={fixedDisabled ? null : "5896784"}
                maxLength={100}
                rules={[
                 ...commonRules,
                  {
                    pattern: /^[0-9]+$/, // Allow numbers with an optional decimal point
                    message: "Please enter a valid number",
                  },
                ]}
              />
              <SelectBox
                disabled={disabled}
                showSearch
                label="Flag"
                name="mv_flag"
                className="input"
                placeholder={fixedDisabled ? null : "Pakistan (PK)"}
                value="Pakistan"
                onChange={(value) => {
                  setCountryName(value);
                }}
                options={countryOptions}
              />
              <InputBox
                label="Call Sign ID "
                name="mv_call_sign"
                className="input"
                placeholder={fixedDisabled ? null : "PAK123"}
              />
              <SelectBox
                disabled={disabled}
                label="AIS Type"
                name="mv_ais_type_summary"
                className="input"
                placeholder={fixedDisabled ? null : "Select ais type"}
                onChange={handleCategoryChange}
                options={aisTypeSummaryNames.map((item) => ({
                  label: item.category,
                  value: item.category,
                }))}
                // rules={commonRules}
              />
              <SelectBox
                label="Ship Type "
                name="mv_type_name"
                className="input"
                placeholder={fixedDisabled ? null : "Cargo"}
                onChange={(value) => setSelectedSubcategory(value)}
                options={
                  selectedCategory
                    ? aisTypeSummaryNames
                        .find((item) => item.category === selectedCategory)
                        ?.subcategories.map((subCategory) => ({
                          label: subCategory,
                          value: subCategory,
                        }))
                    : []
                }
                disabled={!selectedCategory}
                value={selectedSubcategory}
                rules={[ { required: false}]}
              />
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11} className="ml-2 mr-2">
              <InputBox
                label="Ship ID"
                name="mv_ship_id"
                className="input"
                placeholder={fixedDisabled ? null : "Enter ship ID"}
                maxLength={100}
                rules={[
                  { required: false },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Please enter a valid number",
                  },
                ]}
              />
              <InputBox
                label="Ship Name"
                name="mv_ship_name"
                className="input"
                placeholder={fixedDisabled ? null : "Enter ship name"}
                rules={commonRules}
              />
              {/* <InputBox
                label="Ship Type"
                name="mv_ship_type"
                className="input"
                placeholder={fixedDisabled ? null : "Enter"}
                maxLength={15}
                rules={[{ required: false}]}
              /> */}

              <InputBox
                label="Gross tonnage"
                name="mv_grt"
                className="input"
                placeholder={fixedDisabled ? null : "Enter tonnage"}
                rules={[
                  {
                    pattern: /^\d+$/,
                    message: "Please enter a valid gross tonnage",
                  },
                ]}
              />
              <InputBox
                label="Length (meter)"
                name="mv_length"
                className="input"
                placeholder={fixedDisabled ? null : "Enter length"}
                maxLength={15}
                rules={[
                  {
                    pattern: /^[0-9]+([.][0-9]+)?$/, // Allow numbers with an optional decimal point
                    message: "Please enter a valid  number",
                  },
                ]}
              />
              <InputBox
                label="Width (meter)"
                name="mv_width"
                className="input"
                placeholder={fixedDisabled ? null : "Enter width"}
                rules={[
                  {
                    pattern: /^[0-9]+([.][0-9]+)?$/, // Allow numbers with an optional decimal point
                    message: "Please enter a valid number",
                  },
                ]}
              />
              <InputBox
                label="Dead Weight"
                name="mv_dwt"
                className="input"
                placeholder={fixedDisabled ? null : "Enter"}
                rules={[
                  {
                    pattern: /^[0-9]+([.][0-9]+)?$/, // Allow numbers with an optional decimal point
                    message: "Please enter a valid number",
                  },
                ]}
              />
              
              <InputBox
                label="Built in year"
                name="mv_year_built"
                className="input"
                placeholder={fixedDisabled ? null : "2023"}
                maxLength={4}
                rules={[
                  {
                    pattern: /^\d{4}$/,
                    message: "Please enter a valid 4-digit year",
                  },
                ]}
              />
            </Col>
          </Row>

          <Row className="flex pl-12 pr-6 mb-1">
            {/* <Col xs={24} sm={24} md={11} lg={11} xl={11}> */}
              
            {!tripDetails && (!sreport ? (<CustomImageUpload
                form={vesselForm}
                name="mv_images"
                disabled={disabled}
                onAdd={handleImageAdd}
                onRemove={handleImageRemove}
                src="merchant"
                initialFileList={fileList}
                hasPicture={hasPicture}
              />) : ( 
                <div className="image-previews">
                  <ImagePreviews>
                  {fileList?.map((file, index) => (
                    <div key={file.uid} className="image-preview">
                      <img src={ file.url} alt={`Image ${index + 1}`} />
                        <p>{file.vi_remarks}</p>
                    </div>
                  ))}
                  </ImagePreviews>
                </div>
              ))}  

              {/* </Col> */}
          </Row>
        </Form>
      </StyledDiv>
    </div>
  );
}

export default MerchantVesselTable;
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

const ImagePreviews = styled.div`
  display: flex;
  // flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  align-items: baseline;

  .image-preview {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .image-preview .ant-form-item{
    width: 7.7rem !important;
  }

`;

