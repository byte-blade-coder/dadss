import { createSlice } from "@reduxjs/toolkit";
import { addPNSCUploadData } from "../thunks/jmisPnscUploadData";

export const addPNSCUploadDataSlice = createSlice({
  name: "pnsc",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    success: "",
  },

  reducers: {
    resetPNSCUploadState(state) {
      state.isLoading = false;
      state.data = [];
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPNSCUploadData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addPNSCUploadData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: "Data uploaded successfully! ",
          error: "",
        };
      })
      .addCase(addPNSCUploadData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

export const { resetPNSCUploadState } = addPNSCUploadDataSlice.actions;

export default addPNSCUploadDataSlice.reducer;
