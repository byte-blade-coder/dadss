import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Form, Modal, Result, Tooltip } from "antd";
import SimpleButton from "../../src/components/button/SimpleButton";
import InputBox from "../../src/components/form/InputBox";
import PositionBoxN from "../../src/components/form/PositionBoxNew";
import SelectBox from "../../src/components/form/SelectBox";
import PositionBox from "../../src/components/form/PositionBoxNew";
import { useDispatch, useSelector } from "react-redux";
import { addJettyData, fetchAllJettyData } from "../../src/redux/thunks/jettyData";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import { MdModeEditOutline } from "react-icons/md";
import { useRouter } from "next/router";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import { hasPermission } from "../../src/helper/permission";
import Forbidden from "../403";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import { decimalToDMS } from "../../src/helper/position"; 

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

function Jetty() {
  const router = useRouter();
  const [showInputs, setShowInputs] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [form] = useForm();
  const { data, isLoading, error } = useSelector(
    (state) => state.fetchJettyData
  );
  const dispatch = useDispatch();
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const [platformKey, setPlatformKey] = useState("");
  const componentRef = useRef();
  const viewPermission = hasPermission("view_platforms");
  const addPermission = hasPermission("add_platforms");
  const editPermission = hasPermission("change_platforms");

  useEffect(() => {
    dispatch(fetchAllJettyData(searchData));
  }, [searchData]);

  const isPlatformEditing = (record_index) => record_index === platformKey;

  const columns = [
    {
      title: "Jetty Name",
      dataIndex: "j_name",
      key: "j_name",
      filtertype: "search",
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                // style={{ width: 150 }}
                placeholder="Name"
                name="j_name"
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
      key: "latitude",
      title: "Latitude",
      dataIndex: ["j_position"],
      sorter: (a, b) => {
        const latA = a.j_position ? a.j_position.coordinates[1] : null;
        const latB = b.j_position ? b.j_position.coordinates[1] : null;
        return latA - latB;
      },
      render: (text, record, index) => {
        const rules = [
          {
            required: true,
            message: "Required Field!",
          },
        ];
        if ((showInputs && index === 0)) {
          return (
            <StyledInput>
              <PositionBoxN 
              name= {["j_position", "coordinates", 1]}
              rules = {rules}
              // name={["j_position"]}
              coordinate={1}
              style={{ width: "100%" }} 
               />
            </StyledInput>
          )
        }
        else if(isPlatformEditing(index)){
          return (
            <StyledInput>
              <PositionBoxN 
                name= {["j_position", "coordinates", 1]}
                rules = {rules}
                // name={["j_position"]}
                coordinate={1}
                style={{ width: "100%" }} 
                value={record.j_position.coordinates[1]}
               />
            </StyledInput>
          )
        }
        else{
          if (record.j_position) {
            var val = record.j_position.coordinates[1];
            const latitude = decimalToDMS(val, 1);
            // return latitude;
            return (
              <Tooltip title={`${latitude}`}>
                <span>{val}</span>
              </Tooltip>
            );
          }
        }
      },
    },
    {
      key: "longitude",
      title: "Longitude",
      dataIndex: ["j_position"],
      sorter: (a, b) => {
        const latA = a.j_position ? a.j_position.coordinates[0] : null;
        const latB = b.j_position ? b.j_position.coordinates[0] : null;
        return latA - latB;
      },
       render: (text, record, index) => {
          const isEditing = isPlatformEditing(index);
          const isNew = showInputs && index === 0;

          if (isNew || isEditing) {
            const rules = [
              {
                required: true,
                message: "Required Field!",
              },
            ];

            const inputProps = {
              name: ["j_position", "coordinates", 0],
              rules,
              style: { width: "100%" },
            };

            if (isEditing) {
              // only add value when editing
              inputProps.value = record.j_position?.coordinates?.[0];
            }

            return (
              <StyledInput>
                <PositionBoxN {...inputProps} />
              </StyledInput>
            );
          }
        else{
          if (record.j_position) {
            var val = record.j_position.coordinates[0];
            const longitude = decimalToDMS(val, 0);
            // return latitude;
            return (
              <Tooltip title={`${longitude}`}>
                <span>{val}</span>
              </Tooltip>
            );
          }
        }
      },
    }, 
    {
      title: "Provice",
      dataIndex: "j_province",
      key: "j_province",
      filtertype: "search",
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                // style={{ width: 150 }}
                placeholder="Name"
                name="j_province"
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
      key: "j_illegal",
      title: "Illegal",
      dataIndex: "j_illegal",
      filter: 'unique',
      render: (text, record, index) => {
        return (showInputs && index === 0) | isPlatformEditing(index) ? 
        (
          <StyledInput>
            <SelectBox
              // style={{ width: "100%"  }}
              placeholder={"Select Status"}
              name={"j_illegal"}
              value={record.j_illegal === true ? "Yes" : "No"}
              options={ 
                [{ value: "Yes", label: "Yes" },
                { value: "No", label: "No" },]}
              rules={[{ required: true, message: "Required Field!" }]}
            />
          </StyledInput> )
        : (record.j_illegal === true ? "Yes" : "No")
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
                        form.setFieldsValue({
                          ...record,
                          j_position: {
                            coordinates: [
                              record?.j_position?.coordinates?.[0] ?? null,
                              record?.j_position?.coordinates?.[1] ?? null,
                            ],
                          },
                          j_illegal: record.j_illegal === true ? "Yes" : "No"
                        });
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
                      PlatformDataEdited(index, record.j_key);
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
    console.log(validatedValues)

    if (validatedValues) {
      const coordinates = [
        validatedValues.j_position.lng,
        validatedValues.j_position.lat,
      ];
          
      const finalData = {
        ...validatedValues,
        j_position: {
          type: "Point",
          coordinates: validatedValues.j_position.coordinates,
        },
        j_illegal: validatedValues.j_illegal === "Yes" ? true : false,
      }
      await dispatch(addJettyData(finalData)); // await ensures it completes before continuing
      dispatch(fetchAllJettyData()); // ✅ Refetch the data after adding
      setShowInputs(false);
      reset();
    }
  };

  const PlatformDataEdited = async (index, key) => {
    const editedValues = await form.validateFields();
    console.log(editedValues, key)

    if (editedValues) {

      const finalData = {
        ...editedValues,
        j_position: {
          type: "Point",
          coordinates: editedValues.j_position.coordinates,
        },
        j_illegal: editedValues.j_illegal === "Yes" ? true : false,
      }
      
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/jetty/${key}`,
          finalData
        );
        if (response.status === 201 || response.status === 200) {
          showToastSuccess("Jetty Data Edited");
          dispatch(fetchAllJettyData());
        } else {
          // For other errors, display the default error message
          showToastError("Error editing jetty");
        }
      } 
      catch (error) {    
        console.error(error)
        showToastError("Error editing jetty");
      }
      reset();
    }
  };

  return (
    <>
      {viewPermission ? (
        <>
          <div>
            <PageHeaderStyled
              hover="Rapid access to jetty data"
              title="Jetty Data"
              btnTitle={"Add Jetty"} // Render the button only if access is not denied
              btnTitleMedia="+"
              onSearchChange={setSearchData}
              onNavigate={handleShowInput}
              placeholder="Search by jetty name "
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
              "j_name": "",
              "j_position": "",
              "j_province": "",
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

export default Jetty;

export async function getServerSideProps(context) {

  return {
    props: {
      data: {
        title: "Jetty Data",
      },
    },
  };
}
