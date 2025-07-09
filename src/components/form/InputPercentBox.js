import { Form, InputNumber } from "antd";
import React from "react";

const InputPercentageBox = (props) => {
    const safeFormatter = value =>
    value != null && value !== '' ? props.formatter?.(value) : '';

  return (
    <Form.Item label={props.label} name={props.name} rules={props.rules} >
      <InputNumber {...props} parser={props.parser} value={props.value} formatter={props.disabled ? safeFormatter : props.formatter} style={props.style} defaultValue={props.initialvalue}/>
    </Form.Item>
  );
  // /style={{width: "642px"}}  formatter={props.formatter}
};
export default InputPercentageBox;

// import { Form, InputNumber } from "antd";
// import React from "react";

// const InputPercentageBox = ({
//   label,
//   name,
//   rules,
//   style,
//   disabled,
//   parser,
//   formatter,
//   ...rest
// }) => {
//   const safeFormatter = (value) =>
//     value != null && value !== '' ? formatter?.(value) : '';

//   return (
//     <Form.Item label={label} name={name} rules={rules}>
//       {
//     console.log(formatter, disabled)}
//       <InputNumber
//         {...rest}
//         style={style}
//         disabled={disabled}
//         parser={parser}
//         formatter={disabled ? safeFormatter : formatter}
//       />
//     </Form.Item>
//   );
// };

// export default InputPercentageBox;
