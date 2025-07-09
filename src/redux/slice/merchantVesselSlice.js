import { createSlice } from "@reduxjs/toolkit";
import { fetchMerchantById, fetchMerchantData, fetchMerchantRoutesData } from "../thunks/merchantVesselData";
export const fetchMerchantVesselSlice = createSlice({
  name: "fetchMerchantVessel",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMerchantById.pending, (state) => {
        return {
          // ...state,
          data: [],
          isLoading: true,
        };
      })
      .addCase(fetchMerchantById.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchMerchantById.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
      .addCase('merchant/fetch/reset', (state, action) => {
        return {
          isLoading: false,
          data: [],
          error: "",
        };
      })    
  },
});


export const fetchMerchantVesselReportSlice = createSlice({
  name: "fetchMerchantVesselReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMerchantData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchMerchantData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchMerchantData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});


export const fetchMerchantRoutesDataSlice = createSlice({
  name: "fetchMerchantRoutesData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMerchantRoutesData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchMerchantRoutesData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchMerchantRoutesData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});


