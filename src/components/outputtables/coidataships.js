import React, { useState,useRef, useEffect } from "react";
import { Col, Row, Table, Form, Modal } from "antd";
import Heading from "../title/Heading";
import Tooltip from "antd/lib/tooltip/index.js";
import SimpleButton from "../button/SimpleButton";
import { useRouter } from "next/router.js";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import PositionBox from "../form/PositionBox";
import AntdTableIndex from "../table/AntdTableIndex.js";
import AntdTable from "../table/AntdTable.js";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import coidataships from "../../data/coidataships.json";
import PageHeaderStyled from "../pageheader/pageHeaderStyled.js";
import DateBox from "../form/DateBox";
import { useDispatch, useSelector } from "react-redux";
import { addCOIdataship } from "../../redux/thunks/coiVesselData.js";
import { fetchCoiData } from "../../redux/thunks/patroltypeBasedData.js";

// function COIdataships({filteredDataSource,setFilteredDataSource})
function COIdataships({coiReport,setCoiReport, apidata}) {
  console.log("Data from CSV: ", coiReport)
  const [searchData, setSearchData] = useState({ ssr_table: 'COI DATA SHIPS' });

  const router = useRouter();
  const { data, isLoading } = useSelector(
    (state) => state.fetchCoiData
  );

  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = true; // Assuming permission is granted
  console.log("filteredDataSource", filteredDataSource, "\nsetFilteredDataSource", setFilteredDataSource)
  
  const dispatch = useDispatch();
  const [coiReportForm] = useForm();
  const [coiReportKey, setCoiReportKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    coiReportColumn: false,
  });

  console.log("COI SHIPS data",data, apidata)
  
  useEffect(() => {
    dispatch(fetchCoiData(searchData.ssr_table));
  }, [searchData]);


  const handleCoiReportColumnShowInput = () => {
    coiReportForm.resetFields();
    setShowInputs({ ...showInputs, coiReportColumn: true });
    coiReportForm.setFieldValue(["ps_position", "dms", 0, "dir"], "E");
    coiReportForm.setFieldValue(["ps_position", "dms", 1, "dir"], "N");
  };

  const handleCoiReportColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, coiReportColumn: false });
      },
    });
  };

  const handleCoiReportDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setCoiReport((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    coiReportForm.resetFields();
  };

  const isCoiReportEditing = (record_index) => record_index === coiReportKey;

  const coiReportEdited = (key) => {
    const editedValues = coiReportForm.getFieldValue();
    const newEdited = {
      ...editedValues,
      // ps_position: {
      //   ...editedValues.ps_position,
      //   type: "Point",
      //   coordinates: DMStodecimal(editedValues.ps_position.dms),
      // },
    };
    setCoiReport((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setCoiReportKey("");
    coiReportForm.resetFields();
  };

  const onCoiReportFinish = async () => {
    const validatedValues = await coiReportForm.validateFields();
    // Log the data
    if (validatedValues) {
      setCoiReport((current) => [
        ...current,
        {
          ...validatedValues,

          // ps_position: {
          //   ...validatedValues.ps_position,
          //   type: "Point",
          //   coordinates: DMStodecimal(validatedValues.ps_position.dms),
          // },
        },
      ]);
      toast.success(`Data Added Successfully`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, coiReportColumn: false });
      coiReportForm.resetFields();
    }
  };

  const sendCoiReport = async () => {
    try {
      const finalData = coiReport;
      // Dispatch the action with the data
      dispatch(addCOIdataship(finalData));
      setCoiReport([]);
    } catch (error) {}
  };

  const coiReportColumn = [
    {
      key: "ssr_key",
      title: "S. NO",
      dataIndex: "ssr_key",
    },
    {
      key: "ssr_own_ship",
      title: "Source",
      dataIndex: "ssr_own_ship",
    },
    {
      key: "ssr_dtg",
      title: "Date",
      dataIndex: "DATE",
      width: 250,
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD");
        return dtg;
      },
  },
  {
    title: "Year",
    key: "year",
    dataIndex: "year",
    filtertype: 'search',
  },
  {
    title: "Latitude",
    key: "latitude",
    dataIndex: "latitude",
    sorter: (a, b) => {
      const latA = a.latitude ? a.latitude.coordinates[1] : null;
      const latB = b.latitude ? b.latitude.coordinates[1] : null;
      // Handle null or undefined values
      if (latA === null || latA === undefined) return -1;
      if (latB === null || latB === undefined) return 1;
      return latA - latB;
    },
    render: (text, record) => {
      if (record.latitude) {
        const val = record.latitude;
        const latitude = decimalToDMS(val, 1);
        return (
          <Tooltip title={`${latitude}`}>
            <span>{val}</span>
          </Tooltip>
        );
      } else {
        return "N/A"; // or any other placeholder for null or undefined data
      }
    },
  },
  {
    key: "longitude",
    title: "Longitude",
    dataIndex: "longitude",
    sorter: (a, b) => {
      const latA = a.longitude ? a.longitude.coordinates[0] : null;
      const latB = b.longitude ? b.longitude.coordinates[0] : null;

      // Handle null or undefined values
      if (latA === null || latA === undefined) return -1;
      if (latB === null || latB === undefined) return 1;
      return latA - latB;
    },
    render: (text, record) => {
      if (record.longitude) {
        var val = record.longitude;
        const longitude = decimalToDMS(val, 0);
        // return latitude;
        return (
          <Tooltip title={`${longitude}`}>
            <span>{val}</span>
          </Tooltip>
        );
      }
    },
  },
    {
      key: "ssr_no_of_fvs",
      title: "No of FVs",
      dataIndex: "ssr_no_of_fvs",
      width: 250,
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
          isCoiReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              name="ssr_no_of_fvs"
              type="number"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "ssr_boat_name",
      title: "Name",
      dataIndex: "ssr_boat_name",
      filtertype: 'unique',
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
        isCoiReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ssr_boat_name"
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "ssr_sfd_bfd",
      title: "SFD-BFD",
      dataIndex: "ssr_sfd_bfd",
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
        isCoiReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ssr_sfd_bfd"
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "ssr_boat_regno",
      title: "Reg No",
      dataIndex: "ssr_boat_regno",
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
        isCoiReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ssr_boat_regno"
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },

    {
      key: "ssr_person",
      title: "NAKWA Name",
      dataIndex: "ssr_person",
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
        isCoiReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ssr_boat_regno"
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "ssr_person",
      title: "Owner Name",
      dataIndex: "ssr_person",
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
        isCoiReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ssr_boat_regno"
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "ssr_course",
      title: "Course",
      dataIndex: "ssr_course",
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
        isCoiReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ssr_boat_regno"
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "ssr_no_of_crew",
      title: "Crew",
      dataIndex: "ssr_no_of_crew",
      filtertype: 'number',
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
          isCoiReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              name="ssr_no_of_fvs"
              type="number"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "ssr_speed",
      title: "Speed",
      dataIndex: "ssr_speed",
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
        isCoiReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ssr_boat_regno"
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "ssr_country",
      title: "Nationality",
      dataIndex: "ssr_country",
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
        isCoiReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ssr_boat_regno"
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "ssr_fish_position",
      title: "Position",
      dataIndex: "ssr_fish_position",
      render: (text, record, index) => {
        return (showInputs.coiReportColumn && index === 0) |
        isCoiReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ssr_boat_regno"
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];
  const columns = [
    {
      key: "S. NO",
      title: "S. NO",
      dataIndex: "S. NO",
    },
    {
      key: "Source",
      title: "Source",
      dataIndex: "Source",
    },
    {
      key: "Date",
      title: "Date",
      dataIndex: "Date",
    },
    {
      key: "TIME",
      title: "Time",
      dataIndex: "TIME",
    },
    {
      key: "No of FVs",
      title: "No of FVs",
      dataIndex: "No of FVs",
    },
    {
      key: "NAME",
      title: "Name",
      dataIndex: "NAME",
      //sorttype: 'none'
    },
    {
      key: "SFD-BFD",
      title: "SFD-BFD",
      dataIndex: "SFD-BFD",
      //sorttype: 'none'
    },
    {
      key: "Reg NO",
      title: "Reg No",
      dataIndex: "Reg NO",
    },

    {
      key: "NAKWA Name",
      title: "NAKWA Name",
      dataIndex: "NAKWA Name",
    },
    {
      key: "Owner Name",
      title: "Owner Name",
      dataIndex: "Owner Name",
    },
    {
      key: "Course",
      title: "Course",
      dataIndex: "Course",
    },
    {
      key: "CREW",
      title: "Crew",
      dataIndex: "CREW",
    },
    {
      key: "Speed",
      title: "Speed",
      dataIndex: "Speed",
    },
    {
      key: "Nationality",
      title: "Nationality",
      dataIndex: "Nationality",
    },
    {
      key: "POSITION",
      title: "Position",
      dataIndex: "POSITION",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];

  const columnsapi = [
    {
      key: "ssr_own_ship",
      title: "Source",
      dataIndex: "ssr_own_ship",
      filtertype: 'unique',
    },
    {
      key: "ssr_dtg",
      title: "Date",
      dataIndex: "ssr_dtg",
      width: 250,
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD");
        return dtg;
      },
    },
    {
      title: "Year",
      key: "year",
      dataIndex: "ssr_year",
      filtertype: 'search',
    },
    {
      title: "Latitude",
      key: "latitude",
      dataIndex: "latitude",
      sorter: (a, b) => {
        const latA = a.ssr_position.latitude ? a.ssr_position.latitude.coordinates[1] : null;
        const latB = b.ssr_position.latitude ? b.ssr_position.latitude.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.ssr_position) {
          const val = record.ssr_position.latitude;
          const latitude = decimalToDMS(val, 1);
          return (
            <Tooltip title={`${val}`}>
              <span>{latitude}</span>
            </Tooltip>
          );
        } else {
          return "N/A"; // or any other placeholder for null or undefined data
        }
      },
    },
    {
      key: "longitude",
      title: "Longitude",
      dataIndex: "longitude",
      sorter: (a, b) => {
        const latA = a.ssr_position.longitude ? a.ssr_position.longitude.coordinates[0] : null;
        const latB = b.ssr_position.longitude ? b.ssr_position.longitude.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      render: (text, record) => {
        if (record.ssr_position) {
          var val = record.ssr_position.longitude;
          const longitude = decimalToDMS(val, 0);
          // return latitude;
          return (
            <Tooltip title={`${val}`}>
              <span>{longitude}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      key: "ssr_no_of_fvs",
      title: "No of FVs",
      dataIndex: "ssr_no_of_fvs",
      filtertype: 'number',
      sorttype: 'number',
    },
    {
      key: "ssr_boat_name",
      title: "Name",
      dataIndex: "ssr_boat_name",
      filtertype: 'search',
      //sorttype: 'none'
    },
    {
      key: "ssr_sfd_bfd",
      title: "SFD-BFD",
      dataIndex: "ssr_sfd_bfd",
      filtertype: 'search',
      //sorttype: 'none'
    },
    {
      key: "ssr_boat_regno",
      title: "Reg No",
      dataIndex: "ssr_boat_regno",
      filtertype: 'search',
    },

    {
      key: "nakwa_name",
      title: "NAKWA Name",
      dataIndex: "nakwa_name",
      filtertype: 'search',
      render: (text, record) => {
        if (!record.ssr_person) return "---";
        const dtg = record.ssr_person;
        return dtg;
      },
    },
    {
      key: "owner_name",
      title: "Owner Name",
      dataIndex: "owner_name",
      filtertype: 'search',
    },
    {
      key: "ssr_course",
      title: "Course",
      dataIndex: "ssr_course",
      filtertype: 'search',
    },
    {
      key: "ssr_no_of_crew",
      title: "Crew",
      dataIndex: "ssr_no_of_crew",
      filtertype: 'number',
      sorttype: 'number',
    },
    {
      key: "ssr_speed",
      title: "Speed",
      dataIndex: "ssr_speed",
      filtertype: 'unique',
    },
    {
      key: "ssr_country",
      title: "Nationality",
      dataIndex: "ssr_country",
      filtertype: 'unique',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];

  return (
    <>
      {coiReport ? (
         <Row className="items-center mb-4">
         <Col span={6}></Col>
         <Col span={18} className="flex justify-end mt-4 mb-3">
           <FilledButton
             disabled={coiReport.length == 0}
             style={{ marginLeft: "auto" }}
             text="Save Report"
             onClick={sendCoiReport}
             className="rounded-full border-lightgreen bg-lightgreen text-white mr-6"
           />
         </Col>
         <Col span={24} className="flex justify-between mb-3 ">
           <Heading
             level={5}
             className="  whitespace-nowrap ml-5"
             text="COI Report"
           />
           <FilledButton
             text="+ Add COI Report"
             className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
             onClick={handleCoiReportColumnShowInput}
             disabled={coiReport.length === 0 && !showInputs.coiReportColumn}
           />
           <FilledButton
             text="+ Add "
             className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
             onClick={handleCoiReportColumnShowInput}
             disabled={coiReport.length === 0 && !showInputs.coiReportColumn}
           />
         </Col>
       </Row>
      ) : (
        <PageHeaderIndex
          title="COI Data Ships"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      )}
      {viewPermission ? (
        <div>
          {coiReport ? (
            <AntdTable
              scrollConfig={{ x: true }} // Set the scroll property as per your requirements
              columns={columns}
              //data={showInputs.coiReportColumn ? [{}, ...coiReport] : coiReport}
              data={coiReport}
              pagination={true}
              form={coiReportForm}
              onFinish={onCoiReportFinish}
            />
          ) : apidata? (
            <AntdTableIndex
              columns={columnsapi}
              data={data}
              loading={isLoading}
              setFilteredDataSource={setFilteredDataSource}
              componentRef={componentRef}
            />
          ) : (
            <AntdTableIndex
              columns={columns}
              data={coidataships}
              loading={false}
              setFilteredDataSource={setFilteredDataSource}
              componentRef={componentRef}
            />
          )}
        </div>
      ) : (
        <Forbidden></Forbidden>
      )}
    </>
  );
}

export default COIdataships;


const StyledDiv = styled.div`
padding:60px,
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
`;
const IconsStylingWrap = styled.div`
  display: flex;
  /* gap: 20px; */
  .editIcon {
    color: #28387e;
    background-color: #f0f3f8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .deleteIcon {
    color: #e96162;
    background-color: #f9e7e8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    cursor: pointer;
  }
`;