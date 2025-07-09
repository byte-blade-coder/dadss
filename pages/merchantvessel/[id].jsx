import { Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import Heading from "../../src/components/title/Heading";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { saveMerchantVessel } from "../../src/redux/thunks/merchantVesselData";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { Checkbox } from "antd";
import MerchantTripTable from "../../src/components/merchantSpecialTable/merchantTripTable";
import axios from "axios";
import { MerchantDetailColumns } from "../../src/helper/DataColumns";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import PageHeader from "../../src/components/pageheader/pageHeader";
import AntdTable from "../../src/components/table/AntdTable";
import OwnPlatformForm from "../../src/components/stackedForm/OwnPlatformForm";
import { useForm } from "antd/lib/form/Form";
import MerchantVesselTable from "../../src/components/table/MerchantVesselTable";
import MerchantTripForm from "../../src/components/stackedForm/MerchantTripForm";
import { DMStodecimal } from "../../src/helper/position";
import { showToastError } from "../../src/helper/MyToast";
import WeatherForm from "../../src/components/stackedForm/WeatherForm";

function Details() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const parsedVesselData = JSON.parse(localStorage.getItem('mer_vessel'));
  const init_platform_data = { msr_pf_id: localStorage.getItem("u_pf_id") };
  const [coiCheck, setCoiCheck] = useState(false)
  const [goodsData, setGoodsData] = useState([]);
  const [platformForm] = useForm();
  const [weatherForm] = useForm();
  const [merchantForm] = useForm();
  const [tripForm] = useForm();
  const [fileList, setFileList] = useState([]);

  const fetchMerchantID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant/mv_key/${id}`
      );
      if (response.status === 200)
        {
          setData(response.data);
        }
    } catch (error) {
      router.push("/404");
    }
  }

  useEffect(() => {
    if (!data) {
      fetchMerchantID();
    }
  }, []);


  // Table columns for displaying merchant vessel details
  const vesselcolumns = [...MerchantDetailColumns];

  // Function to handle saving merchant report
  const handleMerchantSave = async () => {
    const platformData = await platformForm.validateFields();
    const tripData = await tripForm.validateFields();
    const weatherFormData = await weatherForm.validateFields();

    const coordinates = [
      platformData.msr_position.lng,
      platformData.msr_position.lat,
      //platformData.msr_position.coordinates[1],
      //platformData.msr_position.coordinates[0], 
    ];

    const finalData = {
      ...platformData,
      msr_mv_key: id,
      msr_movement: tripData.msr_movement,
      //The toISOString() method is then called on the msr_dtg object to convert it into a string in the ISO 8601 format.
      msr_dtg: platformData.msr_dtg.toISOString(),
      msr_position: {
        coordinates: coordinates,
        //coordinates: DMStodecimal(platformData.msr_position.dms),
        type: "Point",
      },
      msr_coi: coiCheck,

      //good details data
      goodDetails: goodsData.map((item) => ({
        ...item,
        // If msrg_confiscated is equal to the string "Yes," it sets msrg_confiscated to true; otherwise, it sets it to false.
        msrg_confiscated: item.msrg_confiscated === "Yes" ? true : false,
      })),

      //trip details data
      tripDetails: {
        msr2_lpoc: tripData.msr2_lpoc,
        msr2_lpocdtg: dayjs(tripData.msr2_lpocdtg).format("YYYY-MM-DD"),
        msr2_npoc: tripData.msr2_npoc,
        msr2_npoceta: dayjs(tripData.msr2_npoceta).format("YYYY-MM-DD"),
      }, 
      weather: {...weatherFormData}
    };
    // console.log("final data for saving merchant : \n", finalData)
    // Dispatching the saveMerchantVessel action
    const newFinal = {
      data: finalData,
      navigation: router,
    };
    dispatch(saveMerchantVessel(newFinal));
  };

  useEffect(() => {
    // Convert image data to fileList format
    const imageFiles = data?.mer_vessel?.mv_images?.map(img => (
      {
        vi_remarks: img.vi_remarks,
        uid: img.vi_key,
        name: img.vi_image?.split('/').pop(),
        url: img.vi_image,
        status: 'done',
        originFileObj: null, // Placeholder, as `originFileObj` is not available in fetched data
    }));
    setFileList(imageFiles);
    merchantForm.setFieldsValue({...data?.mer_vessel, mv_images: imageFiles,});
    // merchantForm.setFieldsValue({...parsedVesselData, mv_vessel_images: imageFiles,});
    platformForm.setFieldsValue({
      msr_pf_id: init_platform_data.msr_pf_id,
      // msr_position: {
      //   ...data.msr_position,
      //   lat: data.msr_position.coordinates[1],
      //   lng: data.msr_position.coordinates[0], 
      // }
    })

    if (data){
      if (data.tripDetails){
        tripForm.setFieldsValue({
          ...data.tripDetails,
          msr_movement: data.msr_movement,
          msr2_lpocdtg: data.tripDetails.msr2_lpocdtg ? dayjs(data.tripDetails.msr2_lpocdtg) : null,
          datetime: data.tripDetails.msr2_lpocdtg ? dayjs(data.tripDetails.msr2_lpocdtg).format("YYYY-MM-DD") : null,
          msr2_npoceta: data.tripDetails.msr2_npoceta ? dayjs(data.tripDetails.msr2_npoceta) : null,
          datetime1: data.tripDetails.msr2_npoceta ? dayjs(data.tripDetails.msr2_npoceta).format("YYYY-MM-DD") : null,
        })
      }
    }
    if (data?.goodDetails) {
      //     // Update goodsData state by mapping over each item and modifying msrg_confiscated
      setGoodsData(
        data.goodDetails.map((item) => ({
          ...item,
          //   If item is equal to the string "Yes," it sets msrg_confiscated to true; otherwise, it sets it to false.
          msrg_confiscated: item.msrg_confiscated ? "Yes" : "No",
        }))
      );
    }
  }, [data]);

  const handleReset = () => {
    platformForm.setFieldsValue({
      msr_pf_id: init_platform_data.msr_pf_id,
    })
    tripForm.resetFields();
    setGoodsData([]);
  }

  const handleFormValidate = () => {
    const forms = [platformForm, tripForm, weatherForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
        handleMerchantSave();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [platformForm, tripForm, weatherForm]
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

  const onChange = (e) => {
    const checked = e.target.checked;
    setCoiCheck(checked)
  };

  return (
    <>
      <div >
        <PageHeader 
        showButton={true}
        // onNavigate={handleMerchantSave}
        onNavigate = {handleFormValidate}
        btnTitle="Save Report"
        showSearchBox={false} 
        handleReset={handleReset}
        title="Merchant Vessels Details" />
        
        {/*----------------------------------- Vessel Data -------------------------------------*/}
        {/* <div className="">
          <Heading className="ml-5 " level={4} text=" Merchant Vessel Data" />
        </div> */}
        <div>
          <Heading
            className=" whitespace-nowrap ml-5 flex justify-start "
            level={4}
            text="Merchant Vessel Data"
          />
          <Checkbox className=" whitespace-nowrap ml-8 mb-3 flex justify-end" style={{marginTop: "-2.1rem", paddingRight: "1rem"}}  onChange={onChange}>
            <Heading
              className=" whitespace-nowrap ml-3 flex justify-start "
              level={5}
              text="COI"
            />
          </Checkbox>
        </div>

        <MerchantVesselTable
          disabled={true}
          vesselForm={merchantForm}
          sreport={true}
          fileList={fileList}
        >
        </MerchantVesselTable>

        {/*----------------------------------- Platform Data -------------------------------------*/}

        <OwnPlatformForm
        disabled={false}
        form={platformForm}
          reportKeys={{
            dtg: "msr_dtg",
            pf_id: "msr_pf_id",
            position: "msr_position",
            lat: "msr_position.lat",
            lng: "msr_position.lng",
            fuel: "msr_fuelrem",
            info: "msr_info",
            patrolType: "msr_patroltype",
            action: "msr_action",
            frshwatr: "msr_freshwater",
          }}
        />

        {/* <div className="mb-10"> 
          <AntdTable
            scroll={{ x: "auto" }} // Set the scroll property as per your requirements
            columns={vesselcolumns}
            data={[parsedVesselData]}
            pagination={false}
            scrollConfig={{ x: true }}
          />
        </div> */}

        {/*----------------------------------- Weather Data -------------------------------------*/}
      <WeatherForm 
        disabled={false}
        form={weatherForm}/>
        
        {/*----------------------------------- Trip Data -------------------------------------*/}
        <MerchantTripForm
          disabled={false}
          form={tripForm}>
        </MerchantTripForm>
        {/* <MerchantTripTable
          tripData={tripData}
          setTripData={setTripData}
          tripDataState={{
            tripDataEntered: tripDataEntered,
            setTripDataEntered: setTripDataEntered,
          }}
          showButtons={showButtons}
        /> */}

        {/*----------------------------------- Good Detail Data -------------------------------------*/}

        <GoodsTable
          goodsData={goodsData}
          setGoodsData={setGoodsData}
          showButtons={true}
          reportKeys={{
            item: "msrg_item",
            qty: "msrg_qty",
            denomination: "msrg_denomination",
            category: "msrg_category",
            subcategory: "msrg_subcategory",
            confiscated: "msrg_confiscated",
            value: "msrg_value",
            source: "msrg_source",
          }}
        />
      </div>
    </>
  );
}

export default Details;


