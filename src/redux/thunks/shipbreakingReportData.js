import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";

export const fetchShipBreakingReport = createAsyncThunk(
  "shipbreak/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ship_breaking?search=${search_data ? search_data : ""
        }`
      );
      if (response.status === 200) {
        // console.log("Incoming Ship Breaking Response", response)
        return response.data.map((item) => {
          return { ...item, mv_imo: item.merchant_vessel?.mv_imo };
        }
        );
      };
    } catch (error) {
      // if (error.response.data) {
      //   showToastError(`Error : ${error.response.statusText}. \nKindly login again`);
      // } else {
      //   showToastError(`Please login again.`);
      // }
    }
  }
);

export const saveShipBreakingReport = createAsyncThunk(
  "shipbreak/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ship_breaking`,
        data.data
      );
      if (response.status === 200 || response.status === 201) {
        showToastSuccess('Data Save Successfully');
        localStorage.removeItem("shipBreakingForm");
        localStorage.removeItem("crewForm");
        localStorage.removeItem("crewData");
        data.navigation.push("/shipbreaking");
        return response.data;
      }
    } catch (error) {
      if (error.response.data) {
      console.error(error)
        throw error;
      }
    }
  }
);
