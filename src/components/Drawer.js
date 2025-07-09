import React, { useEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import styled from "styled-components";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { FiBarChart, FiMap } from "react-icons/fi";
import { MdAnchor } from "react-icons/md";
import { AiOutlineUser, AiOutlinePieChart ,  AiOutlineUsergroupAdd  } from "react-icons/ai";
import { MdAppRegistration } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { FaUsersGear } from "react-icons/fa";
import {
  GiFishingBoat,
  GiCargoShip,
  GiArtificialIntelligence,
  GiIronHulledWarship,
} from "react-icons/gi";
import { RiShipLine } from "react-icons/ri";
import { GoGraph } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { TbDatabase } from "react-icons/tb";
import { SlGraph } from "react-icons/sl";
import { FcHeatMap } from "react-icons/fc";
import { withAuth } from "./withAuth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";

const { Content, Footer, Sider, Header } = Layout;

const Drawer = (props) => {
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/logout`, {
          refresh: localStorage.getItem('refreshToken')
        }
      );
    } catch (error) {
      console.error("Error logging out:", error);
    }
    localStorage.clear();
    router.push("/");
  };

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 900); // 768px is typical width for md
    };

    // Initial setup
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const router = useRouter();

  function getItem(label, key, icon, children, type) {
    // Check if is_superuser is true in localStorage
    // const isSuperUser = localStorage.getItem("is_superuser") === "true";

    // // Check if the item should be displayed based on the user's superuser status
    // if ((key === "2" ) && !isSuperUser) {
    //   return undefined;
    // }

    if (Cookies.get("category") === "B" && ["2", "3", "8"].includes(key)) {
      return undefined;
    }
    if (
      Cookies.get("category") === "C" &&
      ["2", "3", "4", "9", "10", "5", "6", "7"].includes(key)
    ) {
      return undefined;
    }
    if (Cookies.get("category") === "A" && ["2", "3"].includes(key)) {
      return undefined;
    }
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    getItem(
      <Link href="/dashboard" style={{ color: "white" }}>
        Dashboard
      </Link>,
      "1",
      <RxDashboard color="white" size={20} />
    ),
    getItem(
      <Link href="/user" style={{ color: "white" }}>
        Users
      </Link>,
      "2",
      <AiOutlineUser style={{ color: "white" }} size={20} />
    ),
    getItem(
      <Link href="/usergroups" style={{ color: "white" }}>
        User Roles
      </Link>,
      "2.1",
      // <AiOutlineUser style={{ color: "white" }} size={20} />
      <AiOutlineUsergroupAdd style={{ color: "white" }} size={20} />
    ),

    getItem(
      <Link href="/platformdata" style={{ color: "white" }}>
        Platform Data
      </Link>,
      "3",
      <TbDatabase color="white" size={20} />
    ),
    getItem(
      <Link href="/generalreport" style={{ color: "white" }}>
        General Report
      </Link>,
      "5",
      <HiOutlineDocumentReport color="white" size={20} />
    ),
    getItem(
      <Link href="/registeredvessels" style={{ color: "white" }}>
        Registered Fishing Vessel
      </Link>,
      "4",
      <MdAppRegistration color="white" size={20} />
    ),
    getItem(
      <Link href="/fishingvessel" style={{ color: "white" }}>
        Special Report(Fishing Vessel)
      </Link>,
      "7",
      <TbDeviceDesktopAnalytics color="white" size={20} />
    ),
    getItem(
      <Link href="/registeredmerchantvessels" style={{ color: "white" }}>
        Registered Merchant Vessel
      </Link>,
      "9",
      <MdAppRegistration color="white" size={20} />
    ),

    getItem(
      <Link href="/merchantvessel" style={{ color: "white" }}>
        Special Report(Merchant Vessel)
      </Link>,
      "6",
      <TbDeviceDesktopAnalytics color="white" size={20} />
    ),
    getItem(
      <Link href="/visform" style={{ color: "white" }}>
        Special Report (VIS Data)
      </Link>,
      "8",
      // <TbDeviceDesktopAnalytics  />
      <MdAnchor color="white" size={20} />
    ),
    getItem(
      <Link href="/intelreport" style={{ color: "white" }}>
        Intel Report
      </Link>,
      "10",
      <GiArtificialIntelligence color="white" size={20} />
    ),
    getItem(
      <Link href="/missionreport" style={{ color: "white" }}>
        Mission Report
      </Link>,
      "11",
      <TbDeviceDesktopAnalytics color="white" size={20} />
    ),
    getItem(
      <Link href="/shipbreaking" style={{ color: "white" }}>
        Ship Breaking Report
      </Link>,
      "12",
      <GiIronHulledWarship color="white" size={20} />
    ),
    getItem(
      <Link href="/csvfiles" style={{ color: "white" }}>
        CSV Files
      </Link>,
      "13",
      <TbDeviceDesktopAnalytics color="white" size={20} />
    ),
    getItem(
      <Link href="/merchantVesselDetails" style={{ color: "white" }}>
        Merchant Vessel
      </Link>,
      "14",
      <TbDeviceDesktopAnalytics color="white" size={20} />
    ),

    getItem(
      !collapsed ? (
        <p className="text-white font-bold" style={{ padding: "10px 5px" }}>
          Activity Maps and Trends
        </p>
      ) : (
        ""
      ),
      "8",
      null,
      [
        getItem(
          <p style={{ color: "white" }}>Fishing Vessels</p>,
          "g11",
          <GiFishingBoat color="white" size={20} />,
          [
            getItem(
              <Link
                href="/activitymapsandtrends/fishingvessels/activitytrends"
                style={{ color: "white" }}
              >
                Activity Trends
              </Link>,
              "g112",
              <SlGraph color="white" size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/fishingvessels/densityheatmap"
                style={{ color: "white" }}
              >
                Density Heat Map
              </Link>,
              "g113",
              <FcHeatMap color="white" size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/fishingvessels/enteringleavingharbour"
                style={{ color: "white" }}
              >
                Entering Leaving Harbour
              </Link>,
              "g114",
              <FiBarChart color="white" size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/fishingvessels/overstay"
                style={{ color: "white" }}
              >
                Over Stay
              </Link>,
              "g115",
              <FiBarChart color="white" size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/fishingvessels/durationatsea"
                style={{ color: "white" }}
              >
                Duration at Sea
              </Link>,
              "g116",
              <AiOutlinePieChart color="white" size={20} />
            ),
          ]
        ),
        getItem(
          <p style={{ color: "white" }}>Merchant Vessel Trends</p>,
          "g12",
          <GiCargoShip color="white" size={20} />,
          [
            getItem(
              <Link
                href="/activitymapsandtrends/merchantvesseltrends/playingthroughPAKEEZ"
                style={{ color: "white" }}
              >
                Plying Through PAK EEZ
              </Link>,
              "g121",
              // <FiMap color="white" size={20} />
              <AiOutlinePieChart color="white" size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/merchantvesseltrends/visitingpakistan"
                style={{ color: "white" }}
              >
                Visiting Pakistan
              </Link>,
              "g122",
              <FiBarChart color="white" size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/merchantvesseltrends/overstay"
                style={{ color: "white" }}
              >
                Over Stay
              </Link>,
              "g123",
              <AiOutlinePieChart color="white" size={20} />
            ),
          ]
        ),
        getItem(
          <p style={{ color: "white" }}>Anti Narcotics/Smuggling Operations</p>,
          "g13",
          <RiShipLine color="white" size={20} />,
          [
            getItem(
              <Link
                href="/activitymapsandtrends/antinarcotics/drugoperations"
                style={{ color: "white" }}
              >
                Contraband/Drug Confiscation
              </Link>,
              "g131",
              <FiMap color="white" size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/antinarcotics/searchrescue"
                style={{ color: "white" }}
              >
                Search & Rescue Operations
              </Link>,
              "g132",
              <FiMap color="white" size={20} />
            ),
          ]
        ),
        getItem(
          <p style={{ color: "white" }}>MSA Assets</p>,
          "g14",
          <GoGraph color="white" size={20} />,
          [
            getItem(
              <Link
                href="/activitymapsandtrends/msaassets/routesflowmap"
                style={{ color: "white" }}
              >
                MSA Routes Flow MAP
              </Link>,
              "g141",
              <FiMap color="white" size={20} />
            ),
            // getItem(
            //   <Link
            //     href="/activitymapsandtrends/msaassets/PNMSAships"
            //     style={{ color: "white" }}
            //   >
            //     Monthly Sea Hours of PNMSA Ships
            //   </Link>,
            //   "g142",
            //   <FiBarChart color="white" size={20} />
            // ),
            // getItem(
            //   <Link
            //     href="/activitymapsandtrends/msaassets/PNMSAaircraft"
            //     style={{ color: "white" }}
            //   >
            //     Monthly Sea Hours of PNMSA Aircraft
            //   </Link>,
            //   "g143",
            //   <FiBarChart color="white" size={20} />
            // ),
            getItem(
              <Link
                href="/activitymapsandtrends/msaassets/PNMSA"
                style={{ color: "white" }}
              >
                Monthly Sea Hours of PNMSA
              </Link>,
              "g144",
              <FiBarChart color="white" size={20} />
            ),
          ]
        ),
      ],
      "group"
    ),
  ];

  const {
    token: { colorBgContainer, colorPrimary, colorHo },
  } = theme.useToken();

  return (
    <StyledSection>
      <Layout style={{ height: "auto" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="styled-sider"
          breakpoint="lg"
          width={350}
          // collapsedWidth="100"
          onBreakpoint={(broken) => {}}
          onCollapse={(collapsed, type) => {}}
        >
          <div style={{ display: "flex", padding: "10px" }} className="trigger">
            {!collapsed ? (
              <div className="logo text-white font-bold text-2xl">DADSS</div>
            ) : (
              ""
            )}
            <div style={{ marginLeft: "auto" }}>
              {collapsed ? (
                <MenuUnfoldOutlined
                  className="bg-white p-3 rounded-full"
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

          <StyledMenu
            theme="dark"
            style={{
              color: colorPrimary,
              background: "linear-gradient(25deg, #012169 40%, #0659ED 90%)",
              paddingBottom: "20px",
            }}
            className="text-white"
            mode="inline"
            items={items}
            inlineCollapsed={collapsed}
          />
          <Menu
            onClick={handleLogout}
            mode="inline"
            className="custom-css-logout text-white"
            style={{
              background: "#012169",
              paddingBottom: "20px",
            }}
          >
            {/* Conditionally render based on sidebar collapsed state */}
            {collapsed ? (
              // Only show the icon when sidebar is collapsed
              <div className="custom-logout-icon" onClick={handleLogout}>
                <img src="/images/power.png" alt="Logout Icon" />
              </div>
            ) : (
              // Show both icon and text when sidebar is expanded
              <>
                <div className="custom-logout-icon" onClick={handleLogout}>
                  <img src="/images/power.png" alt="Logout Icon" />
                </div>
                <div className="mt-5 ml-4 media-logout " onClick={handleLogout}>
                  Logout
                </div>
              </>
            )}
          </Menu>
        </Sider>
        <Layout className="mt-8" style={{ height: "auto" }}>
          <Content
            className="p-2"
            style={
              {
                // overflow: "auto",
              }
            }
          >
            {props.children}
          </Content>
          <Footer className="h-auto flex items-end">
            <div>
              Copyright <span className="font-bold">Dadss</span> ©{" "}
              {new Date().getFullYear()} All Rights Reserved
            </div>
          </Footer>
        </Layout>
      </Layout>
    </StyledSection>
  );
};
export default withAuth(Drawer);

const StyledMenu = styled(Menu)`
  &.ant-menu-light .ant-menu-item-selected {
    background-color: rgb(0, 0, 0, 0.3) !important;
  }

  &.ant-menu-dark.ant-menu-inline .ant-menu-sub.ant-menu-inline {
    background: #012169 !important;
  }
`;
const StyledSection = styled.section`
  .styled-sider {
    background: linear-gradient(25deg, #012169 60%, #0659ed 90%);
    position: sticky;
    overflow: auto;
    height: 100vh;
    left: 0;
    top: 0;
    bottom: 0;
    ::-webkit-scrollbar {
      width: 8px;
      background-color: white;
    }
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(55deg, #012169 40%, #0659ed 100%);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 3px grey;
      /* border-radius: 10px; */
    }
  }
`;
