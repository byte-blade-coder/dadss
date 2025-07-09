import { Form, InputNumber } from "antd";
import React from "react";

const InputBox = (props) => {
  const parser = (value) => {
    return Number(value.replace(/[^0-9]/g, ""));
  };
  return (
    <Form.Item label={props.label} name={props.name} rules={props.rules}>
      <InputNumber {...props} parser={parser} style={props.style}/>
    </Form.Item>
  );
};
export default InputBox;
