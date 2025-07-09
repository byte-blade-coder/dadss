// uploadData.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const addUploadData = createAsyncThunk(
  "upload/addData",
  async (formData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/tripviewset/upload_data`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.existing_or_discarded_rows > 0) {
        alert(
          `Data uploaded with ${response.data.existing_or_discarded_rows} rows discarded due to duplicates.`
        );
        return rejectWithValue({ error: "Duplicate rows detected" });
      } else if (response.status === 200 || response.status === 201) {
        // toast.success("Data added Successfully");
        return { data: response.data, success: "Data uploaded successfully!" };
      }
    } catch (error) {
      toast.error(error?.response?.data);
      throw error;
    }
  }
);
