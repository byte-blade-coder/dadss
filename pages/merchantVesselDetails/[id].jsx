import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Col, Descriptions, Row, Tooltip, theme } from "antd";
import PageHeader from "../../src/components/pageheader/pageHeader";
import axios from "axios";
import { decimalToDMS } from "../../src/helper/position";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Heading from "../../src/components/title/Heading";
import {
  MerVesselColumn,
  MerchantDetailColumns,
} from "../../src/helper/DataColumns";
import AntdTable from "../../src/components/table/AntdTable";
import { Modal } from "antd";
import MerchantVesselTable from "../../src/components/table/MerchantVesselTable";
import { useForm } from "antd/lib/form/Form";
import { MdViewList } from "react-icons/md";

const ExpandedTableBody = styled.div`
  .ant-table-thead {
    .ant-table-cell {
    background-color: #0942a5 !important;
      color: white;
    }
  }

  .ant-table-tbody {
    .ant-table-cell {
      background:transparent
      border-color: transparent !important;
      border-top-color:transparent
      border-radius: 0% !important;
    }

    .ant-table-row:hover > .ant-table-cell {
      background: #191970 !important;
      color: white;
      border-color: transparent !important;
      border-top-color:transparent !important
      border-radius: 0% !important;
    }
      .ant-table-row:hover .custom-a{
      color:white !important;
      cursor:pointer
    }
  }
`;

