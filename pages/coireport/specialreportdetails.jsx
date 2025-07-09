import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Table, Tooltip } from "antd";
import { MerchantDetailColumns, RegVesselColumn } from "../../src/helper/DataColumns";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchMerchantById } from "../../src/redux/thunks/merchantVesselData";
import TableItemRenderer from "../../src/components/table/RenderTable";
import Heading from "../../src/components/title/Heading";
import AntdTable from "../../src/components/table/AntdTable";
import { DMStodecimal, coordinatesToDMS, coordinatesToDMS1, decimalToDMS, positiontoDMS } from "../../src/helper/position";
import dayjs from "dayjs";
import { fetchFishingById } from "../../src/redux/thunks/fishingVesselData";
import { useForm } from "antd/lib/form/Form";
import CoiVesselTable from "../../src/components/table/CoiVesselTable";
import OwnPlatformForm from "../../src/components/stackedForm/OwnPlatformForm";
import axios from "axios";
import { hasPermission } from "../../src/helper/permission";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import CrewTable from "../../src/components/specialTables/CrewTable";
import OwnerTable from "../../src/components/specialTables/OwnerTable";
import FishingTripForm from "../../src/components/stackedForm/FishingTripForm";
import NakwaForm from "../../src/components/stackedForm/NakwaForm";

