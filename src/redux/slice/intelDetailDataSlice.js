import { createSlice } from "@reduxjs/toolkit";
import {
  fetchIntelDetailReport,
  saveIntelDetailReport,
} from "../thunks/intelDetailData";

export const fetchIntelDetailReportSlice = createSlice({
  name: "fetchIntelDetailReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIntelDetailReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchIntelDetailReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchIntelDetailReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});

export const saveIntelDetailReportSlice = createSlice({
  name: "saveIntelDetailReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveIntelDetailReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(saveIntelDetailReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(saveIntelDetailReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});
