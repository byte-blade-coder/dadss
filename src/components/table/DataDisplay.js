
//29/04/2024
import { Col, Form, Row, Table } from "antd";
import React, {useState} from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import styled from "styled-components";
import Heading from "../title/Heading";
import { IoIosAdd } from "react-icons/io";

const StyledDiv = styled.div`
  
.ant-table-wrapper{
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    border-radius: 10px;
  }

  .custom-pagination-item {
    margin: 0 8px;
    font-size: 16px;
    color: white;
    cursor: pointer;
  }
  .ant-pagination-item {
    border-radius: 20px;
    padding: 0px 6px 0px 6px;
    align-items: center;
    display: block;
  }
  .ant-pagination .ant-table-pagination .ant-table-pagination-center {
    display: block;
  }
  .custom-pagination-item:hover {
    color: #1890ff;
  }
  .ant-pagination-prev {
    background-color: midnightblue;
    border-radius: 100%;
    display: flex;
    align-items: center;
  }
  .ant-pagination-next {
    background-color: midnightblue;
    border-radius: 100%;
    display: flex;
    align-items: center;
  }
  .ant-table-cell {
    padding: 12px !important;
    white-space: nowrap;
    word-wrap: break-word !important;
  }
  .ant-table-content{
    scrollbar-color: auto;
  }
  .table-container {
    pointer-events: auto; /* Ensure pointer-events are enabled */
    user-select: auto; /* Allow user selection */
  }
  ::-webkit-scrollbar {
    scrollbar-width: thin;
    width: 2px;
    background-color: white;
  }
  .ant-table-content::-webkit-scrollbar-track {
    background: transparent;
  }
  .ant-table-content::-webkit-scrollbar-thumb {
    background-color: #9a9a9a;
    border-radius: 10px;
    // border: 3px solid #686868;
  }
  .ant-checkbox + span {
    color: white !important;
  }
  label.ant-checkbox-wrapper.ant-checkbox-wrapper-checked.ant-checkbox-group-item.css-dev-only-do-not-override-sk7ap8
    span {
    color: white !important;
  }
  // Antd Column header color
  .ant-table-thead .ant-table-cell {
    background-color: #063970 !important;
    color: white
    }
`;

function DataDisplayTable({
  columns,
  data,
  loading,
  onFinish,
  form,
  pagination = true,
  expandable,
  scrollConfig = {},
  titletext,
}) {

  return (
    <React.Fragment>
      <StyledDiv style={{ margin: 15 }}>
        {titletext && (<div className="mb-2">
          <Row >
            <Col span={12} className="flex justify-start mt-2">
              <Heading
                className="whitespace-nowrap ml-1"
                level={4}
                text={titletext}
              />
            </Col>
          </Row>
        </div>
        )}
        <Form onFinish={onFinish} form={form}>
          <Table
            expandable={expandable}
            rowClassName="editable-row"
            loading={loading}
            locale={{ emptyText: "No data available in table" }}
            pagination={
              pagination
                ? {
                  showSizeChanger: true, // Enable size changer
                  pageSizeOptions: ["5", "10", "20", "50", "100"], // Define options for page size
                  defaultPageSize: 10, // Set default page size
                  position: ["bottomCenter"],
                  itemRender: (page, type, originalElement) => {
                    switch (type) {
                      case "prev":
                        return (
                          <div className="custom-pagination-item ">
                            <BsChevronLeft />
                          </div>
                        );
                      case "next":
                        return (
                          <div className="custom-pagination-item ">
                            <BsChevronRight />
                          </div>
                        );
                      default:
                        return (
                          <div className="custom-pagination-item">
                            {originalElement}
                          </div>
                        );
                    }
                  },
                }
                : false
            }
            columns={columns}
            dataSource={data}
            scroll={{ x: true }} // Merge with x: true for horizontal scrolling
          />
        </Form>
      </StyledDiv>
    </React.Fragment>
  );
}

export default DataDisplayTable;