function Specialreportdetails() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const { ssr_key } = router.query;
  const coireport = true;
  const [isEditing, setIsEditing] = useState(false);
  const changePermission = hasPermission('change_sreports');
  const deletePermision = hasPermission('delete_sreports');

  const [platformForm] = useForm();
  const [vesselForm] = useForm();
  const [tripForm] = useForm();
  const [nakwaForm] = useForm();

  const [selectedType, setSelectedType] = useState(null);
  const [ownerData, setOwnerData] = useState([]);
  const [crewData, setCrewData] = useState([]);
  const [goodsData, setGoodsData] = useState([]);

  const fetchCoiID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreport/${ssr_key}`
      );
      if (response.status === 200)
        {
          setData(response.data);
          // console.log(response)
        }
    } catch (error) {
      router.push("/404");
    }
  }

  useEffect(() => {
    if (!data) {
      fetchCoiID();
    }
  }, []);

  useEffect(() => {
    if (data) 
    {
      platformForm.setFieldsValue({
        ssr_boat_id: data.ssr_boat_id,
        ssr_own_ship: data.ssr_own_ship,
        ssr_patroltype: data.ssr_patroltype,
        ssr_fuelrem: data.ssr_fuelrem,
        ssr_actiontype: data.ssr_actiontype,
        ssr_remarks: data.ssr_remarks,
        ssr_position: {
          ...data.ssr_position,
          lat: data.ssr_position.coordinates[1],
          lng: data.ssr_position.coordinates[0], 
          dms: coordinatesToDMS1(data.ssr_position.coordinates),
          string: [positiontoDMS(coordinatesToDMS1(data.ssr_position.coordinates)[0]), positiontoDMS(coordinatesToDMS1(data.ssr_position.coordinates)[1])]
        },
        ssr_dtg: dayjs(data.ssr_dtg),
        datetime: dayjs(data.ssr_dtg).format("YYYY-MM-DD HH:mm:ss"),
      })

      vesselForm.setFieldsValue({
        //...data.rvessel,
        ssr_country: data.ssr_country,
        ssr_boat_name: data.ssr_boat_name,
        ssr_boat_type: data.ssr_boat_type,
        ssr_boat_length: data.ssr_boat_length,
        ssr_boat_breadth: data.ssr_boat_breadth,
        ssr_legal: data.ssr_legal? "Yes" : "No",
        ssr_boat_id: data.ssr_boat_id,
        ssr_boat_regno: data.ssr_boat_regno,
        ssr_village: data.ssr_village,
        ssr_remarks: data.ssr_legal? data.ssr_remarks : "-",
      });
      setSelectedType(data.ssr_boat_type);

      tripForm.setFieldsValue({
        //...data.tripDetails,
        ssr_pc_issue_place: data.ssr_pc_issue_place,
        ssr_pc_days: data.ssr_pc_days,  
        ssr_speed: data.ssr_speed,
        ssr_dep_jetty: data.ssr_dep_jetty,
        ssr_dep_date: data.ssr_dep_date ? dayjs(data.ssr_dep_date) : null,
        datetime: data.ssr_dep_date ? dayjs(data.ssr_dep_date).format("YYYY-MM-DD") : null,
        ssr_pc_issue_date: data.ssr_pc_issue_date ? dayjs(data.ssr_pc_issue_date) : null,
        datetime1: data.ssr_pc_issue_date ? dayjs(data.ssr_pc_issue_date).format("YYYY-MM-DD") : null,
        });

      if (data?.ssr_person) {
        // Process each ssr_person item based on its ssrp_type
        data.ssr_person.forEach((person) => {
          switch (person.ssrp_type) {
            case "Nakwa":
              nakwaForm.setFieldsValue({
                ...person,
              });
              break;
            case "Owner":
              setOwnerData((prevData) => [
                ...prevData,
                {
                  ...person,
                  ssrp_idexpdt: dayjs(person.ssrp_idexpdt),
                },
              ]);
              break;
            case "Crew":
              setCrewData((prevData) => [
                ...prevData,
                {
                  ...person,
                  ssrp_idexpdt: dayjs(person.ssrp_idexpdt),
                },
              ]);
              break;
            default:
              console.warn(`Unhandled ssrp_type: ${person.ssrp_type}`);
          }
        });
      }      

      if (data.ssr_goods) {
        setGoodsData(
          data.ssr_goods.map((item) => (
            {
            ...item,
            ssrg_confiscated: item?.ssrg_confiscated === true ? "Yes" : item?.ssrg_confiscated === false ? "No" : "",
          }))
        );
      }
    }

  }, [data]);

  const handleUpdate = async () => {
    const vesselValues = await vesselForm.validateFields();
    const validatedValues = await platformForm.validateFields();
    const tripValues = await tripForm.validateFields();
    const nakwaValues = await nakwaForm.validateFields();

    // const ssr_person = [
    //   {
    //     ...nakwaValues,
    //     ssrp_type: "Nakwa",
    //     ssrp_idexpdt: dayjs(nakwaValues.ssrp_idexpdt).format("YYYY-MM-DD"),
    //   },
    //   ...ownerData.map((item) => ({
    //     ...item,
    //     ssrp_type: "Owner",
    //     ssrp_idexpdt: dayjs(item.ssrp_idexpdt).format("YYYY-MM-DD"),
    //   })),
    //   ...crewData.map((item) => ({
    //     ...item,
    //     ssrp_type: "Crew",
    //     ssrp_idexpdt: dayjs(item.ssrp_idexpdt).format("YYYY-MM-DD"),
    //   })),
    // ];

    let ssr_person = [];
    if (nakwaValues && (
      nakwaValues.ssrp_ethnicity !== undefined ||
      nakwaValues.ssrp_mobileno !== undefined ||
      nakwaValues.ssrp_name !== undefined ||
      nakwaValues.ssrp_nationality !== undefined ||
      nakwaValues.ssrp_idexpdt !== undefined
    )) {
      ssr_person.push({
        ...nakwaValues,
        ssrp_type: "Nakwa",
        ssrp_idexpdt: dayjs(nakwaValues.ssrp_idexpdt).format("YYYY-MM-DD"),
      });
    }

    if (ownerData.length > 0) {
      ssr_person = ssr_person.concat(ownerData.map((item) => ({
        ...item,
        ssrp_type: "Owner",
        ssrp_idexpdt: dayjs(item.ssrp_idexpdt).format("YYYY-MM-DD"),
      })));
    }

    if (crewData.length > 0) {
      ssr_person = ssr_person.concat(crewData.map((item) => ({
        ...item,
        ssrp_type: "Crew",
        ssrp_idexpdt: dayjs(item.ssrp_idexpdt).format("YYYY-MM-DD"),
      })));
    }

    // console.log("coi update validatedValues", validatedValues)
    const coordinates = [
      validatedValues.ssr_position.lng,
      validatedValues.ssr_position.lat,
    ];

    const editedData = {
      ...vesselValues,
      ...validatedValues,
      ssr_position: {
        type: "Point",
        coordinates: coordinates,
        //coordinates: DMStodecimal(validatedValues.ssr_position.dms),
      },
      ssr_boat_id: data.ssr_boat_id,
      ssr_speed: tripForm.getFieldValue('ssr_speed'),
      //nakwaDetails: [{...nakwaValues}],
      ssr_goods: goodsData.map((item) => ({
        ...item,
        ssrg_confiscated: item.ssrg_confiscated === "Yes" ? true : false,
      })),
      // ownerDetails: ownerData.map((item) => ({
      //   ...item,
      //   sro_idexpdt: dayjs(item.sro_idexpdt).format("YYYY-MM-DD"),
      // })),
      // crewDetails: crewData.map((item) => ({
      //   ...item,
      //   src_idexpdt: dayjs(item.src_idexpdt).format("YYYY-MM-DD"),
      // })),
      ssr_person,
      ssr_dep_date: dayjs(tripValues.ssr_dep_date).format("YYYY-MM-DD"),
      ssr_dep_jetty: tripValues.ssr_dep_jetty,
      ssr_pc_issue_place: tripValues.ssr_pc_issue_place,
      ssr_pc_days: tripValues.ssr_pc_days,
      ssr_pc_issue_date: dayjs(tripValues.ssr_pc_issue_date).format("YYYY-MM-DD"),
    }

    try {
      // Send a POST request to the Static Special report endpoint with the provided data
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreport/${ssr_key}`,
        editedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        router.push("/coireport");
        showToastSuccess(`Report Updated Successfully`);
      } 
    } catch (error) {
      showToastError("Upload failed. Please try again. ");
    }

  };

  const handleDelete = async () => {
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ssreport/${data.ssr_key}`
      );
      // Check if the response status is either 200 or 201
      if (macroResponse.status === 200 || macroResponse.status === 204) {
        router.push("/coireport");
        showToastSuccess(`Report Deleted Successfully`);

      } else {
        showToastError("Report Deletion failed. Please try again.");
      }
    } catch (error) {
      showToastError("Report Deletion failed. Please try again.");
    }

  };

  const handleFormValidate = () => {
    const forms = [platformForm , tripForm, nakwaForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
      handleUpdate();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [platformForm, tripForm, nakwaForm]
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

  const handleTypeChange = (value) => {
    setSelectedType(value);
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
          title="Special Report COI Vessels"
        />
        <div>
          <Heading
            className=" whitespace-nowrap ml-5 flex justify-start "
            level={4}
            text="Vessel Data"
          />
        </div>
        <CoiVesselTable
         disabled={!isEditing}
         //fixedDisabled={true}
         vesselForm={vesselForm}
         coireport={coireport}
         onTypeChange={handleTypeChange}
        >
        </CoiVesselTable>
        <OwnPlatformForm
          disabled={!isEditing}
          form={platformForm}
          reportKeys={{
            dtg: "ssr_dtg",
            pf_id: "ssr_own_ship",
            //pf_id: "sr_pf_id",
            position: "ssr_position",
            lat: "gr_position.lat",
            lng: "gr_position.lng",
            fuel: "ssr_fuelrem",
            info: "ssr_remarks",
            patrolType: "ssr_patroltype",
            action: "ssr_actiontype",
            // frshwatr: "ssr_freshwater",
          }}
          coireport={coireport}
        />
        <FishingTripForm
          disabled={!isEditing}
          form={tripForm}
          coireport={coireport}
        >
        </FishingTripForm>

      {(selectedType !== "Person"  || selectedType !== "Vehicle") && (
        <NakwaForm
          disabled={!isEditing}
          form={nakwaForm}
          coireport={coireport}
        ></NakwaForm>
      )}

      {(selectedType !== "Person" )  && (
        <OwnerTable
          ownerData={ownerData}
          setOwnerData={setOwnerData}
          showButtons={isEditing}
          coireport={coireport}
        />
      )}

      {(selectedType !== "Person" )  && ( 
        <CrewTable
          crewData={crewData}
          setCrewData={setCrewData}
          showButtons={isEditing}
          labelConfig="page1"
          coireport={coireport}
        />
      )}

      {(selectedType !== "Person" )  && (
        <GoodsTable
          goodsData={goodsData}
          setGoodsData={setGoodsData}
          showButtons={isEditing}
          coireport={coireport}
        />
      )}

      </div>
    </>
  );
}

export default Specialreportdetails;
