import { useState } from "react";
import { Col, Row, Form, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import { movement_list, port_list } from "../../helper/dropdown";
import AntdTable from "../table/AntdTable";

function FishingTripTable(props) {
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

  const tripColumns = [
    {
      key: "sr_depjetty",
      title: "Departure",
      dataIndex: "sr_depjetty",
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        return showInputs.tripColumns | showInputs.trip_editing ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              placeholder="Source"
              name="sr_depjetty"
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
      key: "sr_depdt",
      title: "Departure Date",
      dataIndex: "sr_depdt",
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        if (showInputs.tripColumns | showInputs.trip_editing) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 150 }}
                format="YYYY-MM-DD"
                name="sr_depdt"
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
      key: "sr_pc",
      title: "PC",
      width: 250,
      ellipsis: false,
      dataIndex: "sr_pc",
      render: (text, record) => {
        return showInputs.tripColumns | showInputs.trip_editing ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="PC"
              name="sr_pc"
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
      key: "sr_pcdays",
      title: "PC Duration",
      dataIndex: "sr_pcdays",
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        return showInputs.tripColumns | showInputs.trip_editing ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              placeholder="Days"
              name="sr_pcdays"
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
      key: "sr_pcissuedt",
      title: "PC Issue Date",
      dataIndex: "sr_pcissuedt",
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        if (showInputs.tripColumns | showInputs.trip_editing) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 150 }}
                format="YYYY-MM-DD"
                name="sr_pcissuedt"
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
      key: "sr_movement",
      title: "Movement",
      dataIndex: "sr_movement",
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        return showInputs.tripColumns | showInputs.trip_editing ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              name="sr_movement"
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
      key: "action",
      dataIndex: "action",
      width: 250,
      ellipsis: false,
      render: (text, record, index) => {
        // if (showButtons) {
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
    // },
  ];

  return (
    <div className="mb-10">
      <Row>
        <Col span={12} className="flex justify-start">
          <Heading
            className=" whitespace-nowrap ml-5"
            level={5}
            text="Trip Details"
          />
        </Col>
        <Col span={12} className="flex justify-end">
          {/* {showButtons && ( */}
            <>
              <FilledButton
                text="+ Add Trip Details"
                className="rounded-full border-midnight bg-midnight text-white mx-8 mr-4 custom-css-pageheaderButton"
                onClick={handleTripShowInput}
                disabled={tripDataEntered}
              />
              <FilledButton
                text="+ Add "
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                onClick={handleTripShowInput}
                disabled={tripDataEntered}
              />
            </>
          {/* )} */}
        </Col>
      </Row>

      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scrollConfig={{ x: true }}
        columns={tripColumns}
        data={[tripData]}
        pagination={false}
        form={tripForm}
        onFinish={onTripFinish}
      />
    </div>
  );
}

export default FishingTripTable;

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
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
