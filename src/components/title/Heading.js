import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const Heading = (props) => {
  return <Title {...props}>{props.text}</Title>;
};

export default Heading;
