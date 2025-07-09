import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { MerVesselColumn } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import MerchantVesselTable from "../../src/components/table/MerchantVesselTable";
import { hasPermission } from "../../src/helper/permission";
import { useForm } from "antd/lib/form/Form";
import { updateRegisteredMerchantVessel, deleteMerchantVesselImage } from "../../src/redux/thunks/registerMerchantVesselDatas";
import { useRouter } from "next/router";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import urlToFile from "../../src/helper/urlToImgFileCovertor";

function RegistedMerchantVesselDetails() {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { mv_key } = router.query; // Extract mv_key from query parameters
  const [vesselForm] = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const changePermission = true;
  // const deletePermision = true;
  const deletePermision = false;
  const [hasPicture, setHasPicture] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [tempRemovedVesselFiles, setTempRemovedVesselFiles] = useState([]);

  const fetchRegisteredVesselID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel/${mv_key}`
      );
      
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      router.push("/404");
    }
  };

  useEffect(() => {
    if (!data) {
      fetchRegisteredVesselID();
    }
  }, []);

  useEffect(() => {
    if (data) {
      // Convert image data to fileList format
      const imageFiles = data?.mv_images?.map(img => (
        {
          vi_remarks: img.vi_remarks,
          uid: img.vi_key,
          name: img.vi_image?.split('/').pop(),
          url: img.vi_image,
          status: 'done',
          originFileObj: null, // Placeholder, as `originFileObj` is not available in fetched data
          boatKey: img.vi_key,
      }));
      
      setFileList(imageFiles);
      vesselForm.setFieldsValue({
        ...data,
        mv_images: imageFiles,
      })
      if(data.mv_images && data.mv_images.length >= 1)
      {
        setHasPicture(true)
      }
    }
  }, [data]);

  function prepareFormData(dataFromDb, name) {
    console.log("urltofile", dataFromDb, name);
    return urlToFile(dataFromDb, `${name}`, "image/jpeg");
  }

  const handleUpdate = async () => {
    try{
      const validatedValues = await vesselForm.validateFields();

      if(tempRemovedVesselFiles)
      {
        // Dispatch API call to delete images only when "Save Changes" is clicked
        tempRemovedVesselFiles?.forEach((file) => {
          console.log("tempRemovedVesselFiles")  
          if (file.uid && file.boatKey) {
            dispatch(deleteMerchantVesselImage(file.uid));
          }
        });
    
        // Clear the tempRemovedFiles array after update
        setTempRemovedVesselFiles([]);
      }

      const initialVesselRemarksMap = new Map();
      fileList?.forEach(img => {
        initialVesselRemarksMap.set(img.boatKey, img.vi_remarks);
      });

      const transformedImages = fileList?.map((file, index) => (
        {
          vi_image: file.originFileObj ? file.originFileObj : file.url,
          vi_remarks: validatedValues[`mv_images[${index}]vi_remarks`] ? 
          validatedValues[`mv_images[${index}]vi_remarks`] : "",
          vi_name: file.name? file.name : "",
          vi_key: file.uid? file.uid : "",
      }));
  
      const vesselImgData = new FormData()
      const vesselImagesMap = new Map();
  
      async function processImages() {
        let boatIndex = 0;
        let newBoatIndex = 0;
      
        for (const img of transformedImages) {
          const previousRemark = initialVesselRemarksMap?.get(img.vi_key) || ''; // Get the initial remark
          const isRemarkUpdated = img.vi_remarks !== previousRemark; // Check if it changed

          if (typeof img.vi_image === 'string' && img.vi_image.includes("http")) {
            if(isRemarkUpdated)
              {
                try {
                  const image = await prepareFormData(img.vi_image, img.vi_name);
                  const imgObj = {
                    vi_image: image, 
                    vi_key: img.vi_key,
                    vi_remarks: img.vi_remarks,
                    vi_name: img.vi_name
                  }
                  vesselImagesMap.set(boatIndex, imgObj);
                } catch (error) {
                  console.error("Error processing image:", error);
                  showToastError(`Error processing image. ${error}`);
                }
              }
            boatIndex++;
          } else {
            vesselImgData.append(`vi_image[${newBoatIndex}]`, img.vi_image);
            vesselImgData.append(`vi_remarks[${newBoatIndex}]`, img.vi_remarks);
            newBoatIndex++;
          }
  
        }
  
        console.log("All images processed");
      }
        
      // Call the function to process images
      processImages();
  
      // Remove rv_images and remarks fields from validatedValues
      const cleanedValues = { ...validatedValues, mv_ship_type: validatedValues.mv_type_name };
      delete cleanedValues.mv_images;
      Object.keys(cleanedValues).forEach((key) => {
        if (key.startsWith('mv_images[')) {
          delete cleanedValues[key];
        }
      });
      console.log("processed", cleanedValues);
  
      const finalData = {
        ...cleanedValues,
      };
  
      const finalData2 = {
        finalData,
        formData: vesselImgData,
        vesselImagesMap: vesselImagesMap,
      };
  
      // dispatch(updateRegisteredMerchantVessel(finalData2));
      try {
        // Send a PUT request to the Register Merchant endpoint with the provided data
        const Response = await axios.put(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel/${data.mv_key}`,
          finalData2.finalData
        );
        // Check if the response status is either 200 or 201
        if (Response.status === 200 || Response.status === 201) {
  
          if(finalData2?.vesselImagesMap)
          {
            // && data.formData.has("ri_image[0]")  && data.vesselImagesMap.size > 0
            console.log(finalData2.vesselImagesMap.size, "MAP", finalData2?.vesselImagesMap)
  
            let imageIndex = 0;
            
            while (finalData2.vesselImagesMap.has(imageIndex)) {
              // Retrieve the image from the temporary map
              const imageData = finalData2?.vesselImagesMap.get(imageIndex);
  
              if (imageData && imageData.vi_image && imageData.vi_key) { // Check if vi_key is present 
                const imageFile = imageData.vi_image; // Get vi_image from the map
                const imageKey = imageData.vi_key;  //  Get vi_key from the map  
                const imgRemarks = imageData.vi_remarks; //  Get vi_remarks from the map  
                const updateVesselForm = new FormData();
  
                // Append image and corresponding owner key to FormData
                updateVesselForm.append(`vi_image`, imageFile);
                updateVesselForm.append(`vi_vessel`, data.mv_key);
                updateVesselForm.append(`vi_remarks`, imgRemarks);
                updateVesselForm.append(`vi_key`, imageKey);
  
                async function handleVesselImages() {
                  try{
                    const response = await axios.put(
                      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel_image/${imageKey}`,
                      updateVesselForm,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    if(response.status === 200 || response.status === 201) {
                      console.log(response)
                    }
                  }
                  catch(error)
                  {
                    console.log(error)
                    if (error?.response?.data) {
                      showToastError(`Error : ${error?.response?.data?.error}`);
                    } else {
                      showToastError(`Update failed. Please try again.`);
                    }
                  }
                }
                imageIndex++;
                handleVesselImages();
              } 
            }      
          }
  
          if(finalData2?.formData && finalData2.formData.has("vi_image[0]"))
          {       
            console.log("vesImgResponse2")
            finalData2.formData.append(`vi_vessel`, data.mv_key);
            try{
              const vesImgResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel_image`,
                finalData2.formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              if(vesImgResponse.status === 200 || vesImgResponse.status === 201) 
                console.log(vesImgResponse)
            }
            catch(error)
            {
              console.log(error)
              if (error.response.data) {
                showToastError(`Error : ${error.response.data.error}`);
              } else {
                showToastError(`Upload failed for boat images. Please try again.`);
              }
            }
          }
          router.push("/registeredmerchantvessels");
          showToastSuccess(`Merchant Vessel Updated Successfully`);
          // return Response.data;
        } else {
          showToastError("Update failed. Please try again.");
        }
      } catch (error) {
        showToastError("Update failed. Please try again.");
      }  
    }
    catch (error) {
        if (error.errorFields && error.errorFields.length > 0) {
          showToastError(`Error: All required fields must be completed.`)
        }
       }
  };

  const handleDelete = async () => {
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const Response = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel/${data.mv_key}`
      );
      // Check if the response status is either 200 or 201
      if (Response.status === 200 || Response.status === 204) {
        router.push("/registeredmerchantvessels");
        showToastSuccess(`Report Deleted Successfully`);
      } else {
        showToastError("Report Deletion failed. Please try again.");
      }
    } catch (error) {
      showToastError("Report Deletion failed. Please try again.");
    }
  };

  const handleBack = () => {
    setFileList((prev) => [...prev, ...tempRemovedVesselFiles]); // Restore images
    setTempRemovedVesselFiles([]); // Clear temp storage
    router.back();
  };
  
  const handleImageAdd = (newFileList) => {
    setFileList(newFileList);
  };

  const handleImageRemove = (file) => {
    // setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
        setFileList(newFileList);
        // Store temporarily removed files
        setTempRemovedVesselFiles((prev) => [...prev, file]);
        // if(file.uid && file.boatKey)
        // {
        //   dispatch(deleteMerchantVesselImage(file.uid));
        // }
  };

  return (
    <>
      <div>
        <PageHeader
          title="Merchant Vessel Details"
          deleteButton={deletePermision}
          onDelete={handleDelete}
          UpdateButton={changePermission}
          onUpdate={handleUpdate}
          setIsEditing={setIsEditing}
          handleBack={handleBack}
          isEditing={isEditing}
        />
        <MerchantVesselTable
          disabled={!isEditing}
          vesselForm={vesselForm}
          fixedDisabled={true}
          hasPicture={hasPicture}
          handleImageAdd={handleImageAdd}
          handleImageRemove={handleImageRemove}
          fileList={fileList}
        >
        </MerchantVesselTable>
      </div>
    </>
  );
}

export default RegistedMerchantVesselDetails;
