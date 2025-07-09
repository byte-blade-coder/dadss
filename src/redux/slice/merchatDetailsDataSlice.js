import { createSlice } from "@reduxjs/toolkit";
import { fetchMerchantDetails } from "../thunks/merchantVesselDetailsData";
export const fetchMerchantVesselDetailsSlice = createSlice({
  name: "fetchMerchantVesselDetails",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMerchantDetails.pending, (state) => {
        return {
          // ...state,
          data: [],
          isLoading: true,
        };
      })
      .addCase(fetchMerchantDetails.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchMerchantDetails.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
  },
});
