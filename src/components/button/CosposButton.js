import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Col, Row } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetCosposUploadState } from "../../redux/slice/cosposUploadDataSlice";
import { addCosposUploadData } from "../../redux/thunks/cosposUploadData";

const CosposButton = () => {
  // State variables
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null); // New state to store the file name
  const [uploadMessage, setUploadMessage] = useState(""); // New state to manage success/error messages

  // Redux state and dispatch
  const { isLoading } = useSelector((state) => state.cospos);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null); // Create a ref for the file input element

  // Function to parse CSV content
  const parseCSVContent = (content) => {
    const lines = content.split("\n");

    const header = lines[0].trim().split(",");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].trim().split(",");
      const rowData = {};

      for (let j = 0; j < header.length; j++) {
        rowData[header[j]] = values[j];
      }

      data.push(rowData);
    }

    return { columns: header, data };
  };

  // Handler for file input change
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
      // Content of the file after it has been successfully read by the FileReader
      const fileContent = event.target.result;
      const parsedData = parseCSVContent(fileContent);
      const { columns } = parsedData;

      //required columns
      const requiredColumns = [
        "occurrence_type",
        "distress_conf",
        "beacon_operating_mode",
        "msg_ref",
        "detected_at",
        "det_satellite",
        "det_freq_typeA",
        "det_freq_typeB",
        "det_freq_typeC",
        "user_class_std_location",
        "emergency_code",
        "pos_confirmed_lat",
        "pos_confirmed_long",
        "pos_dopplerA",
        "pos_dopplerB",
        "pos_doa_lat",
        "pos_doa_long",
        "pos_expected_acc",
        "pos_altitude",
        "pos_encoded_lat",
        "pos_encoded_long",
        "pos_updated_time",
        "pos_provided_by",
        "nextpass_confirmed",
        "nextpass_doppA",
        "nextpass_doppB",
        "nextpass_doa",
        "nextpass_encoded",
        "hex_id",
        "activation_type",
        "oei_mid",
        "oei_loc_protocol_type",
        "oei_pos_uncertainty",
        "oei_lat",
        "oei_long",
        "oper_info_imo",
        "oper_info_vessel_type",
        "oper_info_lpoc",
        "oper_info_npoc",
        "oper_ship_owner",
        "oper_sat_alert_time",
        "temp_from",
        "temp_to",
        "temp_inc_reporting_time",
        "temp_inc_details",
        "temp_actions_list",
        "remarks",
        "beacon_reg_no",
        "country_name",
        "country_code",
      ];

      // Check if all required columns are present
      const missingColumns = requiredColumns.filter(
        (col) => !columns.includes(col)
      );
      if (missingColumns.length > 0) {
        toast.error(`Missing columns: ${missingColumns.join(", ")}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            // Clear the file input by resetting its value
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
            setTimeout(() => {
              setUploadMessage("");
              setFileName("");
              setFile(null);
            }, 1500);
          },
        });
        return;
      }

      // Check if there are extra columns
      const extraColumns = columns.filter(
        (col) => !requiredColumns.includes(col)
      );
      if (extraColumns.length > 0) {
        toast.error(`Extra columns found: ${extraColumns.join(", ")}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            // Clear the file input by resetting its value
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
            setTimeout(() => {
              setUploadMessage("");
              setFileName("");
              setFile(null);
            }, 1500);
          },
        });
        return;
      }
      // Set file and file name after validation
      setFile(selectedFile);
      setFileName(selectedFile.name);
    };

    // Read the content of the selected file
    reader.readAsText(selectedFile);
  };

  // Function to reset file input and state variables
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    // Clear state variables after a delay
    setTimeout(() => {
      setUploadMessage("");
      setFileName("");
      setFile(null);
    }, 1500);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // Check if a file is selected
    if (!file) {
      setFileName("");
      setUploadMessage("Upload failed. Please select a CSV file.");
      alert("Please select a CSV file.");

      // Clear upload message after a delay
      setTimeout(() => {
        setUploadMessage("");
      }, 1500);
      return;
    }
    // Create a FormData object for file upload
    const formData = new FormData();
    formData.append("file", file);
    try {
      dispatch(addCosposUploadData(formData));
    } catch (error) {
      setUploadMessage("Upload failed. Please try again.");
      setFileName(""); // Clear the file name on upload failure
    } finally {
      resetFileInput();
    }
  };

  return (
    <Row gutter={[5, 5]}>
      <div className="flex justify-start">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            accept=".csv"
          />
        </Col>
      </div>

      <div className="flex items-center">
        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center ">
          <Button onClick={handleUpload}>Upload</Button>
        </Col>
      </div>

      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <div>
          {isLoading}
          {uploadMessage && <p>{uploadMessage}</p>}
        </div>
      </Col>
    </Row>
  );
};

export default CosposButton;
