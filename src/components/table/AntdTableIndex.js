import { Button, Checkbox, Dropdown, Form, Menu, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import styled from "styled-components";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { extractUniqueValues } from "../../helper/filters";
import { AiFillFilter } from "react-icons/ai";
import NumberFilter from "../../helper/numberFilter";
import SearchFilter from "../../helper/SearchFilter";
import { SearchOutlined, CloseOutlined, InfoCircleOutlined,SettingOutlined } from "@ant-design/icons";
import { FaSearch } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
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
    // border-radius: 100%;
    display: flex;
    align-items: center;
  }
  .ant-pagination-next {
    background-color: midnightblue;
    // border-radius: 100%;
    display: flex;
    align-items: center;
  }
  .ant-table-cell {
    padding: 12px !important;
    white-space: nowrap;
    word-wrap: break-word !important;
  }

  .ant-table-content::-webkit-scrollbar {
    height: 6px;
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
    //border: 3px solid #686868;
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
    color: white;
  }
  // Antd Sorter color
  .ant-table-column-sorter {
    color: white;
  }
`;

const StyledCheckbox = styled.div`
  // .ant-checkbox .ant-checkbox-inner {
  //   width: 25px;
  //   height: 25px;
  //   background-color: red;
  //   border-color: red;
  // }

  // .ant-checkbox-disabled .ant-checkbox-inner {
  //   width: 25px;
  //   height: 25px;
  //   background-color: gray;
  //   border-color: gray;
  // }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #549e97;
    border-color: black;
  }
