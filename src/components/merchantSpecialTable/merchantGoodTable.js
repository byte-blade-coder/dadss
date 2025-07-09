import { useState } from "react";
import { Col, Row, Table, Input, Form, InputNumber, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import PositionBox from "../form/PositionBox";
import {
  movement_list,
  sumggled_items_subCategories,
  smuggled_Items_Categories,
} from "../../helper/dropdown";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function MerchantGoodsTable(props) {
  const { goodsData, setGoodsData, showButtons } = props;
  const [goodsForm] = useForm();
  const [goodsKey, setGoodsKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    goodsColumns: false,
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    // Reset selected subcategory when the category changes
    setSelectedSubcategory("");
  };

  const handleGoodsColumnShowInput = () => {
    goodsForm.resetFields();
    setShowInputs({ ...showInputs, goodsColumns: true });
  };

  const handleGoodsCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, goodsColumns: false });
      },
    });
  };

  const handleGoodsDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setGoodsData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    goodsForm.resetFields();
  };

  const isGoodsEditing = (record_index) => record_index === goodsKey;

  const goodsDataEdited = (key) => {
    const editedValues = goodsForm.getFieldValue();
    const newEdited = {
      ...editedValues,
    };
    setGoodsData((previous) => {
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


  const goodsColumns = [
    {
      title: "Item",
      dataIndex: "msrg_item",
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Item"
              name="msrg_item"
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
      title: "Quantity",
      dataIndex: "msrg_qty",
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputNumBox
              placeholder="Quantity"
              name="msrg_qty"
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
      title: "Denomination",
      dataIndex: "msrg_denomination",
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Denomination"
              name="msrg_denomination"
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
      title: "Category",
      dataIndex: "msrg_category",
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            {/* <InputBox
              placeholder="Category"
              name="srg_category"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            /> */}

            <SelectBox
              placeholder="Category"
              name="msrg_category"
              onChange={handleCategoryChange}
              options={sumggled_items_subCategories.map((item) => ({
                label: item.category,
                value: item.category,
              }))}
  
              rules={[{ required: true, message: "Required Field!" }]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Sub Category",
      dataIndex: "msrg_subcategory",
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <SelectBox
              placeholder="Sub Category"
              name="msrg_subcategory"
              onChange={(value) => setSelectedSubcategory(value)}
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
              rules={[{ required: true, message: "Required Field!" }]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Confiscated",
      dataIndex: "msrg_confiscated",
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <SelectBox
              placeholder="Confiscated"
              name="msrg_confiscated"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Value $",
      dataIndex: "msrg_value",
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputNumBox
              placeholder="Value"
              name="msrg_value"
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
      title: "Source",
      dataIndex: "msrg_source",
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Source"
              name="msrg_source"
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
      render: (text, record, index) => {
        if (showButtons) {
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
            if(!showInputs.goodsColumns){
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
                      onClick={() => {goodsDataEdited(index) 
                    }
                    }
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
            } else {
              return (
                <IconsStylingWrap>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
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
      },
    },
  ];

  return (
    <Form form={goodsForm} onFinish={onGoodsFinish} className="mb-8">
      <Row className="mb-5">
        <Col span={24} className="flex justify-between">
          <Heading
            level={5}
            text="Goods Details"
            className="whitespace-nowrap "
          />
          {showButtons && (
            <FilledButton
              text="+ Add Goods Details"
              className="rounded-full border-midnight bg-midnight text-white"
              onClick={handleGoodsColumnShowInput}
              disabled={goodsKey !== ""}
            />
          )}
        </Col>
      </Row>
      <StyledDiv>
        <Table
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
          columns={goodsColumns}
          dataSource={showInputs.goodsColumns ? [{}, ...goodsData] : goodsData}
          pagination={true}
        />
      </StyledDiv>
    </Form>
  );
}

export default MerchantGoodsTable;
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
