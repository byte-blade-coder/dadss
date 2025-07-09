import React, { useEffect, useState } from "react";
import { Upload, Button, Form, Input, Row, Col, Image, Modal, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch } from "react-redux";
import Heading from "../../src/components/title/Heading";
import { uploadPersonImage } from "../../src/redux/thunks/facialRecognitionData";
import styled from "styled-components";
import { toast } from "react-toastify";

const FaceRecognition = () => {

  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);;
  const [previewUrl, setPreviewUrl] = useState(null);
  // const personDetails = JSON.parse(localStorage.getItem("personDetails") || "[]");
  const [personDetails, setPersonDetails] = useState(null);
  const [closeMatch, setCloseMatch] = useState(0);

  useEffect(() => {
    const matches = personDetails?.length;
    setCloseMatch(matches)
  }, [personDetails])
  const sentToApi = async (file) => {

    const PersonImg = new FormData();
    PersonImg.append("photo", file);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/face_recognition`,
        PersonImg,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(`Match Found`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(response.data)
        setPersonDetails(response.data)
        //localStorage.setItem('personDetails', JSON.stringify(response.data));
        return { data: response.data };
      }
    } catch (error) {

      const errorResponse = error.response?.data
      console.log(error, errorResponse)
      const errorMessage = errorResponse?.detail || "No match found.";
      toast.error(`Please try again. \n${errorMessage}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      throw error;
    }
    // dispatch(uploadPersonImage(PersonImg));
}
  // Function to handle the upload of an image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
     setTimeout(() => {
        setImageFile(file);
      }, 11000)
      message.success("File Uploaded");
    //   toast.success(`File Uploaded`, {
    //     position: "top-right",
    //     autoClose: 1000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "dark",
    //   });
     // Create a preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    sentToApi(file);
   
  };
  console.log(personDetails, imageFile,closeMatch)

    return (
      <div className=""  style={{marginTop: "3rem",}}>
        <Heading text="Facial Recognition" level={2} className="p-0 ml-5 mb-5" />
        <div className="max-h-screen ">
        <Row >
            <Heading text="Upload image here: " level={5} className="p-0 ml-5 mb-5" />
            <StyledUpload>
              <div>
                  {/* <Upload
                  fileList={imageFile}
                  onChange={handleImageUpload}
                  listType="picture"
                  showUploadList={false}
                > */}
                <input
                  style={{ width: 250 }}
                  type="file"
                  name="photo"
                  accept=".png,.jpg,.jpeg,.gif,.tiff"
                  onChange={handleImageUpload}
                />
                {/* <Button icon={<UploadOutlined />}>Choose file</Button>
                </Upload> */}
              </div>
            </StyledUpload>
            {
              imageFile && (
                <ImagePreviewOriginal>
                  <img
                    src={previewUrl}
                    alt="person"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </ImagePreviewOriginal>
              )
            }
        </Row>
        {imageFile && personDetails && (
            <>
            <div style={{display:"flex", marginLeft: "1rem", marginTop: "0.2rem", color: "green"}}>
                <Heading text={`${closeMatch} matches found`} level={3} style={{color: "green"}}></Heading>
            </div>
            <div style={{display:"flex", marginRight: "2rem", marginTop: "0.2rem",}}>
               {personDetails.map((detail, index) => (
                <StyledInfoCards accuracy={detail.accuracy}>
                    <div className="cards" key={index}> 
                        <div className="pic">
                            <p className="accuracy">Accuracy: {detail.accuracy}%</p>
                            <ImagePreview>
                                <img src={detail.photo} alt={`${detail.person_id.name}'s photo`} />
                            </ImagePreview>
                        </div>
                        <div className="details">
                            <Heading text={`${detail.person_id.name}`} level={5} 
                            className="mt-2"> </Heading>
                            <p>CNIC: {detail.person_id.cnic_no}</p>
                            <p>Cell No: {detail.person_id.cell_no}</p>
                            <p>Boat Name: {detail.boat_id.boat_name}</p>
                            <p>Boat Reg No: {detail.boat_id.reg_no}</p>
                            <p>Boat Type: {detail.boat_id.boat_type}</p>
                            <p>Boat Location: {detail.boat_id.boat_location}</p>
                        </div>
                    </div>
                </StyledInfoCards>
                ))}
            </div></>
        )}
        </div>
      </div>
    );
  };
export default FaceRecognition;

const StyledUpload = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 0.8rem;
`;

const StyledInfoCards = styled.div`
    display: flex;
    margin-left: 1.2rem;
    gap: 3rem;
        
    .cards{
        //display: grid;
        //justify-content: center;
        padding: 10px;
        width: 32rem;
        height: 22rem;
        display: flex;
        justify-items: center;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
            rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
        border-radius: 10px;
    }
    
    .pic{
        display: grid;
        justify-content: center;
        align-content: center;
        font-size: 16px;
        margin-left: 10px;
    }

    .details{
        display: grid;
        justify-content: center;
        align-content: center;
        margin-left: 10px;
        font-size: 16px;
    }
     .accuracy {
     margin-top: 3px;
    font-weight: bold;
    color: ${({ accuracy }) => (accuracy >= 60 ? "red" : "blue")};
  }
`;


const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
    width: 250px;
    height: 280px;

  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 3px;
    margin-bottom: 0.5rem;
  }

`;
const ImagePreviewOriginal = styled.div`
  display: flex;
  margin-top: -28px;
  margin-left: 20px;
    width: 250px;

  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 3px;
    margin-bottom: 0.2rem;
  }

`;
