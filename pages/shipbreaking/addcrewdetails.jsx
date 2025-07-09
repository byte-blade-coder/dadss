import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import InputBox from "../../src/components/form/InputBox";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import { saveShipBreakingReport } from "../../src/redux/thunks/shipbreakingReportData";
import { useDispatch } from "react-redux";
import PageHeader from "../../src/components/pageheader/pageHeader";
import CrewTableShip from "../../src/components/specialTables/CrewTableShip";

function Addcrewdetails() {
  const [form] = useForm();
  const router = useRouter();
  const [crewData, setCrewData] = useState([]);
  const dispatch = useDispatch();

  const handleBack = () => {
    router.back();
    // Store form data in localStorage
    localStorage.setItem("crewForm", JSON.stringify(form.getFieldsValue()));
    localStorage.setItem("crewData", JSON.stringify(crewData));
  };

  // Handler for form submission
  const handleSubmit = async () => {
    try {
      // Validate form fields
      const validatedValues = await form.validateFields();

      if (validatedValues) {
        // Parse form data
        const parsedData = {
          sb_crew: parseInt(validatedValues.sb_crew),
        };

        const { sb_data } = router.query;
        let finalData = JSON.parse(sb_data);
        // Add the parsedData directly to the sb_data object
        finalData["sb_crew"] = parsedData.sb_crew;
        // Append the crewData array to the shipbreakingcrew property
        finalData["shipbreakingcrew"] = crewData;
        // Dispatch action to save ship breaking report
        dispatch(saveShipBreakingReport({
          data: finalData,
          navigation: router,
        }));        
      }
    } catch (error) { }
  };

  useEffect(() => {
    // Retrieve stored form data from localStorage
    const storedData = localStorage.getItem("crewForm");
    const storedCrewData = localStorage.getItem("crewData");

    if (storedData) {
      try {
        const formData = JSON.parse(storedData);
        form.setFieldsValue(formData);
      } catch (error) {
      }
    }

    if (storedCrewData) {
      try {
        const crewData = JSON.parse(storedCrewData);
        setCrewData(crewData);
      } catch (error) {
      }
    }
  }, [form]);

  return (
    <>
      <PageHeader
        showSearchBox={false}
        title="Ship Breakage Registration/Add Crew Detail"
        handleBack={handleBack}
        showButton={true}
        btnTitle="Save Report"
        onNavigate={handleSubmit}
      />

      <Form
        form={form}
        layout="vertical"
        className="shadow mx-5 px-3 py-10 bg-white"
        onFinish={handleSubmit}
      >
        <Row>
          <Col className="ml-5 mb-4">
            <StyledInput>
              <InputBox
                label="Total Crew on Board"
                placeholder="5"
                name="sb_crew"
                type="number"
                className="input"
                rules={[{ required: true, message: "Required Field!" }]}
              />
            </StyledInput>
          </Col>
        </Row>

        <StyledDiv>
          <CrewTableShip
            crewData={crewData}
            setCrewData={setCrewData}
            showButtons={true}
          />
        </StyledDiv>
      </Form>
    </>
  );
}

export default Addcrewdetails;

const StyledDiv = styled.div`
  .input {
    margin-bottom: 20px;
  }
  .ant-table-tbody {
    margin-bottom: 50px;
  }
  .ant-table-row.ant-table-row-level-0 {
    /* Your additional styles for level-0 */
   height:80px
  }
`;
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
