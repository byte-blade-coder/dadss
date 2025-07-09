import { createSlice } from "@reduxjs/toolkit";
import { addUploadData } from "../thunks/uploadData";

export const addUploadDataSlice = createSlice({
  name: "upload",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    success: "",
  },

  reducers: {
    resetUploadState(state) {
      state.isLoading = false;
      state.data = [];
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUploadData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addUploadData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: "Data uploaded successfully! ",
          error: "",
        };
      })
      .addCase(addUploadData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

export const { resetUploadState } = addUploadDataSlice.actions;

export default addUploadDataSlice.reducer;
