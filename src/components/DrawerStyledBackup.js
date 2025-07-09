import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Typography } from "antd";
import styled from "styled-components";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { FiBarChart, FiMap } from "react-icons/fi";
import { MdAnchor } from "react-icons/md";
import { AiOutlineUser, AiOutlinePieChart, AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdAppRegistration } from "react-icons/md";
import { HiOutlineDocumentDuplicate, HiOutlineDocumentReport } from "react-icons/hi";
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

    axios.defaults.headers["Authorization"] =
        "JWT " + localStorage.getItem("accessToken");

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
        label = {
            ...label,
            props: {
                ...label.props,
                style: {
                    ...label?.props?.style,
                    color: "black",
                }
            }
        }
        icon = {
            ...icon,
            props: {
                ...props,
                color: "black",
            }
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
            <Link href="/test" style={{ color: "white" }}>
                TEST
            </Link>,
            "1",
            <RxDashboard color="white" size={20} />
        ),
        getItem(
            <p style={{ color: "white" }}>Admin</p>,
            "2",
            <RiAdminLine color="white" size={20} />,
            [
                getItem(
                    <Link href="/user" style={{ color: "white" }}>
                        Users
                    </Link>,
                    "a1",
                    <AiOutlineUser style={{ color: "white" }} size={20} />
                ),
                getItem(
                    <Link href="/usergroups" style={{ color: "white" }}>
                        User Roles
                    </Link>,
                    "a2",
                    <AiOutlineUsergroupAdd style={{ color: "white" }} size={20} />
                ),
            ]),
        getItem(
            <Link href="/platformdata" style={{ color: "white" }}>
                Platform Data
            </Link>,
            "3",
            <TbDatabase color="white" size={20} />
        ),
        getItem(
            <p style={{ color: "white" }}>Reports</p>,
            "4",
            <HiOutlineDocumentDuplicate color="white" size={20} />,
            [
                getItem(
                    <Link href="/generalreport" style={{ color: "white" }}>
                        General Report
                    </Link>,
                    "r1",
                    <HiOutlineDocumentReport color="white" size={20} />
                ),
                getItem(
                    <Link href="/fishingvessel" style={{ color: "white" }}>
                        Special Report(Fishing Vessel)
                    </Link>,
                    "r2",
                    <TbDeviceDesktopAnalytics color="white" size={20} />
                ),
                getItem(
                    <Link href="/merchantvessel" style={{ color: "white" }}>
                        Special Report(Merchant Vessel)
                    </Link>,
                    "r3",
                    <TbDeviceDesktopAnalytics color="white" size={20} />
                ),
                getItem(
                    <Link href="/visform" style={{ color: "white" }}>
                        Special Report (VIS Data)
                    </Link>,
                    "r4",
                    <MdAnchor color="white" size={20} />
                ),
                getItem(
                    <Link href="/intelreport" style={{ color: "white" }}>
                        Intel Report
                    </Link>,
                    "r5",
                    <GiArtificialIntelligence color="white" size={20} />
                ),
                getItem(
                    <Link href="/missionreport" style={{ color: "white" }}>
                        Mission Report
                    </Link>,
                    "r6",
                    <TbDeviceDesktopAnalytics color="white" size={20} />
                ),
                getItem(
                    <Link href="/shipbreaking" style={{ color: "white" }}>
                        Ship Breaking Report
                    </Link>,
                    "r7",
                    <GiIronHulledWarship color="white" size={20} />
                ),
            ]
        ),
        getItem(
            <Link href="/registeredvessels" style={{ color: "white" }}>
                Registered Fishing Vessel
            </Link>,
            "5",
            <MdAppRegistration color="white" size={20} />
        ),
        getItem(
            <Link href="/registeredmerchantvessels" style={{ color: "white" }}>
                Registered Merchant Vessel
            </Link>,
            "6",
            <MdAppRegistration color="white" size={20} />
        ),
        getItem(
            <Link href="/csvfiles" style={{ color: "white" }}>
                CSV Files
            </Link>,
            "7",
            <TbDeviceDesktopAnalytics color="white" size={20} />
        ),
        getItem(
            <Link href="/merchantVesselDetails" style={{ color: "white" }}>
                Merchant Vessel
            </Link>,
            "8",
            <TbDeviceDesktopAnalytics color="white" size={20} />
        ),
        getItem(
            !collapsed ? (
                <p className="text-black font-bold" style={{ padding: "10px 5px" }}>
                    Activity Maps and Trends
                </p>
            ) : (
                ""
            ),
            "9",
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

    const headerStyle = {
        textAlign: 'center',
        height: '11vh',
        // paddingInline: 48,
        // lineHeight: '64px',
        backgroundColor: '#063970',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        // display: 'flex',
        // alignItems: 'center',
    };
    const footerStyle = {
        textAlign: 'center',
        position: 'sticky',
        height: '4vh',
        bottom: 0,
        zIndex: 1,
        width: '100%',
        color: 'black',
        backgroundColor: '#ADADAD',
        alignItems: 'center',
    };

    return (
        <StyledSection>
            <Layout style={{ minHeight: '96vh' }}>
                <Header style={headerStyle}  >
                    <div className="text-white mt-4 text-xl">PAKISTAN MARITIME SECURITY AGENCY</div>
                    <div className="text-white text-xl">DATA ANALYSIS DECISION SUPPORT SYSTEM (DADSS)</div>
                </Header>
                <Layout >
                    
                    <Sider
                        trigger={null}
                        // collapsible
                        // collapsed={collapsed}
                        className="styled-sider"
                        // style={siderStyle}
                        breakpoint="lg"
                        width={350}
                        // style={{position: 'fixed',
                        // left: 0,}}
                        // position='fixed'
                        // left= 0
                        // collapsedWidth="100"
                        // onBreakpoint={(broken) => { }}
                        // onCollapse={(collapsed, type) => { }}
                    >
                        <StyledMenu
                            // theme="dark"
                            style={{
                                color: colorPrimary,
                                // background: "linear-gradient(25deg, #012169 40%, #0659ED 90%)",
                                background: "lightgray",
                                paddingBottom: "7vh",
                            }}
                            className="text-black"
                            mode="inline"
                            items={items}
                            inlineCollapsed={collapsed}
                        />
                        <Menu mode="inline" style={{
                            height: '6vh',
                            background: "gray",
                            paddingBottom: "20px",
                            alignItems: 'center',
                            zIndex: 1,
                            position: 'fixed',
                            bottom: '4vh',
                            width: 350,
                        }}>
                            <div className="mt-3 ml-4 border-solid " onClick={handleLogout}>
                                <BsPersonCircle className="inline-flex mr-2" />
                                <Typography className="inline-flex mr-2">{localStorage.getItem('u_pf_id')}</Typography>
                                <FaPowerOff className="fill-black inline-flex justify-end ml-44" />

                            </div>
                        </Menu>
                    </Sider>
                    <Content
                        // className="p-2"
                        style={{ overflow: "auto" }} >
                        {props.children}
                    </Content>
                </Layout>

            </Layout>
            <Footer style={footerStyle} >
                <div>
                    Copyright <span className="font-bold">Dadss</span> ©{" "}
                    {new Date().getFullYear()} All Rights Reserved
                </div>
            </Footer>
        </StyledSection >
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
    height: 100vh;
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
