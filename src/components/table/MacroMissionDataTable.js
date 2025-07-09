import { Col, Row, Form } from "antd";
import Heading from "../title/Heading";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import InputBox from "../form/InputBox";

function MacroMissionDataTable(props) {
  const { missionDataForm, disabled } = props;

  return (
    <div className="mb-10">
      <StyledDiv>
        <Form
          form={missionDataForm}
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
          <Row className="flex justify-center ">
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <InputBox
                label="Platform ID"
                name="mr_pf_id"
                className="input "
                disabled={true}

              />
              {missionDataForm.getFieldValue('mr_rdt') &&
                <DateBox
                  label="Registered ON"
                  format="DD-MM-YYYY HH:mm:ss"
                  disabled={true}
                  style={{ width: "100%" }}
                  showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                  name="mr_rdt"
                />
              }
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <DateBox disabled={disabled}
                label="Date Time"
                format="DD-MM-YYYY HH:mm:ss"
                style={{ width: "100%" }}
                showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                name={disabled ? "mr_datetime" : "mr_dtg"}
                rules={[
                  {
                    required: true,
                    message: "Please select a date!",
                  },
                ]}
              />
            </Col>
            {missionDataForm.getFieldValue('mr_rdt') &&
              <Col
                xs={24}
                sm={24}
                md={11}
                lg={11}
                xl={11}
              >

              </Col>
            }
          </Row>
        </Form>
      </StyledDiv>
    </div>
  );
}

export default MacroMissionDataTable;

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

