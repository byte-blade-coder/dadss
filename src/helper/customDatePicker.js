import React, { useState } from 'react';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';

const { RangePicker } = DatePicker;

const SeparateDatePickers = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onStartDateChange = (date, dateString) => {
    setStartDate(date);
  };

  const onEndDateChange = (date, dateString) => {
    setEndDate(date);
  };

  return (
    <Space direction="horizontal" size={12}>
      <DatePicker
        value={startDate}
        onChange={onStartDateChange}
        placeholder="Start Date"
        style={{ width: '100%' }}
      />
      <DatePicker
        value={endDate}
        onChange={onEndDateChange}
        placeholder="End Date"
        style={{ width: '100%' }}
        disabledDate={(currentDate) => startDate && currentDate && currentDate < startDate}
      />
    </Space>
  );
};

export default SeparateDatePickers;
