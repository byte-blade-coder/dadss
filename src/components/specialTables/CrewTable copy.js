import { useEffect, useState } from "react";
import { Col, Row, Table, Input, Form, InputNumber, Modal, Button, Upload, Image } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import { UploadOutlined } from '@ant-design/icons';
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete, MdOutlineDone, MdRemoveRedEye} from "react-icons/md";
import React from "react";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import PositionBox from "../form/PositionBox";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import { Select, Typography } from "antd";
import AntdTable from "../table/AntdTable";
import isValidImages from "../../utils/notEmptyNullCheck.js"
import FormTable from "../table/FromTable";
const { Title } = Typography;

const StyledInput = styled.div`
  width: 100%;
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function CrewTable(props) {
  const { crewData, setCrewData, showButtons, labelConfig, className, coireport,fileList, sreport, add, onRemove  } = props;
  console.log(crewData)
  const [crewForm] = useForm();
  const [imageFiles, setImageFiles] = useState(null);
  const [crewKey, setCrewKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    crewColumns: false,
  });

  const handleCrewColumnShowInput = () => {
    crewForm.resetFields();
    setShowInputs({ ...showInputs, crewColumns: true });
  };

  const handleCrewCancel = (event) => {
    event.preventDefault();
    // Modal.confirm({
    //   title: `Are you sure, you want don't want to add data?`,
    //   okText: "Yes",
    //   okType: "danger",
    //   centered: "true",
    //   onOk: () => {
    //     setShowInputs({ ...showInputs, crewColumns: false });
    //   },
    // });
    setShowInputs({ ...showInputs, crewColumns: false });
    crewForm.resetFields();
  };

  const handleCrewDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setCrewData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    crewForm.resetFields();
  };

  const isCrewEditing = (record_index) => record_index === crewKey;

  const crewDataEdited = (key) => {
    const editedValues = crewForm.getFieldValue();
    console.log("crewData[key]", crewData[key], key)
    
    const newEdited = {
      ...editedValues,
      // src_images: imageFiles!==null ? {srci_image: imageFiles} : {},
      src_images: imageFiles ? {srci_image: imageFiles} : crewData[key].src_images,
    };
    
    console.log("New edited", newEdited)
    setCrewData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      setImageFiles(null);
      return newItems;
    });
    setCrewKey("");
    crewForm.resetFields();
  };

  const onCrewFinish = async () => {
    const validatedValues = await crewForm.validateFields();
    console.log("onFinish", validatedValues,imageFiles)

    if (validatedValues) {
      setCrewData((current) => [
        ...current,
        
        {
          ...validatedValues,
          ssrp_type: "Crew",
          src_images: imageFiles!==null ? {srci_image: imageFiles} : {}
        },
      ]);
      toast.success(`Crew data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, crewColumns: false });     
      console.log('before saving Owner fields', crewForm.getFieldsValue(), "\Images", imageFiles)
      crewForm.resetFields();
      setImageFiles(null);
      console.log('after saving Owner fields', crewForm.getFieldsValue(), "\Images", imageFiles)
    }
  };


  const handleImageDelete = (index, imgKey) => {
    console.log(imgKey)
    Modal.confirm({
      title: `Are you sure, you want to delete this image?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // If the user confirms, update the state to remove the image at the specified index
        setCrewData((prev) => {
          console.log(prev);
          const newItems = [...prev];
          newItems[index].src_images = null; // Set the image to null to delete it
          return newItems;
        });
        if(imgKey)
        {
          console.log("We can delete this now.")
          onRemove(imgKey);
        }
      },
    });
  };

  // Function to handle the upload of an image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFiles(file);
  };

  const reportKeysCoi = 
    {
      name: "ssrp_name",
      nationality: "ssrp_nationality",
      idtype: "ssrp_idtype",
      id: "ssrp_cnic",
      idexpdt: "ssrp_idexpdt",
      ethnicity: "ssrp_ethnicity",
      share: "ssrp_share",
      cell: "ssrp_mobileno"
    }
  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        name: "src_name",
        nationality: "src_nationality",
        idtype: "src_idtype",
        id: "src_id",
        idexpdt: "src_idexpdt",
        ethnicity: "src_ethnicity",
        cell: "src_cell",
        total: "sb_crew",
        image: "src_images",
      };
  const commonColumns = props.coireport === true ?
  [
    {
      title: "Name",
      ellipsis: false,
      key: "name",
      width: 250,
      dataIndex: reportKeysCoi.name,
     render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          // <StyledInput>
            <InputBox
              style={{ width: 180 }}
              placeholder="Name"
              // name="src_name"
              name={reportKeysCoi.name}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          // </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Nationality",
      ellipsis: false,
      key: "nationality",
      width: 250,
      dataIndex: reportKeysCoi.nationality,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Nationality"
              name={reportKeysCoi.nationality}
              rules={null}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
  ] : [
    {
      title: "Name",
      ellipsis: false,
      key: "name",
      width: 250,
      dataIndex: reportKeys.name,

      // filters: extractUniqueValues(crewData, reportKeys.name),
      // sorter: (a, b) => a[reportKeys.name].localeCompare(b[reportKeys.name]),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[reportKeys.name].includes(value),

      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          // <StyledInput>
            <InputBox
              style={{ width: 220 }}
              placeholder="Name"
              // name="src_name"
              name={reportKeys.name}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          // </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Nationality",
      ellipsis: false,
      key: "nationality",
      width: 250,
      dataIndex: reportKeys.nationality,

      // filters: extractUniqueValues(crewData, reportKeys.nationality),
      // sorter: (a, b) => a[reportKeys.nationality].localeCompare(b[reportKeys.nationality]),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[reportKeys.nationality].includes(value),
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          // <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Nationality"
              // name="src_nationality"
              name={reportKeys.nationality}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          // </StyledInput>
        ) : (
          text
        );
      },
    },
  ];

  const additionalColumn1 = props.coireport === true ?
  [
    {
      title: "ID Type",
      ellipsis: false,
      width: 250,
      key: "idtype",
      dataIndex: reportKeysCoi.idtype,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="ID Type"
              // name="src_idtype"
              name={reportKeysCoi.idtype}
              rules={coireport ? null : [
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
      title: "ID Number",
      ellipsis: false,
      width: 250,
      key: "id",
      dataIndex: reportKeysCoi.id,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="ID"
              // name="src_id"
              name={reportKeysCoi.id}
              rules={coireport ? null : [
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
      title: "ID Exp. Date",
      ellipsis: false,
      width: 250,
      key: "idexpdt",
      dataIndex: reportKeysCoi.idexpdt,
      render: (text, record, index) => {
        if ((showInputs.crewColumns && index === 0) | isCrewEditing(index)) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 150 }}
                format="YYYY-MM-DD"
                name={reportKeysCoi.idexpdt}
                rules={coireport ? null : [
                  {
                    required: true,
                    message: "Please select a date!",
                  },
                ]}
              />
            </StyledInput>
          );
        } else {
          // return record?.src_idexpdt ? dayjs(text).format("YYYY-MM-DD") : text;
          return record?.[reportKeysCoi.idexpdt]
            ? dayjs(text).format("YYYY-MM-DD")
            : text;
        }
      },
    },
    {
      title: "Ethnicity",
      ellipsis: false,
      width: 250,
      key: "ethnicity",
      dataIndex: reportKeysCoi.ethnicity,
       render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Ethinicity"
              style={{ width: 150 }}
              name={reportKeysCoi.ethnicity}
              rules={coireport ? null : [
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
      title: "Mobile Number",
      key: "cell",
      // sorter: (a, b) => a[reportKeys.cell] - b[reportKeys.cell], // Numerical comparison
      ellipsis: false,
      width: 250,
      dataIndex: reportKeysCoi.cell,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="0332-4324223"
              style={{ width: 150 }}
              name={reportKeysCoi.cell}
              pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
              rules={[
                {
                  pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                  message: "Please enter a valid mobile number!",
                },
                {
                  pattern: /^\d{11}$/,
                  message: "Please enter a valid 11-digit mobile number!",
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
      key: "action",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // if (showButtons) {
          if (showInputs.crewColumns && index === 0) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleCrewCancel}
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
                    onClick={onCrewFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (!showInputs.crewColumns) {
              if (isCrewEditing(index)) {
                return (
                  <Form.Item>
                    <div style={{ display: "flex" }}>
                      <SimpleButton
                        onClick={() => {
                          setCrewKey("");
                          crewForm.resetFields();
                        }}
                        style={{
                          fontWeight: "bold",
                        }}
                        text="Cancel"
                      />
                      <SimpleButton
                        onClick={() => {
                          crewDataEdited(index);
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
              } else if (showButtons){
                return (
                  <IconsStylingWrap>
                    <MdModeEditOutline
                      className="editIcon"
                      onClick={() => {
                        setCrewKey(index);
                        crewForm.setFieldsValue(record);
                        crewForm.resetFields;
                      }}
                    />
                    <MdDelete
                      onClick={() => handleCrewDelete(index)}
                      className="deleteIcon"
                    />
                  </IconsStylingWrap>
                );
              }
            }
          }
        }
      },
    // },
  ] : [
    {
      title: "ID Type",
      ellipsis: false,
      width: 250,
      key: "idtype",
      dataIndex: reportKeys.idtype,
      // filters: extractUniqueValues(crewData, reportKeys.idtype),
      // sorter: (a, b) =>
      //   a[reportKeys.idtype].localeCompare(b[reportKeys.idtype]),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[reportKeys.idtype].includes(value),
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="ID Type"
              // name="src_idtype"
              name={reportKeys.idtype}
              // rules={coireport ? null : [
              //   {
              //     required: true,
              //     message: "Required Field!",
              //   },
              // ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "ID Number",
      ellipsis: false,
      width: 250,
      key: "id",
      // filters: extractUniqueValues(crewData, reportKeys.id),
      // sorter: (a, b) =>
      //   a[reportKeys.id].localeCompare(b[reportKeys.id]),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[reportKeys.id].includes(value),

      dataIndex: reportKeys.id,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="ID"
              // name="src_id"
              name={reportKeys.id}
              // rules={coireport ? null : [
              //   {
              //     required: true,
              //     message: "Required Field!",
              //   },
              // ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "ID Exp. Date",
      ellipsis: false,
      width: 250,
      key: "idexpdt",
      // sorter: (a, b) => a[reportKeys.idexpdt] - b[reportKeys.idexpdt], // Numerical comparison

      dataIndex: reportKeys.idexpdt,
      render: (text, record, index) => {
        if ((showInputs.crewColumns && index === 0) | isCrewEditing(index)) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 150 }}
                format="YYYY-MM-DD"
                name={reportKeys.idexpdt}
                // rules={coireport ? null : [
                //   {
                //     required: true,
                //     message: "Please select a date!",
                //   },
                // ]}
              />
            </StyledInput>
          );
        } else {
          // return record?.src_idexpdt ? dayjs(text).format("YYYY-MM-DD") : text;
          return record?.[reportKeys.idexpdt]
            ? dayjs(text).format("YYYY-MM-DD")
            : text;
        }
      },
    },
    {
      title: "Ethnicity",
      ellipsis: false,
      width: 250,
      key: "ethnicity",
      dataIndex: reportKeys.ethnicity,

      // filters: extractUniqueValues(crewData, reportKeys.ethnicity),
      // sorter: (a, b) =>
      //   a[reportKeys.ethnicity].localeCompare(b[reportKeys.ethnicity]),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[reportKeys.ethnicity].includes(value),
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Ethinicity"
              style={{ width: 150 }}
              name={reportKeys.ethnicity}
              // rules={coireport ? null : [
              //   {
              //     required: true,
              //     message: "Required Field!",
              //   },
              // ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Picture Upload",
      dataIndex: add? "src_images" : reportKeys.image,
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        console.log(record, text, index, showInputs.crewColumns, record.src_images, !record.src_images,isCrewEditing(index))
        return (showInputs.crewColumns && index === 0) |
          (isCrewEditing(index) && record.src_images) ? (
            <input
              style={{ width: 200 }}
              type="file"
              name={sreport ? "srci_image" : "rci_image"}
              accept=".png,.jpg,.jpeg,.gif,.tiff,.jfif"
              onChange={handleImageUpload}
            />
          ) : (
          <div>
            {text && (isValidImages(record.src_images)) ? (
              console.log("here",record),
              <div>
                {/* Display the uploaded picture or show "No picture" if no picture is present */}
                <IconsStylingWrap>
                <ImagePreviews>
                {
                  <span>
                    {console.log("ImagePreviews", record.src_images)}
                    {(record.src_images?.srci_image === null) ? (
                      <p>No Picture</p>
                    ) : (typeof record.src_images[0]?.srci_image === 'string') ? (
                      <Image
                        src={record.src_images[0].srci_image}
                        alt="Crew"
                        style={{ maxWidth: "80px", maxHeight: "80px" }}
                      />
                    ) : (
                      <div className="imgUp">
                        <p>Uploaded</p>
                        <span><MdOutlineDone /></span>
                      </div>
                    )}
                  </span>
                }
                </ImagePreviews>

                  {isCrewEditing(index) ? (
                    console.log("Deletion Arr", record?.[reportKeys.image]),
                        // Display delete icon only when the row is being edited
                        <MdDelete
                          onClick={() => handleImageDelete(index,  record?.[reportKeys.image].srci_key)}
                          className="deleteIcon"
                        />
                      ) : null}
                </IconsStylingWrap>
              </div>
            ) : (
              console.log("NOO"),
              isCrewEditing(index) ? (
                <input
                  style={{ width: 200 }}
                  type="file"
                  name={sreport ? "srci_image" : "rci_image"}
                  accept=".png,.jpg,.jpeg,.gif,.tiff,.jfif"
                  onChange={handleImageUpload}
                />
              ) : (
              // Display "No picture" if no picture is present
              <span>No picture</span>)
            )}
          </div>
        );
      },
    },
    {
      title: "Mobile Number",
      key: "cell",
      // sorter: (a, b) => a[reportKeys.cell] - b[reportKeys.cell], // Numerical comparison
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.cell,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
           <InputBox
              placeholder="0332-4324223"
              style={{ width: 150 }}
              name={reportKeys.cell}
              pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
                {
                  pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                  message: "Please enter a valid mobile number!",
                },
                {
                  pattern: /^\d{11}$/,
                  message: "Please enter a valid 11-digit mobile number!",
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
      key: "action",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // if (showButtons) {
          if (showInputs.crewColumns && index === 0) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleCrewCancel}
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
                    onClick={onCrewFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (!showInputs.crewColumns) {
              if (isCrewEditing(index)) {
                return (
                  <Form.Item>
                    <div style={{ display: "flex" }}>
                      <SimpleButton
                        onClick={() => {
                          setCrewKey("");
                          crewForm.resetFields();
                        }}
                        style={{
                          fontWeight: "bold",
                        }}
                        text="Cancel"
                      />
                      <SimpleButton
                        onClick={() => {
                          crewDataEdited(index);
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
              } else if (showButtons){
                return (
                  <IconsStylingWrap>
                    <MdModeEditOutline
                      className="editIcon"
                      onClick={() => {
                        setCrewKey(index);
                        crewForm.setFieldsValue(record);
                        crewForm.resetFields;
                      }}
                    />
                    <MdDelete
                      onClick={() => handleCrewDelete(index)}
                      className="deleteIcon"
                    />
                  </IconsStylingWrap>
                );
              }
            }
          }
        }
      },
    // },
  ];

  const additionalColumn2 = [
    {
      key: "action",
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        // if (showButtons) {
          if (showInputs.crewColumns && index === 0) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleCrewCancel}
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
                    onClick={onCrewFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (!showInputs.crewColumns) {
              if (isCrewEditing(index)) {
                return (
                  <Form.Item>
                    <div style={{ display: "flex" }}>
                      <SimpleButton
                        onClick={() => {
                          setCrewKey("");
                          crewForm.resetFields();
                        }}
                        style={{
                          fontWeight: "bold",
                        }}
                        text="Cancel"
                      />
                      <SimpleButton
                        onClick={() => {
                          crewDataEdited(index);
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
              } else {
                return (
                  <IconsStylingWrap>
                    <MdModeEditOutline
                      className="editIcon"
                      onClick={() => {
                        setCrewKey(index);
                        crewForm.setFieldsValue(record);
                        crewForm.resetFields;
                      }}
                    />
                    <MdDelete
                      onClick={() => handleCrewDelete(index)}
                      className="deleteIcon"
                    />
                  </IconsStylingWrap>
                );
              }
            }
          }
        }
      },
    // },
  ];

  const crewColumns = [
    ...commonColumns,
    ...(labelConfig === "page1" ? additionalColumn1 : []),
    ...(labelConfig === "page2" ? additionalColumn2 : []),
  ];
  return (
    <div className="mb-10">
      <AntdTable
        columns={crewColumns}
        data={showInputs.crewColumns ? [{}, ...crewData] : crewData}
        pagination={true}
        className={className} // Use the className prop here
        form={crewForm}
        onFinish={onCrewFinish}
        titletext="Crew Details"
        showButton={showButtons}
        btnTitle="Add Crew Details"
        onBtnClick={handleCrewColumnShowInput}
        btndisabled={crewKey !== ""}
      />
    </div>
  );
}

export default CrewTable;
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
    border-radius: 10px;
    font-size: 20px;
    padding: 3px;
    cursor: pointer;
  }
`;

const ImagePreviews = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  //margin-top: -6px;

  .image-preview {
    position: relative;
    width: 50px;
    height: 40px;
  }

  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 3px;
    margin-bottom: 0.2rem;
  }

  .image-preview .ant-image img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .image-preview .ant-form-item{
    width: 2.2rem !important;
    margin-right: 0rem !important;
    margin-bottom: 0px !important;
  }

  .image-preview .ant-form-item .ant-row .ant-col .ant-form-item-control-input{
    width: 2rem !important;
    margin-right: 1px !important;
  }

  .text-and-btn{
    display: flex;
    flex-direction: row;
  }
  .imgUp{
    display: flex;
  }

  .imgUp span{
    margin-top: 0.17rem;
    margin-left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%; 
    background-color: green;
    color: white;
    font-size: 16px;
  }

`;


const StyledUpload = styled.div`
  .ant-upload.ant-upload-select
  {
    width: 106px !important;
    height: 36px !important;
    //display: none;
    margin-inline-end: 8px;
    margin-bottom: 1px;
    border: none !important;
  }
  .ant-upload.ant-upload-select .ant-btn
  {
    width: 5.2rem !important;
    height: 1.4rem !important;
    display: flex;
    padding: 2px 10px 4px 10px;
  }

  .ant-upload.ant-upload-select .ant-btn .textUp
  {
    font-size: 12px;
    margin-inline-start: 2px;
  }

  .ant-upload.ant-upload-select .ant-btn .anticon-upload
  {
    font-size: 14px;
  }
`;