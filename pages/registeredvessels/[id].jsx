import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import axios from "axios";
import dayjs from "dayjs";
import { RegVesselColumn } from "../../src/helper/DataColumns";
import TableItemRenderer from "../../src/components/table/RenderTable";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Checkbox, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredVesselID, updateRegisteredVessel, deleteVesselImage, deleteNakwaImage, deleteOwnerImage } from "../../src/redux/thunks/registeredVesselData";
import { useRouter } from "next/router";
import FishingVesselTable from "../../src/components/table/FishingVesselTable";
import { useForm } from "antd/lib/form/Form";
import { hasPermission } from "../../src/helper/permission";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import NakwaForm from "../../src/components/stackedForm/NakwaForm";
import OwnerTable from "../../src/components/specialTables/OwnerTable";
import urlToFile from "../../src/helper/urlToImgFileCovertor";

function RegisteredVesselDetails() {
  const [data, setData] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { rv_key } = router.query; // Extract rv_key from query parameters
  const [vesselForm] = useForm();
  const [nakwaForm] = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [ownerData, setOwnerData] = useState([]);
  const [hasPicture, setHasPicture] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [nakwaImgs, setNakwaImgs] = useState([]);
  const [ownerImgs, setOwnerImgs] = useState([]);
  const [tempRemovedVesselFiles, setTempRemovedVesselFiles] = useState([]);
  const [tempRemovedNakwaFiles, setTempRemovedNakwaFiles] = useState([]);
  const [tempRemovedOwnerFiles, setTempRemovedOwnerFiles] = useState([]);
  const changePermission = hasPermission("change_rvessels");
  // const deletePermision = hasPermission("delete_rvessels");
  const deletePermision = false;

  const fetchRegisteredVesselID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel/${rv_key}`
      );
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      //console.log("error:", error)
      if(error.response.status === 404) router.push("/404");
      else if(error.response.status === 401) router.push("/404");
      else if(error.response.status === 403) router.push("/403");
      else if(error.response.status === 500) router.push("/500");
      else router.push('/')
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
       const imageFiles = data?.rv_images?.map(img => (
        {
          ri_remarks: img.ri_remarks,
          uid: img.ri_key,
          name: img.ri_image?.split('/').pop(),
          url: img.ri_image,
          originFileObj: null, // Placeholder, as `originFileObj` is not available in fetched data
          boatKey: img.ri_key,
      }));
      
      setFileList(imageFiles);

      const nakwaFiles = data?.nakwaDetails[0]?.rvc_images?.map(img => (
        {
          rci_remarks: img.rci_remarks,
          uid: img.rci_key,
          name: img.rci_image?.split('/').pop(),
          url: img.rci_image,
          originFileObj: null,
          crewKey: img.rci_key,
      }));   
      setNakwaImgs(nakwaFiles);

      vesselForm.setFieldsValue({
        ...data,
        rv_images: imageFiles,
      });
      if (data.nakwaDetails){
        nakwaForm.setFieldsValue({
          ...data.nakwaDetails[0],
          rvc_key: data.nakwaDetails[0]?.rvc_key,
          rvc_images: nakwaFiles,
        })
      }
      if (data.ownerDetails){
        setOwnerData(
          data.ownerDetails.map((item) => ({
            ...item,
            rvo_key: item.rvo_key,
            rvo_idexpdt: item.rvo_idexpdt ? dayjs(item.rvo_idexpdt) : null,
            rvo_images:  item.rvo_images[0]?.roi_image ? {
              roi_image : item.rvo_images[0]?.roi_image,
              roi_key : item.rvo_images[0]?.roi_key,
              roi_owner : item.rvo_images[0]?.roi_owner,
              roi_name: item.rvo_images[0]?.roi_image?.split('/').pop(),
            } : {},
          }))
        );
      }
    }
  }, [data]);

  function prepareFormData(dataFromDb, name) {
    // console.log("urltofile", dataFromDb, name);
    return urlToFile(dataFromDb, `${name}`, "image/jpeg");
  }

  const handleUpdate = async () => {
   try{
    const validatedValues = await vesselForm.validateFields();
    const nakwaValues = await nakwaForm.validateFields();

    if(tempRemovedVesselFiles)
    {
      // Dispatch API call to delete images only when "Save Changes" is clicked
      tempRemovedVesselFiles?.forEach((file) => {
        if (file.uid && file.boatKey) {
          dispatch(deleteVesselImage(file.uid));
        }
      });
  
      // Clear the tempRemovedFiles array after update
      setTempRemovedVesselFiles([]);
    }

    if(tempRemovedNakwaFiles)
    { 
      // Dispatch API call to delete images only when "Save Changes" is clicked
      tempRemovedNakwaFiles?.forEach((file) => {
        if (file.uid && file.crewKey) {
          dispatch(deleteNakwaImage(file.uid));
        }
      });
  
      // Clear the tempRemovedFiles array after update
      setTempRemovedNakwaFiles([]);
    }

    if(tempRemovedOwnerFiles)
    { 
      // Dispatch delete action for all temporarily deleted images
      tempRemovedOwnerFiles.forEach(({ key }) => {
        if (key) {
          DeleteOwnerImage(key);
        }
      });

      setTempRemovedOwnerFiles([]);
    }

    const initialVesselRemarksMap = new Map();
    fileList?.forEach(img => {
      initialVesselRemarksMap.set(img.boatKey, img.ri_remarks);
    });

    const initialNakwaRemarksMap = new Map();
    nakwaImgs?.forEach(img => {
      // console.log(img)
      initialNakwaRemarksMap.set(img.uid, img.rci_remarks);
    });

     // Transforming fileList to match the required format
    const transformedImages = fileList?.map((file, index) => (
      {
        ri_image: file.originFileObj ? file.originFileObj : file.url,
        ri_remarks: validatedValues[`rv_images[${index}]ri_remarks`] ? 
        validatedValues[`rv_images[${index}]ri_remarks`] : "",
        ri_name: file.name? file.name : "",
        ri_key: file.uid? file.uid : "",
    }));

    // Transforming nakwaImgs to match the required format
    const transformedNakwaImages = nakwaImgs?.map((file, index) => (
      {
        rci_image: file.originFileObj ? file.originFileObj : file.url,
        rci_remarks: nakwaValues[`rvc_images[${index}]rci_remarks`] ? 
        nakwaValues[`rvc_images[${index}]rci_remarks`] : "",
        rci_name: file.name? file.name : "",
        rci_key: file.uid? file.uid : "",
    }));

    // Transforming ownerData to match the required format
    const transformedOwnerImages = ownerData?.flatMap((owner) => {
      // Check if owner has images
      if (!owner.rvo_images || owner.rvo_images.length === 0 ||  Object.keys(owner.rvo_images).length === 0) {
        return []; // Return an empty array if there are no images, which flatMap will ignore
      }
    //owner.rvo_images[0].roi_image ?
    //owner.rvo_images.sroi_image , incase saving a sreport for a vessel again
      return { 
        roi_image: owner.rvo_images?.roi_image ? owner.rvo_images?.roi_image : owner.rvo_images?.roi_image,
        roi_name: owner.rvo_images?.roi_image ? owner.rvo_images?.roi_name : owner.rvo_images?.roi_image?.name,
        roi_key: owner.rvo_images?.roi_key,
       };
    });

   // Create payload for dispatching
    const vesselImgData = new FormData()
    const NakwaImgData = new FormData()
    const OwnerImgData = new FormData();

    //Maps to store images and corresponding keys temporarily
    const vesselImagesMap = new Map();
    const nakwaImagesMap = new Map();
    const ownerImagesMap = new Map();

    async function processImages() {
      let boatIndex = 0;
      let newboatIndex = 0;
      let nakwaIndex = 0;
      let newNakwaIndex = 0;
      let ownerIndex = 0;

      for (const img of transformedImages) {
        const previousRemark = initialVesselRemarksMap?.get(img.ri_key); // Get the initial remark
        const isRemarkUpdated = img.ri_remarks !== previousRemark; // Check if it changed

        if (typeof img.ri_image === 'string' && img.ri_image.includes("http")) {
          if (isRemarkUpdated) { // Only update if remark changed
            try {
              const image = await prepareFormData(img.ri_image, img.ri_name);
              const imgObj = {
                ri_image: image,
                ri_key: img.ri_key,
                ri_remarks: img.ri_remarks,
                ri_name: img.ri_name
              };
              vesselImagesMap.set(newboatIndex, imgObj);
            } catch (error) {
              console.error("Error processing image:", error);
              showToastError(`Error processing image. ${error}`);
            }
          }
          newboatIndex++;
        } else {
          // const imgObj = {ri_image: img.ri_image}
          // // If the image is not a URL, store it directly
          // vesselImagesMap.set(index, imgObj);
          vesselImgData.append(`ri_image[${boatIndex}]`, img.ri_image);
          vesselImgData.append(`ri_remarks[${boatIndex}]`, img.ri_remarks);
          boatIndex++;
        }

      }

      if(transformedNakwaImages)
      {
        for (const img of transformedNakwaImages) {
          const previousRemark = initialNakwaRemarksMap?.get(img.rci_key); // Get the initial remark
          const isRemarkUpdated = img.rci_remarks !== previousRemark; // Check if it changed
          // console.log(img, initialNakwaRemarksMap, previousRemark, isRemarkUpdated)
          
          if (typeof img.rci_image === 'string' && img.rci_image.includes("http")) {
            if(isRemarkUpdated){
              try {
                const image = await prepareFormData(img.rci_image, img.rci_name);
                const imgObj = {
                  rci_image: image, 
                  rci_key: img.rci_key,
                  rci_remarks: img.rci_remarks,
                  rci_name: img.rci_name
                }
                nakwaImagesMap.set(newNakwaIndex, imgObj);
                // NakwaImgData.append(`rci_image[${nakwaIndex}]`, image);
                // NakwaImgData.append(`rci_remarks[${nakwaIndex}]`, img.rci_remarks);
                // NakwaImgData.append(`rci_key[${nakwaIndex}]`, img.rci_key);
              } catch (error) {
                console.error("Error processing image:", error);
                showToastError(`Error processing image. ${error}`);
              }
          } 
            newNakwaIndex++;
          } else {
            NakwaImgData.append(`rci_image[${nakwaIndex}]`, img.rci_image);
            NakwaImgData.append(`rci_remarks[${nakwaIndex}]`, img.rci_remarks);
            nakwaIndex++;
          }
        }
      }

      for (const [index, owner] of ownerData.entries()) {
        console.log(index, owner)   //roi_images.roi_image
        if (owner.rvo_images && owner.rvo_images.roi_image) {
          let roi_image = owner.rvo_images.roi_image;
    
          if (typeof roi_image === 'string' && roi_image.includes("http")) {           
            
            // If the image is a URL, process it
            try {
              const image = await prepareFormData(roi_image, owner.rvo_images.roi_name);
              const imgObj = {
                roi_image: image, 
                roi_key: owner.rvo_images.roi_key,
                roi_name: owner.rvo_images.roi_name
              }
              ownerImagesMap.set(index, imgObj);
            } catch (error) {
              console.error("Error processing image:", error);
              showToastError(`Error processing image. ${error}`);
            }
          } else {
            const imgObj = {roi_image: roi_image}
            // If the image is not a URL, store it directly
            ownerImagesMap.set(index, imgObj);
          }
        }
        else if(owner.roi_images && owner.roi_images.roi_image ){
          let roi_image = owner.roi_images.roi_image;
    
          if (typeof roi_image === 'string' && roi_image.includes("http")) {           
            
            // If the image is a URL, process it
            try {
              const image = await prepareFormData(roi_image, owner.roi_images.roi_name);
              const imgObj = {
                roi_image: image, 
                roi_key: owner.roi_images.roi_key,
                roi_name: owner.roi_images.roi_name
              }
              ownerImagesMap.set(index, imgObj);
            } catch (error) {
              console.error("Error processing image:", error);
              showToastError(`Error processing image. ${error}`);
            }
          } else {
            const imgObj = {roi_image: roi_image}
            // If the image is not a URL, store it directly
            ownerImagesMap.set(index, imgObj);
          }
        }
      }

      console.log("All images processed");
      // Now you can send NakwaImgData to the server
    }
    
    // Call the function to process images
    await processImages();

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
    const isObjectEmpty = (obj) =>
      Object.values(obj).every(
        (val) => val === undefined || val === null || val === ''
      );

    // Clean the nakwaDetails array
    const nakwaDetails = isObjectEmpty(finalNakwaValues)
      ? []
  : [{...finalNakwaValues, 
        rvc_key: data.nakwaDetails[0]?.rvc_key,}];
    // Remove roi_images and remarks fields from nakwaDetails
    const finalOwnerValues = ownerData.map((owner) => {
      const { rvo_images, ...cleanedOwner } = owner;
      return cleanedOwner;
    });

    const finalData = {
      ...cleanedValues,
      rv_key: data.rv_key,  
       nakwaDetails,
      // nakwaDetails: [{...finalNakwaValues, 
      //   rvc_key: data.nakwaDetails[0]?.rvc_key,}],
      ownerDetails: finalOwnerValues.map((item,index) => (
      {
        ...item,
        rvo_idexpdt: dayjs(item.rvo_idexpdt).format("YYYY-MM-DD"),
        rvo_key: data.ownerDetails[index]?.rvo_key,
      })),
    };

    const finalData2 = {
      finalData,
      formData: vesselImgData,
      vesselImagesMap: vesselImagesMap,
      nakwaFormData: NakwaImgData,
      nakwaImagesMap: nakwaImagesMap,
      ownerFormData: OwnerImgData,
      ownerImagesMap: ownerImagesMap,
      navigation: router,
    }

    console.log("Vessel Registration Final data: ", finalData2)
    dispatch(updateRegisteredVessel(finalData2));
   }
   catch (error) {
    console.error("Validation Error: ", error);
    if (error.errorFields && error.errorFields.length > 0) {
      showToastError(`Error: All required fields must be completed.`)
    }
   }
    // try {
    //   // Send a PUT request to the Fishing sreport endpoint with the provided data
    //   const Response = await axios.put(
    //     `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel/${data.rv_key}`,
    //     finalData
    //   );
    //   // Check if the response status is either 200 or 201
    //   if (Response.status === 200 || Response.status === 201) {
    //     //router.push("/registeredvessels");
    //     showToastSuccess(`Report Updated Successfully`);
    //   } else {
    //     showToastError("Upload failed. Please try again.");
    //   }
    // } catch (error) {
    //   showToastError("Upload failed. Please try again.");
    // }
  };

  const handleDelete = async () => {
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const Response = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel/${data.rv_key}`
      );
      // Check if the response status is either 200 or 201
      if (Response.status === 200 || Response.status === 204) {
        router.push("/registeredvessels");
        showToastSuccess(`Report Deleted Successfully`);
      } else {
        showToastError("Report Deletion failed. Please try again.");
      }
    } catch (error) {
      showToastError("Report Deletion failed. Please try again.");
    }
  };

  const handleBack = () => {

    if (tempRemovedVesselFiles.length > 0) {
      setFileList((prev) => [...prev, ...tempRemovedVesselFiles]); // Restore images
      setTempRemovedVesselFiles([]); // Clear temp storage
    }

    if (tempRemovedNakwaFiles.length > 0) {
      setNakwaImgs((prev) => [...prev, ...tempRemovedNakwaFiles])
      setTempRemovedNakwaFiles([]);
    }

    if (tempRemovedOwnerFiles.length > 0)
    {
      setOwnerData((prev) => {
        const newItems = [...prev];
        tempRemovedOwnerFiles.forEach(({ index, type, value }) => {
          newItems[index][type] = value; // Restore the deleted image
        });
        return newItems;
      });
    
      setTempRemovedOwnerFiles([]); // Clear temporary deleted images
    }

    router.back();
  };
  
  // Handle vessel img file addition
  const handleImageAdd = (newFileList) => {
    setFileList(newFileList);
  };

  // Handle vessel img file removal
  const handleImageRemove = (file) => {
    // If the user confirms, update the state to remove the image at the specified index
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    
    // Store temporarily removed files
    setTempRemovedVesselFiles((prev) => [...prev, file]);
    // if(file.uid && file.boatKey)
    // {
    //   dispatch(deleteVesselImage(file.uid));
    // }
  };

  // Handle nakwa img file addition
  const AddNakwaImg = (newFileList) => {
    setNakwaImgs(newFileList);
  };

  // Handle nakwa img file removal
  const RemoveNakwaImg = (file) => {
    // If the user confirms, update the state to remove the image at the specified index
    const newFileList = nakwaImgs.filter((item) => item.uid !== file.uid);
    setNakwaImgs(newFileList);
        
    // Store temporarily removed files
    setTempRemovedNakwaFiles((prev) => [...prev, file]);
    // if(file.uid && file.crewKey)
    // {
    //   dispatch(deleteNakwaImage(file.uid));
    // }
  };

  const DeleteOwnerImage = (imgKey) => {
    if(imgKey)
    {
      dispatch(deleteOwnerImage(imgKey));
    }
  }

  return (
    <div>
      <PageHeader
        deleteButton={deletePermision}
        onDelete={handleDelete}
        UpdateButton={changePermission}
        onUpdate={handleUpdate}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        handleBack={handleBack}
        title="Fishing Vessels Details"
      />
      <div className="mb-10">
        <FishingVesselTable
          disabled={!isEditing}
          vesselForm={vesselForm}
          fixedDisabled={true}
          hasPicture={hasPicture}
          handleImageAdd={handleImageAdd}
          handleImageRemove={handleImageRemove}
          fileList={fileList}
        >
        </FishingVesselTable>
        <NakwaForm
          disabled={!isEditing}
          form={nakwaForm}
          reportKeys="rvc"
          hasPicture={hasPicture}
          handleImageAdd={AddNakwaImg}
          handleImageRemove={RemoveNakwaImg}
          fileList={nakwaImgs}
        >
      </NakwaForm>
      <OwnerTable
        ownerData={ownerData}
        setOwnerData={setOwnerData}
        showButtons={isEditing}
        reportKeys="rvo"
        state="edit"
        onRemove={DeleteOwnerImage}
        tempDeletedImages={tempRemovedOwnerFiles}
        setTempDeletedImages={setTempRemovedOwnerFiles}
      />
      </div>
    </div>
  );
}

export default RegisteredVesselDetails;
