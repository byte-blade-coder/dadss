import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { MerchantDetailColumns, RegVesselColumn } from "../../src/helper/DataColumns";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import { useDispatch, useSelector } from "react-redux";
import { updateFishingVesselReport, deleteNakwaCrewImage, deleteOwnerImage } from "../../src/redux/thunks/fishingVesselData";
import TableItemRenderer from "../../src/components/table/RenderTable";
import Heading from "../../src/components/title/Heading";
import { Checkbox } from "antd";
import { DMStodecimal, coordinatesToDMS, coordinatesToDMS1, decimalToDMS, positiontoDMS } from "../../src/helper/position";
import dayjs from "dayjs";
import { fetchFishingById } from "../../src/redux/thunks/fishingVesselData";
import { useForm } from "antd/lib/form/Form";
import FishingVesselTable from "../../src/components/table/FishingVesselTable";
import OwnPlatformForm from "../../src/components/stackedForm/OwnPlatformForm";
import axios from "axios";
import { hasPermission } from "../../src/helper/permission";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import CrewTable from "../../src/components/specialTables/CrewTable";
import OwnerTable from "../../src/components/specialTables/OwnerTable";
import FishingTripForm from "../../src/components/stackedForm/FishingTripForm";
import NakwaForm from "../../src/components/stackedForm/NakwaForm";
import urlToFile from "../../src/helper/urlToImgFileCovertor";
import axiosInstance from "../../src/axios";
import WeatherForm from "../../src/components/stackedForm/WeatherForm";

function Specialreportdetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [coiCheck, setCoiCheck] = useState()
  const { sr_key } = router.query;

  const [isEditing, setIsEditing] = useState(false);
  const [hasPicture, setHasPicture] = useState(false);
  const changePermission = hasPermission('change_sreports');
  // const deletePermision = hasPermission('delete_sreports');
  const deletePermision = false;

  const [platformForm] = useForm();    
  const [weatherForm] = useForm();
  const [vesselForm] = useForm();
  const [tripForm] = useForm();
  const [nakwaForm] = useForm();
 // const [coiForm] = useForm();

  const [ownerData, setOwnerData] = useState([]);
  const [crewData, setCrewData] = useState([]);
  const [goodsData, setGoodsData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [nakwaImgs, setNakwaImgs] = useState([]);
  const [ownerImgs, setOwnerImgs] = useState([]);
  const [crewImgs, setCrewImgs] = useState([]);
  const [tempRemovedNakwaFiles, setTempRemovedNakwaFiles] = useState([]);
  const [tempRemovedOwnerFiles, setTempRemovedOwnerFiles] = useState([]);
  const [tempRemovedCrewFiles, setTempRemovedCrewFiles] = useState([]);

  const fetchFishingID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing/${sr_key}`
      );
      if (response.status === 200)
        setData(response.data);
    } catch (error) {
      console.log(error);
    }
    // dispatch(fetchFishingById(sr_key))
  }

  useEffect(() => {
    if (!data) {
      fetchFishingID();
    }
  }, []);

  useEffect(() => {
    
    if (data) {
      // Convert image data to fileList format
      const imageFiles = data?.rvessel?.rv_images?.map(img => (
        {
          ri_remarks: img.ri_remarks==="undefined" ? "" : img.ri_remarks,
          uid: img.ri_key,
          name: img.ri_image?.split('/').pop(),
          url: img.ri_image,
          status: 'done',
          originFileObj: null, // Placeholder, as `originFileObj` is not available in fetched data
      }));
      setFileList(imageFiles);

      const nakwaFiles = data?.nakwaDetails[0]?.src_images?.map(img => (
        {
          srci_remarks: img.srci_remarks,
          uid: img.srci_key,
          name: img.srci_image?.split('/').pop(),
          url: img.srci_image,
          status: 'done',
          crewKey: img.srci_crew,
          originFileObj: null, // Placeholder, as `originFileObj` is not available in fetched data
      }));   
      setNakwaImgs(nakwaFiles);

      onChange(data.sr_coi)
      // coiForm.setFieldValue({
      //   sr_coi: data.sr_coi,
      // })
      setCoiCheck(data.sr_coi);

      platformForm.setFieldsValue({
        sr_key: data.sr_key,
        sr_pf_id: data.sr_pf_id,
        sr_patroltype: data.sr_patroltype,
        sr_fuelrem: data.sr_fuelrem,
        sr_action: data.sr_action,
        sr_info: data.sr_info,
        sr_position: {
          ...data.sr_position,
          lat: data.sr_position.coordinates[1],
          lng: data.sr_position.coordinates[0], 
          dms: coordinatesToDMS1(data.sr_position.coordinates),
          string: [positiontoDMS(coordinatesToDMS1(data.sr_position.coordinates)[0]), positiontoDMS(coordinatesToDMS1(data.sr_position.coordinates)[1])]
        },
        sr_dtg: dayjs(data.sr_dtg),
        datetime: dayjs(data.sr_dtg).format("YYYY-MM-DD HH:mm:ss"),
      })
      if (data.rvessel) {
        vesselForm.setFieldsValue({
          ...data.rvessel,
        });
      }
      if (data?.tripDetails) {
        tripForm.setFieldsValue({
          ...data.tripDetails,
          sr_movement: data.sr_movement,
          sr_depdt: data.tripDetails.sr_depdt ? dayjs(data.tripDetails.sr_depdt) : null,
          datetime: data.tripDetails.sr_depdt ? dayjs(data.tripDetails.sr_depdt).format("YYYY-MM-DD") : null,
          sr_pcissuedt: data.tripDetails.sr_pcissuedt ? dayjs(data.tripDetails.sr_pcissuedt) : null,
          datetime1: data.tripDetails.sr_pcissuedt ? dayjs(data.tripDetails.sr_pcissuedt).format("YYYY-MM-DD") : null,
        });
      }
      if (data?.nakwaDetails) {
        nakwaForm.setFieldsValue({
          ...data.nakwaDetails[0],
          src_key: data.nakwaDetails[0]?.src_key,
          src_images: nakwaFiles,
        })
      }
      if (data?.ownerDetails) {
        setOwnerData(
          data.ownerDetails.map((item) => ({
            ...item,
            sro_idexpdt: dayjs(item.sro_idexpdt),
            sro_images:  item.sro_images[0]?.sroi_image ? {
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
            src_images:  item.src_images[0]?.srci_image ? {
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
      weatherForm.setFieldsValue({...data.weather, 
        w_position: {
          ...data?.weather?.w_position,
          lat: data?.weather?.w_position.coordinates[1],
          lng: data?.weather?.w_position.coordinates[0], 
          // dms: coordinatesToDMS1(data?.weather?.w_position.coordinates),
          // string: [positiontoDMS(coordinatesToDMS1(data?.weather?.w_position.coordinates)[0]), positiontoDMS(coordinatesToDMS1(data?.weather?.w_position.coordinates)[1])]
        },
        // sr_w_key: data.sr_w_key
      })
    }

  }, [data]);

  function prepareFormData(dataFromDb, name) {
    return urlToFile(dataFromDb, `${name}`, "image/jpeg");
  }

  const handleUpdate = async () => {
    const validatedValues = await platformForm.validateFields();
    const weatherFormData = await weatherForm.validateFields();
    const tripValues = await tripForm.validateFields();
    const nakwaValues = await nakwaForm.validateFields();

      if(tempRemovedNakwaFiles)
      { 
        // Dispatch API call to delete images only when "Save Changes" is clicked
        tempRemovedNakwaFiles?.forEach((file) => {
          if (file.uid && file.crewKey) {
            dispatch(deleteNakwaCrewImage(file.uid));
          }
        });
    
        // Clear the tempRemovedFiles array after update
        setTempRemovedNakwaFiles([]);
      }

    if(tempRemovedOwnerFiles)
    { 
      // Dispatch delete action for all temporarily deleted images
      tempRemovedOwnerFiles.forEach(({ key }) => {
        if (key) {
          DeleteOwnerImage(key);
        }
      });

      setTempRemovedOwnerFiles([]);
    }

    if(tempRemovedCrewFiles)
      { 
        // Dispatch delete action for all temporarily deleted images
        tempRemovedCrewFiles.forEach(({ key }) => {
          if (key) {
            DeleteCrewImage(key);
          }
        });
  
        setTempRemovedCrewFiles([]);
      }

    const coordinates = [
      validatedValues.sr_position.lng,
      validatedValues.sr_position.lat,
      //validatedValues.ssr_position.coordinates[1],
      //validatedValues.ssr_position.coordinates[0], 
    ];
        
    const initialNakwaRemarksMap = new Map();
    nakwaImgs?.forEach(img => {
      console.log(img)
      initialNakwaRemarksMap.set(img.uid, img.srci_remarks);
    });

    // Transforming nakwaImgs to match the required format
    const transformedNakwaImages = nakwaValues?.src_images?.map((file, index) => (
      {
        srci_image: file.originFileObj? file.originFileObj : file.url,
        srci_name: file.name? file.name : "",
        srci_remarks: nakwaValues[`src_images[${index}]srci_remarks`] ? 
        nakwaValues[`src_images[${index}]srci_remarks`] : "",
        srci_key: file.uid,
    }));

    const NakwaImgData = new FormData()
    const CrewImgData = new FormData()    
    const OwnerImgData = new FormData();

    //Maps to store images and corresponding keys temporarily
    const nakwaImagesMap = new Map();
    const ownerImagesMap = new Map();
    const crewImagesMap = new Map();

    async function processImages() {
      let nakwaIndex = 0;
      let newNakwaIndex = 0;

    if(transformedNakwaImages)
    {
        for (const img of transformedNakwaImages) {
        const previousRemark = initialNakwaRemarksMap?.get(img.srci_key); // Get the initial remark
        const isRemarkUpdated = img.srci_remarks !== previousRemark; // Check if it changed
        // console.log(img, initialNakwaRemarksMap, previousRemark, isRemarkUpdated)

        if (typeof img.srci_image === 'string' && img.srci_image.includes("http")) {
          if(isRemarkUpdated)
          {
            try {
              const image = await prepareFormData(img.srci_image, img.srci_name);
              const imgObj = {
                srci_image: image, 
                srci_key: img.srci_key,
                srci_remarks: img.srci_remarks,
                srci_name: img.srci_name
              }
              // console.log("set")
              nakwaImagesMap.set(nakwaIndex, imgObj);
              // NakwaImgData.append(`srci_image[${mainIndex}]`, image);
              // NakwaImgData.append(`srci_remarks[${mainIndex}]`, img.srci_remarks);
            } catch (error) {
              console.error("Error processing image:", error);
              showToastError(`Error processing image. ${error}`);
            }
          }
          nakwaIndex++;
        } else {
          NakwaImgData.append(`srci_image[${newNakwaIndex}]`, img.srci_image);
          NakwaImgData.append(`srci_remarks[${newNakwaIndex}]`, img.srci_remarks);
          newNakwaIndex++;
        }
      }
    }

      for (const [index, crew] of crewData.entries()) {
        console.log(crew)
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
            console.log("Error processing image. Reupload image and save.")
          }
      }

      for (const [index, owner] of ownerData.entries()) {
        
        if (owner.sro_images && owner.sro_images.sroi_image) {
          let sroi_image = owner.sro_images.sroi_image;

          if (typeof sroi_image === 'string' && sroi_image.includes("http")) {           
            // console.log("converting image", sroi_image)
            // If the image is a URL, process it
            try {
              const image = await prepareFormData(sroi_image, owner.sro_images.sroi_image);
              const imgObj = {
                sroi_image: image, 
                sroi_key: owner.sro_images.sroi_key,
                sroi_name: owner.sro_images.sroi_image,
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
    await processImages();

    // Remove src_images and remarks fields from nakwaDetails
    const finalNakwaValues = { ...nakwaValues, 
      src_key: data.nakwaDetails[0]?.src_key };
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
      ? []
  : [{...finalNakwaValues}];

    // Remove sro_images and remarks fields from ownerDetails
    const finalOwnerValues = ownerData.map((owner) => {
      const { sro_images, ...cleanedOwner } = owner;
      return cleanedOwner;
      });

    // Remove srci_images and remarks fields from crewDetails
    const finalCrewValues = crewData.map((crew) => {
      const { src_images, ...cleanedCrew } = crew;
      return cleanedCrew;
      });
  
    const editedData = {
      // ...coiVal,
      sr_coi: coiCheck,
      ...validatedValues,
      sr_position: {
        type: "Point",
        coordinates: coordinates,
        //coordinates: DMStodecimal(validatedValues.sr_position.dms),
      },
      sr_rv_key: data.sr_rv_key,
      sr_movement: tripForm.getFieldValue('sr_movement'),
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
      // sr_w_key: data.sr_w_key,
      weather: {
        ...weatherFormData
      }
    }

    const finalData = {
      editedData,
      sr_key: data.sr_key,
      nakwaFormData: NakwaImgData,
      nakwaImagesMap: nakwaImagesMap,
      ownerFormData: OwnerImgData,
      ownerImagesMap: ownerImagesMap,
      crewFormData: CrewImgData,
      crewImagesMap: crewImagesMap,
      navigation: router,
    }
    console.log("Edited : " , editedData)
    dispatch(updateFishingVesselReport(finalData));

  };

  const handleDelete = async () => {
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing/${data.sr_key}`
      );
      // Check if the response status is either 200 or 201
      if (macroResponse.status === 200 || macroResponse.status === 204) {
        router.push("/fishingvessel");
        showToastSuccess(`Report Deleted Successfully`);

      } else {
        showToastError("Report Deletion failed. Please try again.");
      }
    } catch (error) {
      showToastError("Report Deletion failed. Please try again.");
    }

  };

  const handleFormValidate = () => {
    const forms = [platformForm , tripForm, nakwaForm, weatherForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
      handleUpdate();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [platformForm, tripForm, nakwaForm, weatherForm]
          .flatMap((form) => form.getFieldsError())
          .filter((field) => field.errors.length > 0)[0]?.name[0];

            // showToastError(`"${firstInvalidField}" field is required!`);

        // Scroll to the field if it exists in the DOM
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

  // Handle nakwa img file addition
  const AddNakwaImg = (newFileList) => {
    setNakwaImgs(newFileList);
  };

  // Handle nakwa img file removal
  const RemoveNakwaImg = (file) => {
    // If the user confirms, update the state to remove the image at the specified index
    const newFileList = nakwaImgs.filter((item) => item.uid !== file.uid);
    setNakwaImgs(newFileList);
    
    setTempRemovedNakwaFiles((prev) => [...prev, file]);
    // if(file.uid && file.crewKey)
    // {
    //    dispatch(deleteNakwaCrewImage(file.uid));
    // }
  };
  
  const DeleteOwnerImage = (imgKey) => {
    // console.log(imgKey)
    if(imgKey)
    {
      dispatch(deleteOwnerImage(imgKey));
    }
  }
 
  const DeleteCrewImage = (imgKey) => {
    // console.log(imgKey)
    if(imgKey)
    {
      dispatch(deleteNakwaCrewImage(imgKey));
    }
  }

  const onChange = (e) => {
    const checked = e.target ? e.target?.checked : e;
    setCoiCheck(checked)
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
          title="Special Report Fishing Vessels"
        />

        <div>
          <Heading
            className=" whitespace-nowrap ml-5 flex justify-start "
            level={4}
            text="Vessel Data"
          />
          <Checkbox className=" whitespace-nowrap flex justify-end"  onChange={onChange} 
          style={{marginTop: "-2.1rem", paddingRight: "1rem"}} checked={coiCheck} disabled={!isEditing}>
            {/* Is COI ?*/}
            <Heading
              className=" whitespace-nowrap mr-3 flex justify-start "
              level={5}
              text="COI"
            />
          </Checkbox>
        </div>
        <FishingVesselTable
          disabled={true}
          vesselForm={vesselForm}
          sreport={true}
          fileList={fileList}
        >
        </FishingVesselTable>

        <OwnPlatformForm
          disabled={!isEditing}
          form={platformForm}
          reportKeys={{
            dtg: "sr_dtg",
            pf_id: "sr_pf_id",
            position: "sr_position",
            fuel: "sr_fuelrem",
            info: "sr_info",
            patrolType: "sr_patroltype",
            action: "sr_action",
            frshwatr: "sr_freshwater",
          }}
        />

        <WeatherForm 
        disabled={!isEditing}
        form={weatherForm}/>

        <FishingTripForm
          disabled={!isEditing}
          form={tripForm}
        >
        </FishingTripForm>

        <NakwaForm
          disabled={!isEditing}
          form={nakwaForm}
          hasPicture={true}
          handleImageAdd={AddNakwaImg}
          handleImageRemove={RemoveNakwaImg}
          fileList={nakwaImgs}
          sreport={true}
          state="edit"
        ></NakwaForm>

        <OwnerTable
          ownerData={ownerData}
          setOwnerData={setOwnerData}
          showButtons={isEditing}
          sreport={true}
          onRemove={DeleteOwnerImage}
          tempDeletedImages={tempRemovedOwnerFiles}
          setTempDeletedImages={setTempRemovedOwnerFiles}
          // state="edit"
        />

        <CrewTable
          crewData={crewData}
          setCrewData={setCrewData}
          showButtons={isEditing}
          labelConfig="page1"
          onRemove={DeleteCrewImage}
          tempDeletedImages={tempRemovedCrewFiles}
          setTempDeletedImages={setTempRemovedCrewFiles}
        />

        <GoodsTable
          goodsData={goodsData}
          setGoodsData={setGoodsData}
          showButtons={isEditing}
        />

      </div>
    </>
  );
}

export default Specialreportdetails;
