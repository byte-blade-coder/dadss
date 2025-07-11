import { useEffect, useState } from "react";
import {
  Col,
  Row,
  Modal,
  Image
} from "antd";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import "react-toastify/dist/ReactToastify.css";
import { MdModeEditOutline, MdRemoveRedEye } from "react-icons/md";
import { GrView } from "react-icons/gr";
import React from "react";
import dayjs from "dayjs";
import DataDisplayTable from "../table/DataDisplay.js";
import isValidImages from "../../utils/notEmptyNullCheck.js"; 

function OwnerTable(props) {
  const { ownerData, setOwnerData, showButtons, sreport, add, state, onRemove,  } = props;
    console.log(ownerData, state)
  const [ownerForm] = useForm();
  const [ownerKey, setOwnerKey] = useState("");
  const [imageFiles, setImageFiles] = useState(null);
  const [showInputs, setShowInputs] = useState({
    ownerColumns: false,
  });

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

  const isOwnerEditing = (record_index) => record_index === ownerKey;

  const ownerColumns =  [
    {
      key: reportKeys.name,
      title: "Name",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.name,
      render: (text, record, index) => {
        return text
      },
    },
    {
      key: reportKeys.nationality,
      title: "Nationality",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.nationality,
      render: (text, record, index) => {
        return text
      },
    },
    {
      key: reportKeys.idtype,
      title: "ID Type",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.idtype,
      render: (text, record, index) => {
        return text
      },
    },
    {
      key: reportKeys.id,
      title: "ID Number",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.id,
      render: (text, record, index) => {
        return text
      },
    },
    {
      key: reportKeys.idexpdt,
      title: "ID Exp. Date",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.idexpdt,
      render: (text, record, index) => {
        return record?.[reportKeys.idexpdt]
          ? dayjs(text).format("DD-MM-YYYY")
          : text;
      },
    },
    {
      key: reportKeys.ethnicity,
      title: "Ethnicity",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.ethnicity,
      render: (text, record, index) => {
        return text
      },
    },
    {
      title: "Picture Upload",
      dataIndex: sreport===true? add? "sro_images" : reportKeys.image : add? "roi_images": reportKeys.image ,
      ellipsis: false,
      width: 300,
      render: (text, record, index) => {
        return  <div>
            {text && (isValidImages(record.sro_images) || isValidImages(record.roi_images) || isValidImages(record.rvo_images)) ? (
              console.log("here",record),
              <div>
                <IconsStylingWrap>
                  <ImagePreviews>
                  {sreport ?  (
                    <span>
                      {console.log("ImagePreviews", record.sro_images[0], "\nImages", record.sro_images)}
                      {(record.sro_images?.sroi_image === null) ? (
                        <p>No Picture</p>
                      ) : (typeof record.sro_images[0]?.sroi_image === 'string') ? (
                        <Image
                          src={record.sro_images[0].sroi_image}
                          alt="Owner"
                          style={{ maxWidth: "70px", maxHeight: "70px" }}
                        />
                      ) : (
                        <div className="imgUp">
                          <p>Uploaded</p>
                          <span><MdRemoveRedEye size={20} /></span>
                        </div>
                      )}
                    </span>
                  ) : 
                  (
                    <span>
                      {record.rvo_images? (
                        console.log("ImagePreviews",record.rvo_images, text, record?.rvo_images[0]?.roi_image),
                        (record.rvo_images?.roi_image === null ) ? (
                          <p>No Picture</p>
                        ) : (
                        (record.rvo_images.url ? (typeof (record.rvo_images.url) === 'string') : 
                          (typeof (record.rvo_images.roi_image) === 'string')) ?
                          <Image
                            src={record.rvo_images.url ? record.rvo_images.url : record.rvo_images.roi_image}
                            alt="Boat"
                            style={{ maxWidth: "60px", maxHeight: "60px" }}
                          /> :
                          (<div className="imgUp">
                            <p>Uploaded</p>
                            <span><MdRemoveRedEye size={20}/></span>
                          </div>)
                        )
                      ) : (
                        console.log("ImagePreviews",record.roi_images.roi_image, text),
                        (record.roi_images?.roi_image === null ) ? (
                          <p>No Picture</p>
                        ) : (
                        (record.roi_images.url ? (typeof (record.roi_images.url) === 'string') : 
                          (typeof (record.roi_images.roi_image) === 'string')) ?
                        <Image
                          src={record.roi_images.url ? record.roi_images.url : record.roi_images[0].roi_image}
                          alt="Boat"
                          style={{ maxWidth: "70px", maxHeight: "70px" }}
                        /> :
                        (<div className="imgUp">
                          <p>Uploaded</p>
                          <span><MdRemoveRedEye size={20}/></span>
                        </div>)
                        )
                      )
                      }
                    </span>
                  )}
                  </ImagePreviews>
                </IconsStylingWrap>
              </div>
            ) : (
              <span>No picture</span>)
            }
          </div>
      },
    },
    {
      key: reportKeys.share,
      title: "Share (%)",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.share,
      render: (text, record, index) => {
        return text
      },
    },
    {
      key: reportKeys.cell,
      title: "Mobile Number",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.cell,
      render: (text, record, index) => {
        return text
      },
    },
  ];

  return (
    <div className="mb-6">
      <DataDisplayTable
        // scrollConfig={{ x: true }} // Set the scroll property as per your requirements
        columns={ownerColumns}
        data={showInputs.ownerColumns ? [{}, ...ownerData] : ownerData}
        pagination={true}
        form={ownerForm}
        titletext="Owner Details"
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