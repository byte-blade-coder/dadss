// TableItemRenderer.js
import React from "react";
import Heading from "../title/Heading";
import AntdTable from "./AntdTable";

const TableItemRenderer = ({ title, columns, data, pagination }) => (
  <div className="mb-10 ">
    <div>
      <Heading className="ml-5 " level={5} text={title} />
    </div>
    <div>
      <AntdTable
        columns={columns}
        data={data}
        pagination={pagination}
        scrollConfig={{ x: true }}
      />
    </div>
  </div>
);

export default TableItemRenderer;
