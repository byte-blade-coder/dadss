import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchCargoDhowData = createAsyncThunk(
  "cargo/fetch",
  async (search_data) => {
    try {
console.log(search_data)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/table_output?table=${
          search_data ? search_data : ""
        }`,
      
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log(error)
    }
  }
);
