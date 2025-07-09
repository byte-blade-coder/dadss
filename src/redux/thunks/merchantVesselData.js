import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";
import Router from "next/router";

export const fetchMerchantById = createAsyncThunk(
  "merchant/fetch",
  async (key) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant/${key}`
      );
      if (response.status === 200) return response.data;
    } catch (error) {}
  }
);

export const fetchMerchantData = createAsyncThunk(
  "merchantReport/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error)
    }
  }
);

export const saveMerchantVessel = createAsyncThunk(
  "merchant/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant`,
        data.data
      );
      if (response.status === 200 || response.status === 201) {
        showToastSuccess(`Data Save Successfully`);
        data.navigation.push('/merchantvessel');
        return response.data;
      }
    } catch (error) {
      showToastError(`Upload failed. Please try again.`);
    }
  }
);


export const fetchMerchantRoutesData = createAsyncThunk(
  "merchantRoute/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/vessel_position?ship_id=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error)
    }
  }
);

