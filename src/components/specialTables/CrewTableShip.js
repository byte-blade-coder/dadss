import { useState } from "react";
import { Form, Modal } from "antd";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import InputBox from "../form/InputBox";
import { useForm } from "antd/lib/form/Form";
import "react-toastify/dist/ReactToastify.css";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import AntdTable from "../table/AntdTable";
import { showToastSuccess } from "../../helper/MyToast";

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function CrewTableShip(props) {
  const {
    crewData,
    setCrewData,
    showButtons,
    isLoading,
  } = props;

  const [crewForm] = useForm();
  const [crewKey, setCrewKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    crewColumns: false,
  });

  const handleCrewColumnShowInput = () => {
    crewForm.resetFields();
    setShowInputs({ ...showInputs, crewColumns: true });
  };

  const handleCrewCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, crewColumns: false });
      },
    });
  };

  const handleCrewDelete = (record_index) => {
    setCrewData((prev) =>
      prev.filter((item, index) => index !== record_index)
    );
    crewForm.resetFields();
  };

  const isCrewEditing = (record_index) => record_index === crewKey;

  const crewDataEdited = (key) => {
    const editedValues = crewForm.getFieldValue();
    const newEdited = {
      ...editedValues,
    };
    setCrewData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setCrewKey("");
    crewForm.resetFields();
  };

  const onCrewFinish = async () => {
    const validatedValues = await crewForm.validateFields();
    if (validatedValues) {
      setCrewData((current) => [
        ...current,
        {
          ...validatedValues,
        },
      ]);
      showToastSuccess(`Crew data added`);
      setShowInputs({ ...showInputs, crewColumns: false });
      crewForm.resetFields();
    }
  };

  const crewColumns = [
    {
      title: "Name",
      ellipsis: false,
      key: "name",
      width: 250,
      dataIndex: 'sbc_name',
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Name"
              name='sbc_name'
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
      title: "Nationality",
      ellipsis: false,
      key: "nationality",
      width: 250,
      dataIndex: 'sbc_nationality',
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Nationality"
              name='sbc_nationality'
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
      key: "action",
      title: "",
      dataIndex: "action",
      width: 100,
      render: (text, record, index) => {
        // if (showButtons) {
        if (showInputs.crewColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleCrewCancel}
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
                  onClick={onCrewFinish}
                />
              </div>
            </Form.Item>
          );
        } else {
          if (!showInputs.crewColumns) {
            if (isCrewEditing(index)) {
              return (
                <Form.Item>
                  <div style={{ display: "flex" }}>
                    <SimpleButton
                      onClick={() => {
                        setCrewKey("");
                        crewForm.resetFields();
                      }}
                      style={{
                        fontWeight: "bold",
                      }}
                      text="Cancel"
                    />
                    <SimpleButton
                      onClick={() => {
                        crewDataEdited(index);
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
            } else if (crewData.length && !isCrewEditing(index) && showButtons) {
              return (
                <IconsStylingWrap>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
                      setCrewKey(index);
                      crewForm.setFieldsValue(record);
                      crewForm.resetFields;
                    }}
                  />
                  <MdDelete
                    onClick={() => handleCrewDelete(index)}
                    className="deleteIcon"
                  />
                </IconsStylingWrap>
              );
            }
          }
        }
      },
    },
  ];

  return (
    <div className="mb-10">
      <AntdTable
        scrollConfig={{ x: true }} // Set the scroll property as per your requirements
        columns={crewColumns}
        loading={isLoading}
        data={showInputs.crewColumns ? [{}, ...crewData] : crewData}
        pagination={true}
        titletext="Crew Details"
        btnTitle="Add Crew Details"
        onBtnClick={handleCrewColumnShowInput}
        btndisabled={crewKey !== ""}
        form={crewForm}
        showButton={showButtons}
        onFinish={onCrewFinish}
      />
    </div>
  );
}

export default CrewTableShip;

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
