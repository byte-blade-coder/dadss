import { Col, Row, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import Heading from "../../src/components/title/Heading";
import { coordinatesToDMS1, decimalToDMS, positiontoDMS } from "../../src/helper/position";
import axios from "axios";
import dayjs from "dayjs";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";
import { Descriptions } from "antd";
import { useRouter } from "next/router";
import OwnPlatformForm from "../../src/components/stackedForm/OwnPlatformForm";
import { useForm } from "antd/lib/form/Form";
import WeatherForm from "../../src/components/stackedForm/WeatherForm";

function GeneralDetails() {
  const router = useRouter();
  const { id } = router.query; 
  const [data, setData] = useState(null);
  const [platformForm] = useForm();
    const [weatherForm] = useForm();

  const fetchGeneralReportID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/greport/${id}`
      );
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      router.push("/404");
    }
  };

  useEffect(() => {
    if (!data) {
      fetchGeneralReportID();
    }
  }, []);

  useEffect(() => {
    if (data){
      platformForm.setFieldsValue({
        ...data,
        gr_dtg: data.gr_dtg ? dayjs(data.gr_dtg) : null,
        datetime: data.gr_dtg ? dayjs(data.gr_dtg).format("YYYY-MM-DD HH:mm:ss") : null,
        gr_position: {
          ...data.gr_position,
          lat: data.gr_position.coordinates[1],
          lng: data.gr_position.coordinates[0], 
          dms: coordinatesToDMS1(data.gr_position.coordinates),
          string: [positiontoDMS(coordinatesToDMS1(data.gr_position.coordinates)[0]), positiontoDMS(coordinatesToDMS1(data.gr_position.coordinates)[1])]
        },
      });
      weatherForm.setFieldsValue({...data.weather, 
        w_position: {
          ...data?.weather?.w_position,
          lat: data?.weather?.w_position.coordinates[1],
          lng: data?.weather?.w_position.coordinates[0], 
          // dms: coordinatesToDMS1(data?.weather?.w_position.coordinates),
          // string: [positiontoDMS(coordinatesToDMS1(data?.weather?.w_position.coordinates)[0]), positiontoDMS(coordinatesToDMS1(data?.weather?.w_position.coordinates)[1])]
        },
      })
    }
  }, [data]);

  const items = [
    {
      label: "Platform ID",
      children: data?.gr_pf_id || "",
    },
    {
      label: "Date Time",
      children: dayjs(data?.gr_dtg).format("YYYY-MM-DD HH:mm:ss") || "",
    },
    {
      label: "Latitude",
      children: decimalToDMS(data?.gr_position?.coordinates[1], 1) || "",
    },
    {
      label: "Longitude",
      children: decimalToDMS(data?.gr_position?.coordinates[0], 0) || "",
    },
    {
      label: "Fuel Remaining",
      children: data?.gr_fuelrem || "",
    },
    {
      label: "Patrol Type",
      children: data?.gr_patroltype || "",
    },
    {
      label: "Other Info",
      children: data?.gr_info || "",
    },
  ];

  const fishingColumns = [
    {
      title: "Latitude",
      key: "latitude",
      width: 250,
      dataIndex: "grd_position",
      ellipsis: false,
      render: (text, record) => {
        if (record.grd_position) {
          var val = record.grd_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          return val;
        }
      },
    },
    {
      key: "longitude",
      title: "Longitude",
      width: 250,
      dataIndex: "grd_position",
      ellipsis: false,
      render: (text, record) => {
        if (record.grd_position) {
          var val = record.grd_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          return val;
        }
      },
    },
    {
      key: "grd_qty",
      title: "Number of Vessels",
      width: 250,
      ellipsis: false,
      dataIndex: "grd_qty",
    },
    {
      key: "grd_type",
      title: "Vessel Type",
      width: 250,
      ellipsis: false,
      dataIndex: "grd_type",
    },
    {
      key: "grd_movement",
      title: "Vessel Movement",
      width: 250,
      ellipsis: false,
      dataIndex: "grd_movement",
    },
  ];
  const fishingObservedColumns = [
    {
      title: "Latitude",
      key: "latitude",
      width: 250,
      ellipsis: false,
      dataIndex: "grf_position",
      render: (text, record) => {
        if (record.grf_position) {
          var val = record.grf_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {val}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Longitude",
      key: "longitude",
      width: 250,
      ellipsis: false,
      dataIndex: "grf_position",
      render: (text, record) => {
        if (record.grf_position) {
          var val = record.grf_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {val}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Vessel Name",
      key: "grf_name",
      width: 250,
      ellipsis: false,
      dataIndex: "grf_name",
    },
    {
      key: "grf_type",
      title: "Type of Vessel",
      width: 250,
      ellipsis: false,
      dataIndex: "grf_type",
    },
    {
      key: "grf_movement",
      title: "Vessel Movement",
      width: 250,
      ellipsis: false,
      dataIndex: "grf_movement",
    },
  ];
  const merchantObservedColumns = [
    {
      title: "Latitude",
      key: "latitude",
      width: 250,
      ellipsis: false,
      dataIndex: "grm_position",
      render: (text, record) => {
        if (record.grm_position) {
          var val = record.grm_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {val}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Longitude",
      key: "Longitude",
      width: 250,
      ellipsis: false,
      dataIndex: "grm_position",
      render: (text, record) => {
        if (record.grm_position) {
          var val = record.grm_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {val}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Vessel Name",
      key: "grm_name",
      width: 250,
      ellipsis: false,
      dataIndex: "grm_name",
    },
    {
      key: "grm_type",
      title: "Type of Vessel",
      width: 250,
      ellipsis: false,
      dataIndex: "grm_type",
    },
    {
      key: "grm_movement",
      title: "Vessel Movement",
      width: 250,
      ellipsis: false,
      dataIndex: "grm_movement",
    },
    {
      key: "grm_lpoc",
      title: "LPOC",
      width: 250,
      ellipsis: false,
      dataIndex: "grm_lpoc",
    },
    {
      key: "grm_npoc",
      title: "NPOC",
      width: 250,
      ellipsis: false,
      dataIndex: "grm_npoc",
    },
  ];
  const tableItems = [
    {
      title: "Fishing Densities Observed",
      columns: fishingColumns,
      data: data?.fishingDensities,
    },
    {
      title: "Fishing Vessels Observed",
      columns: fishingObservedColumns,
      data: data?.fishingVesselObserved,
    },
    {
      title: "Merchant Vessels Observed",
      columns: merchantObservedColumns,
      data: data?.merchantVesselObserved,
    },
  ];

  return (
    <>
      <PageHeader
        showButton={false}
        showSearchBox={false}
        title="General Report"
      />

      {/* <div className="mt-4 flex">
        <Heading
          className="whitespace-nowrap ml-5 "
          level={5}
          text="Own Platform Data"
        />
      </div> */}
      <OwnPlatformForm
        disabled={true}
        form={platformForm}
      />
      <WeatherForm 
        disabled={true}
        form={weatherForm}/>
      {tableItems.map((item, index) => {
        return (
          <TableItemRenderer
            key={index}
            title={item.title}
            columns={item.columns}
            data={item.data}
            pagination={true}
            scrollConfig={{ x: true }} // Adjust x-scroll as needed
          />
        );
      })}
    </>
  );
}

export default GeneralDetails;
