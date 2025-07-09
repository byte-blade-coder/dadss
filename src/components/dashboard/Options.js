import { Col, Row, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import Cookies from "js-cookie";

function getItem(imgSrc, to, key) {
  // const keyToTitle = {
  //   1: "Fishing  Activity Trends",
  //   2: "Fishing  Heat Map",
  //   3: "Fishing  Harbour",
  //   4: "Fishing  Over Stay",
  //   5: "Fishing  Duration at Sea",
  //   6: "Merchant  Visiting Pakistan",
  //   7: "Merchant  Activity Trends",
  //   8: "Merchant  Heat Map",
  //   9: "Merchant  Harbour",
  //   10: "Merchant  Over Stay",
  //   11: "Merchant  Duration at Sea",
  //   12: "General Report",
  //   13: "Special Report (Merchant Vessel)",
  //   14: "Sepecial Report (Fishing Vessel)",

  //   // Add more mappings here as needed
  // };
  const keyToTitle = {
    1: "Fishing",
    2: "Merchant",
    3: "Own Platform",
    4: "Contact of Interest",
    5: "Defender",

    // Add more mappings here as needed
  };
  // Determine the title based on the key
  const title = keyToTitle[key] || "";
  // You can add your logic here to set the title and key based on imgSrc or 'to' value

  if (
    Cookies.get("category") === "B" &&
    ["1", "2", "3", "4", "5", "6"].includes(key)
  ) {
    return undefined;
  }
  if (Cookies.get("category") === "null" && ["7", "8", "9"].includes(key)) {
    return undefined;
  }
  return {
    img: <Image alt="icon" src={imgSrc} />,
    to,
    title,
    key,
  };
}

// const items = [
//   getItem(
//     require("/public/images/home/Icons-15.svg"),
//     "/activitymapsandtrends/fishingvessels/activitytrends",
//     "1"
//   ),
//   getItem(
//     require("/public/images/home/Icons-16.svg"),
//     "/activitymapsandtrends/fishingvessels/densityheatmap",
//     "2"
//   ),
//   getItem(
//     require("/public/images/home/Icons-17.svg"),
//     "/activitymapsandtrends/fishingvessels/enteringleavingharbour",
//     "3"
//   ),
//   getItem(
//     require("/public/images/home/Icons-18.svg"),
//     "/activitymapsandtrends/fishingvessels/overstay",
//     "4"
//   ),
//   getItem(
//     require("/public/images/home/Icons-19.svg"),
//     "/activitymapsandtrends/fishingvessels/durationatsea",
//     "5"
//   ),
//   getItem(
//     require("/public/images/home/Icons-20.svg"),
//     "/activitymapsandtrends/merchantvesseltrends/visitingpakistan",
//     "6"
//   )
// ];

const itemsForActivityTrends = [
  // getItem(
  //   require("/public/images/home/Icons-15.svg"),
  //   "/activitymapsandtrends/fishingvessels/activitytrends",
  //   "1"
  // ),
  getItem(
    require("/public/images/home/Icons-16.svg"),
    "/activitymapsandtrends/merchantvesseltrends/activitytrendsvisual",
    "2"
  ),
  // getItem(
  //   require("/public/images/home/Icons-17.svg"),
  //   "/activitymapsandtrends/msaassets/activitytrends",
  //   "3"
  // ),
  // getItem(
  //   require("/public/images/home/Icons-18.svg"),
  //   "/activitymapsandtrends/contactofinterest/activitytrends",
  //   "4"
  // ),
  getItem(
    require("/public/images/home/Icons-19.svg"),
    "/activitymapsandtrends/defender/activitytrends",
    "5"
  )
];
const itemsForHarbour = [
  getItem(
    require("/public/images/home/Icons-15.svg"),
    "/activitymapsandtrends/fishingvessels/enteringleavingharbour",
    "1"
  ),
  getItem(
    require("/public/images/home/Icons-16.svg"),
    "/activitymapsandtrends/merchantvesseltrends/enteringleavingharbour",
    "2"
  ),
  // getItem(
  //   require("/public/images/home/Icons-17.svg"),
  //   "/activitymapsandtrends/contactofinterest/enteringleavingharbour",
  //   "4"
  // ),
  // getItem(
  //   require("/public/images/home/Icons-18.svg"),
  //   "/activitymapsandtrends/msaassets/enteringleavingharbour",
  //   "3"
  // )
];
const itemsForHeatMap = [
  getItem(
    require("/public/images/home/Icons-15.svg"),
    // "/activitymapsandtrends/fishingvessels/densityheatmap",
    // "/activitymapsandtrends/fishingvessels/heatmap",
    "/activitymapsandtrends/qgis/fishingheatmap",
    "1"
  ),
  getItem(
    require("/public/images/home/Icons-16.svg"),
    "/activitymapsandtrends/qgis/merchantheatmap",
    "2"
  ),
  // getItem(
  //   require("/public/images/home/Icons-17.svg"),
  //   "/activitymapsandtrends/msaassets/densityheatmap",
  //   "3"
  // ),
  // getItem(
  //   require("/public/images/home/Icons-18.svg"),
  //   "/activitymapsandtrends/contactofinterest/densityheatmap",
  //   "4"
  // )
];
const itemsForOverstay = [
  getItem(
    require("/public/images/home/Icons-15.svg"),
    "/activitymapsandtrends/fishingvessels/overstay",
    "1"
  ),
  getItem(
    require("/public/images/home/Icons-16.svg"),
    "/activitymapsandtrends/merchantvesseltrends/overstay",
    "2"
  ),
  // getItem(
  //   require("/public/images/home/Icons-17.svg"),
  //   "/activitymapsandtrends/msaassets/overstay",
  //   "3"
  // ),
  // getItem(
  //   require("/public/images/home/Icons-18.svg"),
  //   "/activitymapsandtrends/contactofinterest/overstay",
  //   "4"
  // )
];
const itemsForVesselDurationAtSea = [
  getItem(
    require("/public/images/home/Icons-15.svg"),
    "/activitymapsandtrends/fishingvessels/durationatsea",
    "1"
  ),
  getItem(
    require("/public/images/home/Icons-16.svg"),
    "/activitymapsandtrends/merchantvesseltrends/durationatsea",
    "2"
  ),
  // getItem(
  //   require("/public/images/home/Icons-17.svg"),
  //   "/activitymapsandtrends/msaassets/durationatsea",
  //   "3"
  // ),
  // getItem(
  //   require("/public/images/home/Icons-18.svg"),
  //   "/activitymapsandtrends/contactofinterest/durationatsea",
  //   "4"
  // )
];

const itemsForShipsVisiting = [
  getItem(
    require("/public/images/home/Icons-15.svg"),
    "/activitymapsandtrends/fishingvessels/visitingpakistan",
    "1"
  ),
  getItem(
    require("/public/images/home/Icons-16.svg"),
    "/activitymapsandtrends/merchantvesseltrends/visitingpakistan",
    "2"
  ),
  // getItem(
  //   require("/public/images/home/Icons-17.svg"),
  //   "/activitymapsandtrends/msaassets/visitingpakistan",
  //   "3"
  // ),
  // getItem(
  //   require("/public/images/home/Icons-18.svg"),
  //   "/activitymapsandtrends/contactofinterest/visitingpakistan",
  //   "4"
  // )
];

function Options({title}) {
  const selectItemsArray = (title) => {
    switch (title) {
      case "Activity Trends":
        return itemsForActivityTrends;
      case "Heat Map":
        return itemsForHeatMap;
      case "Harbour Trend":
        return itemsForHarbour;
      case "Overstay":
        return itemsForOverstay;
      case "Vessel Duration At Sea":
        return itemsForVesselDurationAtSea;
      case "Ships Visiting Pakistan":
        return itemsForShipsVisiting;
      default:
        return itemsForShipsVisiting;
    }
  };

  const items = selectItemsArray(title);
  return (
    <div className="mb-10">
      <Row className="flex items-center justify-center gap-x-8 gap-y-10">
        {items.map((item, i) => {
          if (!item) return null; // Skip items that should not be rendered
          return (
            <Col
              className="whitespace-normal"
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={i}
            >
              <Link href={item.to}>
                <div className="w-full bg-white hover:border-blue cursor-pointer rounded-lg shadow-xl border-2 border-slate-200 p-5 h-full">
                  <div className="flex justify-end">
                    <HiOutlineArrowNarrowRight fontSize={25} />
                  </div>
                  <div className="flex flex-col justify-end items-center">
                    {item.img}
                    <Typography className="text-lg mt-5 text-center">
                      {item.title}
                    </Typography>
                  </div>
                </div>
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default Options;
