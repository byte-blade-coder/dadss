import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";

export const fetchAllJettyData = createAsyncThunk(
  "jetty/fetch",
  async (search_data, { rejectWithValue }) => {
    // const accessToken = localStorage.getItem("accessToken");
    
    // if (!accessToken) {
    //   console.error("No access token found! Not making API call.");
    //   return rejectWithValue("No access token");
    // }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/jetty`,
        // {
        //   params: { search: search_data || "" },
        //   // headers: { Authorization: `JWT ${accessToken}` },
        // }
      );

      if (response.status === 200) return response.data;
    } catch (error) {
        console.error(error);
    }
  }
);


export const addJettyData = createAsyncThunk("jetty/entry", async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/jetty`,
      data
    );
    if (response.status === 200 || response.status === 201) {
      showToastSuccess("Data added Successfully");
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data);
  }
});
