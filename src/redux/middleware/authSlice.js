
import { createSlice } from "@reduxjs/toolkit";


const   initialState= {
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: "",
  }
 const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSuccess(state, action) {
      state.success = action.payload;
    },
    resetAuthState(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.error = "";
      state.success = "";
    },
  },
});

export const {
  setAccessToken,
  setRefreshToken,
  setLoading,
  setError,
  setSuccess,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
