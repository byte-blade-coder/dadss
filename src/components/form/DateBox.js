import { DatePicker, Form, Input } from "antd";
import React from "react";
import InputBox from "./InputBox";

function DateBox(props) {
  return props.disabled ? (
    <InputBox {...props} rules={[]}></InputBox>
  ) : (
    <Form.Item label={props.label} name={props.name} rules={props.rules}>
      <DatePicker {...props} />
    </Form.Item>
  );
}

export default DateBox;
