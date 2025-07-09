import { createSlice } from "@reduxjs/toolkit";
import { fetchRegisteredVessel, saveRegistedVessel, fetchRegisteredVesselID, updateRegisteredVessel } from "../thunks/registeredVesselData";

export const fetchRegisteredVesselSlice = createSlice({
  name: "fetchRegisteredVesselData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisteredVessel.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchRegisteredVessel.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchRegisteredVessel.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
    
  },
});
export const saveRegisteredVesselSlice = createSlice({
  name: "saveRegisteredVesselData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveRegistedVessel.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(saveRegistedVessel.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(saveRegistedVessel.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
    
  },
});
export const updateRegisteredVesselSlice = createSlice({
  name: "updateRegisteredVesselData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateRegisteredVessel.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(updateRegisteredVessel.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(updateRegisteredVessel.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
    
  },
});
export const fetchRegisteredVesselIDSlice = createSlice({
  name: "fetchRegisteredVesselIDData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisteredVesselID.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchRegisteredVesselID.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchRegisteredVesselID.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});

// export const fetchRegistedVesselByIdSlice = createSlice({
//   name: "fetchRegistedVesselById",
//   initialState: {
//     isLoading: false,
//     data: [],
//     error: "",
//   },

//   reducers: {
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchRegistedVesselById.pending, (state) => {
//         return {
//           ...state,
//           isLoading: true,
//         };
//       })
//       .addCase(fetchRegistedVesselById.fulfilled, (state, action) => {
//         return {
//           ...state,
//           isLoading: false,
//           data: action.payload,
//           error: "",
//         };
//       })
//       .addCase(fetchRegistedVesselById.rejected, (state, action) => {
//         return {
//           ...state,
//           isLoading: false,
//           error: action.payload,
//         };
//       })
//       .addCase('registered/fetchId/reset', (state, action) => {
//         return {
//           isLoading: false,
//           data: [],
//           error: "",
//         };
//       })  
    
//   },
// });


