import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";
import Router from "next/router";

export const fetchFishingById = createAsyncThunk(
  "fishing/fetch",
  async (key) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing/${key}`
      );
      if (response.status === 200)
        setData(response.data);
    } catch (error) {
      console.log(error);
      // router.push("/404");
    }
  }


);

export const fetchFishingData = createAsyncThunk(
  "fishingReport/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
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

export const saveFishingVessel = createAsyncThunk(
  "fishing/post",
  async (data) => {
    try {
      const macroResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing`,
        data.data
      );

      if (macroResponse.status === 200 || macroResponse.status === 201) {
        const macroKey = macroResponse.data.sr_key;
        
        if(data?.nakwaFormData || data?.crewFormData)
        { // && data.nakwaFormData.has("srci_image[0]")
          const newForm = new FormData()

          // Append data from nakwaFormData to newForm
          if (data.nakwaFormData) {
            for (let [key, value] of data.nakwaFormData.entries()) {
              // console.log("appending to new form", key, value)
              newForm.append(key, value);
          }}
          
          const nakwaKey = macroResponse.data.nakwaDetails.src_key;
          let imageIndex = 0;
          while (data.nakwaFormData.has(`srci_image[${imageIndex}]`)) {
            
            console.log("where")
            // Append the crew key to FormData for each image
            newForm.append(`srci_crew[${imageIndex}]`, nakwaKey);
            imageIndex++;
          }
          
          console.log(data.crewImagesMap.size, "MAP", data?.crewImagesMap)
          if(data?.crewImagesMap && data.crewImagesMap.size > 0)
          {
            console.log("CREW IMAGES MAP")
            macroResponse.data?.crewDetails?.forEach((crew, index) => 
            {
              console.log("here", crew)
              const crewKey = crew.src_key;

              // Retrieve the image from the temporary map
              const imageData = data?.crewImagesMap.get(index);
              console.log("imageData", imageData)

              if (imageData && imageData.srci_image) { // Check if srci_key is present 
                const imageFile = imageData.srci_image; // Get srci_image from the map
                const imageKey = imageData.srci_key;  //  Get srci_key from the map      
                
                console.log("appending")
                  // Append the crew key to FormData for each image
                  newForm.append(`srci_image[${imageIndex}]`, imageFile);
                  // newForm.append(`srci_key[${imageIndex}]`, imageKey);
                  newForm.append(`srci_crew[${imageIndex}]`, crewKey);
                  imageIndex++;
              }
              
              // // Append crew key for each image related to this crew
              // while (data.crewFormData.has(`srci_image[${imageIndex}]`)) {
              //   // Append the crew key to FormData for each image
              //   newForm.append(`srci_crew[${imageIndex}]`, crewKey);
              //   imageIndex++;
              // }
            })
          }

          try{
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/srcrew_image`,
              newForm,
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
        if(data?.ownerFormData && data?.ownerImagesMap && data.ownerImagesMap.size > 0)
        {
          // && data.ownerFormData.has("sroi_image[0]")
          console.log("MAP", data?.ownerImagesMap)
        
          let imageIndex = 0;
          macroResponse.data.ownerDetails.forEach((owner, ownerIndex) => {
            // console.log("here", owner, ownerIndex)
            const ownerKey = owner.sro_key;

              // Append owner key for each image related to this owner
              const imageData = data?.ownerImagesMap.get(ownerIndex);
              // console.log("imageFile", imageData)
              if (imageData) {
                // Append image and corresponding owner key to FormData
                data.ownerFormData.append(`sroi_image[${imageIndex}]`, imageData.sroi_image);
                data.ownerFormData.append(`sroi_owner[${imageIndex}]`, ownerKey);
                imageIndex++;
              }
            });
  
          try{
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/srowner_image`,
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
              showToastError(`Upload failed for owner images. Please try again.`);
            }
          }
        }  
        showToastSuccess(`Data Save Successfully`);
        data.navigation.push('/fishingvessel');
        return macroResponse.data;
      }
    } catch (error) {
      // showToastError(`Error . Please try again.`);
      console.error("Error saving fishing report", error)
    }
  }
);


