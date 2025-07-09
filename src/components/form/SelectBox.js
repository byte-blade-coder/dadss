import { Form, Input, Select } from "antd";
import React from "react";
import styled from "styled-components";
import InputBox from "./InputBox";
const { Option } = Select;

const SelectBox = (props) => {
  return props.disabled ? <InputBox {...props} rules={[]}></InputBox> : (
    <Form.Item
      label={props.label}
      name={props.name}
      rules={props.rules}
      labelCol={props.labelCol} 
      value={props.value}
    >
      <Select
        // className="border-black text-md"
        {...props}
      >
        {props?.options?.map((option) => (
          <Option key={option.value} value={option.value} >
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};
export default SelectBox;

