import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";
import { Form } from "antd";

export const fetchRegisteredVessel = createAsyncThunk(
  "registered/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) return response.data;
    }  catch (error) {
      console.log(error)
      // if (error.response?.status === 401) {
      //   console.error("Unauthorized! Stopping further requests.");
      //   showToastError("Session expired. Please login again.");
      //   localStorage.removeItem("accessToken");
      //   localStorage.removeItem("refreshToken");
      //   Router.push("/"); 
      //   return rejectWithValue("Unauthorized");
      // }
      // else{
      //   showToastError(`Error: ${error.response?.statusText || "Unknown error"}. Kindly login again`);
      //   return rejectWithValue(error.response?.statusText);
      // }
    }
  }
);

export const saveRegistedVessel = createAsyncThunk(
  "registered/post",
  async (data) => {
    try {
      const macroResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel`,
        data.data
      );
      if (macroResponse.status === 200 || macroResponse.status === 201)
      {
        if(data?.formData && data.formData.has("ri_image[0]"))
        {
          const macroKey = macroResponse.data.rv_key;
          data.formData?.append("ri_vessel", macroKey);
          try{
            const vesImgResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel_image`,
              data.formData,
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
              showToastError(`Upload failed. Please try again.`);
            }
          }
        }
        if(data?.nakwaFormData && data.nakwaFormData.has("rci_image[0]"))
        {
          const crewKey = macroResponse.data.nakwaDetails[0].rvc_key;
          let imageIndex = 0;
          while (data.nakwaFormData.has(`rci_image[${imageIndex}]`)) {
            // Append the owner key to FormData for each image
            data.nakwaFormData.append(`rci_crew[${imageIndex}]`, crewKey);
            imageIndex++;
          }
          try{
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvcrew_image`,
              data.nakwaFormData,
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
            if (error.response.data) {
              showToastError(`Error : ${error.response.data.error}`);
            } else {
              showToastError(`Upload failed. Please try again.`);
            }
          }
        }
        if(data?.ownerFormData && data?.ownerImagesMap && data.ownerImagesMap.size > 0)
        {
          // && data?.ownerImagesMap && data.ownerImagesMap.size > 0
          console.log("MAP", data?.ownerImagesMap)
          
          let imageIndex = 0;
          macroResponse.data.ownerDetails.forEach((owner, ownerIndex) => {
            console.log("here", owner, ownerIndex)
            const ownerKey = owner.rvo_key;
            // Retrieve the image from the temporary map
            const imageFile = data?.ownerImagesMap.get(ownerIndex);
            console.log("imageFile", imageFile)
            if (imageFile) {
              // Append image and corresponding owner key to FormData
              data.ownerFormData.append(`roi_image[${imageIndex}]`, imageFile);
              data.ownerFormData.append(`roi_owner[${imageIndex}]`, ownerKey);
              imageIndex++;
            }
          });

          try{
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvowner_image`,
              data.ownerFormData,
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
            if (error.response.data) {
              showToastError(`Error : ${error.response.data.error}`);
            } else {
              showToastError(`Upload failed. Please try again.`);
            }
          }
        }
        showToastSuccess(`Vessel Data saved`);
      }
      localStorage.removeItem("formData");
      localStorage.removeItem("OwnerForm");
      data.navigation.push("/registeredvessels");
      return macroResponse.data;
    } catch (error) {
      console.log(error.response.status)
      if (error.response.status === 403) {
        showToastError(`Error ${error.response.data.detail}`);
      } 
      else if (error.response.status === 400){
        showToastError(`Error: ${error.response.data.error}`);
        if(error.response?.data?.nakwaDetails[0])
        {showToastError(`Error: ${error.response?.data?.nakwaDetails[0]}`);}
      } else { console.log(error)
        showToastError(`Error: ${error.response.data.error}`);
      }
      localStorage.removeItem("formData");
      localStorage.removeItem("OwnerForm");
    }
  }
);

