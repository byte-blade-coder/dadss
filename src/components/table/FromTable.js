import {Form, Table } from "antd";
import React, { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import styled from "styled-components";

const StyledDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
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

  .ant-table-content::-webkit-scrollbar {
    height: 2px;
    width: 2px;
    /* width of the entire scrollbar */
  }
  .ant-table-content::-webkit-scrollbar-track {
    background: transparent;
    /* color of the tracking area */
  }
  .ant-table-content::-webkit-scrollbar-thumb {
    background-color: #9a9a9a;
    // backgroundColor:transparent
    /* color of the scroll thumb */
    border-radius: 10px;
    border: 3px solid #686868;
  }
`;

function FormTable({
  columns,
  data,
  loading,
  onFinish,
  form,
  pagination = true,
  expandable,
  scrollConfig = {
  },
}) {

  return (
    <React.Fragment>
      <StyledDiv style={{ margin: 15 }}>
        <Form onFinish={onFinish} form={form}>
            <Table
              expandable={expandable}
              rowClassName="editable-row"
              loading={loading}
              pagination={
                pagination
                  ? {
                      showSizeChanger: true, // Enable size changer
                      pageSizeOptions: ["5", "10", "20", "50", "100"], // Define options for page size
                      defaultPageSize: 5, // Set default page size
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
              scroll={{ ...scrollConfig }} // Merge with x: true for horizontal scrolling
            />
        </Form>
      </StyledDiv>
    </React.Fragment>
  );
}



export default FormTable;