export const updateFishingVesselReport = createAsyncThunk(
  "fishing/put",
  async (data) => {
    // console.log(data)
    // Send a PUT request to the Special Report report endpoint with the provided data     
    try {
      const macroResponse = await axios.put(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing/${data.sr_key}`,
        data.editedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (macroResponse.status === 200 || macroResponse.status === 201) {

        const macroKey = macroResponse.data.sr_key;
        
        if(data?.nakwaImagesMap || data.nakwaImagesMap.size > 0 || data?.crewImagesMap || data.crewImagesMap.size > 0)
        { 
          console.log(data.nakwaImagesMap.size, "Nakwa MAP", data?.nakwaImagesMap)

          const nakwaKey = macroResponse?.data?.nakwaDetails?.src_key;     
          for (const [imageIndex] of data.nakwaImagesMap.entries())  {
            // Retrieve the image from the temporary map
            const imageData = data?.nakwaImagesMap.get(imageIndex);
            // console.log("imageData", imageData)

            if (imageData && imageData.srci_image && imageData.srci_key) { // Check if srci_key is present 
              // console.log("here in if block")
              const imageFile = imageData.srci_image; // Get srci_image from the map
              const imageKey = imageData.srci_key;  //  Get srci_key from the map  
              const imgRemarks = imageData.srci_remarks; //  Get srci_remarks from the map  
              const updateNakwaForm = new FormData();

              // Append image and corresponding owner key to FormData
              updateNakwaForm.append(`srci_image`, imageFile);
              // updateNakwaForm.append(`srci_vessel`, macroKey);
              updateNakwaForm.append(`srci_remarks`, imgRemarks);
              updateNakwaForm.append(`srci_key`, imageKey);
              updateNakwaForm.append(`srci_crew`, nakwaKey);

              async function handleNakwaImages() {
                try{
                  const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/srcrew_image/${imageKey}`,
                    updateNakwaForm,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );
                  if(response.status === 200 || response.status === 201) {
                    console.log("Image Updated: ",response)
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
              handleNakwaImages();
            } 
          }
          let crewImageIndex = 0;

          // console.log(data.crewImagesMap.size, "Crew MAP", data?.crewImagesMap)
          for (const [crewIndex, crew] of macroResponse.data.crewDetails.entries()) {
            // console.log("here", crew, crewIndex)
            const crewKey = crew.src_key;

            // Retrieve the image from the temporary map
            const imageData = data?.crewImagesMap.get(crewIndex);
            console.log("Crew imageFile", imageData)

            if (imageData && imageData?.srci_image && imageData?.srci_key) { // Check if srci_key is present 
              const imageFile = imageData.srci_image; // Get srci_image from the map
              const imageKey = imageData.srci_key;  //  Get srci_key from the map      
              
              const updateCrewForm = new FormData();

              // Append image and corresponding owner key to FormData
              updateCrewForm.append(`srci_image`, imageFile);
              updateCrewForm.append(`srci_vessel`, macroKey);
              updateCrewForm.append(`srci_key`, imageKey);
              updateCrewForm.append(`srci_crew`, crewKey);

              try{
                const response = await axios.put(
                  `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/srcrew_image/${imageKey}`,
                  updateCrewForm,
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
                  showToastError(`Update failed for crew images. Please try again.`);
                }
              }
            }
            else{
              console.log("No previous image")
              if(imageData?.srci_image)
              {
                const imageFile = imageData.srci_image;
              // Append image and corresponding owner key to FormData
                data.crewFormData.append(`srci_image[${crewImageIndex}]`, imageFile);
                data.crewFormData.append(`srci_crew[${crewImageIndex}]`, crewKey);
              }          
              crewImageIndex++;
            }
          }

        }

        if (data?.nakwaFormData || data?.crewFormData)
        {  
          // Prepare New FormData for new uploaded nakwa and crew images
          const newForm = new FormData();
          const nakwaKey = macroResponse.data?.nakwaDetails[0]?.src_key;     
          let newImageIndex = 0;
          console.log(nakwaKey)

          // Append Nakwa Images
          if (data.nakwaFormData) {
            for (let [key, value] of data.nakwaFormData.entries()) {
              if (key.startsWith("srci_image")) {
                newForm.append(`srci_image[${newImageIndex}]`, value);
                newForm.append(`srci_crew[${newImageIndex}]`, nakwaKey);
              } else if (key.startsWith("srci_crew")) {
                newForm.append(`srci_crew[${newImageIndex}]`, value);
                newImageIndex++;
              }
            }
          }

          // Append Crew Images
          if (data.crewFormData) {
            for (let [key, value] of data.crewFormData.entries()) {
            if (key.startsWith("srci_image")) {
              newForm.append(`srci_image[${newImageIndex}]`, value);
            } else if (key.startsWith("srci_crew")) {
              newForm.append(`srci_crew[${newImageIndex}]`, value);
              newImageIndex++;
            }
            }
          }

          if (newForm.has("srci_image[0]")) {
            try{
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/srcrew_image`,
                newForm,
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
              console.log("Error while creating new crew image", error)
              if (error.response.data) {
                showToastError(`Error : ${error.response.data.error}`);
              } else {
                showToastError(`Upload failed for nakwa/crew images. Please try again.`);
              }
            }
          }
        }

        // if(data?.nakwaFormData || data?.crewFormData)
        //   { // && data.nakwaFormData.has("srci_image[0]")
        //     const newForm = new FormData()
        //     let appendCount = 0; 
  
        //     if (data.nakwaFormData) {
        //       for (let [key, value] of data.nakwaFormData.entries()) {
        //         newForm.append(key, value);
        //         console.log("Appending Nakwa pairs: ", key, value);
        //         // Increment the count each time we append a NakwaFormData entry
        //         if (key.startsWith('srci_image') || key.startsWith('srci_crew')) {
        //           appendCount++;
        //         }
                
        //         // console.log("appendCount: ", appendCount);
        //     }}
  
        //     if (data.crewFormData) {
        //       let crewIndex = 0; // To handle cases where we need to adjust the index for crewFormData
            
        //       // console.log("trying crew: ");
        //       // Append CrewFormData entries to newForm, but adjust the key if it needs to follow NakwaFormData's count
        //       for (let [key, value] of data.crewFormData.entries()) {
                
        //       // console.log("trying HARD: ");
        //         // if (key.startsWith('srci_image') || key.startsWith('srci_crew')) {
        //         if (appendCount >= 1) {
        //           // Adjust the key's index based on the appended entries from NakwaFormData
        //           let newKey = key.replace(/\[\d+\]/, `[${appendCount + crewIndex}]`);
        //           // console.log("trying VVVVV HARD: ");
        //           newForm.append(newKey, value);
        //           crewIndex++;
        //         } else {
        //           // Append without modifying the key for other form data
        //           newForm.append(key, value);
        //         }
        //         console.log("Appending Crew pairs: ", key, value);
        //       }
        //     }
  
        //     const nakwaKey = macroResponse.data.nakwaDetails[0].src_key;          
        //     let imageIndex = 0;
            
        //     // console.log(data.nakwaFormData.has(`srci_image[${imageIndex}]`))
        //     while (data.nakwaFormData.has(`srci_image[${imageIndex}]`)) {
  
        //       // Append the crew key to FormData for each image
        //       newForm.append(`srci_crew[${imageIndex}]`, nakwaKey);
        //       imageIndex++;
        //     }
        //     debugger
        //     if(newForm.has(`srci_image[0]`))
        //     {
        //       for (let [key, value] of newForm.entries())
        //       {
        //         console.log("new bcrew: ",key, value);
        //       }
        //       try{
        //         const response = await axios.post(
        //           `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/srcrew_image`,
        //           newForm,
        //           {
        //             headers: {
        //               "Content-Type": "multipart/form-data",
        //             },
        //           }
        //         );
        //         if(response.status === 200 || response.status === 201) {
        //           console.log(response)
        //         }
        //       }
        //       catch(error)
        //       {
        //         console.log("Error while creating new crew image", error)
        //         if (error.response.data) {
        //           showToastError(`Error : ${error.response.data.error}`);
        //         } else {
        //           showToastError(`Upload failed for nakwa/crew images. Please try again.`);
        //         }
        //       }
        //     }
        //   }

        async function handleOwnerImages() {

          if(data?.ownerFormData && data?.ownerImagesMap)
          {
            // && data.ownerFormData.has("sroi_image[0]")
            console.log("Owner MAP",data.ownerImagesMap.size > 0,  data?.ownerImagesMap)
          
            let imageIndex = 0;
            for (const [ownerIndex, owner] of macroResponse.data.ownerDetails.entries()) {
              // console.log("here", owner, ownerIndex)
              const ownerKey = owner.sro_key;

              // Retrieve the image from the temporary map
              const imageData = data?.ownerImagesMap.get(ownerIndex);
              // console.log("imageFile", imageData)
              if (imageData && imageData.sroi_image && imageData.sroi_key) { // Check if sroi_key is present 
                const imageFile = imageData.sroi_image; // Get sroi_image from the map
                const imageKey = imageData.sroi_key;  //  Get sroi_key from the map      
                
                const updateOwnerForm = new FormData();

                // Append image and corresponding owner key to FormData
                updateOwnerForm.append(`sroi_image`, imageFile);
                updateOwnerForm.append(`sroi_owner`, ownerKey);
                updateOwnerForm.append(`sroi_key`, imageKey);

                try{
                  const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/srowner_image/${imageKey}`,
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
                if(imageData?.sroi_image !== undefined)
                {
                  data.ownerFormData.append(`sroi_image[${imageIndex}]`, imageData?.sroi_image);
                  data.ownerFormData.append(`sroi_owner[${imageIndex}]`, ownerKey);            
                  imageIndex++;
                }
              }
            }
            
          }
          if(data.ownerFormData.has("sroi_image[0]"))
          {
            try{
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/srowner_image`,
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
                showToastError(`Upload failed for owner images. Please try again.`);
              }
            }
          }
        }
        handleOwnerImages();
        showToastSuccess(`Report Updated Successfully`);
        data.navigation.push('/fishingvessel');
        return macroResponse.data;
      }
    } catch (error) {
      console.error(error)
      // showToastError(`Update failed. Please try again.`);
    }
  }
);

export const deleteNakwaCrewImage = createAsyncThunk(
  "crewImg/delete",
  async (key) => {
    // console.log(key)
    // Send a DELETE request to the Special Report report endpoint with the key     
    try {
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/srcrew_image/${key}`,
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
    // console.log(owner_key)
    // Send a DELETE request to the Special Report report endpoint with the key  
    try {
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/srowner_image/${owner_key}`,
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