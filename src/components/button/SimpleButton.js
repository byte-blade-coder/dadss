import { Button } from "antd";
import React from "react";

function SimpleButton(props) {
  return (
    <Button className="mx-1 py-1 px-3 rounded-full " {...props}>
      {props.text}
    </Button>
  );
}

export default SimpleButton;
