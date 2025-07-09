import { useState } from "react";
import { Col, Row, Table, Input, Form, InputNumber, Modal } from "antd";
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
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import { machineryDefects } from "../../helper/dropdown";
import AntdTable from "./AntdTable";

function LimitationOpsCommittment(props) {
  const { limitOps, setLimitOps, showButtons } = props;
  const [limitOpsForm] = useForm();
  const [limitOpsKey, setLimitOpsKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    limitOpsColumns: false,
  });
  const handleLimitOpsColumnShowInput = () => {
    limitOpsForm.resetFields();
    setShowInputs({ ...showInputs, limitOpsColumns: true });
  };
  const handleLimitOpsColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, limitOpsColumns: false });
      },
    });
  };

  const handleLimitOpsDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setLimitOps((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    limitOpsForm.resetFields();
  };

  const isLimitOpsEditing = (record_index) => record_index === limitOpsKey;

  const limitOpsEdited = (key) => {
    const editedValues = limitOpsForm.getFieldValue();
    const newEdited = {
      ...editedValues,
    };
    setLimitOps((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setLimitOpsKey("");
    limitOpsForm.resetFields();
  };

  const onLimitOpsFinish = async () => {
    const validatedValues = await limitOpsForm.validateFields();
    if (validatedValues) {
      setLimitOps((current) => [
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
      setShowInputs({ ...showInputs, limitOpsColumns: false });
      limitOpsForm.resetFields();
    }
  };

  const Columns = [
    {
      title: "Medical Evac",
      dataIndex: "medical_evac",
      key: "medical_evac",
      render: (text, record, index) => {
        // return isLimitOpsEditing(record) ? (
        return (showInputs.limitOpsColumns && index === 0) |
          isLimitOpsEditing(index) ? (
          <StyledInput>
            <InputBox
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
      title: "Machinery Defects",
      dataIndex: "machinery defects",
      key: "machinery defects",
      render: (text, record, index) => {
        return (showInputs.limitOpsColumns && index === 0) |
          isLimitOpsEditing(index) ? (
          <StyledInput>
            <SelectBox
              name="machinery defects"
              placeholder="Select Type"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
              options={machineryDefects.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Fuel",
      dataIndex: "Fuel",
      key: "Fuel",
      render: (text, record, index) => {
        return (showInputs.limitOpsColumns && index === 0) |
          isLimitOpsEditing(index) ? (
          <StyledInput>
            <InputNumBox
              placeholder="Fuel"
              name="fuel"
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
      title: "Water",
      dataIndex: "Water",
      key: "Water",
      render: (text, record, index) => {
        return (showInputs.limitOpsColumns && index === 0) |
          isLimitOpsEditing(index) ? (
          <StyledInput>
            <InputNumBox
              placeholder="Water"
              name="fuel"
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
      title: "",
      dataIndex: "action",
      key: "action",
      render: (text, record, index) => {
        if (showInputs.limitOpsColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleLimitOpsColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onLimitOpsFinish}
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
        if (!showInputs.limitOpsColumns) {
          if (limitOps.length && !isLimitOpsEditing(index)) {
            return (
              <IconsStylingWrap>
                {/* {!showInputs.limitOpsColumns && ( */}
                <>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
                      setLimitOpsKey(index);
                      limitOpsForm.setFieldsValue(record);
                    }}
                    disable={showInputs.limitOpsColumns}
                  />
                  <MdDelete
                    onClick={() => handleLimitOpsDelete(index)}
                    className="deleteIcon"
                  />
                </>
                {/* )} */}
              </IconsStylingWrap>
            );
          }

          if (isLimitOpsEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setLimitOpsKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      limitOpsEdited(index);
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
              className="  ml-5 flex justify-start "
              level={5}
              text="Limitation Affecting Ops Commitment"
            />
          </Col>
          <Col span={12} className="flex justify-end">
            {showButtons && (
              <>
                <FilledButton
                  text="+ Limitation Affecting Ops Commitment"
                  className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                  onClick={handleLimitOpsColumnShowInput}
                  disabled={limitOpsKey !== ""}
                />
                <FilledButton
                  text="+ Add"
                  className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                  onClick={handleLimitOpsColumnShowInput}
                  disabled={limitOpsKey !== ""}
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
          data={showInputs.limitOpsColumns ? [{}, ...limitOps] : limitOps}
          pagination={false}
          form={limitOpsForm}
          onFinish={onLimitOpsFinish}
        />
      </div>
    </>
  );
}

export default LimitationOpsCommittment;

const StyledDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
`;
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
