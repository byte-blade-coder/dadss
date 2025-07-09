import React, { useEffect, useState } from "react";
import Heading from "../../src/components/title/Heading";
import axios from "axios";
import { shipBreakColumns } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";
import dayjs from "dayjs";
import { Button, Col, Descriptions, InputNumber, Row, Select } from "antd";
import axiosInstance from "../../src/axios";
import { useForm } from "antd/lib/form/Form";
import { hasPermission } from "../../src/helper/permission";
import { useRouter } from "next/router";
import ShipDataTable from "../../src/components/table/shipDataTable";
import CrewTable from "../../src/components/specialTables/CrewTable";
import styled from "styled-components";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import CrewTableShip from "../../src/components/specialTables/CrewTableShip";


function RegisteredShipBreakDetails() {
  const [data, setData] = useState(null);
  const [shipDataForm] = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { sb_key } = router.query; // Extract rv_key from query parameters
  const [crewData, setCrewData] = useState([]);
  const changePermission = hasPermission("change_shipbreaking");
  const deletePermision = hasPermission("delete_shipbreaking");

  const fetchMissionReportID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ship_breaking/${sb_key}`
      );
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      router.push("/404");
    }
  };

  useEffect(() => {
    if (!data) {
      fetchMissionReportID();
    }
  }, []);

  useEffect(() => {
    if (data && data.merchant_vessel && data.shipbreakingcrew) {
      let newData = {}
      Object.keys(data).forEach((item) => {
        if (data[item] === true)
          newData[item] = "Yes";
        else if (data[item] === false)
          newData[item] = "No";
        else
          newData[item] = data[item];
      })

      shipDataForm.setFieldsValue({
        ...newData,
        sb_dtg: dayjs(data.sb_dtg),
        sb_datetime: dayjs(data.sb_dtg).format("YYYY-MM-DD HH:mm:ss"),
        mv_imo: data.merchant_vessel.mv_imo,
        mv_ship_name: data.merchant_vessel.mv_ship_name,
        mv_flag: data.merchant_vessel.mv_flag,
        mv_ais_type_summary: data.merchant_vessel.mv_ais_type_summary,
      })

      const shipCrewDetail = data.shipbreakingcrew.map((item) => ({
        ...item,
      }));

      setCrewData(shipCrewDetail);
    }
  }, [data]);

  const handleUpdate = async () => {
    const validatedValues = await shipDataForm.validateFields();

const merchant_vessel = {
  mv_ship_name: validatedValues["mv_ship_name"],
  mv_imo: validatedValues["mv_imo"],
  mv_flag: validatedValues["mv_flag"],
  mv_ais_type_summary: validatedValues["mv_ais_type_summary"],
};
    delete validatedValues["mv_ship_name"];
    delete validatedValues["mv_imo"];
    delete validatedValues["mv_flag"];
    delete validatedValues["mv_ais_type_summary"];
    const shipData = {
      ...validatedValues,
      merchant_vessel : merchant_vessel,
       shipbreakingcrew: crewData,
    };
    
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const Response = await axios.put(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ship_breaking/${data.sb_key}`,
        shipData
      );
      // Check if the response status is either 200 or 201
      if (Response.status === 200 || Response.status === 201) {
        router.push("/shipbreaking");
        showToastSuccess(`Report Updated Successfully`);
      } else {
        showToastError("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error(error)
    }
  };

  const handleDelete = async () => {
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const Response = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ship_breaking/${data.sb_key}`
      );
      // Check if the response status is either 200 or 201
      if (Response.status === 200 || Response.status === 204) {
        router.push("/shipbreaking");
        showToastSuccess(`Report Deleted Successfully`);
      } else {
        showToastError("Report Deletion failed. Please try again.");
      }
    } catch (error) {
      showToastError("Report Deletion failed. Please try again.");
    }
  };

   const handleFormValidate = () => {
     const forms = [shipDataForm];
     Promise.all(forms.map((form) => form.validateFields()))
       .then(() => {
        handleUpdate();
       })
       .catch(() => {
         // If the data is not valid, scroll to the first invalid field
         const firstInvalidField = [shipDataForm]
           .flatMap((form) => form.getFieldsError())
           .filter((field) => field.errors.length > 0)[0]?.name[0];

            if (firstInvalidField) {
              const inputElement = document.querySelector(
                `[name="${firstInvalidField}"]`
              );
              if(inputElement){inputElement?.scrollIntoView({ behavior: "smooth" });  showToastError(`Enter required fields!`);}
              else{
                showToastError(`Enter required fields!`);
              }
            }
       });
   };


  return (
    <div>
      <PageHeader
        deleteButton={deletePermision}
        onDelete={handleDelete}
        UpdateButton={changePermission}
        // onUpdate={handleUpdate}
        onUpdate={handleFormValidate}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        title="Ship Breaking Report Details"
      />

      <ShipDataTable
        disabled={!isEditing}
        shipDataForm={shipDataForm}
        fixedDisabled={true}
      />

      <CrewTableShip
        crewData={crewData}
        setCrewData={setCrewData}
        isLoading={false}
        showButtons={isEditing}
      />
    </div>
  );
}

export default RegisteredShipBreakDetails;
