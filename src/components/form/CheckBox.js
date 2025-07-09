import React from "react";
import { Checkbox, Form } from "antd";
import styled from "styled-components";

const IconsCenter = styled.div`
  .custom-pagination-item {
    margin: 0 8px;
    font-size: 16px;
    color: white;
    cursor: pointer;
  }
  .ant-pagination-item {
    border-radius: 20px;
    padding: 0px 6px 0px 6px;
    align-items: center;
    display: block;
  }
  .ant-pagination .ant-table-pagination .ant-table-pagination-center {
    display: block;
  }
  .custom-pagination-item:hover {
    color: #1890ff;
  }
  .ant-pagination-prev {
    background-color: midnightblue;
    border-radius: 100%;
    display: flex;
    align-items: center;
  }
  .ant-pagination-next {
    background-color: midnightblue;
    border-radius: 100%;
    display: flex;
    align-items: center;
  }
`;
const Check = (props) => {
  return (
    <Form.Item name={props.name} value={props.value} rules={props.rules}>
      <Checkbox {...props}>{props.label}</Checkbox>
    </Form.Item>
  );
};
export default Check;
