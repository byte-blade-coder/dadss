import React, {useState} from "react";
import { Button } from "antd";
import SelectBox from "../form/SelectBox";
import InputBox from "../form/InputBox";

const DynamicSelectOrInput = ({
  form,
  name,
  options,
  disabled,
  label,
  placeholder = "Select",
  inputPlaceholder = "Enter New Type",
  rules = [],
  style = {},
  inputStyle = {},
  buttonStyle = {},
  divStyle,
  setSelectedOpt,
  selectedOpt,
}) => {
  
  const value = form.getFieldValue(name);
  const [prevValues, setPrevValues] = useState([]);
  // const isOthers = Array.isArray(value) ? value.includes("Others") : value === "Others";

  return selectedOpt !== "Others" ? (
  label!=="Patrol Type" ? 
    (<SelectBox
      label={label}
      disabled={disabled}
      name={name}
      placeholder={placeholder}
      style={style}
      rules={rules}
      options={[...options, { value: "Others", label: "Others" }]}
      onChange={(val) => {
        setSelectedOpt(val)
        form.setFieldsValue({
          [name]: val !== "Others" ? val : "",
        });
      }}
    />) :
    (  <SelectBox
      mode="multiple"
      allowClear
      autocomplete="off"
      label={label}
      disabled={disabled} // || options.length === 0
      name={name}
      placeholder={placeholder}
      style={style}
      rules={rules}
      options={[...options, { value: "Others", label: "Others" }]}
      // onChange={(val) => {
      //   const hasOthers = val.includes("Others");  
      //   const withoutOthers = val.filter((v) => v !== "Others");
      //   setSelectedOpt(hasOthers ? "Others" : val);
      //   // form.setFieldsValue({
      //   //   [name]: hasOthers ? [] : val,
      //   // });
      //     form.setFieldsValue({
      //       [name]: hasOthers ? [] : val,
      //     });
      // }}
      onChange={(val) => {
        const hasOthers = val.includes("Others");
        const withoutOthers = val.filter((v) => v !== "Others");

        if (hasOthers) {
          // Save current selections before clearing
          setPrevValues(withoutOthers);
          setSelectedOpt("Others");
          form.setFieldsValue({
            [name]: [], // clear selection temporarily
          });
        } else {
          setSelectedOpt(val);
          setPrevValues([]); // clear backup if not needed
          form.setFieldsValue({
            [name]: val,
          });
        }
      }}
      className="input"
      // value={value}
    />) 
  ) : (
    <div style={{...divStyle }}>
      <InputBox
        label={label}
        name={name}
        placeholder={inputPlaceholder}
        rules={rules}
        style={inputStyle}
        disabled={disabled}
      />
     <Button
        style={{ ...buttonStyle }}
        // onClick={() => {
        //   const inputValue = form.getFieldValue(name);
        //   if (inputValue && inputValue.trim() !== "") {
        //     // use as value
        //     setSelectedOpt(inputValue);
        //   } else {
        //     // reset
        //     setSelectedOpt(null);
        //     form.setFieldsValue({ [name]: undefined });
        //   }
        // }}
          onClick={() => {
          const inputValue = form.getFieldValue(name);
          if (inputValue && inputValue?.trim() !== "") {
            if(label!=="Patrol Type")
            {
              setSelectedOpt(inputValue);
            }
            else{
               // Combine previous selections + custom input
              const updatedValues = Array.from(new Set([...prevValues, inputValue]));

              setSelectedOpt(updatedValues);
              form.setFieldsValue({ [name]: updatedValues });

              // Clear previous values since we're done
              setPrevValues([]);
            }
          } else {
            // Reset if input is empty
            setSelectedOpt(null);
            form.setFieldsValue({ [name]: undefined });
          }
        }}
      >
        &#x21A9;{" "}
        {/* Leftwards Arrow With Hook for back symbol */}
      </Button>
    </div>
  );
};

export default DynamicSelectOrInput;
