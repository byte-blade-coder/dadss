import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import OutlineButton from "../../src/components/button/OutlineButton";
import InputBox from "../../src/components/form/InputBox";
import SelectBox from "../../src/components/form/SelectBox";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import { saveRegistedVessel } from "../../src/redux/thunks/registeredVesselData";
import { useSelector, useDispatch } from "react-redux";
import { country_list, ethnicity_list } from "../../src/helper/dropdown";
import DateBox from "../../src/components/form/DateBox";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import PageHeader from "../../src/components/pageheader/pageHeader";

function Addownerdetail() {
  const [form] = useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, data } = useSelector(
    (state) => state.saveRegisteredVesselData
  );

  const handleSubmit = async () => {
    try {
      const validatedValues = await form.validateFields();

      if (validatedValues) {
        const parsedFormData = {
          ...validatedValues,
          rvo_share: parseInt(validatedValues.rvo_share, 10),
          rvo_idexpdt: dayjs(validatedValues.rvo_idexpdt).format("YYYY-MM-DD"),
        };
        const { rv_data } = router?.query;
        const { nakwaDetails } = router?.query;
        let finalData = JSON.parse(rv_data);
        finalData["nakwaDetails"] = [];
        finalData["ownerDetails"] = [];
        finalData["nakwaDetails"].push(JSON.parse(nakwaDetails));
        finalData["ownerDetails"].push(parsedFormData);
        dispatch(saveRegistedVessel(finalData));
        if (data) {
          router.push({
            pathname: "/registeredvessels",
          });
        }
      }
    } catch (error) {}
  };
  const handleBack = () => {
    router.back();
       localStorage.setItem(
         "OwnerForm",
         JSON.stringify({
           ...form.getFieldsValue(),
           rvo_idexpdt: dayjs(form.getFieldValue("rvo_idexpdt")).format(),
         })
       );
  };
  useEffect(() => {
    const storedData = localStorage.getItem("OwnerForm");
    if (storedData) {
      try {
        const formData = JSON.parse(storedData);

        // Parse and set the date if it exists in the form data
        if (formData.rvo_idexpdt) {
          formData.rvo_idexpdt = dayjs(formData.rvo_idexpdt, "YYYY-MM-DD");
        }
        form.setFieldsValue(formData);
      } catch (error) {
        console.error("Error parsing stored data:", error);
      }
    }
  }, [form]);

  return (
    <StyledDiv>
      <div>
        {" "}
        <PageHeader
          showSearchBox={false}
          title="Vessel Registration/Add Owner Detail"
          localStorage={handleBack}
        />
      </div>
      <div>
        {" "}
        <Form
          form={form}
          layout="vertical"
          className="shadow mx-5 px-3 py-10 bg-white"
        >
          <Row className="flex justify-center">
            <Col span={11}>
              <InputBox
                label="Name"
                name="rvo_name"
                className="input"
                placeholder="to be provided"
                maxLength={25}
                pattern="/^[a-zA-Z\s]*$/"
                rules={[
                  {
                    required: true,
                    message: "Please enter a name",
                  },
                  {
                    pattern: /^[a-zA-Z\s]*$/,
                    message: "Name must contain only letters and spaces",
                  },
                ]}
              />
              <SelectBox
                label="ID Type"
                name="rvo_idtype"
                className="input"
                placeholder="CNIC"
                options={[
                  { value: "CNIC", label: "CNIC" },
                  { value: "Passport", label: "Passport" },
                ]}
                rules={[
                  { required: false, message: "Please select a ID Type!" },
                ]}
              />
              <DateBox
                label="ID Exp. Date"
                name="rvo_idexpdt"
                className="input"
                format="YYYY-MM-DD"
                rules={[
                  {
                    required: false,
                    message: "Please enter an ID expiration date",
                  },
                ]}
              />
              <InputBox
                label="Share %"
                name="rvo_share"
                type="number"
                className="input"
                placeholder="45"
                suffix="%"
                maxLength={3}
                rules={[
                  {
                    required: true,
                    message: "Please enter a share percentage",
                  },
                  {
                    pattern: /^([1-9]|[1-9]\d|100)$/,
                    message: "Invalid share percentage format (1-100%)",
                  },
                ]}
              />
            </Col>
            <Col span={11} offset={1}>
              <SelectBox
                label="Nationality"
                name="rvo_nationality"
                className="input"
                placeholder="Pakistan"
                options={country_list.map((item) => ({
                  value: item,
                  label: item,
                }))}
                rules={[
                  { required: false, message: "Please select a nationality!" },
                ]}
              />
              <InputBox
                label="ID Number"
                name="rvo_id"
                className="input"
                placeholder="42221-458964-2"
                minLength={6}
                maxLength={12}
                pattern="/^[0-9]+$/"
                rules={[
                  {
                    required: true,
                    message: "Please input the ID Number!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "ID Number can only contain numbers.",
                  },
                  {
                    max: 13,
                    message: "User ID cannot be more than 13 characters long.",
                  },
                ]}
              />
              {/* <SelectBox
                label="Ethnicity"
                name="rvo_ethnicity"
                className="input"
                placeholder="Select Ethnicity"
                options={ethnicity_list.map((item) => ({
                  value: item,
                  label: item,
                }))}
                rules={[
                  { required: true, message: "Please select a ethnicity!" },
                ]}
              /> */}
              <InputBox
                label="Ethnicity"
                name="rvo_ethnicity"
                className="input"
                placeholder="Enter Ethnicity"
                rules={[
                  { required: false, message: "Please enter a ethnicity!" },
                ]}
              />
              <InputBox
                label="Mobile Number"
                className="input"
                name="rvo_cell"
                placeholder="0332-4324223"
                minLength={11}
                maxLength={11}
                pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
                rules={[
                  {
                    required: false,
                    message: "Please input a valid mobile number!",
                  },
                  {
                    pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                    message: "Please enter a valid mobile number!",
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: "Please enter a valid 11-digit mobile number!",
                  },
                ]}
              />
            </Col>
          </Row>
          <Row className="flex justify-center">
            <Col span={23} className="flex justify-end">
              <div>
                <OutlineButton
                  text="Cancel"
                  onClick={handleBack}
                  className="rounded-full font-semibold border-gray pl-10 pr-10 bg-gray text-white"
                />
                <FilledButton
                  text="Save"
                  loading={isLoading}
                  onClick={handleSubmit}
                  className="rounded-full font-semibold pl-10 pr-10 border-midnight bg-midnight text-white ml-3"
                />
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </StyledDiv>
  );
}

export default Addownerdetail;
const StyledDiv = styled.div`
  .input {
    margin-bottom: 20px;
  }
`;
