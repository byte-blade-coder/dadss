import { useState, useEffect } from "react";
import { Col, Row, message } from "antd";
import { useRouter } from "next/router";
import styled from "styled-components";
import FilledButton from "../../src/components/button/FilledButton";
import { useDispatch, useSelector } from "react-redux";
import { saveGeneralReport } from "../../src/redux/thunks/generalReportData";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import FishingDensityTable from "../../src/components/table/FishingDensityTable";
import FishingObservedTable from "../../src/components/table/FishingObservedTable";
import OwnPlatformTable from "../../src/components/table/OwnPlatformTable";
import OwnPlatformForm from "../../src/components/stackedForm/OwnPlatformForm";
import MerchantObservedTable from "../../src/components/table/MerchantObservedTable";
import WeatherForm from "../../src/components/stackedForm/WeatherForm";
import LimitationOpsCommittment from "../../src/components/table/limitationOpsCommittment";
import FreshWaterTable from "../../src/components/table/FreshWaterTable";
import SelectBox from "../../src/components/form/SelectBox";
import {
  ReaonCondition,
  TypeOfEvents,
  condition,
  supportLevel,
  supportRecieved,
} from "../../src/helper/dropdown";
import ActivityLikelinessTable from "../../src/components/table/ActivityLikelinessTable";
import Miscellaneous from "../../src/components/table/miscellaneous";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useForm } from "antd/lib/form/Form";
import Heading from "../../src/components/title/Heading";

