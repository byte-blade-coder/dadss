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
import PositionBox from "../form/PositionBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import { action_list, patrol_type_list } from "../../helper/dropdown";
import { positiontoDMS, DMStodecimal, DecimalCoord } from "../../helper/position";
import AntdTable from "./AntdTable";

function OwnPlatformTable(props) {
  const { platformData, setPlatformData, init_platform_data, showButtons } =
    props;
  // Checking if `props.reportKeys` is provided, otherwise using default values
  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        dtg: "gr_dtg",
        pf_id: "gr_pf_id",
        position: "gr_position",
        lat: "gr_position.lat",
        lng: "gr_position.lng",
        fuel: "gr_fuelrem",
        info: "gr_info",
        patrolType: "gr_patroltype",
        action: "gr_action",
      };

  // Destructures `platformDataState` from props into `platformDataEntered` and `setPlatformDataEntered`.

  //  platformDataEntered: A boolean variable indicating whether the platform data has been entered or not.
  // setPlatformDataEntered: A function that can be used to update the value of platformDataEntered.
  const { platformDataEntered, setPlatformDataEntered } =
    props.platformDataState;

  const [platformForm] = useForm();

  // State for managing the visibility of different input sections
  const [showInputs, setShowInputs] = useState({
    platformColumns: false,
    platform_editing: false,
  });

  // Function to handle cancelling the addition of platform data
  const handlePlatformCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, platformColumns: false });
      },
    });
  };

  // Function to handle deleting platform data
  const handlePlatformDataDelete = (record) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // Reset the platform data to the initial state (empty or default values)
        setPlatformData(init_platform_data);
        // Set the flag to indicate that platform data has not been entered
        setPlatformDataEntered(false);
      },
    });
  };

  const platformDataEdited = () => {
    const editedValues = platformForm.getFieldValue();

    const coordinates = [
      editedValues[reportKeys.position].lng,
      editedValues[reportKeys.position].lat
    ];
    editedValues[reportKeys.position] = {
      coordinates,
      type: "Point",
    };

    // Convert the DMS (Degree, Minute, Second) coordinates to decimal coordinates
    // editedValues[reportKeys.position] = {
    //   ...editedValues[reportKeys.position],
    //   //coordinates: DecimalCoord(editedValues[reportKeys.position].dms),
    //   coordinates: DMStodecimal(editedValues[reportKeys.position].dms),
    // };
    if (editedValues) {
      // Update the platform data state by merging the previous state with the edited values
      setPlatformData((prev) => ({ ...prev, ...editedValues }));
    }
    //Set showInputs to hide the editing interface after the data is edited
    setShowInputs({ ...showInputs, platform_editing: false });
  };

  // Function to show input fields for adding platform data
  const handlePlatformShowInput = () => {
    platformForm.resetFields();
    setShowInputs({ ...showInputs, platformColumns: true });
   //platformForm.setFieldValue([reportKeys.position, "dms", 0, "dir"], "E");
    //platformForm.setFieldValue([reportKeys.position, "dms", 1, "dir"], "N");
  };

  // Function to handle form submission for adding platform data
  const onPlatformFinish = async () => {
    const validatedValues = await platformForm.validateFields();
    // Convert DMS (Degree, Minute, Second) coordinates to decimal coordinates
    const coordinates = [
      validatedValues[reportKeys.position].lng,
      validatedValues[reportKeys.position].lat
    ];
    validatedValues[reportKeys.position] = {
      coordinates,
      type: "Point",
    };
    // validatedValues[reportKeys.position] = {
    //   ...validatedValues[reportKeys.position],
    //   coordinates:  validatedValues[reportKeys.position],
    //   //coordinates: DMStodecimal(validatedValues[reportKeys.position].dms),
    // };
    // Check if there are validated values
    if (validatedValues) {
      setPlatformData({
        // Spread the newly validated form values
        ...validatedValues,
        // Spread the existing values of platformData i.e. pf_id
        ...platformData,
      });
      toast.success(`Platform data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, platformColumns: false });
      setPlatformDataEntered(true);
    }
  };

  const ownPlatformColumns = [
    {
      key: "pf_id",
      title: "Platform ID",
      dataIndex: reportKeys.pf_id,
      ellipsis: false,
      width: 250,
    },
    {
      key: "dtg",
      title: "Date Time ",
      dataIndex: reportKeys.dtg,
      ellipsis: false,
      width: 250,
      // text would be the value of the "Date Time" column for the current row.
      // record would be the entire data record for the current row.
      // index would be the index of the current row in the dataset.
      render: (text, record, index) => {
        // Check if in edit mode or adding new data
        if (showInputs.platformColumns | showInputs.platform_editing) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 180 }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name={reportKeys.dtg}
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
          return platformDataEntered
            ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") // Formatted date if data is entered
            : text; // Original text if no data is entered
        }
      },
    },
    {
      key: "longitude",
      title: "Longitude",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.position,
      //dataIndex: [reportKeys.position, "lng"],
      //dataIndex: [reportKeys.position, "dms", 0],
      render: (text, record, index) => {
        if (showInputs.platformColumns | showInputs.platform_editing) {
          return (
            <StyledInput>
              <PositionBox
                //name={[reportKeys.position, "dms", 0]}
                name={[reportKeys.position]}
                coordinate={0}
              />
            </StyledInput>
          );
        } else {
          //return platformDataEntered ? positiontoDMS(text) : text;
          return platformDataEntered ? text.coordinates[0] : text ;
        }
      },
    },
    {
      key: "latitude",
      title: "Latitude",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.position,
      //dataIndex: [reportKeys.position, "lat"],
      //dataIndex: [reportKeys.position, "dms", 1],
      render: (text, record, index) => {
        if (showInputs.platformColumns | showInputs.platform_editing) {
          return (
            <StyledInput>
              <PositionBox
                //name={[reportKeys.position, "dms", 1]}
                name={[reportKeys.position]} 
                coordinate={1}
              />
            </StyledInput>
          );
        } else {
          //return platformDataEntered ? positiontoDMS(text) : text;
          return platformDataEntered ? text.coordinates[1] : text;
        }
      },
    },
    {
      key: "patrol type",

      title: "Patrol Type",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.patrolType,
      render: (text, record, index) => {
        return showInputs.platformColumns | showInputs.platform_editing ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              placeholder="Patrol Type"
              name={reportKeys.patrolType}
              options={patrol_type_list.map((item) => ({
                value: item,
                label: item,
              }))}
              rules={[
                { required: true, message: "Please select a patrol type!" },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "action type",

      title: "Action type",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.action,
      render: (text, record, index) => {
        return showInputs.platformColumns | showInputs.platform_editing ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              placeholder="Action Type"
              name={reportKeys.action}
              options={action_list.map((item) => ({
                value: item,
                label: item,
              }))}
              rules={[
                { required: true, message: "Please select a action type!" },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "fuel remainig",

      title: "Fuel Remaining",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.fuel,
      render: (text, record, index) => {
        return showInputs.platformColumns | showInputs.platform_editing ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              placeholder="Fuel"
              name={reportKeys.fuel}
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
      key: "other",

      title: "Other Info",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.info,
      render: (text, record, index) => {
        return showInputs.platformColumns | showInputs.platform_editing ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Info"
              name={reportKeys.info}
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
      key: "action",

      title: "",
      dataIndex: "action",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (showInputs.platformColumns) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handlePlatformCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onPlatformFinish}
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
        if (platformDataEntered && !showInputs.platform_editing) {
          // Render edit and delete icons if platform data is entered and not in editing mode
          return (
            <IconsStylingWrap>
              <MdModeEditOutline
                className="editIcon"
                onClick={() =>
                  setShowInputs({ ...showInputs, platform_editing: true })
                }
              />
              <MdDelete
                onClick={() => handlePlatformDataDelete(record)}
                className="deleteIcon"
              />
            </IconsStylingWrap>
          );
        }
        if (showInputs.platform_editing) {
          // Render buttons for editing platform data
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={() =>
                    setShowInputs({ ...showInputs, platform_editing: false })
                  }
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={() => platformDataEdited()}
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

  // Delete Action column for general report
  // The "Action" column will be deleted from ownPlatformColumns because "action" property is absent.
  if (!reportKeys?.action) {
    delete ownPlatformColumns[5];
  }

  return (
    <div className="mb-10">
      <Row>
        <Col span={12}>
          <Heading
            className=" whitespace-nowrap ml-5 flex justify-start "
            level={5}
            text="Own Platform Data"
          />
        </Col>
        <Col span={12} className="flex justify-end">
          {/* {showButtons && ( */}
          <>
            <FilledButton
              text="+ Add Own Platform "
              className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
              onClick={handlePlatformShowInput}
              disabled={platformDataEntered}
            />
            <FilledButton
              text="+ Add"
              className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
              onClick={handlePlatformShowInput}
              disabled={platformDataEntered}
            />
          </>
          {/* )} */}
        </Col>
      </Row>
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scrollConfig={{ x: true }}
        columns={ownPlatformColumns}
        data={[platformData]}
        pagination={false}
        form={platformForm}
        onFinish={onPlatformFinish}
      />
    </div>
  );
}

export default OwnPlatformTable;

// Styled component for custom styling
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
