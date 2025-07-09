import { Col, Row, Form, Select } from "antd";
import Heading from "../title/Heading";
import styled from "styled-components";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";

const IntelMacro = (props) => {
    const { macroDataForm, disabled, jettyDetails } = props;

    return (
        <div className="mb-10">
            <StyledDiv>
                <Form
                    form={macroDataForm}
                    // layout="vertical"
                    // className="shadow mx-5 px-3 py-5 bg-white"
                    disabled={disabled}
                    layout="horizontal"
                    className="shadow mx-5 my-5 pt-10 pb-5"
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
                        <Col
                            xs={24}
                            sm={24}
                            md={11}
                            lg={11}
                            xl={11}
                        >
                            <InputBox
                                label="Platform ID"
                                name="ir_pf_id"
                                className="input "
                                disabled={true}
                                
                            />

                            <SelectBox
                                label="Jetty Name "
                                name="ir_jetty"
                                className="input"
                                placeholder="Jetty Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Required Field!",
                                    },
                                ]}
                               options={jettyDetails?.map((item) => ({
                                    value: item.j_name,
                                    label: item.j_name,
                                }))}
                            />
                            {/* <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              placeholder="Vessel Type"
              name={"mrd_vessel_type"}
              options={mission_details_vessel_type.map((item) => ({
                value: item,
                label: item,
              }))}
              rules={[
                {
                  required: true,
                  message: "Please select a vessel type!",
                },
              ]}
            />
          </StyledInput> */}
                            <DateBox
                                label="Reporting Time"
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: "100%" }}
                                disabled={disabled}
                                showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                                name={disabled ? "ir_time" : "ir_reporting_time"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a date!",
                                    },
                                ]}
                            />
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={11}
                            lg={11}
                            xl={11}
                        >
                            <InputBox
                                label="Reporter Name "
                                name="ir_reporter_name"
                                className="input"
                                placeholder="Reporter Name"
                                rules={[
                                    {
                                        required: false,
                                        message: "Required Field!",
                                    },
                                ]}
                            />
                            <InputBox
                                label="Total Boats "
                                className="input"
                                placeholder="Total Boats"
                                name="ir_total_boats"
                                type="number"
                                rules={[
                                    {
                                        required: false,
                                        message: "Required Field!",
                                    },
                                ]}
                            />
                        </Col>
                        {/* <Col
                            xs={24}
                            sm={24}
                            md={8}
                            lg={8}
                            xl={8}
                        >
                            <DateBox
                                label="Reporting Time"
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: "100%" }}
                                showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                                name="ir_reporting_time"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a date!",
                                    },
                                ]}
                            />
                        </Col> */}
                    </Row>
                </Form>
            </StyledDiv>
        </div>
    );
};

export default IntelMacro;
// Styled component for custom styling

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