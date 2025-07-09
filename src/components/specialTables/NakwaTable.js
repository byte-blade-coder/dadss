import { useEffect, useState } from "react";
import { Col, Row, Form, Modal, InputNumber, Button, Select } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import { country_list, ethnicity_list } from "../../helper/dropdown";
import AntdTable from "../table/AntdTable";

function FishingNakwaTable(props) {
  const { nakwaData, setNakwaData, showButtons } = props;
  const { nakwaDataEntered, setNakwaDataEntered } = props.nakwaDataState;
  const [nakwaForm] = useForm();
  const [showInputs, setShowInputs] = useState({
    nakwaColumns: false,
    // data_available: false,
    nakwa_editing: false,
  });
  const handleNakwaCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, nakwaColumns: false });
      },
    });
  };

  const nakwaDataEdited = () => {
    const editedValues = nakwaForm.getFieldValue();

    if (editedValues) {
      setNakwaData(editedValues);
    }
    setShowInputs({ ...showInputs, nakwa_editing: false });
  };

  const handleNakwaShowInput = () => {
    setShowInputs({ ...showInputs, nakwaColumns: true });
  };

  const onNakwaFinish = async () => {
    const validatedValues = await nakwaForm.validateFields();

    if (validatedValues) {
      setNakwaData({
        ...validatedValues,
      });
      toast.success(`Nakwa data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, nakwaColumns: false });
      setNakwaDataEntered(true);
      // nakwaForm.resetFields();
    }
  };


  const nakwaColumns = [
    {
      key: "src_name",
      title: "Name",
      dataIndex: "src_name",
      ellipsis: false,
      width: 250,
      onFilter: (value, record) => record.src_name.includes(value),
      render: (text, record) => {
        return showInputs.nakwaColumns | showInputs.nakwa_editing ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Enter Name"
              name="src_name"
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
      key: "src_nationality",
      title: "Nationality",
      dataIndex: "src_nationality",
      ellipsis: false,
      width: 250,
      render: (text, record) => {
        return showInputs.nakwaColumns | showInputs.nakwa_editing ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              placeholder="Nationality"
              name="src_nationality"
              options={country_list.map((item) => ({
                value: item,
                label: item,
              }))}
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
      key: "src_ethnicity",
      title: "Ethnicity",
      dataIndex: "src_ethnicity",
      ellipsis: false,
      width: 250,
      render: (text, record) => {
        return showInputs.nakwaColumns | showInputs.nakwa_editing ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              placeholder="Ethnicity"
              name="src_ethnicity"
              options={ethnicity_list.map((item) => ({
                value: item,
                label: item,
              }))}
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
      key: "src_cell",
      title: "Cell Number",
      dataIndex: "src_cell",
      ellipsis: false,
      width: 250,
      render: (text, record) => {
        return showInputs.nakwaColumns | showInputs.nakwa_editing ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="0321-1234567"
              name="src_cell"
              // options={port_list.map((item) => ({value: item, label: item}))} rules={[
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
                {
                  pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                  message: "Please enter a valid mobile number!",
                },
                {
                  pattern: /^\d{11}$/,
                  message: "Please enter a valid 11-digit mobile number!",
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
      key: "action",
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        // if (showButtons) {
          if (showInputs.nakwaColumns) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleNakwaCancel}
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
                    onClick={onNakwaFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (showInputs.nakwa_editing) {
              return (
                <Form.Item>
                  <div style={{ display: "flex" }}>
                    <SimpleButton
                      onClick={() =>
                        setShowInputs({ ...showInputs, nakwa_editing: false })
                      }
                      style={{
                        fontWeight: "bold",
                      }}
                      text="Cancel"
                    />
                    <SimpleButton
                      onClick={() => nakwaDataEdited()}
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
              return nakwaDataEntered ? (
                <IconsStylingWrap>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
                      setShowInputs({ ...showInputs, nakwa_editing: true });
                      nakwaForm.setFieldsValue(record);
                    }}
                  />
                  {/* <MdDelete
                        onClick={() => handleNakwaDataDelete(record)}
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
            text="Nakwa Details"
          />
        </Col>
        <Col span={12} className="flex justify-end">
          {showButtons && (
            <>
              <FilledButton
                text="+ Add Nakwa Details"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                onClick={handleNakwaShowInput}
                disabled={nakwaDataEntered}
              />
              <FilledButton
                text="+ Add"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                onClick={handleNakwaShowInput}
                disabled={nakwaDataEntered}
              />
            </>
          )}
        </Col>
      </Row>

      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scrollConfig={{ x: true }} // Set the scroll property as per your requirements
        columns={nakwaColumns}
        data={[nakwaData]}
        pagination={false}
        form={nakwaForm}
        onFinish={onNakwaFinish}
      />
    </div>
  );
}

export default FishingNakwaTable;

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
