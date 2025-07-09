import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPatroltypeBasedData,fetchPlatformnameBasedData, fetchCoiData, fetchStaticSpecialReportData,fetchMultiplePatroltypeBasedData
} from "../thunks/patroltypeBasedData";

export const fetchPatroltypeBasedDataSlice = createSlice({
  name: "fetchpatroltypeBasedData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatroltypeBasedData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchPatroltypeBasedData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchPatroltypeBasedData.rejected, (state, action) => {
        const errorMessage = action.payload?.response?.data?.error || "Unknown error";
        return {
          ...state,
          isLoading: false,
          // error: action.payload,
          error: errorMessage,
        };
      });
  },
});

export const fetchMultiplePatroltypeBasedDataSlice = createSlice({
  name: "fetchmultiplepatroltypeBasedData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMultiplePatroltypeBasedData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchMultiplePatroltypeBasedData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchMultiplePatroltypeBasedData.rejected, (state, action) => {
        const errorMessage = action.payload?.response?.data?.error || "Unknown error";
        return {
          ...state,
          isLoading: false,
          // error: action.payload,
          error: errorMessage,
        };
      });
  },
});

export const fetchPlatformnameBasedDataSlice = createSlice({
  name: "fetchPlatformnameBasedData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformnameBasedData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchPlatformnameBasedData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchPlatformnameBasedData.rejected, (state, action) => {
        const errorMessage = action.payload?.response?.data?.error || "Unknown error";
        return {
          ...state,
          isLoading: false,
          // error: action.payload,
          error: errorMessage,
        };
      });
  },
});

export const fetchCoiBasedDataSlice = createSlice({
  name: "fetchCoinameBasedData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoiData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchCoiData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchCoiData.rejected, (state, action) => {
        const errorMessage = action.payload?.response?.data?.error || "Unknown error";
        return {
          ...state,
          isLoading: false,
          // error: action.payload,
          error: errorMessage,
        };
      });
  },
});

export const fetchStaticSpecialReportDataSlice = createSlice({
  name: "fetchStaticSpecialReportData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaticSpecialReportData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchStaticSpecialReportData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchStaticSpecialReportData.rejected, (state, action) => {
        const errorMessage = action.payload?.response?.data?.error || "Unknown error";
        return {
          ...state,
          isLoading: false,
          // error: action.payload,
          error: errorMessage,
        };
      });
  },
});