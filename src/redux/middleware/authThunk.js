// authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRefreshToken = createAsyncThunk(
  "auth/fetchRefreshToken",
  async (refreshToken, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/token/refresh`,
          refreshToken 
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
