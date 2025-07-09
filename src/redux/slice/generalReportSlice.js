import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGeneralReport,
  saveGeneralReport,
  fetchGeneralReportById,
} from "../thunks/generalReportData";

export const fetchGeneralReportSlice = createSlice({
  name: "fetchGeneralReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchGeneralReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchGeneralReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});
export const fetchGeneralReportByIdSlice = createSlice({
  name: "fetchGeneralById",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralReportById.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchGeneralReportById.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchGeneralReportById.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
      .addCase("general/fetchId/reset", (state, action) => {
        return {
          isLoading: false,
          data: [],
          error: "",
        };
      });
  },
});
export const saveGeneralReportSlice = createSlice({
  name: "saveGeneralReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveGeneralReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(saveGeneralReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(saveGeneralReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});
