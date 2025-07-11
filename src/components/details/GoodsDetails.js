import { useEffect, useState } from "react";
import { Col, Row,} from "antd";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import "react-toastify/dist/ReactToastify.css";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DataDisplayTable from "../table/DataDisplay.js";

function GoodsTable(props) {
  const { goodsData, setGoodsData,} = props;

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
  const [filteredDataSource, setFilteredDataSource] = useState(null);

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

  useEffect(() => {
    if (goodsData) {
      setFilteredDataSource(goodsData);
    }
  }, [goodsData]);

  const goodsColumns =  [
    {
      title: "Item",
      key: "item",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.item,
      render: (text, record, index) => {
        return text;
      },
    },
    {
      key: "qty",
      title: "Quantity",
      dataIndex: reportKeys.qty,
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return text;
      },
    },
    {
      key: "denomination",
      title: "Denomination",
      dataIndex: reportKeys.denomination,
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return text;
      },
    },
    {
      key: "category",
      title: "Category",
      ellipsis: false,
      width: 250,
       dataIndex: reportKeys.category,
      render: (text, record, index) => {
        return text;
      },
    },
    {
      key: "subcategory",
      title: "Sub Category",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.subcategory,
      render: (text, record, index) => {
        return text;
      },
    },
    {
      key: "confiscated",
      title: "Confiscated",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.confiscated,
      render: (text, record, index) => {
        return text;
      },
    },
    {
      key: "value",
      title: "Value $",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.value,
      render: (text, record, index) => {
        return text;
      },
    },
    {
      key: "source",
      title: "Source",
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.source,
      render: (text, record, index) => {
        return text
      },
    },
  ];

  return (
    <div className="mb-10">
      <DataDisplayTable
        form={goodsForm}
        columns={goodsColumns}
        data={showInputs.goodsColumns ? [{}, ...goodsData] : goodsData}
        pagination={true}
        titletext="Goods Details"
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
