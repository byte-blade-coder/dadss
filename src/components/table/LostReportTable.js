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
import { addLostReport } from "../../redux/thunks/jmisLostReportUploadData";
import AntdTable from "./AntdTable";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

function LostReportTable(props) {
  const dispatch = useDispatch();

  const { lostReport, setLostReport } = props;
  const [lostReportForm] = useForm();
  const [lostReportKey, setLostReportKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    lostReportColumn: false,
  });

  const handleLostReportColumnShowInput = () => {
    lostReportForm.resetFields();
    setShowInputs({ ...showInputs, lostReportColumn: true });
    lostReportForm.setFieldValue(["lr_position", "dms", 0, "dir"], "E");
    lostReportForm.setFieldValue(["lr_position", "dms", 1, "dir"], "N");
  };

  const handleLostReportColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, lostReportColumn: false });
      },
    });
  };

  const handleLostReportDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setLostReport((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    lostReportForm.resetFields();
  };

  const isLostReportEditing = (record_index) => record_index === lostReportKey;

  const lostReportEdited = (key) => {
    const editedValues = lostReportForm.getFieldValue();
    const newEdited = {
      ...editedValues,
      lr_position: {
        ...editedValues.lr_position,
        type: "Point",
        coordinates: DMStodecimal(editedValues.lr_position.dms),
      },
    };
    setLostReport((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setLostReportKey("");
    lostReportForm.resetFields();
  };

  const onLostReportFinish = async () => {
    const validatedValues = await lostReportForm.validateFields();
    if (validatedValues) {
      setLostReport((current) => [
        ...current,
        {
          ...validatedValues,

          lr_position: {
            ...validatedValues.lr_position,
            type: "Point",
            coordinates: DMStodecimal(validatedValues.lr_position.dms),
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
      setShowInputs({ ...showInputs, lostReportColumn: false });
      lostReportForm.resetFields();
    }
  };

  const sendLostReport = async () => {
    try {
      // const finalData = lostReport.map((report) => ({
      //   ...report,
      //   lr_position: {
      //     ...report.lr_position,
      //     type: "Point",
      //     coordinates: DMStodecimal(report.lr_position.dms),
      //   },
      // }));

      // Extracting only coordinates
      const coordinatesOnly = lostReport.map((report) => ({
        ...report,
        lr_position: {
          type: "Point",
          coordinates: [
            report.lr_position.coordinates[0],
            report.lr_position.coordinates[1],
          ],
        },
      }));
      // Dispatch the action with the data
      dispatch(addLostReport(coordinatesOnly));
      setLostReport([]);
    } catch (error) {
      // Handle the error
    }
  };

  const lostReportColumn = [
    {
      key: "lr_reporting_date",
      title: "Reporting DTG",
      dataIndex: "lr_reporting_date",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // If in editing mode or first row and column is visible
        if (
          (showInputs.lostReportColumn && index === 0) ||
          isLostReportEditing(index)
        ) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 180 }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name="lr_reporting_date"
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
          // If lost data is available and text is not null, format the date
          if (lostReport && text !== null) {
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
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="mv_imo"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
                {
                  pattern: /^[0-9]+$/, // Regex to allow only numbers
                  message: "Please enter a valid number!",
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
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
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
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
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
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
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
      key: "lr_total_crew",
      title: "Total Crew ",
      ellipsis: false,
      width: 250,
      dataIndex: "lr_total_crew",
      render: (text, record, index) => {
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              name="lr_total_crew"
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
      key: "lr_track_status",
      title: "Track Status",
      ellipsis: false,
      width: 250,

      dataIndex: "lr_track_status",
      render: (text, record, index) => {
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="lr_track_status"
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
      key: "lr_created_on",
      title: "Created On",
      dataIndex: "lr_created_on",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // If in editing mode or first row and column is visible
        if (
          (showInputs.lostReportColumn && index === 0) ||
          isLostReportEditing(index)
        ) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 180 }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name="lr_created_on"
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
          // If lost data is available and text is not null, format the date
          if (lostReport && text !== null) {
            return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          } else {
            // Otherwise, display "No Date"
            return "No Date";
          }
        }
      },
    },
    {
      key: "lr_created_by",
      title: "Created By",
      ellipsis: false,
      width: 250,

      dataIndex: "lr_created_by",
      render: (text, record, index) => {
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="lr_created_by"
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
      key: "longitude",
      title: "Longitude",
      dataIndex: ["lr_position", "dms", 0],
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (
          (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["lr_position", "dms", 0]} coordinate={0} />
            </StyledInput>
          );
        } else {
          return record?.lr_position ? positiontoDMS(text) : text;
        }
      },
    },

    {
      key: "latitude",
      title: "Latitude",
      dataIndex: ["lr_position", "dms", 1],
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (
          (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["lr_position", "dms", 1]} coordinate={1} />
            </StyledInput>
          );
        } else {
          return record?.lr_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      key: "lr_remarks",
      title: "Remarks",
      dataIndex: "lr_remarks",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="lr_remarks"
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
      key: "lr_coi_number",
      title: "COI Number",
      ellipsis: false,
      width: 250,

      dataIndex: "lr_coi_number",
      render: (text, record, index) => {
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              name="lr_coi_number"
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
      key: "lr_subscriber_code",
      title: "Subscriber Code",
      ellipsis: false,
      width: 250,

      dataIndex: "lr_subscriber_code",
      render: (text, record, index) => {
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="lr_subscriber_code"
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
      key: "lr_pr_number",
      title: "PR Number",
      ellipsis: false,
      width: 250,

      dataIndex: "lr_pr_number",
      render: (text, record, index) => {
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="lr_pr_number"
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
      key: "lr_action_addresses_codes",
      title: "Action Address Code",
      ellipsis: false,
      width: 250,

      dataIndex: "lr_action_addresses_codes",
      render: (text, record, index) => {
        return (showInputs.lostReportColumn && index === 0) |
          isLostReportEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              name="lr_action_addresses_codes"
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
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (showInputs.lostReportColumn && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleLostReportColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onLostReportFinish}
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
        if (!showInputs.lostReportColumn) {
          if (lostReport.length && !isLostReportEditing(index)) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setLostReportKey(index);
                    lostReportForm.setFieldsValue(record);
                  }}
                  disable={showInputs.lostReportColumn}
                />
                <MdDelete
                  onClick={() => handleLostReportDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isLostReportEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setLostReportKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      lostReportEdited(index);
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
            disabled={lostReport.length == 0}
            style={{ marginLeft: "auto" }}
            text="Save Report"
            onClick={sendLostReport}
            className="rounded-full border-lightgreen bg-lightgreen text-white mr-6"
          />
        </Col>
        <Col span={24} className="flex justify-between mb-3 ">
          <Heading
            level={5}
            className="whitespace-nowrap ml-5"
            text="Lost Report"
          />

          <FilledButton
            text="+ Add Lost Report"
            className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
            onClick={handleLostReportColumnShowInput}
            disabled={lostReport.length === 0 && !showInputs.lostReportColumn}
          />
          <FilledButton
            text="+ Add "
            className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
            onClick={handleLostReportColumnShowInput}
            disabled={lostReport.length === 0 && !showInputs.lostReportColumn}
          />
        </Col>
      </Row>
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scrollConfig={{ x: true }}
        columns={lostReportColumn}
        data={showInputs.lostReportColumn ? [{}, ...lostReport] : lostReport}
        pagination={true}
        form={lostReportForm}
        onFinish={onLostReportFinish}
      />
    </div>
  );
}

export default LostReportTable;

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
