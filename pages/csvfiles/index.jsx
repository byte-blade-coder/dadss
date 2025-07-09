import React from "react";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import FilledButton from "../../src/components/button/FilledButton.js";
import { Col, Modal, Row, Table } from "antd";
import { useState } from "react";
import { coordinatesToDMS } from "../../src/helper/position.js";
import SituationTable from "../../src/components/table/SituationTable.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import LostReportTable from "../../src/components/table/LostReportTable.js";
import PnscTable from "../../src/components/table/PnscReportTable.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import AntdTable from "../../src/components/table/AntdTable.js";
import COIdataships from "../../src/components/outputtables/coidataships.js";
import COIdatanazim from "../../src/components/outputtables/coidatanazim.js";
dayjs.extend(utc);

const SituationUploadComponent = dynamic(
  () => import("../../src/components/button/SituationButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const JmisPNSCDatatUploadComponent = dynamic(
  () => import("../../src/components/button/PNSCButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const CosposUploadComponent = dynamic(
  () => import("../../src/components/button/CosposButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const JmisLostReportUploadComponent = dynamic(
  () => import("../../src/components/button/JmisLostReportButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const CoiReportUploadComponent = dynamic(
  () => import("../../src/components/button/COIDataButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const CoiNazimReportUploadComponent = dynamic(
  () => import("../../src/components/button/COINazimButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const AntiPoachingUploadComponent = dynamic(
  () => import("../../src/components/button/AntiPoachingButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const AntiSmugglingUploadComponent = dynamic(
  () => import("../../src/components/button/AntiSmugglingButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const AntiNarcoUploadComponent = dynamic(
  () => import("../../src/components/button/AntiNarcoButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const MangrovesUploadComponent = dynamic(
  () => import("../../src/components/button/MangroveCuttingBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const CodendUploadComponent = dynamic(
  () => import("../../src/components/button/CodEndBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const ComdesronUploadComponent = dynamic(
  () => import("../../src/components/button/ComdesronBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const ComosronUploadComponent = dynamic(
  () => import("../../src/components/button/ComosronBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const FochowkasUploadComponent = dynamic(
  () => import("../../src/components/button/FoChowkasBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const SARUploadComponent = dynamic(
  () => import("../../src/components/button/SARBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const MedicalAssistanceUploadComponent = dynamic(
  () => import("../../src/components/button/MedAssistBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const MermoveUploadComponent = dynamic(
  () => import("../../src/components/button/MermoveBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const MVDataShipUploadComponent = dynamic(
  () => import("../../src/components/button/MVDataBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const CargoDhowUploadComponent = dynamic(
  () => import("../../src/components/button/CargoDhowBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const UnnamedShipUploadComponent = dynamic(
  () => import("../../src/components/button/UnnamedBoatsBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const PMSAFlyingHrsUploadComponent = dynamic(
  () => import("../../src/components/button/PMSAFlyBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const GaddaniShipBreakingUploadComponent = dynamic(
  () => import("../../src/components/button/GaddaniOpsBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const StnShipDataUploadComponent = dynamic(
  () => import("../../src/components/button/StnShipBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const Op23UploadComponent = dynamic(
  () => import("../../src/components/button/Op23Btn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

const AllXlsxUploadComponent = dynamic(
  () => import("../../src/components/button/AllXLSXBtn.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    )
  }
)

function Index() {
  // State variables for modal visibility and data
  const [situationModalVisible, setSituationModalVisible] = useState(false);
  const [jmisPNSCModalVisible, setJmisPNSCModalVisible] = useState(false);
  const [jmisLostReportModalVisible, setJmisLostReportModalVisible] =  useState(false);
  const [cosposModalVisible, setCosposModalVisible] = useState(false);
  const [coiModalVisible, setCoiModalVisible] = useState(false);
  const [coiNazimModalVisible, setCoiNazimModalVisible] = useState(false);
  const [smugglingModalVisible, setSmugglingModalVisible] = useState(false);
  const [poachingModalVisible, setPoachingModalVisible] = useState(false);
  const [narcoModalVisible, setNarcoModalVisible] = useState(false);
  const [mangrovesModalVisible, setMangrovesModalVisible] = useState(false);
  const [codendModalVisible, setCodendModalVisible] = useState(false);
  const [comdesronModalVisible, setComdesronModalVisible] = useState(false);
  const [comosronModalVisible, setComosronModalVisible] = useState(false);
  const [fochowkasModalVisible, setFochowkasModalVisible] = useState(false);
  const [sarModalVisible, setSarModalVisible] = useState(false);
  const [medassistModalVisible, setMedAssistModalVisible] = useState(false);
  const [mermoveModalVisible, setMermoveModalVisible] = useState(false);
  const [cargoModalVisible, setCargoModalVisible] = useState(false);
  const [mvdataModalVisible, setMvdataModalVisible] = useState(false);
  const [allfileModalVisible, setAllfileModalVisible] = useState(false);
  const [hqModalVisible, setHqModalVisible] = useState(false);
  const [unnamedshipModalVisible, setUnnamedshipModalVisible] = useState(false);
  const [optwothreeModalVisible, setOptwothreeModalVisible] = useState(false);
  const [pmsaModalVisible, setPmsaModalVisible] = useState(false);
  const [stnshipModalVisible, setStnshipModalVisible] = useState(false);
  const [gaddaniModalVisible, setGaddaniModalVisible] = useState(false);

  const [showButtons, setShowButtons] = useState(false);
  
  // state variable for setting up the data
  const [situationData, setSituationData] = useState([]); // Add this state variable
  const [pnscReport, setPnscReport] = useState([]);
  const [lostReport, setLostReport] = useState([]); // State to store uploaded data
  const [coiReport, setCoiReport] = useState([]);
  const [coiReportNazim, setCoiNazimReport] = useState([]);
  const [smugglingReport, setSmugglingReport] = useState([]);
  const [poachingReport, setPoachingReport] = useState([]);
  const [narcoReport, setNarcoReport] = useState([]);
  const [mangrovesReport, setMangrovesReport] = useState([]);
  const [codendReport, setCodendReport] = useState([]);
  const [comdesronReport, setComdesronReport] = useState([]);
 
  // State variables for modal type and active table
  const [type, setType] = useState(); // Add this state variable
  const [activeTable, setActiveTable] = useState(null);

  // Function to handle button clicks and set the active table
  const handleButtonClick = (tableName) => {
    setActiveTable(tableName);
  };

  // Function to open a modal based on the provided type
  const openModal = (type) => {
    //  Update the type state with the provided type
    setType(type);
    const modalMap = {
      cospos: setCosposModalVisible,
      jmisLostReport: setJmisLostReportModalVisible,
      jmisPNSC: setJmisPNSCModalVisible,
      situation: setSituationModalVisible,
      coi: setCoiModalVisible,
      nazim: setCoiNazimModalVisible,
      narco: setNarcoModalVisible,
      smuggling: setSmugglingModalVisible,
      poaching: setPoachingModalVisible,     
      mangroves: setMangrovesModalVisible,
      codend: setCodendModalVisible,
      comdesron: setComdesronModalVisible,
      fochowkas: setFochowkasModalVisible,
      mermove: setMermoveModalVisible,
      mvdata: setMvdataModalVisible,
      cargo: setCargoModalVisible,
      sar: setSarModalVisible,
      med: setMedAssistModalVisible,
      all: setAllfileModalVisible,
      allhq: setHqModalVisible,
      comosron: setComosronModalVisible,
      gaddani: setGaddaniModalVisible,
      op23: setOptwothreeModalVisible,
      stnship: setStnshipModalVisible,
      unnamed: setUnnamedshipModalVisible,
      pmsa: setPmsaModalVisible,
      };
    // Call the appropriate visibility state setter based on the provided type
    modalMap[type](true);
  };

  // Function to close a modal based on the provided type
  const closeModal = (type) => {
    const modalMap = {
      cospos: setCosposModalVisible,
      jmisLostReport: setJmisLostReportModalVisible,
      jmisPNSC: setJmisPNSCModalVisible,
      situation: setSituationModalVisible,
      coi: setCoiModalVisible,
      nazim: setCoiNazimModalVisible,
      narco: setNarcoModalVisible,
      smuggling: setSmugglingModalVisible,
      poaching: setPoachingModalVisible,
      mangroves: setMangrovesModalVisible,
      codend: setCodendModalVisible,
      comdesron: setComdesronModalVisible,
      comosron: setComosronModalVisible,
      fochowkas: setFochowkasModalVisible,
      mermove: setMermoveModalVisible,
      mvdata: setMvdataModalVisible,
      cargo: setCargoModalVisible,
      sar: setSarModalVisible,
      med: setMedAssistModalVisible,
      all: setAllfileModalVisible,
      allhq: setHqModalVisible,
      gaddani: setGaddaniModalVisible,
      op23: setOptwothreeModalVisible,
      stnship: setStnshipModalVisible,
      unnamed: setUnnamedshipModalVisible,
      pmsa: setPmsaModalVisible,
    };
    modalMap[type](false);
  };

  // Function to handle loaded data and update state variables
  const onDataLoad = (loadedData, type) => {
    let updatedData = [];
    switch (type) {
      case "jmisLostReport":
        // Process and update lost report data
        updatedData = loadedData.map((item) => {
          if (item.lr_position && item.lr_position.coordinates) {
            // Destructure longitude and latitude from lr_position.coordinates
            const [longitude, latitude] = item.lr_position.coordinates;
            // Convert coordinates to DMS (Degrees, Minutes, Seconds)
            const updatedLongitude = coordinatesToDMS([longitude], 0);
            const updatedLatitude = coordinatesToDMS([latitude], 1);
            // Create updated position object with DMS coordinates
            const updatedPosition = {
              ...item.lr_position,
              dms: [updatedLongitude, updatedLatitude],
            };
            // Function to parse date fields
            // Parse the date using dayjs if the field exists, otherwise return null
            const parseDateField = (fieldName) => {
              const inputValue = item[fieldName];
              return inputValue ? dayjs(inputValue) : null;
            };
            const parsedReportingDate = parseDateField("lr_reporting_date");
            const parsedCreatedOnDate = parseDateField("lr_created_on");
            // Return the item with updated position and parsed dates
            return {
              ...item,
              lr_position: updatedPosition,
              lr_reporting_date: parsedReportingDate,
              lr_created_on: parsedCreatedOnDate,
            };
          }

          return { item };
        });
        // Set the state with the updated lost report data
        setLostReport(updatedData);
        break;
      case "jmisPNSC":
        // Process and update pnsc report data
        updatedData = loadedData.map((item) => {
          if (item.ps_position && item.ps_position.coordinates) {
            const [longitude, latitude] = item.ps_position.coordinates;

            const updatedLongitude = coordinatesToDMS([longitude], 0);
            const updatedLatitude = coordinatesToDMS([latitude], 1);
            const updatedPosition = {
              ...item.ps_position,
              dms: [updatedLongitude, updatedLatitude],
            };
            const parseDateField = (fieldName) => {
              const inputValue = item[fieldName];
              return inputValue ? dayjs(inputValue) : null;
            };

            const parsedDatetimestamp = parseDateField("ps_timestamp");
            const parsedDateAssignedTimed = parseDateField(
              "ps_status_symbol_assigned_time"
            );

            return {
              ...item,
              ps_position: updatedPosition,
              ps_timestamp: parsedDatetimestamp,
              ps_status_symbol_assigned_time: parsedDateAssignedTimed,
            };
          }

          return { item };
        });
        setPnscReport(updatedData);
        break;
      case "situation":
        // Process and update situation report data

        updatedData = loadedData.map((item) => {
          if (item.sit_position && item.sit_position.coordinates) {
            const [longitude, latitude] = item.sit_position.coordinates;

            const updatedLongitude = coordinatesToDMS([longitude], 0);
            const updatedLatitude = coordinatesToDMS([latitude], 1);
            const updatedPosition = {
              ...item.sit_position,
              dms: [updatedLongitude, updatedLatitude],
            };
            const parseDateField = (fieldName) => {
              const inputValue = item[fieldName];
              return inputValue ? dayjs(inputValue) : null;
            };
            const parsedDtg = parseDateField("sit_dtg");

            return {
              ...item,
              sit_position: updatedPosition,
              sit_dtg: parsedDtg,
            };
          }

          return { item };
        });
        setSituationData(updatedData);
        break;
      case "coi":
        // Process and update situation report data
        console.log("COI loaded data: ", loadedData)
        // updatedData = loadedData.map((item) => {
        //   if (item.coi_position && item.coi_position.coordinates) {
        //     const [longitude, latitude] = item.coi_position.coordinates;

        //     const updatedLongitude = coordinatesToDMS([longitude], 0);
        //     const updatedLatitude = coordinatesToDMS([latitude], 1);
        //     const updatedPosition = {
        //       ...item.coi_position,
        //       dms: [updatedLongitude, updatedLatitude],
        //     };
        //     const parseDateField = (fieldName) => {
        //       const inputValue = item[fieldName];
        //       return inputValue ? dayjs(inputValue) : null;
        //     };
        //     const parsedDtg = parseDateField("coi_dtg");

        //     return {
        //       ...item,
        //       coi_position: updatedPosition,
        //       coi_dtg: parsedDtg,
        //     };
        //   }

        //   return { item };
        // });
        // setCoiReport(updatedData);
        break;
      case "nazim":
        // Process and update situation report data
        console.log("COInazim loaded data: ", loadedData)
        // updatedData = loadedData.map((item) => {
        //   if (item.coi_position) {
        //     const parseDateField = (fieldName) => {
        //       const inputValue = item[fieldName];
        //       return inputValue ? dayjs(inputValue) : null;
        //     };
        //     const parsedDtg = parseDateField("coi_dtg");

        //     return {
        //       ...item,
        //       coi_dtg: parsedDtg,
        //     };
        //   }

        //   return { item };
        // });
        // setCoiNazimReport(updatedData);
        break;  
      case "smuggling":
        // Process and update situation report data
        // updatedData = loadedData.map((item) => {
        //   if (item) {
        //     const parseDateField = (fieldName) => {
        //       const inputValue = item[fieldName];
        //       return inputValue ? dayjs(inputValue) : null;
        //     };
        //     const parsedDtg = parseDateField("coi_dtg");

        //     return {
        //       ...item,
        //       coi_dtg: parsedDtg,
        //     };
        //   }

        //   return { item };
        // });
        // setSmugglingReport(updatedData);
        break;  
      case "poaching":
        // Process and update situation report data
        console.log("poaching loaded data: ", loadedData)
        // updatedData = loadedData.map((item) => {
        //   if (item) {
        //     const parseDateField = (fieldName) => {
        //       const inputValue = item[fieldName];
        //       return inputValue ? dayjs(inputValue) : null;
        //     };
        //     const parsedDtg = parseDateField("coi_dtg");

        //     return {
        //       ...item,
        //       coi_dtg: parsedDtg,
        //     };
        //   }

        //   return { item };
        // });
        //setPoachingReport(updatedData);
        break;  
      case "narco":
        // Process and update situation report data
        console.log("narco loaded data: ", loadedData)
        // updatedData = loadedData.map((item) => {
        //   if (item) {
        //     const parseDateField = (fieldName) => {
        //       const inputValue = item[fieldName];
        //       return inputValue ? dayjs(inputValue) : null;
        //     };
        //     const parsedDtg = parseDateField("coi_dtg");

        //     return {
        //       ...item,
        //       coi_dtg: parsedDtg,
        //     };
        //   }

        //   return { item };
        // });
        // setNarcoReport(updatedData);
        break;           
      case "mangroves":
        // Process and update situation report data
        console.log("mangroves loaded data: ", loadedData)
        // updatedData = loadedData.map((item) => {
        //   if (item) {
        //     const parseDateField = (fieldName) => {
        //       const inputValue = item[fieldName];
        //       return inputValue ? dayjs(inputValue) : null;
        //     };
        //     const parsedDtg = parseDateField("coi_dtg");

        //     return {
        //       ...item,
        //       coi_dtg: parsedDtg,
        //     };
        //   }

        //   return { item };
        // });
        // setMangrovesReport(updatedData);
        break;  
      case "codend":
        // Process and update situation report data
        console.log("codend loaded data: ", loadedData)
        // updatedData = loadedData.map((item) => {
        //   if (item) {
        //     const parseDateField = (fieldName) => {
        //       const inputValue = item[fieldName];
        //       return inputValue ? dayjs(inputValue) : null;
        //     };
        //     const parsedDtg = parseDateField("coi_dtg");

        //     return {
        //       ...item,
        //       coi_dtg: parsedDtg,
        //     };
        //   }

        //   return { item };
        // });
        // setMangrovesReport(updatedData);
        break;  
      case "comdesron":
        // Process and update situation report data
        console.log("comdesron loaded data: ", loadedData)
        // updatedData = loadedData.map((item) => {
        //   if (item) {
        //     const parseDateField = (fieldName) => {
        //       const inputValue = item[fieldName];
        //       return inputValue ? dayjs(inputValue) : null;
        //     };
        //     const parsedDtg = parseDateField("coi_dtg");

        //     return {
        //       ...item,
        //       coi_dtg: parsedDtg,
        //     };
        //   }

        //   return { item };
        // });
        // setMangrovesReport(updatedData);
        break;  
      default:
        break;
    }
  };

  return (
    <>
      <div>
        <PageHeader
          title="CSV Upload"
          showSearchBox={false}
          showButton={false} // Pass true to show the button or false to hide it
        />
      </div>

      <Row className="flex justify-start items-center ">
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => openModal("cospos")}
              text="Cospos Report"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Cospos Data"
              visible={cosposModalVisible} // Update this line
              onCancel={() => closeModal("cospos")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <CosposUploadComponent />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("jmisPNSC");
                handleButtonClick("jmisPNSC");
              }}
              text="PNSC Report"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="JMIS PNSC "
              visible={jmisPNSCModalVisible} // Update this line
              onCancel={() => closeModal("jmisPNSC")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <JmisPNSCDatatUploadComponent
                onDataLoad={(data) => onDataLoad(data, "jmisPNSC")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("jmisLostReport");
                handleButtonClick("jmisLostReport");
              }}
              text="Lost Report"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Lost Report"
              visible={jmisLostReportModalVisible} // Update this line
              onCancel={() => closeModal("jmisLostReport")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
              l
            >
              <JmisLostReportUploadComponent
                onDataLoad={(data) => onDataLoad(data, "jmisLostReport")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("situation");
                handleButtonClick("situation");
              }}
              text="Situation Report"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Situation Report"
              visible={situationModalVisible} // Update this line
              onCancel={() => closeModal("situation")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <SituationUploadComponent
                onDataLoad={(data) => onDataLoad(data, "situation")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("mvdata");
                handleButtonClick("mvdata");
              }}
              text="MV Data Ships"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload MV Data Ships Report"
              visible={mvdataModalVisible} // Update this line
              onCancel={() => closeModal("mvdata")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
              l
            >
              <MVDataShipUploadComponent
                onDataLoad={(data) => onDataLoad(data, "mvdata")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("mermove");
                handleButtonClick("mermove");
              }}
              text="Mermove Data"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Mer Move KPT PQA GPA Data"
              visible={mermoveModalVisible} // Update this line
              onCancel={() => closeModal("mermove")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <MermoveUploadComponent
                onDataLoad={(data) => onDataLoad(data, "mermove")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("cargo");
                handleButtonClick("cargo");
              }}
              text="Cargo & DHOW Data"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Cargo & DHOW Data"
              visible={cargoModalVisible} // Update this line
              onCancel={() => closeModal("cargo")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <CargoDhowUploadComponent
                onDataLoad={(data) => onDataLoad(data, "cargo")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("sar");
                handleButtonClick("sar");
              }}
              text="SAR"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload SAR Report"
              visible={sarModalVisible} // Update this line
              onCancel={() => closeModal("sar")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
              l
            >
              <SARUploadComponent
                onDataLoad={(data) => onDataLoad(data, "sar")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("med");
                handleButtonClick("med");
              }}
              text="Medical Assistance"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Medical Assistance Data"
              visible={medassistModalVisible} // Update this line
              onCancel={() => closeModal("med")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <MedicalAssistanceUploadComponent
                onDataLoad={(data) => onDataLoad(data, "med")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("coi");
                handleButtonClick("coi");
              }}
              text="COI Data Ships"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload COI Data Ships Report"
              visible={coiModalVisible} // Update this line
              onCancel={() => closeModal("coi")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <CoiReportUploadComponent
                onDataLoad={(data) => onDataLoad(data, "coi")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("nazim");
                handleButtonClick("nazim");
              }}
              text="COI Data Nazim"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload COI Data Nazim Report"
              visible={coiNazimModalVisible} // Update this line
              onCancel={() => closeModal("nazim")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <CoiNazimReportUploadComponent
                onDataLoad={(data) => onDataLoad(data, "nazim")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("smuggling");
                handleButtonClick("smuggling");
              }}
              text="Anti-Smuggling"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Anti-Smuggling Report"
              visible={smugglingModalVisible} // Update this line
              onCancel={() => closeModal("smuggling")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <AntiSmugglingUploadComponent
                onDataLoad={(data) => onDataLoad(data, "smuggling")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("poaching");
                handleButtonClick("poaching");
              }}
              text="Anti-Poaching"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Anti-Poaching Report"
              visible={poachingModalVisible} // Update this line
              onCancel={() => closeModal("poaching")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <AntiPoachingUploadComponent
                onDataLoad={(data) => onDataLoad(data, "poaching")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("narco");
                handleButtonClick("narco");
              }}
              text="Anti-Narcotics"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Anti-Narcotics Report"
              visible={narcoModalVisible} // Update this line
              onCancel={() => closeModal("narco")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <AntiNarcoUploadComponent
                onDataLoad={(data) => onDataLoad(data, "narco")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("mangroves");
                handleButtonClick("mangroves");
              }}
              text="Mangroves Cutting"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Mangroves Cutting Report"
              visible={mangrovesModalVisible} // Update this line
              onCancel={() => closeModal("mangroves")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <MangrovesUploadComponent
                onDataLoad={(data) => onDataLoad(data, "mangroves")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("codend");
                handleButtonClick("codend");
              }}
              text="COD END Observed"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload COD END Observed"
              visible={codendModalVisible} // Update this line
              onCancel={() => closeModal("codend")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <CodendUploadComponent
                onDataLoad={(data) => onDataLoad(data, "codend")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("comdesron");
                handleButtonClick("comdesron");
              }}
              text="COMDESRON"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload COMDESRON Report"
              visible={comdesronModalVisible} // Update this line
              onCancel={() => closeModal("comdesron")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <ComdesronUploadComponent
                onDataLoad={(data) => onDataLoad(data, "comdesron")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("comosron");
                handleButtonClick("comosron");
              }}
              text="COMOSRON"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload COMOSRON Report"
              visible={comosronModalVisible} // Update this line
              onCancel={() => closeModal("comosron")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <ComosronUploadComponent
                onDataLoad={(data) => onDataLoad(data, "comosron")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("fochowkas");
                handleButtonClick("fochowkas");
              }}
              text="FO-CHOWKAS"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload FO-CHOWKAS Report"
              visible={fochowkasModalVisible} // Update this line
              onCancel={() => closeModal("fochowkas")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <FochowkasUploadComponent
                onDataLoad={(data) => onDataLoad(data, "fochowkas")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("op23");
                handleButtonClick("op23");
              }}
              text="23 Operation"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload 23 Operation Report"
              visible={optwothreeModalVisible} // Update this line
              onCancel={() => closeModal("op23")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <Op23UploadComponent
                onDataLoad={(data) => onDataLoad(data, "op23")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("gaddani");
                handleButtonClick("gaddani");
              }}
              text="Gaddani Ship Boarding Ops"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Gaddani Ship Boarding Ops Report"
              visible={gaddaniModalVisible} // Update this line
              onCancel={() => closeModal("gaddani")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <GaddaniShipBreakingUploadComponent
                onDataLoad={(data) => onDataLoad(data, "gaddani")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("unnamed");
                handleButtonClick("unnamed");
              }}
              text="Unnamed Boats"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Unnamed Boats Data"
              visible={unnamedshipModalVisible} // Update this line
              onCancel={() => closeModal("unnamed")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <UnnamedShipUploadComponent
                onDataLoad={(data) => onDataLoad(data, "unnamed")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("stnship");
                handleButtonClick("stnship");
              }}
              text="Stationary Ship"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload Stationary Ship Data"
              visible={stnshipModalVisible} // Update this line
              onCancel={() => closeModal("stnship")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <StnShipDataUploadComponent
                onDataLoad={(data) => onDataLoad(data, "stnship")}
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("pmsa");
                handleButtonClick("pmsa");
              }}
              text="PMSA 93 SQN Flying Hours"
              className="border-midnight bg-midnight text-white m-2 w-10/12"
            />
            <Modal
              title="Upload PMSA 93 SQN Flying Hours Report"
              visible={pmsaModalVisible} // Update this line
              onCancel={() => closeModal("pmsa")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <PMSAFlyingHrsUploadComponent
                onDataLoad={(data) => onDataLoad(data, "pmsa")}
              />
            </Modal>
          </div>
        </Col>      
      </Row>
      <Row className="flex justify-start mt-3">
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("allhq");
                handleButtonClick("allhq");
              }}
              text="Headquarter Data"
              //style={{color: "1px solid black"}}
              className="border-gray bg-gray text-black font-medium m-2 w-10/12"
            />
            <Modal
              title="Upload HQ Report Data"
              visible={hqModalVisible} // Update this line
              onCancel={() => closeModal("allhq")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <AllXlsxUploadComponent
                onDataLoad={(data) => onDataLoad(data, "allhq")}
                type="hq"
              />
            </Modal>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div className="text-center">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("all");
                handleButtonClick("all");
              }}
              text="Ship Data"
              // style={{backgroundColor: "gray", border: "gray"}}
              className="border-gray bg-gray text-black font-medium m-2 w-10/12"
            />
            <Modal
              title="Upload Mission Report Data"
              visible={allfileModalVisible} // Update this line
              onCancel={() => closeModal("all")} // Pass the correct type to closeModal
              footer={null}
              centered={true}
              width={"auto"}
            >
              <AllXlsxUploadComponent
                onDataLoad={(data) => onDataLoad(data, "all")}
                type="ship"
              />
            </Modal>
          </div>
        </Col>
      </Row>

      {/* Render the active table based on the state */}
      {activeTable === "situation" && (
        <SituationTable
          situationData={situationData}
          setSituationData={setSituationData}
        />
      )}
      {activeTable === "jmisLostReport" && (
        <LostReportTable
          lostReport={lostReport}
          setLostReport={setLostReport}
        />
      )}
      {activeTable === "jmisPNSC" && (
        <PnscTable pnscReport={pnscReport} setPnscReport={setPnscReport} />
      )}
      {/* {activeTable === "coi" && (
        <COIdataships coiReport={coiReport} setCoiReport={setCoiReport} />
      )} */}
      {/* {activeTable === null && (
        <AntdTable className="mt-5" data={[]} columns={[]} pagination={false} />
      )} */}
    </>
  );
}

export default Index;
