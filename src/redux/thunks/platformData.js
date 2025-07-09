import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import axios from "../../axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";
import Router from "next/router";

export const fetchAllPlatformData = createAsyncThunk(
  "data/fetch",
  async (search_data, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken) {
      console.error("No access token found! Not making API call.");
      return rejectWithValue("No access token");
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`,
        {
          params: { search: search_data || "" },
          headers: { Authorization: `JWT ${accessToken}` },
        }
      );

      if (response.status === 200) return response.data;
    } catch (error) {
      // if (error.response?.status === 401) {
        console.error(error);
      //   showToastError("Session expired. Please login again.");
      //   localStorage.removeItem("accessToken");
      //   localStorage.removeItem("refreshToken");
      //   Router.push("/"); 
      //   return rejectWithValue("Unauthorized");
      // }
      
      // showToastError(`Error: ${error.response?.statusText || "Unknown error"}. Kindly login again`);
      // return rejectWithValue(error.response?.statusText);
    }
  }
);


export const addPlatformData = createAsyncThunk("data/entry", async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`,
      data
    );
    if (response.status === 200 || response.status === 201) {
      toast.success("Data added Successfully");
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data);
  }
});
