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
import { useDispatch } from "react-redux";
import { addPnscReport } from "../../redux/thunks/jmisPnscUploadData";
import AntdTable from "./AntdTable";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

function PnscTable(props) {
  const dispatch = useDispatch();

  const { pnscReport, setPnscReport } = props;
  const [pnscReportForm] = useForm();
  const [pnscReportKey, setPnscReportKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    pnscReportColumn: false,
  });

  const handlePnscReportColumnShowInput = () => {
    pnscReportForm.resetFields();
    setShowInputs({ ...showInputs, pnscReportColumn: true });
    pnscReportForm.setFieldValue(["ps_position", "dms", 0, "dir"], "E");
    pnscReportForm.setFieldValue(["ps_position", "dms", 1, "dir"], "N");
  };

  const handlePnscReportColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, pnscReportColumn: false });
      },
    });
  };

  const handlePnscReportDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setPnscReport((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    pnscReportForm.resetFields();
  };

  const isPnscReportEditing = (record_index) => record_index === pnscReportKey;

  const pnscReportEdited = (key) => {
    const editedValues = pnscReportForm.getFieldValue();
    const newEdited = {
      ...editedValues,
      ps_position: {
        ...editedValues.ps_position,
        type: "Point",
        coordinates: DMStodecimal(editedValues.ps_position.dms),
      },
    };
    setPnscReport((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setPnscReportKey("");
    pnscReportForm.resetFields();
  };

  const onPnscReportFinish = async () => {
    const validatedValues = await pnscReportForm.validateFields();
    // Log the data
    if (validatedValues) {
      setPnscReport((current) => [
        ...current,
        {
          ...validatedValues,

          ps_position: {
            ...validatedValues.ps_position,
            type: "Point",
            coordinates: DMStodecimal(validatedValues.ps_position.dms),
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
      setShowInputs({ ...showInputs, pnscReportColumn: false });
      pnscReportForm.resetFields();
    }
  };

  const sendPnscReport = async () => {
    try {
      const finalData = pnscReport;
      // Dispatch the action with the data
      dispatch(addPnscReport(finalData));
      setPnscReport([]);
    } catch (error) {}
  };

  const pnscReportColumn = [
    {
      key: "ps_timestamp",
      title: "Time Stamp",
      dataIndex: "ps_timestamp",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // If in editing mode or first row and column is visible
        if (
          (showInputs.pnscReportColumn && index === 0) ||
          isPnscReportEditing(index)
        ) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 150 }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name="ps_timestamp"
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
          // If pnscReport is available and text is not null, format the date
          if (pnscReport && text !== null) {
            return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          } else {
            // Otherwise, display "No Date"
            return "No Date";
          }
        }
      },
    },
    {
      key: "mv_imo",
      title: "IMO",
      dataIndex: "mv_imo",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
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
      key: "mv_ais_type_summary",
      title: "Type",
      dataIndex: "mv_ais_type_summary",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
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
      dataIndex: ["ps_position", "dms", 0],
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (
          (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["ps_position", "dms", 0]} coordinate={0} />
            </StyledInput>
          );
        } else {
          return record?.ps_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Latitude",
      key: "latitude",
      dataIndex: ["ps_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["ps_position", "dms", 1]} coordinate={1} />
            </StyledInput>
          );
        } else {
          return record?.ps_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      key: "ps_country",
      title: "Country",
      dataIndex: "ps_country",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="ps_country"
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
      key: "ps_status_symbol",
      title: "Status Symbol",
      ellipsis: false,
      width: 250,

      dataIndex: "ps_status_symbol",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="ps_status_symbol"
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
      key: "ps_status_symbol_remarks",
      title: "Status Symbol Remarks",
      dataIndex: "ps_status_symbol_remarks",
      ellipsis: false,
      width: 250,

      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="ps_status_symbol_remarks"
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
      key: "ps_status_symbol_assigned_time",
      title: "Status Symbol Assigned Time",
      dataIndex: "ps_status_symbol_assigned_time",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // If in editing mode or first row and column is visible
        if (
          (showInputs.pnscReportColumn && index === 0) ||
          isPnscReportEditing(index)
        ) {
          return (
            <StyledInput>
              <DateBox
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: 150 }}
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name="ps_status_symbol_assigned_time"
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
          // If pnscReport is available and text is not null, format the date
          if (pnscReport && text !== null) {
            return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          } else {
            // Otherwise, display "No Date"
            return "No Date";
          }
        }
      },
    },
    {
      key: "ps_track_number",
      title: "Track Number",
      ellipsis: false,
      width: 250,
      dataIndex: "ps_track_number",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              name="ps_track_number"
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
      key: "ps_course",
      title: "Course",
      dataIndex: "ps_course",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              name="ps_course"
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
      key: "ps_speed",
      title: "Speed",
      dataIndex: "ps_speed",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="ps_speed"
              type="number"
              style={{ width: 150 }}
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
      key: "ps_lastport",
      title: "Last Port",
      dataIndex: "ps_lastport",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_lastport"
              style={{ width: 150 }}
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
      key: "ps_next_port",
      title: "Next Port",
      dataIndex: "ps_next_port",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_next_port"
              style={{ width: 150 }}
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
      key: "ps_track_label",
      title: "Track Label",
      dataIndex: "ps_track_label",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_track_label"
              style={{ width: 150 }}
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
      title: "Track Type",
      key: "ps_track_type",
      dataIndex: "ps_track_type",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_track_type"
              style={{ width: 150 }}
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
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (showInputs.pnscReportColumn && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handlePnscReportColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onPnscReportFinish}
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
        if (!showInputs.pnscReportColumn) {
          if (pnscReport.length && !isPnscReportEditing(index)) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setPnscReportKey(index);
                    pnscReportForm.setFieldsValue(record);
                  }}
                  disable={showInputs.pnscReportColumn}
                />
                <MdDelete
                  onClick={() => handlePnscReportDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isPnscReportEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setPnscReportKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      pnscReportEdited(index);
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
      <Row className="items-center mb-4">
        <Col span={6}></Col>
        <Col span={18} className="flex justify-end mt-4 mb-3">
          <FilledButton
            disabled={pnscReport.length == 0}
            style={{ marginLeft: "auto" }}
            text="Save Report"
            onClick={sendPnscReport}
            className="rounded-full border-lightgreen bg-lightgreen text-white mr-6"
          />
        </Col>
        <Col span={24} className="flex justify-between mb-3 ">
          <Heading
            level={5}
            className="  whitespace-nowrap ml-5"
            text="PNSC Report"
          />
          <FilledButton
            text="+ Add PNSC Report"
            className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
            onClick={handlePnscReportColumnShowInput}
            disabled={pnscReport.length === 0 && !showInputs.pnscReportColumn}
          />
          <FilledButton
            text="+ Add "
            className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
            onClick={handlePnscReportColumnShowInput}
            disabled={pnscReport.length === 0 && !showInputs.pnscReportColumn}
          />
        </Col>
      </Row>
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scrollConfig={{ x: true }} // Set the scroll property as per your requirements
        columns={pnscReportColumn}
        data={showInputs.pnscReportColumn ? [{}, ...pnscReport] : pnscReport}
        pagination={true}
        form={pnscReportForm}
        onFinish={onPnscReportFinish}
      />
    </div>
  );
}

export default PnscTable;

const StyledDiv = styled.div`
padding:60px,
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
