import { Tooltip } from "antd";
import dayjs from "dayjs";
import { decimalToDMS } from "../../src/helper/position";

export const RegVesselColumn = [
  {
    title: "Vessel ID",
    dataIndex: "rv_id",
    key: "rv_id",
    width: 250,
    ellipsis: false,
    render: (text) => {
      return text;
    },
  },
  {
    title: "Registration ID",
    key: "rv_regno",
    dataIndex: "rv_regno",
    width: 250,
    ellipsis: false,
    render: (text) => {
      return text;
    },
  },
  {
    key: "rv_name",
    title: "Vessel Name",
    dataIndex: "rv_name",
    width: 250,
    ellipsis: false,
    render: (text) => {
      return text;
    },
  },
  {
    key: "rv_type",
    title: "Type",
    dataIndex: "rv_type",
    width: 250,
    ellipsis: false,
    render: (text) => {
      return text;
    },
  },
  {
    key: "rv_flag",
    title: "Flag",
    dataIndex: "rv_flag",
    width: 250,
    ellipsis: false,
  },
  {
    key: "rv_province",
    title: "Province",
    dataIndex: "rv_province",
    width: 250,
    ellipsis: false,
  },
];

export const MerVesselColumn = [
  {
    title: "MMSI",
    key: "mv_mmsi",
    dataIndex: "mv_mmsi",
    width: 250,
    ellipsis: false,
    // sorter: (a, b) => a.mv_mmsi.localeCompare(b.mv_mmsi),
    // filters: [{ text: names, value: names }],
    // filters: names, // Use the populated filter options here
    // sortDirections: ["descend", "ascend"],
    // filterMode: "tree",
    // filterSearch: true,
    // onFilter: (value, record) => record.mv_mmsi.includes(value),
  },
  {
    title: "IMO",
    key: "mv_imo",
    dataIndex: "mv_imo",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Ship ID",
    width: 250,
    ellipsis: false,
    dataIndex: "mv_ship_id",
    key: "mv_ship_id",
  },
  {
    title: "Ship Name",
    width: 250,
    ellipsis: false,
    key: "mv_ship_name",
    dataIndex: "mv_ship_name",
  },
  {
    title: "Flag",
    dataIndex: "mv_flag",
    width: 250,
    ellipsis: false,
    key: "mv_flag",
  },
  {
    title: "Type",
    dataIndex: "mv_type_name",
    width: 250,
    ellipsis: false,
    key: "mv_type_name",
  },
  {
    title: "AIS Type",
    key: "mv_ais_type_summary",
    dataIndex: "mv_ais_type_summary",
    width: 250,
    ellipsis: false,
  },
];
export const MerchantDetailColumns = [
  ...MerVesselColumn,
  {
    key: "mv_ship_type",
    title: "Ship Type",
    dataIndex: "mv_ship_type",
    width: 250,
    ellipsis: false,
  },
  {
    key: "mv_call_sign",
    title: "Call Sign",
    dataIndex: "mv_call_sign",
    width: 250,
    ellipsis: false,
  },

  {
    key: "mv_length",
    title: "Length",
    dataIndex: "mv_length",
    width: 250,
    ellipsis: false,
  },

  {
    key: "mv_width",
    title: "Width",
    dataIndex: "mv_width",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Gross Tonnage",
    key: "mv_grt",
    dataIndex: "mv_grt",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Dead Weight",
    dataIndex: "mv_dwt",
    key: "mv_dwt",
    width: 250,
    ellipsis: false,
  },
  {
    key: "mv_year_built",
    title: "Year built",
    dataIndex: "mv_year_built",
    width: 250,
    ellipsis: false,
  },
];

