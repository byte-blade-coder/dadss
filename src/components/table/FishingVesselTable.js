import { Col, Row, Form, Upload, Select, Button, Modal, Image, Input } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import CustomImageUpload from "../form/UploadBtn";
import {
  ais_type_summary,
  country_list,
  port_list,
  type_list,
} from "../../helper/dropdown";
import countryList from "country-list";
import FilledButton from "../button/FilledButton";
import useFetchOptions from "../../hooks/useFetchOptions";

function FishingVesselTable(props) {
  const { vesselForm, disabled, handleSubmit, fixedDisabled, fileList,
  handleImageAdd, handleImageRemove, sreport, state } = props;

  const [selectedType, setSelectedType] = useState(null); // Added selectedType state
  const [blacklisted, setBlacklisted] = useState(false); 
  const [imageFile, setImageFile] = useState(null); // State to manage the uploaded image file(s)
  const [countryName, setCountryName] = useState(""); // State to manage the selected flag
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
        {
          required: true,
          message: "Required Field!",
        },
      ]; 
    // useEffect(() => {
    //   vesselForm.setFieldsValue({ rv_images: [] });
    // }, [vesselForm]);  
     
  const fvTypeOptions = useFetchOptions("fishing_type", "ft_name", "ft_name");

  const buttonStyle = {
    position: "absolute",
    right: 5,
    top: -5,
    border: "none",
    background: "none",
    color: "blue",
    cursor: "pointer",
    fontSize: 20,
    fontWeight: "bold",
  };

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
                label="Platform ID"
                name="rv_pf_id"
                className="input"
                disabled={true}
              />
              <InputBox
                label="Vessel Name"
                name="rv_name"
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
                name="rv_flag"
                className="input"
                placeholder={fixedDisabled ? null : "Pakistan (PK)"}
                value="Pakistan (PK)"
                onChange={(value) => setCountryName(value)}
                options={countryOptions}
                rules={commonRules}
              />
              {/* <InputBox
                label="Flag"
                name="rv_flag"
                className="input"
                placeholder="Pakistan (PK)"
                rules={[{ required: true, message: "Please select a flag" }]}
              /> */}
              {/* <SelectBox
                disabled={disabled}
                label="Vessel Type"
                name="rv_type"
                className="input"
                placeholder={fixedDisabled ? null : "Select Type"}
                options={fvTypeOptions} 
                // options={type_list.map((item) => ({
                //   value: item,
                //   label: item,
                // }))}
                rules={commonRules}
              /> */}
              <>
                {selectedType !== "Others" ? (
                  <SelectBox
                  disabled={disabled}
                  label="Vessel Type"
                className="input"
                placeholder={fixedDisabled ? null : "Select Type"}
                    name="rv_type"
                    // style={{ width: 150 }}
                    // rules={[req_rule]}
                    options={[
                      ...fvTypeOptions,
                      { value: "Others", label: "Others" },
                    ]}
                    onChange={(value) => {
                      setSelectedType(value);
                      vesselForm.setFieldsValue({
                        rv_type: value !== "Others" ? value : "",
                      });
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: "100%",
                      }}
                    >
                      <InputBox
                        // rules={[req_rule]}
                        placeholder={fixedDisabled ? null : "Enter New Type"}
                    disabled={disabled}
                    label="Vessel Type"
                    name="rv_type"
                        // style={{ width: 150 }}
                      />
                      <Button
                        style={buttonStyle}
                        onClick={() => {
                          // Logic to show SelectBox and hide InputBox
                          setSelectedType(""); // Example of resetting state
                        }}
                      >
                        &#x21A9;{" "}
                        {/* Leftwards Arrow With Hook for back symbol */}
                      </Button>
                    </div>
                  </>
                )}
              </>
              <InputBox
                label="Gross tonnage"
                name="rv_tonnage"
                className="input"
                placeholder={fixedDisabled ? null : "Enter tonnage"}
                minLength={3}
                maxLength={15}
                rules={[
                  // ...commonRules,
                  {
                    pattern: /^\d+$/,
                    message: "Please enter a valid gross tonnage",
                  },
                ]}
              />
               {/* <SelectBox
                disabled={disabled}
                label="Blacklisted"
                placeholder={fixedDisabled ? null : "Blacklisted"}
                className="input"
                name="rv_blacklisted"
                rules={commonRules}
                options={booleanOptions}
                onChange={(value) => setBlacklisted(value)}

              /> */}
              
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11} className="ml-2 mr-2">
              <InputBox
                label="Vessel ID"
                className="input"
                placeholder={fixedDisabled ? null : "to be provided"}
                name="rv_id"
                minLength={6}
                maxLength={12}
                pattern="/^[0-9]+$/"
                rules={[
                  // ...commonRules,
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
              <InputBox
                label="Reg Number"
                name="rv_regno"
                placeholder={fixedDisabled ? null : "Enter"}
                className="input"
                minLength={3}
                maxLength={15}
                pattern="/^[a-zA-Z0-9]+$/"
                rules={[
                  ...commonRules,
                  {
                    // pattern: /^[a-zA-Z0-9]+$/,
                    pattern: /^[a-zA-Z0-9\-_.#/\\]+$/,
                    message: "Please enter a valid registration number",
                  },
                  // {
                  //   pattern: /^\S+$/,
                  //   message: "White space is not allowed",
                  // },
                ]}
              />
              <InputBox
                label="Province"
                name="rv_province"
                className="input"
                placeholder={fixedDisabled ? null : "Enter Province"}
              />
              <InputBox
                label="Length (meters)"
                name="rv_length"
                className="input"
                placeholder={fixedDisabled ? null : "Enter length"}
                minLength={3}
                maxLength={15}
                rules={[
                  // ...commonRules,
                  {
                    pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message: "Please enter a valid length in meters",
                  },
                ]}
              />
              <InputBox
                label="Breath (meters)"
                name="rv_breadth"
                className="input"
                placeholder={fixedDisabled ? null : "Enter breadth"}
                minLength={3}
                maxLength={15}
                rules={[
                  // ...commonRules,
                  {
                    pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message: "Please enter a valid breath in meters",
                  },
                ]}
              />
              {/* <InputBox
                label="Remarks"
                name="rv_remarks"
                className="input"
                placeholder={fixedDisabled ? null : "Enter Remarks"}
              /> */}
              {blacklisted === true && (
                <InputBox
                  label="Remarks"
                  name="rv_remarks"
                  className="input"
                  placeholder={fixedDisabled ? null : "Enter Remarks"}
                />
              )}
              {/* <Form.Item label="" name="ri_image">
                <Upload
                  multiple
                  fileList={fileList}
                  name="ri_image"
                  onChange={handleImageUpload}
                  onRemove={handleImageRemove}
                  customRequest={customRequest}
                  listType="picture-card"
                >
                  <Button icon={<UploadOutlined />} disabled={disabled}>Upload Vessel Images</Button>
                </Upload>
              </Form.Item>
              {fileList.length > 0 && (
                <div className="image-previews">
                  {fileList.map((file, index) => (
                    <div key={file.uid} className="image-preview">
                      <img src={URL.createObjectURL(file.originFileObj)} alt={`Image ${index + 1}`} />
                      <Form.Item
                        name={`ri_name_${file.uid}`}
                        rules={commonRules}
                        style={{ display: "none" }} // Hide the input fields
                      >
                        <Input disabled={disabled} />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )} */}

            </Col>
            
          </Row>
          <Row className="flex pl-12 pr-6 mb-1">
            {/* <Col xs={24} sm={24} md={11} lg={11} xl={11}> */}
              {!sreport ? (<CustomImageUpload
                form={vesselForm}
                name="rv_images"
                disabled={disabled}
                onAdd={handleImageAdd}
                onRemove={handleImageRemove}
                src="fishing"
                initialFileList={fileList}
              /> ) : ( 
                <div className="image-previews">
                  <ImagePreviews>
                  {fileList?.map((file, index) => (
                    <div key={file.uid} className="image-preview">
                      <Image src={ file.url} alt={`Image ${index + 1}`} />
                        <p>{file.ri_remarks}</p>
                    </div>
                  ))}
                  </ImagePreviews>
                </div>
              )}
              {/* </Col> */}
          </Row>

        </Form>
        
      </StyledDiv>
    </div>
  );
}

export default FishingVesselTable;
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

    .image-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }

  .image-preview {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;


const ImagePreviews = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;

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


