import { useState, useEffect } from "react";
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
import CustomImageUpload from "../form/UploadBtn";
import { action_list, country_list, patrol_type_list } from "../../helper/dropdown";

function NakwaForm(props) {
    const { form, disabled,coireport, handleImageAdd, handleImageRemove,
    fileList, sreport, hasPicture, state} = props;
  // console.log("Nkawa Images", fileList, "\nNkawa form values", form.getFieldsValue())
    const reportKeys = props.reportKeys === "rvc"
    ? {
        name: "rvc_name",
        ethnicity: "rvc_ethnicity",
        nationality: "rvc_nationality",
        cell: "rvc_cell",
        image: "rvc_images"
      }
    : {
      name: "src_name",
      ethnicity: "src_ethnicity",
      nationality: "src_nationality",
      cell: "src_cell",
      image: "src_images"
    };

    const commonRules = disabled ? [] : [
      { required: true, message: "Required Field!" },
    ]   
  
  return (
        <>
            <div>
                <Heading
                    className=" whitespace-nowrap mx-5 flex justify-start "
                    level={4}
                    text="Nakwa Details"
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
                            flex: '130px',
                        }}
                        labelAlign="left"
                        labelWrap
                        wrapperCol={{
                            flex: 1,
                        }}
                    >
                      <Row className="flex justify-center">
                          <Col xs={24} sm={24} md={11} lg={11} xl={11} >
                              <InputBox
                                  label="Name"
                                  placeholder={disabled ? null : "Enter Name"}
                                  name={coireport ? "ssrp_name" : reportKeys.name}
                                  rules={coireport ? null : null}
                              />
                              <InputBox 
                                  label="Nationality"
                                  placeholder={disabled ? null : "Nationality"}
                                  name={coireport ? "ssrp_nationality" : reportKeys.nationality}
                                  rules={coireport ? null : null}
                              />
                              
                          </Col>
                          <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                              <InputBox
                                  label="Ethnicity"
                                  placeholder={disabled ? null : "Ethnicity"}
                                  name={coireport ? "ssrp_ethnicity" : reportKeys.ethnicity}
                                  rules={coireport ? null : null}
                              />
                              <InputBox
                                  label="Cell Number"
                                  placeholder={disabled ? null : "0321-1234567"}
                                  name={coireport ? "ssrp_mobileno" : reportKeys.cell}
                                  rules={coireport ? [
                                      {
                                        pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                                        message: "Please enter a valid mobile number!",
                                      },
                                      {
                                        pattern: /^\d{11}$/,
                                        message: "Please enter a valid 11-digit mobile number!",
                                      },
                                    ] : [
                                      // { required: true, message: "Required Field!" },
                                      {
                                          pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                                          message: "Please enter a valid mobile number!",
                                      },
                                      {
                                      pattern: /^\d{11}$/,
                                      message: "Please enter a valid 11-digit mobile number!",
                                      },
                                    ]}
                                  //rules={coireport ? null : commonRules}
                              />
                          </Col>
                          
                      </Row>
                      {!coireport && (
                        <Row className="flex pl-14 pr-8 mb-4">
                          <CustomImageUpload
                            form={form}
                            name={sreport? "src_images" : "rvc_images"}
                            disabled={disabled}
                            onAdd={handleImageAdd}
                            state={state}
                            onRemove={handleImageRemove}
                            sreport={sreport}
                            src={state==="edit"? "": "fishing"}
                            initialFileList={fileList}
                            hasPicture={hasPicture}
                          /> 
                        </Row>
                      )}
                    </Form>
                </StyledDiv>
            </div>
        </>
    );
}

export default NakwaForm;


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