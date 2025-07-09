import { createSlice } from "@reduxjs/toolkit";
import { fetchIntelReport, fetchIntelReportID, saveIntelReport } from "../thunks/intelReportData";

export const fetchIntelReportSlice = createSlice({
  name: "fetchIntelReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIntelReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchIntelReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchIntelReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});

export const fetchIntelReportIDSlice = createSlice({
  name: "fetchIntelReportID",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIntelReportID.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchIntelReportID.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchIntelReportID.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});

export const saveIntelReportSlice = createSlice({
  name: "saveIntelReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveIntelReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(saveIntelReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(saveIntelReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});
