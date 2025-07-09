import React, { useState,useRef } from "react";
import AntdTableIndex from "../table/AntdTableIndex.js";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import mobilepicketdata from "../../data/mobilepicketdata.json";

// function MobilePicketData({filteredDataSource,setFilteredDataSource})
function MobilePicketData() {
  //const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = true; // Assuming permission is granted
  console.log("filteredDataSource", filteredDataSource, "\nsetFilteredDataSource", setFilteredDataSource)
  const columns = [
    {
      key: "Date",
      title: "Date",
      dataIndex: "Date",
      // sorttype: 'date', 
      filtertype: 'search',
    },
    {
      key: "Base",
      title: "Base",
      dataIndex: "Base",
      filtertype: 'unique',
    },
    {
      key: "Position/Creek",
      title: "Position/Creek",
      dataIndex: "Position/Creek",
      filtertype: 'search',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];


  return (
    <>
        <PageHeaderIndex
          title="Mobile Pickets Data"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      {viewPermission ? (
        <div>
          <AntdTableIndex
            columns={columns}
            data={mobilepicketdata}
            loading={false}
            setFilteredDataSource={setFilteredDataSource}
            componentRef={componentRef}
          />
        </div>
      ) : (
        <Forbidden></Forbidden>
      )}
    </>
  );
}

export default MobilePicketData;
