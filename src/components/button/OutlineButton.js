import { Button } from "antd";
import React from "react";

function OutlineButton(props) {
  return (
    <Button className="rounded-full pl-10 pr-10" {...props}>
      {props.text}
    </Button>
  );
}

export default OutlineButton;
