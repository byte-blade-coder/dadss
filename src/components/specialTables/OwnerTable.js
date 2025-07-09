import { useEffect, useState } from "react";
import {
  Col,
  Row,
  Table,
  Input,
  Form,
  InputNumber,
  Modal,
  Button,
  Select,
  Upload,
  Image
} from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import { UploadOutlined } from '@ant-design/icons';
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete, MdOutlineDone,MdRemoveRedEye } from "react-icons/md";
import { GrView } from "react-icons/gr";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import AntdTable from "../table/AntdTable";
import CustomImageUpload from "../form/UploadBtn";
import isValidImages from "../../utils/notEmptyNullCheck.js"; 
import {deleteOwnerImage} from "../../redux/thunks/fishingVesselData.js";
import { text } from "d3";

function OwnerTable(props) {
  const { ownerData, setOwnerData, showButtons, coireport,fileList, sreport, add, state, onRemove, tempDeletedImages, setTempDeletedImages  } = props;
    // console.log(ownerData, state)
  const [ownerForm] = useForm();
  const [ownerKey, setOwnerKey] = useState("");
  const [imageFiles, setImageFiles] = useState(null);
  const [showInputs, setShowInputs] = useState({
    ownerColumns: false,
  });
  const [showPreview, setShowPreview] = useState({});
  
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

  const reportKeys = props.reportKeys === 'rvo' ?
  {
    name: "rvo_name",
    nationality: "rvo_nationality",
    idtype: "rvo_idtype",
    id: "rvo_id",
    idexpdt: "rvo_idexpdt",
    ethnicity: "rvo_ethnicity",
    share: "rvo_share",
    cell: "rvo_cell",
    image: add ? "roi_images" : "rvo_images",
    picture: "roi_image",
  } : {
    name: "sro_name",
    nationality: "sro_nationality",
    idtype: "sro_idtype",
    id: "sro_id",
    idexpdt: "sro_idexpdt",
    ethnicity: "sro_ethnicity",
    share: "sro_share",
    cell: "sro_cell",
    image: "sro_images",
    picture: "sroi_image",
  };

  const handlePreviewOpen = (key) => {
    setShowPreview((prev) => ({ ...prev, [key]: true }));
  };
  
  const handlePreviewClose = (key, text) => {
    setShowPreview((prev) => ({ ...prev, [key]: false }));
  };

  const handleOwnerColumnShowInput = () => {
    ownerForm.resetFields();
    setImageFiles(null);
    // console.log('Owner fields', ownerForm.getFieldsValue(), "\Images", imageFiles)
    setShowInputs({ ...showInputs, ownerColumns: true });
  };

   // Function to handle the deletion of an image
   const handleImageDelete = (index, imgKey) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this image?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // If the user confirms, update the state to remove the image at the specified index
        setOwnerData((prev) => {
          // console.log(prev);
          const newItems = [...prev];
          if(newItems[index].sro_images)
          { 
            setTempDeletedImages((prevImages) => [...prevImages, { index, key: imgKey, type: "sro_images", value: newItems[index].sro_images }]);
            newItems[index].sro_images = null;
            setImageFiles(null);
          }
          else if(newItems[index].rvo_images)
          {
            setTempDeletedImages((prevImages) => [...prevImages, { index, key: imgKey, type: "rvo_images", value: newItems[index].rvo_images }]);
            newItems[index].rvo_images = null;
            setImageFiles(null);
          }
          else 
          {
            setTempDeletedImages((prevImages) => [...prevImages, { index, key: imgKey, type: "roi_images", value: newItems[index].roi_images }]);
            newItems[index].roi_images = null;
            setImageFiles(null);
          }
          
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

  const handleOwnerCancel = (event) => {
    event.preventDefault();
    setShowInputs({ ...showInputs, ownerColumns: false });
    ownerForm.resetFields();
  };

  const handleOwnerDelete = (record_index) => {
    setOwnerData((prev) => {
      const updatedData = prev.filter((item, index) => index !== record_index);
      return updatedData; // Ensure the filtered data is returned
    });
    ownerForm.resetFields();
  };

  const isOwnerEditing = (record_index) => record_index === ownerKey;

  const ownerDataEdited = (key) => {
    const editedValues = ownerForm.getFieldValue();
    // console.log("editedValues", editedValues, imageFiles, "\nownerData[key]", ownerData[key], key)
    
    let newEdited;

    if (add) {
      newEdited = {
        ...editedValues,
        // roi_images: imageFiles!==null ? {roi_image: imageFiles} : {},
        roi_images: imageFiles ? { roi_image: imageFiles }: ownerData[key].roi_images,
      };
    }
    else if (state === "edit") {
      newEdited = {
        ...editedValues,
        // rvo_images: ownerData[key].rvo_images!==null ? {roi_image: imageFiles} : {},
        // rvo_images: imageFiles!==null ? {roi_image: imageFiles} : {},
        //tempDeletedImages.find((item) => item.index === key && item.type === "rvo_images") ? null : 
        rvo_images: tempDeletedImages.length > 0 ? [] : imageFiles ? { roi_image: imageFiles } 
        : ownerData[key].rvo_images,
        roi_images: imageFiles ? {roi_image: imageFiles} : ownerData[key].rvo_images,
      };
    }
    else {
      newEdited = {
        ...editedValues,
        //sro_images: ownerData[key].sro_images!==null ? {sroi_image: imageFiles} : {},
        // sro_images: imageFiles!==null ? {sroi_image: imageFiles} : {},
        sro_images: imageFiles ? {sroi_image: imageFiles}  : ownerData[key].sro_images,
      };
    }
    // console.log("New edited", newEdited)
    setOwnerData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setOwnerKey("");
    ownerForm.resetFields();
  };

  const onOwnerFinish = async () => {
    const validatedValues = await ownerForm.validateFields();
    // console.log("Owner row values", validatedValues)

    if (validatedValues) {
      if(add)
      {
        setOwnerData((current) => [
          ...current,
          {
            ...validatedValues,
            ssrp_type: "Owner",
            roi_images: imageFiles!==null ? {roi_image: imageFiles, roi_temp_key: `temp_${Date.now()}`} : {},
          },
        ]);
      }
      else if (state==="edit") {
        setOwnerData((current) => [
          ...current,
          {
            ...validatedValues,
            ssrp_type: "Owner",
            rvo_images: imageFiles!==null ? {roi_image: imageFiles, rvo_temp_key: `temp_${Date.now()}`} : {},
          },
        ]);
      }
      else{
        setOwnerData((current) => [
        ...current,
        {
          ...validatedValues,
          ssrp_type: "Owner",
          sro_images: {sroi_image: imageFiles, sro_temp_key: `temp_${Date.now()}`
            //     sroi_remarks: "",
          },
        },
        ]);
      }
      toast.success(`Owner data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, ownerColumns: false });
      ownerForm.resetFields();
      setImageFiles(null);

    }
  };

  const generateColumns = (reportKeys, coireport) => {
    const columnDefinitions = [
      { key: reportKeys.name, title: "Name", placeholder: "Name", type: "text" },
      { key: reportKeys.nationality, title: "Nationality", placeholder: "Nationality", type: "text" },
      { key: reportKeys.idtype, title: "ID Type", placeholder: "ID Type", type: "textop" },
      { key: reportKeys.id, title: "ID Number", placeholder: "ID Number", type: "textop" },
      { key: reportKeys.idexpdt, title: "ID Exp. Date", type: "date" },
      ...(!coireport
        ? [{ key: "picture_upload", title: "Picture Upload", type: "file" }]
        : []),
      { key: reportKeys.ethnicity, title: "Ethnicity", placeholder: "Ethnicity" , type: "textop" },
      { key: reportKeys.share, title: "Share", placeholder: "Share" , type: "number" },
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
          if (showInputs.ownerColumns && index === 0) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleOwnerCancel}
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
                    onClick={onOwnerFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (!showInputs.ownerColumns) {
              if (isOwnerEditing(index)) {
                return (
                  <Form.Item>
                    <div style={{ display: "flex" }}>
                      <SimpleButton
                        onClick={() => {
                          if (tempDeletedImages && tempDeletedImages.length > 0) {
                            // Restore deleted images
                            setOwnerData((prev) => {
                              const newItems = [...prev];
                              tempDeletedImages.forEach(({ index, type, value }) => {
                                newItems[index][type] = value; // Restore the deleted image
                              });
                              return newItems;
                            });
                            // Clear temp storage
                            setTempDeletedImages([]);
                          }
                          // Reset owner key and form fields
                          setOwnerKey("");
                          ownerForm.resetFields();
                        }}
                        style={{
                          fontWeight: "bold",
                        }}
                        text="Cancel"
                      />
                      <SimpleButton
                        onClick={() => {
                          ownerDataEdited(index);
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
                        setOwnerKey(index);
                        ownerForm.setFieldsValue(record);
                        ownerForm.resetFields;
                      }}
                    />
                    <MdDelete
                      onClick={() => handleOwnerDelete(index)}
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
            // !record?.[reportKeys.image]?.[0]?.[reportKeys.picture], "\nPIcture", record?.[reportKeys.image], "\n", showInputs.ownerColumns, index, isOwnerEditing(index) && (record?.[reportKeys.image]))
          return (showInputs.ownerColumns && index === 0) |
            (isOwnerEditing(index) && (record?.[reportKeys.image])) ? (
                <input
                  style={{ width: "100%" }}
                  type="file"
                  name={sreport ? "sroi_image" : "roi_image"}
                  accept=".png,.jpg,.jpeg,.gif,.tiff,.jfif"
                  onChange={handleImageUpload}
                />
            )  : 
            (
              <>
                {(isValidImages(record.sro_images) || isValidImages(record.roi_images) || isValidImages(record.rvo_images)) ? (
                  <IconsStylingWrap>
                      {/* Display the uploaded picture or show "No picture" if no picture is present */}
                    <ImagePreviews>
                    {sreport ?  (
                      <>
                      {(record.sro_images?.sroi_image === null) ? (
                          <p>No Picture</p>
                        ) :  (
                          <>
                          {/* for display of previously/newly added image in special report add and edit */}
                           <div className="imgUp">
                              <p>Uploaded</p>
                              <span onClick={() => handlePreviewOpen(record.sro_key ? record.sro_key : record.sro_images.sro_temp_key)}  style={{ cursor: "pointer" }}><MdRemoveRedEye size={20} /></span>
                            </div>
                            
                            {record.sro_key ? (showPreview[record.sro_key] && (
                              <Image
                                src={record?.sro_images?.sroi_image instanceof File  ? URL.createObjectURL(record.sro_images.sroi_image) 
                                  : record?.sro_images?.sroi_image}
                                alt="Owner"
                                style={{ display: "none" }} // Hide the image, but allow preview
                                preview={{
                                  visible: showPreview[record.sro_key],
                                  onVisibleChange: (visible) => handlePreviewClose(record.sro_key, 'kk'),
                                }} />
                            )) : (
                              <Image
                                src={record?.sro_images?.sroi_image instanceof File  ? URL.createObjectURL(record.sro_images.sroi_image) 
                                  : record?.sro_images?.sroi_image}
                                alt="Owner"
                                style={{ display: "none" }} // Hide the image, but allow preview
                                preview={{
                                  visible: showPreview[record.sro_images.sro_temp_key],
                                  onVisibleChange: (visible) => handlePreviewClose(record.sro_images.sro_temp_key, record),
                                }} />
                            )}
                          </>
                        )}
                      </>
                    ) : 
                    ( <>
                        {record.rvo_images? ((record.rvo_images?.roi_image === null ) ? (
                            <p>No Picture</p>
                          ) : (
                            <>
                              <div className="imgUp">
                                <p>Uploaded</p>
                                <span onClick={() => handlePreviewOpen(record.rvo_key ? record.rvo_key : record.rvo_images.rvo_temp_key)}  style={{ cursor: "pointer" }}><MdRemoveRedEye size={20} /></span>
                              </div>

                              {record.rvo_key ? (showPreview[record.rvo_key] && (
                                <Image
                                  src={record?.rvo_images?.roi_image instanceof File  ? URL.createObjectURL(record.rvo_images.roi_image) 
                                    : record?.rvo_images?.roi_image}
                                  alt="Owner"
                                  style={{ display: "none" }} // Hide the image, but allow preview
                                  preview={{
                                    visible: showPreview[record.rvo_key],
                                    onVisibleChange: (visible) => handlePreviewClose(record.rvo_key, "pod"),
                                  }} />
                              )) : ( 
                                <Image
                                  src={record?.rvo_images?.roi_image instanceof File  ? URL.createObjectURL(record.rvo_images.roi_image) 
                                    : record?.rvo_images?.roi_image}
                                  alt="Owner"
                                  style={{ display: "none" }} // Hide the image, but allow preview
                                  preview={{
                                    visible: showPreview[record.rvo_images.rvo_temp_key],
                                    onVisibleChange: (visible) => handlePreviewClose(record.rvo_images.rvo_temp_key, "pod"),
                                  }} />
                              // )
                              )}
                             </>)
                        ) : (
                          (record.roi_images?.roi_image === null ) ? (
                            <p>No Picture</p>
                          ) : (
                          <>
                          <div className="imgUp">
                            <p>Uploaded</p>
                            <span onClick={() => handlePreviewOpen(record.roi_images.roi_temp_key)}  style={{ cursor: "pointer" }}><MdRemoveRedEye size={20} /></span>
                          </div>
                          {/* {showPreview[record.roi_key] && ( */}
                            <Image
                              src={record?.roi_images?.roi_image instanceof File  ? URL.createObjectURL(record.roi_images.roi_image) 
                                : record?.roi_images?.roi_image}
                              alt="Owner"
                              style={{ display: "none" }} // Hide the image, but allow preview
                              preview={{
                                visible: showPreview[record.roi_images.roi_temp_key],
                                onVisibleChange: (visible) => handlePreviewClose(record.roi_images.roi_temp_key, "reg add"),
                              }} />
                          {/* )} */}
                         </>)
                        )
                        }
                      </>
                    )}
                    </ImagePreviews>

                    {isOwnerEditing(index) ? (
                      Array.isArray(record?.[reportKeys.image]) ? (
                        // console.log("Deletion Arr", record?.[reportKeys.image], reportKeys.image),
                        // If it's an array, check the first element's picture field
                        record?.[reportKeys.image]?.[0]?.[reportKeys.picture] ? (
                          <MdDelete
                            onClick={() => handleImageDelete(index)}
                            className="deleteIcon"
                          />
                        ) : (<p>D</p>)
                      ) : (
                        // console.log("Deletion Obj", record?.[reportKeys.image], record?.[reportKeys.image]?.[reportKeys.picture], reportKeys.image),
                        // If it's an object, check the picture field directly
                        record?.[reportKeys.image]?.[reportKeys.picture] ? (
                          <MdDelete
                            onClick={() => handleImageDelete(index, record?.[reportKeys.image].roi_key ? record?.[reportKeys.image].roi_key: record?.[reportKeys.image].sroi_key )}
                            className="deleteIcon"
                          />
                        ) : (
                          <p>D</p>)
                      )
                    ) : null}
                  </IconsStylingWrap>
                ) : (
                  // Display "No picture" if no picture is present
                  isOwnerEditing(index) ? (
                    <input
                      style={{ width: 200 }}
                      type="file"
                      name={sreport ? "sroi_image" : "roi_image"}
                      accept=".png,.jpg,.jpeg,.gif,.tiff,.jfif"
                      onChange={handleImageUpload}
                    />
                  ) : (
                  <span>No picture</span>)
                )}
              </>
            )
          }
          else{
            if ((showInputs.ownerColumns && index === 0) || isOwnerEditing(index)) {
              return (
                <StyledInput>
                  {type === "date" && (
                    <DateBox
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      name={key}
                      rules={coireport ? null : [{ required: false, /*message: "Please select a date!"*/ }]}
                    />
                  ) }
                  {type === "text" && (
                    <InputBox
                      style={{ width: "100%" }}
                      placeholder={placeholder}
                      name={key}
                      rules={coireport ? null : [{ required: true, message: "Required Field!" }]}
                    />
                  )}
                  {type === "textop" && (
                    <InputBox
                      style={{ width: "100%" }}
                      placeholder={placeholder}
                      name={key}
                      rules={coireport ? null : [{ required: false, /*message: "Required Field!"*/ }]}
                    />
                  )}
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
                  {type === "number" && (
                    <InputNumBox
                      style={{ width: "100%" }}
                      placeholder={placeholder}
                      name={key}
                      type="number"
                      rules={coireport ? null : [
                        // { required: true, message: "Required Field!" }, 
                        { pattern: /^[+-]?\d+(\.\d+)?$/, message: "Enter a valid number (integer or decimal)", }
                      ]}
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
  
  // Generate columns based on `props.coireport`
  const ownerColumns = props.coireport ? generateColumns(reportKeysCoi, true) : generateColumns(reportKeys, false);
  
  return (
    <div className="mb-10">
      <AntdTable
        // scrollConfig={{ x: true }} // Set the scroll property as per your requirements
        columns={ownerColumns}
        data={showInputs.ownerColumns ? [{}, ...ownerData] : ownerData}
        pagination={true}
        form={ownerForm}
        onFinish={onOwnerFinish}
        titletext="Owner Details"
        showButton={showButtons}
        btnTitle="Add Owner Details"
        onBtnClick={handleOwnerColumnShowInput}
        btndisabled={ownerKey !== ""}
      />
    </div>
  );
}

export default OwnerTable;
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

  // span {
  //   position: relative;
  //   width: 80px;
  //   height: 80px;
  // }

  // span 
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 3px;
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