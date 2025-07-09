import React, { useEffect, useRef, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { Button, Checkbox, Form, Modal, Result } from "antd";
import SimpleButton from "../../src/components/button/SimpleButton";
import InputBox from "../../src/components/form/InputBox";
import SelectBox from "../../src/components/form/SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPlatformData } from "../../src/redux/thunks/platformData";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { MdModeEditOutline } from "react-icons/md";
import { RxArrowLeft } from "react-icons/rx";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { useRouter } from "next/router";
import { extractUniqueValues } from "../../src/helper/filters";
import { AiFillFilter } from "react-icons/ai";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import AntdTableIndexStyled from "../../src/components/table/AntdTableStyled";
import { hasPermission } from "../../src/helper/permission";
import Forbidden from "../403";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import { parse } from "cookie";

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
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

const req_rule = {
  required: true,
  message: "Required",
};

function PlatformId() {
  const router = useRouter();
  const [showInputs, setShowInputs] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [form] = useForm();
  const { data, isLoading, error } = useSelector(
    (state) => state.fetchPlatformData
  );
  const dispatch = useDispatch();
  // Define state to store the options data
  const [platformTypes, setPlatformTypes] = useState([]);
  const [platformSq, setPlatformSq] = useState([]);
  const [selectedType, setSelectedType] = useState(null); // Added selectedType state
  const [selectedSquadron, setSelectedSquadron] = useState(null);
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const [platformKey, setPlatformKey] = useState("");
  const componentRef = useRef();
  const viewPermission = hasPermission("view_platforms");
  const addPermission = hasPermission("add_platforms");
  const editPermission = hasPermission("change_platforms");
  
  const fetchPlatformTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform_type`
      );
      const types = response.data.map((item) => ({
        // value: item.type_key,
        value: item.type_title,
        label: item.type_title,
      }));
      setPlatformTypes(types.filter((item) => item !== ""));
    } catch (error) {
      console.error("Error fetching platform types:", error);
    }
  };

  const fetchPlatformSquardon = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform_squadron`
      );
      const types = response.data.map((item) => ({
        // value: item.squadron_key,
        value: item.squadron_title,
        label: item.squadron_title,
      }));
      setPlatformSq(types);
    } catch (error) {
      console.error("Error fetching platform Sq:", error);
    }
  };

  useEffect(() => {
    fetchPlatformTypes();
    fetchPlatformSquardon();
  }, []);

  useEffect(() => {
    dispatch(fetchAllPlatformData(searchData));
  }, [searchData]);

  const isPlatformEditing = (record_index) => record_index === platformKey;

  const PlatformDataEdited = async (key) => {
    const validatedValues = await form.validateFields();
    const editedValues = form.getFieldValue();
    console.log(editedValues)
    
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform/${editedValues.pf_key}`,
        editedValues
      );
      if (response.status === 201 || response.status === 200) {
        showToastSuccess("Platform Data Edited");
      } else {
        // For other errors, display the default error message
        showToastError("Error editing platform");
      }
      dispatch(fetchAllPlatformData());
      fetchPlatformTypes();
      fetchPlatformSquardon();
    } catch (error) {
      showToastError("Error editing platform");
    }
    reset();
  };

  const buttonStyle = {
    position: "absolute",
    right: 5,
    top: -5,
    border: "none",
    background: "none",
    color: "blue",
    cursor: "pointer",
    fontSize: 20,
    fontWeight: "bold",
  };

  const columns = [
    {
      title: "Platform ID",
      dataIndex: "pf_id",
      key: "pf_id",
      description: "Full ID of platform",
      filtertype: "search",
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                style={{ width: 150 }}
                placeholder="Platform ID"
                name="pf_id"
                minLength={1}
                maxLength={50}
                rules={[
                  req_rule,
                 
                ]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Full Name",
      dataIndex: "pf_name",
      key: "pf_name",
      filtertype: "search",
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                style={{ width: 150 }}
                placeholder="Name"
                name="pf_name"
                minLength={3}
                maxLength={15}
                rules={[req_rule]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Type",
      key: "pf_type",
      dataIndex: "pf_type",
      filtertype: "unique",
      filterSearch: true,
      // width:500,
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <>
                {selectedType !== "Others" ? (
                  <SelectBox
                    placeholder="Select Type"
                    name="pf_type"
                    style={{ width: 150 }}
                    rules={[req_rule]}
                    options={[
                      ...platformTypes,
                      // { value: "Air Carft", label: "Air Carft" },
                      { value: "Others", label: "Others" },
                    ]}
                    onChange={(value) => {
                      setSelectedType(value);
                      form.setFieldsValue({
                        pf_type: value !== "Others" ? value : "",
                      });
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: 180,
                      }}
                    >
                      <InputBox
                        rules={[req_rule]}
                        placeholder="Enter New Type"
                        name="pf_type"
                        // style={{ width: 150 }}
                      />
                      <Button
                        style={buttonStyle}
                        onClick={() => {
                          // Logic to show SelectBox and hide InputBox
                          setSelectedType(""); // Example of resetting state
                        }}
                      >
                        &#x21A9;{" "}
                        {/* Leftwards Arrow With Hook for back symbol */}
                      </Button>
                    </div>
                  </>
                )}
              </>
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Squadron",
      key: "pf_squadron",
      dataIndex: "pf_squadron",
      filterSearch: true,
      filtertype: "unique",
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <>
                {selectedSquadron !== "Others" ? (
                  <SelectBox
                    placeholder="Vessels"
                    name="pf_squadron"
                    style={{ width: 150 }}
                    rules={[req_rule]}
                    options={[
                      ...platformSq,
                      { value: "Others", label: "Others" },
                    ]}
                    onChange={(value) => {
                      setSelectedSquadron(value);
                      form.setFieldsValue({
                        pf_squadron: value !== "Others" ? value : "",
                      });
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: 180,
                      }}
                    >
                      <InputBox
                        rules={[req_rule]}
                        placeholder="Enter New Squadron"
                        name="pf_squadron"
                      />
                      <Button
                        style={buttonStyle}
                        onClick={() => {
                          // Logic to show SelectBox and hide InputBox
                          setSelectedSquadron(""); // Example of resetting state
                        }}
                      >
                        &#x21A9;{" "}
                        {/* Leftwards Arrow With Hook for back symbol */}
                      </Button>
                    </div>
                  </>
                )}
              </>
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "CO",
      key: "pf_co",
      dataIndex: "pf_co",
      filterSearch: true,
      filtertype: "unique",
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                placeholder="CO"
                name="pf_co"
                rules={[req_rule]}
                style={{ width: 150 }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Status",
      dataIndex: "pf_status",
      key: "pf_status",
      filterSearch: true,
      filtertype: "unique",
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <SelectBox
                placeholder="Status"
                name="pf_status"
                style={{ width: 150 }}
                rules={[req_rule]}
                options={[
                  {
                    value: "OPS",
                    label: "OPS",
                  },
                  {
                    value: "Non-OPS",
                    label: "Non-OPS",
                  },
                ]}
                onChange={(value) => {
                  form.setFieldsValue({ pf_status: value });
                }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },

    // {
    //   title: "Source",
    //   dataIndex: "pf_source",
    //   key: "pf_source",
    //   filterSearch: true,
    //   filtertype: "unique",
    //   render: (text, record, index) => {
    //     if ((showInputs && index === 0) | isPlatformEditing(index)) {
    //       return (
    //         <StyledInput>
    //           <SelectBox
    //             placeholder="Source"
    //             name="pf_source"
    //             style={{ width: 150 }}
    //             rules={[req_rule]}
    //             options={[
    //               {
    //                 value: "Air Carft",
    //                 label: "Air Carft",
    //               },
    //               {
    //                 value: "Ship",
    //                 label: "Ship",
    //               },
    //             ]}
    //             onChange={(value) => {
    //               form.setFieldsValue({ pf_source: value });
    //             }}
    //           />
    //         </StyledInput>
    //       );
    //     } else {
    //       return text;
    //     }
    //   },
    // },
    {
      title: "Fuel Capacity",
      dataIndex: "pf_fuelcap",
      key: "pf_fuelcap",
      sorter: null,
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                placeholder="Fuel Capacity"
                name="pf_fuelcap"
                style={{ width: 150 }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Fresh Water Capacity",
      dataIndex: "pf_watercap",
      key: "pf_watercap",
      sorter: null,
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                placeholder="Fresh Water Capacity"
                name="pf_watercap"
                style={{ width: 150 }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Other Info",
      dataIndex: "pf_info",
      key: "pf_info",
      sorter: null,
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                placeholder="Other Info"
                name="pf_info"
                style={{ width: 150 }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <Form.Item style={{ display: "flex" }}>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  htmlType="submit"
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "#51AE3B",
                  }}
                  text="Save"
                />
              </div>
            </Form.Item>
          );
        }
        if (!showInputs) {
          if (data.length && !isPlatformEditing(index)) {
            if (editPermission) {
              return (
                <IconsStylingWrap>
                  <>
                    <MdModeEditOutline
                      className="editIcon"
                      onClick={() => {
                        setPlatformKey(index);
                        form.setFieldsValue(record);
                      }}
                      disable={showInputs}
                    />
                  </>
                </IconsStylingWrap>
              );
            }
          }

          if (isPlatformEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    // onClick={() => {
                    //   setPlatformKey("");
                    // }}
                    onClick={() => {
                      // handleCancel();
                      setPlatformKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />

                  <SimpleButton
                    onClick={() => {
                      PlatformDataEdited(index);
                    }}
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#ffbf00",
                    }}
                    text="Edit"
                  />
                </div>
              </Form.Item>
            );
          }
        }
      },
    },
  ];

  const reset = () => {
    setPlatformKey("");
    setSelectedType(null);
    setSelectedSquadron(null);
    form.resetFields();
  };

  const handleShowInput = () => {
    setShowInputs(true);
    reset();
  };

  const handleCancel = (event) => {
    Modal.confirm({
      title: `Are you sure, you want to cancel?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs(false);
        reset();
      },
    });
  };

  const onFinish = async () => {
    const validatedValues = await form.validateFields();
    if (validatedValues) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`,
          validatedValues
        );
        if (response.status === 201) {
          showToastSuccess("Platform Data Saved");
          dispatch(fetchAllPlatformData());
          fetchPlatformTypes();
          fetchPlatformSquardon();
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Customize the error message for 403 Forbidden error
          showToastError("You are not authorized to perform this action.");
        } else {
          // For other errors, display the default error message
          if (error?.response?.data?.error){
            showToastError(error?.response?.data?.error);
          }else{
            showToastError(`${error}`);
          }
        }
      }
      setShowInputs(false);
      reset();
    }
  };

  return (
    <>
      {viewPermission ? (
        <>
          <div>
            <PageHeaderStyled
              hover="Rapid access to platform data"
              title="Platform Data"
              btnTitle={"Add Platform"} // Render the button only if access is not denied
              btnTitleMedia="+"
              onSearchChange={setSearchData}
              onNavigate={handleShowInput}
              placeholder="Search by Platform ID / Full Name "
              showButton={addPermission}
              currentData={viewPermission ? filteredDataSource : null}
              componentRef={viewPermission ? componentRef : null}
            />
          </div>
          <AntdTableIndex
            form={form}
            onFinish={onFinish}
            columns={columns}
            data={showInputs ? [{
              "pf_id": "",
              "pf_name": "",
              "pf_co": "",
              "pf_info": "",
              "pf_status": null,
              "pf_rdt": null,
              "pf_type": "",
              "pf_squadron": ""
          }, ...data] : data}
            loading={isLoading}
            setFilteredDataSource={setFilteredDataSource}
            componentRef={componentRef}
          />
        </>
      ) : (
        <Forbidden></Forbidden>
      )}
    </>
  );
}

export default PlatformId;

export async function getServerSideProps(context) {
  // const accessToken = localStorage.getItem("accessToken");
  // try {
  //   const response = await axios.get(
  //     `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`,
  //     {
  //       headers: { Authorization: `JWT ${accessToken}` },
  //     }
  //   );

  //   if (response.status === 200) return response.data;
  // } catch (error) {
  //   // if (error.response?.status === 401) {
  //     console.error(error);
  // }
  return {
    props: {
      data: {
        title: "Platform Data",
      },
    },
  };
}

// export async function getStaticProps(context) {
//   // const cookies = parse(context?.req?.headers?.cookie || '');
//   // console.log("req info", context.req.headers)
//   // const accessToken = cookies.accessToken;

//   // if (!accessToken) {
//   //   console.log("no access token")
//   //   return {
//   //     redirect: {
//   //       destination: '/dashboard', // or handle unauthorized
//   //       permanent: false,
//   //     },
//   //   };
//   // }

//   try {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`,
//       // {
//       //   headers: { Authorization: `JWT ${accessToken}` },
//       // }
//     );

//     if (response.status === 200) {
//       return {
//         props: {
//           data: response.data,
//         },
//       };
//     }
//   } catch (error) {
//     console.error(error);
//   }

//   return {
//     props: {
//       data: {
//         title: "Fallback Platform Data",
//       },
//     },
//   };
// }