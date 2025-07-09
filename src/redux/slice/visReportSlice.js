import { createSlice } from "@reduxjs/toolkit";
import { fetchVisReport, fetchVisCrewData, fetchChallanWarningData } from "../thunks/visData";

export const fetchVisReportSlice = createSlice({
  name: "fetchVisData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchVisReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchVisReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});

export const fetchVisCrewSlice = createSlice({
  name: "fetchVisCrewData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisCrewData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchVisCrewData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchVisCrewData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});

export const fetchChallanWarningSlice = createSlice({
  name: "fetchChallanWarningData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallanWarningData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchChallanWarningData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchChallanWarningData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});
