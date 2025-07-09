import { createSlice } from "@reduxjs/toolkit";
import { addPnscReport } from "../thunks/jmisPnscUploadData";

export const addPnscReportDataSlice = createSlice({
  name: "addPnscReport",
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
      .addCase(addPnscReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addPnscReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: "Data uploaded successfully! ",
          error: "",
        };
      })
      .addCase(addPnscReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

export default addPnscReportDataSlice.reducer;
