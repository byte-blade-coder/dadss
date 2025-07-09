import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import AntdTableIndex from "../table/AntdTableIndex.js";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import challanwarningdata from "../../data/challanwarningdata.json";
import {fetchChallanWarningData} from "../../redux/thunks/visData.js";

function ChallanWarning({apidata}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchChallans
  );
  const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = true; // Assuming permission is granted
  console.log("filteredDataSource", filteredDataSource, "\nsetFilteredDataSource", setFilteredDataSource)
  
  console.log("Challan Warning data", data, apidata);

  useEffect(() => {
    dispatch(fetchChallanWarningData(searchData));
  }, [searchData]);

  const columnsapi = [
    {
      key: "dtg",
      title: "Date",
      dataIndex: "dtg",
      sorttype: 'date',
      // render: (text) => {
      //   if (!text) return "---";
      //   const dtg = dayjs(text).format("YYYY-MM-DD");
      //   return dtg;
      // },
    },
    {
      key: "reg_no",
      title: "Reg No",
      dataIndex: "reg_no",
      filtertype: 'search',
    },
    {
      key: "boat_name",
      title: "Boat Name",
      dataIndex: "boat_name",
      filtertype: 'search',
    },
    {
      key: "offence",
      title: "Offence",
      dataIndex: "offence",
      filtertype: 'search',
    },
    {
      key: "qty",
      title: "Quantity/Days",
      dataIndex: "qty",
      filtertype: 'search',
    },
    {
      key: "Challan Amount",
      title: "Challan Amount",
      dataIndex: "Challan Amount",
      filtertype: 'search',
    },
    {
      key: "Issued By",
      title: "Issued By",
      dataIndex: "Issued By",
      filtertype: 'unique',
    },
    {
      key: "decision",
      title: "Warning",
      dataIndex: "decision",
      filtertype: 'search',
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    }
  ];

  const columns = [
    {
      key: "Date",
      title: "Date",
      dataIndex: "Date",
    },
    {
      key: "Reg NO",
      title: "Reg No",
      dataIndex: "Reg NO",
    },
    {
      key: "Boat Name",
      title: "Boat Name",
      dataIndex: "Boat Name",
      //sorttype: 'none'
    },
    {
      key: "Offence",
      title: "Offence",
      dataIndex: "Offence",
    },
    {
      key: "Quantity/Days",
      title: "Quantity/Days",
      dataIndex: "Quantity/Days",
    },
    {
      key: "Challan Amount",
      title: "Challan Amount",
      dataIndex: "Challan Amount",
    },
    {
      key: "Issued By",
      title: "Issued By",
      dataIndex: "Issued By",
    },
    {
      key: "Warning",
      title: "Warning",
      dataIndex: "Warning",
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
          title="Challan Warning Data"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      {viewPermission ? (
        <div>
          {apidata ? (
            <AntdTableIndex
              columns={columnsapi}
              data={data}
              loading={isLoading}
              setFilteredDataSource={setFilteredDataSource}
              componentRef={componentRef}
            />
          ) : (
            <AntdTableIndex
              columns={columns}
              data={challanwarningdata}
              loading={false}
              setFilteredDataSource={setFilteredDataSource}
              componentRef={componentRef}
            />
          )}
        </div>
      ) : (
        <Forbidden></Forbidden>
      )}
    </>
  );
}

export default ChallanWarning;
