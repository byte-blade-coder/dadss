import { Form, Input } from "antd";
import React from "react";

const InputBox = (props) => {
  return (
    <Form.Item label={props.label} name={props.name} rules={props.rules}
    labelCol={props.labelCol} wrapperCol={props.wrapperCol} suffix={props.suffix}
    style={props.style}>
      <Input {...props} style={{color: 'black'}}/>
      {/* <Input {...props}/> */}
    </Form.Item>
  );
};
export default InputBox;
