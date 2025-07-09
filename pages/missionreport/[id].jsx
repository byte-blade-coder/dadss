import { Col, Descriptions, Row, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { coordinatesToDMS, decimalToDMS, coordinatesToDMS1} from "../../src/helper/position";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";
import dynamic from "next/dynamic";
import FilledButton from "../../src/components/button/FilledButton";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissionReportID } from "../../src/redux/thunks/missionReportData";
import { useForm } from "antd/lib/form/Form";
import { LoadingOutlined } from "@ant-design/icons";
import { hasPermission } from "../../src/helper/permission";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
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

function MissDetails() {
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [missionDataForm] = useForm();
  const [missionDetail, setMissionDetail] = useState([]);
    const [fishingDensityData, setFishingDensityData] = useState([]);
    const [fishingObservedData, setFishingObservedData] = useState([]);
  const router = useRouter();
  const { mr_key } = router.query; // Extract rv_key from query parameters
  const changePermission = hasPermission('change_missionreport');
  const deletePermision = hasPermission('delete_missionreport'); 

  const fetchMissionReportID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep/${mr_key}`
      );
      if (response.status === 200)
        setData(response.data);
    } catch (error) {
      router.push("/404");
    }
  }

  useEffect(() => {
    if (!data) {
      fetchMissionReportID();
    }
  }, []);

  useEffect(() => {
    if (data && data.misrepdetails) {
      missionDataForm.setFieldsValue({
        mr_key: data.mr_key,
        mr_pf_id: data.mr_pf_id,
        mr_dtg: dayjs(data.mr_dtg),
        mr_datetime: dayjs(data.mr_dtg).format("DD-MM-YYYY HH:mm:ss"),
        mr_rdt: dayjs(data.mr_rdt).format("DD-MM-YYYY HH:mm:ss"),
      })
      
      const newMissionDetail = data?.misrepdetails.map((item) => ( {
        ...item,
        mrd_dtg: item.mrd_dtg ? dayjs(item.mrd_dtg) : null,
        mrd_position: {
          ...item.mrd_position,
          //lat: item.mrd_position.coordinates[1],
          //lng: item.mrd_position.coordinates[0],
          dms: coordinatesToDMS1(item.mrd_position.coordinates),
          // dms: [
          //   coordinatesToDMS(item.mrd_position.coordinates, 0),
          //   coordinatesToDMS(item.mrd_position.coordinates, 1),
          // ],
        },
      }));

      const newFVDetail = data?.misrepfishing.map((item) => ( {
        ...item,
        mrf_dtg: item.mrf_dtg ? dayjs(item.mrf_dtg) : null,
        mrf_position: {
          ...item.mrf_position,
        },
      }));

      const newFVDDetail = data?.misrepfdensity.map((item) => ( {
        ...item,
        mrfd_dtg: item.mrfd_dtg ? dayjs(item.mrfd_dtg) : null,
        mrfd_position: {
          ...item.mrfd_position,
        },
      }));

      setMissionDetail(newMissionDetail);
      setFishingObservedData(newFVDetail);
      setFishingDensityData(newFVDDetail);
    }
  }, [data]);

  const handleUpdate = async () => {
    const validatedValues = await missionDataForm.validateFields();
    const missionData = {
      ...validatedValues,
    }
    const finalData = {
      ...missionData,
      misrepdetails: missionDetail,
        misrepfishing: fishingObservedData,
        misrepfdensity: fishingDensityData,
    };
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const macroResponse = await axios.put(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep/${data.mr_key}`,
        finalData
      );
      // Check if the response status is either 200 or 201
      if (macroResponse.status === 200 || macroResponse.status === 201) {
        router.push("/missionreport");
        showToastSuccess(`Report Updated Successfully`);

      } else {
        showToastError("Upload failed. Please try again.");
      }
    } catch (error) {
            console.error(error)
    }
  };

  const handleDelete = async () => {
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const macroResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep/${data.mr_key}`
      );
      // Check if the response status is either 200 or 201
      if (macroResponse.status === 200 || macroResponse.status === 204) {
        router.push("/missionreport");
        showToastSuccess(`Report Deleted Successfully`);

      } else {
        showToastError("Report Deletion failed. Please try again.");
      }
    } catch (error) {
      showToastError("Report Deletion failed. Please try again.");
    }

  };

  return (
    <div>
      <PageHeader
        deleteButton={deletePermision}
        onDelete={handleDelete}
        UpdateButton={changePermission}
        onUpdate={handleUpdate}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        title="Mission Report"
      />

      <MissionDataTable
        disabled={!isEditing}
        missionDataForm={missionDataForm}
      />

      <MissionDetailDataTable
        showButtons={isEditing}
        missionDetail={missionDetail}
        setMissionDetail={setMissionDetail}
      />
       {/*-----------------------------------Fishing Observed (Third Table)-------------------------------------*/}
      <FishingObservedTable
        fishingObservedData={fishingObservedData}
        setFishingObservedData={setFishingObservedData}
        showButtons={isEditing}
        reportKeys={{
          position: "mrf_position",
          name: "mrf_name",
          type: "mrf_type",
          movement: "mrf_movement"
        }}
      />
      {/*-----------------------------------Fishing Density (Second Table)-------------------------------------*/}
      <FishingDensityTable
        fishingDensityData={fishingDensityData}
        setFishingDensityData={setFishingDensityData}
        showButtons={isEditing}
        reportKeys={{
          position: "mrfd_position",
          qty: "mrfd_qty",
          type: "mrfd_type",
          movement: "mrfd_movement"
        }}
        // dropdownOptions
      />
    </div>
  );
}

export default MissDetails;
