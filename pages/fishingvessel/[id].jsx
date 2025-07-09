import React, { useEffect, useState } from "react";
import Heading from "../../src/components/title/Heading";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { saveFishingVessel, deleteNakwaCrewImage, deleteOwnerImage } from "../../src/redux/thunks/fishingVesselData";
import dayjs from "dayjs";
import { Checkbox, Modal } from "antd";
import OwnerTable from "../../src/components/specialTables/OwnerTable";
import CrewTable from "../../src/components/specialTables/CrewTable";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import axios from "axios";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useForm } from "antd/lib/form/Form";
import FishingVesselTable from "../../src/components/table/FishingVesselTable";
import OwnPlatformForm from "../../src/components/stackedForm/OwnPlatformForm";
import FishingTripForm from "../../src/components/stackedForm/FishingTripForm";
import { DMStodecimal } from "../../src/helper/position";
import NakwaForm from "../../src/components/stackedForm/NakwaForm";
import urlToFile from "../../src/helper/urlToImgFileCovertor";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import WeatherForm from "../../src/components/stackedForm/WeatherForm";

function Details() {
  const [showButtons, setShowButtons] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const parsedVesselData = JSON.parse(localStorage.getItem("vessel"));
  const init_platform_data = { sr_pf_id: localStorage.getItem("u_pf_id") };
  const [coiCheck, setCoiCheck] = useState(false)
  const [data, setData] = useState(null);
  const [hasPicture, setHasPicture] = useState(false);
  const [vesselForm] = useForm();
  const [platformForm] = useForm();
  const [weatherForm] = useForm();
  const [tripForm] = useForm();
  const [nakwaForm] = useForm();
  const [coiForm] = useForm();

  const [ownerData, setOwnerData] = useState([]);
  const [crewData, setCrewData] = useState([]);
  const [goodsData, setGoodsData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [nakwaImgs, setNakwaImgs] = useState([]);
  const [ownerImgs, setOwnerImgs] = useState([]);
  const [tempRemovedOwnerFiles, setTempRemovedOwnerFiles] = useState([]);
  const [tempRemovedCrewFiles, setTempRemovedCrewFiles] = useState([]);

  const fetchFishingID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing/rvkey/${id}`
      );
      if (response.status === 200) setData(response.data);
    } catch (error) {
      console.log(error);
      // router.push("/404");
    }
  };

  useEffect(() => {
    if (!data) {
      fetchFishingID();
    }
  }, []);

  useEffect(() => {
    vesselForm.setFieldsValue({
      ...parsedVesselData,
    });
    platformForm.setFieldsValue({
      sr_pf_id: init_platform_data.sr_pf_id,
      
    });
    // Flatten the array of image objects
    const ownerFiles = data?.ownerDetails.reduce((owner, item) => {
      console.log("Setting owner images", owner,item)
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
    console.log(ownerFiles)
    setOwnerImgs(ownerFiles);

  }, [data]);


  useEffect(() => {
    if (data) {
      // Convert image data to fileList format
      // const imageFiles = parsedVesselData?.rv_images?.map(img => (
      const imageFiles = data?.rvessel?.rv_images?.map(img => (
        console.log("imageFiles", img),
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
      const nakwaFiles = data?.nakwaDetails?.src_images?.map(img => (
        console.log("nakwaFiles", img),
        {
          rci_remarks: img.rci_remarks ? img.rci_remarks : img.srci_remarks,
          uid: img.rci_key ? img.rci_key : img.srci_key,
          name: img.rci_image ? img.rci_image?.split('/').pop() : img.srci_image?.split('/').pop(),
          url: img.rci_image ? img.rci_image : img.srci_image,
          crewKey: img.rci_crew ? img.rci_crew : img.srci_crew,
          originFileObj: null, // Placeholder, as `originFileObj` is not available in fetched data
      }));   
      setNakwaImgs(nakwaFiles);

      sr_coi: data.sr_coi;
      if (data.sr_rv_key) {
        vesselForm.setFieldsValue({
          ...data.sr_rv_key,
        });
      }
      if (data?.tripDetails) {
        tripForm.setFieldsValue({
          ...data.tripDetails,
          sr_movement: data.sr_movement,
          sr_depdt: dayjs(data.tripDetails.sr_depdt),
          datetime: dayjs(data.tripDetails.sr_depdt).format("YYYY-MM-DD"),
          sr_pcissuedt: dayjs(data.tripDetails.sr_pcissuedt),
          datetime1: dayjs(data.tripDetails.sr_pcissuedt).format("YYYY-MM-DD"),
        });
      }
      if (data?.nakwaDetails) {
        nakwaForm.setFieldsValue({
          ...data.nakwaDetails,
        });
      }

      console.log("Nakwa form data: ", nakwaForm.getFieldsValue())
      if (data?.ownerDetails) {
        console.log(ownerImgs)
        setOwnerData(
          data.ownerDetails.map((item, index) => (
          console.log(item, index),
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
      console.log("Owner form data: ", ownerData)
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

  function prepareFormData(dataFromDb, name) {
    console.log("urltofile");
    return urlToFile(dataFromDb, `${name}`, "image/jpeg");
  }

  const handleFishingSave = async () => {
    const validatedValues = await platformForm.validateFields();
    const weatherFormData = await weatherForm.validateFields();
    const tripValues = await tripForm.validateFields();
    const nakwaValues = await nakwaForm.validateFields();

    console.log("fishing validatedValues", validatedValues, "\nnakwaValues", nakwaValues, "\nownerData", ownerData)

    // Transforming nakwaImgs to match the required format
    const transformedNakwaImages = nakwaValues?.src_images.map((file, index) => (
      // console.log("file", file, "\nremarks nakwa: ", nakwaValues[`src_images[${index}]rci_remarks`]),
      {
        srci_image: file.originFileObj? file.originFileObj : file.url,
        srci_name: file.name? file.name : "",
        srci_remarks: nakwaValues[`src_images[${index}]rci_remarks`] ? 
        nakwaValues[`src_images[${index}]rci_remarks`] : "",
    }));

    console.log("nakwa", nakwaValues, "\ntransformed nakwa images", transformedNakwaImages, "\nowner", ownerData, "\nCrewData", crewData, weatherFormData)
    const NakwaImgData = new FormData()
    const CrewImgData = new FormData()    
    const OwnerImgData = new FormData();

    //Maps to store images and corresponding keys temporarily
    const ownerImagesMap = new Map();
    const crewImagesMap = new Map();

    async function processImages() {
      let mainIndex = 0;
      let imgIndex = 0;
    
      for (const img of transformedNakwaImages) { 
        if (typeof img.srci_image === 'string' && img.srci_image.includes("http")) {
          try {
            const image = await prepareFormData(img.srci_image, img.srci_name);
            NakwaImgData.append(`srci_image[${mainIndex}]`, image);
            NakwaImgData.append(`srci_remarks[${mainIndex}]`, img.srci_remarks);
          } catch (error) {
            console.error("Error processing image:", error);
            showToastError(`Error processing image. ${error}`);
          }
        } else {
          NakwaImgData.append(`srci_image[${mainIndex}]`, img.srci_image);
          NakwaImgData.append(`srci_remarks[${mainIndex}]`, img.srci_remarks);
        }
        mainIndex++;
      }

      for (const [index, crew] of crewData.entries()) {
        console.log(index,crew)
        if (crew.src_images && crew.src_images.srci_image) {
          let srci_image = crew.src_images.srci_image;
         
          if (typeof srci_image === 'string' && srci_image.includes("http")) {
            try {
              const image = await prepareFormData(srci_image, crew.src_images.srci_name);
              const imgObj = {
                srci_image: image, 
                srci_key: crew.src_images.srci_key,
                srci_name: crew.src_images.srci_name
              }
              crewImagesMap.set(index, imgObj);
            } catch (error) {
              console.error("Error processing image:", error);
              showToastError(`Error processing image. ${error}`);
            }
          } else {
            const imgObj = {srci_image: srci_image}
            // If the image is not a URL, store it directly
            crewImagesMap.set(index, imgObj);
          }}
        else {
          console.log("Error processing crew image. Reupload image and save.")
        }
    }

      for (const [index, owner] of ownerData.entries()) {
        console.log(index, owner)
        if (owner.sro_images && owner.sro_images.sroi_image) {
          let sroi_image = owner.sro_images.sroi_image;
    
          if (typeof sroi_image === 'string' && sroi_image.includes("http")) {           
            console.log("converting image", sroi_image)
            // If the image is a URL, process it
            try {
              const image = await prepareFormData(sroi_image, owner.sro_images.sroi_name);
              const imgObj = {
                sroi_image: image, 
                sroi_key: owner.sro_images.sroi_key,
                sroi_name: owner.sro_images.sroi_name
              }
              ownerImagesMap.set(index, imgObj);
            } catch (error) {
              console.error("Error processing image:", error);
              showToastError(`Error processing image. ${error}`);
            }
          } else {
            const imgObj = {sroi_image: sroi_image}
            // If the image is not a URL, store it directly
            ownerImagesMap.set(index, imgObj);
          }
        }
        else {
          console.log("Error processing owner image. Reupload image and save.")
        }
      }
      console.log("All images processed");
      // Now you can send NakwaImgData to the server
    }
    
    // Call the function to process images
    processImages();

    // Log the contents of FormData
    // for (let pair of OwnerImgData.entries()) {
    //   console.log(pair[0] + ':', pair[1]);
    // }

    // Log the contents of FormData
    // for (let pair of NakwaImgData.entries()) {
    //   console.log(pair[0] + ':', pair[1]);
    // }

    const coordinates = [
      validatedValues.sr_position.lng,
      validatedValues.sr_position.lat,
    ];
    
    // Remove src_images and remarks fields from nakwaDetails
    const finalNakwaValues = { ...nakwaValues };
    delete finalNakwaValues.src_images;
    Object.keys(finalNakwaValues).forEach((key) => {
      if (key.startsWith('src_images[')) {
        delete finalNakwaValues[key];
      }
    });
    const isObjectEmpty = (obj) =>
      Object.values(obj).every(
        (val) => val === undefined || val === null || val === ''
      );

    // Clean the nakwaDetails array
    const nakwaDetails = isObjectEmpty(finalNakwaValues)
      ? [] : [finalNakwaValues];

    // Remove sro_images and remarks fields from ownerDetails
    const finalOwnerValues = ownerData.map((owner) => {
      const { sro_images, sro_key, ...cleanedOwner } = owner;
      return cleanedOwner;
      });

    // Remove srci_images and remarks fields from crewDetails
    const finalCrewValues = crewData.map((crew) => {
      const { src_images, src_key, ...cleanedCrew } = crew;
      return cleanedCrew;
      });

    const finalData = {
      ...validatedValues,
      sr_position: {
        type: "Point",
        coordinates: coordinates,
        //coordinates: DMStodecimal(validatedValues.sr_position.dms),
      },
      sr_coi: coiCheck,
      sr_rv_key: id,
      sr_movement: tripForm.getFieldValue("sr_movement"),

      // nakwaDetails: [{ ...finalNakwaValues }],
      nakwaDetails,
      goodDetails: goodsData.map((item) => ({
        ...item,
        srg_confiscated: item.srg_confiscated === "Yes" ? true : false,
      })),
      ownerDetails: finalOwnerValues.map((item) => ({
        ...item,
        sro_idexpdt: dayjs(item.sro_idexpdt).format("YYYY-MM-DD"),
      })),
      crewDetails: finalCrewValues.map((item) => ({
        ...item,
        src_idexpdt: dayjs(item.src_idexpdt).format("YYYY-MM-DD"),
      })),
      tripDetails: {
        sr_depdt: dayjs(tripValues.sr_depdt).format("YYYY-MM-DD"),
        sr_depjetty: tripValues.sr_depjetty,
        sr_pc: tripValues.sr_pc,
        sr_pcdays: tripValues.sr_pcdays,
        sr_pcissuedt: dayjs(tripValues.sr_pcissuedt).format("YYYY-MM-DD"),
      },
      weather: {...weatherFormData}
    };
    console.log("final data for saving fishing : \n", finalData)
    const newFinal = {
      data: finalData,
      nakwaFormData: NakwaImgData,
      ownerFormData: OwnerImgData,
      crewFormData: CrewImgData,
      ownerImagesMap: ownerImagesMap,
      crewImagesMap: crewImagesMap,
      navigation: router,
    };
    dispatch(saveFishingVessel(newFinal));
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
    nakwaForm.resetFields();
    setCrewData([]);
    setGoodsData([]);
    setOwnerData([]);
  };

  const handleFormValidate = () => {
    const forms = [platformForm, tripForm, nakwaForm, weatherForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
        handleFishingSave();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [platformForm, tripForm, nakwaForm, weatherForm]
          .flatMap((form) => form.getFieldsError())
          .filter((field) => field.errors.length > 0)[0]?.name[0];

        if (firstInvalidField) {
          const inputElement = document.querySelector(
            `[name="${firstInvalidField}"]`
          );
          console.log(firstInvalidField, inputElement)
          if(inputElement){inputElement?.scrollIntoView({ behavior: "smooth" });  showToastError(`Enter required fields!`);}
          else{
            showToastError(`Enter required fields!`);
          }
        }
      });
  };

  
  // Handle nakwa img file addition
  const AddNakwaImg = (newFileList) => {
    console.log("adding nakwa image")
    setNakwaImgs(newFileList);
    console.log(nakwaImgs)
  };

  // Handle nakwa img file removal
  const RemoveNakwaImg = (file) => {
    // If the user confirms, update the state to remove the image at the specified index
    const newFileList = nakwaImgs.filter((item) => item.uid !== file.uid);
    setNakwaImgs(newFileList);
    // if(file.uid && file.crewKey)
    // {
    //     dispatch(deleteNakwaCrewImage(file.uid));
    // }
  };

  const DeleteOwnerImage = (imgKey) => {
    console.log(imgKey)
    // if(imgKey)
    // {
    //   dispatch(deleteOwnerImage(imgKey));
    // }
  }

  const DeleteCrewImage = (imgKey) => {
    console.log(imgKey)
    if(imgKey)
    {
      dispatch(deleteNakwaCrewImage(imgKey));
    }
  }

  const onChange = (e) => {
    const checked = e.target.checked;
    console.log(`checked = ${e.target.checked}`);
    setCoiCheck(checked)
  };

  return (
    <>
      <div>
        <PageHeader
          handleBack={handleBack}
          showButton={true}
          // onNavigate={handleFishingSave}
          onNavigate={handleFormValidate}
          btnTitle="Save Report"
          showSearchBox={false}
          handleReset={handleReset}
          title="Special Report Fishing Vessels"
        />
      </div>

      {/*----------------------------------- Vessel Data -------------------------------------*/}

      <div className="inline-flex">
        <Heading
          className=" whitespace-nowrap ml-5 flex justify-start "
          level={4}
          text="Vessel Data"
        />
        <Checkbox className=" whitespace-nowrap ml-8 mb-3 flex justify-end" style={{paddingRight: "1rem", marginLeft: "420px"}}  onChange={onChange}>
          <Heading
            className=" whitespace-nowrap ml-3 flex justify-start "
            level={5}
            text="COI"
          />
        </Checkbox>
      </div>

      <FishingVesselTable
        disabled={true}
        fixedDisabled={true}
        state={"add"}
        vesselForm={vesselForm}
        sreport={true}
        fileList={fileList}
      ></FishingVesselTable>

      {/*----------------------------------- Platform Data -------------------------------------*/}

      <OwnPlatformForm
        disabled={false}
        form={platformForm}
        reportKeys={{
          dtg: "sr_dtg",
          pf_id: "sr_pf_id",
          position: "sr_position",
          lat: "sr_position.lat",
          lng: "sr_position.lng",
          fuel: "sr_fuelrem",
          info: "sr_info",
          patrolType: "sr_patroltype",
          action: "sr_action",
          frshwatr: "sr_freshwater",
        }}
      />
      {/*----------------------------------- WeatherForm Data -------------------------------------*/}
      <WeatherForm 
        disabled={false}
        form={weatherForm}/>

      {/*----------------------------------- Trip Data -------------------------------------*/}

      <FishingTripForm disabled={false} form={tripForm}></FishingTripForm>

      {/* <FishingTripTable
        tripData={tripData}
        setTripData={setTripData}
        tripDataState={{
          tripDataEntered: tripDataEntered,
          setTripDataEntered: setTripDataEntered,
        }}
        // showButtons={showButtons}
      /> */}

      {/*----------------------------------- Nakwa Data -------------------------------------*/}

      <NakwaForm disabled={false} form={nakwaForm}
        hasPicture={true}
        state={"add"}
        handleImageAdd={AddNakwaImg}
        handleImageRemove={RemoveNakwaImg}
        fileList={nakwaImgs}
        sreport={true}>
      </NakwaForm>

      {/* <NakwaTable
        nakwaData={nakwaData}
        setNakwaData={setNakwaData}
        nakwaDataState={{
          nakwaDataEntered: nakwaDataEntered,
          setNakwaDataEntered: setNakwaDataEntered,
        }}
      /> */}

      {/*----------------------------------- Owner Data -------------------------------------*/}

      <OwnerTable
        ownerData={ownerData}
        setOwnerData={setOwnerData}
        showButtons={showButtons}
        sreport={true}
        onRemove={DeleteOwnerImage}
        tempDeletedImages={tempRemovedOwnerFiles}
        setTempDeletedImages={setTempRemovedOwnerFiles}
      />

      {/*----------------------------------- Crew Data -------------------------------------*/}

      <CrewTable
        crewData={crewData}
        setCrewData={setCrewData}
        showButtons={showButtons}
        labelConfig="page1"
        onRemove={DeleteCrewImage}
        tempDeletedImages={tempRemovedCrewFiles}
        setTempDeletedImages={setTempRemovedCrewFiles}
      />

      {/*----------------------------------- Goods Data -------------------------------------*/}

      <GoodsTable
        goodsData={goodsData}
        setGoodsData={setGoodsData}
        showButtons={showButtons}
      />
    </>
  );
}

export default Details;
