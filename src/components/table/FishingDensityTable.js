import { useState } from "react";
import { Col, Row, Form, Modal, Button } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import SelectBox from "../form/SelectBox";
import InputBox from "../form/InputBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import PositionBox from "../form/PositionBox";
import { type_list, movement_list } from "../../helper/dropdown";
import AntdTable from "./AntdTable";
import useFetchOptions from "../../hooks/useFetchOptions";

function FishingDensityTable(props) {
  const { fishingDensityData, setFishingDensityData, showButtons, } = props;
  const [FishingDensityForm] = useForm();
  const [fishingDensityKey, setFishingDensityKey] = useState("");
  const [selectedType, setSelectedType] = useState(null);

  const [showInputs, setShowInputs] = useState({
    fishingColumns: false,
  });
  
  const reportKeys = props.reportKeys ? props.reportKeys : {
    position: "grd_position",
    qty: "grd_qty",
    type: "grd_type",
    movement: "grd_movement"
  }

  const fvTypeOptions = props.dropdownOptions ? props.dropdownOptions : useFetchOptions("fishing_type", "ft_name", "ft_name");

  const handleFishingColumnShowInput = () => {
    FishingDensityForm.resetFields();
    setSelectedType(null);
    setShowInputs({ ...showInputs, fishingColumns: true });
    //FishingDensityForm.setFieldValue(["grd_position", "dms", 0, "dir"], "E");
    //FishingDensityForm.setFieldValue(["grd_position", "dms", 1, "dir"], "N");
  };

  const handleFishingColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, fishingColumns: false });
      },
    });
  };

  const handleFishingDensityDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setFishingDensityData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    FishingDensityForm.resetFields();
  };

  const isFishingDensityEditing = (record_index) =>
    record_index === fishingDensityKey;

  const fishingDensityDataEdited = async (key) => {
    // const validatedValues = await FishingDensityForm.validateFields();
    const editedValues = FishingDensityForm.getFieldValue();
    console.log("editedValues", editedValues)

    const coordinates = [
      // editedValues[reportKeys.position].lng,
      // editedValues[reportKeys.position].lat
            editedValues[reportKeys.position].coordinates[0],
      editedValues[reportKeys.position].coordinates[1]
    ];
    const newEdited = {
      ...editedValues,
      [reportKeys.position]: {
        ...editedValues[reportKeys.position],
        type: "Point",
        coordinates: coordinates,
        // coordinates: DMStodecimal(editedValues.grd_position.dms),
      },
    };
    setFishingDensityData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setFishingDensityKey("");
    FishingDensityForm.resetFields();
  };

  const onFishingDensityFinish = async () => {
    const validatedValues = await FishingDensityForm.validateFields();
    if (validatedValues) {
      const coordinates = [
        validatedValues[reportKeys.position].lng,
        validatedValues[reportKeys.position].lat
      ];
      setFishingDensityData((current) => [
        ...current,
        {
          ...validatedValues,
          [reportKeys.position]: {
            ...validatedValues[reportKeys.position],
            type: "Point",
            coordinates: coordinates ,
            // coordinates: DMStodecimal(validatedValues.grd_position.dms),
          },
        },
      ]);
      toast.success(`Fishing Density data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, fishingColumns: false });
      FishingDensityForm.resetFields();
    }
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
  
  const fishingColumns = [
    {
      title: "Longitude",
      ellipsis: false,
      key: "longitude",
      width: 250,
      dataIndex: [reportKeys.position],
      // dataIndex: ["grd_position"],
      // dataIndex: ["grd_position", "dms", 0],
      render: (text, record, index) => {
        // console.log(record, text)
        if (
          (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox 
              //name={["grd_position", "dms", 0]} 
              name={[reportKeys.position]}
              coordinate={0}
              initialvalue={record?.[reportKeys.position] ?.coordinates[0]}
              style={{width: '150px'}}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}  />
            </StyledInput>
          );
        } else {
          // return record?.grd_position ? positiontoDMS(text) : text;
          // return record?.grd_position ? text.coordinates[0] : text;
          // return record?.[reportKeys.position] ? text.coordinates[0] : text;
          return record?.[reportKeys.position]?.coordinates?.[0] ?? text;
        }
      },
    },
    {
      title: "Latitude",
      key: "latitude",
      ellipsis: false,
      width: 250,
      dataIndex: [reportKeys.position],
      //dataIndex: ["grd_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index)
        ) {
          return (
            <StyledInput style={{ width: "auto" }}>
              <PositionBox 
              //name={["grd_position", "dms", 1]} 
              name={[reportKeys.position]}
              coordinate={1}
              style={{width: '150px'}} 
              initialvalue={record?.[reportKeys.position] ?.coordinates[1]}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]} />
            </StyledInput>
          );
        } else {
          //return record?.grd_position ? positiontoDMS(text) : text;
          return record?.[reportKeys.position]?.coordinates?.[1] ?? text;
        }
      },
    },
    {
      title: "Number of Vessels",
      key: reportKeys.qty,
      width: 250,
      ellipsis: false,
      dataIndex: reportKeys.qty,
      render: (text, record, index) => {
        // return isFishingDensityEditing(record) ? (
        return (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              placeholder="Vessels"
              name={reportKeys.qty}
              min={1}
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
      title: "Vessel Type",
      key: reportKeys.type,
      dataIndex: reportKeys.type,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index) ? (
          <StyledInput>
            {/* <SelectBox
              style={{ width: 150 }}
              name="grd_type"
              placeholder="Select Type"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
              // options={type_list.map((item) => ({ value: item, label: item }))}
              options={fvTypeOptions}
            /> */}<>
                {selectedType !== "Others" ? (
                  <SelectBox
                    style={{ width: 150 }}
                    name={reportKeys.type}
                    placeholder="Select Type"
                    rules={[
                      {
                        required: true,
                        message: "Required Field!",
                      },
                    ]}
                    options={[
                      ...fvTypeOptions,
                      { value: "Others", label: "Others" },
                    ]}
                    onChange={(value) => {
                      setSelectedType(value);
                      FishingDensityForm.setFieldsValue({
                        [reportKeys.type]: value !== "Others" ? value : "" ,
                      });
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: 150,
                      }}
                    >
                      <InputBox
                        rules={[
                          {
                            required: true,
                            message: "Required Field!",
                          },
                        ]}
                        placeholder="Enter New Type"
                        name={reportKeys.type}
                        // style={{ width: 150 }}
                      />
                      <Button
                        style={buttonStyle}
                        onClick={() => {
                          // Logic to show SelectBox and hide InputBox
                          setSelectedType("dd"); // Example of resetting state
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
        ) : (
          text
        );
      },
    },
    {
      title: "Vessel Movement",
      key: reportKeys.movement,
      ellipsis: false,
      dataIndex: reportKeys.movement,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index) ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              name={reportKeys.movement}
              placeholder="Select"
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
                },
              ]}
              options={movement_list.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "",
      width: 250,
      dataIndex: "action",
      key: "action",
      render: (text, record, index) => {
        if (showInputs.fishingColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleFishingColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onFishingDensityFinish}
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
        if (!showInputs.fishingColumns) {
          if (fishingDensityData.length && !isFishingDensityEditing(index) &&
            showButtons) {
            return (
              <IconsStylingWrap>
                {/* {!showInputs.fishingColumns && ( */}
                <>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
                      setFishingDensityKey(index);
                      FishingDensityForm.setFieldsValue(record);
                    }}
                    disable={showInputs.fishingColumns}
                  />
                  <MdDelete
                    onClick={() => handleFishingDensityDelete(index)}
                    className="deleteIcon"
                  />
                </>
                {/* )} */}
              </IconsStylingWrap>
            );
          }

          if (isFishingDensityEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setFishingDensityKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      fishingDensityDataEdited(index);
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

  return (
    <div className="mb-10">
      {/* <Row>
        <Col span={12} className="flex justify-start">
          <Heading
            className="whitespace-nowrap ml-5"
            level={5}
            text="Fishing Density Observed"
          />
        </Col>
        <Col span={12} className="flex justify-end"> */}
          {/* {showButtons && ( */}
            {/* <>
              <FilledButton
                text="+ Add Fishing Density"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                onClick={handleFishingColumnShowInput}
                disabled={fishingDensityKey !== ""}
              />
              <FilledButton
                text="+ Add"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                onClick={handleFishingColumnShowInput}
                disabled={fishingDensityKey !== ""}
              />
            </> */}
          {/* )} */}
        {/* </Col>
      </Row> */}
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scrollConfig={{ x: true }}
        form={FishingDensityForm}
        onFinish={onFishingDensityFinish}
        columns={fishingColumns}
        data={
          showInputs.fishingColumns
            ? [{}, ...fishingDensityData]
            : fishingDensityData
        }
        titletext="Fishing Density Observed"
        showButton={showButtons}
        btnTitle="Add Fishing Density"
        onBtnClick={handleFishingColumnShowInput}
        btndisabled={fishingDensityKey !== ""}
      />
    </div>
  );
}

export default FishingDensityTable;

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
