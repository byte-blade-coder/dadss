import React, { useEffect, useState } from "react";
import Heading from "../../../src/components/title/Heading";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { saveFishingVessel, saveTripDetailswithReturnDate} from "../../../src/redux/thunks/fishingVesselData";
import dayjs from "dayjs";
import { Checkbox, Modal, Collapse } from "antd";
import OwnerTable from "../../src/components/details/OwnerDetails";
import CrewTable from "../../src/components/details/CrewDetails";
import GoodsTable from "../../src/components/details/GoodsDetails";
import axios from "axios";
import PageHeader from "../../../src/components/pageheader/pageHeader";
import { useForm } from "antd/lib/form/Form";
import FishingVesselTable from "../../../src/components/table/FishingVesselTable";
import VesselTripPicketForm from "../../src/components/stackedForm/VesselTripPicketForm";
import NakwaForm from "../../../src/components/stackedForm/NakwaForm";
import urlToFile from "../../../src/helper/urlToImgFileCovertor";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
const Panel = Collapse.Panel;

function Details() {
  const [showButtons, setShowButtons] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const parsedVesselData = JSON.parse(localStorage.getItem("vessel"));
  const vesselStatus = JSON.parse(localStorage.getItem("vessel_status"));
  const tripFormPermissions = JSON.parse(localStorage.getItem("tripForm_permissons"));
  const init_platform_data = { sr_pf_id: localStorage.getItem("u_pf_id") };
  const [data, setData] = useState(null);
  const [hasPicture, setHasPicture] = useState(false);
  const [vesselForm] = useForm();
  const [platformForm] = useForm();
  const [tripForm] = useForm();
  const [nakwaForm] = useForm();

  const [ownerData, setOwnerData] = useState([]);
  const [crewData, setCrewData] = useState([]);
  const [goodsData, setGoodsData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [nakwaImgs, setNakwaImgs] = useState([]);
  const [ownerImgs, setOwnerImgs] = useState([]);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const fetchFishingID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel/${id}`
      );
      if (response.status === 200) setData(response.data);
    } catch (error) {
      router.push("/404");
    }
  };

  console.log("data", data, vesselStatus)

  useEffect(() => {
    if (!data) {
      fetchFishingID();
    }
  }, []);

  useEffect(() => {
    vesselForm.setFieldsValue({
      // ...parsedVesselData,
        rv_pf_id: data?.rv_pf_id ? data?.rv_pf_id: "",
        rv_name: data?.rv_name? data?.rv_name : "",
        rv_flag: data?.rv_flag? data?.rv_flag : "",
        rv_type: data?.rv_type? data?.rv_type : "",
        rv_tonnage: data?.rv_tonnage? data?.rv_tonnage : "",
        rv_id: data?.rv_id? data?.rv_id : "",
        rv_regno: data?.rv_regno? data?.rv_regno : "",
        rv_province: data?.rv_province? data?.rv_province : "",
        rv_length: data?.rv_length? data?.rv_length : "",
        rv_breadth: data?.rv_breadth? data?.rv_breadth : "",
    });
    platformForm.setFieldsValue({
      sr_pf_id: init_platform_data.sr_pf_id,
      
    });
    // Flatten the array of image objects
    const ownerFiles = data?.ownerDetails.reduce((owner, item) => {
      // console.log("Setting owner images", owner,item)
    const images = item.sro_images.map((img) => ({
      roi_remarks: img.sroi_remarks,
      uid: img.sroi_key,
      name: img.sroi_image?.split('/').pop(),
      url: img.sroi_image,
      status: 'done',
      originFileObj: null,
      // ownerKey: img.sroi_owner
      }));
      return owner.concat(images);
    }, []);
    setOwnerImgs(ownerFiles);

  }, [data]);


  useEffect(() => {
    if (data) {
      console.log("SEtting all fields", data)
      // Convert image data to fileList format
      const imageFiles = data?.rv_images?.map(img => (
      {
          ri_remarks: img.ri_remarks==="undefined" ? "" : img.ri_remarks,
          uid: img.ri_key,
          name: img.ri_image?.split('/').pop(),
          url: img.ri_image,
          status: 'done',
          originFileObj: null, // Placeholder, as `originFileObj` is not available in fetched data
      }));
      setFileList(imageFiles);

      //const nakwaFiles = data?.nakwaDetails[0]?.src_images?.map(img => (
      const nakwaFiles = data?.nakwaDetails[0]?.src_images?.map(img => (
        //console.log(img),
        {
          rci_remarks: img.rci_remarks ? img.rci_remarks : img.srci_remarks,
          uid: img.rci_key ? img.rci_key : img.srci_key,
          name: img.rci_image ? img.rci_image?.split('/').pop() : img.srci_image?.split('/').pop(),
          url: img.rci_image ? img.rci_image : img.srci_image,
          crewKey: img.rci_crew ? img.rci_crew : img.srci_crew,
          originFileObj: null, // Placeholder, as `originFileObj` is not available in fetched data
      }));   
      setNakwaImgs(nakwaFiles);

      if (data?.tripDetails) {
        console.log("tripDetails", data.tripDetails[0])
        tripForm.setFieldsValue({
          // ...data.tripDetails,
          rvt_depdate: data.tripDetails[0]?.rvt_depdate? dayjs(data.tripDetails[0]?.rvt_depdate) : null,
          datetime: data.tripDetails[0]?.rvt_depdate? dayjs(data.tripDetails[0]?.rvt_depdate).format("DD-MM-YYYY") : null,
          rvt_arrivaldate: data.tripDetails[0]?.rvt_arrivaldate? dayjs(data.tripDetails[0]?.rvt_arrivaldate) : null,
          datetime1: data.tripDetails[0]?.rvt_arrivaldate? dayjs(data.tripDetails[0]?.rvt_arrivaldate).format("DD-MM-YYYY") : null,
          rvt_pcissuedate: data.tripDetails[0]?.rvt_pcissuedate ? dayjs(data.tripDetails[0]?.rvt_pcissuedate) : null,
          datetime2: data.tripDetails[0]?.rvt_pcissuedate ? dayjs(data.tripDetails[0]?.rvt_pcissuedate).format("DD-MM-YYYY") : null,
          rvt_pcdays: data.tripDetails[0]?.rvt_pcdays,
        });
      }
      if (data?.nakwaDetails) {
        nakwaForm.setFieldsValue({
          ...data.nakwaDetails[0],
        });
      }
      console.log("Trip form data: ", tripForm.getFieldsValue())
      if (data?.ownerDetails) {
        setOwnerData(
          data.ownerDetails.map((item, index) => (
          {
            ...item,
            sro_idexpdt: dayjs(item.sro_idexpdt),
            sro_images: item.sro_images[0]?.roi_image ? {
              sroi_image : item.sro_images[0]?.roi_image ? item.sro_images[0]?.roi_image : item.sro_images[0]?.sroi_image,
              sroi_key : item.sro_images[0]?.roi_key ? item.sro_images[0]?.roi_key : item.sro_images[0]?.sroi_key,
              sroi_owner : item.sro_images[0]?.roi_owner ? item.sro_images[0]?.roi_owner : item.sro_images[0]?.sroi_owner,
              sroi_name: item.sro_images[0]?.roi_image?.split('/').pop(),
            } : item.sro_images[0]?.sroi_image ? {
              sroi_image : item.sro_images[0]?.sroi_image,
              sroi_key : item.sro_images[0]?.sroi_key,
              sroi_owner : item.sro_images[0]?.sroi_owner,
              sroi_name: item.sro_images[0]?.sroi_image?.split('/').pop(),
            } : {},
          }))
        );
      }
      if (data?.crewDetails) {
        setCrewData(
          data.crewDetails.map((item) => ({
            ...item,
            src_idexpdt: dayjs(item.src_idexpdt),
            src_images: item.src_images[0]?.srci_image ? {
              srci_image : item.src_images[0]?.srci_image,
              srci_key : item.src_images[0]?.srci_key,
              srci_owner : item.src_images[0]?.srci_owner,
              srci_name: item.src_images[0]?.srci_image?.split('/').pop(),
            } : {},
          }))
        );
      }

      if (data.goodDetails) {
        setGoodsData(
          data.goodDetails.map((item) => ({
            ...item,
            srg_confiscated: item.srg_confiscated ? "Yes" : "No",
          }))
        );
      }
    }
  }, [data]);

  const handleFishingSave = async () => {
    const tripValues = await tripForm.validateFields();

    console.log("tripValues", tripValues)

    const finalData = {
      rvt_rv_key: id,
      rvt_depdate: tripValues.rvt_depdate ? dayjs(tripValues.rvt_depdate) : null,
      rvt_arrivaldate: tripValues.rvt_arrivaldate ? dayjs(tripValues.rvt_arrivaldate) : null,
      // rvt_pcduedate: tripValues.sr_pcduedate,
      rvt_pcdays: tripValues.rvt_pcdays,
      rvt_pcissuedate: tripValues.rvt_pcissuedate ? dayjs(tripValues.rvt_pcissuedate).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ') : null,
      // rvt_rdt: dayjs().format("YYYY-MM-DD"),
      rvt_pcissueloc: location? `${location?.longitude} ${location?.latitude}` : "",
      // status: vesselStatus,
    };
    console.log("final data for saving fishing : \n", finalData)
    const newFinal = {
      data: finalData,
      navigation: router,
    };
    if(vesselStatus==="depature")
    {
      dispatch(saveFishingVessel(newFinal));
    }
    else if(vesselStatus==="return")
    {
      dispatch(saveTripDetailswithReturnDate(newFinal));
    }
    else{
      dispatch(saveFishingVessel(newFinal));
    }
    localStorage.removeItem("vessel");
  };
  
  const handleBack = () => {
    localStorage.removeItem("vessel");
    router.back();
  };

  const handleReset = () => {
    platformForm.setFieldsValue({
      sr_pf_id: init_platform_data.sr_pf_id,
    });
    tripForm.resetFields();
  };

  const handleFormValidate = () => {
    const forms = [tripForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
        handleFishingSave();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [tripForm]
          .flatMap((form) => form.getFieldsError())
          .filter((field) => field.errors.length > 0)[0]?.name[0];

        if (firstInvalidField) {
          const inputElement = document.querySelector(
            `[name="${firstInvalidField}"]`
          );
          inputElement.scrollIntoView({ behavior: "smooth" });
        }
      });
  };


  return (
    <>
      <div>
        <PageHeader
          handleBack={handleBack}
          showButton={false}
          // onNavigate={handleFishingSave}
          // onNavigate={handleFormValidate}
          // btnTitle="Save Report"
          showSearchBox={false}
          // handleReset={handleReset}
          title="Picket Report Fishing Vessels"
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

      <FishingVesselTable
        disabled={true}
        fixedDisabled={true}
        state={"add"}
        vesselForm={vesselForm}
        sreport={true}
        fileList={fileList}
      ></FishingVesselTable>

      {/*----------------------------------- Trip Data -------------------------------------*/}

      <VesselTripPicketForm disabled={tripFormPermissions? true : false} form={tripForm} ></VesselTripPicketForm>

      {/* <Collapse bordered={false}  > */}
      {/* defaultActiveKey={['1']} accordion*/}
        {/*----------------------------------- Nakwa Data -------------------------------------*/}

        <NakwaForm disabled={true} form={nakwaForm}
          hasPicture={true}
          state={"add"}
          fileList={nakwaImgs}
          sreport={true}
          viewOnly={true}>
        </NakwaForm>

        {/*----------------------------------- Owner Data -------------------------------------*/}

        <OwnerTable
          ownerData={ownerData}
          setOwnerData={setOwnerData}
          // showButtons={showButtons}
          sreport={true}
        />

        {/*----------------------------------- Crew Data -------------------------------------*/}

        <CrewTable
          crewData={crewData}
          setCrewData={setCrewData}
          labelConfig="page1"
        />

        {/*----------------------------------- Goods Data -------------------------------------*/}

        <GoodsTable
          goodsData={goodsData}
          setGoodsData={setGoodsData}
          showButtons={showButtons}
          viewOnly={true}
        />
      {/* </Collapse> */}

    </>
  );
}

export default Details;
