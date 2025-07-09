import { createSlice } from "@reduxjs/toolkit";
import {
  fetchShipBreakingReport,
  saveShipBreakingReport,
} from "../thunks/shipbreakingReportData";

export const fetchShipBreakingnReportSlice = createSlice({
  name: "fetchShipBreakingReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipBreakingReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchShipBreakingReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchShipBreakingReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});

export const saveShipBreakingReportSlice = createSlice({
  name: "saveShipBreakingReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveShipBreakingReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(saveShipBreakingReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(saveShipBreakingReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});
