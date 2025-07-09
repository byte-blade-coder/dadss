import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const addJmisLostReportUploadData = createAsyncThunk(
  "upload/addData",
  async (formData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/lost_report`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(`Data Save Successfully`, {
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

export const addLostReport = createAsyncThunk(
  "csvData/addData",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/lreport`,
        data, // Include the data directly in the request body
        {
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
            toast.success(`Data Save Successfully`, {
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
