import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const uploadPersonImage = createAsyncThunk(
  "upload/image",
  async (formData) => {
    localStorage.removeItem("personDetails");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/face_recognition`,
        formData,
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
        localStorage.setItem('personDetails', JSON.stringify(response.data));
        return { data: response.data };
      }
      setTimeout(() => {
        localStorage.removeItem("personDetails");
      }, 40000)
    } catch (error) {

      const errorResponse = error.response?.data
      localStorage.removeItem("personDetails");
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
  }
);