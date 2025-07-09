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
import { distress_locating_methods, alerting_means } from "../../helper/dropdown";

function SARForm(props) {
    const { form, disabled } =
        props;

    const reportKeys = {
        livessaved: "sar_lives_saved",
        liveslost: "sar_lives_lost",
        assistedperson: "sar_person_assisted",
        assistedpropertyvalue: "sar_value_property_saved",
        lostpropertyvalue: "sar_value_property_lost",
        preventedlostproperty: "sar_prevented_property_lost",
        alertingtype: "sar_alerting_type",
        locatingmethod: "sar_distress_method",
        incident: "sar_incidents",
        response: "sar_response"
    }
    const commonRules = disabled ? [] : [
        { required: false },
    ]
    const reqRules = disabled ? [] : [
        { required: true, message: "Required Field!" },
    ]
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMean, setSelectedMean] = useState("");
    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
      };
    const handleMeanChange = (value) => {
        setSelectedMean(value);
      };
    return (
        <>
            <div>
                <Heading
                    className=" whitespace-nowrap mx-5 flex justify-start "
                    level={4}
                    text="SAR Details"
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
                            {/* <Col xs={24} sm={24} md={11} lg={11} xl={11} >
                                <InputBox
                                    label="Sorties (Ships/A/Cs)"
                                    placeholder={disabled ? null : "Enter Name"}
                                    name={reportKeys.sorties}
                                    rules={commonRules}
                                />
                                <InputBox 
                                    label="Time expeded on sorties"
                                    placeholder={disabled ? null : "Enter Name"}
                                    name={reportKeys.expectedtime}
                                    rules={commonRules}
                                />
                            </Col> */}
                            {/* <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                <InputBox
                                    label="Ship/boat Rescued"
                                    placeholder={disabled ? null : "Enter name"}
                                    name={reportKeys.rescuedship}
                                    rules={commonRules}
                                /> 
                                <InputBox
                                    label="Size of Units Assisted/Assistance Rendered"
                                    placeholder={disabled ? null : "Enter size"}
                                    name={reportKeys.assitancesize}
                                    rules={commonRules}
                                /> 
                            </Col>*/}
                            {/* <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                <InputBox
                                    label="Lives Saved"
                                    placeholder={disabled ? null : "Enter number"}
                                    name={reportKeys.livessaved}
                                    rules={commonRules}
                                />
                                <InputBox
                                    label="Country"
                                    placeholder={disabled ? null : "Enter country"}
                                    name={reportKeys.country}
                                    rules={commonRules}
                                />
                            </Col> */}
                            {/* <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                <InputBox
                                    label="Lives Lost"
                                    placeholder={disabled ? null : "Enter number"}
                                    name={reportKeys.liveslost}
                                    rules={commonRules}
                                />
                                <InputBox
                                    label="Persons otherwise assisted"
                                    placeholder={disabled ? null : "Enter number"}
                                    name={reportKeys.assistedperson}
                                    rules={commonRules}
                                />
                            </Col> */}
                            {/* <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                <InputBox
                                    label="Value of Property Saved/ Assisted"
                                    placeholder={disabled ? null : "Enter value"}
                                    name={reportKeys.assistedpropertyvalue}
                                    rules={commonRules}
                                />
                                <InputBox
                                    label="Value of Property Lost"
                                    placeholder={disabled ? null : "Enter value"}
                                    name={reportKeys.lostpropertyvalue}
                                    rules={commonRules}
                                />
                            </Col> */}
                            {/* <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                
                                <InputBox
                                    label="Type of Alerting Means"
                                    placeholder={disabled ? null : "Enter value"}
                                    name={reportKeys.alertingtype}
                                    rules={commonRules}
                                /> 
                            </Col>*/}
                            {/* <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                <InputBox
                                    label="Incidents"
                                    placeholder={disabled ? null : "Enter incident description"}
                                    name={reportKeys.incidents}
                                    rules={commonRules}
                                />
                                <InputBox
                                    label="Method of Locating Distress Signal"
                                    placeholder={disabled ? null : "Enter locationg method"}
                                    name={reportKeys.locatingmethod}
                                    rules={commonRules}
                                />
                            </Col> */}
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                              {/*   <InputBox
                                    label="Responses"
                                    placeholder={disabled ? null : "Enter responses description"}
                                    name={reportKeys.responses}
                                    rules={commonRules}
                                />  */}
                                <InputBox
                                    label="Lives Saved"
                                    placeholder={disabled ? null : "Enter number"}
                                    name={reportKeys.livessaved}
                                    rules={commonRules}
                                    labelCol={{
                                        flex: '130px',
                                    }}
                                />
                                <InputBox
                                    label="Persons otherwise assisted"
                                    placeholder={disabled ? null : "Enter value"}
                                    name={reportKeys.assistedperson}
                                    rules={commonRules}
                                    labelCol={{
                                        flex: '240px',
                                    }}
                                />
                                <InputBox
                                    label="Value of Property Lost"
                                    placeholder={disabled ? null : "Enter value"}
                                    name={reportKeys.lostpropertyvalue}
                                    rules={commonRules}
                                    labelCol={{ flex: '200px' }}
                                    // wrapperCol={}
                                />
                                <InputBox
                                    label="Incident"
                                    placeholder={disabled ? null : "Enter value"}
                                    name={reportKeys.incident}
                                    rules={reqRules}
                                    labelCol={{ flex: '200px' }}
                                    // wrapperCol={}
                                />
                                <StyledInput>
                                    <SelectBox
                                        style={{ width: "100%" }}
                                        label="Type of Alerting Means"
                                        placeholder={disabled ? null : "Enter value"}
                                        name={reportKeys.alertingtype}
                                        onChange={handleMeanChange}
                                        options={alerting_means.map((item) => ({
                                            label: item,
                                            value: item,
                                        }))}
                                        rules={reqRules}
                                        labelCol={{ flex: '200px' }}
                                    />
                                </StyledInput>
                                
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                 <InputBox
                                    label="Lives Lost"
                                    placeholder={disabled ? null : "Enter number"}
                                    name={reportKeys.liveslost}
                                    rules={commonRules}
                                    labelCol={{ flex: '130px'  }}
                                />
                                 <InputBox
                                    label="Value of Property Saved/ Assisted"
                                    placeholder={disabled ? null : "Enter value"}
                                    name={reportKeys.assistedpropertyvalue}
                                    rules={commonRules}
                                    labelCol={{ flex: '280px' }}
                                />
                                <InputBox
                                    label="Property Lost Prevented"
                                    placeholder={disabled ? null : "Enter value"}
                                    name={reportKeys.preventedlostproperty}
                                    rules={commonRules}
                                    labelCol={{ flex: '220px' }}
                                />
                                 <InputBox
                                    label="Response"
                                    placeholder={disabled ? null : "Enter reposne detail"}
                                    name={reportKeys.response}
                                    rules={reqRules}
                                    labelCol={{ flex: '200px' }}
                                    // wrapperCol={}
                                />
                                <StyledInput>
                                    <SelectBox
                                        style={{ width: "100%" }}
                                        label="Method of Locating Distress Signal"
                                        placeholder={disabled ? null : "Enter locationg method"}
                                        name={reportKeys.locatingmethod}
                                        onChange={handleCategoryChange}
                                        options={distress_locating_methods.map((item) => ({
                                            label: item,
                                            value: item,
                                        }))}
                                        rules={reqRules}
                                        labelCol={{ flex: '280px' }}
                                    />
                                </StyledInput>
                            </Col>
                        </Row>
                    </Form>
                </StyledDiv>
            </div>
        </>
    );
}

export default SARForm;

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
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