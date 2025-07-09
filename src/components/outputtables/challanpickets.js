import React, { useState,useRef } from "react";
import AntdTableIndex from "../table/AntdTableIndex.js";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import challanpicketdata from "../../data/challanpicketdata.json";

// function ChallanPicket({filteredDataSource,setFilteredDataSource})
function ChallanPicket() {
  //const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = true; // Assuming permission is granted
  
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
      title: "Base/Picket",
      dataIndex: "Base",
      filtertype: 'unique',
    },
    {
      key: "Reg NO",
      title: "Reg No",
      dataIndex: "Reg NO",
      filtertype: 'search',
    },
    {
      key: "Boat Name",
      title: "Boat Name",
      dataIndex: "Boat Name",
      filtertype: 'search',
      //sorttype: 'none'
    },
    {
      key: "No of SFD Staff",
      title: "No of SFD Staff",
      dataIndex: "No of SFD Staff",
      filtertype: 'number',
      sorttype: 'number', 
    },
    {
      key: "Duration",
      title: "Duration",
      dataIndex: "Duration",
      // filtertype: 'search',
    },
    {
      key: "From",
      title: "From",
      dataIndex: "From",
      filtertype: 'search',
    },
    {
      key: "To",
      title: "To",
      dataIndex: "To",
      filtertype: 'search',
    },
    {
      key: "CEnd",
      title: "C/End",
      dataIndex: "CEnd",
      filtertype: 'search',
    },
    // {
    //   key: "Challan Amount",
    //   title: "Challan Amount",
    //   dataIndex: "Challan Amount",
    // },
    {
      key: "No of Challan Issued",
      title: "No of Challan Issued",
      dataIndex: "No of Challan Issued",
      filtertype: 'number',
      sorttype: 'number', 
    },
    {
      key: "Fine",
      title: "Fine (Rs)",
      dataIndex: "Fine",
      filtertype: 'number',
      sorttype: 'number', 
    },
    {
      key: "Reason",
      title: "Reason",
      dataIndex: "Reason",
      // filtertype: 'search',
    },
    {
      key: "Location",
      title: "Location",
      dataIndex: "Location",
      filtertype: 'unique',
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
          title="Challan Pickets"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      {viewPermission ? (
        <div>
          <AntdTableIndex
            columns={columns}
            data={challanpicketdata}
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

export default ChallanPicket;
