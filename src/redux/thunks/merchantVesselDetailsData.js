import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMerchantDetails = createAsyncThunk(
  "merchantDetails/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant_vessels?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
    }
  }
);
