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
import { table_type_list_csv } from "../../src/helper/dropdown.js";
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
import { Form } from "antd";
// import Index from "../searchandrescue/index.jsx";
const Mvdataships = dynamic(() => import("../../src/components/outputtables/Mvdataships.js"), {
  ssr: false,
  loading: () => (
    <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
  ),
});
const SARships = dynamic(() => import("../searchandrescue/index.jsx"), {
  ssr: false,
  loading: () => (
    <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
  ),
});

function Index() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedTableComponent, setSelectedTableComponent] = useState(null)
  const dispatch = useDispatch();
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const [filteredDataSourcemvships, setFilteredDataSourcemvships] = useState(null);
  const [filteredDataSourcecoiships, setFilteredDataSourcecoiships] = useState(null);
  const [filteredDataSourcemermove, setFilteredDataSourcemermove] = useState(null);
  const [filteredDataSourcecargo, setFilteredDataSourcecargo] = useState(null);
  const [filteredDataSourcepoach, setFilteredDataSourcepoach] = useState(null);
  const [filteredDataSourcesmug, setFilteredDataSourcesmug] = useState(null);
  const [filteredDataSourcenarco, setFilteredDataSourcenarco] = useState(null);
  const [filteredDataSourcecomdesron, setFilteredDataSourcecomdesron] = useState(null);
  const [filteredDataSourcewarning, setFilteredDataSourcewarning] = useState(null);
  const [filteredDataSourcemobile, setFilteredDataSourcemobile] = useState(null);
  const [filteredDataSourcechallan, setFilteredDataSourcechallan] = useState(null);
  const [filteredDataSourcettop, setFilteredDataSourcettop] = useState(null);
  const [filteredDataSourcenazimships, setFilteredDataSourcenazimships] = useState(null);
  const [filteredDataSourcemangroves, setFilteredDataSourcemangroves] = useState(null);
  const [filteredDataSourcegaddani, setFilteredDataSourcegaddani] = useState(null);
  const [filteredDataSourceunnamed, setFilteredDataSourceunnamed] = useState(null);
  const [filteredDataSourcecodend, setFilteredDataSourcecodend] = useState(null);
  const [filteredDataSourcefochowkas, setFilteredDataSourcefochowkas] = useState(null);
  const [filteredDataSourcecomosron, setFilteredDataSourcecomosron] = useState(null);
  const [filteredDataSourcepmsafh, setFilteredDataSourcepmsafh] = useState(null);
  const componentRef = useRef();
  const addPermission = true;
  const viewPermission = true;
  const changeHeader = true;

  const handleTableChange = (e) => {
    setSelectedOption(e);
    switch (e) {
      case "MV Data Ships":
        setSelectedTableComponent(<Mvdataships 
          // filteredDataSource= {filteredDataSourcemvships} 
          // setFilteredDataSource={setFilteredDataSourcemvships}
          />);
        break;
      case "COI Data Ships":
        setSelectedTableComponent(<COIdataships 
          filteredDataSource= {filteredDataSourcecoiships} 
          setFilteredDataSource={setFilteredDataSourcecoiships}/>);
        break;
      case "Mermove KPT PQA GPA":
        setSelectedTableComponent(<Mermove 
          // filteredDataSource= {filteredDataSourcemermove} 
          // setFilteredDataSource={setFilteredDataSourcemermove} 
          />);
        break;
      case "Cargo & DHOW Data":
        setSelectedTableComponent(<CargoDhowdata 
          filteredDataSource= {filteredDataSourcecargo} 
          setFilteredDataSource={setFilteredDataSourcecargo} />);
        break;  
      case "Anti Poaching":
        setSelectedTableComponent(<Antipoaching 
          filteredDataSource= {filteredDataSourcepoach} 
          setFilteredDataSource={setFilteredDataSourcepoach} />);
        break;
      case "Anti Smuggling":
        setSelectedTableComponent(<Antismuggling
          filteredDataSource= {filteredDataSourcesmug} 
          setFilteredDataSource={setFilteredDataSourcesmug} />);
        break;
      case "Anti Narcotics":
        setSelectedTableComponent(<Antinarcotics 
          filteredDataSource= {filteredDataSourcenarco} 
          setFilteredDataSource={setFilteredDataSourcenarco} />);
        break;
      case "COMDESRON-23 Data":
        setSelectedTableComponent(<COMDESRONdata 
          filteredDataSource= {filteredDataSourcecomdesron} 
          setFilteredDataSource={setFilteredDataSourcecomdesron} />);
        break;
      case "Challan Warning Ships":
        setSelectedTableComponent(<ChallanWarning 
          filteredDataSource= {filteredDataSourcewarning} 
          setFilteredDataSource={setFilteredDataSourcewarning} />);
        break;
      case "Mobile Pickets Data":
        setSelectedTableComponent(<MobilePicketData 
          filteredDataSource= {filteredDataSourcemobile} 
          setFilteredDataSource={setFilteredDataSourcemobile} />);
        break;
      case "Challan Pickets":
        setSelectedTableComponent(<ChallanPicket 
          filteredDataSource= {filteredDataSourcechallan} 
          setFilteredDataSource={setFilteredDataSourcechallan} />);
        break;
      case "SAR":
        setSelectedTableComponent(<SARships changeHeader= {changeHeader}/>);
        break;
      case "23 Operation":
        setSelectedTableComponent(<TwentyThreeOperation 
          filteredDataSource= {filteredDataSourcettop} 
          setFilteredDataSource={setFilteredDataSourcettop} />);
        break;
      case "COI Data NAZIM":
        setSelectedTableComponent(<COIdatanazim 
          filteredDataSource= {filteredDataSourcenazimships} 
          setFilteredDataSource={setFilteredDataSourcenazimships}/>);
        break;
      case "Mangroves Cutting":
        setSelectedTableComponent(<Mangrovescutting 
          filteredDataSource= {filteredDataSourcemangroves} 
          setFilteredDataSource={setFilteredDataSourcemangroves}/>);
        break;
      case "Gaddani Ships Boarding OPs":
        setSelectedTableComponent(<Gaddanishipsboardingops
          filteredDataSource= {filteredDataSourcegaddani} 
          setFilteredDataSource={setFilteredDataSourcegaddani} />);
        break;
      case "Unnamed Boats":
        setSelectedTableComponent(<Unnamedboats
          filteredDataSource= {filteredDataSourceunnamed} 
          setFilteredDataSource={setFilteredDataSourceunnamed} />);
        break;
      case "Stationary Ships":
        setSelectedTableComponent(<Stationaryships
          filteredDataSource= {filteredDataSource} 
          setFilteredDataSource={setFilteredDataSource} />);
        break;
      case "COD END OBSERVED":
        setSelectedTableComponent(<CodEndObserved
          filteredDataSource= {filteredDataSourcecodend} 
          setFilteredDataSource={setFilteredDataSourcecodend} />);
      break;
      case "FO CHOWKAS EX":
        setSelectedTableComponent(<FOChowkas
          filteredDataSource= {filteredDataSourcefochowkas} 
          setFilteredDataSource={setFilteredDataSourcefochowkas} />);
        break;
        case "COMOSRON-23":
      setSelectedTableComponent(<Comosron
        filteredDataSource= {filteredDataSourcecomosron} 
        setFilteredDataSource={setFilteredDataSourcecomosron} />);
      break;
      case "Medical Assistance":
      setSelectedTableComponent(<SARships changeHeader= {changeHeader} />);
      break;
      case "PMSA 93 SQN Flying Hours":
        setSelectedTableComponent(<PMSAFlyingHours
          filteredDataSource= {filteredDataSourcepmsafh} 
          setFilteredDataSource={setFilteredDataSourcepmsafh} />);
        break;
      // Add cases for other table components as needed
      default:
        setSelectedTableComponent(null);
        break;
    }
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
            options={table_type_list_csv.map((item) => ({
              value: item,
              label: item,
            }))}
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
