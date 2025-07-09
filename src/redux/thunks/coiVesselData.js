import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";
import Router from "next/router";

// export const fetchCoiById = createAsyncThunk(
//   "coi/fetch",
//   async (key) => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreport/${key}`
//       );
//       if (response.status === 200) return response.data;
//     } catch (error) {}
//   }
// );

export const fetchCoiData = createAsyncThunk(
  "coiReport/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreport?ssr_table=${search_data}`
      );
      if (response.status === 200) 
        {
          console.log("COI response: ", response)
          return response.data
        };
    } catch (error) {
        console.log(error)
    }
  }
);

export const saveCoiVessel = createAsyncThunk(
  "coi/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreport`,
        data.data
      );

      if (response.status === 200 || response.status === 201) {
        showToastSuccess(`Data Save Successfully`);
        data.navigation.push('/coireport');
        return response.data;
      }
    } catch (error) {
      showToastError(`Error . Please try again.`);
    }
  }
);


export const addCOIshipUploadData = createAsyncThunk(
  "upload/addData",
  async (formData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreportfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(`Data Save Successfully Upload`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return { data: response.data };
      }
    } catch (error) {
      toast.error(`Upload failed. Please try again.`, {
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
  }
);

export const addCOIdataship = createAsyncThunk(
  "csvData/addData",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreportfile`,
        data, // Include the data directly in the request body
        {
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(`Data Save Successfully for CSV`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return { data: response.data };
      }
    } catch (error) {
      toast.error(`Upload failed. Please try again.`, {
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
  }
);
