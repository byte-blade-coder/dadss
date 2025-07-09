import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Typography } from "antd";
import styled from "styled-components";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { FiBarChart, FiMap } from "react-icons/fi";
import { MdAnchor } from "react-icons/md";
import {
  AiOutlineUser,
  AiOutlinePieChart,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { MdAppRegistration } from "react-icons/md";
import {
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentReport,
} from "react-icons/hi";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { FaPowerOff, FaUsersGear } from "react-icons/fa";
import {
  GiFishingBoat,
  GiCargoShip,
  GiArtificialIntelligence,
  GiIronHulledWarship,
} from "react-icons/gi";
import { RiAdminLine, RiShipLine } from "react-icons/ri";
import { GoGraph } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { TbDatabase } from "react-icons/tb";
import { SlGraph } from "react-icons/sl";
import { FcHeatMap } from "react-icons/fc";
import { withAuth } from "./withAuth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import FilledButton from "./button/FilledButton";
import { BsPersonCircle } from "react-icons/bs";
// import { BiSolidReport } from "react-icons/bi";
import { HiDocumentDuplicate } from "react-icons/hi2";

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

  const router = useRouter();

function getItem(label, key, icon, children, type) {
  const labelComponent = <div style={{ color: "black" , fontWeight:"bold" }}>{label}</div>;

  const iconComponent = icon ? (
    <div style={{ color: "black" }}>{icon}</div>
  ) : null;

  return {
    key,
    icon: iconComponent,
    children,
    label: labelComponent,
    type,
  };
}


  const items = [
    getItem(
      <Link href="/dashboard" >
        Dashboard
      </Link>,
      "1",
      <RxDashboard  size={20} />
    ),
    getItem(
      <p >Admin</p>,
      "2",
      <RiAdminLine  size={20} />,
      [
        getItem(
          <Link href="/user" >
            Users
          </Link>,
          "a1",
          <AiOutlineUser  size={20} />
        ),
        getItem(
          <Link href="/usergroups" >
            User Roles
          </Link>,
          "a2",
          <AiOutlineUsergroupAdd  size={20} />
        ),
      ]
    ),
    getItem(
      <Link href="/platformdata" >
        Platform Data
      </Link>,
      "3",
      <TbDatabase  size={20} />
    ),
    getItem(
      <p >Reports</p>,
      "4",
      <HiOutlineDocumentDuplicate  size={20} />,
      [
        getItem(
          <Link href="/generalreport" >
            General Report
          </Link>,
          "r1",
          <HiOutlineDocumentReport  size={20} />
        ),
        getItem(
          <Link href="/fishingvessel" >
            Special Report(Fishing Vessel)
          </Link>,
          "r2",
          <TbDeviceDesktopAnalytics  size={20} />
        ),
        getItem(
          <Link href="/merchantvessel" >
            Special Report(Merchant Vessel)
          </Link>,
          "r3",
          <TbDeviceDesktopAnalytics  size={20} />
        ),
        getItem(
          <Link href="/visform" >
            Special Report (VIS Data)
          </Link>,
          "8",
          <MdAnchor  size={20} />
        ),
        getItem(
          <Link href="/intelreport" >
            Intel Report
          </Link>,
          "10",
          <GiArtificialIntelligence  size={20} />
        ),
        getItem(
          <Link href="/missionreport" >
            Mission Report
          </Link>,
          "11",
          <TbDeviceDesktopAnalytics  size={20} />
        ),
        getItem(
          <Link href="/shipbreaking" >
            Ship Breaking Report
          </Link>,
          "12",
          <GiIronHulledWarship  size={20} />
        ),
      ]
    ),
    getItem(
      <Link href="/registeredvessels" >
        Registered Fishing Vessel
      </Link>,
      "4",
      <MdAppRegistration  size={20} />
    ),

    getItem(
      <Link href="/registeredmerchantvessels" >
        Registered Merchant Vessel
      </Link>,
      "9",
      <MdAppRegistration  size={20} />
    ),

    getItem(
      <Link href="/csvfiles" >
        CSV Files
      </Link>,
      "13",
      <TbDeviceDesktopAnalytics  size={20} />
    ),
    getItem(
      <Link href="/merchantVesselDetails" >
        Merchant Vessel
      </Link>,
      "14",
      <TbDeviceDesktopAnalytics  size={20} />
    ),

    getItem(
      !collapsed ? (
        <p className="text-black font-bold" style={{ padding: "10px 5px" }}>
          Activity Maps and Trends
        </p>
      ) : (
        ""
      ),
      "8",
      null,
      [
        getItem(
          <p >Fishing Vessels</p>,
          "g11",
          <GiFishingBoat  size={20} />,
          [
            getItem(
              <Link
                href="/activitymapsandtrends/fishingvessels/activitytrends"
                
              >
                Activity Trends
              </Link>,
              "g112",
              <SlGraph  size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/fishingvessels/densityheatmap"
                
              >
                Density Heat Map
              </Link>,
              "g113",
              <FcHeatMap color="black"  size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/fishingvessels/enteringleavingharbour"
                
              >
                Entering Leaving Harbour
              </Link>,
              "g114",
              <FiBarChart  size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/fishingvessels/overstay"
                
              >
                Over Stay
              </Link>,
              "g115",
              <FiBarChart  size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/fishingvessels/durationatsea"
                
              >
                Duration at Sea
              </Link>,
              "g116",
              <AiOutlinePieChart  size={20} />
            ),
          ]
        ),
        getItem(
          <p >Merchant Vessel Trends</p>,
          "g12",
          <GiCargoShip  size={20} />,
          [
            getItem(
              <Link
                href="/activitymapsandtrends/merchantvesseltrends/playingthroughPAKEEZ"
                
              >
                Plying Through PAK EEZ
              </Link>,
              "g121",
              // <FiMap  size={20} />
              <AiOutlinePieChart  size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/merchantvesseltrends/visitingpakistan"
                
              >
                Visiting Pakistan
              </Link>,
              "g122",
              <FiBarChart  size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/merchantvesseltrends/overstay"
                
              >
                Over Stay
              </Link>,
              "g123",
              <AiOutlinePieChart  size={20} />
            ),
          ]
        ),
        getItem(
          <p >Anti Narcotics/Smuggling Operations</p>,
          "g13",
          <RiShipLine  size={20} />,
          [
            getItem(
              <Link
                href="/activitymapsandtrends/antinarcotics/drugoperations"
                
              >
                Contraband/Drug Confiscation
              </Link>,
              "g131",
              <FiMap  size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/antinarcotics/searchrescue"
                
              >
                Search & Rescue Operations
              </Link>,
              "g132",
              <FiMap  size={20} />
            ),
          ]
        ),
        getItem(
          <p >MSA Assets</p>,
          "g14",
          <GoGraph  size={20} />,
          [
            getItem(
              <Link
                href="/activitymapsandtrends/msaassets/routesflowmap"
                
              >
                MSA Routes Flow MAP
              </Link>,
              "g141",
              <FiMap  size={20} />
            ),
            getItem(
              <Link
                href="/activitymapsandtrends/msaassets/PNMSA"
                
              >
                Monthly Sea Hours of PNMSA
              </Link>,
              "g144",
              <FiBarChart  size={20} />
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

  const headerStyle = {
    textAlign: "center",
    height: "auto",
    padding:"10px",
    backgroundColor: "#063970",
    position: "fixed",
    width: "100%",
    zIndex: 1000, // Adjust the z-index as needed
    top: 0,
  };

  const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#063970",
  };
  const siderStyle = {
    textAlign: "center",
    lineHeight: "120px",
    color: "#fff",
    backgroundColor: "green",
  };

  return (
    <StyledSection>
      <Layout style={{ height: "auto", minHeight: "100%" }}>
        <Header style={headerStyle}>
          <div className="text-white mt-1 text-xl">
            PAKISTAN MARITIME SECURITY AGENCY
          </div>
          <div className="text-white text-xl">
            DATA ANALYSIS DECISION SUPPORT SYSTEM (DADSS)
          </div>
        </Header>
        <Layout className="" style={{ height: "auto", marginTop: "80px" }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="styled-sider "
            style={{
              overflowY: "auto",
              height:"100%",
              height: "100vh",
              // position:"sticky"
            }}
            breakpoint="lg"
            width={350}
            // collapsedWidth="100"
            onBreakpoint={(broken) => {}}
            onCollapse={(collapsed, type) => {}}
          >
            {" "}
            <div
              style={{ display: "flex", padding: "10px" }}
              className="trigger"
            >
              {!collapsed ? (
                <div className="logo text-black font-bold text-2xl">DADSS</div>
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
              // theme="dark"
              style={{
                color: colorPrimary,
                background: "lightgray",
              }}
              className="text-black"
              mode="inline"
              items={items}
              // inlineCollapsed={collapsed}
            />
            <Menu
              onClick={handleLogout}
              className=" custom-css-logout hover:bg-gray text-black"
              style={{
                position: "sticky",
                bottom: 0,
                background: "gray",
                width: "100%",
                height: "80px", // You can adjust this value to fit your needs
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {collapsed ? (
                // Only show the icon when sidebar is collapsed
                <div className="custom-logout-icon" onClick={handleLogout}>
                  <img src="/images/power.png" alt="Logout Icon" />
                </div>
              ) : (
                // Show both icon and text when sidebar is expanded
                <>
                  <div
                    // className="mt-5 ml-4 border-solid"
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <BsPersonCircle className="inline-flex mr-2" />
                    <Typography className="inline-flex mr-2">
                      {localStorage.getItem("u_pf_id")}
                    </Typography>
                    <FaPowerOff className="fill-black inline-flex justify-end ml-44" />
                  </div>
                </>
              )}
            </Menu>
          </Sider>

          <Content
            className="p-2"
            style={{
              overflow: "auto",
            }}
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
  }

  &.ant-menu-dark.ant-menu-inline .ant-menu-sub.ant-menu-inline {
    background: #012169 !important;
  }
`;

const StyledSection = styled.section`
  .styled-sider {
    background: linear-gradient(25deg, lightgray 60%, lightgray 90%);
    position: sticky;
    overflow: auto;
    height: 90vh;
    left: 0;
    top: 0;
    bottom: 0;
    ::-webkit-scrollbar {
      width: 8px;
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
`;
