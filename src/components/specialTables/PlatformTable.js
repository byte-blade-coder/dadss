import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SelectBox from "../form/SelectBox";
import styled from "styled-components";
import InputBox from "../form/InputBox";
import { Table, Form, Modal } from "antd";
import FilledButton from "../button/FilledButton";
import { useForm } from "antd/lib/form/Form";
import dayjs from "dayjs";
import Heading from "../title/Heading";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import DateBox from "../form/DateBox";
import InputNumBox from "../form/InputNumBox";
import SimpleButton from "../button/SimpleButton";
import Cookies from "js-cookie";
function PlatformTable(props) {
  const { data, platformData, setPlatformData, showButtons } = props;
  const [platformForm] = useForm();
  const [platformEditingKey, setPlatformEditingKey] = useState("");
  const [showInputs, setShowInputs] = useState({
    platformColumns: false,
  });
  const isplatformEditing = (record) => record.key === platformEditingKey;
  const [platformEditedData, setPlatformEditedData] = useState();
  const ownPlatformColumns = [
    {
      title: "Platform ID",
      dataIndex: "sr_pf_id",
    },
    {
      title: "DTG",
      dataIndex: "sr_dtg",
      render: (text, record, index) => {
        if (record.sr_dtg) {
          const dtg = dayjs(record.sr_dtg).format("YYYY-MM-DD HH:mm:ss");
          if (isplatformEditing(record)) {
            return (
              <StyledInput>
                <DateBox
                  style={{ width: 180 }}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{
                    defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                  }}
                  name="sr_dtg"
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
            return record.sr_dtg.$H
              ? dtg
              : React.isValidElement(text)
              ? text
              : dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          }
        }
      },
    },
    {
      title: "Longitude",
      dataIndex: ["sr_position", "coordinates", 0],
      render: (text, record, index) => {
        return isplatformEditing(record) ? (
          <StyledInput>
            <InputBox
              placeholder="Longitude"
              name={["sr_position", "coordinates", 0]}
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
      title: "Latitude",
      dataIndex: ["sr_position", "coordinates", 1],
      render: (text, record, index) => {
        if (isplatformEditing(record)) {
          return (
            <StyledInput>
              <InputBox
                placeholder="Latitude"
                name={["sr_position", "coordinates", 1]}
                rules={[
                  {
                    required: true,
                    message: "Required Field!",
                  },
                ]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Patrol Type",
      dataIndex: "sr_patroltype",
      render: (text, record, index) => {
        if (isplatformEditing(record)) {
          return (
            <StyledInput>
              <SelectBox
                placeholder="Patrol Type"
                name="sr_patroltype"
                options={[
                  { value: "Anti-Poaching", label: "Anti-Poaching" },
                  { value: "Anti-Narco", label: "Anti-Narco" },
                  {
                    value: "Anti Human Trafficking",
                    label: "Anti Human Trafficking",
                  },
                  { value: "Law Enforcement", label: "Law Enforcement" },
                  { value: "SAR", label: "SAR" },
                ]}
                rules={[
                  { required: true, message: "Please select a patrol type!" },
                ]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Action type",
      dataIndex: "sr_action",
      render: (text, record, index) => {
        if (isplatformEditing(record)) {
          return (
            <StyledInput>
              <SelectBox
                placeholder="Action Type"
                name="sr_action"
                options={[
                  { value: "Query", label: "Query" },
                  { value: "Boarding", label: "Boarding" },
                  { value: "Apprehension", label: "Apprehension" },
                ]}
                rules={[
                  { required: true, message: "Please select a action type!" },
                ]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Fuel Remaining",
      dataIndex: "sr_fuelrem",
      render: (text, record, index) => {
        if (isplatformEditing(record)) {
          return (
            <StyledInput>
              <InputNumBox
                placeholder="Fuel"
                name="sr_fuelrem"
                type="number"
                rules={[
                  {
                    required: true,
                    message: "Required Field!",
                  },
                ]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Other Info.",
      dataIndex: "sr_info",
      render: (text, record, index) => {
        if (isplatformEditing(record)) {
          return (
            <StyledInput>
              <InputBox
                placeholder="Info"
                name="sr_info"
                rules={[
                  {
                    required: true,
                    message: "Required Field!",
                  },
                ]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        if (showInputs.platformColumns && index === 0) {
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
        if (platformData.length > 1 && !isplatformEditing(record)) {
          return (
            <IconsStylingWrap>
              <MdModeEditOutline
                className="editIcon"
                onClick={() => setPlatformEditingKey(record.key)}
              />
              <MdDelete
                onClick={() => handlePlatformDataDelete(record)}
                className="deleteIcon"
              />
            </IconsStylingWrap>
          );
        }
        if (isplatformEditing(record)) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={() => setPlatformEditingKey("")}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  // onClick={onVesselFinish}
                  onClick={() => platformDataEdited(record.key)}
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
        if (data.sr_pf_id) {
          return (
            <IconsStylingWrap>
              <MdModeEditOutline
                className="editIcon"
                onClick={() => setPlatformEditingKey(record.key)}
              />
              {/* <MdDelete
                    onClick={() => handlePlatformDataDelete(record)}
                    className="deleteIcon"
                  /> */}
            </IconsStylingWrap>
          );
        }
      },
    },
  ];
  const handlePlatformDataDelete = (record) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setPlatformData((prev) => prev.filter((item) => record.key !== 0));
      },
    });
  };
  const platformDataEdited = (key) => {
    const editedValues = platformForm.getFieldValue();
    if (data) {
      // dispatch(fetchFishingById({ ...data, editedValues }));
      const newData = {
        ...editedValues,
        sr_pf_id: Cookies.get("u_pf_id"),
      };

      setPlatformEditedData(newData);
      setPlatformEditingKey("");
    } else {
      const newEdited = {
        ...editedValues,
        sr_pf_id: Cookies.get("u_pf_id"),
        sr_dtg: editedValues.sr_dtg.toISOString(),
        sr_position: {
          ...editedValues.sr_position,
          type: "Point",
        },
      };
      setPlatformData((previous) => {
        const newItems = [...previous];
        newItems[1] = newEdited;
        return newItems;
      });
      setPlatformEditingKey("");
    }

  };
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
  const handleOwnPlatformShowInput = () => {
    setShowInputs({ ...showInputs, platformColumns: true });
  };
  const onPlatformFinish = async (values) => {
    const validatedValues = await platformForm.validateFields();
    if (validatedValues) {
      setPlatformData((prev) => [
        ...prev,
        {
          ...validatedValues,
          sr_pf_id: Cookies.get("u_pf_id"),
          sr_dtg: validatedValues.sr_dtg.toISOString(),
          sr_position: {
            ...validatedValues.sr_position,
            type: "Point",
          },
        },
      ]);
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
    }
  };
  return (
    <Form form={platformForm} onFinish={onPlatformFinish}>
      <div className="mb-5 flex">
        <Heading
          level={5}
          text="Own Platform Data"
          className="whitespace-nowrap "
        />
        {showButtons && (
          <FilledButton
            disabled={data && platformData.length > 1 ? true : false}
            style={{ marginLeft: "auto" }}
            text="+ Add Own Platform Data"
            className="rounded-full border-midnight bg-midnight text-white"
            onClick={handleOwnPlatformShowInput}
          />
        )}
      </div>
      <section className="shadow border-tableborder border-2 mb-12 rounded-md">
        <Table
          columns={ownPlatformColumns}
          dataSource={
            platformEditedData
              ? [platformEditedData]
              : data.sr_pf_id
              ? [data]
              : showInputs.platformColumns
              ? platformData
              : platformData.length > 1
              ? platformData
                  .map((item, index) => ({
                    ...item,
                    key: index,
                  }))
                  .slice(1)
              : [
                  {
                    sr_pf_id: Cookies.get("u_pf_id"),
                  },
                ]
          }
          pagination={false}
        />
      </section>
    </Form>
  );
}

export default PlatformTable;

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
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
