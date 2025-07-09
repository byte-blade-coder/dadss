import { useState, useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";
import { Col, Row, Form, Button, Label } from "antd";
import Heading from "../title/Heading";
import styled from "styled-components";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import dayjs from "dayjs";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import DateBox from "../form/DateBox";
import PositionBox from "../form/PositionBox";
import InputPercentageBox from "../form/InputPercentBox";
import useFetchOptions from "../../hooks/useFetchOptions";
import DynamicSelectOrInput from "../specialInput/DynamicSelectOrInput";
import { current } from "@reduxjs/toolkit";

function WeatherForm(props) {
  //console.log("Own Platform data: ", props)
  const { form, disabled , coireport, data } = props;
  // const { data, isLoading, error } = useSelector(
  //   (state) => state.fetchPlatformData
  // );
  // console.log("Platform Details: ", data, isLoading)
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState(null);
  const weatherOutlookOptions = useFetchOptions("outlook", "o_name", "o_name");
  // Checking if `props.reportKeys` is provided, otherwise using default values
  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        temprature: "w_temperature",
        pressure: "w_pressure",
        humidity: "w_humidity",
        seastate: "w_seastate",
        currentspeed: "w_current_speed",
        currentdir: "w_current_dir",
        windspeed: "w_wind_speed",
        winddir: "w_wind_dir",
        info: "w_info",
        outlook: "w_outlook",
      };

  const directionOptions = [
    { label: "N (0°)", value: 0 },
    { label: "NE (45°)", value: 45 },
    { label: "E (90°)", value: 90 },
    { label: "SE (135°)", value: 135 },
    { label: "S (180°)", value: 180 },
    { label: "SW (225°)", value: 225 },
    { label: "W (270°)", value: 270 },
    { label: "NW (315°)", value: 315 },
  ];
  
  const seastateOptions = [
    { label: "0 - Calm (glassy)", value: 0 },
    { label: "1 - Calm (rippled)", value: 1 },
    { label: "2 - Smooth", value: 2 },
    { label: "3 - Slight", value: 3 },
    { label: "4 - Moderate", value: 4 },
    { label: "5 - Rough", value: 5 },
    { label: "6 - Very rough", value: 6 },
    { label: "7 - High", value: 7 },
    { label: "8 - Very high", value: 8 },
    { label: "9 - Phenomenal", value: 9 },
  ];

  // const weatherOutlookOptions = [
  //   {value:'Sunny', label: 'Sunny'}, 
  //   {value:'Windy', label: 'Windy'}, 
  //   {value:'Hot', label: 'Hot'},
  //   {value:'Cold', label: 'Cold'}, 
  //   {value:'Rainy', label: 'Rainy'}, 
  //   {value:'Cloudy', label: 'Cloudy'} 
  // ];

  const commonRules = disabled
    ? []
    : [{ required: true, message: "Required Field!" }];

  // useEffect(() => {
  //   if (!data) {
  //     dispatch(fetchAllPlatformData());
  //   }
  // }, [dispatch, isLoading]);
    const buttonStyle = {
    position: "absolute",
    right: 19,
    top: -5,
    border: "none",
    background: "none",
    color: "blue",
    cursor: "pointer",
    fontSize: 20,
    fontWeight: "bold",
  };
  return (
    <>
      <div>
        <Heading
          className=" whitespace-nowrap ml-5 flex justify-start "
          level={4}
          text="Weather Data"
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
              flex: "130px",
            }}
          >
            <Row className="flex justify-center">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <InputPercentageBox
                  label="Pressure"
                  placeholder= {disabled ? null :"Pressure (hPa)"}
                  style={{ width: "100%" }}
                  name={reportKeys.pressure}
                  className="input "
                  formatter={value => `${value} hPa`}
                  parser={value => value.replace('hPa', '')}
                  // disabled={disabled}
                />
                <InputPercentageBox
                  label="Temprature"
                  placeholder={disabled ? null :"Temprature (°C)"}
                  style={{ width: "100%" }}
                  name={reportKeys.temprature}
                  className="input "
                  formatter={value => `${value}°C`}
                  parser={value => value.replace('°C', '')}
                  // disabled={disabled}
                />
                {/* <InputBox
                  label="Humidity"
                  placeholder={disabled ? null :"Humidity"}
                  style={{ width: "100%" }}
                  name={reportKeys.humidity}
                  className="input "
                  disabled={disabled}
                /> */}
                <InputPercentageBox
                  label="Humidity"
                  placeholder={disabled ? null :"Humidity (%)"}
                  name={reportKeys.humidity}
                  rules={[{ required: false }]}
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  style={{color: 'black',  width: "100%",}}
                />
                {/* <SelectBox
                  disabled={disabled}
                  label="Outlook"
                  placeholder={disabled ? null : "Outlook"}
                  name={reportKeys.outlook}
                  options={weatherOutlookOptions}
                  rules={[{ required: false }]}
                /> */}
                <DynamicSelectOrInput
                  form={form}
                  disabled={disabled}
                  label="Outlook"
                  placeholder={disabled ? null : "Outlook"}
                  name={reportKeys.outlook}
                  options={weatherOutlookOptions}
                  rules={[{ required: false }]}
                  inputPlaceholder="Enter New Type"
                  inputStyle={{ width: "100%"}}
                  buttonStyle={buttonStyle}
                  setSelectedOpt={setSelectedType}
                  selectedOpt={selectedType}
                  divStyle= {{position: "relative", display: "flex", width: "100%" }}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {/* <InputBox
                  label="Sea State"
                  placeholder={disabled ? null :"Sea State"}
                  style={{ width: "100%" }}
                  name={reportKeys.seastate}
                  className="input "
                  disabled={disabled}
                /> */}
                  <SelectBox
                    label="Sea State"
                    placeholder={disabled ? null :"Sea State"}
                    style={{ width: "100%" }}
                    name={reportKeys.seastate}
                    options={seastateOptions}
                    disabled={disabled}
                  />
                <Row gutter={16}>
                  <Col span={12}>
                   {/* {disabled ? (
                      <Form.Item label="Wind Speed" name={reportKeys.currentspeed}>
                        <span>{form.getFieldValue(reportKeys.currentspeed) ? `${form.getFieldValue(reportKeys.currentspeed)} knots` : '-'}</span>
                      </Form.Item>
                    ) : ( */}
                    <InputBox
                      label="Current Speed"
                      placeholder={disabled ? null : "Speed (knots)"}
                      style={{ width: "100%" }}
                      name={reportKeys.currentspeed}
                      className="input"
                      disabled={disabled}
                    /> 
                    {/* )} */}
                  </Col>
                  <Col span={12}>
                   {disabled && form.getFieldValue(reportKeys.currentdir) != null ? (
                      <InputPercentageBox
                      label="Current Direction"
                      placeholder={disabled ? null : "Direction"}
                      name={reportKeys.currentdir}
                      formatter={value => `${value}°`}
                      parser={value => value.replace('°', '')}
                      style={{color: 'black',  width: "100%",}}
                      disabled={disabled}
                     />
                    ) : (
                    <SelectBox
                      label="Current Direction"
                      placeholder={disabled ? null : "Direction"}
                      name={reportKeys.currentdir}
                      options={directionOptions}
                      style={{ width: "100%" }}
                      disabled={disabled}
                    />
                    )}
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                   {/* {disabled ? (
                      <Form.Item label="Wind Speed" name={reportKeys.windspeed}>
                        <span>{form.getFieldValue(reportKeys.windspeed) ? `${form.getFieldValue(reportKeys.windspeed)} knots` : '-'}</span>
                      </Form.Item>
                    ) : ( */}
                    <InputBox
                      label="Wind Speed"
                      placeholder={disabled ? null : "Speed (knots)"}
                      style={{ width: "100%" }}
                      name={reportKeys.windspeed}
                      className="input"
                      disabled={disabled}
                    />
                  {/* )} */}
                  </Col>
                  <Col span={12}>
                   <InputBox
                      label="Wind Direction"
                      placeholder={disabled ? null : "Direction"}
                      style={{ width: "100%" }}
                      name={reportKeys.winddir}
                      className="input"
                      disabled={disabled}
                    />
                    {/* <SelectBox
                      label="Wind Direction"
                      placeholder={disabled ? null : "Direction"}
                      name={reportKeys.winddir}
                      options={directionOptions}
                      style={{ width: "100%" }}
                      disabled={disabled}
                    /> */}
                  </Col>
                </Row>
                <InputBox
                  label="Other Info"
                  placeholder={disabled ? null : "Info"}
                  name={reportKeys.info}
                  disabled={disabled}
                />
              </Col>
            </Row>
          </Form>
        </StyledDiv>
      </div>
    </>
  );
}

export default WeatherForm;

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

// Styled component for custom styling
const StyledInput = styled.div`
  //   .ant-form-item-explain-error {
  //     font-size: 12px;
  //   }
  .ant-row .ant-form-item-row {
    margin: 0px;
    width: 100%;
    // width: 510px;
  }
`;
