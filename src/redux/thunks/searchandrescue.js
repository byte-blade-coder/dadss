import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";

export const fetchSARData = createAsyncThunk(
  "sar/fetch",
  async (search_data) => {
    try {

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/sar?sar_table=${
          search_data ? search_data : ""
        }`,
      
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      // if (error.response.data) {
      //   // showToastError(`Error : ${error.response.data.messages[0].message}`);
      //   showToastError(`Error : ${error.response.statusText}. \nKindly login again`);
      // } else {
      //   showToastError(`Please login again.`);
      // }
    }
  }
);

export const fetchMedicalAssistanceData = createAsyncThunk(
  "med/fetch",
  async (search_data) => {
    try {

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/sar?sar_table=${
          search_data ? search_data : ""
        }`,
      
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      if (error.response.data) {
        showToastError(`Error : ${error.response.statusText}. \nKindly login again`);
      } else {
        showToastError(`Please login again.`);
      }
    }
  }
);

export const addSARData = createAsyncThunk("sar/entry", async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/sar`,
      data.data
    );
    if (response.status === 200 || response.status === 201) {
      toast.success("Data added Successfully");
      data.navigation.push('/searchandrescue');
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data);
  }
});



export const addMedicalAssistanceData = createAsyncThunk("med/entry", async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/sar`,
      data.data
    );
    if (response.status === 200 || response.status === 201) {
      toast.success("Data added Successfully");
      data.navigation.push('/medicalassistance');
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data);
  }
});