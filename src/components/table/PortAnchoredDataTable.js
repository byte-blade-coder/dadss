import { useState } from "react";
import { Form, Modal } from "antd";
import styled from "styled-components";
import InputBox from "../form/InputBox";
import { useForm } from "antd/lib/form/Form";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import PositionBox from "../form/PositionBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import { mission_details_vessel_type, ais_type_summary } from "../../helper/dropdown";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import SimpleButton from "../button/SimpleButton";
import SelectBox from "../form/SelectBox";
import DetailsTable from "./DetailsTable";
import AntdTableIndex from "./AntdTableIndex";
import { showToastSuccess } from "../../helper/MyToast";

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
  .ant-row .ant-form-item-row {
    width: 70px;
  }
`;
const IconsStylingWrap = styled.div`
  display: flex;
  /* gap: 40px; */
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

function MissionDetailDataTable(props) {
  const { missionDetail, setMissionDetail, showButtons, detailsDataColumns, title, data,  view, setEdited } = props;
  const [missionDetailForm] = useForm();

  // used to track the currently editing item's index in the mission detail array.
  const [missionDetailDataKey, setMissionDetailDataKey] = useState("");
  //jetty data array that is currently being edited
  // When you call setmission detail(newValue), it updates the value of mission detail to newValue.

  // State for managing the visibility of different input sections
  const [showInputs, setShowInputs] = useState({
    missionDetailColumns: false,
  });

  // Function to show input fields for adding mission detail data
  const handleMissionDataColumnShowInput = () => {
    missionDetailForm.resetFields();
    setShowInputs({ ...showInputs, missionDetailColumns: true });
  };

  // Function to handle cancelling the addition of mission detail data
  const handleMissionDataColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, missionDetailColumns: false });
      },
    });
  };

  // Function to handle deleting mission detail data
  const handleMissionDataDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setMissionDetail((prev) =>
          // Remove the item at the specified index from the mission detail data array
          // keep the elements in the array where the index is not equal to the record_index
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    missionDetailForm.resetFields();
  };

  // check if a   data record is being edited  by comparing the provided index with the stored  DataKey.
  // If they are equal, it indicates that the record at the specified index is being edited.
  const isMissionDetailDataEditing = (record_index) =>
    record_index === missionDetailDataKey;

  const missionDetailDataEdited = (key) => {
    const editedValues = missionDetailForm.getFieldValue();
    console.log("editedValues ",editedValues)
    const newEdited = {
      ...editedValues,
    };
    console.log(newEdited)
    // Update the  data state by replacing the item at the specified key/index with the new edited item
    setMissionDetail((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setMissionDetailDataKey("");
    missionDetailForm.resetFields();
  };

  const formDetailDataEdited = (key) => {
    const editedValues = missionDetailForm.getFieldValue();
    console.log("editedValues ",editedValues)
    const newEdited = {
      ...editedValues,
    };
    console.log(newEdited)
    // Update the  data state by sending it to API
    setEdited(newEdited)
    setMissionDetailDataKey("");
    missionDetailForm.resetFields();
  };

  // Function to handle Jetty data form submission
  const onMissionDetailDataFinish = async () => {
    const validatedValues = await missionDetailForm.validateFields();
    console.log("validatedValues ", validatedValues)
    if (validatedValues) {
      // Update the  data state by adding a new item with the validated values
      setMissionDetail((current) => [
        ...current,
        {
          ...validatedValues,
        },
      ]);
     
      showToastSuccess('Anchored table data added');
      setShowInputs({ ...showInputs, missionDetailColumns: false });
      missionDetailForm.resetFields();
    }
  };

  const missionDetailsDataColumns = [
    {
      title: "Vessel Name",
      dataIndex: "m_name",
      ellipsis: false,
      filtertype: 'search',
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="m_name"
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
      title: "Type",
      dataIndex: "m_type",
      ellipsis: false,
      filtertype: 'unique',
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              placeholder="Vessel Type"
              name={"m_type"}
              options={ais_type_summary.map((item) => ({
                value: item,
                label: item,
              }))}
              rules={[
                {
                  required: true,
                  message: "Please select a vessel type!",
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
      title: "Flag",
      dataIndex: "m_flag",
      ellipsis: false,
      filtertype: 'unique',
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="m_flag"
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
      title: "Time of Arrival",
      dataIndex: "m_datetime",
      ellipsis: false,
      sorttype: 'date',
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          // return (
          <StyledInput>
            <DateBox
              style={{ width: 180 }}
              format="DD-MM-YYYY HH:mm:ss"
              showTime={{
                defaultValue: dayjs("00:00:00", "HH:mm:ss"),
              }}
              name="m_datetime"
              rules={[
                {
                  required: true,
                  message: "Please select a date!",
                },
              ]}
            />
          </StyledInput>
        ) : missionDetail ? (
          dayjs(text).format("DD-MM-YYYY HH:mm:ss")
        ) : (
          text
        );
      },
    },
    {
      title: "Distance from MPT",
      dataIndex: "m_distance_from_mpt",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="m_distance_from_mpt"
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
      ellipsis: false,
      width: 100,
      render: (text, record, index) => {
        if (showInputs.missionDetailColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleMissionDataColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onMissionDetailDataFinish}
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
        if (!showInputs.missionDetailColumns) {
          if (
            missionDetail.length &&
            !isMissionDetailDataEditing(index) &&
            showButtons
          ) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setMissionDetailDataKey(index);
                    missionDetailForm.setFieldsValue(record);
                  }}
                  disable={showInputs.missionDetailColumns}
                />
                <MdDelete
                  onClick={() => handleMissionDataDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isMissionDetailDataEditing(index) && view==="view") {
            //when edit button is clicked
            console.log("viieww if", isMissionDetailDataEditing(index))
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setMissionDetailDataKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      formDetailDataEdited(index);
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
          else if(isMissionDetailDataEditing(index) && view!=="view") {
            //when edit button is clicked
            console.log("else", isMissionDetailDataEditing(index))
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setMissionDetailDataKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      missionDetailDataEdited(index);
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
        if(view==="view")
        {
          console.log(missionDetail.length)
          return (
            <IconsStylingWrap>
              <MdModeEditOutline
                className="editIcon"
                onClick={() => {
                  setMissionDetailDataKey(index);
                  const modifiedRecord = {
                    ...record, // Keep all existing properties
                    m_datetime: dayjs(record.m_datetime),
                  };
        
                  missionDetailForm.setFieldsValue(modifiedRecord);
                }}
                disable={showInputs.missionDetailColumns}
              />
              {/* <MdDelete
                onClick={() => handleMissionDataDelete(index)}
                className="deleteIcon"
              /> */}
            </IconsStylingWrap>
          );
        }
      },
    },
  ];


  return (
    <div className="mb-2">
      <DetailsTable
        form={missionDetailForm}
        onFinish={onMissionDetailDataFinish}
        columns={missionDetailsDataColumns}
        data={
          view==="view" ? data :
          showInputs.missionDetailColumns
            ? [{}, ...missionDetail]
            : missionDetail
        }
        titletext={title}
        showButton={showButtons}
        btnTitle={`Add ${title} Details`}
        onBtnClick={handleMissionDataColumnShowInput}
        btndisabled={missionDetailDataKey !== ""}
      />
    </div>
  );
}

export default MissionDetailDataTable;
