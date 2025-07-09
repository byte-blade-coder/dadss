import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "../../helper/MyToast";
import { Form } from "antd";

export const fetchTripDetailsData = createAsyncThunk(
  "registered/fetch",
  async (search_data) => {
    console.log(search_data)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvtrip`
      );
      if (response.status === 200) {
        return response.data.map((trip) => ({
          ...trip, // Keep all original fields
          rvt_key: trip.rvt_key,
          rvt_tripstatus: trip.rvt_tripstatus,
          rv_flag: trip.rvt_rvessel?.rv_flag || "", // Avoid errors if rvt_rvessel is undefined
          rv_name: trip.rvt_rvessel?.rv_name || "",
          rv_id: trip.rvt_rvessel?.rv_id || "",
          rv_regno: trip.rvt_rvessel?.rv_regno || "",
        }));
      }
    } catch (error) {
      console.log(error)
      if (error.response.data) {
        // showToastError(`Error : ${error.response.data.messages[0].message}`);
        showToastError(`Error : ${error.response.statusText}. \nKindly login again`);
      } else {
        showToastError(`Please login again.`);
      }
    }
  }
);
