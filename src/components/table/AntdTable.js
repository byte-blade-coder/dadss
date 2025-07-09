// import { Col, Form, Row, Table } from "antd";
// import React from "react";
// import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
// import styled from "styled-components";
// import Heading from "../title/Heading";
// import FilledButton from "../button/FilledButton";
// import { IoIosAdd } from "react-icons/io";

// const StyledDiv = styled.div`
//   box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
//     rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
//   border-radius: 10px;
//   .custom-pagination-item {
//     margin: 0 8px;
//     font-size: 16px;
//     color: white;
//     cursor: pointer;
//   }
//   .ant-pagination-item {
//     border-radius: 20px;
//     padding: 0px 6px 0px 6px;
//     align-items: center;
//     display: block;
//   }
//   .ant-pagination .ant-table-pagination .ant-table-pagination-center {
//     display: block;
//   }
//   .custom-pagination-item:hover {
//     color: #1890ff;
//   }
//   .ant-pagination-prev {
//     background-color: midnightblue;
//     border-radius: 100%;
//     display: flex;
//     align-items: center;
//   }
//   .ant-pagination-next {
//     background-color: midnightblue;
//     border-radius: 100%;
//     display: flex;
//     align-items: center;
//   }
//   .ant-table-cell {
//     padding: 12px !important;
//     white-space: nowrap;
//     word-wrap: break-word !important;
//   }
//   .ant-table-content::-webkit-scrollbar {
//     height: 2px;
//     width: 2px;
//     /* width of the entire scrollbar */
//   }
//   .table-container {
//     pointer-events: auto; /* Ensure pointer-events are enabled */
//     user-select: auto; /* Allow user selection */
//   }
//   .ant-table-content::-webkit-scrollbar-track {
//     background: transparent;
//     /* color of the tracking area */
//   }
//   .ant-table-content::-webkit-scrollbar-thumb {
//     background-color: #9a9a9a;
//     // backgroundColor:transparent
//     /* color of the scroll thumb */
//     border-radius: 10px;
//     // border: 3px solid #686868;
//   }
//   .ant-checkbox + span {
//     color: white !important;
//   }
//   label.ant-checkbox-wrapper.ant-checkbox-wrapper-checked.ant-checkbox-group-item.css-dev-only-do-not-override-sk7ap8
//     span {
//     color: white !important;
//   }
//   // Antd Column header color
//   .ant-table-thead .ant-table-cell {
//     background-color: #063970 !important;
//     color: white;
//   }
// `;
// function AntdTable({
//   columns,
//   data,
//   loading,
//   onFinish,
//   form,
//   pagination = true,
//   expandable,
//   scrollConfig = {},
//   titletext,
//   btnTitle,
//   onBtnClick,
//   btndisabled,
//   showButton,
// }) {
//   // To fix last column to right i.e. action
//   // columns[columns.length-1] = {
//   //   ...columns[columns.length-1],
//   //   fixed: 'right',
//   // }

