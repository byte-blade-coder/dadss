import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useDispatch } from "react-redux";
import MedicalAssistanceForm from "../../src/components/stackedForm/MedicalAssistanceForm";
import { addSARData, addMedicalAssistanceData } from "../../src/redux/thunks/searchandrescue";
import { showToastError } from "../../src/helper/MyToast";

function SearchandRescueData() {
  const pf_id = localStorage.getItem("u_pf_id")
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = useForm();
  const [medicalForm] = useForm();
  const [data, setData] = useState(null);

  // useEffect(() => {
  //   medicalForm.setFieldsValue({
  //     sar_unit: pf_id,
  //   });
  // }, [data]);

  const handleSave = async () => {
    const validatedValues = await medicalForm.validateFields();

    const coordinates = [
      validatedValues.sar_position.lng,
      validatedValues.sar_position.lat,
    ];

    const finalData = {
      data: {
        ...validatedValues,
        sar_position: {
          type: "Point",
          coordinates: coordinates,
          //coordinates: DMStodecimal(validatedValues.ssr_position.dms),
        },
        sar_table: "MEDASSIST_FORM",
      },
      navigation: router,
    }
    dispatch(addMedicalAssistanceData(finalData));
  }

  const handleBack = () => {
    //localStorage.removeItem("OwnerForm");
    router.back();
  };

  const handleFormValidate = () => {
    const forms = [medicalForm];
    Promise.all(forms.map((form) => form.validateFields()))
      .then(() => {
        handleSave();
      })
      .catch(() => {
        // If the data is not valid, scroll to the first invalid field
        const firstInvalidField = [medicalForm]
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

  const handleReset = () => {
    medicalForm.resetFields();
    //sarshipForm.resetFields();
    //setPlatformData([]);
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
          title="Medical Assistance Data Entry"
        />
      </div>
      <MedicalAssistanceForm
        disabled={false}
        form={medicalForm}>
      </MedicalAssistanceForm>
    </StyledDiv>
  );
}

export default SearchandRescueData;

const StyledDiv = styled.div`
  // .input {
  //   margin-bottom: 20px;
  // }
`;
