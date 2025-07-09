import { addSituationReport } from "../thunks/situationUploadData";
import { createSlice } from "@reduxjs/toolkit";

export const addSitutationalReportDataSlice = createSlice({
  name: "addSituationalReport",
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
      .addCase(addSituationReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addSituationReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: "Data uploaded successfully! ",
          error: "",
        };
      })
      .addCase(addSituationReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

export default addSitutationalReportDataSlice.reducer;
