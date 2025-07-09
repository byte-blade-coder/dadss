import { useState } from "react";
import { Col, Row, Table, Form, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import AntdTable from "./AntdTable";
import FormTable from "./FromTable";

const MacroDataTable = (props) => {
  const { intelMacroData, setIntelMacroData, init_macro_data, showButtons } =
    props;

  // Checking if `props.reportKeys` is provided, otherwise using default values
  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        ir_id: "ir_id",
        name: "ir_reporter_name",
        reporting_time: "ir_reporting_time",
        jetty: "ir_jetty",
        t_boats: "ir_total_boats",
        pf_id: "ir_pf_id",
      };

  // Destructures `macroDataEntered` from props into `macroDataEntered` and `setMacroDataEntered`.

  //  macroDataEntered: A boolean variable indicating whether the macro data has been entered or not.
  // setMacroDataEntered: A function that can be used to update the value of macroDataEntered.
  const { macroDataEntered, setMacroDataEntered } = props.intelMacroDataState;

  const [macroDataForm] = useForm();

  // State for managing the visibility of different input sections
  const [showInputs, setShowInputs] = useState({
    macroDataColumns: false,
    macroData_editing: false,
  });

  // Function to handle cancelling the addition of macro data
  const handleMacroDataCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, macroDataColumns: false });
      },
    });
  };

  // Function to handle deleting macro data
  const handleMacroDataDelete = (record) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // Reset the macro data to the initial state (empty or default values)
        setIntelMacroData(init_macro_data);
        // Set the flag to indicate that macro data has not been entered
        setMacroDataEntered(false);
      },
    });
  };

  const macroDataEdited = () => {
    const editedValues = macroDataForm.getFieldValue();
    if (editedValues) {
      // Update the macro data state by merging the previous state with the edited values
      setIntelMacroData((prev) => ({ ...prev, ...editedValues }));
    }
    //Set showInputs to hide the editing interface after the data is edited
    setShowInputs({ ...showInputs, macroData_editing: false });
  };

  // Function to show input fields for adding macro data
  const handleMacroDataShowInput = () => {
    macroDataForm.resetFields();
    setShowInputs({ ...showInputs, macroDataColumns: true });
  };

  // Function to handle form submission for adding macro data
  const onMacroDataFinish = async () => {
    const validatedValues = await macroDataForm.validateFields();
    // Check if there are validated values
    if (validatedValues) {
      setIntelMacroData({
        ...validatedValues,
        ir_pf_id: init_macro_data.ir_pf_id,
        intelreportdetails: [],
      });

      toast.success(`Macro data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, macroDataColumns: false });
      setMacroDataEntered(true);
    }
  };

  const ownMacroDataFormColumns = [
    // text would be the value of the "Date Time" column for the current row.
    // record would be the entire data record for the current row.
    // index would be the index of the current row in the dataset.
    {
      title: "Platform ID",
      dataIndex: reportKeys.pf_id,
      ellipsis: false,
      width: 250,
    },
    {
      title: "Reporter Name",
      dataIndex: reportKeys.name,
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // Check if in edit mode or adding new data
          showInputs.macroDataColumns | showInputs.macroData_editing ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="name"
              name={reportKeys.name}
              rules={[
                {
                  required: false,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          // Return text for display if valid data entered
          text
        );
      },
    },
    {
      title: "Reporting Time ",
      dataIndex: reportKeys.reporting_time,
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (showInputs.macroDataColumns | showInputs.macroData_editing) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 180 }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name={reportKeys.reporting_time}
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
          // Return text for display if valid data entered
          return macroDataEntered
            ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") // Formatted date if data is entered
            : text; // Original text if no data is entered
        }
      },
    },
    {
      title: "Jetty Name",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.jetty,
      render: (text, record, index) => {
        return showInputs.macroDataColumns | showInputs.macroData_editing ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name={reportKeys.jetty}
              rules={[
                {
                  required: false,
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
      title: "Total Boats",
      dataIndex: reportKeys.t_boats,
      render: (text, record, index) => {
        return showInputs.macroDataColumns | showInputs.macroData_editing ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              placeholder="Total Jetty"
              name={reportKeys.t_boats}
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
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (showInputs.macroDataColumns) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleMacroDataCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onMacroDataFinish}
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
        if (macroDataEntered && !showInputs.macroData_editing) {
          return (
            <IconsStylingWrap>
              <MdModeEditOutline
                className="editIcon"
                onClick={() =>
                  setShowInputs({ ...showInputs, macroData_editing: true })
                }
              />
              <MdDelete
                onClick={() => handleMacroDataDelete(record)}
                className="deleteIcon"
              />
            </IconsStylingWrap>
          );
        }
        if (showInputs.macroData_editing) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={() =>
                    setShowInputs({ ...showInputs, macroData_editing: false })
                  }
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={() => macroDataEdited()}
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
      },
    },
  ];

  return (
    <div className="mb-10">
      <Row>
        <Col span={12}>
          <Heading
            className="whitespace-nowrap ml-5 flex justify-start"
            level={5}
            text="Intel Macro Data"
          />
        </Col>
        <Col span={12} className=" flex justify-end">
          {/* {showButtons && ( */}
            <>
              <FilledButton
                disabled={macroDataEntered}
                text="+ Add Intel Macro Data"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                onClick={handleMacroDataShowInput}
              />
              <FilledButton
                disabled={macroDataEntered}
                text="+ Add "
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                onClick={handleMacroDataShowInput}
              />
            </>
          {/* )} */}
        </Col>
      </Row>
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <FormTable
        scrollConfig={{ x: true }}
        form={macroDataForm}
        onFinish={onMacroDataFinish}
        columns={ownMacroDataFormColumns}
        data={[intelMacroData]}
        pagination={false}
      />
    </div>
  );
};

export default MacroDataTable;
// Styled component for custom styling

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
