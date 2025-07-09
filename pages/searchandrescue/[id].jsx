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
import SARForm from "../../src/components/stackedForm/SARForm";
import OwnPlatformTable from "../../src/components/specialTables/OwnPlatformTable";
import SARShipForm from "../../src/components/stackedForm/SARShipForm";
import { addSARData } from "../../src/redux/thunks/searchandrescue";

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
  const [sarForm] = useForm();
  const [sarshipForm] = useForm();
  const [platformData, setPlatformData] = useState([]);

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
       sarForm.setFieldsValue({
        sar_lives_saved: data.sar_lives_saved,
        sar_lives_lost: data.sar_lives_lost,
        sar_person_assisted: data.sar_person_assisted,
        sar_value_property_saved: data.sar_value_property_saved,
        sar_value_property_lost: data.sar_value_property_lost,
        sar_prevented_property_lost: data.sar_prevented_property_lost,
        sar_alerting_type: data.sar_alerting_type,
        sar_distress_method: data.sar_distress_method,
        sar_incidents: data.sar_incidents,
        sar_response: data.sar_response,
        //sar_assistance_type: data.sar_assistance_type,
        //sar_remarks: data.sar_remarks,
      })
      sarshipForm.setFieldsValue({
        sar_boat_name: data.sar_boat_name,
        sar_unit_size: data.sar_unit_size,
        sar_crew: data.sar_crew,
        sar_regno: data.sar_regno,
        sar_country: data.sar_country,
        sar_position: {
          ...data.sar_position,
          lat: data.sar_position.coordinates[1],
          lng: data.sar_position.coordinates[0], 
          dms: coordinatesToDMS1(data.sar_position.coordinates),
          //string: [positiontoDMS(coordinatesToDMS1(data.sar_position.coordinates)[0]), positiontoDMS(coordinatesToDMS1(data.ssr_position.coordinates)[1])]
        },
        sar_dtg: data.sar_dtg? dayjs(data.sar_dtg) : "",
        datetime: dayjs(data.sar_dtg).format("YYYY-MM-DD HH:mm:ss"),
      })
      const newPlatformDetail = data.sar_platform.map((item) => ( {
        ...item,
       
      }));
      setPlatformData(newPlatformDetail);
    }

  }, [data]);

  const handleUpdate = async () => {
    const checkedValues = await sarForm.validateFields();
    const validatedValues = await sarshipForm.validateFields();

    const coordinates = [
      validatedValues.sar_position.lng,
      validatedValues.sar_position.lat,
    ];

    const editedData = {
      ...checkedValues,
      ...validatedValues,
      sar_position: {
        type: "Point",
        coordinates: coordinates,
        //coordinates: DMStodecimal(validatedValues.ssr_position.dms),
      },
      sar_table: "SAR_FORM",
      sar_platform: platformData,
    //   sar_unit: platformData.map((item) => {
    //     item.sarp_platform
    //     }
    //   )
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
        router.push("/searchandrescue");
        showToastSuccess(`Report Updated Successfully`);
      } 
    } catch (error) {
             console.error(error)
      // showToastError("Upload failed. Please try again. ");
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
        router.push("/searchandrescue");
        showToastSuccess(`Report Deleted Successfully`);

      } else {
        showToastError("Report Deletion failed. Please try again.");
      }
    } catch (error) {
      showToastError("Report Deletion failed. Please try again.");
    }

  };

  const handleFormValidate = () => {
    const forms = [sarForm, sarshipForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
      handleUpdate();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [sarForm, sarshipForm]
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
          title="Search and Rescue Vessels Report"
        />
        <SARForm
            disabled={!isEditing}
            form={sarForm}>
        </SARForm>
        <SARShipForm
            disabled={!isEditing}
            form={sarshipForm}>
        </SARShipForm>
        <OwnPlatformTable
            platformData={platformData}
            setPlatformData={setPlatformData}
            showButtons={isEditing}
            reportKeys={{
            platform: "sarp_platform",
            to: "sarp_to",
            from: "sarp_from",
            sorties: "sarp_sorties",
            time: "sarp_sorties_time_expended"
            }}
        >
        </OwnPlatformTable>
      </div>
    </>
  );
}

export default MedicalAssistanceDetails;
