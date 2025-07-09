import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Col, Row } from "antd";
import { addCOIshipUploadData } from "../../redux/thunks/coiVesselData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import OutlineButton from "./OutlineButton";
import FilledButton from "./FilledButton";

const FoChowkasBtn = ({ onDataLoad }) => {
  // State variables
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null); // State to store the file name
  const [uploadMessage, setUploadMessage] = useState(""); // State to manage success/error messages

  // Redux state and dispatch
  const { isLoading } = useSelector((state) => state.coireport);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null); // Ref for the file input element

  // Function to parse CSV content
  const parseCSVContent = (content) => {
    const lines = content.split("\n");
    
    const parseValue = (value) => value.trim().replace(/^"|"$/g, "");
    
    const header = lines[0].trim().split(",").map(parseValue);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].trim().split(",").map(parseValue);
      const rowData = {};

      for (let j = 0; j < header.length; j++) {
        rowData[header[j]] = values[j];
      }

      data.push(rowData);
    }

    return { columns: header, data };
  };
  
 // console.log(cleanedCsvData);

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
      console.log("CSV fileContent: ", fileContent)
      const parsedData = parseCSVContent(fileContent);
      console.log("CSV DATA:", parsedData)
      const { columns } = parsedData;

      //required columns
      const requiredColumns = [
        'BOAT NAME', 'BOAT TYPE', 'REG NO', 'OWNER NAME', 'NAKWA NAME', 'CREW', 'DEPARTURE JETTY',
        'TRANSIT THROUGH', 'DEPARTURE DATE', 'PC ISSUE DATE', 'PC ISSUE PLACE', 'TOTAL DAYS OF PC', 
         'LEGAL/ILLEGAL', 'FISHING QTY', 'FISH TYPE', 'FISHING POSITION', 'GEARS',
        'TYPE OF CARGO', 'LATITUDE', 'LONGITUDE', 'TIME', 'MOBILE NO', 'REMARKS', 'OWNER', 'ETA', 'POSITION'
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
    //-----------------
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

  // Add this function to your component
  const handleLoad = async () => {
    // Check if fileData is available
    if (!file) {
      setFileName("");
      setUploadMessage("Upload failed. Please select a CSV file.");
      alert("Please select a CSV file.");

      setTimeout(() => {
        setUploadMessage("");
      }, 1500);
      return;
    }

    // Check if the file name and sheet name are equal
    if (file.name !== "FO CHOWKAS.csv") {
      toast.error(`File name does not match sheet name.`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setFileName("");
      setUploadMessage("Upload failed. \nFile name does not match sheet name.");

      setTimeout(() => {
        setUploadMessage("");
      }, 1500);
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreportfile`;

    try {
      // Create FormData for loading data
      const formData = new FormData();
      console.log("file appending" ,file)
      formData.append("file", file); // Ensure that the key matches the expected key on the server
      formData.append('table', "FO CHOWKAS");
      formData.append('sheet', "FO CHOWKAS");
      
      // Make an axios post request to load data
      const response = await axios.post(apiUrl, formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

     // Check if the response status is successful
      if (response.status === 200 || response.status === 201) {
        // Notify user about successful data load
        toast.info(`Data Loaded Successfully`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        // Call the onDataLoad function if provided
        if (onDataLoad) {
          console.log("On data load: ", response.data)
          onDataLoad(response.data);
        }
      }
    } catch (error) {
      console.log("Updating error: ", error)
      // Handle data load failure
      toast.error(`Upload failed. Please try again.`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // Clear the file name on load failure
      setFileName("");
    } finally {
      // Clear the file input and reset state after load attempt
      resetFileInput();
    }
  };

  return (
    <>
      <Row gutter={[5, 5]}>
        <div className="flex justify-start">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              accept=".csv, .xlsx"
            />
          </Col>
        </div>

        <div className="flex">
          {/* <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center ml-4">
            <Button onClick={handleUpload}>Upload</Button>
          </Col> */}
          <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
            <Button onClick={handleLoad}>Upload</Button>
          </Col>
        </div>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <div>
            {isLoading}
            {uploadMessage && <p>{uploadMessage}</p>}
          </div>
        </Col>
      </Row>

    </>
  );
};

export default FoChowkasBtn;