const AddGeneralInput = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showButtons, setShowButtons] = useState(true);

  const init_platform_data = { gr_pf_id: localStorage.getItem("u_pf_id") };

  const [platformForm] = useForm();
  const [platformData, setPlatformData] = useState(init_platform_data);
  const [platformDataEntered, setPlatformDataEntered] = useState(false);

 const [weatherForm] = useForm();
  const [fishingDensityData, setFishingDensityData] = useState([]);
  const [fishingObservedData, setFishingObservedData] = useState([]);
  const [merchantObservedData, setMerchantObservedData] = useState([]);

  const [limitOps, setLimitOps] = useState([]);
  const [freshWaterData, setFreshWaterData] = useState([]);
  const [activtyData, setactivtyData] = useState([]);

  const generalReportState = useSelector((state) => state.saveGeneralReport);

  useEffect(() => {
      platformForm.setFieldsValue({
        gr_pf_id: init_platform_data.gr_pf_id,
        
      });
  }, []);

  /*-----------------------------------Fishing Density Data (Second Table)-------------------------------------*/


  /*-----------------------------------Owner Data (Third Table)-------------------------------------*/

  /*-----------------------------------Merchant Data (Fourth Table)-------------------------------------*/


  const handleSendGeneralReport = async () => {

    const platformFormData = await platformForm.validateFields();
    const weatherFormData = await weatherForm.validateFields();
    console.log(platformFormData)
    const coordinates = [
      platformFormData.gr_position.lng,
      platformFormData.gr_position.lat,
    ];
    if (platformFormData) {
      const finalData = {
        ...platformFormData,
        // ...platformData,
        gr_dtg: platformFormData.gr_dtg.toISOString(),
        gr_position: {
          // coordinates: platformData.gr_position.coordinates,
          coordinates: coordinates,
          type: "Point",
        },
        fishingDensities: fishingDensityData,
        fishingVesselObserved: fishingObservedData,
        merchantVesselObserved: merchantObservedData,
        weather: weatherFormData,
      };
      const newFinal = {
        data: finalData,
        navigation: router,
      };
      dispatch(saveGeneralReport(newFinal));
    } else {
      message.error("Enter Platform Data to continue");
    }
  };

  return (
    <>
      <PageHeader
        showButton={false}
        showSearchBox={false}
        title="Add General Report"
      />
      <Row className="items-center mb-4">
        <Col span={6}></Col>
        <Col span={18} className="flex justify-end">
          {/* {showButtons ? (
            <FilledButton
              loading={generalReportState.isLoading}
              // disabled={platformData.length > 1}
              style={{ marginLeft: "auto" }}
              text="Save Report"
              className="rounded-full border-lightgreen bg-lightgreen text-white mr-4"
              onClick={handleSendGeneralReport}
              disabled={!platformDataEntered}
            />
          ) : (
            <FilledButton
              // disabled={platformData.length > 1}
              style={{ marginLeft: "auto" }}
              text="+ Add Data"
              className="rounded-full border-midnight bg-midnight text-white mr-4"
              onClick={() => setShowButtons(true)}
            />
          )} */}
          <FilledButton
            loading={generalReportState.isLoading}
            // disabled={platformData.length > 1}
            style={{ marginLeft: "auto" }}
            text="Save Report"
            className="rounded border-lightgreen bg-lightgreen text-white mr-4"
            onClick={handleSendGeneralReport}
            // disabled={!platformDataEntered}
          />
        </Col>
      </Row>
      {/*-----------------------------------Own Platform Data (First Table)-------------------------------------*/}
      <OwnPlatformForm
        disabled={false}
        form={platformForm}
      />
      
      {/* <OwnPlatformTable
        platformData={platformData}
        setPlatformData={setPlatformData}
        init_platform_data={init_platform_data}
        // showButtons={true}
        showButtons={showButtons}
        platformDataState={{
          platformDataEntered: platformDataEntered,
          setPlatformDataEntered: setPlatformDataEntered,
        }}
      /> */}
      
      {/*-----------------------------------Weather Data -------------------------------------*/}
      <WeatherForm 
        disabled={false}
        form={weatherForm}/>

      {/*-----------------------------------Cntinued Already Reported Activity-------------------------------------*/}
      {/* <Row className="mb-5">
        <Col>
          <Heading
            level={5}
            text="Continue Already Reported Activity"
            className="whitespace-nowrap ml-5 flex justify-start"
          />
        </Col>
        <Col>
          <SelectBox
            size="medium"
            placeholder="Choose"
            className="ml-5 input "
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
          />
        </Col>
      </Row> */}
      {/*-----------------------------------Report Links (Second Table)-------------------------------------*/}
      {/* <Heading
        level={5}
        text="   Previous Special Reports"
        className="mb-5 whitespace-nowrap ml-5 flex justify-start"
      ></Heading> */}
      {/* <StyledInput>
        <Row className="mb-5">
          <Col>
            <Heading
              level={5}
              text=" Date Time"
              className="whitespace-nowrap ml-5 flex justify-start"
            ></Heading>
          </Col>
          <Col>
            <Heading
              level={5}
              text="Links"
              className="whitespace-nowrap ml-5 flex justify-start"
            ></Heading>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col className="ml-5 mr-5">
            <p>22/12/2023</p>
          </Col>
          <Col className="ml-5 mr-5">
            <a
              href="your_actual_link_here"
              target="_blank"
              style={{ color: "blue" }}
            >
              https://www.wikipedia.org/
            </a>
          </Col>
        </Row>
        <Row className="mb-10">
          <Col className="ml-5 mr-5">
            <p>22/12/2023</p>
          </Col>
          <Col className="ml-5 mr-5">
            <a
              href="your_actual_link_here"
              target="_blank"
              style={{ color: "blue" }}
            >
              https://www.wikipedia.org/
            </a>
          </Col>
        </Row>
      </StyledInput> */}
      {/*-----------------------------------Activity Likely (Second Table)-------------------------------------*/}
      {/* <ActivityLikelinessTable
        activtyData={activtyData}
        showButtons={showButtons}
        setactivtyData={setactivtyData}
      /> */}
      {/*-----------------------------------Limitation Condition  (Second Table)-------------------------------------*/}
      {/* <StyledInput>
        <Row className="mb-5">
          <Col className="mr-5">
            <Heading
              level={5}
              text="Limitation Condition"
              className="whitespace-nowrap ml-5 mb-2 flex justify-start"
            />
            <SelectBox
              className="ml-5 mb-4"
              name="machinery defects"
              placeholder="Select Activity Type"
              options={condition.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
          <Col>
            <Heading
              level={5}
              text="Likeliness"
              className="whitespace-nowrap ml-5 mb-2 flex justify-start"
            />
            <SelectBox
              className="ml-5"
              name="machinery defects"
              placeholder="Select likeliness"
              options={ReaonCondition.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
        </Row>
      </StyledInput> */}
      {/*-----------------------------------Event Support REcieved and Level (Second Table)-------------------------------------*/}
      {/* <StyledInput>
        <Row className="mb-5">
          <Col className="mr-5">
            <Heading
              level={5}
              text="Types of  Event"
              className="whitespace-nowrap ml-5 mb-2 flex justify-start"
            />
            <SelectBox
              className="ml-5 mb-4"
              name="machinery defects"
              placeholder="Select Event Type"
              options={TypeOfEvents.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
          <Col className="mr-5">
            <Heading
              level={5}
              text="Support Recieved"
              className="whitespace-nowrap ml-5 mb-2 flex justify-start"
            />
            <SelectBox
              className="ml-5 mb-4"
              name="machinery defects"
              placeholder="Select Support Recieved"
              options={supportRecieved.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
          <Col>
            <Heading
              level={5}
              text="Support Level"
              className="whitespace-nowrap ml-5 mb-2 flex justify-start"
            />
            <SelectBox
              className="ml-5"
              name="machinery defects"
              placeholder="Select Support Level"
              options={supportLevel.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
        </Row>
      </StyledInput> */}
      {/* -----------------------------------Add Fresh Water %(Second Table)------------------------------------- */}
      {/* <FreshWaterTable
        freshWaterData={freshWaterData}
        setFreshWaterData={setFreshWaterData}
        showButtons={showButtons}
      /> */}
      {/*-----------------------------------Limitation Affecting Ops Commitment (Second Table)-------------------------------------*/}
      {/* <LimitationOpsCommittment
        limitOps={limitOps}
        setLimitOps={setLimitOps}
        showButtons={showButtons}
      /> */}
      {/*-----------------------------------Missceallanous(Second Table)-------------------------------------*/}
      {/* <Miscellaneous
        freshWaterData={freshWaterData}
        showButtons={showButtons}
        setFreshWaterData={setFreshWaterData}
      /> */}
      {/*-----------------------------------Fishing Density (Second Table)-------------------------------------*/}
      <FishingDensityTable
        fishingDensityData={fishingDensityData}
        setFishingDensityData={setFishingDensityData}
        showButtons={showButtons}
      />
      {/*-----------------------------------Fishing Observed (Third Table)-------------------------------------*/}
      <FishingObservedTable
        fishingObservedData={fishingObservedData}
        setFishingObservedData={setFishingObservedData}
        showButtons={showButtons}
      />
      {/* -----------------------------------Merchant Vessel (Fourth Table)------------------------------------- */}
      <MerchantObservedTable
        merchantObservedData={merchantObservedData}
        setMerchantObservedData={setMerchantObservedData}
        showButtons={showButtons}
      />
    </>
  );
};

export default AddGeneralInput;
export async function getServerSideProps() {
  return {
    props: {
      data: {
        title: "Add General Report",
      },
    },
  };
}
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
