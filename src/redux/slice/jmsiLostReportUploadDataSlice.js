import { createSlice } from "@reduxjs/toolkit";
import { addJmisLostReportUploadData } from "../thunks/jmisLostReportUploadData";

export const addJmisLostReportUploadDataSlice = createSlice({
  name: "lostreport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    success: "",
  },

  reducers: {
    resetJmisLostReportUploadState(state) {
      state.isLoading = false;
      state.data = [];
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addJmisLostReportUploadData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addJmisLostReportUploadData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: "Data uploaded successfully! ",
          error: "",
        };
      })
      .addCase(addJmisLostReportUploadData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

export const { resetJmisLostReportUploadState } =
  addJmisLostReportUploadDataSlice.actions;

export default addJmisLostReportUploadDataSlice.reducer;
