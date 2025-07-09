import { Col, Row, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
function getItem(imgSrc, key) {
  // const keyToTitle = {
  //   1: "Fishing  Activity Trends",
  //   2: "Fishing  Heat Map",
  //   3: "Fishing  Harbour",
  //   4: "Fishing  Over Stay",
  //   5: "Fishing  Duration at Sea",
  //   6: "Merchant  Visiting Pakistan",
  //   7: "General Report",
  //   8: "Special Report (Merchant Vessel)",
  //   9: "Sepecial Report (Fishing Vessel)",

  //   // Add more mappings here as needed
  // };
  
  const keyToTitle = {
    1: "Activity Trends",
    2: "Heat Map",
    3: "Harbour Trend",
    4: "Overstay",
    5: "Vessel Duration At Sea",
    6: "Ships Visiting Pakistan",
    // 10: "Narcotics Dot Map",
    // 11: "Facial Recognition",
    // Add more mappings here as needed
  };
  // Determine the title based on the key
  const title = keyToTitle[key] || "";
  // You can add your logic here to set the title and key based on imgSrc or 'to' value

  if (
    Cookies.get("category") === "B" &&
    ["1", "2", "3", "4", "5", "6","10","11"].includes(key)
  ) {
    return undefined;
  }
  if (Cookies.get("category") === "null" && ["7", "8", "9"].includes(key)) {
    return undefined;
  }
  const isSvg = typeof imgSrc === "object" && imgSrc.default?.src?.endsWith(".svg");
  return { 
    img: <Image src={imgSrc.default.src} alt="icon"  width={imgSrc.default.width}
    height={imgSrc.default.height}/>,
    // img: isSvg ? (
    //   // <imgSrc.default /> // Render SVG as a React component
    //   <Image src={imgSrc.default.src} alt="icon"  width={imgSrc.default.width}
    //   height={imgSrc.default.height}/>
    // ) : imgSrc?.default?.src ? (
    //   console.log("here"),
    //   <Image
    //     // src={imgSrc.default.src} // PNG, JPEG, etc.
    //     src={imgSrc} // PNG, JPEG, etc.
    //     alt="icon"
    //     width={imgSrc.default.width || 100} // Provide default dimensions if not specified
    //     height={imgSrc.default.height || 100}
    //   />
    // ) : (
    //   <span>Image not available</span> // Fallback if imgSrc is undefined or incorrect
    // ),
    // to: "/dashboard/dashboardoptions",
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
//   ),
//   // getItem(require("/public/images/home/Icons-18.svg"), "/generalreport", "7"),
//   // getItem(require("/public/images/home/Icons-19.svg"), "/merchantvessel", "8"),
//   // getItem(require("/public/images/home/Icons-20.svg"), "/fishingvessel", "9"),
//   // Add more items here if needed
// ];

const items = [
  getItem(
    require("/public/images/home/Icons-14.svg"),
    "1"
  ),
  getItem(
    require("/public/images/home/Icons-16.svg"),
    "2"
  ),
  getItem(
    require("/public/images/home/Icons-17.svg"),
    "3"
  ),
  getItem(
    require("/public/images/home/Icons-18.svg"),
    "4"
  ),
  getItem(
    require("/public/images/home/Icons-19.svg"),
    "5"
  ),
  getItem(
    require("/public/images/home/Icons-20.svg"),
    "6"
  ),
  // getItem(
  //   require("/public/images/home/narcotics-dot-map2.png"),
  //   "10",
  //   "/activitymapsandtrends/antinarcotics",
  // ),
  // getItem(
  //   require("/public/images/home/face-scan.png"),
  //   "11",
  //   "/face_detection",
  // ),
  // getItem(require("/public/images/home/Icons-18.svg"), "/generalreport", "7"),
  // getItem(require("/public/images/home/Icons-19.svg"), "/merchantvessel", "8"),
  // getItem(require("/public/images/home/Icons-20.svg"), "/fishingvessel", "9"),
  // Add more items here if needed
];
function Index() {

  const router = useRouter();

  const handleItemClick = (item) => {
    console.log(item)
    if(item.title==="Facial Recognition")
    {
      router.push("/face_detection")
    }
    else if(item.title==="Narcotics Dot Map")
    {
      router.push("/activitymapsandtrends/antinarcotics/drugoperations")
    }
    else{
      // Redirect to dashboardoptions page with query parameters
      router.push({
        pathname: "/dashboard/dashboardoptions",
        query: { title: item.title, key: item.key },
      });
    }
  };

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
              {/* <Link href={item.to}> */}
                <div className="w-full  bg-white hover:border-blue cursor-pointer rounded-lg shadow-xl border-2 border-slate-200 p-5 h-full"
                 onClick={() => handleItemClick(item)}>
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
              {/* </Link> */}
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default Index;
