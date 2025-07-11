import { useEffect, useState } from "react";
import { Col, Row, Image } from "antd";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineDone, MdRemoveRedEye} from "react-icons/md";
import React from "react";
import dayjs from "dayjs";
import { Select, Typography } from "antd";
import DataDisplayTable from "../table/DataDisplay.js";
import isValidImages from "../../utils/notEmptyNullCheck.js"
const { Title } = Typography;

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function CrewTable(props) {
  const { crewData, setCrewData, labelConfig, className, add, } = props;
  console.log(crewData)
  const [crewForm] = useForm();
  const [crewKey, setCrewKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    crewColumns: false,
  });

  // const isCrewEditing = (record_index) => record_index === crewKey;

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
  const commonColumns = [
    {
      title: "Name",
      ellipsis: false,
      key: "name",
      width: 250,
      dataIndex: reportKeys.name,
      render: (text, record, index) => {
        return text
      },
    },
    {
      title: "Nationality",
      ellipsis: false,
      key: "nationality",
      width: 250,
      dataIndex: reportKeys.nationality,
      render: (text, record, index) => {
        return text
      },
    },
  ];

  const additionalColumn1 = [
    {
      title: "ID Type",
      ellipsis: false,
      width: 250,
      key: "idtype",
      dataIndex: reportKeys.idtype,
      render: (text, record, index) => {
        return text
      },
    },
    {
      title: "ID Number",
      ellipsis: false,
      width: 250,
      key: "id",
      dataIndex: reportKeys.id,
      render: (text, record, index) => {
        return text
      },
    },
    {
      title: "ID Exp. Date",
      ellipsis: false,
      width: 250,
      key: "idexpdt",
      dataIndex: reportKeys.idexpdt,
      render: (text, record, index) => {
        return record?.[reportKeys.idexpdt]
          ? dayjs(text).format("DD-MM-YYYY")
          : text;
      },
    },
    {
      title: "Ethnicity",
      ellipsis: false,
      width: 250,
      key: "ethnicity",
      dataIndex: reportKeys.ethnicity,
      render: (text, record, index) => {
        return text
      },
    },
    {
      title: "Picture Upload",
      dataIndex: add? "src_images" : reportKeys.image,
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        console.log(record, text, index, showInputs.crewColumns, record.src_images, !record.src_images)
        return <div>
            {text && (isValidImages(record.src_images)) ? (
              console.log("here",record),
              <div>
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
                </IconsStylingWrap>
              </div>
            ) :  (
              // Display "No picture" if no picture is present
              <span>No picture</span>)
            }
          </div>
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
        return text
      },
    },
  ];

  const crewColumns = [
    ...commonColumns,
    ...additionalColumn1,
  ];

  return (
    <div className="mb-10">
      <DataDisplayTable
        columns={crewColumns}
        data={showInputs.crewColumns ? [{}, ...crewData] : crewData}
        pagination={true}
        className={className} // Use the className prop here
        form={crewForm}
        titletext="Crew Details"
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