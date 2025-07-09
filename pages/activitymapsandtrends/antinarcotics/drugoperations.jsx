

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button, Col, InputNumber, Row } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

import "leaflet/dist/leaflet.css";
import Heading from "../../../src/components/title/Heading";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false, // Disable server-side rendering
  }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false,
  }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  {
    ssr: false,
  }
);

const Heatmap = ({ data }) => {
  const [dataSource, setDataSource] = useState(data);
  const [dateRange, setDateRange] = useState("");
  const [quantity, setQuantity] = useState({
    quantityMin: "",
    quantityMax: "",
  });
  const [showPopup, setShowPopup] = useState(null);
  const [netWorth, setNetWorth] = useState({
    netWorthMin: "",
    netWorthMax: "",
  });

  const handleApiChange = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_MSA_BACKEND_API
        }/narco?date_from=${dateFrom}&&date_to=${dateTo}&&qty_gte=${
          quantity.quantityMin ? quantity.quantityMin : ""
        }&&qty_lte=${
          quantity.quantityMax ? quantity.quantityMax : ""
        }&&value_gte=${
          netWorth.netWorthMin ? netWorth.netWorthMin : ""
        }&&value_lte=${netWorth.netWorthMax ? netWorth.netWorthMax : ""}`
      );
      if (response.status === 200) {
        setDataSource(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error) {
        showToastError(`Error : ${error}.`);
      }
    }
  };
  
  const dataWithColor = dataSource.map((item) => {
    let color;
    switch (item.item) {
      case "UNK":
        color = "blue";
        break;
      case "Hashish Crystal  Brown  crysta":
        color = "brown";
        break;
      case "BROWN CRYSTAL":
        color = "#7F3B21";
        break;
      case "NORCOTICS":
        color = "green";
        break;
      case "COCAIN WHITE CRYSTAL CRYSTAL":
        color = "#607cb6";
        break;
      case "Crystal Opium":
        color = " #b1ae39";
        break;
      case "COTTON ALCOHAL":
        color = "#ffffff";
        break;
      case "Hashish":
        color = "#030100";
        break;
      default:
        color = "red";
    }
    return {
      ...item,
      color: color,
    };
  });

  // const pins = useMemo(
  //   () =>
  //     dataWithColor.map((item, index) => (
  //       <Marker
  //         key={index}
  //         position={[item.latitude, item.longitude]}
  //         onClick={() => setShowPopup(item)}
  //       >
  //         <L.CircleMarker
  //           center={[item.latitude, item.longitude]}
  //           radius={8}
  //           color="black"
  //           weight={3}
  //           fillColor={item.color}
  //           fillOpacity={1}
  //         />
  //       </Marker>
  //     )),
  //   [dataSource]
  // );

  const pins = useMemo(
    () =>
      dataWithColor.map((item, index) => {
        // Add null-checks to ensure item is defined
        if (!item || typeof item !== "object") {
          return null;
        }

        // Add null-checks to ensure item properties are defined
        const latitude = item.latitude || 0;
        const longitude = item.longitude || 0;
        const color = item.color || "red";

        return (
          // <Marker
          //   key={index}
          //   position={[latitude, longitude]}
          //   onClick={() => setShowPopup(item)}
          // >
          <CircleMarker
            center={[latitude, longitude]}
            radius={8}
            color="black"
            weight={3}
            fillColor={color}
            fillOpacity={1}
            eventHandlers={{
              click: () => setShowPopup(item),
            }}
          />
          // </Marker>
        );
      }),
    [dataSource]
  );

  return (
    <div>
      {/* <div>
        <Link href="/">
          <BsArrowLeft size={30} />
          Back to
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
      {/* <Row className="p-4">
        <Col span={6}>
          <div className="flex items-center">
            <div className="flex space-between">
              <InputNumber
                onChange={(value) =>
                  setNetWorth({ ...netWorth, netWorthMin: value })
                }
                min={0}
                addonAfter={"<="}
              />
              <label className="px-2">Net Worth</label>
              <InputNumber
                min={0}
                addonBefore={"<="}
                onChange={(value) =>
                  setNetWorth({ ...netWorth, netWorthMax: value })
                }
              />
            </div>
          </div>
        </Col>
        <Col span={5} offset={1}>
          <div className="flex items-center">
            <div className="flex space-between">
              <InputNumber
                addonAfter={"<="}
                min={0}
                onChange={(value) =>
                  setQuantity({ ...quantity, quantityMin: value })
                }
              />
              <label className="px-2">Quantity</label>
              <InputNumber
                min={0}
                addonBefore={"<="}
                onChange={(value) =>
                  setQuantity({ ...quantity, quantityMax: value })
                }
              />
            </div>
          </div>
        </Col>
        <Col span={5} className="flex items-center" offset={1}>
          <div>
         
            <RangePicker
              onChange={(value) => setDateRange(value)}
              defaultValue={dateRange}
            />
          </div>
        </Col>
        <Col span={6} className="flex items-center justify-end">
          <div>
            <Button onClick={handleApiChange}>Submit</Button>
          </div>
        </Col>
      </Row> */}
      <Row className="flex flex-wrap">
        <Col xs={24} sm={12} md={12} lg={7} xl={7}>
          <div className="flex justify-start space-between items-center p-6">
            <div className="px-2">
              <div>
                <p className="font-bold">Net Worth</p>
              </div>
              <div className="flex items-center">
                <InputNumber
                  onChange={(value) =>
                    setNetWorth({ ...netWorth, netWorthMin: value })
                  }
                  min={0}
                  addonAfter="<="
                />
                <InputNumber
                  min={0}
                  addonBefore="<="
                  onChange={(value) =>
                    setNetWorth({ ...netWorth, netWorthMax: value })
                  }
                />
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={12} lg={7} xl={7}>
          <div className="flex justify-start space-between items-center p-6">
            <div className="px-2">
              <div>
                <p className="font-bold">Quantity</p>
              </div>
              <div className="flex items-center">
                <InputNumber
                  addonAfter="<="
                  min={0}
                  onChange={(value) =>
                    setQuantity({ ...quantity, quantityMin: value })
                  }
                />
                <InputNumber
                  min={0}
                  addonBefore="<="
                  onChange={(value) =>
                    setQuantity({ ...quantity, quantityMax: value })
                  }
                />
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={12} lg={7} xl={7}>
          <div className="flex justify-start space-between items-center p-6">
            <div className="px-2">
              <div>
                <p className="font-bold">Select a Date </p>
              </div>
              <RangePicker
                onChange={(value) => setDateRange(value)}
                defaultValue={dateRange}
                format="DD-MM-YYYY"
              />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={12} lg={3} xl={3}>
          <div className="flex justify-end items-center p-11">
            <div className="px-2">
              <Button onClick={handleApiChange}>Submit</Button>
            </div>
          </div>
        </Col>
      </Row>
      <Heading
        className="whitespace-nowrap font-normal"
        level={3}
        text=" Drugs Operation"
      />
      <div style={{ height: "70vh" }}>
        <MapContainer
          center={[23.756779, 63.300738]}
          zoom={6.4}
          maxZoom={9} // Set the maximum zoom level to 9
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
        url={`${process.env.NEXT_PUBLIC_SERVER_MAPS_ENDPOINT}/my-offline-tiles/WOtiles/{z}/{x}/{y}.png`}
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {pins}
          {showPopup && (
            <Popup
              position={[showPopup.latitude, showPopup.longitude]}
              onClose={() => setShowPopup(null)}
            >
              <div>
                <p>Drug: {showPopup.item}</p>
                <p>Quantity: {showPopup.quantity}</p>
                <p>Flag: {showPopup.flag}</p>
                <p>Value: {showPopup.value}</p>
                <p>Vessel Name: {showPopup.vessel_name}</p>
              </div>
            </Popup>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Heatmap;

// Import necessary modules and libraries

export async function getServerSideProps(context) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/narco?date_from=&&date_to=&&qty_gte=&&qty_lte=&&value_gte=&&value_lte=&&item=`
    );

    if (response.status === 200) {
      return {
        props: {
          data: response.data,
          title: `Contraband/Drug Confiscation`,
        },
      };
    } else {
      console.error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    console.log(error)
    if (error) {
      showToastError(`Error : ${error}.`);
    }
  }

  // Return a default value or an empty object in case of an error
  return {
    props: {
      data: [],
      title: `Contraband/Drug Confiscation`,
    },
  };
}
