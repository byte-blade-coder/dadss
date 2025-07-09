import { React, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import axios from "axios";
import { saveIntelDetailReport } from "../../src/redux/thunks/intelDetailData";
import PageHeader from "../../src/components/pageheader/pageHeader";
import IntelMacro from "../../src/components/table/IntelMacro";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import { useForm } from "antd/lib/form/Form";

const JettyDataTable = dynamic(
  () => import("../../src/components/table/JettyDataTable"),
  {
    ssr: false,
  }
);


function Addintelinput() {
  const router = useRouter();
  const dispatch = useDispatch();
  const init_macro_data = { ir_pf_id: localStorage.getItem("u_pf_id") };
  const [jettyData, setJettyData] = useState([]);
  const [jettyDetails, setJettyDetails] = useState([]);
  const [macroDataForm] = useForm();


  useEffect(() => {
    macroDataForm.setFieldsValue({
      ir_pf_id: init_macro_data.ir_pf_id
    });


    const fetchAndSetJetty = async () => {
      const jetty = await fetchJettyDetails();
      setJettyDetails(jetty);  // set state here
    };
    fetchAndSetJetty();

  }, []);


  const fetchJettyDetails = async () => {
    try{
      const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/jetty`
      );
      if (response.status === 200) {
        return response.data;
      }

    }
    catch(error){
      console.log(error)
      return [];
    }
  }

  const handleSendIntelReport = async () => {
    const validatedValues = await macroDataForm.validateFields();
    const intelData = {
      ...validatedValues,
      ...init_macro_data,
    }
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const macroResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport`,
        intelData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Check if the response status is either 200 or 201
      if (macroResponse.status === 200 || macroResponse.status === 201) {
        // Extract the generated macro key from the response data
        const macroKey = macroResponse.data.ir_key;

        // If there is Jetty data, iterate through each item and dispatch an action to save Intel detail report
        if (jettyData.length) {
          jettyData.map((item) =>
            dispatch(
              saveIntelDetailReport({
                ...item,
                //The toISOString() method is then called on the dtg object to convert it into a string in the ISO 8601 format.
                ird_detected_from: item?.ird_detected_from?.toISOString(),
                ird_detected_to: item?.ird_detected_to?.toISOString(),
                // Add a new property ird_ir_key with the value of macroKey to each item
                ird_ir_key: macroKey,
              })
            )
          );
        }
        // Redirect to the Intel report page after successful data save
        showToastSuccess("Data Saved Successfully");
        router.push("/intelreport");
      } else {
        showToastError("Upload failed. Please try again.");
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <PageHeader
        showButton={true}
        onNavigate={handleSendIntelReport}
        btnTitle="Save Report"
        showSearchBox={false}
        title="Add Intel Report Details"
      />
      
      {/*-----------------------------------Marco data  (First Table)-------------------------------------*/}
      <IntelMacro
        disabled={false}
        macroDataForm={macroDataForm}
        jettyDetails={jettyDetails}
      />
      {/*-----------------------------------Jetty data  (Second Table)-------------------------------------*/}
      <JettyDataTable
        jettyData={jettyData}
        setJettyData={setJettyData}
        showButtons={true}
      />
    </>
  );
}

export default Addintelinput;
