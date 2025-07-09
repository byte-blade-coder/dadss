import { Upload, Button, Form, Input, Row, Col, Image, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React, { useState, useEffect } from 'react';

const CustomImageUpload = ({ 
  form, name, disabled, onAdd, onRemove, 
  src,initialFileList = [], hasPicture , sreport, state
  }) => {
  // Initialize fileList state
  const [fileList, setFileList] = useState([]);

  // Effect to set the initial fileList when component mounts
  useEffect(() => {
    if (initialFileList.length > 0) {
      setFileList(initialFileList);
    }
    // console.log("Initial fileList:", fileList);
  }, [initialFileList]);

  // Handle image upload
  const handleImageUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    onAdd(newFileList);
  };
  // const handleImageUpload = ({ fileList }) => {  
  //   console.log(`adding ${name} image`)
  //   const newFileList = [...fileList];
  //   setFileList(newFileList);
  //   onAdd(newFileList);
  // };

  // Function to handle the deletion of an image
  const handleImageRemove = (file) => {
    //delete the corresponding REMARKS as well
    Modal.confirm({
      title: `Are you sure, you want to delete this image?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // If the user confirms, update the state to remove the image at the specified index
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        setFileList(newFileList);
        onRemove(file);
      },
    });
  };

  const customRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  useEffect(() => {
    form.setFieldsValue({ [name]: fileList });
    // console.log("fileList updated:", fileList, "\n", form.getFieldsValue()); // Debugging statement
  //  console.log("Images: ", form.getFieldsValue([name], disabled))
      console.log( disabled)
  }, [fileList, form, name]);

  return (
    <Form.Item label="" name={name}>
      {!disabled && (<StyledUpload>
        <Upload
          multiple
          // fileList={hasPicture ? mergedFileList : fileList}
          fileList={fileList}
          onChange={handleImageUpload}
         // onRemove={handleImageRemove}
          customRequest={customRequest}
          listType="picture"
          showUploadList={false}
        >
          <Button className='flex justify-center items-center' icon={<UploadOutlined />} disabled={disabled}>Upload</Button>
        </Upload>
      </StyledUpload>)}
        {fileList.length > 0 && (
          <div className="image-previews">
           <ImagePreviews>
            {fileList.map((file, index) => (
              // console.log("here",name, "\nurl", file, `${name}[${index}]srci_remarks`,src),
              <div key={file.uid || index} className="image-preview">
                <Image src={ file.originFileObj ? (URL.createObjectURL(file.originFileObj)) : (file.url)} alt={`Image ${index + 1}`} />
                {disabled===false ? (
                  // console.log(disabled,file.rci_remarks, sreport,`${name}[${index}]srci_remarks`),
                  <div className="text-and-btn">
                    <Form.Item name = { src === "merchant" ? `${name}[${index}]vi_remarks` : src === "fishing" ? name==="rv_images" ? `${name}[${index}]ri_remarks` : `${name}[${index}]rci_remarks` : `${name}[${index}]srci_remarks`}
                    initialValue={src === "merchant" ? file.vi_remarks : src === "fishing" ? name==="rv_images" ? file.ri_remarks : file.rci_remarks : file.srci_remarks}>
                      {/* //  */}
                      <Input placeholder="Enter tag" disabled={disabled} 
                        //name={src === "fishing" ? name==="rv_images" ? `${name}[${index}]ri_remarks` : `${name}[${index}]rci_remarks` : `${name}[${index}]vi_remarks`}
                        //initialValue={name==="rv_images" ? file.ri_remarks : file.rci_remarks}
                        />
                    </Form.Item>
                    <IconsStylingWrap>
                      <MdDelete
                        onClick={() => handleImageRemove(file)}
                        className="deleteIcon"
                      />
                    </IconsStylingWrap>
                  </div>
                 ) : (
                  // console.log("now", src, name, file.srci_remarks, state),
                  <p>{ src === "merchant" ? file.vi_remarks : src === "fishing" ? name==="rv_images" ? file.ri_remarks : file.rci_remarks : file.srci_remarks}</p>
                )}
              </div>
            ))}
           </ImagePreviews>
          </div>
        )}
        {/* </>
      )} */}
    </Form.Item>
  );
};


export default CustomImageUpload;


const ImagePreviews = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;

  .image-preview{
    position: relative;
    width: 100px;
    height: 100px;
    margin-bottom: 1rem;
  }

  .image-preview img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 0.5rem;
  }

  .image-preview .ant-image img{
    width: 100%;
    // height: 100%;
    height: 70px;
    // box-shadow: 1px 1px gray
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .image-preview .ant-form-item{
    width: 5.2rem !important;
    margin-right: 0rem !important;
    margin-bottom: 0px !important;
  }

  .image-preview .ant-form-item .ant-row .ant-col .ant-form-item-control-input{
    width: 5.1rem !important;
    margin-right: 1px !important;
  }

  .text-and-btn{
    display: flex;
    flex-direction: row;
  }

`;

const StyledUpload = styled.div`
  .ant-upload.ant-upload-select
  {
    width: 106px !important;
    height: 36px !important;
    //display: none;
    margin-inline-end: 8px;
    margin-bottom: 8px;
    // text-align: center;
    // vertical-align: top;
    background-color: none !important;
    border: none !important;
    // border-radius: 8px;
    // cursor: pointer;
    // transition: border-color 0.3s;
  }

  .ant-btn{
    // margin-left: 1rem;
    // margin-top: 1rem;
    // text-align: center;
    // vertical-align: top;
    background-color: rgba(0, 0, 0, 0.02);
    border: 1px dashed #d9d9d9;
    // border-radius: 8px;
  }
`;

const IconsStylingWrap = styled.div`
  .deleteIcon {
    color: #e96162;
    //background-color: #f9e7e8;
    border-radius: 20px;
    font-size: 25px;
    padding: 2px;
    cursor: pointer;
    margin-top 0.15rem;
  }
`;