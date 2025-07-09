import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { fetchRegisteredMerchantVessel } from "../../src/redux/thunks/registerMerchantVesselDatas";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Link from "next/link";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled";
import AntdTableIndex from "../../src/components/table/AntdTableIndex";
import { hasPermission } from "../../src/helper/permission";
import { MdViewList } from "react-icons/md";
import { Tooltip } from "antd";


function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchRegisteredMerchantVesselData
  );
  const [searchData, setSearchData] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = true;
  const viewPermission = true;

  const handleDetails = (id, payload) => {
    router.push({
      pathname: `merchantVesselDetails/${id}`,
      query: { vessel: JSON.stringify(payload) },
    });
  };

  // Effect hook to dispatch the fetchRegisteredMerchantVessel action when searchData changes
  useEffect(() => {
    dispatch(fetchRegisteredMerchantVessel(searchData));
  }, [searchData]);

  const columns = [
    {
      title: "MMSI",
      key: "mv_mmsi",
      dataIndex: "mv_mmsi",
      sorttype: 'number',
      filtertype: 'number',
    },
    {
      title: "IMO",
      key: "mv_imo",
      dataIndex: "mv_imo",
      sorttype: 'number',
      filtertype: 'number',
    },
    {
      title: "Ship ID",
      dataIndex: "mv_ship_id",
      key: "mv_ship_id",
      sorttype: 'number',
      filtertype: 'number',
    },
    {
      title: "Ship Name",
      key: "mv_ship_name",
      dataIndex: "mv_ship_name",
      filtertype: 'search',
    },
    {
      title: "Flag",
      dataIndex: "mv_flag",
      key: "mv_flag",
      filtertype: 'unique',
    },
    {
      title: "Type",
      dataIndex: "mv_type_name",
      key: "mv_type_name",
      filtertype: 'unique',
    },
    {
      title: "AIS Type",
      key: "mv_ais_type_summary",
      dataIndex: "mv_ais_type_summary",
      filtertype: 'unique',
    },
    {
      title: "View",
      dataIndex: "action",
      key: "action",
      checkbox: false,
      render: (text, record) => (
        <Tooltip placement="topLeft" title={text}>
          <a
            className="text-midnight font-semibold"
            onClick={() => handleDetails(record?.mv_key, record)}
          >
            <MdViewList size={20}/>
          </a>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <div>
        <PageHeaderStyled
          title="Merchant Vessel Details"
          placeholder="Search by IMO"
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

export default Index;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Registered Merchant Vessel Data",
      },
    },
  };
}
