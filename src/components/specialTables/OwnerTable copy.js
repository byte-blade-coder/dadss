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

function OwnerTable(props) {
  const { ownerData, setOwnerData, showButtons, coireport,fileList, sreport, add, state, onRemove  } = props;
    console.log(ownerData, state)
  const [ownerForm] = useForm();
  const [ownerKey, setOwnerKey] = useState("");
  const [imageFiles, setImageFiles] = useState(null);
  const [showInputs, setShowInputs] = useState({
    ownerColumns: false,
  });
  
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

  const handleOwnerColumnShowInput = () => {
    ownerForm.resetFields();
    setImageFiles(null);
    console.log('Owner fields', ownerForm.getFieldsValue(), "\Images", imageFiles)
    setShowInputs({ ...showInputs, ownerColumns: true });
  };

  // Function to handle the removal of an image before it is saved
  const handleImageRemove = (file) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this image?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // If the user confirms, update the state to remove the image at the specified index
        console.log(file, "\nBefore removal", imageFiles)
        imageFiles.filter((item) => console.log(item))
        const newFileList = imageFiles.filter((item) => item.uid !== file.uid);
        setImageFiles(newFileList);
        console.log("\nafter removal", imageFiles)
      },
    });
  };

   // Function to handle the deletion of an image
   const handleImageDelete = (index, imgKey) => {
    console.log(imgKey)
    Modal.confirm({
      title: `Are you sure, you want to delete this image?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        console.log(ownerData)
        // If the user confirms, update the state to remove the image at the specified index
        setOwnerData((prev) => {
          console.log(prev);
          const newItems = [...prev];
          console.log(newItems[index]);
          if(newItems[index].sro_images)
          { 
            newItems[index].sro_images = null;
            setImageFiles(null);
          }
          else if(newItems[index].rvo_images)
          {
            newItems[index].rvo_images = null;
            setImageFiles(null);
          }
          else 
          {
            newItems[index].roi_images = null;
            setImageFiles(null);
          }
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

  const handleOwnerCancel = (event) => {
    event.preventDefault();
    setShowInputs({ ...showInputs, ownerColumns: false });
    ownerForm.resetFields();
  };

  const handleOwnerDelete = (record_index) => {
    console.log("Deleting record",record_index, "\nOwner Fields", ownerForm.getFieldsValue())
    setOwnerData((prev) => {
      console.log(prev);
      const updatedData = prev.filter((item, index) => index !== record_index);
      console.log(updatedData);
      return updatedData; // Ensure the filtered data is returned
    });
    ownerForm.resetFields();
  };

  const isOwnerEditing = (record_index) => record_index === ownerKey;

  const ownerDataEdited = (key) => {
    const editedValues = ownerForm.getFieldValue();
    console.log("editedValues", editedValues, imageFiles)
    console.log("ownerData[key]", ownerData[key], key)
    
    let newEdited;

    if (add) {
      newEdited = {
        ...editedValues,
        // roi_images: imageFiles!==null ? {roi_image: imageFiles} : {},
        roi_images: imageFiles ? {roi_image: imageFiles} : ownerData[key].roi_images,
      };
      console.log(imageFiles)
    }
    else if (state === "edit") {
      newEdited = {
        ...editedValues,
        // rvo_images: ownerData[key].rvo_images!==null ? {roi_image: imageFiles} : {},
        // rvo_images: imageFiles!==null ? {roi_image: imageFiles} : {},
        roi_images: imageFiles ? {roi_image: imageFiles} : ownerData[key].rvo_images,
      };
      console.log(imageFiles)
    }
    else {
      console.log("Sreport edited")
      console.log(imageFiles)
      newEdited = {
        ...editedValues,
        //sro_images: ownerData[key].sro_images!==null ? {sroi_image: imageFiles} : {},
        // sro_images: imageFiles!==null ? {sroi_image: imageFiles} : {},
        sro_images: imageFiles ? {sroi_image: imageFiles}  : ownerData[key].sro_images,
      };
    }
    console.log("New edited", newEdited)
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
    
    console.log("validatedValues", validatedValues, imageFiles)
    console.log(imageFiles, add)

    console.log("Owner row values", validatedValues)
    if (validatedValues) {
      console.log(imageFiles)
      if(add)
      {
        setOwnerData((current) => [
          ...current,
          {
            ...validatedValues,
            ssrp_type: "Owner",
            roi_images: imageFiles!==null ? {roi_image: imageFiles} : {},
          },
        ]);
      }
      else if (state==="edit") {
        setOwnerData((current) => [
          ...current,
          {
            ...validatedValues,
            ssrp_type: "Owner",
            rvo_images: imageFiles!==null ? {roi_image: imageFiles} : {},
          },
        ]);
      }
      else{
        setOwnerData((current) => [
        ...current,
        {
          ...validatedValues,
          ssrp_type: "Owner",
          sro_images: {sroi_image: imageFiles,
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
      console.log('before saving Owner fields', ownerForm.getFieldsValue, "\Images")
      ownerForm.resetFields();
      setImageFiles(null);
      console.log('after saving Owner fields', ownerForm.getFieldsValue(), "\Images")

    }
  };

  // const ownerColumns = props.coireport === true ? 
  // [
  //   {
  //     key: reportKeysCoi.name,
  //     title: "Name",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.name,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="Name"
  //             name={reportKeysCoi.name}
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeysCoi.nationality,
  //     title: "Nationality",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.nationality,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="Nationality"
  //             name={reportKeysCoi.nationality}
  //             rules={coireport? null : [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeysCoi.idtype,
  //     title: "ID Type",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.idtype,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="ID Type"
  //             name={reportKeysCoi.idtype}
  //             rules={coireport? null : [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeysCoi.id,
  //     title: "ID Number",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.id,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="ID"
  //             name={reportKeysCoi.id}
  //             rules={coireport? null : [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeysCoi.idexpdt,
  //     title: "ID Exp. Date",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.idexpdt,
  //     render: (text, record, index) => {
  //       if ((showInputs.ownerColumns && index === 0) | isOwnerEditing(index)) {
  //         return (
  //           <StyledInput>
  //             <DateBox
  //               style={{ with: 250 }}
  //               format="YYYY-MM-DD"
  //               name={reportKeysCoi.idexpdt}
  //               rules={coireport? null : [
  //                 {
  //                   required: true,
  //                   message: "Please select a date!",
  //                 },
  //               ]}
  //             />
  //           </StyledInput>
  //         );
  //       } else {
  //         return record[reportKeysCoi.idexpdt] ? dayjs(text).format("YYYY-MM-DD") : text;
  //       }
  //     },
  //   },
  //   {
  //     key: reportKeysCoi.ethnicity,
  //     title: "Ethnicity",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.ethnicity,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="Ethinicity"
  //             name={reportKeysCoi.ethnicity}
  //             rules={coireport? null : [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeys.share,
  //     title: "Share (%)",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.share,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputNumBox
  //             style={{ width: 150 }}
  //             placeholder="Share"
  //             name={reportKeysCoi.share}
  //             type="number"
  //             rules={coireport? null : [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeysCoi.cell,
  //     title: "Mobile Number",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.cell,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="0332-4324223"
  //             name={reportKeysCoi.cell}
  //             pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
  //             rules={[
  //               {
  //                 pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
  //                 message: "Please enter a valid mobile number!",
  //               },
  //               {
  //                 pattern: /^\d{11}$/,
  //                 message: "Please enter a valid 11-digit mobile number!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     title: "",
  //     key: "action",
  //     dataIndex: "action",
  //     ellipsis: false,
  //     width: 250,
  //     render: (text, record, index) => {
  //       // if (showButtons) {
  //         if (showInputs.ownerColumns && index === 0) {
  //           return (
  //             <Form.Item>
  //               <div style={{ display: "flex" }}>
  //                 <SimpleButton
  //                   onClick={handleOwnerCancel}
  //                   style={{
  //                     fontWeight: "bold",
  //                   }}
  //                   text="Cancel"
  //                 />
  //                 <SimpleButton
  //                   style={{
  //                     fontWeight: "bold",
  //                     color: "white",
  //                     backgroundColor: "#51AE3B",
  //                   }}
  //                   text="Save"
  //                   onClick={onOwnerFinish}
  //                 />
  //               </div>
  //             </Form.Item>
  //           );
  //         } else {
  //           if (!showInputs.ownerColumns) {
  //             if (isOwnerEditing(index)) {
  //               return (
  //                 <Form.Item>
  //                   <div style={{ display: "flex" }}>
  //                     <SimpleButton
  //                       onClick={() => {
  //                         setOwnerKey("");
  //                         ownerForm.resetFields();
  //                       }}
  //                       style={{
  //                         fontWeight: "bold",
  //                       }}
  //                       text="Cancel"
  //                     />
  //                     <SimpleButton
  //                       onClick={() => {
  //                         ownerDataEdited(index);
  //                       }}
  //                       style={{
  //                         fontWeight: "bold",
  //                         color: "white",
  //                         backgroundColor: "#ffbf00",
  //                       }}
  //                       text="Edit"
  //                     />
  //                   </div>
  //                 </Form.Item>
  //               );
  //             } else if(showButtons){
  //               return (
  //                 <IconsStylingWrap>
  //                   <MdModeEditOutline
  //                     className="editIcon"
  //                     onClick={() => {
  //                       setOwnerKey(index);
  //                       ownerForm.setFieldsValue(record);
  //                       ownerForm.resetFields;
  //                     }}
  //                   />
  //                   <MdDelete
  //                     onClick={() => handleOwnerDelete(index)}
  //                     className="deleteIcon"
  //                   />
  //                 </IconsStylingWrap>
  //               );
  //             }
  //           }
  //         }
  //       }
  //     },
  //   // },
  // ] : [
  //   {
  //     key: reportKeys.name,
  //     title: "Name",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.name,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="Name"
  //             name={reportKeys.name}
  //             rules={ [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeys.nationality,
  //     title: "Nationality",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.nationality,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="Nationality"
  //             name={reportKeys.nationality}
  //             rules={ [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeys.idtype,
  //     title: "ID Type",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.idtype,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="ID Type"
  //             name={reportKeys.idtype}
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeys.id,
  //     title: "ID Number",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.id,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="ID"
  //             name={reportKeys.id}
  //             rules={ [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeys.idexpdt,
  //     title: "ID Exp. Date",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.idexpdt,
  //     render: (text, record, index) => {
  //       if ((showInputs.ownerColumns && index === 0) | isOwnerEditing(index)) {
  //         return (
  //           <StyledInput>
  //             <DateBox
  //               style={{ with: 250 }}
  //               format="YYYY-MM-DD"
  //               name={reportKeys.idexpdt}
  //               rules={[
  //                 {
  //                   required: true,
  //                   message: "Please select a date!",
  //                 },
  //               ]}
  //             />
  //           </StyledInput>
  //         );
  //       } else {
  //         return record[reportKeys.idexpdt] ? dayjs(text).format("YYYY-MM-DD") : text;
  //       }
  //     },
  //   },
  //   {
  //     key: reportKeys.ethnicity,
  //     title: "Ethnicity",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.ethnicity,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="Ethinicity"
  //             name={reportKeys.ethnicity}
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     title: "Picture Upload",
  //     dataIndex: sreport===true? add? "sro_images" : reportKeys.image : add? "roi_images": reportKeys.image ,
  //     ellipsis: false,
  //     width: 300,
  //     render: (text, record, index) => {
  //       // console.log(record, text, index, showInputs.ownerColumns, add, record?.[reportKeys.image],reportKeys.picture,
  //       //   "\nRecord for picture", !record?.[reportKeys.image]?.[0]?.[reportKeys.picture], record?.[reportKeys.image]?.[0]?.[reportKeys.picture])
  //         console.log(record, text,"\nRecord for picture", reportKeys.image,reportKeys.picture,
  //           !record?.[reportKeys.image]?.[0]?.[reportKeys.picture], "\nPIcture", !record?.[reportKeys.image])
  //       // console.log(!record.sro_images, !record.roi_images, !record.rvo_images)
  //       // console.log(!record?.sro_images?.sroi_image, !record.roi_images && !record.roi_images?.roi_image, 
  //       //   !record.rvo_images && !record.rvo_images?.roi_image
  //       // )
  //       //record?.[reportKeys.image]?.[0]?.[reportKeys.picture]
  //       return (showInputs.ownerColumns && index === 0) |
  //         (isOwnerEditing(index) && (record?.[reportKeys.image])) ? (
  //             <input
  //               style={{ width: 200 }}
  //               type="file"
  //               name={sreport ? "sroi_image" : "roi_image"}
  //               accept=".png,.jpg,.jpeg,.gif,.tiff,.jfif"
  //               onChange={handleImageUpload}
  //             />
  //         )  : 
  //         (
  //           <div>
  //             {text && (isValidImages(record.sro_images) || isValidImages(record.roi_images) || isValidImages(record.rvo_images)) ? (
  //               console.log("here",record),
  //               <div>
  //                 {/* Display the uploaded picture or show "No picture" if no picture is present */}
  //                 <IconsStylingWrap>
  //                   <ImagePreviews>
  //                   {sreport ?  (
  //                     <span>
  //                       {console.log("ImagePreviews", record.sro_images[0], "\nImages", record.sro_images)}
  //                       {(record.sro_images?.sroi_image === null) ? (
  //                         <p>No Picture</p>
  //                       ) : (typeof record.sro_images[0]?.sroi_image === 'string') ? (
  //                         <Image
  //                           src={record.sro_images[0].sroi_image}
  //                           alt="Owner"
  //                           style={{ maxWidth: "70px", maxHeight: "70px" }}
  //                         />
  //                       ) : (
  //                         <div className="imgUp">
  //                           <p>Uploaded</p>
  //                           <span><MdRemoveRedEye size={20} /></span>
  //                         </div>
  //                       )}
  //                     </span>
  //                   ) : 
  //                   (
  //                     <span>
  //                       {record.rvo_images? (
  //                         console.log("ImagePreviews",record.rvo_images, text, record?.rvo_images[0]?.roi_image),
  //                         (record.rvo_images?.roi_image === null ) ? (
  //                           <p>No Picture</p>
  //                         ) : (
  //                         (record.rvo_images.url ? (typeof (record.rvo_images.url) === 'string') : 
  //                          (typeof (record.rvo_images.roi_image) === 'string')) ?
  //                           <Image
  //                             src={record.rvo_images.url ? record.rvo_images.url : record.rvo_images.roi_image}
  //                             alt="Boat"
  //                             style={{ maxWidth: "60px", maxHeight: "60px" }}
  //                           /> :
  //                           (<div className="imgUp">
  //                             <p>Uploaded</p>
  //                             <span><MdRemoveRedEye size={20}/></span>
  //                           </div>)
  //                         )
  //                       ) : (
  //                         console.log("ImagePreviews",record.roi_images.roi_image, text),
  //                         (record.roi_images?.roi_image === null ) ? (
  //                           <p>No Picture</p>
  //                         ) : (
  //                         (record.roi_images.url ? (typeof (record.roi_images.url) === 'string') : 
  //                          (typeof (record.roi_images.roi_image) === 'string')) ?
  //                         <Image
  //                           src={record.roi_images.url ? record.roi_images.url : record.roi_images[0].roi_image}
  //                           alt="Boat"
  //                           style={{ maxWidth: "70px", maxHeight: "70px" }}
  //                         /> :
  //                         (<div className="imgUp">
  //                           <p>Uploaded</p>
  //                           <span><MdRemoveRedEye size={20}/></span>
  //                         </div>)
  //                         )
  //                       )
  //                       }
  //                     </span>
  //                   )}
  //                   </ImagePreviews>

  //                   {isOwnerEditing(index) ? (
  //                     Array.isArray(record?.[reportKeys.image]) ? (
  //                       console.log("Deletion Arr", record?.[reportKeys.image], reportKeys.image),
  //                       // If it's an array, check the first element's picture field
  //                       record?.[reportKeys.image]?.[0]?.[reportKeys.picture] ? (
  //                         <MdDelete
  //                           onClick={() => handleImageDelete(index)}
  //                           className="deleteIcon"
  //                         />
  //                       ) : (<p>D</p>)
  //                     ) : (
  //                       console.log("Deletion Obj", record?.[reportKeys.image], record?.[reportKeys.image]?.[reportKeys.picture], reportKeys.image),
  //                       // If it's an object, check the picture field directly
  //                       record?.[reportKeys.image]?.[reportKeys.picture] ? (
  //                         <MdDelete
  //                           onClick={() => handleImageDelete(index, record?.[reportKeys.image].roi_key ? record?.[reportKeys.image].roi_key: record?.[reportKeys.image].sroi_key )}
  //                           className="deleteIcon"
  //                         />
  //                       ) : (
  //                         <p>D</p>)
  //                     )
  //                   ) : null}
  //                 </IconsStylingWrap>
  //               </div>
  //             ) : (
  //               // Display "No picture" if no picture is present
  //               console.log("nooo"),
  //               isOwnerEditing(index) ? (
  //                 <input
  //                   style={{ width: 200 }}
  //                   type="file"
  //                   name={sreport ? "sroi_image" : "roi_image"}
  //                   accept=".png,.jpg,.jpeg,.gif,.tiff,.jfif"
  //                   onChange={handleImageUpload}
  //                 />
  //               ) : (
  //               <span>No picture</span>)
  //             )}
  //           </div>
  //         )
  //     },
  //   },
  //   {
  //     key: reportKeys.share,
  //     title: "Share (%)",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.share,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //           <InputNumBox
  //             style={{ width: 150 }}
  //             placeholder="Share"
  //             name={reportKeys.share}
  //             type="number"
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: reportKeys.cell,
  //     title: "Mobile Number",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.cell,
  //     render: (text, record, index) => {
  //       return (showInputs.ownerColumns && index === 0) |
  //         isOwnerEditing(index) ? (
  //         <StyledInput>
  //               <InputBox
  //                 style={{ width: 150 }}
  //                 placeholder="0332-4324223"
  //                 name={reportKeys.cell}
  //                 pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
  //                 rules={[
  //                   {
  //                     required: true,
  //                     message: "Required Field!",
  //                   },
  //                   {
  //                     pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
  //                     message: "Please enter a valid mobile number!",
  //                   },
  //                   {
  //                     pattern: /^\d{11}$/,
  //                     message: "Please enter a valid 11-digit mobile number!",
  //                   },
  //                 ]}
  //               />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     title: "",
  //     key: "action",
  //     dataIndex: "action",
  //     ellipsis: false,
  //     width: 250,
  //     render: (text, record, index) => {
  //       // if (showButtons) {
  //         if (showInputs.ownerColumns && index === 0) {
  //           return (
  //             <Form.Item>
  //               <div style={{ display: "flex" }}>
  //                 <SimpleButton
  //                   onClick={handleOwnerCancel}
  //                   style={{
  //                     fontWeight: "bold",
  //                   }}
  //                   text="Cancel"
  //                 />
  //                 <SimpleButton
  //                   style={{
  //                     fontWeight: "bold",
  //                     color: "white",
  //                     backgroundColor: "#51AE3B",
  //                   }}
  //                   text="Save"
  //                   onClick={onOwnerFinish}
  //                 />
  //               </div>
  //             </Form.Item>
  //           );
  //         } else {
  //           if (!showInputs.ownerColumns) {
  //             if (isOwnerEditing(index)) {
  //               return (
  //                 <Form.Item>
  //                   <div style={{ display: "flex" }}>
  //                     <SimpleButton
  //                       onClick={() => {
  //                         setOwnerKey("");
  //                         ownerForm.resetFields();
  //                       }}
  //                       style={{
  //                         fontWeight: "bold",
  //                       }}
  //                       text="Cancel"
  //                     />
  //                     <SimpleButton
  //                       onClick={() => {
  //                         ownerDataEdited(index);
  //                       }}
  //                       style={{
  //                         fontWeight: "bold",
  //                         color: "white",
  //                         backgroundColor: "#ffbf00",
  //                       }}
  //                       text="Edit"
  //                     />
  //                   </div>
  //                 </Form.Item>
  //               );
  //             } else if(showButtons){
  //               return (
  //                 <IconsStylingWrap>
  //                   <MdModeEditOutline
  //                     className="editIcon"
  //                     onClick={() => {
  //                       console.log(index, record);
  //                       setOwnerKey(index);
  //                       ownerForm.setFieldsValue(record);
  //                       console.log(ownerForm.getFieldsValue());
  //                       ownerForm.resetFields;
  //                     }}
  //                   />
  //                   <MdDelete
  //                     onClick={() => handleOwnerDelete(index)}
  //                     className="deleteIcon"
  //                   />
  //                 </IconsStylingWrap>
  //               );
  //             }
  //           }
  //         }
  //       }
  //     },
  //   // },
  // ];

  const generateColumns = (reportKeys, coireport) => {
    const columnDefinitions = [
      { key: reportKeys.name, title: "Name", placeholder: "Name" },
      { key: reportKeys.nationality, title: "Nationality", placeholder: "Nationality" },
      { key: reportKeys.idtype, title: "ID Type", placeholder: "ID Type" },
      { key: reportKeys.id, title: "ID Number", placeholder: "ID Number" },
      { key: reportKeys.idexpdt, title: "ID Exp. Date", type: "date" },
      ...(!coireport
        ? [{ key: "picture_upload", title: "Picture Upload", type: "file" }]
        : []),
    ];
  
    return columnDefinitions.map(({ key, title, placeholder, type }) => ({
      key,
      title,
      ellipsis: false,
      width: 250,
      dataIndex: key,
      render: (text, record, index) => {
        if ((showInputs.ownerColumns && index === 0) || isOwnerEditing(index)) {
          return (
            <StyledInput>
              {type === "date" ? (
                <DateBox
                  style={{ width: 250 }}
                  format="YYYY-MM-DD"
                  name={key}
                  rules={coireport ? null : [{ required: true, message: "Please select a date!" }]}
                />
              ) : (
                <InputBox
                  style={{ width: 150 }}
                  placeholder={placeholder}
                  name={key}
                  rules={coireport ? null : [{ required: true, message: "Required Field!" }]}
                />
              )}
            </StyledInput>
          );
        } else {
          return type === "date" && record[key] ? dayjs(text).format("YYYY-MM-DD") : text;
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

  span img {
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