import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";
// import { serialize } from 'cookie';

export const loginApi = createAsyncThunk("login/post", async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/login`,
      data?.validatedValues
    );
    if (response.status === 200) {
      //  Extract the tokens from the response
      const { access, refresh, u_pf_id, is_superuser, permissions, pf_type, username } =
        response.data;

      // // Store the tokens and other relevant information in local storage or wherever you prefer
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("u_pf_id", u_pf_id);
      localStorage.setItem("username" , username)
      localStorage.setItem("is_superuser" , is_superuser)
      localStorage.setItem("permissions", JSON.stringify(permissions)); // Store permissions as JSON string
      localStorage.setItem("pf_type", pf_type);

      // localStorage.getItem(JSON.parse(localStorage.getItem("permissions")))
      // Retrieve permissions from local storage
      const permissionsRoles = JSON.parse(localStorage.getItem("permissions"));
      const isSuperuser = JSON.parse(localStorage.getItem("is_superuser"));

      // Check each permission and log the result
      permissionsRoles.forEach((permission) => {
        if (permission) {
          console.log(`You have access to ${permission}`);
        } else {
          console.log(`You don't have access to ${permission}`);
        }
      });

      if (isSuperuser === true) {
        console.log("You have all access. You are an admin.");
      } else {
        console.log("You are a normal user. Your permissions are:");
        permissionsRoles.forEach((permission) => {
      console.log(`You have access to ${permission}`);
        });
      }

      axios.defaults.headers["Authorization"] = "JWT " + access;

      toast.success(`Login Successfully`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      data?.router?.push("/dashboard");
      // const cookieRes = await axios.post("/api/setCookie", { accessToken: access });
      // console.log("cookie error", cookieRes)
      return response.data;
    }
  } catch (error) {
    console.log("login error", error)
    if (error.response && error.response.status === 401) {
      toast.error(`${error.response.data.detail}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast.error(`Wrong Credentials \n ${error}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }
});

export const registerApi = createAsyncThunk("register/post", async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/register`,
      data
    );
    if (response.status === 200) return response.data;
  } catch (error) {}
});

export const getAllUsers = createAsyncThunk("users/fetch", async (search_data) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/user?search=${
        search_data ? search_data : ""
      }`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    console.log(error.response.data)
    // if (error.response.data) {
    //   // showToastError(`Error : ${error.response.data.messages[0].message}`);
    //   // showToastError(`Error : ${error.response.statusText}. \nKindly login again`);
    // } else {
    //   showToastError(`Please login again.`);
    // }
  }
});

export const getUserID = createAsyncThunk("userID/fetch", async (id) => {
  try {
    // Retrieve the JWT token from local storage
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/user/${id}`,

    );
    if (response.status === 200) return response.data;
  } catch (error) {
    return "error";
  }
});


export const refreshAccessToken = (refreshToken) => async (dispatch) => {
  try {
    const response = await fetch("/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    dispatch({ type: "UPDATE_ACCESS_TOKEN", payload: data.access });
  } catch (error) {
    console.error("Token refresh failed:", error);
    dispatch({ type: "LOGOUT" }); // Force logout on failure
  }
};
