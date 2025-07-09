import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";

export const fetchPatroltypeBasedData = createAsyncThunk(
  "patroltype/fetch",
  async (patroltype) => {
    console.log(patroltype)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/special_reports?patroltype=${
          patroltype ? patroltype : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log("Error fetching data for patrol type: ", error)
      showToastError(`Error: ${error}`)
    }
  }
);

export const fetchMultiplePatroltypeBasedData = createAsyncThunk(
  "patrol/fetch",
  async (patroltype) => {
    console.log(patroltype)
    try {
      let queryString = "";
      if (patroltype && patroltype.length > 0) {
        queryString = patroltype.map(patroltype => `patroltype=${patroltype}`).join('&&');
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/special_reports?${queryString}`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log("Error fetching data for patrol type: ", error)
      showToastError(`Error: ${error.response.statusText}. Kindly login again`)
    }
  }
);

export const fetchCoiData = createAsyncThunk(
  "coi/fetch",
  async (table) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreport?ssr_table=${
          table ? table : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log("Error fetching data for given table type: ", error)
      return "error";
    }
  }
);

export const fetchStaticSpecialReportData = createAsyncThunk(
  "ssreport/fetch",
  async (table) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreport?ssr_table=${
          table ? table : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log("Error fetching data for given table type: ", error)
      return "error";
    }
  }
);

//       // const response = await axios.get(
//       //   `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/special_reports`,
//       //   {
//       //     params: {
//       //       platform: platforms // platforms should be an array
//       //     }
//       //   }
//       // );


export const fetchPlatformnameBasedData = createAsyncThunk(
  "platformname/fetch",
  async (platform) => {
    console.log(platform)
    try {
      let queryString = "";
      if (platform && platform.length > 0) {
        queryString = platform.map(platform => `platform=${platform}`).join('&&');
      }
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/special_reports?${queryString}`
      );

      // const response = await axios.get(
      //   `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/special_reports?platform=${
      //     platform ? platform : ""
      //   }`
      // );
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log("Error fetching data for plaftform type: ", error)
      return "error";
    }
  }
);
