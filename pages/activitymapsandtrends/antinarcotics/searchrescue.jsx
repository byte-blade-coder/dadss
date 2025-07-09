import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import Heading from "../../../src/components/title/Heading";
import { Checkbox, Col, Row, Select, Switch } from "antd";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
const NarcoticsChart = dynamic(
  () => import("../../../src/components/heatmap/NarcoticsChart"),
  // () => import("../../../src/components/LeafletMap/map"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function SearchRescue() {
  const handleChange = (value) => {};
  return (
    <>
      {/* <div>
        <Link href="/">
          <BsArrowLeft size={30} />
          back to
          <span
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#0659ED",
              paddingLeft: 5,
            }}
          >
            Dashboard
          </span>
        </Link>
      </div> */}
      <Visualpageheader/>

      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="col-start-5 row-start-1">
          {" "}
          <div className="px-2">
            <div>
              <p className="font-bold">Vessel</p>
            </div>
            <Select
              defaultValue="Small"
              style={{
                width: 150,
              }}
              onChange={handleChange}
              options={[
                {
                  value: "View all",
                  label: "View all",
                },
                {
                  value: "Small",
                  label: "Small",
                },
                {
                  value: "Medium",
                  label: "Medium",
                },
                {
                  value: "Large",
                  label: "Large",
                },
              ]}
            />
          </div>
        </div>
        <div className="col-start-6 row-start-1">
          {" "}
          <div className="px-2">
            <div>
              <p className="font-bold">Inspection</p>
            </div>
            <Select
              defaultValue="Locations"
              style={{
                width: 150,
              }}
              onChange={handleChange}
              options={[
                {
                  value: "by Type",
                  label: "by Type",
                },
                {
                  value: "Heat Map",
                  label: "Heat Map",
                },
                {
                  value: "Locations",
                  label: "Locations",
                },
                {
                  value: "by Value",
                  label: "by Value",
                },
              ]}
            />
          </div>
        </div>
        <div className="col-start-4 row-start-1">
          {" "}
          <div className="px-2">
            <div>
              <p className="font-bold">Filter</p>
            </div>
            <Select
              defaultValue="Query"
              style={{
                width: 150,
              }}
              onChange={handleChange}
              options={[
                {
                  value: "Query",
                  label: "Query",
                },
                {
                  value: "Boarding",
                  label: "Boarding",
                },
              ]}
            />
          </div>
        </div>
      </div>
      {/* <div className="flex justify-end items-center px-4 py-3">
        <div className="px-2">
          <label className="px-2">Vessel type:</label>
          <Select
            defaultValue="Small"
            style={{
              width: 150,
            }}
            onChange={handleChange}
            options={[
              {
                value: "View all",
                label: "View all",
              },
              {
                value: "Small",
                label: "Small",
              },
              {
                value: "Medium",
                label: "Medium",
              },
              {
                value: "Large",
                label: "Large",
              },
            ]}
          />
        </div>
        <div className="px-2">
          <label className="px-2">Inspection type:</label>
          <Select
            defaultValue="Query"
            style={{
              width: 150,
            }}
            onChange={handleChange}
            options={[
              {
                value: "Query",
                label: "Query",
              },
              {
                value: "Boarding",
                label: "Boarding",
              },
            ]}
          />
        </div>
        <div className="px-2">
          <label className="px-2">Filter</label>
          <Select
            defaultValue="Locations"
            style={{
              width: 150,
            }}
            onChange={handleChange}
            options={[
              {
                value: "by Type",
                label: "by Type",
              },
              {
                value: "Heat Map",
                label: "Heat Map",
              },
              {
                value: "Locations",
                label: "Locations",
              },
              {
                value: "by Value",
                label: "by Value",
              },
            ]}
          />
        </div>
      </div> */}
      <Heading
        className="whitespace-nowrap font-normal"
        level={3}
        text="Search and Rescue Operations"
      />
      <div>
        <NarcoticsChart />
      </div>
    </>
  );
}

export default SearchRescue;
