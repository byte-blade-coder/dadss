import { createSlice } from "@reduxjs/toolkit";
import { addCosposUploadData } from "../thunks/cosposUploadData";

export const addCosposUploadDataSlice = createSlice({
  name: "cospos",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    success: "",
  },

  reducers: {
    resetCosposUploadState(state) {
      state.isLoading = false;
      state.data = [];
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCosposUploadData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addCosposUploadData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: "Data uploaded successfully! ",
          error: "",
        };
      })
      .addCase(addCosposUploadData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

export const { resetCosposUploadState } = addCosposUploadDataSlice.actions;

export default addCosposUploadDataSlice.reducer;
