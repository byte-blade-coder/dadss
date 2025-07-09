import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import AntdTableIndex from "../table/AntdTableIndex.js";
import { decimalToDMS } from "../../helper/position.js";
import dayjs from "dayjs";
import PageHeaderIndex from "../pageheader/pageHeaderIndex.js";
import Forbidden from "../../../pages/403.jsx";
import lessthantencrew from "../../data/lessthantencrew.json";
import {fetchVisCrewData} from "../../redux/thunks/visData.js";

function Lessthan10Crew({apidata}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchVisCrew
  );
  const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const viewPermission = true; // Assuming permission is granted

  useEffect(() => {
    dispatch(fetchVisCrewData(searchData));
  }, [searchData]);

  const columnsapi = [
    {
      key: "reg_date",
      title: "Reg Date",
      dataIndex: "reg_date",
      sorttype: 'date',
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD");
        return dtg;
      },
    },
    {
      key: "reg_no",
      title: "Reg No",
      dataIndex: "reg_no",
      filtertype: 'search'
    },
    {
      key: "boat_name",
      title: "Boat Name",
      dataIndex: "boat_name",
      filtertype: 'search'
      //sorttype: 'none'
    },
    {
      key: "boat_length",
      title: "Boat Length",
      dataIndex: "boat_length",
    },
    {
      key: "boat_tonnage",
      title: "Boat Tonnage",
      dataIndex: "boat_tonnage",
    },
    {
      key: "boat_type",
      title: "Boat Type",
      dataIndex: "boat_type",
      filtertype: 'unique'
    },
    {
      key: "fish_harbour",
      title: "Fish Harbour",
      dataIndex: "fish_harbour",
      filtertype: 'unique',
    },
    {
      key: "crew",
      title: "Crew",
      dataIndex: "crew",
      //filterDropdown: () => renderFilterDropdown("crew", "Number"),
      //sorter: (a, b) => parseFloat(a.crew) - parseFloat(b.crew),
      filtertype: 'number',
      sorttype: 'number',
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
          title="Less than 10 Crew Data"
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
              data={lessthantencrew}
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

export default Lessthan10Crew;
