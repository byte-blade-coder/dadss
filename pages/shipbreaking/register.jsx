import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import dayjs from "dayjs";
import PageHeader from "../../src/components/pageheader/pageHeader";
import ShipDataTable from "../../src/components/table/shipDataTable";

function Register() {
  const router = useRouter();
  const [form] = useForm();

  // Handler to navigate back
  const handleBack = () => {
    router.back();
    localStorage.removeItem("shipBreakingForm");
    localStorage.removeItem("crewForm");
    localStorage.removeItem("crewData");
  };

  // Handler for form submission
  const handleSubmit = async () => {
    try {
      // Validate form fields
      const validatedValues = await form.validateFields();

      if (validatedValues) {
        // Navigate to the next page with the prepared data
        router.push({
          pathname: "/shipbreaking/addcrewdetails",
          query: {
            sb_data: JSON.stringify(validatedValues),
          },
        });
      }
      // Store the form data in localStorage
      localStorage.setItem(
        "shipBreakingForm",
        JSON.stringify({
          ...validatedValues,
        })
      );
    } catch (error) {}
  };

  // Effect hook to load stored form data from localtorage
  useEffect(() => {
    const storedData = localStorage.getItem("shipBreakingForm");
    if (storedData) {
      try {
        const formData = JSON.parse(storedData);
        form.setFieldsValue(formData);
        form.setFieldValue('sb_dtg', formData['sb_dtg'] ? dayjs(formData['sb_dtg']) : null);
      } catch (error) {}
    }
  }, [form]);

  return (
    <StyledDiv>
      <PageHeader
        showSearchBox={false}
        title="Ship Breakage Registration"
        handleBack={handleBack}
      />

      <ShipDataTable
        disabled={false}
        shipDataForm={form}
        handleBack={handleBack}
        handleSubmit={handleSubmit}
        fixedDisabled={false}
      />
    </StyledDiv>
  );
}

export default Register;
const StyledDiv = styled.div`
  // .input {
  //   margin-bottom: 20px;
  // }
  // .nowrap {
  //   white-space: nowrap !important;
  // }
`;