function Details({ data }) {
  const router = useRouter();
  // Retrieve merchant vessel details from the query parameter
  const { id, vessel } = router.query;
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedRowData, setClickedRowData] = useState(null);
 const [merchantForm] = useForm();
  const parsedVesselData = JSON.parse(vessel);
  const Macrocolumns = [
    { title: "ID", dataIndex: "mv_key" },
    ...MerchantDetailColumns,
  ];

  useEffect(()=>{
    if(parsedVesselData !== null || undefined){
        merchantForm.setFieldsValue(parsedVesselData);
    }
  })

  const handleDetails = (msr_key, payload) => {
    router.push({
      pathname: `/merchantvessel/specialreportdetails`,
      query: {
        msr_key: msr_key,
      },
    });
  };


  const expandedRowRender = (record, condition, index) => {
    const columns = [
      {
        title: "Longitude",
        key: "mtd_longitude",
        dataIndex: "mtd_longitude",
        width: 120,
        ellipsis: true,
        render: (text, record) => {
          if (record.mtd_longitude) {
            var val = record.mtd_longitude;
            const longitude = decimalToDMS(val, 0);
            return longitude;
          }
        },
      },
      {
        title: "Latitude",
        key: "mtd_latitude",
        dataIndex: "mtd_latitude",
        width: 120,
        ellipsis: true,
        render: (text, record) => {
          if (record.mtd_latitude) {
            var val = record.mtd_latitude;
            const latitude = decimalToDMS(val, 1);
            return latitude;
          }
        },
      },
      {
        title: "Speed",
        key: "mtd_speed",
        dataIndex: "mtd_speed",
      },
      {
        title: "Heading",
        key: "mtd_heading",
        dataIndex: "mtd_heading",
      },
      {
        title: "Time Stamp",
        key: "mtd_timestamp",
        dataIndex: "mtd_timestamp",
        ellipsis: true,
        render: (text) => {
          if (!text) return "---";

          const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          return dtg;
        },
      },
      {
        title: "Details",
        key: "mtd_key",
        dataIndex: "mtd_key",
        ellipsis: {
          showTitle: false,
        },
        render: (text, record, index) => (
          <div
            className="text-midnight font-semibold custom-a"
            onClick={() => {
              setClickedRowData(record.mtd_key);
              setModalVisible(true);
            }}
          >
            View
          </div>
        ),
      },
    ];
    const firstTable = (
      <ExpandedTableBody>
        <AntdTable
          components={{
            body: {
              wrapper: ExpandedTableBody,
            },
          }}
          pagination={true}
          columns={columns}
          scrollConfig={{ x: true }}
          data={record.trip_details}
          size="small"
          style={{ float: "right", backgroundColor: "black" }}
        />
      </ExpandedTableBody>
    );
    const secondTable = (
      <ExpandedTableBody>
        <AntdTable
          components={{
            body: {
              wrapper: ExpandedTableBody,
            },
          }}
          pagination={false}
          columns={columns}
          scrollConfig={{ x: true }}
          data={record.trip_details.length > 0 ? [record.trip_details[record.trip_details.length - 1]] : []}
          size="small"
          style={{ float: "right", backgroundColor: "black" }}
        />
      </ExpandedTableBody>
    );
    if (index === 0) {
      return firstTable;
    } else {
      return secondTable;
    }
  };

  const columns = [
    {
      title: "DSRC",
      dataIndex: "mt_dsrc",
      key: "mt_dsrc",
    },
    {
      title: "Destination",
      dataIndex: "mt_destination",
      key: "mt_destination",
    },
    {
      title: "ETA",
      key: "mt_eta",
      dataIndex: "mt_eta",
      width: 150,
      ellipsis: true,
      render: (text, record) => {
          if (!text) return "---";

        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },

    {
      title: "First Observed At",
      key: "mt_first_observed_at",
      dataIndex: "mt_first_observed_at",
      width: 150,
      ellipsis: true,
      render: (text) => {
          if (!text) return "---";

        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "Last Observed At",
      key: "mt_last_observed_at",
      dataIndex: "mt_last_observed_at",
      width: 150,
      ellipsis: true,
      render: (text) => {
        const dtg = text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "---";
        return dtg;
      },
    },
    {
      title: "Observed Duration",
      key: "mt_observed_duration",
      dataIndex: "mt_observed_duration",
    },
    {
      title: "Trip Status",
      key: "mt_trip_status",
      dataIndex: "mt_trip_status",
    },
  ];

  const expandedDetailColumns = [
    {
      title: "Longitude",
      key: "mrd_long",
      dataIndex: "mtd_longitude",
      ellipsis: true,
      render: (text, record, index) => {
        // console.log("expandedDetailColumns",record, index)
        if (record.expandedData && record.expandedData.length > 0) {
          const val = record.expandedData[0]?.mtd_longitude;
          if (val !== null && val !== undefined) {
            const longitude = decimalToDMS(val, 0);
            return longitude;
          }
        }
        return null;
      },
    },
    {
      title: "Latitude",
      key: "mtd_latitude",
      dataIndex: "mtd_latitude",
      ellipsis: true,
      render: (text, record) => {
        if (record.expandedData && record.expandedData.length > 0) {
          const val = record.expandedData[0]?.mtd_latitude;
          if (val !== null && val !== undefined) {
            const latitude = decimalToDMS(val, 1);
            return latitude;
          }
        }
        return null;
      },
    },
    {
      title: "Speed",
      key: "mtd_speed",
      dataIndex: "mtd_speed",
      render: (text, record) => record.expandedData?.[0]?.mtd_speed,
    },
    {
      title: "Heading",
      key: "mtd_speed",
      dataIndex: "mtd_heading",
      render: (text, record) => record.expandedData?.[0]?.mtd_heading,
    },
    {
      title: "Status",
      key: "mtd_status",
      dataIndex: "mtd_status",
      render: (text, record) => record.expandedData?.[0]?.mtd_status,
    },
    {
      title: "Course",
      key: "mtd_course",
      dataIndex: "mtd_course",
      render: (text, record) => record.expandedData?.[0]?.mtd_course,
    },
    {
      title: "Timestamp",
      key: "mtd_timestamp",
      dataIndex: "mtd_timestamp",
      render: (_text, record) => {
        if (record.expandedData && record.expandedData.length > 0) {
          const time = record.expandedData[0]?.mtd_timestamp;
          if (time) {
            const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
            return dtg;
          } else {
            return "No date";
          }
        } else {
          return null;
        }
      },
    },
    {
      title: "UTC Seconds",
      key: "mtd_utc_seconds",
      dataIndex: "mtd_utc_seconds",
      render: (text, record) => record.expandedData?.[0]?.mtd_utc_seconds,
    },
    {
      title: "Draught",
      key: "mtd_draught",
      dataIndex: "mtd_draught",
      render: (text, record) => record.expandedData?.[0]?.mtd_draught,
    },
    {
      title: "ROT",
      key: "mtd_rot",
      dataIndex: "mtd_rot",
      render: (text, record) => record.expandedData?.[0]?.mtd_rot,
    },
    {
      title: "Last Port",
      key: "mtd_last_port",
      dataIndex: "mtd_last_port",
      render: (text, record) => record.expandedData?.[0]?.mtd_last_port,
    },
    {
      title: "Current Port ID",
      key: "mtd_current_id",
      dataIndex: "mtd_current_id",
      render: (text, record) => record.expandedData?.[0]?.mtd_current_id,
    },
    {
      title: "Current Port",
      key: "mtd_current_port",

      dataIndex: "mtd_current_port",
      render: (text, record) => record.expandedData?.[0]?.mtd_current_port,
    },
    {
      title: "Current Port Unlocode",
      key: "mtd_current_port_unlocode",

      dataIndex: "mtd_current_port_unlocode",
      render: (text, record) =>
        record.expandedData?.[0]?.mtd_current_port_unlocode,
    },
    {
      title: "Current Port Country",
      key: "mtd_current_port_country",

      dataIndex: "mtd_current_port_country",
      render: (text, record) =>
        record.expandedData?.[0]?.mtd_current_port_country,
    },
    {
      title: "Next Port ID",
      key: "mtd_next_port_id",

      dataIndex: "mtd_next_port_id",
      render: (text, record) => record.expandedData?.[0]?.mtd_next_port_id,
    },
    {
      title: "Next Port",
      key: "mtd_next_port_name",

      dataIndex: "mtd_next_port_name",
      render: (text, record) => record.expandedData?.[0]?.mtd_next_port_name,
    },
    {
      title: "Next Port Unlocode",
      key: "mtd_next_port_unlocode",

      dataIndex: "mtd_next_port_unlocode",
      render: (text, record) =>
        record.expandedData?.[0]?.mtd_next_port_unlocode,
    },
    {
      title: "Next Port Country",
      key: "mtd_next_port_name",

      dataIndex: "mtd_next_port_country",
      render: (text, record) => record.expandedData?.[0]?.mtd_next_port_country,
    },
    {
      title: "ETA Calculated",
      key: "mtd_eta_calc",

      dataIndex: "mtd_eta_calc",
      render: (_text, record) => {
        if (record.expandedData && record.expandedData.length > 0) {
          const time = record.expandedData[0]?.mtd_eta_calc;
          if (time) {
            const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
            return dtg;
          } else {
            return "-";
          }
        } else {
          return null;
        }
      },
    },
    {
      title: "ETA Updated",
      key: "mtd_eta_updated",

      dataIndex: "mtd_eta_updated",
      render: (_text, record) => {
        if (record.expandedData && record.expandedData.length > 0) {
          const time = record.expandedData[0]?.mtd_eta_updated;
          if (time) {
            const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
            return dtg;
          } else {
            return "-";
          }
        } else {
          return null;
        }
      },
    },
    {
      title: "Distance to go",
      key: "mtd_distance_to_go",

      dataIndex: "mtd_distance_to_go",
      render: (text, record) => record.expandedData?.[0]?.mtd_distance_to_go,
    },
    {
      title: "Distance Travelled",
      key: "mtd_distance_travelled",

      dataIndex: "mtd_distance_travelled",
      render: (text, record) =>
        record.expandedData?.[0]?.mtd_distance_travelled,
    },
    {
      title: "Average Speed",
      key: "mtd_awg_speed",

      dataIndex: "mtd_awg_speed",
      render: (text, record) => record.expandedData?.[0]?.mtd_awg_speed,
    },
    {
      title: "Maximum Speed",
      key: "mtd_max_speed",

      dataIndex: "mtd_max_speed",
      render: (text, record) => record.expandedData?.[0]?.mtd_max_speed,
    },
  ];

  const msr_columns = [
    {
      title: "Platform ID",
      dataIndex: "msr_pf_id",
      key: "msr_pf_id",
      filtertype: "unique",
      render: (text) => {
        return text;
      },
    },
    {
      title: "Date Time",
      key: "msr_dtg",
      dataIndex: "msr_dtg",
      sorttype: "date",
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      key: "latitude",
      title: "Latitude",
      dataIndex: "msr_position",
      sorter: (a, b) => {
        const latA = a.msr_position ? a.msr_position.coordinates[1] : null;
        const latB = b.msr_position ? b.msr_position.coordinates[1] : null;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.msr_position) {
          var val = record.msr_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          // return latitude;
          return (
            <Tooltip title={`${latitude}`}>
              <span>{val}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      key: "longitude",
      title: "Longitude",
      dataIndex: "msr_position",
      sorter: (a, b) => {
        const latA = a.msr_position ? a.msr_position.coordinates[0] : null;
        const latB = b.msr_position ? b.msr_position.coordinates[0] : null;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.sr_position) {
          var val = record.msr_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          // return longitude;
          return (
            <Tooltip title={`${longitude}`}>
              <span>{val}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      key: "msr_patroltype",
      title: "Patrol Type",
      dataIndex: "msr_patroltype",
      filtertype: "unique",
      render: (text) => {
        return Array.isArray(text) ? text.join(", ") : text;
      },
    },
    {
      key: "msr_action",
      title: "Action",
      dataIndex: "msr_action",
      filtertype: "unique",
      render: (text) => {
        return text;
      },
    },
    {
      title: "View",
      dataIndex: "action",
      key: "action",
      checkbox: false,
      render: (text, record) => {
        if (record.msr_key) {
          return (
            <div>
              <a
                className="text-midnight font-semibold"
                onClick={() => handleDetails(record?.msr_key, record)}
              >
                <MdViewList size={20} />
              </a>
            </div>
          );
        }
      },
    },
  ];


  const filteredData = data
  .filter((item) => {
    const hasMatchingTrip = item.expandedData.some((expandedItem) => {
      const matchingTrips = expandedItem.trip_details.filter((trip) => {
        return trip.mtd_key === clickedRowData && trip.mtd_max_speed !== null;
      });
      return matchingTrips.length > 0;
    });

    return hasMatchingTrip;
  })
  .map((item) => {
    const newExpandedData = item.expandedData.map((expandedItem) => {
      const filteredTrips = expandedItem.trip_details.filter((trip) => {
        return trip.mtd_key === clickedRowData && trip.mtd_max_speed !== null;
      });

      return {
        ...expandedItem,
        trip_details: filteredTrips,
      };
    }).filter(expandedItem => expandedItem.trip_details.length > 0); // Remove empty ones

    return {
      ...item,
      expandedData: newExpandedData,
    };
  });

  return (
    <>
      <div>
        <PageHeader
          title="Merchant Vessel"
          showButton={false}
          showSearchBox={false}
        />
      </div>
      {/*----------------------------------- Vessel Data -------------------------------------*/}
      <div className="">
        <Heading className="ml-5 " level={4} text=" Merchant Vessel Data" />
      </div>
      <MerchantVesselTable
        disabled={true}
        vesselForm={merchantForm}
        tripDetails={true}
      ></MerchantVesselTable>
      <div className="flex mb-4">
        <Heading
          className="whitespace-nowrap ml-5 "
          level={5}
          text="Last/Current Port"
        />
      </div>
      <section>
        <AntdTable
          scrollConfig={{ x: true }}
          pagination={true}
          columns={columns}
          data={data.length > 0 ? [data[0].expandedData[data[0].expandedData.length - 1]] : []}
          expandable={{
            // expandedRowRender,
            // defaultExpandedRowKeys: ["0"],
            expandedRowRender: (record, index) =>
              expandedRowRender(record, index, 1),
            defaultExpandedRowKeys: ["0"],
          }}
        />
      </section>

      <div className="flex mb-4">
        <Heading className="whitespace-nowrap ml-5 " level={5} text="History" />
      </div>
      <section className="mb-10">
        <AntdTable
          scrollConfig={{ x: true }}
          pagination={true}
          columns={columns}
          data={data[0].expandedData}
          expandable={{
            // expandedRowRender,
            // defaultExpandedRowKeys: ["0"],
            expandedRowRender: (record, index) =>
              expandedRowRender(record, index, 0),
            defaultExpandedRowKeys: ["0"],
          }}
        />
      </section>

      <div className="flex mb-4">
        <Heading className="whitespace-nowrap ml-5 " level={5} text="Special Reports" />
      </div>
      <section className="mb-10">
        <AntdTable
          scrollConfig={{ x: true }}
          pagination={true}
          columns={msr_columns}
          data={data[0].reports ? data[0].reports : []}
        />
      </section>

      <div className="descriptionTable">
        <Modal
          width={"85%"}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Heading
            className="whitespace-nowrap ml-1"
            level={4}
            text="Observations"
          />
          <Descriptions
            size="small"
            className="p-2"
            bordered={true}
            colon={true}
            borderColor="transparent"
            column={{ xs: 1, sm: 2, md: 2, lg: 3 }}
          >
            {filteredData[0]?.expandedData?.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {expandedDetailColumns.map((column, colIndex) => (
                  <Descriptions.Item
                    key={colIndex}
                    className="flex-container justify-between  "
                    // Conditionally set the colspan for the last column
                    span={
                      colIndex === expandedDetailColumns.length - 1
                        ? 1
                        : undefined
                    }
                  >
                    <>
                      <Row className="flex">
                        <Col
                          span={10}
                          className="flex justify-start align-center "
                          style={{
                            marginTop: "5px",
                          }}
                        >
                          <div className="descriptionLabel">{column.title}</div>
                        </Col>
                        <Col
                          span={14}
                          className="flex justify-end align-center"
                        >
                          <div
                            className="descriptionChildren mr-5"
                            style={{
                              padding: "4px",
                            }}
                          >
                            {column.render(null, {
                              expandedData: row.trip_details,
                            }) || "--"}
                          </div>
                        </Col>
                      </Row>
                    </>
                  </Descriptions.Item>
                ))}
              </React.Fragment>
            ))}
          </Descriptions>
        </Modal>
      </div>
    </>
  );
}

export default Details;

export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    // Fetching data from the backend API based on the 'id' parameter
    // const response = await axios.get(
    //   `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant_vessels/${id}`
    // );
     const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant_vessel_view/${id}`
    );
    
    if (response.status === 200) {
      const data = response.data;

      // console.log("data", data)

      const dataWithExpandedData =
      {
        ...data.merchant_vessel,
        expandedData: data.trips.map(trip => ({
          ...trip,
          key: trip.mt_key, // Add a key field to each trip
        })),
        reports: data.reports
        // reports: data.reports?.map(report=> ({
        //   ...report,
        //   key: report?.key,
        // })),
      }

      return {
        props: {
          data: [dataWithExpandedData],
        },
      };
    }
  } catch (error) {
    console.log(error)
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }
}
