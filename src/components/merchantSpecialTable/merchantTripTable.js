import { useState } from "react";
import { Col, Row, Form, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import { movement_list, port_list } from "../../helper/dropdown";
import AntdTable from "../table/AntdTable";

function MerchantTripTable(props) {
  const { tripData, setTripData, showButtons } = props;
  // Destructures `tripDataState` from props into `tripDataEntered` and `setTripDataEntered`.

  //  tripDataEntered: A boolean variable indicating whether the platform data has been entered or not.
  // setTripDataEntered: A function that can be used to update the value of platformDataEntered.
  const { tripDataEntered, setTripDataEntered } = props.tripDataState;

  //form
  const [tripForm] = useForm();

  // State for managing the visibility of different input sections
  const [showInputs, setShowInputs] = useState({
    tripColumns: false,
    trip_editing: false,
  });

  // Function to handle cancelling the addition of tri pData
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

  // Function to handle deleting trip data
  const handleTripDataDelete = (record) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // Reset the platform data to the initial state (empty or default values)
        setTripData();
        // Set the flag to indicate that platform data has not been entered
        setTripDataEntered(false);
      },
    });
    tripForm.resetFields();
  };

  const tripDataEdited = () => {
    const editedValues = tripForm.getFieldValue();
    // Check if there are edited values (this condition is always true because editedValues will be an object)
    if (editedValues) {
      // Update the tripData state with the edited values
      setTripData(editedValues);
    }
    //Set showInputs to hide the editing interface after the data is edited
    setShowInputs({ ...showInputs, trip_editing: false });
  };

  // Function to show input fields for adding trip data
  const handleTripShowInput = () => {
    tripForm.resetFields();
    setShowInputs({ ...showInputs, tripColumns: true });
  };

  // Function to handle form submission for adding trip data
  const onTripFinish = async () => {
    const validatedValues = await tripForm.validateFields();
    // Check if there are validated values
    if (validatedValues) {
      setTripData({
        // Spread the newly validated form values
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
    }
  };

  const tripColumns = [
    // text would be the value of the "Date Time" column for the current row.
    // record would be the entire data record for the current row.
    // index would be the index of the current row in the dataset.
    {
      key: "msr2_lpoc",
      title: "LPOC",
      dataIndex: "msr2_lpoc",
      ellipsis: false,
      width: 250,
      render: (text, record) => {
        // Conditionally render an input field based on 'showInputs' state
        return showInputs.tripColumns | showInputs.trip_editing ? (
          // Render an input field if 'showInputs.tripColumns' or 'showInputs.trip_editing' is truthy
          <StyledInput>
            <SelectBox
              placeholder="LPOC"
              style={{ width: 150 }}
              name="msr2_lpoc"
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
          // Render the existing text if 'showInputs.tripColumns' and 'showInputs.trip_editing' are both falsy
          // Return text for display if valid data entered
          text
        );
      },
    },
    {
      key: "msr2_lpocdtg",

      title: "LPOC Date",
      dataIndex: "msr2_lpocdtg",
      ellipsis: false,
      width: 250,
      render: (text, record) => {
        if (showInputs.tripColumns | showInputs.trip_editing) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 150 }}
                format="YYYY-MM-DD"
                name="msr2_lpocdtg"
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
      key: "msr2_npoc",
      title: "NPOC",
      dataIndex: "msr2_npoc",
      ellipsis: false,
      width: 250,
      render: (text, record) => {
        return showInputs.tripColumns | showInputs.trip_editing ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              placeholder="NPOC"
              name="msr2_npoc"
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
      key: "msr2_npoceta",
      title: "NPOC ETA",
      dataIndex: "msr2_npoceta",
      ellipsis: false,
      width: 250,
      render: (text, record) => {
        if (showInputs.tripColumns | showInputs.trip_editing) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 150 }}
                format="YYYY-MM-DD"
                name="msr2_npoceta"
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
      key: "msr_movement",

      title: "Movement",
      dataIndex: "msr_movement",
      ellipsis: false,
      width: 250,
      render: (text, record) => {
        return showInputs.tripColumns | showInputs.trip_editing ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              name="msr_movement"
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
      key: "action",

      title: "",
      dataIndex: "action",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // if (showButtons) {
          // Check if 'showInputs.tripColumns' is true
          if (showInputs.tripColumns) {
            // Render buttons for cancel and save if 'showInputs.tripColumns' is true
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
            // Check if 'showInputs.trip_editing' is true
            if (showInputs.trip_editing) {
              // Render buttons for cancel and edit if 'showInputs.trip_editing' is true
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
              // Check if 'tripDataEntered' is true
              return tripDataEntered ? (
                // Render icons for editing and potentially deleting if 'tripDataEntered' is true
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
            className="whitespace-nowrap ml-5"
            level={5}
            text="Trip Details"
          />
        </Col>
        <Col span={12} className="flex justify-end">
          {/* {showButtons && ( */}
          <>
            <FilledButton
              text="+ Add Trip Details"
              className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
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

export default MerchantTripTable;
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

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
