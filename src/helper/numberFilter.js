import { Button, InputNumber, Select } from "antd";
import { useState } from "react";

function NumberFilter({ props }) {
  const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);
  const [filterOperator, setFilterOperator] = useState("eq");

  const resetFilter = () => {
    setFilterValue(null);
    setFilterValueBtw([null, null]);
    props.clearFilters();
  };

  return (
    <div style={{ padding: 4, width: 200 }}>
      <Select
        defaultValue="eq"
        style={{ width: 190, marginTop: 8 }}
        onChange={(value) => {
          setFilterOperator(value);
          if (value === 'btw')
            props.setSelectedKeys(['$' + value + '_' + filterValueBtw[0] + '_' + filterValueBtw[1]]);
          else
            props.setSelectedKeys(['$' + value + '_' + filterValue]);
        }}
      >
        <Select.Option value="eq">Equal</Select.Option>
        <Select.Option value="gt">Greater Than</Select.Option>
        <Select.Option value="lt">Less Than</Select.Option>
        <Select.Option value="btw">Between</Select.Option>
      </Select>
      {filterOperator === "btw" && (
        <div style={{ display: "flex", marginTop: 8 }}>
          <InputNumber
            style={{ width: 95 }}
            placeholder="Min"
            value={filterValueBtw[0]}
            onChange={(value) => {
              setFilterValueBtw([value, filterValueBtw[1]]);
              props.setSelectedKeys(['$' + filterOperator + '_' + value + '_' + filterValueBtw[1]]);
            }}
          />
          <span style={{ margin: "0 8px" }}>to</span>
          <InputNumber
            style={{ width: 95 }}
            placeholder="Max"
            value={filterValueBtw[1]}
            onChange={(value) => {
              setFilterValueBtw([filterValueBtw[0], value]);
              props.setSelectedKeys(['$' + filterOperator + '_' + filterValueBtw[0] + '_' + value]);
            }}
          />
        </div>
      )}
      {filterOperator !== "btw" && (
        <div style={{ marginTop: 8 }}>
          <InputNumber
            style={{ width: 190 }}
            placeholder="Number"
            value={filterValue}
            onChange={(value) => {
              setFilterValue(value);
              props.setSelectedKeys(['$' + filterOperator + '_' + value]);
            }
            }
          />
        </div>
      )}
      <div className="ant-table-filter-dropdown-btns">
        <Button
          className="ant-btn ant-btn-link ant-btn-sm"
          onClick={resetFilter}
        >
          Reset
        </Button>
        <Button
          className="ant-btn ant-btn-primary ant-btn-sm"
          onClick={() => {
            props.confirm();
            props.close();
          }}
        >
          OK
        </Button>
      </div>
    </div>
  );

}

export default NumberFilter;