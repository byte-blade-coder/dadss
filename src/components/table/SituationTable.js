import { useState } from "react";
import { Col, Row, Table, Form, Modal } from "antd";
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
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import PositionBox from "../form/PositionBox";
import { ais_type_summary } from "../../helper/dropdown";
import dayjs from "dayjs";
import DateBox from "../form/DateBox";
import { useDispatch, useSelector } from "react-redux";
import { addSituationReport } from "../../redux/thunks/situationUploadData";
import AntdTable from "./AntdTable";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

function SituationTable(props) {
  const dispatch = useDispatch();

  const { situationData, setSituationData } = props;
  const [situationForm] = useForm();
  const [situationReportKey, setSituationReportKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    situationColumns: false,
  });

  const handleSituationColumnShowInput = () => {
    situationForm.resetFields();
    setShowInputs({ ...showInputs, situationColumns: true });
    situationForm.setFieldValue(["sit_position", "dms", 0, "dir"], "E");
    situationForm.setFieldValue(["sit_position", "dms", 1, "dir"], "N");
  };

  const handleSituatioColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, situationColumns: false });
      },
    });
  };

  const handleSituationDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setSituationData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    situationForm.resetFields();
  };

  const isSituationEditing = (record_index) =>
    record_index === situationReportKey;

  const situationEdited = (key) => {
    const editedValues = situationForm.getFieldValue();
    const newEdited = {
      ...editedValues,
      sit_position: {
        ...editedValues.sit_position,
        type: "Point",
        coordinates: DMStodecimal(editedValues.sit_position.dms),
      },
    };
    setSituationData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setSituationReportKey("");
    situationForm.resetFields();
  };

  const onSituationFinish = async () => {
    const validatedValues = await situationForm.validateFields();
    if (validatedValues) {
      setSituationData((current) => [
        ...current,
        {
          ...validatedValues,

          sit_position: {
            ...validatedValues.sit_position,
            type: "Point",
            coordinates: DMStodecimal(validatedValues.sit_position.dms),
          },
        },
      ]);
      toast.success(`Data Added Successfully`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, situationColumns: false });
      situationForm.resetFields();
    }
  };

  const sendSituationalReprot = async () => {
    try {
      const finalData = situationData;
      dispatch(addSituationReport(finalData));

      setSituationData([]);
    } catch (error) {}
  };
  const situationColumns = [
    {
      title: "DTG",
      dataIndex: "sit_dtg",
      key: "sit_dtg",
      ellipsis: false,
      render: (text, record, index) => {
        // If in editing mode or first row and column is visible
        if (
          (showInputs.situationColumns && index === 0) ||
          isSituationEditing(index)
        ) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 150 }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name="sit_dtg"
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
          // If pnscData is available and text is not null, format the date
          if (situationData && text !== null) {
            return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          } else {
            // Otherwise, display "No Date"
            return "No Date";
          }
        }
      },
    },
    {
      title: "MMSI",
      key: "mv_mmsi",

      dataIndex: "mv_mmsi",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mv_mmsi"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
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
          text
        );
      },
    },
    {
      key: "mv_imo",
      title: "IMO",
      dataIndex: "mv_imo",
      ellipsis: false,
      width: 250,

      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mv_imo"
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
      key: "mv_ship_name",
      title: "Name",
      dataIndex: "mv_ship_name",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mv_ship_name"
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
      key: "mv_flag",
      title: "Flag",
      dataIndex: "mv_flag",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mv_flag"
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
      key: "mv_ais_type_summary",
      title: "Type",
      dataIndex: "mv_ais_type_summary",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              placeholder="Select Type"
              name={"mv_ais_type_summary"}
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
      key: "longitude",
      title: "Longitude",
      dataIndex: ["sit_position", "dms", 0],
      render: (text, record, index) => {
        if (
          (showInputs.situationColumns && index === 0) |
          isSituationEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["sit_position", "dms", 0]} coordinate={0} />
            </StyledInput>
          );
        } else {
          return record?.sit_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      key: "latitude",
      title: "Latitude",
      dataIndex: ["sit_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.situationColumns && index === 0) |
          isSituationEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["sit_position", "dms", 1]} coordinate={1} />
            </StyledInput>
          );
        } else {
          return record?.sit_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      key: "sit_lpoc",

      title: "LPOC",
      dataIndex: "sit_lpoc",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="sit_lpoc"
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
      key: "sit_last_port_country",
      title: "Last Port Country",
      dataIndex: "sit_last_port_country",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="sit_last_port_country"
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
      key: "sit_npoc",
      title: "NPOC",
      dataIndex: "sit_npoc",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="sit_npoc"
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
      key: "sit_next_port_country",
      title: "Next Port Country",
      dataIndex: "sit_next_port_country",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="sit_next_port_country"
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
      key: "sit_course",
      title: "Course",
      dataIndex: "sit_course",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              name="sit_course"
              //   min={1}
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
      key: "sit_speed",
      title: "Speed",
      dataIndex: "sit_speed",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              name="sit_speed"
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
      key: "sit_source",
      title: "Source",
      dataIndex: "sit_source",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="sit_source"
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
      key: "action",

      dataIndex: "action",
      width: 250,
      render: (text, record, index) => {
        if (showInputs.situationColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleSituatioColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onSituationFinish}
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
        if (!showInputs.situationColumns) {
          if (situationData.length && !isSituationEditing(index)) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setSituationReportKey(index);
                    situationForm.setFieldsValue(record);
                  }}
                  disable={showInputs.situationColumns}
                />
                <MdDelete
                  onClick={() => handleSituationDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isSituationEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setSituationReportKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      situationEdited(index);
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
        <Row className="items-center mb-4">
          <Col span={6}></Col>
          <Col span={18} className="flex justify-end mt-4 mb-3">
            <FilledButton
              disabled={situationData.length == 0}
              style={{ marginLeft: "auto" }}
              text="Save Report"
              onClick={sendSituationalReprot}
              className="rounded-full border-lightgreen bg-lightgreen text-white mr-6"
            />
          </Col>
          <Col span={24} className="flex justify-between mb-3 ">
            <Heading
              level={5}
              className="  whitespace-nowrap ml-5"
              text="Situation Report"
            />

            <FilledButton
              text="+ Add Situation Report"
              className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
              onClick={handleSituationColumnShowInput}
              // disabled={situationReportKey !== ""}
              disabled={
                situationData.length === 0 && !showInputs.situationColumns
              }
            />
            <FilledButton
              text="+ Add "
              className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
              onClick={handleSituationColumnShowInput}
              disabled={
                situationData.length === 0 && !showInputs.situationColumns
              }
            />
          </Col>
        </Row>
        {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
        <AntdTable
          form={situationForm}
          onFinish={onSituationFinish}
          scrollConfig={{ x: true }} // Set the scroll property as per your requirements
          columns={situationColumns}
          data={
            showInputs.situationColumns ? [{}, ...situationData] : situationData
          }
          pagination={true}
        />
      </div>
    </>
  );
}

export default SituationTable;

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
