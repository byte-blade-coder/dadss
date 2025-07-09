import { createSlice } from "@reduxjs/toolkit";
import { fetchAllJettyData, addJettyData } from "../thunks/jettyData";

export const fetchJettyDataSlice = createSlice({
  name: "fetchAllJettyData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJettyData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchAllJettyData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload ? action.payload:[],
          error: "",
        };
      })
      .addCase(fetchAllJettyData.rejected, (state, action) => {

        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
      .addCase('data/fetch/reset', (state, action) => {
        return {
          isLoading: false,
          data: [],
          error: "",
        };
      })
  },
});

export const addJettyDataSlice = createSlice({
  name: "addJettyData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(addJettyData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addJettyData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(addJettyData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
  },
});

