import { createSlice } from "@reduxjs/toolkit";
import {
  fetchFishingById,
  fetchFishingData,
} from "../thunks/fishingVesselData";
export const fetchFishingVesselSlice = createSlice({
  name: "fetchFishingVessel",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFishingById.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchFishingById.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchFishingById.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
      .addCase("fishing/fetch/reset", (state, action) => {
        return {
          isLoading: false,
          data: [],
          error: "",
        };
      });
  },
});

export const fetchFishingVesselReportSlice = createSlice({
  name: "fetchFishingVesselReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFishingData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchFishingData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchFishingData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});
