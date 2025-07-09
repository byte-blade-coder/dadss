import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToastError, showToastSuccess } from "../../helper/MyToast";

export const fetchVisReport = createAsyncThunk("vis/fetch", async (search_data) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARIA_DATA}/vis_data?search=${
        search_data ? search_data : ""
      }`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
      // if (error.response.data) {
      //   // showToastError(`Error : ${error.response.data.messages[0].message}`);
      //   showToastError(`Error : ${error.response.statusText}. \nKindly login again`);
      // } else {
      //   showToastError(`Please login again.`);
      // }
  }
});

export const fetchVisCrewData = createAsyncThunk(
  "viscrew/fetch", 
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARIA_DATA}/lessthan10crewdata`
        // ?search=${
        //   search_data ? search_data : ""
        // }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log("Error fetching VIS Crew data: ", error)
    }
});

export const fetchChallanWarningData = createAsyncThunk("challan/fetch", async (search_data) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARIA_DATA}/challan_warning_ships`
      // ?search=${
      //   search_data ? search_data : ""
      // }`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    console.log("Error fetching VIS Challan Warning data: ", error)
  }
});