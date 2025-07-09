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
import PositionBox from "../form/PositionBoxSAR";
import { country_list, alerting_means } from "../../helper/dropdown";
import countryList from "country-list";

function MedicalAssistanceForm(props) {
    const { form, disabled } =
        props;

    const reportKeys = {
        sar_dtg: "sar_dtg",
        sar_regno: "sar_regno",
        sar_boat_name: "sar_boat_name",
        sar_unit: "sar_unit",
        sar_country:"sar_country",
        sar_crew: "sar_crew",
        sar_position: "sar_position",
        sar_remarks: "sar_remarks",
        sar_nature: "sar_nature",
        sar_assistance_type: "sar_assistance_type",
    }
    const commonRules = disabled ? [] : [
        { required: true, message: "Required Field!" },
    ]
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
    return (
        <>
            <div>
                <Heading
                    className=" whitespace-nowrap mx-5 flex justify-start "
                    level={4}
                    text="Ship/Boat Details"
                />
            </div>
            <div className="mb-10">
                <StyledDiv>
                    <Form
                        form={form}
                        disabled={disabled}
                        layout="horizontal"
                        className="shadow mx-5 my-5 p-5"
                        labelCol={{
                            flex: '130px',
                        }}
                    >
                        <Row className="flex justify-center">
                            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                <DateBox
                                    label="Date Time"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style={{ width: "100%" }}
                                    disabled={disabled}
                                    showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                                    name={disabled ? "datetime" : reportKeys.sar_dtg}
                                    rules={commonRules}
                                />
                                <InputBox
                                    label="Unit"
                                    placeholder={disabled ? null : "Enter unit name"}
                                    name={reportKeys.sar_unit}
                                    rules={commonRules}
                                    // labelCol={{
                                    //     flex: '340px',
                                    // }}
                                /> 
                                <InputBox
                                    label="Boat Name"
                                    placeholder={disabled ? null : "Enter boat name"}
                                    name={reportKeys.sar_boat_name}
                                    rules={commonRules}
                                    // labelCol={{
                                    //     flex: '180px',
                                    // }}
                                /> 
                                <InputBox
                                    label="Reg No"
                                    placeholder={disabled ? null : "Enter reg no"}
                                    name={reportKeys.sar_regno}
                                    rules={commonRules}
                                    // labelCol={{
                                    //     flex: '340px',
                                    // }}
                                />
                                <InputBox
                                    label="Nature"
                                    placeholder={disabled ? null : "Enter nature of injury/illness"}
                                    name={reportKeys.sar_nature}
                                    rules={commonRules}
                                />
                              
                            </Col>
                            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                <InputBox
                                    label="Crew"
                                    placeholder={disabled ? null : "Enter no of crew"}
                                    name={reportKeys.sar_crew}
                                    rules={commonRules}
                                />
                                  <InputBox
                                    label="Remarks"
                                    placeholder={disabled ? null : "Enter no of crew"}
                                    name={reportKeys.sar_remarks}
                                    rules={commonRules}
                                />
                                
                                <InputBox
                                    label="Assistance Type"
                                    placeholder={disabled ? null : "Enter type of assistance"}
                                    name={reportKeys.sar_assistance_type}
                                    rules={commonRules}
                                />
                                {disabled ? (
                                <InputBox
                                    label="Longitude"
                                    name={[reportKeys.sar_position, "lng"]}
                                ></InputBox>
                                ) : (
                                <StyledInput>
                                    <PositionBox
                                    label="Longitude"
                                    name={reportKeys.sar_position}
                                    coordinate={0}
                                    disabled={disabled}
                                    rules= { commonRules}
                                    style={{width: "100%"}}
                                    />
                                 </StyledInput>
                                )}
                                {disabled ? (
                                <InputBox
                                    label="Latitude"
                                    name={[reportKeys.sar_position, "lat"]}
                                ></InputBox>
                                ) : (
                               <StyledInputTwo>
                                    <PositionBox
                                        label="Latitude"
                                        name={reportKeys.sar_position}
                                        coordinate={1}
                                        disabled={disabled}
                                        rules= {commonRules}
                                        style={{ width: "100%"}}
                                    />
                                </StyledInputTwo>
                                )}
                               
                            </Col>
                            {/* <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                {/* <SelectBox
                                    label="Country"
                                    name={reportKeys.country}
                                    className="input"
                                    placeholder={disabled ? null : "Enter country"}
                                    // options={country_list.map((item) => ({
                                    // value: item,
                                    // label: item,
                                    // }))}
                                    onChange={(value) => setCountryName(value)}
                                    options={countryOptions}
                                    rules= {commonRules}
                                /> 
                            </Col> */}
                       </Row>
                    </Form>
                </StyledDiv>
            </div>
        </>
    );
}

export default MedicalAssistanceForm;

const StyledInput = styled.div`
  //   .ant-form-item-explain-error {
  //     font-size: 12px;
  //   }
  .ant-row .ant-form-item-row {
    margin-top: 20px;
    width: 100%;
    //  width: 526px;
  }
  .ant-form-item-label {
    margin-top: -3px !important;
  }
`;

const StyledInputTwo = styled.div`

  .ant-form-item .ant-row .ant-form-item-row {
    margin-top: 0px !important;
    width: 100%;
    //  width: 526px;
  }
  .ant-form-item-label {
    margin-top: -20px !important;
  }
`;

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