import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { showToastError, showToastSuccess } from "../../helper/MyToast";

export const fetchRegisteredMerchantVessel = createAsyncThunk(
  "registered/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) return response.data;
    }  catch (error) {
      console.log(error)
    }
  }
);

export const saveRegistedMerchantVessel = createAsyncThunk(
  "registered/post",
  async (data) => {
    try {
      const macroResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel`,
        data.newFinal
      );
      if (macroResponse.status === 200 || macroResponse.status === 201) {
        // Extract the generated macro key from the response data
        const macroKey = macroResponse.data.mv_key;
        data.finalData.append("vi_vessel", macroKey);
        try{
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel_image`,
            data.finalData,
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
          // if (error.response.data) {
          //   showToastError(`Error : ${error.response.data.error}`);
          // } else {
          //   showToastError(`Upload failed. Please try again.`);
          // }
        }
        showToastSuccess(`Data Save Successfully`);
        data.navigation.push("/registeredmerchantvessels");
        return macroResponse.data;
      }
    } catch (error) {
      console.log(error)
      // if (error.response.data) {
      //   showToastError(`Error : ${error.response.data.error}`);
      // } else {
      //   showToastError(`Upload failed. Please try again.`);
      // }
    }
  }
);

export const fetchRegisteredMerchantVesselFullData = createAsyncThunk(
  "registered/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/register_trip`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      return "error";
    }
  }
);


export const deleteMerchantVesselImage = createAsyncThunk(
  "vesselImg/delete",
  async (key) => {
    console.log(key)
    // Send a DELETE request to the Special Report report endpoint with the key     
    try {
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel_image/${key}`,
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

// export const updateRegisteredMerchantVessel = createAsyncThunk(
//   "registered/put",
//   async (data) => {
//     try {
//       console.log(data)
//        // Send a PUT request to the Fishing sreport endpoint with the provided data
//        const macroResponse = await axios.put(
//         `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel/${data.finalData.mv_key}`,
//         data.finalData
//       );
//       if (macroResponse.status === 200 || macroResponse.status === 201)
//       {
//         const macroKey = macroResponse.data.mv_key;

//         if(data?.vesselImagesMap)
//         {
//           // && data.formData.has("ri_image[0]")  && data.vesselImagesMap.size > 0
//           console.log(data.vesselImagesMap.size, "MAP", data?.vesselImagesMap)

//           let imageIndex = 0;
          
//           console.log(data.vesselImagesMap.has(imageIndex))
//           while (data.vesselImagesMap.has(imageIndex)) {
//             // Retrieve the image from the temporary map
//             const imageData = data?.vesselImagesMap.get(imageIndex);
//             console.log("imageData", imageData)

//             if (imageData && imageData.vi_image && imageData.vi_key) { // Check if vi_key is present 
//               const imageFile = imageData.vi_image; // Get vi_image from the map
//               const imageKey = imageData.vi_key;  //  Get vi_key from the map  
//               const imgRemarks = imageData.vi_remarks; //  Get vi_remarks from the map  
//               const updateVesselForm = new FormData();

//               // Append image and corresponding owner key to FormData
//               updateVesselForm.append(`vi_image`, imageFile);
//               updateVesselForm.append(`vi_vessel`, macroKey);
//               updateVesselForm.append(`vi_remarks`, imgRemarks);
//               updateVesselForm.append(`vi_key`, imageKey);

//               async function handleVesselImages() {
//                 try{
//                   const response = await axios.put(
//                     `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel_image/${imageKey}`,
//                     updateVesselForm,
//                     {
//                       headers: {
//                         "Content-Type": "multipart/form-data",
//                       },
//                     }
//                   );
//                   if(response.status === 200 || response.status === 201) {
//                     console.log(response)
//                   }
//                 }
//                 catch(error)
//                 {
//                   console.log(error)
//                   if (error?.response?.data) {
//                     showToastError(`Error : ${error?.response?.data?.error}`);
//                   } else {
//                     showToastError(`Upload failed. Please try again.`);
//                   }
//                 }
//               }
//               imageIndex++;
//               handleVesselImages();
//             } 
//           }      
//         }
        
//         if(data?.formData && data.formData.has("vi_image[0]"))
//         {       
//           data.formData.append(`vi_vessel`, macroKey);
//           try{
//             const vesImgResponse = await axios.post(
//               `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel_image`,
//               data.formData,
//               {
//                 headers: {
//                   "Content-Type": "multipart/form-data",
//                 },
//               }
//             );
//             if(vesImgResponse.status === 200 || vesImgResponse.status === 201) 
//               console.log(vesImgResponse)
//           }
//           catch(error)
//           {
//             console.log(error)
//             if (error.response.data) {
//               showToastError(`Error : ${error.response.data.error}`);
//             } else {
//               showToastError(`Upload failed for boat images. Please try again.`);
//             }
//           }
//         }

//         showToastSuccess(`Vessel Data saved`);
//       }
//       data.navigation.push("/registeredmerchantvessels");
//       return macroResponse.data;
//     } catch (error) {
//       console.log(error)
//       if (error.response.status === 403) {
//         showToastError(`Error ${error.response.data.detail}`);
//       } 
//       else if (error.response.status === 400){
//         showToastError(`Error: ${error.response.data.nakwaDetails}`);
//       } else {
//         showToastError(`Error: ${error.response.data.error}`);
//       }
//       localStorage.removeItem("formData");
//       return "error";
//     }
//   }
// );
