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
import { EditOutlined, CloseOutlined } from "@ant-design/icons";

const StyledInput = styled.div`
  width: 100%;
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function CrewTable(props) {
  const { crewData, setCrewData, showButtons, labelConfig, className, coireport,fileList, sreport, add, onRemove , tempDeletedImages, setTempDeletedImages   } = props;
  // console.log(crewData)
  const [crewForm] = useForm();
  const [imageFiles, setImageFiles] = useState(null);
  const [crewKey, setCrewKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    crewColumns: false,
  });
  const [showPreview, setShowPreview] = useState({});

  const handlePreviewOpen = (key) => {
    setShowPreview((prev) => ({ ...prev, [key]: true }));
  };
  
  const handlePreviewClose = (key) => {
    setShowPreview((prev) => ({ ...prev, [key]: false }));
  };

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
    // console.log("crewData[key]", crewData[key], key)
    
    const newEdited = {
      ...editedValues,
      // src_images: imageFiles!==null ? {srci_image: imageFiles} : {},
      // src_images: imageFiles ? {srci_image: imageFiles} : crewData[key].src_images,
      src_images: tempDeletedImages.length > 0 ? [] : imageFiles ? {srci_image: imageFiles} : crewData[key].src_images,
    };
    
    // console.log("New edited", newEdited)
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
    // console.log("onFinish", validatedValues,imageFiles)

    if (validatedValues) {
      setCrewData((current) => [
        ...current,
        
        {
          ...validatedValues,
          ssrp_type: "Crew",
          src_images: imageFiles!==null ? {srci_image: imageFiles, src_temp_key: `temp_${Date.now()}`} : {}
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
      crewForm.resetFields();
      setImageFiles(null);
    }
  };


  const handleImageDelete = (index, imgKey) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this image?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // If the user confirms, update the state to remove the image at the specified index
        setCrewData((prev) => {
          const newItems = [...prev];
          setTempDeletedImages((prevImages) => [...prevImages, { index, key: imgKey, type: "src_images", value: newItems[index].src_images }]);
          newItems[index].src_images = null; // Set the image to null to delete it
            setImageFiles(null);
          return newItems;
        });
        // if(imgKey)
        // {
        //   onRemove(imgKey);
        // }
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

  const generateCommonColumns = (reportKeys, coireport) => {
    const columnDefinitions = [
      { key: reportKeys.name, title: "Name", placeholder: "Name" },
      { key: reportKeys.nationality, title: "Nationality", placeholder: "Nationality" },
    ]
  
    return columnDefinitions.map(({ key, title, placeholder, type }) => ({
      key,
      title,
      ellipsis: false,
      width: 250,
      dataIndex: key,
      render: (text, record, index) => {
      if ((showInputs.crewColumns && index === 0) || isCrewEditing(index)) {
        return (
          <StyledInput>
              <InputBox
                style={{ width: "100%" }}
                placeholder={placeholder}
                name={key}
                rules={coireport ? null : [{ required: true, message: "Required Field!" }]}
              />
          </StyledInput>
        );
      } else {
        return text;
      }
      },
    }));
  };
  
  const generateAdditional1Columns = (reportKeys, coireport) => {
    const columnDefinitions = [
      { key: reportKeys.idtype, title: "ID Type", placeholder: "ID Type", type: "text" },
      { key: reportKeys.id, title: "ID Number", placeholder: "ID Number", type: "text" },
      { key: reportKeys.idexpdt, title: "ID Exp. Date", type: "date" },
      { key: reportKeys.ethnicity, title: "Ethnicity", placeholder: "Ethnicity", type: "text" },
      ...(!coireport
        ? [{ key: "picture_upload", title: "Picture Upload", type: "file" }]
        : []),
      { key: reportKeys.cell, title: "Mobile Number", placeholder: "Mobile Number", type: "cell" },
      { title: "", key: "action", dataIndex: "action", type: "action"   },
    ];
  
    return columnDefinitions.map(({ key, title, placeholder, type }) => ({
      key,
      title,
      ellipsis: false,
      width: type === "action" ? 100 : 250,
      dataIndex: key,
      render: (text, record, index) => {
        if(type==="action")
        {
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
                          if (tempDeletedImages && tempDeletedImages.length > 0) {
                      
                            // Restore deleted images
                            setCrewData((prev) => {
                              const newItems = [...prev];
                              tempDeletedImages.forEach(({ index, type, value }) => {
                                newItems[index][type] = value; // Restore the deleted image
                              });
                              return newItems;
                            });
                      
                            // Clear temp storage
                            setTempDeletedImages([]);
                          }
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
              } else if(showButtons){
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
        else{
          if(type==="file")
          {
            // console.log(record, text,"\n", "Record for psicture", reportKeys.image,reportKeys.picture,
            // !record?.[reportKeys.image]?.[0]?.[reportKeys.picture], "\nPIcture", record?.[reportKeys.image], "\n", showInputs.crewColumns, index, isCrewEditing(index) && (record?.[reportKeys.image]))
          return (showInputs.crewColumns && index === 0) |
            (isCrewEditing(index) && (record?.[reportKeys.image])) ? (
                <input
                  style={{ width: "100%" }}
                  type="file"
                  name={sreport ? "srci_image" : "rci_image"}
                  accept=".png,.jpg,.jpeg,.gif,.tiff,.jfif"
                  onChange={handleImageUpload}
                />
            )  : 
            (
              <div>
              {(isValidImages(record.src_images)) ? (
                <>
                  {/* Display the uploaded picture or show "No picture" if no picture is present */}
                  <ImagePreviews>
                  {
                    <span>
                      {/* {console.log("ImagePreviews", record.src_images)} */}
                      {(record.src_images?.srci_image === null) ? (
                        <p>No Picture</p>
                      ) : (
                        <IconsStylingWrap>
                          <div className="imgUp">
                            <p>Uploaded</p>
                            <span onClick={() => handlePreviewOpen(record.src_key? record.src_key : record.src_images.src_temp_key)}  style={{ cursor: "pointer" }}><MdRemoveRedEye size={20} /></span>
                          </div>
                          
                          {record.src_key ? (
                            <Image
                              src={record?.src_images?.srci_image instanceof File  ? URL.createObjectURL(record.src_images.srci_image) 
                                : record?.src_images?.srci_image}
                              alt="Crew"
                              style={{ display: "none" }} // Hide the image, but allow preview
                              preview={{
                                visible: showPreview[record.src_key],
                                onVisibleChange: (visible) => handlePreviewClose(record.src_key),
                            }} />
                          ) : (
                            <Image
                            src={record?.src_images?.srci_image instanceof File  ? URL.createObjectURL(record.src_images.srci_image) 
                              : record?.src_images?.srci_image}
                            alt="Crew"
                            style={{ display: "none" }} // Hide the image, but allow preview
                            preview={{
                              visible: showPreview[record.src_images.src_temp_key],
                              onVisibleChange: (visible) => handlePreviewClose(record.src_images.src_temp_key),
                            }} />
                          )}
                        </IconsStylingWrap>
                      )}

                    </span>
                  }
                  </ImagePreviews>
  
                    {isCrewEditing(index) ? (
                      // console.log("Deletion Arr", record?.[reportKeys.image]),
                      // Display delete icon only when the row is being edited
                      <MdDelete
                        onClick={() => handleImageDelete(index,  record?.[reportKeys.image].srci_key)}
                        className="deleteIconImg"
                      />
                    ) : null}
                </>
              ) : (
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
            )
          }
          else{
            if ((showInputs.crewColumns && index === 0) || isCrewEditing(index)) {
              return (
                <StyledInput>
                  {type === "date" &&  (
                    <DateBox
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      name={key}
                      // rules={coireport ? null : [{ required: true, message: "Please select a date!" }]}
                    />
                  ) }
                  {type === "cell" && (
                      <InputBox
                        style={{ width: "100%" }}
                        placeholder={placeholder}
                        name={key}
                        rules={coireport ? [ { pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/, message: "Please enter a valid mobile number!",},
                        { pattern: /^\d{11}$/, message: "Please enter a valid 11-digit mobile number!",},] : 
                        [ { pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/, message: "Please enter a valid mobile number!",},
                          { pattern: /^\d{11}$/, message: "Please enter a valid 11-digit mobile number!",},
                          // { required: true, message: "Required Field!" },
                        ]}
                      />
                  )}
                  {type === "text" && (
                    <InputBox
                      style={{ width: "100%" }}
                      placeholder={placeholder}
                      name={key}
                      // rules={coireport ? null : [{ required: true, message: "Required Field!" }]}
                    />
                  )}
                </StyledInput>
              );
            } else {
              return type === "date" && record[key] ? dayjs(text).format("YYYY-MM-DD") : text;
            }
          }
        }
      },
    }));
  };

  const generateAdditional2Columns = (reportKeys, coireport) => {
    const columnDefinitions = [
      { title: "", key: "action", dataIndex: "action", type: "action"   },
    ];
  
    return columnDefinitions.map(({ key, title, placeholder, type }) => ({
      key,
      title,
      ellipsis: false,
      width: type === "action" ? 100 : 250,
      dataIndex: key,
      render: (text, record, index) => {
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
                        if (tempDeletedImages && tempDeletedImages.length > 0) {
                          // Restore deleted images
                          setCrewData((prev) => {
                            const newItems = [...prev];
                            tempDeletedImages.forEach(({ index, type, value }) => {
                              newItems[index][type] = value; // Restore the deleted image
                            });
                            return newItems;
                          });
                    
                          // Clear temp storage
                          setTempDeletedImages([]);
                        }
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
            } else if(showButtons){
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
      },
    }));
  };

 const commonColumns = props.coireport ? generateCommonColumns(reportKeysCoi, true) : generateCommonColumns(reportKeys, false);
 const additionalColumn1 = props.coireport ? generateAdditional1Columns(reportKeysCoi, true) : generateAdditional1Columns(reportKeys, false);
 const additionalColumn2 = props.coireport ? generateAdditional2Columns(reportKeysCoi, true) : generateAdditional2Columns(reportKeys, false);

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
    padding: 3px;2px 0px 0px 6px
    cursor: pointer;
  }

  .deleteIconImg {
    color: #e96162;
    // background-color: #f9e7e8;
    border-radius: 10px;
    font-size: 20px;
    padding: 2px;
    margin: 2px 0px 0px 6px;
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
    margin-top: 0.1rem;
    margin-left: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%; 
    background-color: white;
    color: #063970 !important;
    font-size: 16px;
  }
  .imgUp span : hover {
      cursor: pointer;
  }
`;