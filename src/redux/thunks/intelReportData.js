import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";

export const fetchIntelReport = createAsyncThunk(
  "intel/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport?search=${
          search_data ? search_data : ""
        }`
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


export const fetchIntelReportID = createAsyncThunk(
  "intel/fetch",
  async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport/${id}`
      );
      if (response.status === 200) return response.data;
    } catch (error) {}
  }
);

export const saveIntelReport = createAsyncThunk("intel/post", async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport`,
      data.data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      toast.success("Data added Successfully");
      data.navigation.push("/intelreport");
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data);
  }
});
