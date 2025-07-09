import { React, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { saveMissionReport } from "../../src/redux/thunks/missionReportData";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useForm } from "antd/lib/form/Form";
import FishingDensityTable from "../../src/components/table/FishingDensityTable";
import FishingObservedTable from "../../src/components/table/FishingObservedTable";

const MissionDataTable = dynamic(
  () => import("../../src/components/table/MacroMissionDataTable"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const MissionDetailDataTable = dynamic(
  () => import("../../src/components/table/MissionDetailDataTable"),
  {
    ssr: false,
  }
);

function Addmissioninput() {
  const router = useRouter();
  const dispatch = useDispatch();
  const init_mission_data = { mr_pf_id: localStorage.getItem("u_pf_id") };
  const [missionDataForm] = useForm();
  const [missionDetail, setMissionDetail] = useState([]);
  const [fishingDensityData, setFishingDensityData] = useState([]);
  const [fishingObservedData, setFishingObservedData] = useState([]);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    missionDataForm.setFieldsValue({
      mr_pf_id: init_mission_data.mr_pf_id
    });
  })

  // Function to handle saving mission report
  const handleSendMissionReport = async () => {
    const validatedValues = await missionDataForm.validateFields();
    const missionData = {
      ...validatedValues,
      ...init_mission_data,
    }
    try {
      // Combine mission data and details
      const finalData = {
        ...missionData,
        misrepdetails: missionDetail,
        misrepfishing: fishingObservedData,
        misrepfdensity: fishingDensityData,
      };

    console.log(finalData)
      // Create payload for dispatching
      const newFinal = {
        data: finalData,
        navigation: router,
      };

      dispatch(saveMissionReport(newFinal));
    } catch (error) { }
  };

  return (
    <>
      <PageHeader
        showButton={true}
        onNavigate={handleSendMissionReport}
        btnTitle="Save Report"
        title="Mission Report" />

      {/*-----------------------------------mission macro data data  (First Table)-------------------------------------*/}
      <MissionDataTable
        disabled={false}
        missionDataForm={missionDataForm}
      />
      {/*-----------------------------------mission detail data (Second Table)-------------------------------------*/}
      <MissionDetailDataTable
        showButtons={true}
        missionDetail={missionDetail}
        setMissionDetail={setMissionDetail}
      />
      {/*-----------------------------------Fishing Observed (Third Table)-------------------------------------*/}
      <FishingObservedTable
        fishingObservedData={fishingObservedData}
        setFishingObservedData={setFishingObservedData}
        showButtons={true}
        reportKeys={{
          position: ["mrf_position"],
          name: "mrf_name",
          type: "mrf_type",
          movement: "mrf_movement"
        }}
      />
      {/*-----------------------------------Fishing Density (Second Table)-------------------------------------*/}
      <FishingDensityTable
        fishingDensityData={fishingDensityData}
        setFishingDensityData={setFishingDensityData}
        showButtons={true}
        reportKeys={{
          position: ["mrfd_position"],
          qty: "mrfd_qty",
          type: "mrfd_type",
          movement: "mrfd_movement"
        }}
      />
    </>
  );
}

export default Addmissioninput;
