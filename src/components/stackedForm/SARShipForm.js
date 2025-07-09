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

function SARShipForm(props) {
    const { form, disabled } =
        props;

    // const reportKeys = {
    //     sno:"S NO",
    //     sar_date:"Date",
    //     sar_unit:"Unit",
    //     sar_boatreg:"Boat Reg No",
    //     sar_crew:"Crew",
    //     pos:"Position/ Distance Offshore",
    //     sorties:"Sorties (Ships/ A/Cs)",
    //     expectedtime:"Time expeded on sorties",
    //     rescuedship:"Ship/ boat Rescued",
    //     assitancesize:"Size of Units Assisted and Assistance Rendered",
    //     country:"Country",
    //     incidents:"Incidents",
    //     responses:"Responses",
    // }

    const reportKeys = {
        sar_dtg: "sar_dtg",
        sar_regno: "sar_regno",
        sar_boat_name: "sar_boat_name",
        sar_size: "sar_unit_size",
        sar_country:"sar_country",
        sar_crew: "sar_crew",
        sar_position: "sar_position",
    }
    const commonRules = disabled ? [] : [
        { required: false },
    ]
    const reqRules = disabled ? [] : [
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
                        // layout="vertical"
                        // className="shadow mx-5 px-3 py-5 bg-white"
                        disabled={disabled}
                        layout="horizontal"
                        className="shadow mx-5 my-5 p-5"
                        labelCol={{
                            flex: '130px',
                        }}
                        // labelAlign="left"
                        // labelWrap
                        // wrapperCol={{
                        //     flex: 1,
                        // }}
                    >
                        <Row className="flex justify-center">
                            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                <InputBox
                                    label="Ship/boat Rescued"
                                    placeholder={disabled ? null : "Enter boat name"}
                                    name={reportKeys.sar_boat_name}
                                    rules={reqRules}
                                    labelCol={{
                                        flex: '180px',
                                    }}
                                /> 
                                <InputBox
                                    label="Size of Units Assisted/Assistance Rendered"
                                    placeholder={disabled ? null : "Enter size"}
                                    name={reportKeys.sar_size}
                                    rules={commonRules}
                                    labelCol={{
                                        flex: '340px',
                                    }}
                                /> 
                            </Col>
                            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                <DateBox
                                    label="Date Time"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style={{ width: "100%" }}
                                    disabled={disabled}
                                    showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                                    name={disabled ? "datetime" : reportKeys.sar_dtg}
                                    rules={reqRules}
                                />
                                <InputBox
                                    label="Reg No"
                                    placeholder={disabled ? null : "Enter reg no"}
                                    name={reportKeys.sar_regno}
                                    rules={reqRules}
                                    // labelCol={{
                                    //     flex: '340px',
                                    // }}
                                />
                                {/* <InputBox
                                    label="Unit"
                                    placeholder={disabled ? null : "Enter size"}
                                    name={reportKeys.sar_unit}
                                    rules={commonRules}
                                    // labelCol={{
                                    //     flex: '340px',
                                    // }}
                                />  */}
                            </Col>
                            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                                                    {/* <InputBox
                    label="Longitude"
                    //name={reportKeys.position}
                    name={[reportKeys.position, "lng"]}
                    //name={[reportKeys.position, "string", 0]}
                  ></InputBox>
                ) : (
                  <StyledInput>
                    {/* <Form.Item label="Longitude" > */}
                    {/* <PositionBox
                      label="Longitude"
                      name={reportKeys.position} 
                      name={[reportKeys.position, "lng"]} */}
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
                                    rules= {reqRules}
                                    style={{width: "100%", marginBottom: "0px"}}
                                    labelCol={{
                                        flex: '340px',
                                    }}
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
                                        rules= {reqRules}
                                        style={{ width: "100%", marginTop: "-60px"}}
                                    />
                                </StyledInputTwo>
                                // {disabled ? (
                                //     <InputBox
                                //         label="Longitude"
                                //         name={[reportKeys.position, "string", 0]}
                                //     ></InputBox>
                                //     ) : (
                                //     <StyledInput>
                                //         <PositionBox
                                //         label="Longitude"
                                //         name={[reportKeys.position, "dms", 0]}
                                //         coordinate={0}
                                //         disabled={disabled}
                                //         style={{width: "100%"}}
                                //         />
                                //     </StyledInput>
                                //     )}
                                //     {disabled ? (
                                //     <InputBox
                                //         label="Latitude"
                                //         name={[reportKeys.position, "string", 1]}
                                //     ></InputBox>
                                //     ) : (
                                //     <StyledInput>
                                //         <PositionBox
                                //             label="Latitude"
                                //             name={[reportKeys.position, "dms", 1]}
                                //             coordinate={1}
                                //             disabled={disabled}
                                //             style={{width: "100%"}}
                                //         />
                                //     </StyledInput>
                                )}
                                
                            </Col>
                            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                                <InputBox
                                    label="Crew"
                                    placeholder={disabled ? null : "Enter no of crew"}
                                    name={reportKeys.sar_crew}
                                    rules={commonRules}
                                    // labelCol={{
                                    //     flex: '340px',
                                    // }}
                                />
                                <SelectBox
                                    label="Country"
                                    showSearch
                                    name={reportKeys.sar_country}
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
                            </Col>
                       </Row>
                    </Form>
                </StyledDiv>
            </div>
        </>
    );
}

export default SARShipForm;

const StyledInput = styled.div`
  //   .ant-form-item-explain-error {
  //     font-size: 12px;
  //   }
  .ant-row .ant-form-item-row {
    margin-top: 20px;
    width: 100%;
    //  width: 409px;
  }
  .ant-form-item-label {
    margin-top: -3px !important;
  }
`;

const StyledInputTwo = styled.div`

  .ant-form-item .ant-row .ant-form-item-row {
    margin-top: 0px !important;
    width: 100%;
    //  width: 409.5px;
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