import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "antd/lib/tooltip/index.js";
import dayjs from "dayjs";
import Link from "next/link.js";
import PageHeaderIndex from "../../src/components/pageheader/pageHeaderIndex.js";
// import Forbidden from "../../../pages/403.jsx";

function Visual({loading,setFilteredDataSource,componentRef}) 
{
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.fetchPatroltypeBasedData
  );

  return (
    <>
        <div>
            hey
        </div>
    {/* {viewPermission ? (
      
    ) : (
      <Forbidden></Forbidden>
    )} */}
  </>
  );
}

export default Visual;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Visuals Data",
      },
    },
  };
}