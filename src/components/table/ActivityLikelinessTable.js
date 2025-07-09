import { useState } from "react";
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
import { Likeliness, patrol_type_list } from "../../helper/dropdown";
import { Col, Row } from "antd";
import AntdTable from "./AntdTable";
import { Form } from "antd";

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

function ActivityLikelinessTable(props) {
  const { activtyData, setactivtyData, showButtons } = props;
  const [activityLikelinessForm] = useForm();
  const [activityKey, setActivitKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    activityLikelinessColumn: false,
  });
  const handleActvityLikelinessColumnShowInput = () => {
    activityLikelinessForm.resetFields();
    setShowInputs({ ...showInputs, activityLikelinessColumn: true });
  };
  const handleActvityLikelinessColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, activityLikelinessColumn: false });
      },
    });
  };

  const handleActvityLikelinessDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setactivtyData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    activityLikelinessForm.resetFields();
  };

  const isActvityLikelinessEditing = (record_index) =>
    record_index === activityKey;

  const actvityLikelinessEdited = (key) => {
    const editedValues = activityLikelinessForm.getFieldValue();
    const newEdited = {
      ...editedValues,
    };
    setactivtyData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setActivitKey("");
    activityLikelinessForm.resetFields();
  };

  const onActvityLikelinessFinish = async () => {
    const validatedValues = await activityLikelinessForm.validateFields();
    if (validatedValues) {
      setactivtyData((current) => [
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
      setShowInputs({ ...showInputs, activityLikelinessColumn: false });
      activityLikelinessForm.resetFields();
    }
  };

  const Columns = [
    {
      key: "activity",
      title: "Activity",
      dataIndex: "Activity",
      render: (text, record, index) => {
        return (showInputs.activityLikelinessColumn && index === 0) |
          isActvityLikelinessEditing(index) ? (
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
              options={patrol_type_list.map((item) => ({
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
      title: "Likeliness",
      key: "likeliness",
      dataIndex: "Fuel",
      render: (text, record, index) => {
        return (showInputs.activityLikelinessColumn && index === 0) |
          isActvityLikelinessEditing(index) ? (
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
              options={Likeliness.map((item) => ({
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
      title: "",
      key: "action",
      dataIndex: "action",
      render: (text, record, index) => {
        if (showInputs.activityLikelinessColumn && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleActvityLikelinessColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onActvityLikelinessFinish}
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
        if (!showInputs.activityLikelinessColumn) {
          if (activtyData.length && !isActvityLikelinessEditing(index)) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setLimitOpsKey(index);
                    limitOpsForm.setFieldsValue(record);
                  }}
                  disable={showInputs.activityLikelinessColumn}
                />
                <MdDelete
                  onClick={() => handleActvityLikelinessDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }

          if (isActvityLikelinessEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setActivitKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      actvityLikelinessEdited(index);
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
              className=" whitespace-nowrap ml-5 flex justify-start "
              level={5}
              text="Activity Likeliness "
            />
          </Col>
          <Col span={12} className="flex justify-end">
            {showButtons && (
              <>
                <FilledButton
                  text="+ Activity Likeliness"
                  className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                  onClick={handleActvityLikelinessColumnShowInput}
                  disabled={activityKey !== ""}
                />
                <FilledButton
                  text="+ Add"
                  className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                  onClick={handleActvityLikelinessColumnShowInput}
                  disabled={activityKey !== ""}
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
          data={
            showInputs.activityLikelinessColumn
              ? [{}, ...activtyData]
              : activtyData
          }
          pagination={false}
          form={activityLikelinessForm}
          onFinish={onActvityLikelinessFinish}
        />
      </div>
    </>
  );
}

export default ActivityLikelinessTable;

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