export const updateRegisteredVessel = createAsyncThunk(
  "registered/put",
  async (data) => {
    try {
       // Send a PUT request to the Fishing sreport endpoint with the provided data
       const macroResponse = await axios.put(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel/${data.finalData.rv_key}`,
        data.finalData
      );
      if (macroResponse.status === 200 || macroResponse.status === 201)
      {
        const macroKey = macroResponse.data.rv_key;

        if(data?.vesselImagesMap)
        {
          // && data.formData.has("ri_image[0]")  && data.vesselImagesMap.size > 0
          console.log("Vessel MAP", data.vesselImagesMap.size, data?.vesselImagesMap)

          // let imageIndex = 0;
          
          // console.log(data.vesselImagesMap.has(imageIndex))
          // while (data.vesselImagesMap.has(imageIndex)) {
          for (const [imageIndex] of data.vesselImagesMap.entries()) {
            // Retrieve the image from the temporary map
            const imageData = data?.vesselImagesMap.get(imageIndex);
            console.log("imageData", imageData)

            if (imageData && imageData.ri_image && imageData.ri_key) { // Check if ri_key is present 
              const imageFile = imageData.ri_image; // Get ri_image from the map
              const imageKey = imageData.ri_key;  //  Get ri_key from the map  
              const imgRemarks = imageData.ri_remarks; //  Get ri_remarks from the map  
              const updateVesselForm = new FormData();

              // Append image and corresponding owner key to FormData
              updateVesselForm.append(`ri_image`, imageFile);
              updateVesselForm.append(`ri_vessel`, macroKey);
              updateVesselForm.append(`ri_remarks`, imgRemarks);
              updateVesselForm.append(`ri_key`, imageKey);

              async function handleVesselImages() {
                try{
                  const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel_image/${imageKey}`,
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
                    showToastError(`Upload failed. Please try again.`);
                  }
                }
              }
              // imageIndex++;
              handleVesselImages();
            } 
          }      
        }
        
        if(data?.formData && data.formData.has("ri_image[0]"))
        {       
          data.formData.append(`ri_vessel`, macroKey);
          try{
            const vesImgResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel_image`,
              data.formData,
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
            if (error.response.data) {
              showToastError(`Error : ${error.response.data.error}`);
            } else {
              showToastError(`Upload failed for boat images. Please try again.`);
            }
          }
        }

        if(data?.nakwaImagesMap)
        {
          const nakwaKey = macroResponse?.data?.nakwaDetails[0]?.rvc_key;
          // && data.nakwaFormData.has("ri_image[0]")  && data.nakwaImagesMap.size > 0
          console.log("nakwa MAP", data.nakwaImagesMap.size, data?.nakwaImagesMap)

          // let imageIndex = 0;
          // console.log(data.nakwaImagesMap.has(imageIndex))
          // while (data.nakwaImagesMap.has(imageIndex)) {
          for (const [imageIndex] of data.nakwaImagesMap.entries()) {
            // Retrieve the image from the temporary map
            const imageData = data?.nakwaImagesMap.get(imageIndex);
            // console.log("imageData", imageData)

            if (imageData && imageData.rci_image && imageData.rci_key) { // Check if ri_key is present 
              const imageFile = imageData.rci_image; // Get rci_image from the map
              const imageKey = imageData.rci_key;  //  Get rci_key from the map  
              const imgRemarks = imageData.rci_remarks; //  Get rci_remarks from the map  
              const updateNakwaForm = new FormData();

              // Append image and corresponding owner key to FormData
              updateNakwaForm.append(`rci_image`, imageFile);
              updateNakwaForm.append(`rci_vessel`, macroKey);
              updateNakwaForm.append(`rci_remarks`, imgRemarks);
              updateNakwaForm.append(`rci_key`, imageKey);
              updateNakwaForm.append(`rci_crew`, nakwaKey);

              async function handleNakwaImages() {
                try{
                  const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvcrew_image/${imageKey}`,
                    updateNakwaForm,
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
                    showToastError(`Upload failed. Please try again.`);
                  }
                }
              }
              // imageIndex++;
              await handleNakwaImages();
            } 
          }      
        }

        if(data?.nakwaFormData && data.nakwaFormData.has("rci_image[0]"))
        {
          const crewKey = macroResponse?.data?.nakwaDetails[0]?.rvc_key;

          let imageIndex = 0;
          while (data.nakwaFormData.has(`rci_image[${imageIndex}]`)) {

            // Append the owner key to FormData for each image
            data.nakwaFormData.append(`rci_crew[${imageIndex}]`, crewKey);
            imageIndex++;
          }
          try{
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvcrew_image`,
              data.nakwaFormData,
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
            if (error.response.data) {
              showToastError(`Error : ${error.response.data.error}`);
            } else {
              showToastError(`Upload failed for nakwa/crew images. Please try again.`);
            }
          }
        }
        async function handleOwnerImages() {
          if(data?.ownerFormData && data?.ownerImagesMap)
          {
            // && data?.ownerImagesMap && data.ownerImagesMap.size > 0
            console.log("OWNER MAP", data.ownerImagesMap.size,  data?.ownerImagesMap)
            
            let imageIndex = 0;
            for (const [ownerIndex, owner] of macroResponse.data.ownerDetails.entries()) {
              console.log("here", owner, ownerIndex)
              const ownerKey = owner.rvo_key;

              // Retrieve the image from the temporary map
              const imageData = data?.ownerImagesMap.get(ownerIndex);
              console.log("imageFile", imageData)

              if (imageData && imageData.roi_image && imageData.roi_key) { // Check if roi_key is present 
                const imageFile = imageData.roi_image; // Get roi_image from the map
                const imageKey = imageData.roi_key;  //  Get roi_key from the map      
                
                const updateOwnerForm = new FormData();

                // Append image and corresponding owner key to FormData
                updateOwnerForm.append(`roi_image`, imageFile);
                updateOwnerForm.append(`roi_owner`, ownerKey);
                updateOwnerForm.append(`roi_key`, imageKey);
                try{
                  const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvowner_image/${imageKey}`,
                    updateOwnerForm,
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
                  if (error.response.data) {
                    showToastError(`Error : ${error.response.data.error}`);
                  } else {
                    showToastError(`Upload failed for owner images. Please try again.`);
                  }
                }
              }
              else{
                // Append image and corresponding owner key to FormData               
                if(imageData?.roi_image !== undefined)
                {
                  data.ownerFormData.append(`roi_image[${imageIndex}]`, imageData?.roi_image);
                  data.ownerFormData.append(`roi_owner[${imageIndex}]`, ownerKey);
                  imageIndex++;
                }
              }
            }
            
          }
          data.ownerFormData.forEach((value, key) => {
            console.log(`${key}:`, value);
          });
          
          if(data.ownerFormData.has("roi_image[0]"))
          {
            try{
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvowner_image`,
                data.ownerFormData,
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
              if (error.response.data) {
                showToastError(`Error : ${error.response.data.error}`);
              } else {
                showToastError(`Upload failed for owner images. Please try again.`);
              }
            }
          }
        }

        handleOwnerImages();
        showToastSuccess(`Vessel Data saved`);
      }
      localStorage.removeItem("formData");
      localStorage.removeItem("OwnerForm");
      data.navigation.push("/registeredvessels");
      return macroResponse.data;
    } catch (error) {
      console.log(error)
      if (error.response.status === 403) {
        showToastError(`Error ${error.response.data.detail}`);
      } 
      else if (error.response.status === 400){
        showToastError(`Error: ${error.response.data?.nakwaDetails? error.response.data?.nakwaDetails : error.response.data.error}`);
      } else {
        showToastError(`Error: ${error.response.data.error}`);
      }
      localStorage.removeItem("formData");
      localStorage.removeItem("OwnerForm");
    }
  }
);

export const fetchRegisteredVesselID = createAsyncThunk(
  "registered/fetchID",
  async (rv_key) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel/${rv_key}`
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } catch (error) {
      return "error";
    }
  }
);

