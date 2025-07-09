import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import AntdTableIndex from "../table/AntdTableIndex.js";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import codendobserved from "../../data/codendobserved.json";
import { fetchStaticSpecialReportData } from "../../redux/thunks/patroltypeBasedData.js";

// function CodEndObserved({filteredDataSource,setFilteredDataSource})
function CodEndObserved({apidata}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchStaticSpecialReportData
  );
  const [searchData, setSearchData] = useState({ ssr_table: 'COD END OBSERVED' });
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = true; // Assuming permission is granted

  useEffect(() => {
    dispatch(fetchStaticSpecialReportData(searchData.ssr_table));
  }, [searchData]);

  const columnsapi = [
    {
      key: "ssr_dtg",
      title: "Date",
      dataIndex: "ssr_dtg",
      sorttype: 'date',
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD");
        return dtg;
      },
    },
    {
      key: "Base",
      title: "Base/Picket",
      dataIndex: "Base",
      filtertype: 'unique',
    },
    {
      title: "Reg No",
      key: "ssr_boat_regno",
      dataIndex: "ssr_boat_regno",
      filtertype: 'search',
    },
    {
      title: "Boat Name",
      key: "ssr_boat_name",
      dataIndex: "ssr_boat_name",
      filtertype: 'search',
    },
    {
      key: "owner_name",
      title: "Owner Name",
      dataIndex: "owner_name",
      filtertype: 'search',
    },
    {
      key: "ssr_cod_end_qty",
      title: "Qty of Code End",
      dataIndex: "ssr_cod_end_qty",
      filtertype: 'number',
      sorttype: 'number', 
    },
    {
      key: "Duration",
      title: "Duration",
      dataIndex: "Duration",
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
      key: "Base",
      title: "Base/Picket",
      dataIndex: "Base",
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
      key: "Owner Name",
      title: "Owner Name",
      dataIndex: "Owner Name",
    },
    {
      key: "Qty of Code End",
      title: "Qty of Code End",
      dataIndex: "Qty of Code End",
    },
    {
      key: "Duration",
      title: "Duration",
      dataIndex: "Duration",
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
          title="COD End Observed"
          //hover="Sitrep submitted by ship every 6-12 hours "
          showSearchBox={viewPermission}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      {viewPermission ? (
        <div>
          { apidata ? (
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
              data={codendobserved}
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

export default CodEndObserved;
