import { createSlice } from "@reduxjs/toolkit";
import { addSituationUploadData } from "../thunks/situationUploadData";

export const addSituationUploadDataSlice = createSlice({
  name: "situationreport",
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
      .addCase(addSituationUploadData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addSituationUploadData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: true,
          error: "",
        };
      })
      .addCase(addSituationUploadData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

export const { resetSituationUploadState } = addSituationUploadDataSlice.actions;

export default addSituationUploadDataSlice.reducer;
