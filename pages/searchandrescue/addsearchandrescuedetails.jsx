import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useDispatch } from "react-redux";
import SARForm from "../../src/components/stackedForm/SARForm";
import OwnPlatformTable from "../../src/components/specialTables/OwnPlatformTable";
import SARShipForm from "../../src/components/stackedForm/SARShipForm";
import dayjs from "dayjs";
import { addSARData } from "../../src/redux/thunks/searchandrescue";
import { showToastError } from "../../src/helper/MyToast";

function SearchandRescueData() {
  const pf_id = localStorage.getItem("u_pf_id")
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = useForm();
  const [sarForm] = useForm();
  const [sarshipForm] = useForm();
  const [platformData, setPlatformData] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    form.setFieldsValue({
     // sar_unit: pf_id,
      sarp_platform : pf_id,
    });
  }, [data]);


  const handleSave = async () => {
    const sarShipValues = await sarshipForm.validateFields();
    const sarValues = await sarForm.validateFields();
    
    const coordinates = [
      sarShipValues?.sar_position?.lng,
      sarShipValues?.sar_position?.lat,
    ];

    const finalData = {
      data: {
        ...sarShipValues,
        ...sarValues,
        sar_position: {
          type: "Point",
          coordinates: coordinates,
          //coordinates: DMStodecimal(validatedValues.ssr_position.dms),
        },
        sar_table: "SAR_FORM",
        sar_platform: platformData,
        // sar_unit: platformData.map((item) => {
        //   item.sarp_platform
        // })
        // .map((item) => ({
        //   ...item,
        //   sarp_key: sar_key,
        //   sarp_to: dayjs(item.sarp_to).format("YYYY-MM-DD HH:mm:ss"),
        //   sarp_form: dayjs(item.sarp_form).format("YYYY-MM-DD HH:mm:ss"),
        // })),
      },
      navigation: router,
    }
    dispatch(addSARData(finalData));
  }

  const handleBack = () => {
    //localStorage.removeItem("OwnerForm");
    router.back();
  };

  const handleFormValidate = () => {
    const forms = [sarshipForm, sarForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
        handleSave();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [sarshipForm, sarForm]
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

  const handleReset = () => {
    sarForm.resetFields();
    sarshipForm.resetFields();
    setPlatformData([]);
  };

  return (
    <StyledDiv>
      <div>
        {" "}
        <PageHeader
          showSearchBox={false}
          handleBack={handleBack}
          showButton={true}
          btnTitle="Save"
          //onNavigate={handleSave}
          onNavigate = {handleFormValidate}
          handleReset={handleReset}
          title="Search and Rescue Data Entry"
        />
      </div>
      <SARForm
        disabled={false}
        form={sarForm}>
      </SARForm>
      <SARShipForm
        disabled={false}
        form={sarshipForm}>
      </SARShipForm>
      <OwnPlatformTable
        platformData={platformData}
        setPlatformData={setPlatformData}
        showButtons={true}
        reportKeys={{
          platform: "sarp_platform",
          to: "sarp_to",
          from: "sarp_from",
          sorties: "sarp_sorties",
          time: "sarp_sorties_time_expended"
        }}
      >
      </OwnPlatformTable>
    </StyledDiv>
  );
}

export default SearchandRescueData;

const StyledDiv = styled.div`
  // .input {
  //   margin-bottom: 20px;
  // }
`;
