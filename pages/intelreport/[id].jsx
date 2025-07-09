import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import PageHeader from "../../src/components/pageheader/pageHeader";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import { hasPermission } from "../../src/helper/permission";
import IntelMacro from "../../src/components/table/IntelMacro";
import { useForm } from "antd/lib/form/Form";
import { useDispatch } from "react-redux";
import { saveIntelDetailReport } from "../../src/redux/thunks/intelDetailData";

const JettyDataTable = dynamic(
  () => import("../../src/components/table/JettyDataTable"),
  {
    ssr: false,
  }
);
function IntelDetails() {
  const router = useRouter();
  const { ir_key } = router.query; // Extract ir_key from query parameters
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [macroDataForm] = useForm();
  const [jettyData, setJettyData] = useState();
  const [jettyDetails, setJettyDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const changePermission = hasPermission('change_intelreport');
  const deletePermision = hasPermission('delete_intelreport');

  const fetchIntelReportID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport/${ir_key}`
      );
      if (response.status === 200)
        setData(response.data);
    } catch (error) {
      router.push("/404");
    }
  }

  useEffect(() => {
    if (!data) {
      fetchIntelReportID();
    }

    // if(!jettyDetails)
    // {
      const fetchAndSetJetty = async () => {
        const jetty = await fetchJettyDetails();
        setJettyDetails(jetty);  // set state here
      };
      fetchAndSetJetty();
    // }

  }, []);


  useEffect(() => {
    if (data && data.intelreportdetails) {
      macroDataForm.setFieldsValue({
        ir_key: data.ir_key,
        ir_pf_id: data.ir_pf_id,
        ir_jetty: data.ir_jetty,
        ir_total_boats: data.ir_total_boats,
        ir_reporter_name: data.ir_reporter_name,
        ir_reporting_time: dayjs(data.ir_reporting_time),
        ir_time: dayjs(data.ir_reporting_time).format("YYYY-MM-DD HH:mm:ss"), 
      })
      const newIntelDetail = data.intelreportdetails.map((item) => ({
        ...item,
        ird_detected_from: item.ird_detected_from ? dayjs(item.ird_detected_from) : null,
        ird_detected_to: item.ird_detected_to ? dayjs(item.ird_detected_to) : null,
      }));
      setJettyData(newIntelDetail);
    }
  }, [data]);

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

  const handleUpdate = async () => {
    const validatedValues = await macroDataForm.validateFields();
    const intelData = {
      ...validatedValues,
    }
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const macroResponse = await axios.put(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport/${data.ir_key}`,
        intelData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Check if the response status is either 200 or 201
      if (macroResponse.status === 200 || macroResponse.status === 201) {
        jettyData.map((item) => {
          const newItem = {
            ...item,
            ird_detected_from: item?.ird_detected_from?.toISOString(),
            ird_detected_to: item?.ird_detected_to?.toISOString(),
            ird_boat_picture: item.ird_boat_picture ? item.ird_boat_picture : "",
          }
          if (typeof (item.ird_boat_picture) === 'string') {
            delete newItem["ird_boat_picture"];
          }
          try {
            if (item.ird_key){
              axios.put(
                `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport_details/${item.ird_key}`,
                newItem, // Make sure this is the correct format for your API
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )}
            else{
              dispatch(
                saveIntelDetailReport({
                  ...newItem,
                  // Add a new property ird_ir_key with the value of macroKey to each item
                  ird_ir_key: ir_key,
                })
              )
            }
          } catch (error) {
            showToastError(error.message);
          }
        });

        const id_list = jettyData.map((item) => item.ird_key)

        data.intelreportdetails.map((item) => {
          if (!id_list.includes(item.ird_key)) {
            try {
              axios.delete(
                `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport_details/${item.ird_key}`
              )
            } catch (error) {
              showToastError(error.message);
            }
          }
        })
        router.push("/intelreport");
        showToastSuccess(`Data Updated Successfully`);

      } else {
        showToastError("Upload failed. Please try again.");
      }
    } catch (error) {
      console.log(error)
    }

  };

  const handleDelete = async () => {
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport/${data.ir_key}`
      );
      // Check if the response status is either 200 or 201
      if (macroResponse.status === 200 || macroResponse.status === 204) {
        router.push("/intelreport");
        showToastSuccess(`Report Deleted Successfully`);

      } else {
        showToastError("Report Deletion failed. Please try again.");
      }
    } catch (error) {
      showToastError("Report Deletion failed. Please try again.");
    }

  };

  return (
    <div>
      <PageHeader
        deleteButton={deletePermision}
        onDelete={handleDelete}
        UpdateButton={changePermission}
        onUpdate={handleUpdate}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        title="Intel Report" />

      <IntelMacro
        disabled={!isEditing}
        macroDataForm={macroDataForm}
        jettyDetails={jettyDetails}>
      </IntelMacro>

      <JettyDataTable
        isLoading={false}
        jettyData={jettyData}
        setJettyData={setJettyData}
        showButtons={isEditing}
      />
    </div>
  );
}

export default IntelDetails;
