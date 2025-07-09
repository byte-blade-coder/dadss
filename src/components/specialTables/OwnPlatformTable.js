import { useEffect, useState } from "react";
import {
  Col,
  Row,
  Table,
  Form,
  Modal,
  Button,
  InputNumber,
  Select,
} from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import { sumggled_items_subCategories } from "../../helper/dropdown";
import AntdTable from "../table/AntdTable";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
function OwnPlatformTable(props) {
  const { platformData, setPlatformData, showButtons } = props;

  // Form initialization for goods data
  const [ownplatformForm] = useForm();

  // used to track the currently editing item's index in the platformData array.
  const [goodsKey, setGoodsKey] = useState("");
  //platformData array that is currently being edited
  // When you call setGoodsKey(newValue), it updates the value of goodsKey to newValue.

  // State for managing the visibility of different input sections
  const [showInputs, setShowInputs] = useState({
    ownplatformColumns: false,
  });

  // State for managing selected category and subcategory
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);
  const [filterOperator, setFilterOperator] = useState("eq");
  const [filteredDataSource, setFilteredDataSource] = useState(null);

  // Handler for category change to update selected category and reset subcategory
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  // Function to show input fields for adding platform data
  const handleGoodsColumnShowInput = () => {
    ownplatformForm.resetFields();
    setShowInputs({ ...showInputs, ownplatformColumns: true });
  };

  // Function to handle cancelling the addition of platform data
  const handleGoodsCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, ownplatformColumns: false });
      },
    });
  };

  // Function to handle deleting platform data
  const handleGoodsDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setPlatformData((prev) =>
          // Remove the item at the specified index from the goods data array
          // keep the elements in the array where the index is not equal to the record_index
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    ownplatformForm.resetFields();
  };

  // Check if the current row is being edited by comparing its index with the goodsKey state variable
  const isGoodsEditing = (record_index) => record_index === goodsKey;

  // Function to handle editing goods data
  const goodsDataEdited = (key) => {
    const editedValues = ownplatformForm.getFieldValue();
    // Create a new object with the edited values
    const newEdited = {
      ...editedValues,
    };
    setPlatformData((previous) => {
      // Update the Jetty data state by replacing the item at the specified key/index with the new edited item
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setGoodsKey("");
    ownplatformForm.resetFields();
  };

  const onOwnPlatformFinish = async () => {
    const validatedValues = await ownplatformForm.validateFields();
    if (validatedValues) {
      // Update the Jetty data state by adding a new item with the validated values
      setPlatformData((current) => [
        ...current,
        {
          ...validatedValues,
        },
      ]);
      toast.success(`Goods data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, ownplatformColumns: false });
      ownplatformForm.resetFields();
    }
  };
  // If you directly used setPlatformData([...current, ...validatedValues]),
  // there's a chance that current might not be the latest state when the update happens

  // Checking if `props.reportKeys` is provided, otherwise using default values
  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        platform: "sarp_platform",
        to: "sarp_to",
        from: "sarp_from",
        sorties: "sarp_sorties",
        time: "sarp_sorties_time_expended"
      }

  useEffect(() => {
    if (platformData) {
      setFilteredDataSource(platformData);
    }
  }, [platformData]);

  const extractUniqueValues = (platformData, attribute) => {
    if (!platformData) {
      return [];
    }
    return [...new Set(platformData.map((item) => item[attribute]))].map(
      (value) => ({
        text: value,
        value: value,
      })
    );
  };
  const applyFilter = (attribute) => {
    let filteredData = [...platformData];
    if (filterOperator === "btw") {
      // Handle Between filter
      if (filterValueBtw.every((val) => val !== null)) {
        const min = parseFloat(filterValueBtw[0]);
        const max = parseFloat(filterValueBtw[1]);
        filteredData = filteredData.filter(
          (record) =>
            parseFloat(record[attribute]) >= min &&
            parseFloat(record[attribute]) <= max
        );
      }
    } else {
      // Handle other filters
      if (filterValue !== null) {
        switch (filterOperator) {
          case "eq":
            filteredData = filteredData.filter(
              (record) => parseFloat(record[attribute]) === filterValue
            );
            break;
          case "gt":
            filteredData = filteredData.filter(
              (record) => parseFloat(record[attribute]) > filterValue
            );
            break;
          case "lt":
            filteredData = filteredData.filter(
              (record) => parseFloat(record[attribute]) < filterValue
            );
            break;
          default:
            console.warn("Invalid filter operator selected.");
        }
      }
    }

    setFilteredDataSource(filteredData);
  };

  const ownplatformColumns = [
    {
      title: "Platform",
      key: "platform",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.platform,
      render: (text, record, index) => {
        // Conditionally render an input field or existing text
        return (showInputs.ownplatformColumns && index === 0) |
          isGoodsEditing(index) ? (
          // If conditions met, render an input field
          <StyledInput>
            <InputBox
              placeholder="Platform"
              name={reportKeys.platform}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          // If conditions not met, render the existing text
          text
        );
      },
    },
    {
      key: "from",
      title: "From",
      dataIndex: reportKeys.from,
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.ownplatformColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <DateBox
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: "100%" }}
              // disabled={disabled}
              //showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
              // name={disabled ? "datetime" : reportKeys.from}
              name={reportKeys.from}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          dayjs(text).format("YYYY-MM-DD HH:mm:ss")
        );
      },
    },
    {
      key: "to",
      title: "To",
      dataIndex: reportKeys.to,
      // filterDropdown: () => renderFilterDropdown(reportKeys.qty, "Number"),
      // sorter: (a, b) => a[reportKeys.qty] - b[reportKeys.qty], // Numerical comparison
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.ownplatformColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <DateBox
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: "100%" }}
              // disabled={disabled}
              //showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
              // name={disabled ? "datetime" : reportKeys.from}
              name={reportKeys.to}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          dayjs(text).format("YYYY-MM-DD HH:mm:ss")
        );
      },
    },
    {
      key: "sorties",
      title: "Sorties (Ships/A/Cs)",
      width: 250,
      dataIndex: reportKeys.sorties,
      render: (text, record, index) => {
        return (showInputs.ownplatformColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: "100%" }}
              placeholder="Sorties"
              name={reportKeys.sorties}
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      key: "time",
      title: "Time Expended on Sorties",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.time,
      render: (text, record, index) => {
        return (showInputs.ownplatformColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputBox
              // style={{ width: 150 }}
              placeholder="Time Expended"
              style={{ width: "100%" }}
              name={reportKeys.time}
              rules={[
                {
                  required: false,
                  // message: "Required Field!",
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
      key: "action",
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        // if (showButtons) {
        if (showInputs.ownplatformColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleGoodsCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "#51AE3B",
                  }}
                  text="Save"
                  onClick={onOwnPlatformFinish}
                />
              </div>
            </Form.Item>
          );
        } else {
          if (!showInputs.ownplatformColumns) {
            if (isGoodsEditing(index)) {
              return (
                <Form.Item>
                  <div style={{ display: "flex" }}>
                    <SimpleButton
                      onClick={() => {
                        setGoodsKey("");
                        ownplatformForm.resetFields();
                      }}
                      style={{
                        fontWeight: "bold",
                      }}
                      text="Cancel"
                    />
                    <SimpleButton
                      onClick={() => {
                        goodsDataEdited(index);
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
            } else if (showButtons) {
              return (
                <IconsStylingWrap>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
                      setGoodsKey(index);
                      ownplatformForm.setFieldsValue(record);
                      ownplatformForm.resetFields;
                    }}
                  />
                  <MdDelete
                    onClick={() => handleGoodsDelete(index)}
                    className="deleteIcon"
                  />
                </IconsStylingWrap>
              );
            }
          }
        }
      },
    },
    // },
  ];

  return (
    <div className="mb-10">
      <AntdTable
        form={ownplatformForm}
        onFinish={onOwnPlatformFinish}
        columns={ownplatformColumns}
        data={showInputs.ownplatformColumns ? [{}, ...platformData] : platformData}
        pagination={true}
        titletext="Platform Details"
        showButton={showButtons}
        btnTitle="Add Platform Details"
        onBtnClick={handleGoodsColumnShowInput}
        btndisabled={goodsKey !== ""}
      />
    </div>
  );
}

export default OwnPlatformTable;
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
const StyledDiv = styled.div`
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
