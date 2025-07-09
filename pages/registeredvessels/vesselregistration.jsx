import { Col, Form, Row,Modal } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import {
  country_list,
  ethnicity_list,
  type_list,
  province,
} from "../../src/helper/dropdown";
import Cookies from "js-cookie";
import PageHeader from "../../src/components/pageheader/pageHeader";
import FishingVesselTable from "../../src/components/table/FishingVesselTable";
import { useDispatch } from "react-redux";
import { saveRegistedVessel } from "../../src/redux/thunks/registeredVesselData";
import NakwaForm from "../../src/components/stackedForm/NakwaForm";
import OwnerTable from "../../src/components/specialTables/OwnerTable";
import dayjs from "dayjs";
import { showToastError } from "../../src/helper/MyToast";

function RegisteredVesselData() {
  const pf_id = localStorage.getItem("u_pf_id")
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = useForm();
  const [nakwaForm] = useForm();
  const [ownerData, setOwnerData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [nakwaImgs, setNakwaImgs] = useState([]);
  const [tempRemovedOwnerFiles, setTempRemovedOwnerFiles] = useState([]);

  // When the component mounts
  useEffect(() => {
    form.setFieldsValue({
      rv_pf_id: pf_id,
      rv_images: [],
      // rvc_images: [],
      // rvo_images: [],
    });

    nakwaForm.setFieldsValue({
       rvc_images: [],
    });

    // // Check if there is saved form data in local storage
    // const savedFormData = localStorage.getItem("formData");

    // if (savedFormData) {
    //   // Populate the form with saved data
    //   form.setFieldsValue(JSON.parse(savedFormData));
    // }
  }, []);

  const handleSave = async () => {
    const validatedValues = await form.validateFields();
    const nakwaValues = await nakwaForm.validateFields();
    
    // Transforming fileList to match the required format
    const transformedImages = fileList.map((file, index) => (
      {
      ri_image: file.originFileObj,
      ri_remarks: validatedValues[`rv_images[${index}]ri_remarks`] ? 
      validatedValues[`rv_images[${index}]ri_remarks`] : "",
    }));

    // Transforming nakwaImgs to match the required format
    const transformedNakwaImages = nakwaImgs.map((file, index) => (
      {
        rci_image: file.originFileObj,
        rci_remarks: nakwaValues[`rvc_images[${index}]rci_remarks`] ? 
        nakwaValues[`rvc_images[${index}]rci_remarks`] : "",
    }));

    const transformedOwnerImages = ownerData.map((owner,index) => {
      // console.log(owner, index)
      return { roi_image: owner.roi_images.roi_image };
    })

    console.log("Vessel validatedValues: ", validatedValues,transformedOwnerImages)
    
    // Create payload for dispatching
    const finalData = new FormData()
    transformedImages.forEach((img, index) => {
      finalData.append(`ri_image[${index}]`, img.ri_image);
      finalData.append(`ri_remarks[${index}]`, img.ri_remarks);
    });
    const NakwaImgData = new FormData()
    transformedNakwaImages.forEach((img,index) => {
      console.log("NakwaImgData img: ", img)
      NakwaImgData.append(`rci_image[${index}]`, img.rci_image);
      NakwaImgData.append(`rci_remarks[${index}]`, img.rci_remarks);
    })

    const OwnerImgData = new FormData();
        
    // Log the contents of FormData
    for (let pair of OwnerImgData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
    
    // Remove rv_images and remarks fields from validatedValues
    const cleanedValues = { ...validatedValues };
    delete cleanedValues.rv_images;
    Object.keys(cleanedValues).forEach((key) => {
      if (key.startsWith('rv_images[')) {
        delete cleanedValues[key];
      }
    });
    // Remove rvc_images and remarks fields from nakwaDetails
    const finalNakwaValues = { ...nakwaValues };
    delete finalNakwaValues.rvc_images;
    Object.keys(finalNakwaValues).forEach((key) => {
      if (key.startsWith('rvc_images[')) {
        delete finalNakwaValues[key];
      }
    });
      // Conditionally add nakwaDetails
  // const nakwaDetails =
  //   Object.keys(finalNakwaValues).length > 0 ? [finalNakwaValues] : [];
const isObjectEmpty = (obj) =>
  Object.values(obj).every(
    (val) => val === undefined || val === null || val === ''
  );

// Clean the nakwaDetails array
const nakwaDetails = isObjectEmpty(finalNakwaValues)
  ? []
  : [finalNakwaValues];
    console.log("ownerData",ownerData, nakwaDetails)

    //temporary map to store images and corresponding owners
    const ownerImagesMap = new Map();
    // Populate the ownerImagesMap with images with their indices
    ownerData.forEach((owner, index) => {
      if (owner.roi_images && owner.roi_images.roi_image) {
        ownerImagesMap.set(index, owner.roi_images.roi_image);
      }
    });

    // Remove rvo_images and remarks fields from nakwaDetails
    const finalOwnerValues = ownerData.map((owner) => {
    const { roi_images, ...cleanedOwner } = owner;
    return cleanedOwner;
    });
  
  console.log("finalOwnerValues",finalOwnerValues);
    const finalData2 = {
      data: {
        ...cleanedValues,
        nakwaDetails,
        // nakwaDetails: [...finalNakwaValues],
        ownerDetails: finalOwnerValues.map((item) => (
        console.log(item),
        {
          ...item,
          rvo_idexpdt: dayjs(item.rvo_idexpdt).format("YYYY-MM-DD"),
        })),
      },
      formData: finalData,
      nakwaFormData: NakwaImgData,
      ownerFormData: OwnerImgData,
      ownerImagesMap: ownerImagesMap,
      navigation: router,
    }
    console.log("Vessel Registration Final data: ", finalData2)
    dispatch(saveRegistedVessel(finalData2));
  }

  const handleImageAdd = (newFileList) => {
    setFileList(newFileList);
  };

  // Handle file removal
  const handleImageRemove = (file) => {
    // If the user confirms, update the state to remove the image at the specified index
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);   
  };

  const AddNakwaImg = (newFileList) => {
    setNakwaImgs(newFileList);
  };

  // Handle file removal
  const RemoveNakwaImg = (file) => {
    const newFileList = nakwaImgs.filter((item) => item.uid !== file.uid);
    setNakwaImgs(newFileList);  
  };


  const handleBack = () => {
    localStorage.removeItem("formData");
    localStorage.removeItem("OwnerForm");
    router.back();
  };

  const handleFormValidate = () => {
    const forms = [form, nakwaForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
        handleSave();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [form, nakwaForm]
          .flatMap((form) => form.getFieldsError())
          .filter((field) => field.errors.length > 0)[0]?.name[0];
        
          if (firstInvalidField) {
          const inputElement = document.querySelector(
            `[name="${firstInvalidField}"]`
          );
          if(inputElement){inputElement?.scrollIntoView({ behavior: "smooth" });  showToastError(`Enter required fields!`);}
          else{
            showToastError(`Enter required fields!`);
          }
        }
      });
  };

  return (
    <StyledDiv>
      <div>
        {" "}
        <PageHeader
          showSearchBox={false}
          // handleBack={handleBack}
          showButton={true}
          btnTitle="Save"
          // onNavigate={handleSave}
          onNavigate = {handleFormValidate}
          title="Fishing Vessel Registration"
        />
      </div>
      <FishingVesselTable
        vesselForm={form}
        disabled={false}
        handleImageAdd={handleImageAdd}
        handleImageRemove={handleImageRemove}
      >
      </FishingVesselTable>
      <NakwaForm
        disabled={false}
        form={nakwaForm}
        reportKeys="rvc"
        handleImageAdd={AddNakwaImg}
        handleImageRemove={RemoveNakwaImg}
        add={true}
      >
      </NakwaForm>
      <OwnerTable
        ownerData={ownerData}
        setOwnerData={setOwnerData}
        showButtons={true}
        reportKeys="rvo"
        add={true}
        tempDeletedImages={tempRemovedOwnerFiles}
        setTempDeletedImages={setTempRemovedOwnerFiles}
      />
    </StyledDiv>
  );
}

export default RegisteredVesselData;

const StyledDiv = styled.div`
  // .input {
  //   margin-bottom: 20px;
  // }
`;
