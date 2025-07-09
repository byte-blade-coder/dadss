import { useState } from "react";
import { Col, Row, Table, Input, Form, InputNumber, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import PositionBox from "../form/PositionBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import {
  action_list,
  movement_list,
  patrol_type_list,
  port_list,
} from "../../helper/dropdown";
import { Cascader, Select, Space } from "antd";
import {
  positiontoDMS,
  DMStodecimal,
  dtgToString,
} from "../../helper/position";

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

function TripTable(props) {
  const { tripData, setTripData, showButtons } = props;
  const { tripDataEntered, setTripDataEntered } = props.tripDataState;
  const [tripForm] = useForm();
  const [showInputs, setShowInputs] = useState({
    tripColumns: false,
    // data_available: false,
    trip_editing: false,
  });
  const handleTripCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, tripColumns: false });
      },
    });
  };
  const handleTripDataDelete = (record) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setTripData();
        setTripDataEntered(false);
      },
    });
    tripForm.resetFields();
    // setShowInputs({...se})
  };

  const tripDataEdited = () => {
    const editedValues = tripForm.getFieldValue();

    if (editedValues) {
      setTripData(editedValues);
    }
    setShowInputs({ ...showInputs, trip_editing: false });
  };

  const handleTripShowInput = () => {
    tripForm.resetFields();
    setShowInputs({ ...showInputs, tripColumns: true });
  };

  const onTripFinish = async () => {
    const validatedValues = await tripForm.validateFields();

    if (validatedValues) {
      setTripData({
        ...validatedValues,
      });
      toast.success(`Trip data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, tripColumns: false });
      setTripDataEntered(true);
      // tripForm.resetFields();
    }
  };

  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        depjetty: "sr_depjetty",
        depdt: "sr_depdt",
        pc: "sr_pc",
        pcissuedt: "sr_pcissuedt",
        movement: "sr_movement",
      };
  const tripColumns = [
    {
      title: "Departure",
      //   dataIndex: "sr_depjetty",
      dataIndex: reportKeys.depjetty,
      render: (text, record) => {
        return showInputs.tripColumns | showInputs.trip_editing ? (
          <StyledInput>
            <SelectBox
              placeholder="Source"
              //   name="sr_depjetty"
              name={reportKeys.depjetty}
              options={port_list.map((item) => ({ value: item, label: item }))}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Departure Date",
      //   dataIndex: "sr_depdt",
      dataIndex: reportKeys.depdt,
      render: (text, record) => {
        // const dtg = dayjs(record.sr_depdt).format("YYYY-MM-DD");
        if (showInputs.tripColumns | showInputs.trip_editing) {
          return (
            <StyledInput>
              <DateBox
                format="YYYY-MM-DD"
                // showTime={{
                //   defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                // }}
                // name="sr_depdt"
                name={reportKeys.depdt}
                rules={[
                  {
                    required: true,
                    message: "Please select a date!",
                  },
                ]}
              />
            </StyledInput>
          );
        } else {
          return tripDataEntered ? dayjs(text).format("YYYY-MM-DD") : text;
        }
      },
    },
    {
      title: "PC",
      //   dataIndex: "sr_pc",
      dataIndex: reportKeys.pc,
      render: (text, record) => {
        return showInputs.tripColumns | showInputs.trip_editing ? (
          <StyledInput>
            <InputBox
              placeholder="PC"
              //   name="sr_pc"
              name={reportKeys.pc}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "PC Duration",
      dataIndex: reportKeys.pcdays,
      render: (text, record) => {
        return showInputs.tripColumns | showInputs.trip_editing ? (
          <StyledInput>
            <InputNumBox
              placeholder="Days"
              name={reportKeys.pcdays}
              type="number"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "PC Issue Date",
      dataIndex: reportKeys.pcissuedt,
      render: (text, record) => {
        // const dtg = dayjs(record.sr_pcissuedt).format("YYYY-MM-DD");
        if (showInputs.tripColumns | showInputs.trip_editing) {
          return (
            <StyledInput>
              <DateBox
                format="YYYY-MM-DD"
                // showTime={{
                //   defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                // }}
                name={reportKeys.pcissuedt}
                rules={[
                  {
                    required: true,
                    message: "Please select a date!",
                  },
                ]}
              />
            </StyledInput>
          );
        } else {
          return tripDataEntered ? dayjs(text).format("YYYY-MM-DD") : text;
        }
      },
    },
    {
      title: "Movement",
      dataIndex: reportKeys.movement,
      render: (text, record) => {
        return showInputs.tripColumns | showInputs.trip_editing ? (
          <StyledInput>
            <SelectBox
              name={reportKeys.movement}
              placeholder="Select"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
              options={movement_list.map((item) => ({
                value: item,
                lable: item,
              }))}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        if (showButtons) {
          if (showInputs.tripColumns) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleTripCancel}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#51AE3B",
                    }}
                    text="Save"
                    onClick={onTripFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (showInputs.trip_editing) {
              return (
                <Form.Item>
                  <div style={{ display: "flex" }}>
                    <SimpleButton
                      onClick={() =>
                        setShowInputs({ ...showInputs, trip_editing: false })
                      }
                      style={{
                        fontWeight: "bold",
                      }}
                      text="Cancel"
                    />
                    <SimpleButton
                      onClick={() => tripDataEdited()}
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#ffbf00",
                      }}
                      text="Edit"
                    />
                  </div>
                </Form.Item>
              );
            } else {
              return tripDataEntered ? (
                <IconsStylingWrap>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
                      setShowInputs({ ...showInputs, trip_editing: true });
                      tripForm.setFieldsValue(record);
                    }}
                  />
                  {/* <MdDelete
                        onClick={() => handleTripDataDelete(record)}
                        className="deleteIcon"
                      /> */}
                </IconsStylingWrap>
              ) : (
                text
              );
            }
          }
        }
      },
    },
  ];

  return (
    <Form form={tripForm} onFinish={onTripFinish} className="mb-8">
      <Row className="mb-5">
        <Col span={24} className="flex justify-between">
          <Heading
            level={5}
            text="Trip Details"
            className="whitespace-nowrap "
          />
          {showButtons && (
            <FilledButton
              disabled={tripDataEntered}
              text="+Add Trip Details"
              className="rounded-full border-midnight bg-midnight text-white"
              onClick={handleTripShowInput}
            />
          )}
        </Col>
      </Row>

      <StyledDiv>
        <Table
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
          columns={tripColumns}
          dataSource={[tripData]}
          pagination={false}
        />
      </StyledDiv>
    </Form>
  );
}

export default TripTable;
const StyledDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
`;
const IconsStylingWrap = styled.div`
  display: flex;
  /* gap: 20px; */
  .editIcon {
    color: #28387e;
    background-color: #f0f3f8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .deleteIcon {
    color: #e96162;
    background-color: #f9e7e8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    cursor: pointer;
  }
`;
