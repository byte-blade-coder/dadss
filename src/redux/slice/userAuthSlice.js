import { createSlice } from "@reduxjs/toolkit";
import { loginApi, registerApi, getAllUsers, getUserID } from "../thunks/userAuth";
export const loginSlice = createSlice({
  name: "loginAuth",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    accessToken: null,
    refreshToken: null,
    isLoggedIn:true, // Always logged in for dev bypass
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginApi.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(loginApi.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          accessToken: action.payload, // Set access token
          refreshToken: action.payload,
          error: "",
          isLoggedIn: true,
        };
      })
      .addCase(loginApi.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
          isLoggedIn: false,
        };
      });
  },
});
export const registerSlice = createSlice({
  name: "register",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerApi.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(registerApi.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(registerApi.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
          isLoggedIn: false,
        };
      });
  },
});
export const getAllUsersSlice = createSlice({
  name: "getUsers",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
          isLoggedIn: false,
        };
      });
  },
});

export const getUsersIDSlice = createSlice({
  name: "fetchUserID",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserID.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(getUserID.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(getUserID.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});
