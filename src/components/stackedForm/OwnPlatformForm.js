import { useState, useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";
import { Col, Row, Form, Modal, Space, Button } from "antd";
import { fetchAllPlatformData } from "../../redux/thunks/platformData";
import Heading from "../title/Heading";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { PercentageOutlined  } from '@ant-design/icons';
import dayjs from "dayjs";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import DateBox from "../form/DateBox";
import PositionBox from "../form/PositionBox";
import InputPercentageBox from "../form/InputPercentBox";
import { action_list, action_list_coi, patrol_type_list } from "../../helper/dropdown";
import useFetchOptions from "../../hooks/useFetchOptions";
import DynamicSelectOrInput from "../specialInput/DynamicSelectOrInput";

function OwnPlatformForm(props) {
  //console.log("Own Platform data: ", props)
  const { form, disabled , coireport } = props;
  const { data, isLoading, error } = useSelector(
    (state) => state.fetchPlatformData
  );
  // console.log("Platform Details: ", data, isLoading)
  const dispatch = useDispatch();
  const [patrolTypes, setPatrolTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null); // selectedPatrolType
  const [selectedActionType, setSelectedActionType] = useState(null); // selectedActionType
  // Checking if `props.reportKeys` is provided, otherwise using default values
  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        dtg: "gr_dtg",
        pf_id: "gr_pf_id",
        position: "gr_position",
        lat: "gr_position.lat",
        lng: "gr_position.lng",
        fuel: "gr_fuelrem",
        frshwatr: "gr_freshwater",
        info: "gr_info",
        patrolType: "gr_patroltype",
        action: "gr_action",
      };

  const commonRules = disabled
    ? []
    : [{ required: true, message: "Required Field!" }];

  const positionRules = disabled
  ? []
  : [{ required: true, message: "Required Field!"}, 
      { pattern: /^(?:\d{1,2}|\d{1,2}\.\d{1,5})$/, message: "Enter a valid coordinate (XX or XX.XXXXX)",}];

  const patrolTypeOptions = useFetchOptions("patrol_type", "pt_name", "pt_name");
  const actionTypeOptions = useFetchOptions("action_type", "at_name", "at_name");

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
  
  const fetchPatrolTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/patroltype`
      );
      const types = response.data.map((item) => (
        {
        value: item.ssrpt_key,
        label: item.ssrpt_name,
      }));
      setPatrolTypes(types.filter((item) => item !== ""));
    } catch (error) {
      console.error("Error fetching platform types:", error);
    }
  };
  const usertype = localStorage.getItem("is_superuser")
  // console.log("perm: ", usertype)
  useEffect(() => {
    if (!data) {
      dispatch(fetchAllPlatformData());
    }
  }, [dispatch, isLoading]);
  
  useEffect(() => {
    fetchPatrolTypes();
  }, []);

  const platformOptions = data.map((item) => ({
    value: item.pf_id,
    label: item.pf_id,
  }));
  // setSelectedType(null);

  return (
    <>
      <div>
        <Heading
          className=" whitespace-nowrap ml-5 flex justify-start "
          level={4}
          text="Own Platform Data"
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
              flex: "130px",
            }}
            // labelAlign="left"
            // labelWrap
            // wrapperCol={{
            //   flex: 1,
            // }}
          >
            <Row className="flex justify-center">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {
                   usertype=== 'true' ? (
                      <SelectBox
                        disabled={disabled}
                        label="Platform ID"
                        placeholder={disabled ? null : "Platform ID"}
                        name={reportKeys.pf_id}
                        options={platformOptions}
                        rules={commonRules}
                      />
                   ) : (
                      <InputBox
                        label="Platform ID"
                        style={{ width: "100%" }}
                        name={reportKeys.pf_id}
                        className="input "
                        disabled={true}
                        // disabled={coireport? false: true}
                      />
                   )
                }
                <DateBox
                  label="Date Time"
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                  disabled={disabled}
                  showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                  name={disabled ? "datetime" : reportKeys.dtg}
                  rules={ commonRules}
                />
                <> 
                  <DynamicSelectOrInput
                    form={form}
                    disabled={disabled}
                    label="Patrol Type"
                    placeholder={disabled ? null : "Patrol Type"}
                    name={reportKeys.patrolType}
                    options={coireport ? 
                    patrolTypes : patrolTypeOptions }
                    inputPlaceholder="Enter New Type"
                    rules={coireport? null: commonRules}
                    inputStyle={{ width: "100%"}}
                    buttonStyle={buttonStyle}
                    setSelectedOpt={setSelectedType}
                    selectedOpt={selectedType}
                    divStyle= {{position: "relative", display: "flex", width: "100%" }}
                  />
                </>
                { coireport ? (
                  <SelectBox
                    disabled={disabled}
                    label="Action type"
                    placeholder={disabled ? null : "Action Type"}
                    name={reportKeys.action}
                    options={action_list_coi.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    rules={null}
                  />
                ) : (
                    <DynamicSelectOrInput
                      form={form}
                      disabled={disabled}
                      label="Action Type"
                      placeholder={disabled ? null : "Action Type"}
                      name={reportKeys.action}
                      options={actionTypeOptions}
                      inputPlaceholder="Enter New Type"
                      rules={coireport? null: commonRules}
                      inputStyle={{ width: "100%"}}
                      buttonStyle={buttonStyle}
                      setSelectedOpt={setSelectedActionType}
                      selectedOpt={selectedActionType}
                      divStyle= {{position: "relative", display: "flex", width: "100%" }}
                    />
                )}
                <InputBox
                  label="Other Info"
                  placeholder={disabled ? null : "Info"}
                  name={reportKeys.info}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <InputPercentageBox
                  label="Fuel Remaining"
                  placeholder={disabled ? null : "Fuel (%)"}
                  name={reportKeys.fuel}
                  rules={coireport? null: commonRules}
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  style={{color: 'black',  width: "100%",}}
                />
                <InputPercentageBox
                  label="Fresh Water"
                  placeholder={disabled ? null : "Fresh Water (%)"}
                  name={reportKeys.frshwatr}
                  // rules={coireport? null: commonRules}
                  rules={[{ required: false }]}
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  style={{color: 'black',  width: "100%",}}
                  disabled={disabled}
                />
                {disabled ? (
                  <InputBox
                    label="Longitude"
                    //name={reportKeys.position}
                    name={[reportKeys.position, "lng"]}
                    //name={[reportKeys.position, "string", 0]}
                  ></InputBox>
                ) : (
                  <StyledInput>
                    {/* <Form.Item label="Longitude" > */}
                    <PositionBox
                      label="Longitude"
                      name={reportKeys.position}
                      //name={[reportKeys.position, "lng"]}
                      // name={[reportKeys.position, "dms", 0]}
                      coordinate={0}
                      disabled={disabled}
                      rules= {[
                        { required: true, message: "Required Field!" },
                        { 
                          pattern: /^[-+]?(180(\.0{1,6})?|1[0-7]\d(\.\d{1,6})?|[1-9]?\d(\.\d{1,6})?)$/, 
                          message: "Enter a valid longitude (-180 to 180, up to 6 decimals)"
                        }
                      ]}
                      // validationrules= {coireport? false : true}
                      style={{width: "100%"}}
                    />
                    {/* </Form.Item> */}
                  </StyledInput>
                )}
                {disabled ? (
                  <InputBox
                    label="Latitude"
                    //name={reportKeys.lat}
                    name={[reportKeys.position, "lat"]}
                    //name={[reportKeys.position, "string", 1]}
                  ></InputBox>
                ) : (
                  <StyledInput>
                    {/* <Form.Item label="Latitude"> */}
                      <PositionBox
                        label="Latitude"
                        name={reportKeys.position}
                        //name={[reportKeys.position, "lat"]}
                        // name={[reportKeys.position, "dms", 1]}
                        coordinate={1}
                        disabled={disabled}
                        rules= {[
                          { required: true, message: "Required Field!" },
                          { 
                            pattern: /^[-+]?(90(\.0{1,6})?|[1-8]?\d(\.\d{1,6})?)$/, 
                            message: "Enter a valid latitude (-90 to 90, up to 6 decimals)"
                          }
                        ]}
                        // validationrules= {coireport? false : true}
                        style={{ width: "100%"}}
                      />
                    {/* </Form.Item> */}
                  </StyledInput>
                )}
              </Col>
            </Row>
          </Form>
        </StyledDiv>
      </div>
    </>
  );
}

export default OwnPlatformForm;

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
