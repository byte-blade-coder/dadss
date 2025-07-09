import { createSlice } from "@reduxjs/toolkit";
import { fetchCargoDhowData} from "../thunks/outputTableData";

export const fetchCargoDhowDataSlice = createSlice({
  name: "fetchCargoDhowData",
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
      .addCase(fetchCargoDhowData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchCargoDhowData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload ? action.payload:[],
          error: "",
        };
      })
      .addCase(fetchCargoDhowData.rejected, (state, action) => {

        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
      .addCase('cargo/fetch/reset', (state, action) => {
        return {
          isLoading: false,
          data: [],
          error: "",
        };
      })
  },
});

export const addPlatformDataSlice = createSlice({
  name: "addPlatformData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPlatformData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addPlatformData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(addPlatformData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
  },
});

