import React, { useState } from 'react';
import { Checkbox, Button, Dropdown, Menu, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const CustomDropdownWithCheckbox = ({ options, onChange, defaultSelected = [] }) => {
  const [selectedValues, setSelectedValues] = useState(defaultSelected);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  console.log("options", options)
  // Handle search filter change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuClick = ({ key }) => {
    console.log("handleMenuClick", key)
    const selected = [...selectedValues];
    if (selected.includes(key)) {
      setSelectedValues(selected.filter(value => value !== key));
    } else {
      setSelectedValues([...selected, key]);
    }
  };

  const handleChange = (checkedValues) => {
    setSelectedValues(checkedValues);
    onChange(checkedValues);
  };

  const menu = (
    <div style={{ width: '200px' }}>
      {/* Search input */}
      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
        // style={{ marginBottom: '10px' }}
      />

      <Menu>
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {options.map(option => (
            <Menu.Item key={option.value} onClick={handleMenuClick}>
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onChange={() => handleChange(selectedValues)}
              >
                {option.label}
              </Checkbox>
            </Menu.Item>
          ))}
        </div>
      </Menu>
    </div>
  );
console.log("selectedValues", selectedValues)
  return (
    <Dropdown
      menu={menu}
      open={visible}
      onOpenChange={(flag) => setVisible(flag)}
    >
      <Button>{selectedValues.length > 0 ? selectedValues.join(", ") : "Select Harbor"} <DownOutlined /></Button>
    </Dropdown>
  );
};

export default CustomDropdownWithCheckbox;
