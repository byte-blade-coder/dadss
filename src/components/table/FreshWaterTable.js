import { useState } from "react";
import { Col, Row, Table, Form, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import AntdTable from "./AntdTable";

function FreshWaterTable(props) {
  const { freshWaterData, setFreshWaterData, showButtons } = props;
  const [freshWaterFrom] = useForm();
  const [freshWaterKey, setFreshWaterKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    freshWaterColumn: false,
  });
  const handleFreshWaterColumnShowInput = () => {
    freshWaterFrom.resetFields();
    setShowInputs({ ...showInputs, freshWaterColumn: true });
  };
  const handleFreshWaterColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, freshWaterColumn: false });
      },
    });
  };

  const handleFreshWaterDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setFreshWaterData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    freshWaterFrom.resetFields();
  };

  const isFreshWaterEditing = (record_index) => record_index === freshWaterKey;

  const freshWatesEdited = (key) => {
    const editedValues = freshWaterFrom.getFieldValue();
    const newEdited = {
      ...editedValues,
    };
    setFreshWaterData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setFreshWaterKey("");
    freshWaterFrom.resetFields();
  };

  const onFreshWaterFinish = async () => {
    const validatedValues = await freshWaterFrom.validateFields();
    if (validatedValues) {
      setFreshWaterData((current) => [
        ...current,
        {
          ...validatedValues,
        },
      ]);
      toast.success(`Limitation Affectipn Ops Commitment data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, freshWaterColumn: false });
      freshWaterFrom.resetFields();
    }
  };

  const Columns = [
    {
      title: "Fresh Water %",
      dataIndex: "medical_evac",
      key:"freshwater",
      render: (text, record, index) => {
        return (showInputs.freshWaterColumn && index === 0) |
          isFreshWaterEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{
                width: "100%",
              }}
              placeholder="Vessels"
              name="medical_evac"
              min={1}
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
      title: "",
      key:"action",
      dataIndex: "action",
      render: (text, record, index) => {
        if (showInputs.freshWaterColumn && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleFreshWaterColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onFreshWaterFinish}
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "#51AE3B",
                  }}
                  text="Save"
                />
              </div>
            </Form.Item>
          );
        }
        if (!showInputs.freshWaterColumn) {
          if (freshWaterData.length && !isFreshWaterEditing(index)) {
            return (
              <IconsStylingWrap>
                {/* {!showInputs.freshWaterColumn && ( */}
                <>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
                      setFreshWaterKey(index);
                      freshWaterFrom.setFieldsValue(record);
                    }}
                    disable={showInputs.freshWaterColumn}
                  />
                  <MdDelete
                    onClick={() => handleFreshWaterDelete(index)}
                    className="deleteIcon"
                  />
                </>
                {/* )} */}
              </IconsStylingWrap>
            );
          }

          if (isFreshWaterEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setFreshWaterKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      freshWatesEdited(index);
                    }}
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
          }
        }
      },
    },
  ];

  return (
    <>
      <div className="mb-10">
        <Row>
          <Col span={12}>
            <Heading
              className=" whitespace-nowrap ml-5 flex justify-start "
              level={5}
              text="Add Fresh Water %"
            />
          </Col>
          <Col span={12} className="flex justify-end">
            {showButtons && (
              <>
                <FilledButton
                  text="+ Fresh Water %"
                  className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                  onClick={handleFreshWaterColumnShowInput}
                  disabled={freshWaterKey !== ""}
                />
                <FilledButton
                  text="+ Add"
                  className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                  onClick={handleFreshWaterColumnShowInput}
                  disabled={freshWaterKey !== ""}
                />
              </>
            )}
          </Col>
        </Row>
        {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
        <AntdTable
          scrollConfig={{ x: true }}
          columns={Columns}
          data={
            showInputs.freshWaterColumn
              ? [{}, ...freshWaterData]
              : freshWaterData
          }
          pagination={false}
          form={freshWaterFrom}
          onFinish={onFreshWaterFinish}
        />
      </div>
    </>
  );
}

export default FreshWaterTable;

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
