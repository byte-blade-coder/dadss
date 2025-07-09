import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCoiData,
  addCOIdataship,
  addCOIshipUploadData
} from "../thunks/coiVesselData";
// export const fetchCoiVesselSlice = createSlice({
//   name: "fetchCoiVessel",
//   initialState: {
//     isLoading: false,
//     data: [],
//     error: "",
//   },

//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCoiById.pending, (state) => {
//         return {
//           ...state,
//           isLoading: true,
//         };
//       })
//       .addCase(fetchCoiById.fulfilled, (state, action) => {
//         return {
//           ...state,
//           isLoading: false,
//           data: action.payload,
//           error: "",
//         };
//       })
//       .addCase(fetchCoiById.rejected, (state, action) => {
//         return {
//           ...state,
//           isLoading: false,
//           error: action.payload,
//         };
//       })
//       .addCase("coi/fetch/reset", (state, action) => {
//         return {
//           isLoading: false,
//           data: [],
//           error: "",
//         };
//       });
//   },
// });

export const fetchCoiVesselReportSlice = createSlice({
  name: "fetchCoiVesselReport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoiData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchCoiData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchCoiData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});

export const addCOIReportUploadDataSlice = createSlice({
  name: "coireport",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    success: "",
  },

  reducers: {
    resetCOIReportUploadState(state) {
      state.isLoading = false;
      state.data = [];
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCOIshipUploadData.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addCOIshipUploadData.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: "Data uploaded successfully! ",
          error: "",
        };
      })
      .addCase(addCOIshipUploadData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

export const { resetCOIReportUploadState } =
addCOIReportUploadDataSlice.actions;


export const addCOIReportDataSlice = createSlice({
  name: "addCOIdataship",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    success: "",
  },

  reducers: {
    resetCoiUploadState(state) {
      state.isLoading = false;
      state.data = [];
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCOIdataship.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(addCOIdataship.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          success: "Data uploaded successfully! ",
          error: "",
        };
      })
      .addCase(addCOIdataship.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: [],
          error: action.error.message,
        };
      });
  },
});

// export default addLostReportDataSlice.reducer;
// export default addCOIReportUploadDataSlice.reducer;