export const GeneralReportColumn = [
  {
    title: "Platform ID",
    dataIndex: "gr_pf_id",
    key: "gr_pf_id",
    width: 250,
    ellipsis: false,
  },
  {
    key: "latitude",
    title: "Latitude",
    dataIndex: "gr_position",
    width: 250,
    ellipsis: false,
    render: (text, record) => {
      if (record.gr_position) {
        var val = record.gr_position.coordinates[1];
        const latitude = decimalToDMS(val, 1);
        return latitude;
      }
    },
  },
  {
    key: "longitude",
    title: "Longitude",
    dataIndex: "gr_position",
    width: 250,
    ellipsis: false,
    render: (text, record) => {
      if (record.gr_position) {
        var val = record.gr_position.coordinates[0];
        const longitude = decimalToDMS(val, 0);
        return longitude;
      }
    },
  },
  {
    key: "gr_patroltype",
    title: "Patrol Type",
    dataIndex: "gr_patroltype",
    width: 250,
    ellipsis: false,
  },
  {
    key: "gr_fuelrem",
    title: "Fuel Remaining (%)",
    dataIndex: "gr_fuelrem",
    width: 250,
    ellipsis: false,
  },
  {
    key: "gr_dtg",
    title: "Date Time",
    dataIndex: "gr_dtg",
    width: 250,
    ellipsis: false,
    render: (text) => {
      const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      return dtg;
    },
  },
];

export const Missioncolumns = [
  {
    title: "Platform ID",
    key: "mr_pf_id",
    dataIndex: "mr_pf_id",
    ellipsis: false,
  },
  {
    title: "Date Time",
    dataIndex: "mr_dtg",
    key: "mr_dtg",
    ellipsis: false,
    render: (text) => {
      const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      return dtg;
    },
  },
  {
    title: "Registered ON",
    key: "mr_rdt",
    dataIndex: "mr_rdt",
    ellipsis: false,
    render: (text) => {
      const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      return dtg;
    },
  },
];

export const IntelColumns = [
  {
    title: "Platform ID",
    dataIndex: "ir_pf_id",
    key: "ir_pf_id",

    width: 250,
    ellipsis: false,
    render: (text) => {
      return text;
    },
  },

  {
    title: "Reporter Name",
    dataIndex: "ir_reporter_name",
    key: "ir_reporter_name",
    width: 250,
    ellipsis: false,
    render: (text, record) => {
      return text;
    },
  },
  {
    title: "Reporting Time",
    dataIndex: "ir_reporting_time",
    key: "ir_reporting_time",

    width: 250,
    ellipsis: false,
    render: (text) => {
      const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      return dtg;
    },
  },
  {
    title: "Jetty",
    key: "ir_jetty",

    dataIndex: "ir_jetty",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Boats",
    key: "ir_total_boats",

    dataIndex: "ir_total_boats",
    width: 250,
    ellipsis: false,
  },
];

export const MerchantShipColumn = [
  {
    title: "IMO",
    key: "mv_imo",

    render: (record) => record?.merchant_vessel?.mv_imo,
  },
  {
    title: "Ship Name",
    key: "mv_ship_name",

    render: (record) => record?.merchant_vessel?.mv_ship_name,
  },
  {
    title: "Flag",
    key: "mv_ship_name",

    render: (record) => record?.merchant_vessel?.mv_flag,
  },
  {
    title: "Vessel Type",
    key: "mv_ais_type_summary",

    render: (record) => record?.merchant_vessel?.mv_ais_type_summary,
  },
];
export const shipBreakColumns = [
  {
    title: "Date Time",
    dataIndex: "sb_dtg",
    key: "sb_dtg",
    ellipsis: false,
    width: 220,
    render: (text) => {
      const dtg = text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "";
      return dtg;
    },
  },
  {
    title: "IMO Verified",
    key: "sb_imo_verified",

    dataIndex: "sb_imo_verified",
    render: (value) => (value ? "Yes" : "No"),
  },

  {
    title: "LPOC",
    key: "sb_lpoc",

    dataIndex: "sb_lpoc",
  },
  {
    title: "Ex Name",
    key: "sb_ex_name",

    dataIndex: "sb_ex_name",
  },
  {
    title: "Embossed",
    key: "sb_emb_name",

    dataIndex: "sb_emb_name",
  },
];

export const basicColumns = [
  {
    title: "MMSI",
    dataIndex: "mv_mmsi",
  },
  {
    title: "IMO",
    dataIndex: "mv_imo",
  },
  {
    title: "Name",
    dataIndex: "mv_ship_name",
  },
  {
    title: "Flag",
    dataIndex: "mv_flag",
  },
  {
    title: "Type",
    dataIndex: "mv_ais_type_summary",
  },
];