export const deleteVesselImage = createAsyncThunk(
  "vesselImg/delete",
  async (key) => {
    console.log(key)
    // Send a DELETE request to the Special Report report endpoint with the key     
    try {
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel_image/${key}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (macroResponse.status === 200 || macroResponse.status === 204) {
        // showToastSuccess(`Image Deleted Successfully`);
        return macroResponse.data;
      }
    } catch (error) {
      showToastError(`Delete failed. Please try again.`);
    }
  }
);

export const deleteNakwaImage = createAsyncThunk(
  "nakwaImg/delete",
  async (key) => {
    console.log(key)
    // Send a DELETE request to the Special Report report endpoint with the key     
    try {
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvcrew_image/${key}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (macroResponse.status === 200 || macroResponse.status === 204) {
        // showToastSuccess(`Image Deleted Successfully`);
        return macroResponse.data;
      }
    } catch (error) {
      showToastError(`Delete failed. Please try again.`);
    }
  }
);

export const deleteOwnerImage = createAsyncThunk(
  "ownerImg/delete",
  async (owner_key) => {
    console.log(owner_key)
    // Send a DELETE request to the Special Report report endpoint with the key  
    try {
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvowner_image/${owner_key}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (macroResponse.status === 200 || macroResponse.status === 204) {
        // showToastSuccess(`Image Deleted Successfully`);
        return macroResponse.data;
      }
    } catch (error) {
      showToastError(`Delete failed. Please try again.`);
    }
  }
);