import { Checkbox, Form, Table } from "antd";
import React, { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import styled from "styled-components";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView

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
  .table-container {
    pointer-events: auto; /* Ensure pointer-events are enabled */
    user-select: auto; /* Allow user selection */
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

  .ant-checkbox + span {
    color: white !important;
  }
  label.ant-checkbox-wrapper.ant-checkbox-wrapper-checked.ant-checkbox-group-item.css-dev-only-do-not-override-sk7ap8
    span {
    color: white !important;
  }
  .ant-table-thead .ant-table-cell {
    background-color: #063970 !important;
    color: white
    }
    .ant-table-column-sorter {
      color: white;
    }
`;
function AntdTableIndexStyled({
  columns,
  data,
  loading,
  onFinish,
  form,
  pagination = true,
  expandable,
  setCurrentData,
  scrollConfig = {},
  dragColumns,
}) {
  // const [dragColumns, setDragColumns] = useState(columns);
  // const defaultCheckedList = columns
  //   .filter((column) => column.key !== "action") // Exclude "action" column
  //   .map((item) => item.key);
  // const [checkedList, setCheckedList] = useState(defaultCheckedList);

  // const handleCheckboxChange = (checkedValues) => {
  //   setCheckedList(checkedValues);
  //   const newColumns = dragColumns.map((column) => ({
  //     ...column,
  //     // hidden: !checkedValues.includes(column.key),
  //     hidden: column.key !== "action" && !checkedValues.includes(column.key),
  //   }));
  //   setDragColumns(newColumns);
  // };

  // const options = columns.map(({ key, title }) => ({
  //   label: title,
  //   value: key,
  // }));

  // useEffect(() => {
  //   setCurrentData(columns);
  // }, [columns]);

  // const dragProps = {
  //   onDragEnd(fromIndex, toIndex) {
  //     const newColumns = [...dragColumns];
  //     const item = newColumns.splice(fromIndex, 1)[0];
  //     newColumns.splice(toIndex, 0, item);
  //     setDragColumns(newColumns);
  //   },
  //   nodeSelector: "th",
  // };
  return (
    <React.Fragment>
      {/* <div className="flex  justify-start  mt-5 ml-5 mr-5">
        <Checkbox.Group
          className="flex flex-wrap"
          value={checkedList}
          options={options}
          onChange={handleCheckboxChange}
        />
      </div> */}
      <StyledDiv style={{ margin: 15 }}>
        <Form onFinish={onFinish} form={form}>
          {/* <ReactDragListView.DragColumn {...dragProps}> */}
          <Table 
            expandable={expandable}
            rowClassName="editable-row"
            loading={loading}
            // onChange={(pagination, filters, sorter, extra) => {
            //   setCurrentData(extra.currentDataSource);
            // }}
            // onChange={(pagination, filters, sorter, extra) => {
            //   if (setCurrentData) {
            //     setCurrentData(extra.currentDataSource);
            //   }
            // }}
            pagination={
              pagination
                ? {
                  showSizeChanger: true, // Enable size changer
                  pageSizeOptions: ["5", "10", "20", "50", "100"], // Define options for page size
                  defaultPageSize: 7, // Set default page size
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
            // columns={dragColumns.filter((column) => !column.hidden)}
            columns={dragColumns ? dragColumns.filter((column) => !column.hidden) : columns}
            dataSource={data}
            scroll={{ ...scrollConfig }} // Merge with x: true for horizontal scrolling
          />
          {/* </ReactDragListView.DragColumn> */}
        </Form>
      </StyledDiv>

      {/* <div
        className="fixed-checkbox flex  justify-center "
        style={{
          backgroundColor: "#F5F5F5",
          padding: "20px",
          width: "100%",
          position: "sticky",
          bottom: "0px",
        }}
      >
        <Checkbox.Group
          className="flex flex-wrap ant-checkbox-wrapper-checked.ant-checkbox-wrapper-disabled .label-text"
          // style={{ color: "white !important" }}
          value={checkedList}
          // options={options}
          // options={options.filter((option) => option.value !== "action")}
          options={columns
            .filter((column) => column.key !== "action") // Exclude "action" column
            .map(({ key, title }) => ({
              label: title,
              value: key,
            }))}
          onChange={handleCheckboxChange}
        />
      </div> */}
    </React.Fragment>
  );
}

export default AntdTableIndexStyled;
