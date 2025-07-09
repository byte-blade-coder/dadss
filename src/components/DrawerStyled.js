import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Typography, Tooltip } from "antd";
import styled from "styled-components";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { FiBarChart, FiMap, FiAlertOctagon } from "react-icons/fi";
import { IoMdJet } from "react-icons/io";
import { AiOutlineUser, AiOutlinePieChart, AiOutlineUsergroupAdd, }from "react-icons/ai";
import { MdAppRegistration, MdSignpost, MdAnchor } from "react-icons/md";
import { HiOutlineDocumentDuplicate, HiOutlineDocumentReport, HiMap}from "react-icons/hi";
import { TbDeviceDesktopAnalytics  } from "react-icons/tb";
import { FaPowerOff, FaUsersGear, FaLifeRing, FaPills, FaRoute, } from "react-icons/fa";
import {
  GiFishingBoat,
  GiCargoShip,
  GiArtificialIntelligence,
  GiIronHulledWarship,
  GiHarborDock,
  GiSmallFishingSailboat,
  GiSailboat,
} from "react-icons/gi";
import { RiAdminLine, RiShipLine, RiFirstAidKitFill ,RiBarChartHorizontalLine  } from "react-icons/ri";
import { TbDatabase,TbPresentationAnalytics , TbReportAnalytics, TbMapCog, TbMapRoute } from "react-icons/tb";
import { BsWater, BsCapsulePill } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { SlGraph } from "react-icons/sl";
import { FcHeatMap } from "react-icons/fc";
import { withAuth } from "./withAuth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import FilledButton from "./button/FilledButton";
import { BsPersonCircle } from "react-icons/bs";
import { GiMedicalPack } from "react-icons/gi";
// import { BiSolidReport } from "react-icons/bi";
import { HiDocumentDuplicate } from "react-icons/hi2";
import { FcMultipleInputs } from "react-icons/fc";
const { Content, Footer, Sider, Header } = Layout;

