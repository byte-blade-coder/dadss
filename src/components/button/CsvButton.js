// src/components/CsvUploadComponent.js
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { resetUploadState } from "../../redux/slice/uploadData";
import { addUploadData } from "../../redux/thunks/uploadData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CsvUploadComponent = () => {
  const [hasDuplicates, setHasDuplicates] = useState(false); // Define hasDuplicates
  const [missingColumns, setMissingColumns] = useState([]);
  const [extraColumns, setExtraColumns] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null); // New state to store the file name
  const [uploadMessage, setUploadMessage] = useState(""); // New state to manage success/error messages
  const { isLoading, data, error, success } = useSelector(
    (state) => state.upload
  );
  const dispatch = useDispatch();
  const fileInputRef = useRef(null); // Create a ref for the file input element

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : ""); // Save the file name

    // Check if a file is selected
    if (!selectedFile) {
      alert("Please select a CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;

      // Parse the CSV content to check for the required columns
      const lines = fileContent.split("\n");
      const firstLine = lines[0].trim();
      const columns = firstLine.split(",");
      const values = new Set(); // Store unique values
      let hasDuplicates = false;

      for (const line of lines) {
        const columnss = line.trim().split(",");

        const requiredColumns = [
          "reg_No",
          "reg_date",
          "boat_name",
          "boat_type",
          "boat_location",
          "departure_date",
          "pc_date",
          "arrival_date",
        ];
        // Check if all required columns are present
        const missingColumns = requiredColumns.filter(
          (col) => !columns.includes(col)
        );
        const extraColumns = columns.filter(
          (col) => !requiredColumns.includes(col)
        );
        if (missingColumns.length > 0) {
          alert(`Missing columns: ${missingColumns.join(", ")}`);
          setFileName(""); // Clear the file name on upload failure
          return;
        }
        if (extraColumns.length > 0) {
          alert(`Extra columns found: ${extraColumns.join(", ")}`);
          setFileName(""); // Clear the file name on upload failure
          return;
        }
        // Assuming 'boat_name' is the column you want to check for duplicates
        const boatName = columnss[2]; // Adjust the index based on your CSV structure
        const departure_date = columnss[5];

        if (values.has(boatName && departure_date)) {
          hasDuplicates = true;
          break;
        }

        values.add(boatName);
        values.add(departure_date);
      }
      if (
        hasDuplicates &&
        missingColumns.length === 0 &&
        extraColumns.length === 0
      ) {
        alert("Duplicate data found in the CSV file.");
        setFileName(""); // Clear the file name on upload failure
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    };

    reader.readAsText(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (hasDuplicates || missingColumns.length || extraColumns.length) {
      alert("Please correct the CSV file before uploading.");
      setFileName(""); // Clear the file name on upload failure
      setUploadMessage("Upload failed. Please correct the CSV file.");
      return;
    }
    if (!file) {
      alert("Please select a CSV file.");
      setFileName(""); // Clear the file name on upload failure
      setUploadMessage("Upload failed. Please select a CSV file.");

      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      await dispatch(addUploadData(formData));
      // setUploadMessage("Upload successful!");
      // Check if upload was successful and display a prompt
      if (success) {
        alert(success); // Show success prompt
        setUploadMessage("Upload successful!");
        toast.success(`CSV file successfully added`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      setUploadMessage("Upload failed. Please try again.");
      setFileName(""); // Clear the file name on upload failure
    } finally {
      // Clear the file input by resetting its value
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      setFile(null);
      setFileName("");
      setTimeout(() => {
        setUploadMessage("");
        setFileName("");
        dispatch(resetUploadState());
        setFile(null);
      }, 1500);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef} // Set the ref to access the file input element
        accept=".csv"
      />
      {/* <Button onClick={handleUpload}>Upload</Button> */}
      <Button
        onClick={handleUpload}
        disabled={hasDuplicates || missingColumns.length || extraColumns.length}
      >
        Upload
      </Button>
      <div>
        {isLoading && <p>Uploading...</p>}
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>
    </div>
  );
};

export default CsvUploadComponent;
