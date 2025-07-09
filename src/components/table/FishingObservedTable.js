import { useState } from "react";
import { Col, Row, Form, Modal, Button } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import PositionBox from "../form/PositionBox";
import { type_list, movement_list } from "../../helper/dropdown";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import AntdTable from "./AntdTable";
import useFetchOptions from "../../hooks/useFetchOptions";

function FishingObservedTable(props) {
  const { fishingObservedData, setFishingObservedData, showButtons } = props;
  const [FishingObservedForm] = useForm();
  const [fishingObservedKey, setFishingObservedKey] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [showInputs, setShowInputs] = useState({
    fishingObservedColumns: false,
  });

  const reportKeys = props.reportKeys ? props.reportKeys : {
    position: "grf_position",
    name: "grf_name",
    type: "grf_type",
    movement: "grf_movement"
  }

  const fvTypeOptions = props.dropdownOptions ? props.dropdownOptions : useFetchOptions("fishing_type", "ft_name", "ft_name");

  const handleFishingShowInput = () => {
    FishingObservedForm.resetFields();
    setSelectedType(null);
    setShowInputs({ ...showInputs, fishingObservedColumns: true });
    FishingObservedForm.setFieldValue(["mrf_position", "dms", 0, "dir"], "E");
    FishingObservedForm.setFieldValue(["mrf_position", "dms", 1, "dir"], "N");
  };

  const handleFishingCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, fishingObservedColumns: false });
      },
    });
  };

  const handleFishingObservedDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setFishingObservedData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    FishingObservedForm.resetFields();
  };

  const isFishingObservedEditing = (record_index) =>
    record_index === fishingObservedKey;

  const fishingObservedEdited = async (key) => {
    // const validatedValues = await FishingObservedForm.validateFields();
    const editedValues = FishingObservedForm.getFieldValue();
// console.log("validatedValues", validatedValues, "editedValues", editedValues)
    const coordinates = [
      editedValues[reportKeys.position].coordinates[0],
      editedValues[reportKeys.position].coordinates[1]
    ];
    const newEdited = {
      ...editedValues,
      [reportKeys.position]: {
        ...editedValues[reportKeys.position],
        type: "Point",
        coordinates: coordinates,
        //coordinates: DMStodecimal(editedValues.grf_position.dms),
      },
    };
    setFishingObservedData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setFishingObservedKey("");
    FishingObservedForm.resetFields();
  };

  const onFishingObservedFinish = async () => {
    const validatedValues = await FishingObservedForm.validateFields();
    if (validatedValues) {
      const coordinates = [
        validatedValues[reportKeys.position].lng,
        validatedValues[reportKeys.position].lat
      ];
      setFishingObservedData((current) => [
        ...current,
        {
          ...validatedValues,
          [reportKeys.position]: {
            ...validatedValues[reportKeys.position],
            type: "Point",
            coordinates: coordinates,
            //coordinates: DMStodecimal(validatedValues.grf_position.dms),
          },
        },
      ]);
      toast.success(`Fishing Observed data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, fishingObservedColumns: false });
      FishingObservedForm.resetFields();
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

  const fishingObservedColumns = [
    {
      key: "longitude",
      title: "Longitude",
      ellipsis: false,
      width: 250,
      dataIndex: [reportKeys.position],
      //dataIndex: ["grf_position", "dms", 0],
      render: (text, record, index) => {
        console.log(record, text)
        if (
          (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox 
              //name={["grf_position", "dms", 0]} 
              name={[reportKeys.position]}
              coordinate={0}
              style={{ width: 150 }} 
              initialvalue={record?.[reportKeys.position]?.coordinates[0]}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]} />
            </StyledInput>
          );
        } else {
          //return record?.grf_position ? positiontoDMS(text) : text;
          return record?.[reportKeys.position]?.coordinates?.[0] ?? text;
        }
      },
    },
    {
      key: "latitude",
      title: "Latitude",
      ellipsis: false,
      width: 250,
      dataIndex: [reportKeys.position],
      //dataIndex: ["grf_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox 
              //name={["grf_position", "dms", 1]} 
              name={[reportKeys.position]}
              coordinate={1} 
              style={{ width: 150 }}
              initialvalue={record?.[reportKeys.position]?.coordinates[1]}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]} />
            </StyledInput>
          );
        } else {
          //return record?.grf_position ? positiontoDMS(text) : text;
          return record?.[reportKeys.position]?.coordinates?.[1] ?? text;
        }
      },
    },
    {
      title: "Vessel Name",
      key: reportKeys.name,
      dataIndex: reportKeys.name,
      width: 250,
      ellipsis: false,
      render: (text, record, index) => {
        return (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Vessel Name"
              name={reportKeys.name}
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
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index) ? (
          <StyledInput>
            {/* <SelectBox
              style={{ width: 150 }}
              name="grf_type"
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
                      FishingObservedForm.setFieldsValue({
                        [reportKeys.type]: value !== "Others" ? value : "",
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
        ) : (
          text
        );
      },
    },
    {
      title: "Vessel Movement",
      key: reportKeys.movement,
      dataIndex: reportKeys.movement,
      width: 250,
      ellipsis: false,
      render: (text, record, index) => {
        return (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index) ? (
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
      key: "action",
      dataIndex: "action",
      width: 250,
      render: (text, record, index) => {
        if (showInputs.fishingObservedColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleFishingCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onFishingObservedFinish}
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
        if (!showInputs.fishingObservedColumns) {
          if (fishingObservedData.length && !isFishingObservedEditing(index) &&
            showButtons) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setFishingObservedKey(index);
                    FishingObservedForm.setFieldsValue(record);
                    // selectedType()
                  }}
                />
                <MdDelete
                  onClick={() => handleFishingObservedDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isFishingObservedEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setFishingObservedKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      fishingObservedEdited(index);
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
            text="Fishing Vessels Observed"
          />
        </Col>
        <Col span={12} className="flex justify-end">
            <>
              <FilledButton
                text="+ Add Fishing Observed"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                onClick={handleFishingShowInput}
                disabled={fishingObservedKey !== ""}
              />
              <FilledButton
                text="+ Add"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                onClick={handleFishingShowInput}
                disabled={fishingObservedKey !== ""}
              />
            </>
        </Col>
      </Row> */}
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({}) 
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scrollConfig={{ x: true }}
        form={FishingObservedForm}
        onFinish={onFishingObservedFinish}
        columns={fishingObservedColumns}
        data={
          showInputs.fishingObservedColumns
            ? [{}, ...fishingObservedData]
            : fishingObservedData
        }
        titletext="Fishing Vessel Observed"
        showButton={showButtons}
        btnTitle="Add Fishing Vessel"
        onBtnClick={handleFishingShowInput}
        btndisabled={fishingObservedKey !== ""}
      />
    </div>
  );
}

export default FishingObservedTable;

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