`;

function AntdTableIndex({
  columns,
  data,
  loading,
  onFinish,
  form,
  pagination = true,
  expandable,
  setFilteredDataSource,
  componentRef,
}) {
  const [dragColumns, setDragColumns] = useState(columns);
  const defaultCheckedList = columns.map((item) => item.title);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (checkedValues) => {
    //function to handle checkboxes dropdown in the last/action column to set visiblity of columns
    setCheckedList(checkedValues);
    const newColumns = dragColumns.map((column) => {
      return {
        ...column,
        hidden:
          column.checkbox === false
            ? false
            : !checkedValues.includes(column.title.props?.children[0]),
      };
    });
    setDragColumns(newColumns);
  };

  const options = columns
    .filter((column) => !(column.checkbox === false)) // Exclude the "action" column
    .map(({ title }) => ({
      label: title,
      value: title,
    }));

  const selectSorter = (item, a, b) => {
    if (item.sorttype === "date")
      return new Date(a[item.dataIndex]) - new Date(b[item.dataIndex]);
    if (item.sorttype === "number")
      return a[item.dataIndex] - b[item.dataIndex];

    if (a[item.dataIndex] === null && b[item.dataIndex] === null) {
      return 0;
    } else if (a[item.dataIndex] === null) {
      return 1; // Place null values at the end
    } else if (b[item.dataIndex] === null) {
      return -1; // Place null values at the end
    }
    // return a[item.dataIndex].localeCompare(b[item.dataIndex]);
      return String(a[item.dataIndex]).localeCompare(String(b[item.dataIndex]));
  };

  useEffect(() => {
    //column configuration
    const newColumns = columns.map((item) => {
      if (item.checkbox === false)
        return {
          ...item,
          width: item.width ? item.width : 100,
        };
      return {
        ...item,
        title: (
          <>
            {item.title}
            <Tooltip title={item.description ? item.description : item.title}>
              <InfoCircleOutlined
                style={{
                  verticalAlign: "baseline",
                  marginLeft: 5,
                  color: "#F9F9FA",
                }}
              />
            </Tooltip>
          </>
        ),
        key: item.dataIndex,
        ellipsis: item.ellipsis ? item.ellipsis : item.title,
        width: item.width ? item.width : 250,
        filterIcon: (filtered) => {
          return item.filtertype === "search" ? (
            <FaSearch color={filtered ? "blue" : "white"} size={15} />
          ) : (
            <AiFillFilter color={filtered ? "blue" : "white"} size={15} />
          );
        },
        filters:
          item.filtertype === "unique"
            ? extractUniqueValues(data, item.dataIndex)
            : item.filters,
        filterSearch: item.filtertype === "unique" ? true : item.filterSearch,
        filterDropdown:
          item.filtertype === "number"
            ? (props) => <NumberFilter props={props}></NumberFilter>
            : item.filtertype === "search"
            ? (props) => <SearchFilter props={props}></SearchFilter>
            : null,
        sortDirections: ["descend", "ascend"],
        sorter:
          item.sorter === null
            ? null
            : item.sorter
            ? item.sorter
            : (a, b) => selectSorter(item, a, b),
        onFilter: item.onFilter
          ? item.onFilter
          : (value, record) => {
              if (value === null) {
                return record[item.dataIndex] === null;
              }
              if (value[0] === "$") {
                const val_list = value.split("_");
                if (val_list[0].slice(1) === "eq")
                  return (
                    parseFloat(record[item.dataIndex]) ===
                    parseFloat(value.slice(4))
                  );
                if (val_list[0].slice(1) === "gt")
                  return (
                    parseFloat(record[item.dataIndex]) >
                    parseFloat(value.slice(4))
                  );
                if (val_list[0].slice(1) === "lt")
                  return (
                    parseFloat(record[item.dataIndex]) <
                    parseFloat(value.slice(4))
                  );
                if (val_list[0].slice(1) === "btw") {
                  const min = parseFloat(val_list[1]);
                  const max = parseFloat(val_list[2]);
                  return (
                    parseFloat(record[item.dataIndex]) >= min &&
                    parseFloat(record[item.dataIndex]) <= max
                  );
                }
                return false;
              }
              return item.filtertype === "search" && record[item.dataIndex]
                ? record[item.dataIndex]
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : record[item.dataIndex] === value;
            },
      };
    });
    setDragColumns(newColumns);
  }, [columns]);

  const getLabelledData = (source) => {
    const labelledData = source.map((item) => {
      var y = {};
      columns.forEach(({ dataIndex, title, checkbox }) => {
        if (checkbox !== false) {
          if (title === "Latitude")
            { 
              if(item[dataIndex]?.coordinates)
                {
                  y[title] = parseFloat(item[dataIndex].coordinates[1]).toFixed(4);
                }
              else
              {
                y[title] = item[dataIndex]
              }
              
            }
          else if (title === "Longitude")
          { 
            if(item[dataIndex]?.coordinates)
              {
                y[title] = parseFloat(item[dataIndex].coordinates[0]).toFixed(4);
              }
            else
            {
              y[title] = item[dataIndex]
            }
            
          }
          else y[title] = item[dataIndex];
        }
      });
      return y;
    });
    return labelledData;
  };

  useEffect(() => {
    if (data && setFilteredDataSource) {
      setFilteredDataSource(getLabelledData(data));
    }
  }, [data]);

  const cancelDropdownCheckBox = () => {
    setOpen(!open);
  }

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const newColumns = [...dragColumns];
      const item = newColumns.splice(fromIndex, 1)[0];
      newColumns.splice(toIndex, 0, item);
      setDragColumns(newColumns);
    },
    nodeSelector: "th",
  };
  const menus =
    options.length > 0 ? (
      <Menu>
        <Tooltip title="Cancel">
            <Button className="bg-darkgray text-white float-right text-[8px] w-5 h-5 rounded-[8px] flex items-center justify-center"  icon={<CloseOutlined/>}  onClick={cancelDropdownCheckBox} />
        </Tooltip>
        {/* <div className="flex mt-1 mr-3 float-end dd-cancel-btn" onClick={cancelDropdownCheckBox}>x</div> */}
        {options.map((option) => (
          // console.log("trying to figure this out", option, checkedList),
          <Menu.Item key={option.value} style={{ display: "block"}}>
            <StyledCheckbox>
              <Checkbox
                value={option.value}
                checked={checkedList.includes(option.value)}
                onChange={(e) =>
                  handleCheckboxChange(
                    e.target.checked
                      ? [...checkedList, option.value]
                      : checkedList.filter((item) => item !== option.value)
                  )
                }
              >
                {option.label}
              </Checkbox>
            </StyledCheckbox>
          </Menu.Item>
        ))}
      </Menu>
    ) : (
      <div className="custom-drop-down-no-option">No Option</div>
    );

  const newColumns = dragColumns.map((column, index) => ({
    ...column, // Change here style={{maxWidth: "10px"}}
    title:
      index === dragColumns.length - 1 ? (
        <div className="" >
          {column.title}
          <Dropdown
            overlay={menus}
            // menu={menus}
            open={open}
            trigger={["click"]}
            className="flex justify-end items-end"
            style={{maxWidth: "3rem"}}
          >
            <Button
              onClick={() => setOpen(!open)}
              className="rounded border-navyblue bg-navyblue text-white inline-flex ml-2 items-center justify-end"
             >
              <HiDotsVertical color="white" size={16} />
              {/* Settings */}
            </Button>
          </Dropdown>
        </div>
      ) : (
        column.title
      ),
  }));

  return (
    <div ref={componentRef}>
      <React.Fragment>
        <StyledDiv style={{ margin: 15 }}>
          {/* <div className="flex justify-end mb-1">
            <Dropdown
              overlay={menus}
              open={open}
              trigger={["click"]} // Use the custom component as overlay
            >
              <Button
                onClick={() => setOpen(!open)}
                className="rounded border-navyblue bg-navyblue text-white ml-2 inline-flex items-center"
              >
                <SettingOutlined color="white" size={25} />
              </Button>
            </Dropdown>
          </div>
       */}
          <Form onFinish={onFinish} form={form}>
            <ReactDragListView.DragColumn {...dragProps}>
              <Table
                expandable={expandable}
                rowClassName="editable-row"
                loading={loading}
                pagination={
                  pagination
                    ? {
                        // showSizeChanger: true, // Enable size changer
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
                showSorterTooltip={false}
                // columns={dragColumns.filter((column) => !column.hidden)}
                columns={newColumns.filter((column) => !column.hidden)}
                dataSource={data}
                onChange={(pagination, filters, sorter, extra) => {
                  if (setFilteredDataSource) {
                    setFilteredDataSource(
                      getLabelledData(extra.currentDataSource)
                    );
                  }
                }}
                scroll={{ x: true }}
              />
            </ReactDragListView.DragColumn>
          </Form>
          {/* <Table columns={newColumns} dataSource={data} pagination={false} /> */}
        </StyledDiv>
      </React.Fragment>
    </div>
  );
}

export default AntdTableIndex;
