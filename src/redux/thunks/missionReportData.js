import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";

export const fetchMissionReport = createAsyncThunk(
  "mission/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
        console.log(error)
        // if (error.response.data) {
        //   // showToastError(`Error : ${error.response.data.messages[0].message}`);
        //   showToastError(`Error : ${error.response.statusText}. \nKindly login again`);
        // } else {
        //   showToastError(`Please login again.`);
        // }
    }
  }
);

export const saveMissionReport = createAsyncThunk(
  "mission/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep`,
        data.data
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(`Data Save Successfully`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        data.navigation.push("/missionreport");
        return response.data;
      }
    } catch (error) {
      toast.error(`Error . Please try again.`, {
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
);

export const fetchMissionReportID = createAsyncThunk(
  "missionID/fetch",
  async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep/${id}`
      );
      if (response.status === 200) return response.data;
    } catch (error) {}
  }
);

export const fetchMissionReportDetails = createAsyncThunk(
  "missionReport/fetchDetails",
  async (mr_key, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep/${mr_key}`
      );
      console.log(  "missionReport/fetchDetails", response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
