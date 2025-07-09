import React, { useEffect, useRef, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Button, Checkbox, InputNumber, Select, Tooltip } from "antd";
import { hasPermission } from "../../src/helper/permission.js";
import PageHeaderStyled from "../../src/components/pageheader/pageHeaderStyled.js";
import AntdTableIndex from "../../src/components/table/AntdTableIndex.js";
import { MdViewList } from "react-icons/md";
import Forbidden from "../403.jsx";
import { table_type_list } from "../../src/helper/dropdown.js";
import SelectBox from "../../src/components/form/SelectBox.js";
// import Mvdataships from "../../src/components/outputtables/Mvdataships";
import COIdataships from "../../src/components/outputtables/coidataships.js";
import Mermove from "../../src/components/outputtables/Mermove";
import CargoDhowdata from "../../src/components/outputtables/cargodhowdata.js";
import Antipoaching from "../../src/components/outputtables/antipoaching.js";
import Antismuggling from "../../src/components/outputtables/antismuggling.js";
import Antinarcotics from "../../src/components/outputtables/antinarcotics.js";
import COMDESRONdata from "../../src/components/outputtables/comdesrondata.js";
import ChallanWarning from "../../src/components/outputtables/challanwarning.js";
import MobilePicketData from "../../src/components/outputtables/mobilepicket.js";
import ChallanPicket from "../../src/components/outputtables/challanpickets.js";
import TwentyThreeOperation from "../../src/components/outputtables/twentythreeoperation.js";
import COIdatanazim from "../../src/components/outputtables/coidatanazim.js";
import Mangrovescutting from "../../src/components/outputtables/mangrovescutting.js";
import Gaddanishipsboardingops from "../../src/components/outputtables/gaddanishipsboardingops.js";
import Unnamedboats from "../../src/components/outputtables/unnamedboats.js";
import CodEndObserved from "../../src/components/outputtables/codendobserved.js";
import FOChowkas from "../../src/components/outputtables/fochowkas.js";
import Comosron from "../../src/components/outputtables/comosron.js";
import PMSAFlyingHours from "../../src/components/outputtables/pmsaflyinghours.js";
import Stationaryships from "../../src/components/outputtables/Stnship.js";
import Violation from "../../src/components/outputtables/violation.js";
import Aircraft from "../../src/components/outputtables/aircraft.js";
import AircraftQueried from "../../src/components/outputtables/aircraftqueried.js";
import AuxiliaryEngine from "../../src/components/outputtables/AuxiliaryEngine.js";
import MainEngine from "../../src/components/outputtables/MainEngine.js";
import MachineryStatus from "../../src/components/outputtables/MachineryStatus.js";
import SensorPerf from "../../src/components/outputtables/SensorPerf.js";
import IndianNavyShips from "../../src/components/outputtables/IndianNavyShips.js";
import MiscActivities from "../../src/components/outputtables/MiscActivities.js";
import { Form,Radio } from "antd";
import VisFormTable from "../visform/index.jsx";
import FilterByPlatform from "../../src/components/outputtables/filterByPlatform.js"
import Lessthan10Crew from "../../src/components/outputtables/lessthan10crew.js"
// import Index from "../searchandrescue/index.jsx";
const Mvdataships = dynamic(() => import("../../src/components/outputtables/Mvdataships.js"), {
  ssr: false,
  loading: () => (
    <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
  ),
});
const SARships = dynamic(() => import("../../src/components/outputtables/searchandrescue.js"), {
  ssr: false,
  loading: () => (
    <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
  ),
});

const MedicalAssistance = dynamic(() => import("../../src/components/outputtables/medicalassistance.js"), {
  ssr: false,
  loading: () => (
    <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
  ),
});

