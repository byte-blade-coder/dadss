import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisReport } from "../../src/redux/thunks/visData";
import dayjs from "dayjs";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";

function VisFormTable() {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state) => state.fetchVisData);
  const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const viewPermission = true;
  const componentRef = useRef();

  // Effect hook to fetch VIS report data when searchData changes
  useEffect(() => {
    dispatch(fetchVisReport(searchData));
  }, [searchData]);

  const columns = [
    {
      title: "Boat ID ",
      key: "boat_id",
      dataIndex: "boat_id",
      sorttype: 'number',
      filtertype: 'number',
    },
    {
      title: "Nakwa Name",
      key: "nakwa_name",
      dataIndex: "nakwa_name",
      filtertype: 'search',
    },
    {
      title: "Crew",
      key: "crew",
      dataIndex: "crew",
      sorttype: 'number',
      filtertype: 'number',
    },
    {
      title: "Departure Date",
      dataIndex: "dep_date",
      key: "dep_date",
      sorttype: "date",
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "Arrival Date",
      dataIndex: "arrival_date",
      key: "arrival_date",
      sorttype: "date",
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "PC Date",
      key: "pc_date",
      sorttype: "date",
      dataIndex: "pc_date",
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD");
        return dtg;
      },
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      checkbox: false,
    },
  ];

  return (
    <>
      <div>
        <PageHeaderStyled
          title="Vessel Information System"
          placeholder="Search by Boat ID or Nakwa Name"
          hover="Vessel registered with PMSA is required to submit report "
          onSearchChange={setSearchData}
          showSearchBox={viewPermission}
          showButton={false}
          currentData={viewPermission ? filteredDataSource : null}
          componentRef={viewPermission ? componentRef : null}
        />
      </div>
      {viewPermission ? (
        <div>
          <AntdTableIndex
            columns={columns}
            data={data}
            loading={isLoading}
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

export default VisFormTable;
