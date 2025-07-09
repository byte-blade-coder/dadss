import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMissionReport,
  fetchMissionReportID,
  saveMissionReport,
} from "../thunks/missionReportData";

export const fetchMissionReportSlice = createSlice({
  name: "fetchMissionReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissionReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchMissionReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchMissionReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});

export const saveMissionReportSlice = createSlice({
  name: "saveMissionReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveMissionReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(saveMissionReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(saveMissionReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});


export const fetchMissionReporIDSlice = createSlice({
  name: "fetchMissionReportID",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissionReportID.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchMissionReportID.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchMissionReportID.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});