function Index() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const [viewType, setViewType] = useState("table");
  const api_data= true;
  const [selectedOption, setSelectedOption] = useState("MV Data Ships");
  const [selectedTableComponent, setSelectedTableComponent] = useState(<Mvdataships apidata={api_data} />)
  const dispatch = useDispatch();
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = true;
  const viewPermission = true;
  const changeHeader = true;

  const handleTableChange = (e) => {
    setSelectedOption(e);
    switch (e) {
      case "MV Data Ships":
        setSelectedTableComponent(<Mvdataships
         apidata={api_data} />);
        break;
      case "COI Data Ships":
        setSelectedTableComponent(<COIdataships apidata={api_data}/>);
        break;
      case "Mermove KPT PQA GPA":
        setSelectedTableComponent(<Mermove apidata={api_data}/>);
        break;
      case "Cargo & DHOW Data":
        setSelectedTableComponent(<CargoDhowdata apidata={api_data}/>);
        break;  
      case "Anti Poaching":
        setSelectedTableComponent(<Antipoaching apidata={api_data}/>);
        break;
      case "Anti Smuggling":
        setSelectedTableComponent(<Antismuggling apidata={api_data}/>);
        break;
      case "Anti Narcotics":
        setSelectedTableComponent(<Antinarcotics apidata={api_data} viewType={viewType}/>);
        break;
      case "Filter By Platform":
        setSelectedTableComponent(<FilterByPlatform apidata={api_data}/>);
        break;
      case "COMDESRON-23":
        setSelectedTableComponent(<COMDESRONdata apidata={api_data}/>);
        break;
      case "Challan Warning Ships":
        setSelectedTableComponent(<ChallanWarning apidata={api_data}/>);
        break;
      case "Mobile Pickets Data":
        setSelectedTableComponent(<MobilePicketData/>);
        break;
      case "Challan Pickets":
        setSelectedTableComponent(<ChallanPicket />);
        break;
      case "SAR":
        setSelectedTableComponent(<SARships apidata={api_data}/>);
        break;
      case "23 Operation":
        setSelectedTableComponent(<TwentyThreeOperation/>);
        break;
      case "COI Data NAZIM":
        setSelectedTableComponent(<COIdatanazim apidata={api_data}/>);
        break;
      case "Mangroves Cutting":
        setSelectedTableComponent(<Mangrovescutting apidata={api_data}/>);
        break;
      case "Less than 10 Crew Data":
        setSelectedTableComponent(<Lessthan10Crew apidata={api_data}/>);
        break;
      case "Gaddani Ships Boarding OPs":
        setSelectedTableComponent(<Gaddanishipsboardingops apidata={api_data}/>);
        break;
      case "Unnamed Boats":
        setSelectedTableComponent(<Unnamedboats/>);
        break;
      case "Stationary Ships":
        setSelectedTableComponent(<Stationaryships/>);
        break;
      case "COD END OBSERVED":
        setSelectedTableComponent(<CodEndObserved apidata={api_data}/>);
      break;
      case "FO CHOWKAS EX":
        setSelectedTableComponent(<FOChowkas apidata={api_data}/>);
        break;
      case "COMOSRON-23":
        setSelectedTableComponent(<Comosron apidata={api_data}/>);
        break;
      case "Medical Assistance":
      setSelectedTableComponent(<MedicalAssistance />);
      break;
      case "PMSA 93 SQN Flying Hours":
        setSelectedTableComponent(<PMSAFlyingHours/>);
        break;
      case "Violation":
        setSelectedTableComponent(<Violation/>);
        break;
      case "Aircraft":
        setSelectedTableComponent(<Aircraft/>);
        break;
      case "Aircraft Queried":
        setSelectedTableComponent(<AircraftQueried/>);
        break;
      case "Auxiliary Engine":
        setSelectedTableComponent(<AuxiliaryEngine/>);
        break;
      case "Main Engine":
        setSelectedTableComponent(<MainEngine/>);
        break;
      case "Machinery Status":
        setSelectedTableComponent(<MachineryStatus/>);
        break;
      case "Sensor Performances":
        setSelectedTableComponent(<SensorPerf/>);
        break;
      case   "IN ICG Ships":
        setSelectedTableComponent(<IndianNavyShips/>);
        break;
      case "Misc. Activities":
        setSelectedTableComponent(<MiscActivities/>);
        break;        
      default:
        setSelectedTableComponent(null);
        break;
    }
  };

  const handlePageChange = (page) => {
    setViewType(page);
  };

  return (
    <>
      <div >
        <PageHeaderStyled
          title="Table Display"
          hover=""
          //placeholder="Search by Platform ID / Patrol Type"
          //onSearchChange={setSearchData}
        />
         
        <Form style={{ float: "right", marginRight: "1.5rem", top: "-2.4rem", position: "relative",}}>
          <SelectBox
            style={{ marginLeft: "1.5rem", width: 300 }}
            placeholder="Select a table"
            name="Select a table"
            options={table_type_list.map((item) => ({
              value: item,
              label: item,
            }))}
            defaultValue={"MV Data Ships"}
            // view={selectedOption}
            onChange={handleTableChange}
            rules={[
              { required: true, message: "Please select a type of table!" },
            ]}
          />
        </Form>
      </div>
      {viewPermission ? (
        <div>
          {selectedTableComponent}
        </div>
      ) : (
        <Forbidden></Forbidden>
      )}
    </>
  );
}

export default Index;
export async function getServerSideProps() {
  return {
    props: {
      data: {
        title: "Ouptut",
      },
    },
  };
}
