import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import countryList from "country-list";
import { saveRegistedMerchantVessel } from "../../src/redux/thunks/registerMerchantVesselDatas";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../../src/components/pageheader/pageHeader";
import MerchantVesselTable from "../../src/components/table/MerchantVesselTable";
import { showToastError } from "../../src/helper/MyToast";

function RegisteredVesselData() {
  // Get the platform ID from cookies
  const pf_id = localStorage.getItem("u_pf_id");
  const router = useRouter();
  // Form related state and methods
  const [form] = useForm();
  const [fileList, setFileList] = useState([]);
  
  // Redux related hooks and state variables for saving registered vessel data
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.saveRegisteredMerchantVesselData
  );

  useEffect(() => {
    form.setFieldsValue({
      mv_pf_id: pf_id,
      // mv_vessel_images: [],
      mv_images: [],
    });
  }, []);

  // Navigation back to the previous page
  const handleBack = () => {
    router.back();
  };

  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleSubmit = async () => {
    try {
      const validatedValues = await form.validateFields();

      const transformedImages = fileList.map((file, index) => ({
        vi_image: file.originFileObj,
        vi_remarks: validatedValues[`mv_images[${index}]vi_remarks`],
      }));

      // Create payload for dispatching
      const finalData = new FormData()
      transformedImages.forEach((img, index) => {
        // finalData.append(`mv_vessel_images[${index}]vi_image`, img.vi_image);
        // finalData.append(`mv_vessel_images[${index}]vi_remarks`, img.vi_remarks);
        finalData.append(`vi_image[${index}]`, img.vi_image);
        finalData.append(`vi_remarks[${index}]`, img.vi_remarks);
      });

      // Remove mv_vessel_images and remarks fields from validatedValues
      const cleanedValues = { ...validatedValues, mv_ship_type: validatedValues.mv_type_name };
      delete cleanedValues.mv_images;
      Object.keys(cleanedValues).forEach((key) => {
        if (key.startsWith('mv_images[')) {
          delete cleanedValues[key];
        }
      });

      const newFinalData ={
        finalData, 
        newFinal: cleanedValues, 
        navigation: router,
      }

      if (validatedValues) {
        dispatch(saveRegistedMerchantVessel(newFinalData));
      }

    } catch (error) {
      console.log(error)
    }
  };

  const handleFormValidate = () => {
    const forms = [form];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
        handleSubmit();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [form]
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

  const handleImageAdd = (newFileList) => {
    setFileList(newFileList);
  };

  // Handle file removal
  const handleImageRemove = (file) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this image?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // If the user confirms, update the state to remove the image at the specified index
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        setFileList(newFileList);
      },
    });
    
  };

  return (
    <StyledDiv>
      <PageHeader
        showSearchBox={false}
        showButton={true}
        btnTitle="Save"
        onNavigate={handleFormValidate}
        title="Merchant Vessel Registration" />
      <MerchantVesselTable
        disabled={false}
        vesselForm={form}
        handleImageAdd={handleImageAdd}
        handleImageRemove={handleImageRemove}
      >
      </MerchantVesselTable>
    </StyledDiv>
  );
}

export default RegisteredVesselData;

const StyledDiv = styled.div`
  // .input {
  //   margin-bottom: 20px;
  // }
`;
