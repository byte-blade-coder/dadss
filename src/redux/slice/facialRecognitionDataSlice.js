import { uploadPersonImage } from "../thunks/facialRecognitionData";
import { createSlice } from "@reduxjs/toolkit";

export const uploadPersonImageSlice = createSlice({
  name: "addLostReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    success: "",
  },

  reducers: {
    resetSituationUploadState(state) {
      state.isLoading = false;
      state.data = [];
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPersonImage.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(uploadPersonImage.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: "File uploaded successfully! ",
          error: "",
        };
      })
      .addCase(uploadPersonImage.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

export default uploadPersonImageSlice.reducer;
