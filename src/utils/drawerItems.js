import {
  BsFillGrid1X2Fill,
  BsFillGearFill,
  BsCaretRightFill,
} from "react-icons/bs";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { FiAlertOctagon } from "react-icons/fi";
import { HiChatAlt2 } from "react-icons/hi";
import { AiFillDatabase } from "react-icons/ai";
import { RiUserSettingsFill } from "react-icons/ri";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
export const items = [
  getItem(
    <Link href="/" className="hover:text-midnight" style={{ color: "white" }}>
      Dashboard
    </Link>,
    "1",
    <BsFillGrid1X2Fill color="white" size={20} />
  ),

  getItem(
    <Link href="/user" style={{ color: "white" }}>
      Users 
    </Link>,
    "2",
    <RiUserSettingsFill style={{ color: "white" }} size={20} />
  ),
  getItem(
    <Link href="/platformdata" style={{ color: "white" }}>
      Platform Data
    </Link>,
    "3",
    <AiFillDatabase color="white" size={20} />
  ),
  getItem(
    <Link href="/registeredvessels" style={{ color: "white" }}>
      Registered Vessel Data 
    </Link>,
    "4",
    <BsFillGearFill color="white" size={20} />
  ),
  getItem(
    <Link href="/generalreport" style={{ color: "white" }}>
      General Report
    </Link>,
    "5",
    <BsCaretRightFill color="white" size={20} />
  ),
  getItem(
    <Link href="/merchantvessel" style={{ color: "white" }}>
      Special Report(Merchant Vessel)
    </Link>,
    "6",
    <FaTrash color="white" />
  ),

  getItem(
    <Link href="/fishingvessel" style={{ color: "white" }}>
      Special Report(Fishing Vessel)
    </Link>,
    "7",
    <HiChatAlt2 color="white" size={20} />
  ),
  getItem(
    <p className="text-white font-bold" style={{ padding: "10px 5px" }}>
      Activity Maps and Trends
    </p>,
    "8",
    null,
    [
      getItem(
        <p style={{ color: "white" }}>Fishing Vessels</p>,
        "g11",
        <HiChatAlt2 color="white" size={20} />,
        [
          getItem(
            <Link
              href="/activitymapsandtrends/fishingvessels/activitytrends"
              style={{ color: "white" }}
            >
              Activity Trends
            </Link>,
            "g112",
            <FiAlertOctagon color="white" size={20} />
          ),
          getItem(
            <Link
              href="/activitymapsandtrends/fishingvessels/densityheatmap"
              style={{ color: "white" }}
            >
              Density Heat Map
            </Link>,
            "g113",
            <FiAlertOctagon color="white" size={20} />
          ),
          getItem(
            <Link
              href="/activitymapsandtrends/fishingvessels/enteringleavingharbour"
              style={{ color: "white" }}
            >
              Entering Leaving Harbour
            </Link>,
            "g114",
            <FiAlertOctagon color="white" size={20} />
          ),
          getItem(
            <Link
              href="/activitymapsandtrends/fishingvessels/overstay"
              style={{ color: "white" }}
            >
              Over Stay
            </Link>,
            "g115",
            <FiAlertOctagon color="white" size={20} />
          ),
          getItem(
            <Link
              href="/activitymapsandtrends/fishingvessels/durationatsea"
              style={{ color: "white" }}
            >
              Duration at Sea
            </Link>,
            "g116",
            <FiAlertOctagon color="white" size={20} />
          ),
        ]
      ),
      getItem(
        <p style={{ color: "white" }}>Merchant Vessel Trends</p>,
        "g12",
        <FiAlertOctagon color="white" size={20} />,
        [
          getItem(
            <Link
              href="/activitymapsandtrends/merchantvesseltrends/playingthroughPAKEEZ"
              style={{ color: "white" }}
            >
              Plying Through PAK EEZ
            </Link>,
            "g121",
            <FiAlertOctagon color="white" size={20} />
          ),
          getItem(
            <Link
              href="/activitymapsandtrends/merchantvesseltrends/visitingpakistan"
              style={{ color: "white" }}
            >
              Visiting Pakistan
            </Link>,
            "g122",
            <FiAlertOctagon color="white" size={20} />
          ),
          getItem(
            <Link
              href="/activitymapsandtrends/merchantvesseltrends/overstay"
              style={{ color: "white" }}
            >
              Over Stay
            </Link>,
            "g123",
            <FiAlertOctagon color="white" size={20} />
          ),
        ]
      ),
      getItem(
        <p style={{ color: "white" }}>Anti Narcotics/Smuggling Operations</p>,
        "g13",
        <FiAlertOctagon color="white" size={20} />,
        [
          getItem(
            <Link
              href="/activitymapsandtrends/antinarcotics/drugoperations"
              style={{ color: "white" }}
            >
              Contraband/Drug Confiscation
            </Link>,
            "g131",
            <FiAlertOctagon color="white" size={20} />
          ),
          getItem(
            <Link
              href="/activitymapsandtrends/antinarcotics/searchrescue"
              style={{ color: "white" }}
            >
              Search & Rescue Operations
            </Link>,
            "g132",
            <FiAlertOctagon color="white" size={20} />
          ),
        ]
      ),
      getItem(
        <p style={{ color: "white" }}>MSA Assets</p>,
        "g14",
        <FiAlertOctagon color="white" size={20} />,
        [
          getItem(
            <Link
              href="/activitymapsandtrends/msaassets/routesflowmap"
              style={{ color: "white" }}
            >
              MSA Routes Flow MAP
            </Link>,
            "g141",
            <FiAlertOctagon color="white" size={20} />
          ),
          getItem(
            <Link
              href="/activitymapsandtrends/msaassets/PNMSAships"
              style={{ color: "white" }}
            >
              Monthly Sea Hours of PNMSA Ships
            </Link>,
            "g142",
            <FiAlertOctagon color="white" size={20} />
          ),
          getItem(
            <Link
              href="/activitymapsandtrends/msaassets/PNMSAaircraft"
              style={{ color: "white" }}
            >
              Monthly Sea Hours of PNMSA Aircraft
            </Link>,
            "g143",
            <FiAlertOctagon color="white" size={20} />
          ),
          getItem(
            <Link
              href="/activitymapsandtrends/msaassets/PNMSA"
              style={{ color: "white" }}
            >
              Monthly Sea Hours of PNMSA Ships & Aircraft
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
