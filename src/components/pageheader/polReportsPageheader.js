import React, { useEffect, useState } from "react";
import { RxArrowLeft } from "react-icons/rx";
import { Button, Select, Col, Row, Tooltip, DatePicker, Segmented } from "antd";
import { useRouter } from "next/router.js";
import PageHeaderIndex from "../pageheader/pageHeaderNew";
import { GrTable } from "react-icons/gr";
import { BsTable } from "react-icons/bs";
import { ImTable, ImTable2 } from "react-icons/im";
import { FiTable } from "react-icons/fi";
import { TbListDetails } from "react-icons/tb";
import styled from "styled-components";
import {BarChartOutlined, LineChartOutlined, PieChartOutlined} from "@ant-design/icons"

const { RangePicker } = DatePicker;


function ReportsPageHeader(props) {
  const { setDateRange, dateRange, showButton,disabledDate, currentData, title, componentRef, columns, handleViewChange, reportView, noChart } = props
  const router = useRouter();

  return (
    <React.Fragment>
      <UserControls className="inline-flex px-2 mt-2">
        <div className="pl-2">
          <div>
            <p className="font-bold">View Report As </p>
          </div>
          {/*  //, icon: <ImTable  */}
          <Segmented
            options={noChart ? 
            [
              {
                label: (<Tooltip title="Summary">Summarized</Tooltip>),
                value: 'summary',
                icon: <FiTable />,
              },
              {
                label: (<Tooltip title="Detailed">Detailed</Tooltip>),
                value: 'detailed',
                icon: <TbListDetails />,
              },
            ]
            : [
              { label: (<Tooltip title="Table">Table</Tooltip>),value: 'table', icon: <ImTable2 />},
              { label: (<Tooltip title="Chart">Chart</Tooltip>),value: 'chart', icon: <BarChartOutlined />,},
            ]}
            onChange={handleViewChange}
            value={reportView}
            // style={{
            //   marginBottom: 24,
            // }}
          />
        </div>
        <div className="px-2">
          <div>
            <p className="font-bold">Select a Date </p>
          </div>
          <RangePicker
            onChange={(value) => setDateRange(value)}
            defaultValue={dateRange}
            format="DD-MM-YYYY"
            className="custom-range-picker"           
             // style={{
            //   marginBottom: 24,
            // }}
            disabledDate={disabledDate}
          />
        </div>
        {PageHeaderIndex && (
          <PageHeaderIndex
            currentData={currentData}
            title={title}
            dateRange={dateRange}
            componentRef={componentRef}
            columns={columns}
            reportView={reportView}
          />) }
      </UserControls>
    </React.Fragment>
  );
}

const UserControls = styled.div`
  display: inline-flex;

  .ant-segmented{
    display: inline-flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    transition: border 0.2s, box-shadow 0.2s;
    color: rgba(0, 0, 0, 0.88);
    padding: 0px 0px 0px; 
    font-size: 16px; background-color: #fff
  }
  .ant-segmented-group{
    gap: 1px;
  }
  .ant-segmented-item{
    padding: 0px 0px 1px;
  }
  .ant-segmented-item:hover{
    background-color: lightgray;
    font-weight: 500;
  }
  .ant-segmented .ant-segmented-item-selected {
    //  #4096ff;
    // background-color: rgba(6,57,112,0.9);
    background-color: #063970;
    color: rgba(255, 255, 255, 1);
    font-weight: 500;
  }
  .ant-segmented .ant-segmented-item-label {
    padding: 4px 8px 2px;
    line-height: 22px;
    display: flex;
    align-items: center;

  }
  .ant-segmented-item-label span:nth-of-type(2) {
    font-size: 14px;
    font-weight: 500;
}

  // .ant-segmented-item-label:hover{
  //   background-color: rgba(6,57,112,0.9);
  // }

`;

export default ReportsPageHeader;