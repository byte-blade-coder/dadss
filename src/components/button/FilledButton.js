import { Button } from "antd";
import React from "react";

function FilledButton(props) {
  return <Button {...props} >{props.text}</Button>;
}

export default FilledButton;
