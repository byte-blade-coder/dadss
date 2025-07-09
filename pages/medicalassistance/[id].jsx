import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Table, Tooltip } from "antd";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import { useDispatch, useSelector } from "react-redux";
import Heading from "../../src/components/title/Heading";
import { DMStodecimal, coordinatesToDMS, coordinatesToDMS1, decimalToDMS, positiontoDMS } from "../../src/helper/position";
import dayjs from "dayjs";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import { hasPermission } from "../../src/helper/permission";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import MedicalAssistanceForm from "../../src/components/stackedForm/MedicalAssistanceForm";


function MedicalAssistanceDetails() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const { sar_key } = router.query;
  const coireport = true;
  const [isEditing, setIsEditing] = useState(false);
//   const changePermission = hasPermission('change_sreports');
//   const deletePermision = hasPermission('delete_sreports');
const changePermission = true;
const deletePermision = true;

  const [medicalassistanceForm] = useForm();

  const fetchRecordID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/sar/${sar_key}`
      );
      if (response.status === 200)
        {
          setData(response.data);
        }
    } catch (error) {
        console.log(error)
      router.push("/404");
    }
  }

  useEffect(() => {
    if (!data) {
        fetchRecordID();
    }
  }, []);

  useEffect(() => {
    if (data) 
    {
        medicalassistanceForm.setFieldsValue({
        sar_boat_name: data.sar_boat_name,
        sar_unit: data.sar_unit,
        sar_crew: data.sar_crew,
        sar_regno: data.sar_regno,
        sar_nature: data.sar_nature,
        sar_assistance_type: data.sar_assistance_type,
        sar_remarks: data.sar_remarks,
        sar_position: {
          ...data.sar_position,
          lat: data.sar_position.coordinates[1],
          lng: data.sar_position.coordinates[0], 
          dms: coordinatesToDMS1(data.sar_position.coordinates),
          //string: [positiontoDMS(coordinatesToDMS1(data.sar_position.coordinates)[0]), positiontoDMS(coordinatesToDMS1(data.ssr_position.coordinates)[1])]
        },
        sar_dtg: dayjs(data.sar_dtg),
        datetime: dayjs(data.sar_dtg).format("YYYY-MM-DD HH:mm:ss"),
      })
    }

  }, [data]);

  const handleUpdate = async () => {
    const validatedValues = await medicalassistanceForm.validateFields();
    const coordinates = [
      validatedValues.sar_position.lng,
      validatedValues.sar_position.lat,
    ];

    const editedData = {
      ...validatedValues,
      sar_position: {
        type: "Point",
        coordinates: coordinates,
        //coordinates: DMStodecimal(validatedValues.ssr_position.dms),
      },
      sar_table: "MEDASSIST_FORM",
    }

    try {
      // Send a POST request to the Static Special report endpoint with the provided data
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/sar/${sar_key}`,
        editedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        router.push("/medicalassistance");
        showToastSuccess(`Report Updated Successfully`);
      } 
    } catch (error) {
        console.log(error)
    }

  };

  const handleDelete = async () => {
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/sar/${data.sar_key}`
      );
      // Check if the response status is either 200 or 201
      if (macroResponse.status === 200 || macroResponse.status === 204) {
        router.push("/medicalassistance");
        showToastSuccess(`Report Deleted Successfully`);

      } else {
        showToastError("Report Deletion failed. Please try again.");
      }
    } catch (error) {
      showToastError("Report Deletion failed. Please try again.");
    }

  };

  const handleFormValidate = () => {
    const forms = [medicalassistanceForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
      handleUpdate();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [medicalassistanceForm]
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
    <>
      <div>
        <PageHeader
          deleteButton={deletePermision}
          onDelete={handleDelete}
          UpdateButton={changePermission}
          // onUpdate={handleUpdate}
          onUpdate = {handleFormValidate}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          title="Medical Assistance Vessels Report"
        />
        {/* <div>
          <Heading
            className=" whitespace-nowrap ml-5 flex justify-start "
            level={4}
            text="Ship Data"
          />
        </div> */}
        <MedicalAssistanceForm
            disabled={!isEditing}
            form={medicalassistanceForm}>
        </MedicalAssistanceForm>
      </div>
    </>
  );
}

export default MedicalAssistanceDetails;
