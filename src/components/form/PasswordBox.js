import { Form, Input } from "antd";
import React from "react";

const PasswordBox = (props) => {
  return (
    <Form.Item
      className="flex flex-col"
      label={props.label}
      name={props.name}
      rules={props.rules}
    >
      <Input.Password
        // className="border-black text-md	"
        {...props}
      />
    </Form.Item>
  );
};
export default PasswordBox;