const Drawer = (props) => {
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/logout`,
        {
          refresh: localStorage.getItem("refreshToken"),
        }
      );
    } catch (error) {
      console.error("Error logging out:", error);
    }
    localStorage.clear();
    router.push("/");
  };

  axios.defaults.headers["Authorization"] =
    "JWT " + localStorage.getItem("accessToken");

  const [collapsed, setCollapsed] = useState(false);
  const [changeDrawer, setChangeDrawer] = useState(localStorage.getItem("is_superuser"));

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 992); // 768px is typical width for md
    };

    // Initial setup
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   let value = localStorage.getItem("is_superuser");
  //   setChangeDrawer(value);
  // })

  const router = useRouter();

  function getItem(label, key, icon, children, type) {
    // if (localStorage.getItem("pf_source") === 'Ship' && key === '11'){
    //   return undefined;
    // }
    if (localStorage.getItem("pf_type") === "Aircraft" && key === "r1" ) {
      return undefined;
    }
    if (localStorage.getItem("pf_type") !== "Aircraft" && key === "11" && localStorage.getItem("is_superuser") === "false") {
      return undefined;
    }

    const labelComponent = <div style={{ color: "black"}}>{label}</div>;
    if (label === "COI Visiting Pakistan" && key === "g194") {
      // style={{padding: "1rem 0 2rem 0"}}
    }
    const iconComponent = icon ? (
      <div style={{ color: "black"}}>{icon}</div>
    ) : null;

    return {
      key,
      icon: iconComponent,
      // icon: (
      //   <Tooltip title={label} placement="right">
      //     <span>{icon}</span>
      //   </Tooltip>
      // ),
      children,
      label: label,
      type,
    };
  }

  const items = [
    getItem(
      <Link href="/dashboard">Home</Link>,
      "1",
      <RxDashboard size={20} />
    ),
    getItem(<p>Admin</p>, "2", <RiAdminLine size={20} />, [
      getItem(
        <Link href="/user">Users</Link>,
        "a1",
        <AiOutlineUser size={20} />
      ),
      getItem(
        <Link href="/usergroups">User Roles</Link>,
        "a2",
        <AiOutlineUsergroupAdd size={20} />
      ),
    ]),
    getItem(
      <Link href="/platformdata">Platform Data</Link>,
      "3",
      <TbDatabase size={20} />
    ),
    getItem(
      <Link href="/jettydata">Jetty Data</Link>,
      "20",
      <TbDatabase size={20} />
    ),
    getItem(<p>Reports</p>, "4", <TbReportAnalytics size={20} />, [
      getItem(
        <Link href="/generalreport">SITREP By Ship</Link>,
        "r1",
        <HiOutlineDocumentReport size={20} />
      ),
      getItem(
        <Link href="/missionreport">SITREP By Aircraft</Link>,
        "11",
        <HiOutlineDocumentReport size={20} />
      ),
      getItem(
        <Link href="/fishingvessel">Fishing Special Report</Link>,
        "r2",
        <TbDeviceDesktopAnalytics size={20} />
      ),
      getItem(
        <Link href="/merchantvessel">Merchant Special Report</Link>,
        "r3",
        <TbDeviceDesktopAnalytics size={20} />
      ),
      getItem(
        <Link href="/coireport">COI Special Report</Link>,
        "r4",
        <TbPresentationAnalytics  size={20} />
      ),
    ]),

    getItem(
      <p>Data Input Forms </p>,
      "5",
      <HiOutlineDocumentDuplicate size={20} />,
      [
        getItem(
          <Link href="/intelreport">Intel Data Input Form </Link>,
          "10",
          <GiArtificialIntelligence size={20} />
        ),
        getItem(
          <Link href="/shipbreaking">Ship Breaking Data Input Form</Link>,
          "12",
          <GiIronHulledWarship size={20} />
        ),

        getItem(
          <Link href="/csvfiles">CSV Files Data Input</Link>,
          "13",
          <TbDeviceDesktopAnalytics size={20} />
        ),
        getItem(
          <Link href="/registeredvessels">Fishing Vessel Data Input Form</Link>,
          "6",
          <MdAppRegistration size={20} />
        ),
        getItem(
          <Link href="/registeredmerchantvessels">
            Merchant Vessel Data Input Form
          </Link>,
          "9",
          <MdAppRegistration size={20} />
        ),
        getItem(
          <Link href="/searchvesselui">
            Picket Data Input Form
          </Link>,
          "14",
          <MdAppRegistration size={20} />
        ),
        getItem(
          <Link href="/searchandrescue">
            SAR Data Input Form
          </Link>,
          "16",
          <FaLifeRing size={19} />
        ),
        getItem(
          <Link href="/medicalassistance">
            Medical Assistance Input Form
          </Link>,
          "18",
          <GiMedicalPack  size={19} />
        ),
      ]
    ),
    getItem(
      <Link href="/visform">VIS Report</Link>,
      "8",
      <MdAnchor size={20} />
    ),
    getItem(
      <Link href="/merchantVesselDetails">Merchant Vessel Trips</Link>,
      "14",
      <TbDeviceDesktopAnalytics size={20} />
    ),
    // getItem(
    //   <Link href="/tabledisplay">Table Display</Link>,
    //   "15",
    //   <TbDeviceDesktopAnalytics size={20} />
    // ),
    getItem(
      <Link href="/tabledisplayapi">Data View</Link>,
      "17",
      <TbDeviceDesktopAnalytics size={20} />
    ),
    getItem(
      !collapsed ? (
        <p className="text-black font-bold" style={{ padding: "10px 5px" }}>
          Activity Maps and Trends
        </p>
      ) : (
        ""
      ),
      "7",
      null,
      [
        getItem(
          <p>Anti Narcotics/Smuggling Operations</p>,
          "g13",
          <RiShipLine size={20} />,
          [
            getItem(
              <Link style={{}} href="/activitymapsandtrends/antinarcotics/drugoperations">
                Contraband/Drug Confiscation
              </Link>,
              "g131",
              <FaPills size={20}/>
            ),
            getItem(
              <Link style={{}} href="/activitymapsandtrends/patroltype/visual">
                Patrol OPs
              </Link>,
              "g132",
              <FiMap size={20} />
            ),
            getItem(
              <Link href="/activitymapsandtrends/antinarcotics/searchrescue">
                Search & Rescue Operations
              </Link>,
              "g133",
              <FaLifeRing size={20} />
            ),
          ]
        ),
        getItem(<p>Activity Trends</p>, "g15", <SlGraph size={20} />, [
          getItem(
            <Link href="/activitymapsandtrends/fishingvessels/activitytrends">
              Fishing Vessel Activity Trends
            </Link>,
            "g151",
            <GiFishingBoat size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/merchantvesseltrends/activitytrendsvisual">
              Merchant Vessel Activity Trends
            </Link>,
            "g152",
            <GiCargoShip color="black" size={20} />
          ),
          getItem(
            // <Link href="/activitymapsandtrends/msaassets/activitytrends">
            //   Own Platform Activity Trends
            // </Link>,
            // "g153",
            // <FiBarChart size={20} />
            <p>Own Platform Activity Trends</p>, "g153", <SlGraph size={20} />, [
            getItem(
              <Link href="/activitymapsandtrends/msaassets/routesflowmap">
                MSA Routes Flow Map
              </Link>,
              "g141",
              <FiMap size={20} />
            ),
            getItem(
              <Link href="/activitymapsandtrends/msaassets/PNMSA">
                Monthly Sea Hours of PNMSA
              </Link>,
              "g144",
              <FiBarChart size={20} />
            ),]
          ),
          getItem(
            <Link href="/activitymapsandtrends/contactofinterest/activitytrends">
              COI Activity Trends
            </Link>,
            "g154",
            <FiBarChart size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/defender/activitytrends">
              Defender Activity Trends
            </Link>,
            "g155",
            <IoMdJet size={20} />
          ),
        ]),
        getItem(<p>Heat Maps</p>, "g16", <FcHeatMap size={20} />, [
          getItem(
            <Link href="/activitymapsandtrends/fishingvessels/densityheatmap">
              Fishing Heat Map
            </Link>,
            "g161",
            <GiFishingBoat size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/merchantvesseltrends/densityheatmap">
              Merchant Heat Map
            </Link>,
            "g162",
            <GiCargoShip color="black" size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/msaassets/densityheatmap">
              Own Platform Heat Map
            </Link>,
            "g163",
            <FiBarChart size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/contactofinterest/densityheatmap">
              COI Heat Map
            </Link>,
            "g164",
            <FiBarChart size={20} />
          )
        ]),
        getItem(<p>Harbours</p>, "g17", <GiHarborDock size={20} />, [
          getItem(
            <Link href="/activitymapsandtrends/fishingvessels/enteringleavingharbour">
              Fishing Harbours
            </Link>,
            "g171",
            <GiFishingBoat size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/merchantvesseltrends/enteringleavingharbour">
              Merchant Harbours
            </Link>,
            "g172",
            <GiCargoShip color="black" size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/msaassets/enteringleavingharbour">
              Own Platform Harbours
            </Link>,
            "g173",
            <FiBarChart size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/contactofinterest/enteringleavingharbour">
              COI Harbours
            </Link>,
            "g174",
            <FiBarChart size={20} />
          )
        ]),
        getItem(<p>Overstay</p>, "g20", <FiBarChart size={20} />, [
          getItem(
            <Link href="/activitymapsandtrends/fishingvessels/overstay">
              Fishing Overstay
            </Link>,
            "g201",
            <GiFishingBoat size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/merchantvesseltrends/overstay">
              Merchant Overstay
            </Link>,
            "g202",
            <GiCargoShip color="black" size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/msaassets/overstay">
              Own Platform Overstay
            </Link>,
            "g203",
            <FiBarChart size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/contactofinterest/overstay">
              COI Overstay
            </Link>,
            "g204",
            <FiBarChart size={20} />
          )
        ]),
        getItem(<p>Duration At Sea</p>, "g18", <BsWater size={20} />, [
          getItem(
            <Link href="/activitymapsandtrends/fishingvessels/durationatsea">
              Fishing Vessels Duration At Sea
            </Link>,
            "g181",
            <GiFishingBoat size={20} />
          ),
          // getItem(
          //   <Link href="/activitymapsandtrends/merchantvesseltrends/durationatsea">
          //     Merchant Vessels Duration At Sea
          //   </Link>,
          //   "g182",
          //   <GiCargoShip color="black" size={20} />
          // ),
          getItem(
            <Link href="/activitymapsandtrends/msaassets/durationatsea">
              Own Platform Duration At Sea
            </Link>,
            "g183",
            <FiBarChart size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/contactofinterest/durationatsea">
              COI Duration At Sea
            </Link>,
            "g184",
            <FiBarChart size={20} />
          )
        ]),
        getItem(<p>Visiting Pakistan</p>, "g19", <SlGraph size={20} />, [
          // getItem(
          //   <Link href="/activitymapsandtrends/fishingvessels/visitingpakistan">
          //     Fishing Vessels Visiting Pakistan
          //   </Link>,
          //   "g191",
          //   <GiFishingBoat size={20} />
          // ),
          getItem(
            <Link href="/activitymapsandtrends/merchantvesseltrends/visitingpakistan">
              Merchant Vessels Visiting Pakistan
            </Link>,
            "g192",
            <GiCargoShip color="black" size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/msaassets/visitingpakistan">
              Own Platform Visiting Pakistan
            </Link>,
            "g193",
            <FiBarChart size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/contactofinterest/visitingpakistan">
              COI Visiting Pakistan
            </Link>,
            "g194",
            <FiBarChart size={20} />
          )
        ]),
      ],
      "group"
    ),
  ];

  const itemsforuser = [
    getItem(
      <Link href="/dashboard">Home</Link>,
      "1",
      <RxDashboard size={20} />
    ),
    getItem(<p>Admin</p>, "2", <RiAdminLine size={20} />, [
      getItem(
        <Link href="/user">Users</Link>,
        "a1",
        <AiOutlineUser size={20} />
      ),
      getItem(
        <Link href="/usergroups">User Roles</Link>,
        "a2",
        <AiOutlineUsergroupAdd size={20} />
      ),
    ]),
    getItem(
      <Link href="/platformdata">Platform Data</Link>,
      "3",
      <TbDatabase size={20} />
    ),
    getItem(
      <Link href="/jettydata">Jetty Data</Link>,
      "20",
      <TbDatabase size={20} />
    ),
    getItem(<p>Reports</p>, "4", <TbReportAnalytics size={20} />, [
      getItem(
        <Link href="/generalreport">SITREP By Ship</Link>,
        "r1",
        <HiOutlineDocumentReport size={20} />
      ),
      getItem(
        <Link href="/missionreport">SITREP By Aircraft</Link>,
        "11",
        <HiOutlineDocumentReport size={20} />
      ),
      getItem(
        <Link href="/fishingvessel">Fishing Special Report</Link>,
        "r2",
        <TbDeviceDesktopAnalytics size={20} />
      ),
      getItem(
        <Link href="/merchantvessel">Merchant Special Report</Link>,
        "r3",
        <TbDeviceDesktopAnalytics size={20} />
      ),
      // getItem(
      //   <Link href="/coireport">COI Special Report</Link>,
      //   "r4",
      //   <TbPresentationAnalytics  size={20} />
      // ),
    ]),
    getItem(
      <p>Data Input Forms </p>,
      "5",
      <HiOutlineDocumentDuplicate size={20} />,
      [
        getItem(
          <Link href="/intelreport">Intel Data Input Form </Link>,
          "10",
          <GiArtificialIntelligence size={20} />
        ),
        getItem(
          <Link href="/shipbreaking">Ship Breaking Data Input Form</Link>,
          "12",
          <GiIronHulledWarship size={20} />
        ),

        getItem(
          <Link href="/csvfiles">CSV Files Data Input</Link>,
          "13",
          <TbDeviceDesktopAnalytics size={20} />
        ),
        getItem(
          <Link href="/registeredvessels">Fishing Vessel Data Input Form</Link>,
          "6",
          <MdAppRegistration size={20} />
        ),
        getItem(
          <Link href="/registeredmerchantvessels">
            Merchant Vessel Data Input Form
          </Link>,
          "9",
          <MdAppRegistration size={20} />
        ),
        getItem(
          <Link href="/searchandrescue">
            SAR Data Input Form
          </Link>,
          "16",
          <FaLifeRing size={19} />
        ),
        getItem(
          <Link href="/medicalassistance">
            Medical Assistance Input Form
          </Link>,
          "18",
          <GiMedicalPack  size={19} />
        ),
      ]
    ),
    
    getItem(
      <Link href="/visform">VIS Report</Link>,
      "8",
      <MdAnchor size={20} />
    ),
    getItem(
      <Link href="/merchantVesselDetails">Merchant Vessel Trips Details</Link>,
      "14",
      <TbDeviceDesktopAnalytics size={20} />
    ),  
    getItem(
      <Link href="/activitymapsandtrends/merchantvesseltrends/mvstrips">
        Merchant Vessel Trips Summary
      </Link>,
      "19",
      <SlGraph size={20} />
    ),
    getItem(
      <Link href="/tabledisplayapi">Data View</Link>,
      "17",
      <TbDeviceDesktopAnalytics size={20} />
    ),

    getItem(
      !collapsed ? (
        <p className="text-black font-bold" style={{ padding: "10px 5px" }}>
          Activity Maps and Trends
        </p>
      ) : (
        ""
      ),
      "7",
      null,
      [
        getItem(
          <p>Anti Narcotics/Smuggling Operations</p>,
          "g13",
          <RiShipLine size={20} />,
          [
            getItem(
              <Link style={{}} href="/activitymapsandtrends/qgis/drugoperations">
                Contraband/Drug Confiscation
              </Link>,
              "g131",
              <FaPills size={20}/>
            ),
            getItem(
              <Link style={{}} href="/activitymapsandtrends/qgis/patroltype">
                Patrolling Operations
              </Link>,
              "g132",
              <FiMap size={20} />
            ),
          ]
        ),
        getItem(<p>Merchant Vessel</p>, "g15", <GiCargoShip size={20} />, [
          getItem(
            <Link href="/activitymapsandtrends/merchantvesseltrends/activitytrendsvisual">
              Activity Trends
            </Link>,
            "g151",
            <SlGraph size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/qgis/merchantheatmap">
              Heat Map
            </Link>,
            "g152",
            <FcHeatMap color="black" size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/merchantvesseltrends/enteringleavingharbour">
              Harbours
            </Link>,
            "g153",
            <GiHarborDock size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/merchantvesseltrends/overstay">
              Stay
            </Link>,
            "g154",
            <FiBarChart size={20} />
          ),
          // getItem(
          //   <Link href="/activitymapsandtrends/merchantvesseltrends/durationatsea">
          //     Duration At Sea
          //   </Link>,
          //   "g155",
          //   <BsWater size={20} />
          // ),
          getItem(
            <Link href="/activitymapsandtrends/merchantvesseltrends/visitingpakistan">
              Visiting Pakistan
            </Link>,
            "g156",
            <SlGraph size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/merchantvesseltrends/mvstripcount">
              Trips
            </Link>,
            "g157",
            <FiBarChart size={20} />
          ),
           getItem(
            <Link
              href="/activitymapsandtrends/merchantvesseltrends/playingthroughPAKEEZ"
              // style={{ color: "white" }}
            >
              Plying Through PAK EEZ
            </Link>,
            "g121",
            // <FiAlertOctagon color="red" size={20}/>
              // <FiMap color="white" size={20}/>
            <AiOutlinePieChart size={20}/>
          ),
        ]),
        getItem(<p>Fishing Vessel</p>, "g16", <GiFishingBoat size={20} />, [
          // getItem(
          //   <Link href="/activitymapsandtrends/fishingvessels/activitytrends">
          //     Activity Trends
          //   </Link>,
          //   "g161",
          //   <SlGraph size={20} />
          // ),
          getItem(
            <Link href="/activitymapsandtrends/qgis/fishingheatmap">
              Heat Map
            </Link>,
            "g162",
            <FcHeatMap color="black" size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/fishingvessels/enteringleavingharbour">
              Harbours
            </Link>,
            "g163",
            <GiHarborDock size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/fishingvessels/overstay">
              Overstay
            </Link>,
            "g164",
            <FiBarChart size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/fishingvessels/durationatsea">
              Duration At Sea
            </Link>,
            "g165",
            <BsWater size={20} />
          ),
          // getItem(
          //   <Link href="/activitymapsandtrends/fishingvessels/visitingpakistan">
          //     Visiting Pakistan
          //   </Link>,
          //   "g166",
          //   <SlGraph size={20} />
          // )
        ]),
        getItem( <p>Own Platform</p>, "g14", <SlGraph size={20} />, [
          getItem(
            <Link href="/activitymapsandtrends/msaassets/routesflowmap">
              MSA Routes Flow Map
            </Link>,
            "g141",
            <FaRoute  size={20} />
          ),
          getItem(
            <Link href="/activitymapsandtrends/msaassets/PNMSA">
              Monthly Sea Hours of PNMSA
            </Link>,
            "g142",
            <FiBarChart size={20} />
          ),,
          getItem(
            <Link href="/activitymapsandtrends/msaassets/PNMSAareaplanner">
              PNMSA Operational Area Mapping
            </Link>,
            "g143",
            <FiMap size={20} />
          ),]
        ),
        // getItem(<p>Contact of Interest</p>, "g17", <RiBarChartHorizontalLine size={20} />, [
        //   getItem(
        //     <Link href="/activitymapsandtrends/contactofinterest/activitytrends">
        //       Activity Trends
        //     </Link>,
        //     "g171",
        //     <SlGraph size={20} />
        //   ),
        //   // getItem(
        //   //   <Link href="/activitymapsandtrends/contactofinterest/densityheatmap">
        //   //     Heat Map
        //   //   </Link>,
        //   //   "g172",
        //   //   <GiCargoShip color="black" size={20} />
        //   // ),
        //   getItem(
        //     <Link href="/activitymapsandtrends/contactofinterest/enteringleavingharbour">
        //      Harbours
        //     </Link>,
        //     "g173",
        //     <GiHarborDock size={20} />
        //   ),
        //   getItem(
        //     <Link href="/activitymapsandtrends/contactofinterest/overstay">
        //       Overstay
        //     </Link>,
        //     "g174",
        //     <FiBarChart size={20} />
        //   ),
        //   getItem(
        //     <Link href="/activitymapsandtrends/contactofinterest/durationatsea">
        //       Duration At Sea
        //     </Link>,
        //     "g175",
        //     <BsWater size={20} />
        //   ),
        //   getItem(
        //     <Link href="/activitymapsandtrends/contactofinterest/visitingpakistan">
        //       Visiting Pakistan
        //     </Link>,
        //     "g176",
        //     <SlGraph size={20} />
        //   )
        // ]),
        getItem(<p>Defender</p>, "g20", <IoMdJet size={20} />, [
          getItem(
            <Link href="/activitymapsandtrends/defender/activitytrends">
              Defender Activity Trends
            </Link>,
            "g201",
            <SlGraph size={20}  />
          ),
          // getItem(
          //   <Link href="/activitymapsandtrends/merchantvesseltrends/overstay">
          //     Merchant Overstay
          //   </Link>,
          //   "g202",
          //   <GiCargoShip color="black" size={20} />
          // ),
        ]),
        getItem(
          <Link href="/activitymapsandtrends/qgis/searchrescue">
            Search & Rescue Operations
          </Link>,
          "g133",
          <FaLifeRing size={20} />
        ),
        getItem(
            <Link style={{}} href="/activitymapsandtrends/qgis/jetty">
              Jetty
            </Link>,
            "g21",
            <GiHarborDock size={20}/>
          ),
      // getItem(
        //   <p>JMICC</p>,
        //   "j13",
        //   <RiShipLine size={20} />,
        //   [
        //     getItem(
        //       <Link style={{}} href="/activitymapsandtrends/jmicc/indiandhowfishing">
        //         Indian Dhows and Fishing Boats Transitting through PAK EEZ
        //       </Link>,
        //       "j131",
        //       <GiSailboat size={20}/>
        //     ),
        //     getItem(
        //       <Link style={{}} href="/activitymapsandtrends/jmicc/indiandhowaverage">
        //         Average Indian Dhows Passed from Pak EEZ
        //       </Link>,
        //       "j132",
        //       <GiSmallFishingSailboat  size={20} />
        //     ),
        //     getItem(
        //       <Link href="/activitymapsandtrends/jmicc/indianmvsinEEZ">
        //         Indian MVs Traversing through PAK EEZ
        //       </Link>,
        //       "j133",
        //       <GiCargoShip size={20} />
        //     ),
        //     getItem(
        //       <Link href="/activitymapsandtrends/jmicc/allmvsinEEZ">
        //         MVs Transitting through PAK EEZ
        //       </Link>,
        //       "j134",
        //       <RiShipLine size={20} />
        //     ),
        //     getItem(
        //       <Link href="/activitymapsandtrends/jmicc/indianmvs">
        //         Average Indian MVs Passed from Pak EEZ
        //       </Link>,
        //       "j135",
        //       <GiCargoShip size={20} />
        //     ),
        //     getItem(
        //       <Link href="/activitymapsandtrends/jmicc/pakfishing">
        //         Pakistani Fishing Boats Operating at Sea
        //       </Link>,
        //       "j136",
        //       <GiFishingBoat size={20} />
        //     ),
        //   ]
        // ),
       
      ],
      "group"
    ),
  ];

  const {
    token: { colorBgContainer, colorPrimary, colorHo },
  } = theme.useToken();

  const headerStyle = {
    textAlign: "center",
    height: "100%",
    backgroundColor: "#063970",
    position: "sticky",
    top: 0,
    zIndex: 10,
    width: "100%",
    padding: "0px",
  };
  const footerStyle = {
    textAlign: "center",
    // position: "sticky",
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    width: "100%",
    color: "black",
    backgroundColor: "#ADADAD",
    alignItems: "center",
  };

  return (
    <StyledSection>
      <Layout style={{height: "auto" , background: "#f5f5f5"}}>
        <Header style={headerStyle}>
          <div
            className="text-white mt-0 md:text-md sm:text-sm lg:text-lg xl:text-xl whitespace-nowrap text-center p-0
          "
          >
            <p>PAKISTAN MARITIME SECURITY AGENCY</p>
            <p>DATA ANALYSIS DECISION SUPPORT SYSTEM (DADSS)</p>
          </div>
        </Header>
        {/* <Layout style={{ maxHeight: "85vh" }}> */}
        <Layout className="" style={{ height: "h-screen", marginTop: "auto" }}>
          <Sider
            trigger={null}
            breakpoint="lg"
            className="styled-sider"
            width={350}
            collapsible
            collapsed={collapsed}
            style={{
              overflowY: "visible",
              //height: "100vh",
              position: "fixed",
            }}
            tooltip={{ title: true }}
          >
             {!collapsed? (
              <div
                style={{ display: "flex", padding: "10px",position: "fixed", zIndex: "100", backgroundColor: "lightgray",
                justifyContent: "space-between", /*alignItems: "center",*/ width: "21.5rem" }}
                className="trigger"
              >
                  <div className="logo ml-5 text-black font-bold text-2xl"
                  style={{ zIndex: "100", backgroundColor: "lightgray",}}>
                    DADSS
                  </div>
                <div style={{ marginLeft: "10rem" }}>
                    <MenuUnfoldOutlined
                      className="bg-white p-3 rounded-full"
                      style={{}}
                      onClick={() => setCollapsed(!collapsed)}
                    />
                </div>
            </div>
            ) :(
              <div
                style={{ display: "flex", padding: "10px"}}
                className="trigger"
              >
                <div className="logo ml-5 text-black font-bold text-2xl"
                style={{position: "fixed"
                }}>
                </div>
                <div style={{ /* marginLeft: "auto", */ marginLeft: "0.75rem" }}>
                  <MenuFoldOutlined
                    className="bg-white p-3 rounded-full"
                    onClick={() => setCollapsed(!collapsed)}
                  />
                </div>
              </div>
            )}
            {/* {!collapsed? (
              <div
                style={{ display: "flex", padding: "10px",position: "fixed", zIndex: "100", backgroundColor: "lightgray",
                justifyContent: "space-between", alignItems: "center",width: "21.5rem" }}
                className="trigger"
              >
                {!collapsed ? (
                  <div className="logo ml-5 text-black font-bold text-2xl"
                  style={{position: "fixed"
                  }}>
                    DADSS
                  </div>
                ) : (
                  ""
                )}
                <div style={{ marginLeft: "auto" }}>
                  {collapsed ? (
                    <MenuUnfoldOutlined
                      className="bg-white p-3 rounded-full"
                      style={{position: "fixed"}}
                      onClick={() => setCollapsed(!collapsed)}
                    />
                  ) : (
                    <MenuFoldOutlined
                      className="bg-white p-3 rounded-full"
                      onClick={() => setCollapsed(!collapsed)}
                    />
                  )}
                </div>
            </div>
            ) :("")} */}
            {!collapsed? (
              <StyledMenu
                style={{
                  color: colorPrimary,
                  background: "lightgray",
                  bottom: "0px",
                  marginTop: "3.5rem",
                  // overflowY: "scroll",
                  paddingBottom: "7rem"
                  // margin: "0 3rem 0 0",
                }}
                className="text-black "
                mode="inline"
                items={changeDrawer==="true" ? itemsforuser :items}
                inlineCollapsed={collapsed}
              />
            ): (
              <StyledMenu
              style={{
                color: colorPrimary,
                background: "lightgray",
                bottom: "0px",
                marginTop: "0.5rem",
                // overflowY: "scroll",
                paddingBottom: "0"
                // margin: "0 3rem 0 0",
              }}
              className="text-black "
              mode="inline"
              items={changeDrawer==="true" ? itemsforuser :items}
              inlineCollapsed={collapsed}
            />
            )}
            <Menu
              mode="inline"
              inlineCollapsed={collapsed}
              className="custom-css-logout"
              // style={{margin: "0 0.2rem 0 0",}}
            >
              {!collapsed ? (
                <div className=" ml-4 border-solid"
                style={{
                  position: "fixed",
                  width: "20.5rem",
                  top: "auto",
                  // background: "gray",
                  margin: "0 0 0 0",
                }}
                onClick={handleLogout}>
                  <BsPersonCircle className="inline-flex mr-2" />
                  <Typography className="inline-flex mr-2">
                    {localStorage.getItem("username")}
                  </Typography>
                  <FaPowerOff className="fill-black inline-flex justify-end float-right	mt-3 mr-6" />
                </div>
              ) : (
                <div className=" border-solid logout-button-css" style={{
                  width: "4.4rem",}} onClick={handleLogout}>
                  <FaPowerOff className="fill-black inline-flex justify-end ml-4" />
                </div>
              )}
            </Menu>
          </Sider>
            
          <Content
            // className="p-2" overflow: "auto",  height:"92vh" ,
            style={{  overflow: "auto", minHeight:"92vh" , height:"92vh",
            marginLeft: collapsed ? "80px" : "350px", transition: "margin-left 0.2s"  }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
      <Footer style={footerStyle}>
        <div>
          Copyright <span className="font-bold">Dadss</span> ©{" "}
          {new Date().getFullYear()} All Rights Reserved
        </div>
      </Footer>
    </StyledSection>
  );
};

export default withAuth(Drawer);

const StyledMenu = styled(Menu)`
  &.ant-menu-light .ant-menu-item-selected {
    background-color: rgb(0, 0, 0, 0.3) !important;
    color: black !important;
  }

  &.ant-menu-dark.ant-menu-inline .ant-menu-sub.ant-menu-inline {
    background: #012169 !important;
    color: black !important;
  }
`;

const StyledSection = styled.section`
  .styled-sider {
    background: linear-gradient(25deg, lightgray 60%, lightgray 90%);
    position: sticky;
    overflow: auto;
    height: 100%;
    left: 0;
    top: 56px;
    bottom: 0;
    ::-webkit-scrollbar {
      width: 6px;
      background-color: white;
    }
    ::-webkit-scrollbar-thumb {
      // background: linear-gradient(55deg, #012169 40%, #0659ed 100%);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 3px grey;
      /* border-radius: 10px; */
    }
  }

  // .ant-menu-light .ant-menu-submenu-selected >.ant-menu-submenu-title {
  //   color: black;
  // }

  .ant-menu-title-content{
    color: black;
  }

  // & .ant-menu-submenu-title {  // Target submenu titles
  //   position: relative; // Needed for tooltip positioning

  //   &:hover::after { // Tooltip on hover when collapsed
  //     content: attr(title); // Get the title attribute
  //     position: absolute;
  //     left: 40px; // Adjust as needed
  //     top: 50%;
  //     transform: translateY(-50%);
  //     background-color: rgba(0, 0, 0, 0.7);
  //     color: white;
  //     padding: 4px 8px;
  //     border-radius: 4px;
  //     z-index: 10; // Ensure it's above other elements
  //     white-space: nowrap; // Prevent text from wrapping
  //   }

  //   .ant-menu-item{
  //     .ant-menu-title{
  //       &:hover{
  //         background-color: rgb(0,0,0,0.3) !important;
  //       }
  //     }
  //   }
  // }
`;