//   return (
//     <React.Fragment>
//       {titletext && (
//         <div className="mb-4">
//           <Row>
//             <Col span={12} className="flex justify-start mt-4">
//               <Heading
//                 className="whitespace-nowrap ml-5"
//                 level={4}
//                 text={titletext}
//               />
//             </Col>
//             <Col span={12} className="flex justify-end mt-4">
//               {showButton && (
//                 <>
//                   <FilledButton
//                     text={
//                       <>
//                         <IoIosAdd
//                           color="white"
//                           size={25}
//                           className="inline-flex font-bold items-center"
//                         ></IoIosAdd>
//                         {btnTitle}
//                       </>
//                     }
//                     className="rounded border-navyblue bg-navyblue text-white mr-4 custom-css-pageheaderButton"
//                     onClick={onBtnClick ? onBtnClick : null}
//                     disabled={btndisabled ? btndisabled : false}
//                   />{" "}
//                   <FilledButton
//                     text={
//                       <>
//                         <IoIosAdd
//                           color="white"
//                           size={25}
//                           className="inline-flex font-bold items-center"
//                         ></IoIosAdd>
//                         Add
//                       </>
//                     }
//                     className="rounded border-navyblue bg-navyblue text-white mr-4 custom-css-pageheaderButtonMedia"
//                     onClick={onBtnClick ? onBtnClick : null}
//                     disabled={btndisabled ? btndisabled : false}
//                   />
//                 </>
//               )}
//             </Col>
//           </Row>
//         </div>
//       )}
//       <StyledDiv style={{ margin: 15 }}>
//         <Form onFinish={onFinish} form={form}>
//           <Table
//             expandable={expandable}
//             rowClassName="editable-row"
//             loading={loading}
//             locale={{ emptyText: "No data available in table" }}
//             pagination={
//               pagination
//                 ? {
//                     showSizeChanger: true, // Enable size changer
//                     pageSizeOptions: ["5", "10", "20", "50", "100"], // Define options for page size
//                     defaultPageSize: 5, // Set default page size
//                     position: ["bottomCenter"],
//                     itemRender: (page, type, originalElement) => {
//                       switch (type) {
//                         case "prev":
//                           return (
//                             <div className="custom-pagination-item ">
//                               <BsChevronLeft />
//                             </div>
//                           );
//                         case "next":
//                           return (
//                             <div className="custom-pagination-item ">
//                               <BsChevronRight />
//                             </div>
//                           );
//                         default:
//                           return (
//                             <div className="custom-pagination-item">
//                               {originalElement}
//                             </div>
//                           );
//                       }
//                     },
//                   }
//                 : false
//             }
//             columns={columns}
//             dataSource={data}
//             scroll={{ x: true }} // Merge with x: true for horizontal scrolling
//           />
//         </Form>
//       </StyledDiv>
//     </React.Fragment>
//   );
// }

// export default AntdTable;
//29/04/2024
import { Col, Form, Row, Table } from "antd";
import React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import styled from "styled-components";
import Heading from "../title/Heading";
import FilledButton from "../button/FilledButton";
import { IoIosAdd } from "react-icons/io";

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
    height: 8px;
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
function AntdTable({
  columns,
  data,
  loading,
  onFinish,
  form,
  pagination = true,
  expandable,
  scrollConfig = {},
  titletext,
  btnTitle,
  onBtnClick,
  btndisabled,
  showButton,
}) {
  // To fix last column to right i.e. action
  // columns[columns.length-1] = {
  //   ...columns[columns.length-1],
  //   fixed: 'right',
  // }
  
  return (
    <React.Fragment>
      <StyledDiv style={{ margin: 15 }}>
        {titletext && (<div className="mb-2">
          <Row >
            <Col span={12} className="flex justify-start mt-4">
              <Heading
                className="whitespace-nowrap ml-5"
                level={4}
                text={titletext}
              />
            </Col>
            <Col span={12} className="flex justify-end mt-4">
              {showButton && (
                <>
                  <FilledButton
                    text={<><IoIosAdd color="white" size={25} className="inline-flex font-bold items-center"></IoIosAdd>{btnTitle}</>}
                    className="rounded border-lightgreen bg-lightgreen text-white mr-4 custom-css-pageheaderButton"
                    onClick={onBtnClick ? onBtnClick : null}
                    disabled={btndisabled ? btndisabled : false}
                  />{" "}
                  <FilledButton
                    text={<><IoIosAdd color="white" size={25} className="inline-flex font-bold items-center"></IoIosAdd>Add</>}
                    className="rounded border-lightgreen bg-lightgreen text-white mr-4 custom-css-pageheaderButtonMedia"
                    onClick={onBtnClick ? onBtnClick : null}
                    disabled={btndisabled ? btndisabled : false}
                  />
                </>
              )}
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
            scroll={{ x: true }} // Merge with x: true for horizontal scrolling
          />
        </Form>
      </StyledDiv>
    </React.Fragment>
  );
}

export default AntdTable;
