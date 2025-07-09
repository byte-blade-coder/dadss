import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Table, Tooltip } from "antd";
import { MerchantDetailColumns } from "../../src/helper/DataColumns";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchMerchantById } from "../../src/redux/thunks/merchantVesselData";
import TableItemRenderer from "../../src/components/table/RenderTable";
import Heading from "../../src/components/title/Heading";
import AntdTable from "../../src/components/table/AntdTable";
import { Checkbox } from "antd";
import { DMStodecimal, coordinatesToDMS1, decimalToDMS, positiontoDMS } from "../../src/helper/position";
import dayjs from "dayjs";
import axios from "axios";
import { useForm } from "antd/lib/form/Form";
import MerchantTripForm from "../../src/components/stackedForm/MerchantTripForm";
import OwnPlatformForm from "../../src/components/stackedForm/OwnPlatformForm";
import MerchantVesselTable from "../../src/components/table/MerchantVesselTable";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import { hasPermission } from "../../src/helper/permission";
import WeatherForm from "../../src/components/stackedForm/WeatherForm";


function Specialreportdetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const { msr_key } = router.query;
  const [coiCheck, setCoiCheck] = useState()

  const [isEditing, setIsEditing] = useState(false);
  const changePermission = hasPermission('change_mersreports');
  // const deletePermision = hasPermission('delete_mersreports');
    const deletePermision = false;

  const [goodsData, setGoodsData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [platformForm] = useForm();
  const [weatherForm] = useForm();
  const [merchantForm] = useForm();
  const [tripForm] = useForm();

  const fetchMerchantID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant/${msr_key}`
      );
      if (response.status === 200)
        setData(response.data);
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

  const handleUpdate = async () => {
    const platformData = await platformForm.validateFields();
    const tripData = await tripForm.validateFields();
    const weatherFormData = await weatherForm.validateFields();

    const coordinates = [
      platformData.msr_position.lng,
      platformData.msr_position.lat,
      //platformData.msr_position.coordinates[1],
      //platformData.msr_position.coordinates[0], 
    ];

    const editedData = {
      msr_coi: coiCheck,
      ...platformData,
      msr_mv_key: data?.mer_vessel?.mv_key,
      msr_movement: tripData.msr_movement,
      //The toISOString() method is then called on the msr_dtg object to convert it into a string in the ISO 8601 format.
      msr_dtg: platformData.msr_dtg.toISOString(),

      msr_position: {
        coordinates: coordinates,
        //coordinates: DMStodecimal(platformData.msr_position.dms),
        type: "Point",
      },

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
    console.log("Edited : " , editedData)
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant/${data.msr_key}`,
        editedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        router.push("/merchantvessel");
        showToastSuccess(`Report Updated Successfully`);
      }
    } catch (error) {
      console.error(error)
      // showToastError("Upload failed. Please try again.");
    }

  };

  const handleDelete = async () => {
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant/${data.msr_key}`
      );
      // Check if the response status is either 200 or 201
      if (macroResponse.status === 200 || macroResponse.status === 204) {
        router.push("/merchantvessel");
        showToastSuccess(`Report Deleted Successfully`);

      } else {
        showToastError("Report Deletion failed. Please try again.");
      }
    } catch (error) {
      showToastError("Report Deletion failed. Please try again.");
    }

  };

  useEffect(() => {
    if (data){
      console.log(data?.mer_vessel)
      onChange(data.msr_coi)
      setCoiCheck(data.msr_coi);
      platformForm.setFieldsValue({
        msr_pf_id: data.msr_pf_id,
        msr_dtg: data.msr_dtg ? dayjs(data.msr_dtg) : null,
        datetime: data.msr_dtg ? dayjs(data.msr_dtg).format("YYYY-MM-DD") : null,
        msr_type: data.msr_type,
        msr_action: data.msr_action,
        msr_info: data.msr_info,
        msr_fuelrem: data.msr_fuelrem,
        msr_patroltype: data.msr_patroltype,
        msr_position: {
          ...data.msr_position,
          lat: data.msr_position.coordinates[1],
          lng: data.msr_position.coordinates[0], 
          dms: coordinatesToDMS1(data.msr_position.coordinates),
          string: [positiontoDMS(coordinatesToDMS1(data.msr_position.coordinates)[0]), positiontoDMS(coordinatesToDMS1(data.msr_position.coordinates)[1])]
        },
      })
      if (data.msr_mv_key && data.mer_vessel)
        merchantForm.setFieldsValue({...data.msr_mv_key, ...data?.mer_vessel});
        const imageFiles = data?.mer_vessel?.mv_images?.map(img => (
        {
          vi_remarks: img.vi_remarks==="undefined" ? "" : img.vi_remarks,
          uid: img.vi_key,
          name: img.vi_image?.split('/').pop(),
          url: img.vi_image,
          status: 'done',
          originFileObj: null, // Placeholder, as `originFileObj` is not available in fetched data
        }));
        setFileList(imageFiles);
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
      weatherForm.setFieldsValue({...data?.weather, 
        w_position: {
          ...data?.weather?.w_position,
          lat: data?.weather?.w_position.coordinates[1],
          lng: data?.weather?.w_position.coordinates[0], 
          // dms: coordinatesToDMS1(data?.weather?.w_position.coordinates),
          // string: [positiontoDMS(coordinatesToDMS1(data?.weather?.w_position.coordinates)[0]), positiontoDMS(coordinatesToDMS1(data?.weather?.w_position.coordinates)[1])]
        },
        // sr_w_key: data?.sr_w_key
      })
  }, [data]);

  const handleFormValidate = () => {
    const forms = [platformForm, tripForm, weatherForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
        handleUpdate();
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
          onUpdate={handleFormValidate}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          title="Merchant Vessels Details"
        />

        {/*----------------------------------- Vessel Data -------------------------------------*/}
        <div>
          <Heading
            className="ml-5"
            level={4}
            text="Merchant Vessel Data"
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

        {/* <div className="">
          <Heading className="ml-5 " level={4} text=" Merchant Vessel Data" />
        </div> */}
        <MerchantVesselTable
          disabled={true}
          vesselForm={merchantForm}
          sreport={true}
          fileList={fileList}
        ></MerchantVesselTable>

        {/* <div className="mb-10"> 
          <AntdTable
            scroll={{ x: "auto" }} // Set the scroll property as per your requirements
            columns={vesselcolumns}
            data={[parsedVesselData]}
            pagination={false}
            scrollConfig={{ x: true }}
          />
        </div> */}
        
        {/*----------------------------------- Platform Data -------------------------------------*/}

        <OwnPlatformForm
          disabled={!isEditing}
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

        {/*----------------------------------- Weather Data -------------------------------------*/}
      <WeatherForm 
        disabled={!isEditing}
        form={weatherForm}
        data={data?.weather}/>

        {/*----------------------------------- Trip Data -------------------------------------*/}
        <MerchantTripForm
          disabled={!isEditing}
          form={tripForm}
        ></MerchantTripForm>
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
          showButtons={isEditing}
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

export default Specialreportdetails;
