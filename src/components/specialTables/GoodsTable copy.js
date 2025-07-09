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
  Image } 
from "antd";
import { UploadOutlined } from '@ant-design/icons';
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

function GoodsTable(props) {
  const { goodsData, setGoodsData, showButtons, coireport } = props;
console.log(goodsData)
  // Form initialization for goods data
  const [goodsForm] = useForm();

  // used to track the currently editing item's index in the goodsData array.
  const [goodsKey, setGoodsKey] = useState("");
  //goodsData array that is currently being edited
  // When you call setGoodsKey(newValue), it updates the value of goodsKey to newValue.

  // State for managing the visibility of different input sections
  const [showInputs, setShowInputs] = useState({
    goodsColumns: false,
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
    goodsForm.resetFields();
    setShowInputs({ ...showInputs, goodsColumns: true });
  };

  // Function to handle cancelling the addition of platform data
  const handleGoodsCancel = (event) => {
    event.preventDefault();
    // Modal.confirm({
    //   title: `Are you sure, you want don't want to add data?`,
    //   okText: "Yes",
    //   okType: "danger",
    //   centered: "true",
    //   onOk: () => {
    //     setShowInputs({ ...showInputs, goodsColumns: false });
    //   },
    // });
    setShowInputs({ ...showInputs, goodsColumns: false });
  };

  // Function to handle deleting platform data
  const handleGoodsDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setGoodsData((prev) =>
          // Remove the item at the specified index from the goods data array
          // keep the elements in the array where the index is not equal to the record_index
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    goodsForm.resetFields();
  };

  // Check if the current row is being edited by comparing its index with the goodsKey state variable
  const isGoodsEditing = (record_index) => record_index === goodsKey;

  // Function to handle editing goods data
  const goodsDataEdited = (key) => {
    const editedValues = goodsForm.getFieldValue();
    // Create a new object with the edited values
    const newEdited = {
      ...editedValues,
    };
    setGoodsData((previous) => {
      // Update the Jetty data state by replacing the item at the specified key/index with the new edited item
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setGoodsKey("");
    goodsForm.resetFields();
  };

  const onGoodsFinish = async () => {
    const validatedValues = await goodsForm.validateFields();
    if (validatedValues) {
      // Update the Jetty data state by adding a new item with the validated values
      setGoodsData((current) => [
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
      setShowInputs({ ...showInputs, goodsColumns: false });
      goodsForm.resetFields();
    }
  };
  // If you directly used setGoodsData([...current, ...validatedValues]),
  // there's a chance that current might not be the latest state when the update happens

  
  // Checking if `props.reportKeys` is provided, otherwise using default values
  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        item: "srg_item",
        qty: "srg_qty",
        denomination: "srg_denomination",
        category: "srg_category",
        subcategory: "srg_subcategory",
        confiscated: "srg_confiscated",
        value: "srg_value",
        source: "srg_source",
      };
    
  const reportKeysCoi = 
    {
      item: "ssrg_item",
      qty: "ssrg_qty",
      denomination: "ssrg_denomination",
      category: "ssrg_category",
      subcategory: "ssrg_subcategory",
      confiscated: "ssrg_confiscated",
      value: "ssrg_value",
      source: "ssrg_type",
    }

  useEffect(() => {
    if (goodsData) {
      setFilteredDataSource(goodsData);
    }
  }, [goodsData]);

  const extractUniqueValues = (goodsData, attribute) => {
    if (!goodsData) {
      return [];
    }
    return [...new Set(goodsData.map((item) => item[attribute]))].map(
      (value) => ({
        text: value,
        value: value,
      })
    );
  };
  const applyFilter = (attribute) => {
    let filteredData = [...goodsData];
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

  const resetFilter = () => {
    setFilterValue(null);
    setFilterValueBtw([null, null]);
    setFilterOperator("eq");
    setFilteredDataSource(goodsData);
  };

  const renderFilterDropdown = (attribute, placeholder) => (
    <div style={{ padding: 4, width: 200 }}>
      <Select
        defaultValue="eq"
        style={{ width: 190, marginTop: 8 }}
        onChange={(value) => setFilterOperator(value)}
      >
        <Select.Option value="eq">Equal</Select.Option>
        <Select.Option value="gt">Greater Than</Select.Option>
        <Select.Option value="lt">Less Than</Select.Option>
        <Select.Option value="btw">Between</Select.Option>
      </Select>
      {filterOperator === "btw" && (
        <div style={{ display: "flex", marginTop: 8 }}>
          <InputNumber
            style={{ width: 95 }}
            placeholder="Min"
            value={filterValueBtw[0]}
            onChange={(value) => setFilterValueBtw([value, filterValueBtw[1]])}
          />
          <span style={{ margin: "0 8px" }}>to</span>
          <InputNumber
            style={{ width: 95 }}
            placeholder="Max"
            value={filterValueBtw[1]}
            onChange={(value) => setFilterValueBtw([filterValueBtw[0], value])}
          />
        </div>
      )}
      {filterOperator !== "btw" && (
        <div style={{ marginTop: 8 }}>
          <InputNumber
            style={{ width: 190 }}
            placeholder={placeholder}
            value={filterValue}
            onChange={(value) => setFilterValue(value)}
          />
        </div>
      )}
      <div className="ant-table-filter-dropdown-btns">
        <Button
          className="ant-btn ant-btn-primary ant-btn-sm"
          onClick={() => applyFilter(attribute)}
        >
          OK
        </Button>
        <Button
          className="ant-btn ant-btn-link ant-btn-sm"
          onClick={resetFilter}
        >
          Reset
        </Button>
      </div>
    </div>
  );
  // const goodsColumns = props.coireport === true ? 
  // [
  //   {
  //     title: "Item",
  //     key: "item",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.item,
  //     render: (text, record, index) => {
  //       // Conditionally render an input field or existing text
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         // If conditions met, render an input field
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 100 }}
  //             placeholder="Item"
  //             name={reportKeysCoi.item}
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         // If conditions not met, render the existing text
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "qty",
  //     title: "Quantity",
  //     dataIndex: reportKeysCoi.qty,
  //     // filterDropdown: () => renderFilterDropdown(reportKeys.qty, "Number"),
  //     // sorter: (a, b) => a[reportKeys.qty] - b[reportKeys.qty], // Numerical comparison
  //     ellipsis: false,
  //     width: 250,
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <InputNumBox
  //             style={{ width: 150 }}
  //             placeholder="Quantity"
  //             name={reportKeysCoi.qty}
  //             type="number"
  //             rules={null}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "denomination",
  //     title: "Denomination",
  //     dataIndex: reportKeysCoi.denomination,
  //     ellipsis: false,
  //     width: 250,
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="Denomination"
  //             name={reportKeysCoi.denomination}
  //             rules={null}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "category",
  //     title: "Category",
  //     ellipsis: false,
  //     width: 250,
  //      dataIndex: reportKeysCoi.category,
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <SelectBox
  //             style={{ width: 150 }}
  //             placeholder="Category"
  //             name={reportKeysCoi.category}
  //             onChange={handleCategoryChange}
  //             options={sumggled_items_subCategories.map((item) => ({
  //               label: item.category,
  //               value: item.category,
  //             }))}
  //             rules={null}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "subcategory",
  //     title: "Sub Category",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.subcategory,
  //     // filters: extractUniqueValues(goodsData, reportKeys.subcategory),
  //     // sorter: (a, b) =>
  //     //   a[reportKeys.subcategory].localeCompare(b[reportKeys.subcategory]),
  //     // sortDirections: ["descend", "ascend"],
  //     // filterSearch: true,
  //     // onFilter: (value, record) =>
  //     //   record[reportKeys.subcategory].includes(value),
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <SelectBox
  //             style={{ width: 150 }}
  //             placeholder="Sub Category"
  //             name={reportKeysCoi.subcategory}
  //             onChange={(value) => setSelectedSubcategory(value)}
  //             //  If the category is found, it extracts the associated subcategories and maps them
  //             //into an array of objects with label and value properties.
  //             options={
  //               selectedCategory
  //                 ? sumggled_items_subCategories
  //                     .find((item) => item.category === selectedCategory)
  //                     ?.subcategories.map((subCategory) => ({
  //                       label: subCategory,
  //                       value: subCategory,
  //                     }))
  //                 : []
  //             }
  //             disabled={!selectedCategory}
  //             value={selectedSubcategory}
  //             rules={null}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "confiscated",
  //     title: "Confiscated",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.confiscated,
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <SelectBox
  //             style={{ width: 150 }}
  //             placeholder="Confiscated"
  //             name={reportKeysCoi.confiscated}
  //             rules={null}
  //             options={[
  //               { value: "Yes", label: "Yes" },
  //               { value: "No", label: "No" },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "value",
  //     title: "Value $",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.value,
  //     // filterDropdown: () => renderFilterDropdown(reportKeys.value, "Number"),
  //     // sorter: (a, b) => a[reportKeys.value] - b[reportKeys.value], // Numerical comparison
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <InputNumBox
  //             style={{ width: 150 }}
  //             placeholder="Value"
  //             name={reportKeysCoi.value}
  //             type="number"
  //             rules={null}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "source",
  //     title: "Source",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeysCoi.source,
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             // style={{ width: 150 }}
  //             placeholder="Source"
  //             name={reportKeysCoi.source}
  //             rules={ null}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "action",
  //     title: "",
  //     dataIndex: "action",
  //     render: (text, record, index) => {
  //       // if (showButtons) {
  //       if (showInputs.goodsColumns && index === 0) {
  //         return (
  //           <Form.Item>
  //             <div style={{ display: "flex" }}>
  //               <SimpleButton
  //                 onClick={handleGoodsCancel}
  //                 style={{
  //                   fontWeight: "bold",
  //                 }}
  //                 text="Cancel"
  //               />
  //               <SimpleButton
  //                 style={{
  //                   fontWeight: "bold",
  //                   color: "white",
  //                   backgroundColor: "#51AE3B",
  //                 }}
  //                 text="Save"
  //                 onClick={onGoodsFinish}
  //               />
  //             </div>
  //           </Form.Item>
  //         );
  //       } else {
  //         if (!showInputs.goodsColumns) {
  //           if (isGoodsEditing(index)) {
  //             return (
  //               <Form.Item>
  //                 <div style={{ display: "flex" }}>
  //                   <SimpleButton
  //                     onClick={() => {
  //                       setGoodsKey("");
  //                       goodsForm.resetFields();
  //                     }}
  //                     style={{
  //                       fontWeight: "bold",
  //                     }}
  //                     text="Cancel"
  //                   />
  //                   <SimpleButton
  //                     onClick={() => {
  //                       goodsDataEdited(index);
  //                     }}
  //                     style={{
  //                       fontWeight: "bold",
  //                       color: "white",
  //                       backgroundColor: "#ffbf00",
  //                     }}
  //                     text="Edit"
  //                   />
  //                 </div>
  //               </Form.Item>
  //             );
  //           } else if (showButtons) {
  //             return (
  //               <IconsStylingWrap>
  //                 <MdModeEditOutline
  //                   className="editIcon"
  //                   onClick={() => {
  //                     setGoodsKey(index);
  //                     goodsForm.setFieldsValue(record);
  //                     goodsForm.resetFields;
  //                   }}
  //                 />
  //                 <MdDelete
  //                   onClick={() => handleGoodsDelete(index)}
  //                   className="deleteIcon"
  //                 />
  //               </IconsStylingWrap>
  //             );
  //           }
  //         }
  //       }
  //     },
  //   },
  //   // },
  // ]
  // : [
  //   {
  //     title: "Item",
  //     key: "item",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.item,
  //     // filters: extractUniqueValues(goodsData, reportKeys.item),
  //     // sorter: (a, b) => a[reportKeys.item].localeCompare(b[reportKeys.item]),
  //     // sortDirections: ["descend", "ascend"],
  //     // filterSearch: true,
  //     // onFilter: (value, record) => record[reportKeys.item].includes(value),
  //     render: (text, record, index) => {
  //       // Conditionally render an input field or existing text
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         // If conditions met, render an input field
  //         <StyledInput>
  //           <InputBox
  //             placeholder="Item"
  //             name={reportKeys.item}
  //             rules={coireport ? null : [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         // If conditions not met, render the existing text
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "qty",
  //     title: "Quantity",
  //     dataIndex: reportKeys.qty,
  //     // filterDropdown: () => renderFilterDropdown(reportKeys.qty, "Number"),
  //     // sorter: (a, b) => a[reportKeys.qty] - b[reportKeys.qty], // Numerical comparison
  //     ellipsis: false,
  //     width: 250,
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <InputNumBox
  //             style={{ width: 150 }}
  //             placeholder="Quantity"
  //             name={reportKeys.qty}
  //             type="number"
  //             rules={coireport ? null : [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "denomination",
  //     title: "Denomination",
  //     dataIndex: reportKeys.denomination,
  //     ellipsis: false,
  //     // filters: extractUniqueValues(goodsData, reportKeys.denomination),
  //     // sorter: (a, b) =>
  //     //   a[reportKeys.denomination].localeCompare(b[reportKeys.denomination]),
  //     // sortDirections: ["descend", "ascend"],
  //     // filterSearch: true,
  //     // onFilter: (value, record) =>
  //     //   record[reportKeys.denomination].includes(value),
  //     width: 250,
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             style={{ width: 150 }}
  //             placeholder="Denomination"
  //             name={reportKeys.denomination}
  //             rules={coireport ? null : [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "category",
  //     title: "Category",
  //     ellipsis: false,
  //     width: 250,
  //      dataIndex: reportKeys.category,
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <SelectBox
  //             style={{ width: 150 }}
  //             placeholder="Category"
  //             name={reportKeys.category}
  //             onChange={handleCategoryChange}
  //             options={sumggled_items_subCategories.map((item) => ({
  //               label: item.category,
  //               value: item.category,
  //             }))}
  //             rules={coireport ? null : [{ required: true, message: "Required Field!" }]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "subcategory",
  //     title: "Sub Category",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.subcategory,
  //     // filters: extractUniqueValues(goodsData, reportKeys.subcategory),
  //     // sorter: (a, b) =>
  //     //   a[reportKeys.subcategory].localeCompare(b[reportKeys.subcategory]),
  //     // sortDirections: ["descend", "ascend"],
  //     // filterSearch: true,
  //     // onFilter: (value, record) =>
  //     //   record[reportKeys.subcategory].includes(value),
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <SelectBox
  //             style={{ width: 150 }}
  //             placeholder="Sub Category"
  //             name={reportKeys.subcategory}
  //             onChange={(value) => setSelectedSubcategory(value)}
  //             //  If the category is found, it extracts the associated subcategories and maps them
  //             //into an array of objects with label and value properties.
  //             options={
  //               selectedCategory
  //                 ? sumggled_items_subCategories
  //                     .find((item) => item.category === selectedCategory)
  //                     ?.subcategories.map((subCategory) => ({
  //                       label: subCategory,
  //                       value: subCategory,
  //                     }))
  //                 : []
  //             }
  //             disabled={!selectedCategory}
  //             value={selectedSubcategory}
  //             rules={coireport ? null : [{ required: true, message: "Required Field!" }]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "confiscated",
  //     title: "Confiscated",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.confiscated,
  //     // filters: extractUniqueValues(goodsData, reportKeys.confiscated),
  //     // sorter: (a, b) =>
  //     //   a[reportKeys.confiscated].localeCompare(b[reportKeys.confiscated]),
  //     // sortDirections: ["descend", "ascend"],
  //     // filterSearch: true,
  //     // onFilter: (value, record) =>
  //     //   record[reportKeys.confiscated].includes(value),
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <SelectBox
  //             style={{ width: 150 }}
  //             placeholder="Confiscated"
  //             name={reportKeys.confiscated}
  //             rules={coireport ? null : [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //             options={[
  //               { value: "Yes", label: "Yes" },
  //               { value: "No", label: "No" },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "value",
  //     title: "Value $",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.value,
  //     // filterDropdown: () => renderFilterDropdown(reportKeys.value, "Number"),
  //     // sorter: (a, b) => a[reportKeys.value] - b[reportKeys.value], // Numerical comparison
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <InputNumBox
  //             style={{ width: 150 }}
  //             placeholder="Value"
  //             name={reportKeys.value}
  //             type="number"
  //             rules={ [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "source",
  //     title: "Source",
  //     ellipsis: false,
  //     width: 250,
  //     dataIndex: reportKeys.source,
  //     // filters: extractUniqueValues(goodsData, reportKeys.source),
  //     // sorter: (a, b) =>
  //     //   a[reportKeys.source].localeCompare(b[reportKeys.source]),
  //     // sortDirections: ["descend", "ascend"],
  //     // filterSearch: true,
  //     // onFilter: (value, record) => record[reportKeys.source].includes(value),
  //     render: (text, record, index) => {
  //       return (showInputs.goodsColumns && index === 0) |
  //         isGoodsEditing(index) ? (
  //         <StyledInput>
  //           <InputBox
  //             // style={{ width: 150 }}
  //             placeholder="Source"
  //             name={reportKeys.source}
  //             rules={ [
  //               {
  //                 required: true,
  //                 message: "Required Field!",
  //               },
  //             ]}
  //           />
  //         </StyledInput>
  //       ) : (
  //         text
  //       );
  //     },
  //   },
  //   {
  //     key: "action",
  //     title: "",
  //     dataIndex: "action",
  //     render: (text, record, index) => {
  //       // if (showButtons) {
  //       if (showInputs.goodsColumns && index === 0) {
  //         return (
  //           <Form.Item>
  //             <div style={{ display: "flex" }}>
  //               <SimpleButton
  //                 onClick={handleGoodsCancel}
  //                 style={{
  //                   fontWeight: "bold",
  //                 }}
  //                 text="Cancel"
  //               />
  //               <SimpleButton
  //                 style={{
  //                   fontWeight: "bold",
  //                   color: "white",
  //                   backgroundColor: "#51AE3B",
  //                 }}
  //                 text="Save"
  //                 onClick={onGoodsFinish}
  //               />
  //             </div>
  //           </Form.Item>
  //         );
  //       } else {
  //         if (!showInputs.goodsColumns) {
  //           if (isGoodsEditing(index)) {
  //             return (
  //               <Form.Item>
  //                 <div style={{ display: "flex" }}>
  //                   <SimpleButton
  //                     onClick={() => {
  //                       setGoodsKey("");
  //                       goodsForm.resetFields();
  //                     }}
  //                     style={{
  //                       fontWeight: "bold",
  //                     }}
  //                     text="Cancel"
  //                   />
  //                   <SimpleButton
  //                     onClick={() => {
  //                       goodsDataEdited(index);
  //                     }}
  //                     style={{
  //                       fontWeight: "bold",
  //                       color: "white",
  //                       backgroundColor: "#ffbf00",
  //                     }}
  //                     text="Edit"
  //                   />
  //                 </div>
  //               </Form.Item>
  //             );
  //           } else if (showButtons) {
  //             return (
  //               <IconsStylingWrap>
  //                 <MdModeEditOutline
  //                   className="editIcon"
  //                   onClick={() => {
  //                     setGoodsKey(index);
  //                     goodsForm.setFieldsValue(record);
  //                     goodsForm.resetFields;
  //                   }}
  //                 />
  //                 <MdDelete
  //                   onClick={() => handleGoodsDelete(index)}
  //                   className="deleteIcon"
  //                 />
  //               </IconsStylingWrap>
  //             );
  //           }
  //         }
  //       }
  //     },
  //   },
  //   // },
  // ];

  const generateColumns = (reportKeys, coireport) => {
    const columnDefinitions = [
      { key: reportKeys.item, title: "Item", placeholder: "Item", type: "text" },
      { key: reportKeys.qty, title: "Quantity", placeholder: "Quantity", type: "number" },
      { key: reportKeys.denomination, title: "Denomination", placeholder: "Denomination", type: "text" },
      { key: reportKeys.category, title: "Category", placeholder: "Category", type: "select" },
      { key: reportKeys.subcategory, title: "Sub Category", placeholder: "Sub Category", type: "multiselect" },
      { key: reportKeys.confiscated, title: "Confiscated", placeholder: "Confiscated", type: "select" },
      { key: reportKeys.value, title: "Value $", placeholder: "Value", type: "number" },
      { key: reportKeys.source, title: "Source", placeholder: "Source", type: "text" },
      { title: "", key: "action", dataIndex: "action", type: "action"   },
    ];
  
    return columnDefinitions.map(({ key, title, placeholder, type }) => ({
      key,
      title,
      ellipsis: false,
      width: type === "action" ? 100 : 250,
      dataIndex: key,
      render: (text, record, index) => {
        if(type==="action")
        {
          if (showInputs.goodsColumns && index === 0) {
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
                    onClick={onGoodsFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (!showInputs.goodsColumns) {
              if (isGoodsEditing(index)) {
                return (
                  <Form.Item>
                    <div style={{ display: "flex" }}>
                      <SimpleButton
                        onClick={() => {
                          setGoodsKey("");
                          goodsForm.resetFields();
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
              } else if(showButtons){
                return (
                  <IconsStylingWrap>
                    <MdModeEditOutline
                      className="editIcon"
                      onClick={() => {
                        console.log(index, record);
                        setGoodsKey(index);
                        goodsForm.setFieldsValue(record);
                        goodsForm.resetFields;
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
        }
        else{
          if(type==="file")
          {
            // console.log(record, text,"\n", "Record for psicture", reportKeys.image,reportKeys.picture,
            // !record?.[reportKeys.image]?.[0]?.[reportKeys.picture], "\nPIcture", record?.[reportKeys.image], "\n", showInputs.ownerColumns, index, isOwnerEditing(index) && (record?.[reportKeys.image]))
          return (showInputs.ownerColumns && index === 0) |
            (isOwnerEditing(index) && (record?.[reportKeys.image])) ? (
                <input
                  style={{ width: "100%" }}
                  type="file"
                  name={sreport ? "sroi_image" : "roi_image"}
                  accept=".png,.jpg,.jpeg,.gif,.tiff,.jfif"
                  onChange={handleImageUpload}
                />
            )  : 
            (
              <div>
                {(isValidImages(record.sro_images) || isValidImages(record.roi_images) || isValidImages(record.rvo_images)) ? (
                  <div>
                    {/* Display the uploaded picture or show "No picture" if no picture is present */}
                    <IconsStylingWrap>
                      <ImagePreviews>
                      {sreport ?  (
                        <span>
                          {console.log("ImagePreviews", record.sro_images[0], "\nImages", record.sro_images)}
                          {(record.sro_images?.sroi_image === null) ? (
                            <p>No Picture</p>
                          ) : (typeof record.sro_images[0]?.sroi_image === 'string') ? (
                            <Image
                              src={record.sro_images[0].sroi_image}
                              alt="Owner"
                              style={{ maxWidth: "70px", maxHeight: "70px" }}
                            />
                          ) : (
                            <div className="imgUp">
                              <p>Uploaded</p>
                              <span><MdRemoveRedEye size={20} /></span>
                            </div>
                          )}
                        </span>
                      ) : 
                      (
                        <span>
                          {record.rvo_images? (
                            console.log("ImagePreviews",record.rvo_images, text, record?.rvo_images[0]?.roi_image),
                            (record.rvo_images?.roi_image === null ) ? (
                              <p>No Picture</p>
                            ) : (
                            (record.rvo_images.url ? (typeof (record.rvo_images.url) === 'string') : 
                              (typeof (record.rvo_images.roi_image) === 'string')) ?
                              <Image
                                src={record.rvo_images.url ? record.rvo_images.url : record.rvo_images.roi_image}
                                alt="Boat"
                                style={{ maxWidth: "60px", maxHeight: "60px" }}
                              /> :
                              (<div className="imgUp">
                                <p>Uploaded</p>
                                <span><MdRemoveRedEye size={20}/></span>
                              </div>)
                            )
                          ) : (
                            console.log("ImagePreviews",record.roi_images.roi_image, text),
                            (record.roi_images?.roi_image === null ) ? (
                              <p>No Picture</p>
                            ) : (
                            (record.roi_images.url ? (typeof (record.roi_images.url) === 'string') : 
                              (typeof (record.roi_images.roi_image) === 'string')) ?
                            <Image
                              src={record.roi_images.url ? record.roi_images.url : record.roi_images[0].roi_image}
                              alt="Boat"
                              style={{ maxWidth: "70px", maxHeight: "70px" }}
                            /> :
                            (<div className="imgUp">
                              <p>Uploaded</p>
                              <span><MdRemoveRedEye size={20}/></span>
                            </div>)
                            )
                          )
                          }
                        </span>
                      )}
                      </ImagePreviews>

                      {isOwnerEditing(index) ? (
                        Array.isArray(record?.[reportKeys.image]) ? (
                          console.log("Deletion Arr", record?.[reportKeys.image], reportKeys.image),
                          // If it's an array, check the first element's picture field
                          record?.[reportKeys.image]?.[0]?.[reportKeys.picture] ? (
                            <MdDelete
                              onClick={() => handleImageDelete(index)}
                              className="deleteIcon"
                            />
                          ) : (<p>D</p>)
                        ) : (
                          console.log("Deletion Obj", record?.[reportKeys.image], record?.[reportKeys.image]?.[reportKeys.picture], reportKeys.image),
                          // If it's an object, check the picture field directly
                          record?.[reportKeys.image]?.[reportKeys.picture] ? (
                            <MdDelete
                              onClick={() => handleImageDelete(index, record?.[reportKeys.image].roi_key ? record?.[reportKeys.image].roi_key: record?.[reportKeys.image].sroi_key )}
                              className="deleteIcon"
                            />
                          ) : (
                            <p>D</p>)
                        )
                      ) : null}
                    </IconsStylingWrap>
                  </div>
                ) : (
                  // Display "No picture" if no picture is present
                  console.log("nooo"),
                  isOwnerEditing(index) ? (
                    <input
                      style={{ width: 200 }}
                      type="file"
                      name={sreport ? "sroi_image" : "roi_image"}
                      accept=".png,.jpg,.jpeg,.gif,.tiff,.jfif"
                      onChange={handleImageUpload}
                    />
                  ) : (
                  <span>No picture</span>)
                )}
              </div>
            )
          }
          else{
            if ((showInputs.goodsColumns && index === 0) || isGoodsEditing(index)) {
              return (
                <StyledInput>
                  {type === "date" && (
                    <DateBox
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      name={key}
                      rules={coireport ? null : [{ required: true, message: "Please select a date!" }]}
                    />
                  )} 
                  {type === "text" && (
                    <InputBox
                      style={{ width: "100%" }}
                      placeholder={placeholder}
                      name={key}
                      rules={coireport ? null : [{ required: true, message: "Required Field!" }]}
                    />
                  )}                  
                  {type === "number" && (
                    <InputNumBox
                      style={{ width: "100%" }}
                      placeholder={placeholder}
                      name={key}
                      type="number"
                      rules={coireport ? null : [{ required: true, message: "Required Field!" }]}
                    />
                  )}
                  {type === "select" && (
                     <SelectBox
                      style={{ width: 150 }}
                      placeholder={placeholder}
                      name={key}
                      onChange={handleCategoryChange}
                      options={key==="category" ? sumggled_items_subCategories.map((item) => ({
                        label: item.category,
                        value: item.category,
                      })) : [{ value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },]}
                      rules={coireport ? null : [{ required: true, message: "Required Field!" }]}
                    />
                  )}
                  {type === "multiselect" && (
                     <SelectBox
                      style={{ width: 150 }}
                      placeholder={placeholder}
                      name={key}
                      onChange={(value) => setSelectedSubcategory(value)}
                      //  If the category is found, it extracts the associated subcategories and maps them
                      //into an array of objects with label and value properties.
                      options={
                        selectedCategory
                          ? sumggled_items_subCategories
                              .find((item) => item.category === selectedCategory)
                              ?.subcategories.map((subCategory) => ({
                                label: subCategory,
                                value: subCategory,
                              }))
                          : []
                      }
                      disabled={!selectedCategory}
                      value={selectedSubcategory}
                      rules={coireport ? null : [{ required: true, message: "Required Field!" }]}
                    />
                  )}
                </StyledInput>
              );
            } else {
              return type === "date" && record[key] ? dayjs(text).format("YYYY-MM-DD") : text;
            }
          }
        }
      },
    }));
  };

   // Generate columns based on `props.coireport`
   const goodsColumns = props.coireport ? generateColumns(reportKeysCoi, true) : generateColumns(reportKeys, false);

  return (
    <div className="mb-10">
      <AntdTable
        form={goodsForm}
        onFinish={onGoodsFinish}
        columns={goodsColumns}
         data={showInputs.goodsColumns ? [{}, ...goodsData] : goodsData}
        // data={
        //   showInputs.goodsColumns
        //     ? [{}, ...filteredDataSource]
        //     : filteredDataSource || goodsData
        // }
        pagination={true}
        titletext="Goods Details"
        showButton={showButtons}
        btnTitle="Add Goods Details"
        onBtnClick={handleGoodsColumnShowInput}
        btndisabled={goodsKey !== ""}
      />
    </div>
  );
}

export default GoodsTable;
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
