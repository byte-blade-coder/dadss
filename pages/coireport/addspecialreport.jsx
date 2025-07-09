import React, { useEffect, useState } from "react";
import Heading from "../../src/components/title/Heading";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { saveCoiVessel } from "../../src/redux/thunks/coiVesselData";
import dayjs from "dayjs";
import OwnerTable from "../../src/components/specialTables/OwnerTable";
import CrewTable from "../../src/components/specialTables/CrewTable";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import axios from "axios";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useForm } from "antd/lib/form/Form";
import CoiVesselTable from "../../src/components/table/CoiVesselTable";
import OwnPlatformForm from "../../src/components/stackedForm/OwnPlatformForm";
import FishingTripForm from "../../src/components/stackedForm/FishingTripForm";
import { DMStodecimal } from "../../src/helper/position";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import NakwaForm from "../../src/components/stackedForm/NakwaForm";

function Details() {
  const [showButtons, setShowButtons] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  //const { id } = router.query;
  const parsedVesselData = JSON.parse(localStorage.getItem("vessel"));
  const init_platform_data = { sr_pf_id: localStorage.getItem("u_pf_id") };
  const coireport = true;
  const [data, setData] = useState(null);
  const [vesselForm] = useForm();
  const [platformForm] = useForm();
  const [tripForm] = useForm();
  const [nakwaForm] = useForm();

  const [selectedType, setSelectedType] = useState(null);
  // const [nakwaImgs, setNakwaImgs] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [crewData, setCrewData] = useState([]);
  const [goodsData, setGoodsData] = useState([]);
  const [personData, setPersonData] = useState([]);

  const usertype = localStorage.getItem("is_superuser")

  useEffect(() => {
    vesselForm.setFieldsValue({
      ...parsedVesselData,
    });
    platformForm.setFieldsValue({
      ssr_own_ship: init_platform_data.sr_pf_id,
    });
  }, [data]);

  const handleFishingSave = async () => {
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

    const coordinates = [
      validatedValues?.ssr_position?.lng ?? null,
      validatedValues?.ssr_position?.lat ?? null,
      //platformData.msr_position.coordinates[1],
      //platformData.msr_position.coordinates[0], 
    ];

    const finalData =
    {
      ...validatedValues,
      ssr_position: {
        type: "Point",
        coordinates: coordinates,
        // coordinates: DMStodecimal(validatedValues.ssr_position.dms),
      },
      // sr_rv_key: id,
      ssr_country: vesselForm.getFieldValue("ssr_country"),
      ssr_boat_name: vesselForm.getFieldValue("ssr_boat_name"),
      ssr_boat_type: vesselForm.getFieldValue("ssr_boat_type"),
      ssr_boat_length: vesselForm.getFieldValue("ssr_boat_length"),
      ssr_boat_breadth: vesselForm.getFieldValue("ssr_boat_breadth"),
      ssr_legal: vesselForm.getFieldValue("ssr_legal"),
      ssr_boat_id: vesselForm.getFieldValue("ssr_boat_id"),
      ssr_boat_regno: vesselForm.getFieldValue("ssr_boat_regno"),
      ssr_village: vesselForm.getFieldValue("ssr_village"),
      ssr_remarks: vesselForm.getFieldValue("ssr_remarks"),
      ssr_speed: tripForm.getFieldValue("ssr_speed"),
      // nakwaDetails: [{ ...nakwaValues }],
      ssr_goods: goodsData.map((item) => ({
        ...item,
        ssrg_confiscated: item.ssrg_confiscated === "Yes" ? true : false,
      })),

      ssr_person,
      // crewDetails: crewData.map((item) => ({
      //   ...item,
      //   ssrp_idexpdt: dayjs(item.ssrp_idexpdt).format("YYYY-MM-DD"),
      // })),
      
      ssr_dep_date: dayjs(tripValues.ssr_dep_date).format("YYYY-MM-DD"),
      ssr_dep_jetty: tripValues.ssr_dep_jetty,
      ssr_pc_issue_place: tripValues.ssr_pc_issue_place,
      ssr_pc_days: tripValues.ssr_pc_days,
      ssr_pc_issue_date: dayjs(tripValues.ssr_pc_issue_date).format("YYYY-MM-DD"),
      ssr_table: "COI_FORM",
      ssr_coi: true,
    }

    const newFinal = {
      data: finalData,
      navigation: router,
    };
    dispatch(saveCoiVessel(newFinal));
    localStorage.removeItem("vessel");
  };

  const handleFormValidate = () => {
    const forms = [platformForm, tripForm, nakwaForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
        handleFishingSave();
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

  useEffect(() => {
    if (data) {
      if (data.ssr_boat_id) {
        vesselForm.setFieldsValue({
          ...data.ssr_boat_id,
        });
      }
      if (data?.tripDetails) {
        tripForm.setFieldsValue({
          ...data.tripDetails,
          sr_movement: data.ssr_speed,
          sr_depdt: dayjs(data.tripDetails.ssr_dep_date),
          datetime: dayjs(data.tripDetails.ssr_dep_date).format("YYYY-MM-DD"),
          sr_pcissuedt: dayjs(data.tripDetails.ssr_pc_issue_date),
          datetime1: dayjs(data.tripDetails.ssr_pc_issue_date).format("YYYY-MM-DD"),
        });
      }

      if (data?.ssr_person) {
        data.ssr_person.forEach((person) => {
          switch (person.ssrp_type) {
            case "Nakwa":
              nakwaForm.setFieldsValue({
                ...person,
                ssrp_type: "Nakwa",
              });
              break;
            case "Owner":
              setOwnerData(
                {
                  ...person,
                  ssrp_idexpdt: dayjs(person.ssrp_idexpdt),
                }
              );
              ;
            case "Crew":
              setCrewData(
                {
                  ...person,
                  ssrp_idexpdt: dayjs(person.ssrp_idexpdt),
                }
              );
              break;
            default:
              console.warn(`Unhandled ssrp_type: ${person.ssrp_type}`);
          }
        })
      }

      if (data.ssr_goods) {
        setGoodsData(
          data.goodDetails.map((item) => ({
            ...item,
            srg_confiscated: item.srg_confiscated ? "Yes" : "No",
          }))
        );
      }
    }
  }, [data]);

  const handleBack = () => {
    localStorage.removeItem("vessel");
    router.back();
  };

  const handleReset = () => {
    platformForm.setFieldsValue({
      sr_pf_id: init_platform_data.sr_pf_id,
    });
    tripForm.resetFields();
    nakwaForm.resetFields();
    setCrewData([]);
    setGoodsData([]);
    setOwnerData([]);
    //setPersonData([])
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  // Handle nakwa img file addition
  const AddNakwaImg = (newFileList) => {
    setNakwaImgs(newFileList);
  };

  // Handle nakwa img file removal
  const RemoveNakwaImg = (file) => {
    // If the user confirms, update the state to remove the image at the specified index
    const newFileList = nakwaImgs.filter((item) => item.uid !== file.uid);
    setNakwaImgs(newFileList);
  };
  

  return (
    <>
      <div>
        <PageHeader
          handleBack={handleBack}
          showButton={true}
          onNavigate={handleFormValidate}
          btnTitle="Save Report"
          showSearchBox={false}
          handleReset={handleReset}
          title="Special Report COI Vessels"
        />
      </div>

      {/*----------------------------------- Vessel Data -------------------------------------*/}

      <div>
        <Heading
          className=" whitespace-nowrap ml-5 flex justify-start "
          level={4}
          text="Vessel Data"
        />
      </div>
      <CoiVesselTable
        disabled={false}
        //fixedDisabled={true}
        vesselForm={vesselForm}
        coireport={coireport}
        onTypeChange={handleTypeChange}
      ></CoiVesselTable>

      {/*----------------------------------- Platform Data -------------------------------------*/}

      <OwnPlatformForm
        disabled={false}
        form={platformForm}
        reportKeys={{
          dtg: "ssr_dtg",
          pf_id: "ssr_own_ship",
          //pf_id_existing: "sr_pf_id",
          position: "ssr_position",
          lat: "ssr_position.lat",
          lng: "ssr_position.lng",
          fuel: "ssr_fuelrem",
          info: "ssr_remarks",
          patrolType: "ssr_patroltype",
          action: "ssr_actiontype",
          // frshwatr: "ssr_freshwater",
        }}
        coireport={coireport}
      />

      {/*----------------------------------- Trip Data -------------------------------------*/}

      <FishingTripForm disabled={false} form={tripForm} coireport={coireport}></FishingTripForm>

      {/*----------------------------------- Nakwa Data -------------------------------------*/}
      {(selectedType !== "Person" || selectedType !== "Vehicle")  && (
        <NakwaForm disabled={false} form={nakwaForm} coireport={coireport}
        add={true} ></NakwaForm>
      )}


      {/*----------------------------------- Owner Data -------------------------------------*/}
      {(selectedType === "Skiff" || selectedType === "Vehicle" || selectedType === "DHOW")  && (
        <OwnerTable
          ownerData={ownerData}
          setOwnerData={setOwnerData}
          showButtons={showButtons}
          coireport={coireport}
          add={true}
        />
      )}

      {/*----------------------------------- Crew Data -------------------------------------*/}
      {(selectedType === "Skiff" || selectedType === "Vehicle" || selectedType === "DHOW")  && ( 
        <CrewTable
          crewData={crewData}
          setCrewData={setCrewData}
          showButtons={showButtons}
          labelConfig="page1"
          coireport={coireport}
        />
      )}

      {/*----------------------------------- Goods Data -------------------------------------*/}
      {(selectedType === "Skiff" || selectedType === "Vehicle" || selectedType === "DHOW")  && (
        <GoodsTable
          goodsData={goodsData}
          setGoodsData={setGoodsData}
          showButtons={showButtons}
          coireport={coireport}
        />
      )}
    </>
  );
}

export default Details;
