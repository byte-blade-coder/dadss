import { createSlice } from "@reduxjs/toolkit";
import { fetchSARData, addMedicalAssistanceData, fetchMedicalAssistanceData, addSARData } from "../thunks/searchandrescue";

export const fetchSARDataSlice = createSlice({
  name: "fetchSARData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {
    // addInputFields: (state, action) => {
    //   state.data = [action.payload, ...state.data];
    // },
    // removeInputFields: (state, action) => {
    // state.data = state.data.filter((item) => item.pf_key !== action.payload.pf_key)
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSARData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchSARData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload ? action.payload:[],
          error: "",
        };
      })
      .addCase(fetchSARData.rejected, (state, action) => {

        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
      .addCase('sar/fetch/reset', (state, action) => {
        return {
          isLoading: false,
          data: [],
          error: "",
        };
      })
  },
});


export const fetchMedicalAssistanceDataSlice = createSlice({
  name: "fetchMedicalAssistanceData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalAssistanceData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchMedicalAssistanceData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload ? action.payload:[],
          error: "",
        };
      })
      .addCase(fetchMedicalAssistanceData.rejected, (state, action) => {

        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
      .addCase('sarform/fetch/reset', (state, action) => {
        return {
          isLoading: false,
          data: [],
          error: "",
        };
      })
  },
});

export const addSARDataSlice = createSlice({
  name: "addSARData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSARData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addSARData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(addSARData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
  },
});

export const addMedicalAssistanceDataSlice = createSlice({
  name: "addMedicalAssistanceData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMedicalAssistanceData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addMedicalAssistanceData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(addMedicalAssistanceData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
  },
});

