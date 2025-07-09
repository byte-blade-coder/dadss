import { Form, Space } from "antd";
import React from "react";
import InputNumBox from "./InputNumBox";
import SelectBox from "./SelectBox";
import InputPercentageBox from "./InputPercentBox";

const PositionBox = (props) =>{
 // console.log(props)
  const rules = [
    {
      required: true,
      message: "Required!",
    },
  ];

  const long_options = [
    { value: "E", label: "E" },
    { value: "W", label: "W" },
  ];

  const lat_options = [
    { value: "N", label: "N" },
    { value: "S", label: "S" },
  ];
  return (
    // <Form.Item label={props.label}>
    //   <Form.List name={props.name}>
    //     {() => {
    //       return (
    //         <Space.Compact >
    //           <InputNumBox
    //             placeholder="dd"
    //             name={"deg"}
    //             rules={rules}
    //             min={0}
    //             max={props.coordinate ? 90 : 180} // props.coordinate: 0 for longitude, 1 for latitude
    //             suffix={"\u00b0"}
    //           />
    //           <InputNumBox
    //             placeholder="mm"
    //             name={"min"}
    //             rules={rules}
    //             min={0}
    //             max={59}
    //             suffix={"'"}
    //           />
    //           <InputNumBox
    //             placeholder="ss"
    //             name={"sec"}
    //             rules={rules}
    //             max={59}
    //             min={0}
    //             suffix={'"'}
    //           />
    //           <SelectBox
    //             placeholder={props.coordinate ? "N" : "E"}
    //             name={"dir"}
    //             options={props.coordinate ? lat_options : long_options}
    //             rules={rules}
    //           />
    //         </Space.Compact>
    //       );
    //     }}
    //   </Form.List>
    // </Form.Item>
    <Form.Item label={props.label} style={{ marginTop: "-20px"}}  required={true}>
      <Form.List name={props.name}>
        {() => {
          return (
              <InputPercentageBox
                placeholder="Coordinates"
                name={props.coordinate === 1 ? "lat" : "lng"}
                rules={props.rules}
                initialvalue={props.initialvalue}
                style= {props.style}
              />
          );
        }}
      </Form.List>
    </Form.Item>
  );
};
export default PositionBox;
