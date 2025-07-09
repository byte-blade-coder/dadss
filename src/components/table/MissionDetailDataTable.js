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
import { mission_details_vessel_type } from "../../helper/dropdown";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import SimpleButton from "../button/SimpleButton";
import SelectBox from "../form/SelectBox";
import AntdTable from "./AntdTable";
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
  const { missionDetail, setMissionDetail, showButtons } = props;
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
    missionDetailForm.setFieldValue(["mrd_position", "dms", 0, "dir"], "E");
    missionDetailForm.setFieldValue(["mrd_position", "dms", 1, "dir"], "N");
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

  const missionDetailDataEdited = async (key) => {
    // const validatedValues = await missionDetailForm.validateFields();
    const editedValues = missionDetailForm.getFieldValue();
    // console.log("editedValues ",editedValues)
    const coordinates = [
      //editedValues.mrd_position.lng,
      //editedValues.mrd_position.lat,
      editedValues.mrd_position.coordinates[0],
      editedValues.mrd_position.coordinates[1]
    ];
    // Convert the DMS (Degree, Minute, Second) coordinates to decimal coordinates
    const newEdited = {
      ...editedValues,
      mrd_position: {
        ...editedValues.mrd_position,
        type: "Point", //added later
        coordinates: coordinates,
        //coordinates: DMStodecimal(editedValues.mrd_position.dms),
      },
    };
    // Update the  data state by replacing the item at the specified key/index with the new edited item
    setMissionDetail((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setMissionDetailDataKey("");
    missionDetailForm.resetFields();
  };

  // Function to handle Jetty data form submission
  const onMissionDetailDataFinish = async () => {
    const validatedValues = await missionDetailForm.validateFields();
    // console.log("validatedValues ", validatedValues)
    const coordinates = [
      validatedValues.mrd_position.lng,
      validatedValues.mrd_position.lat
      //validatedValues.mrd_position.coordinates[0],
      //validatedValues.mrd_position.coordinates[1]
    ];
    // Convert DMS (Degree, Minute, Second) coordinates to decimal coordinates
    // validatedValues.mrd_position = {
    //   ...validatedValues.mrd_position,
    //   coordinates: DMStodecimal(validatedValues.mrd_position.dms),
    // };
    if (validatedValues) {
      // Update the  data state by adding a new item with the validated values
      setMissionDetail((current) => [
        ...current,
        {
          ...validatedValues,
          mrd_position: {
            ...validatedValues.mrd_position,
            type: "Point",
            coordinates: coordinates,
            //coordinates: DMStodecimal(validatedValues.mrd_position.dms),
          },
        },
      ]);
     
      showToastSuccess('Mission  Detail data added');
      setShowInputs({ ...showInputs, missionDetailColumns: false });
      missionDetailForm.resetFields();
    }
  };

  const missionDetailsDataColumns = [
    {
      title: "Vessel Type",
      dataIndex: "mrd_vessel_type",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              placeholder="Vessel Type"
              name={"mrd_vessel_type"}
              options={mission_details_vessel_type.map((item) => ({
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
      title: "Vessel Name",
      dataIndex: "mrd_vessel_name",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mrd_vessel_name"
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
      title: "Date Time",
      dataIndex: "mrd_dtg",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          // return (
          <StyledInput>
            <DateBox
              style={{ width: 180 }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{
                defaultValue: dayjs("00:00:00", "HH:mm:ss"),
              }}
              name="mrd_dtg"
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
      title: "Longitude",
      key: "longitude",
      dataIndex: "mrd_position",
      width: 250,
      //dataIndex: ["mrd_position", "dms", 0],
      render: (text, record, index) => {
        if (
          (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox 
              //name={["mrd_position", "dms", 0]}
              //name={["mrd_position", "coordinates", 0]}
              style={{width: 80}}
              name={"mrd_position"} 
              initialvalue={record?.mrd_position?.coordinates[0]} coordinate={0}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]} />
            </StyledInput>
          );
        } else {
          //return record?.mrd_position ? positiontoDMS(text) : text;
          return record?.mrd_position ? text.coordinates[0] : text;
        }
      },
    },
    {
      title: "Latitude",
      key: "latitude",
      dataIndex: "mrd_position",
      width: 250,
      //dataIndex: ["mrd_position", "coordinates"],
      //dataIndex: ["mrd_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox 
              //name={["mrd_position", "dms", 1]} 
              //name={["mrd_position", "coordinates", 1]}  
              //name={["mrd_position", "lat"]} 
              name={"mrd_position"}
              style={{width: 80}}
              initialvalue={record?.mrd_position?.coordinates[1]}
              coordinate={1} 
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}/>
            </StyledInput>
          );
        } else {
          //return record?.mrd_position ? positiontoDMS(text) : text;
          //return record?.mrd_position ? text.coordinates[1] : text;
          return record?.mrd_position ? record.mrd_position.coordinates[1] : text;
        }
      },
    },
    {
      title: "Course",
      dataIndex: "mrd_course",
      ellipsis: false,
      width: 200,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="mrd_course"
              style={{ width: 100 }}
              type="number"
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      title: "Speed",
      dataIndex: "mrd_speed",
      ellipsis: false,
      width: 200,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="mrd_speed"
              type="number"
              style={{ width: 100 }}
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      title: "MMSI",
      dataIndex: "mrd_mmsi",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // Conditionally render an input field or existing text
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mrd_mmsi"
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
                },
                {
                  len: 9,
                  message: "MMSI must be exactly 9 digits!",
                },
                {
                  pattern: /^\d+$/,
                  message: "MMSI must contain only digits!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          // If conditions not met, render the existing text
          text
        );
      },
    },
    {
      title: "NPOC",
      dataIndex: "mrd_npoc",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mrd_npoc"
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      title: "LPOC",
      dataIndex: "mrd_lpoc",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mrd_lpoc"
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      title: "Activity Description",
      dataIndex: "mrd_act_desc",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mrd_act_desc"
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      title: "AIS Status",
      dataIndex: "mrd_ais_status",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mrd_ais_status"
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      title: "Call Details",
      dataIndex: "mrd_call_details",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mrd_call_details"
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      title: "Response",
      dataIndex: "mrd_response",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mrd_response"
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      title: "Remarks",
      dataIndex: "mrd_remarks",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mrd_remarks"
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      width: 250,
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
          if (isMissionDetailDataEditing(index)) {
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
      },
    },
  ];

  return (
    <div className="mb-10">
      <AntdTable
        form={missionDetailForm}
        onFinish={onMissionDetailDataFinish}
        columns={missionDetailsDataColumns}
        data={
          showInputs.missionDetailColumns
            ? [{}, ...missionDetail]
            : missionDetail
        }
        // titletext="Mission Details"
        // btnTitle="Add Mission Details"
        titletext="Merchant Vessel Observed"
        showButton={showButtons}
        btnTitle="Add Merchant Vessel"
        onBtnClick={handleMissionDataColumnShowInput}
        btndisabled={missionDetailDataKey !== ""}
      />
    </div>
  );
}

export default MissionDetailDataTable;
