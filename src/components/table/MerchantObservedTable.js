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
import { movement_list, port_list, ais_type_summary } from "../../helper/dropdown";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import AntdTable from "./AntdTable";
import useFetchOptions from "../../hooks/useFetchOptions";
import DynamicSelectOrInput from "../specialInput/DynamicSelectOrInput";

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function MerchantObservedTable(props) {
  const { merchantObservedData, setMerchantObservedData, showButtons } = props;
  const [MerchantObservedForm] = useForm();
  const [merchantObservedKey, setMerchantObservedKey] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLpoc, setSelectedLpoc] = useState(null);
  const [selectedNpoc, setSelectedNpoc] = useState(null);
  const [showInputs, setShowInputs] = useState({
    merchantObservedColumns: false,
  });

   const mvTypeOptions = useFetchOptions("merchant_type", "mt_name", "mt_name");
   const portOptions = useFetchOptions("ports", "p_name", "p_name");
  
   const handleMerchantShowInput = () => {
    MerchantObservedForm.resetFields();
    setSelectedType(null);        
    setSelectedLpoc(null);
    setSelectedNpoc(null);
    setShowInputs({ ...showInputs, merchantObservedColumns: true });
    //MerchantObservedForm.setFieldValue(["grm_position", "dms", 0, "dir"], "E");
    //MerchantObservedForm.setFieldValue(["grm_position", "dms", 1, "dir"], "N");
  };

  const handleMerchantCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, merchantObservedColumns: false });
      },
    });
  };

  const handleMerchantObservedDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setMerchantObservedData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    MerchantObservedForm.resetFields();
  };

  const isMerchantObservedEditing = (record_index) =>
    record_index === merchantObservedKey;

  const merchantObservedEdited = async (key) => {
    const validatedValues = await MerchantObservedForm.validateFields();
    const editedValues = MerchantObservedForm.getFieldValue();
    const coordinates = [
      editedValues.grm_position.lng,
      editedValues.grm_position.lat
    ];
    const newEdited = {
      ...editedValues,
      grm_position: {
        ...editedValues.grm_position,
        type: "Point",
        coordinates: coordinates,
        //coordinates: DMStodecimal(editedValues.grm_position.dms),
      },
    };
    setMerchantObservedData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setMerchantObservedKey("");
    MerchantObservedForm.resetFields();
  };

  const onMerchantObservedFinish = async () => {
    const validatedValues = await MerchantObservedForm.validateFields();
    if (validatedValues) {
      const coordinates = [
        validatedValues.grm_position.lng,
        validatedValues.grm_position.lat
      ];
      setMerchantObservedData((current) => [
        ...current,
        {
          ...validatedValues,
          grm_position: {
            ...validatedValues.grm_position,
            type: "Point",
            coordinates: coordinates,
            //coordinates: DMStodecimal(validatedValues.grm_position.dms),
          },
        },
      ]);
      toast.success(`Merchant Observed data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, merchantObservedColumns: false });
      MerchantObservedForm.resetFields();
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

  const merchantObservedColumns = [
    {
      key: "longitude",
      title: "Longitude",
      ellipsis: false,
      width: 250,
      dataIndex: ["grm_position"],
      //dataIndex: ["grm_position", "dms", 0],
      render: (text, record, index) => {
        if (
          (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox 
              //name={["grm_position", "dms", 0]} 
              name={["grm_position"]} coordinate={0} 
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}/>
            </StyledInput>
          );
        } else {
          //return record?.grm_position ? positiontoDMS(text) : text;
          return record?.grm_position ? text.coordinates[0] : text;
        }
      },
    },
    {
      key: "latitude",
      title: "Latitude",
      ellipsis: false,
      width: 250,
      dataIndex: ["grm_position"],
      //dataIndex: ["grm_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox 
              //name={["grm_position", "dms", 1]} 
              name={["grm_position"]} 
              coordinate={1} 
              style={{ width: 150 }}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}/>
            </StyledInput>
          );
        } else {
          //return record?.grm_position ? positiontoDMS(text) : text;
          return record?.grm_position ? text.coordinates[1] : text;
        }
      },
    },
    {
      key: "grm_name",
      title: "Vessel Name",
      ellipsis: false,
      width: 250,
      dataIndex: "grm_name",
      render: (text, record, index) => {
        return (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Vessel Name"
              name="grm_name"
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
      key: "grm_type",
      title: "Vessel Type",
      dataIndex: "grm_type",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index) ? (
          <StyledInput>
              <DynamicSelectOrInput
                form={MerchantObservedForm}
                name="grm_type"
                options={mvTypeOptions}
                placeholder="Select Type"
                inputPlaceholder="Enter New Type"
                rules={[{ required: true, message: "Required Field!" }]}
                style={{ width: 150 }}
                buttonStyle={buttonStyle}
                setSelectedOpt={setSelectedType}
                selectedOpt={selectedType}
                divStyle= {{position: "relative", display: "inline-block", width: 150 }}
              />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "grm_movement",
      title: "Vessel Movement",
      dataIndex: "grm_movement",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index) ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
              name="grm_movement"
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
      key: "grm_lpoc",
      title: "LPOC",
      dataIndex: "grm_lpoc",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index) ? (
            <StyledInput>
              <DynamicSelectOrInput
                form={MerchantObservedForm}
                name="grm_lpoc"
                options={portOptions}
                placeholder="Select Port"
                inputPlaceholder="Enter New Port"
                rules={[{ required: true, message: "Required Field!" }]}
                style={{ width: 150 }}
                buttonStyle={buttonStyle}
                setSelectedOpt={setSelectedLpoc}
                selectedOpt={selectedLpoc}
                divStyle= {{position: "relative", display: "inline-block", width: 150 }}
              />
            </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      key: "grm_npoc",
      title: "NPOC",
      dataIndex: "grm_npoc",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index) ? (
            <StyledInput>
              <DynamicSelectOrInput
                form={MerchantObservedForm}
                name="grm_npoc"
                options={portOptions}
                placeholder="Select Port"
                inputPlaceholder="Enter New Port"
                rules={[{ required: true, message: "Required Field!" }]}
                style={{ width: 150 }}
                buttonStyle={buttonStyle}
                setSelectedOpt={setSelectedNpoc}
                selectedOpt={selectedNpoc}
                divStyle= {{position: "relative", display: "inline-block", width: 150 }}
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
        if (showInputs.merchantObservedColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleMerchantCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onMerchantObservedFinish}
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
        if (!showInputs.merchantObservedColumns) {
          if (
            merchantObservedData.length &&
            !isMerchantObservedEditing(index)
          ) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setMerchantObservedKey(index);
                    MerchantObservedForm.setFieldsValue(record);
                  }}
                />
                <MdDelete
                  onClick={() => handleMerchantObservedDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isMerchantObservedEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setMerchantObservedKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      merchantObservedEdited(index);
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
      {/* <Row className="mb-5">
        <Col span={12} className="flex justify-start">
          <Heading
            className=" whitespace-nowrap ml-5"
            level={5}
            text="Merchant Observed"
          />
        </Col>
        <Col span={12} className="flex justify-end">
         {showButtons && ( 
            <>
              <FilledButton
                text="+ Add Merchant Observed"
                className="rounded-full border-midnight bg-midnight text-white custom-css-pageheaderButton mr-4"
                onClick={handleMerchantShowInput}
                disabled={merchantObservedKey !== ""}
              />
              <FilledButton
                text="+ Add "
                className="rounded-full border-midnight bg-midnight text-white custom-css-pageheaderButtonMedia mr-4"
                onClick={handleMerchantShowInput}
                disabled={merchantObservedKey !== ""}
              />
            </>
           )} 
        </Col>
      </Row> */}

      <AntdTable
        form={MerchantObservedForm}
        onFinish={onMerchantObservedFinish}
        scrollConfig={{ x: true }} // Set the scroll property as per your requirements
        columns={merchantObservedColumns}
        data={
          showInputs.merchantObservedColumns
            ? [{}, ...merchantObservedData]
            : merchantObservedData
        }
        pagination={true}
        titletext="Merchant Vessel Observed"
        showButton={showButtons}
        btnTitle="Add Merchant Observed"
        onBtnClick={handleMerchantShowInput}
        btndisabled={merchantObservedKey !== ""}
      />
    </div>
  );
}

export default MerchantObservedTable;
const StyledDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 0px;
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
