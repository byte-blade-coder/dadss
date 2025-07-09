import { addLostReport } from "../thunks/jmisLostReportUploadData";
import { createSlice } from "@reduxjs/toolkit";

export const addLostReportDataSlice = createSlice({
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
      .addCase(addLostReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addLostReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: "Data uploaded successfully! ",
          error: "",
        };
      })
      .addCase(addLostReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

export default addLostReportDataSlice.reducer;
