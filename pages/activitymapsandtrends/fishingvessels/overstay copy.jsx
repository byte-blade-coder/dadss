import React, { useState, useEffect , useRef} from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row, Select, Button, Tooltip } from "antd";
import { DatePicker } from "antd";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import exportAsImage from "../../../src/utils/exportAsImg";
import { harbor_list, type_list,fishing_vessel_types } from "../../../src/helper/dropdown";
import {generateColors} from "../../../src/helper/colorPalette";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { RxReset } from "react-icons/rx";
import { resetUserControls } from "../../../src/utils/resetUserControl";
const { RangePicker } = DatePicker;


const StackBar = dynamic(
  () => import("../../../src/components/barchart/stackbar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const DemoColumn = dynamic(
  () => import("../../../src/components/barchart/BasicBar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const PieChart = dynamic(
  () => import("../../../src/components/piechart/PieChart3D"),

  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function OverStay() {
  const [apiFilter, setApiFilter] = useState("");
  //State to set categpry/x-axis value
  const [category, setCategory] = useState(null);
  //State to set chart or graph type
  const [visual, setVisual] = useState(null);
  //State to set harbor
  const [apiHarbor, setApiHarbor] = useState([]);
  //State to set api query parameter
  const [vesselType, setVesselType] = useState([]);
  // State to control loading state
  const [loading, setLoading] = useState(false);
  // State to store error message, if any
  const [error, setError] = useState(null);
  // State to store filtered data
  const [filteredData, setFilteredData] = useState([]);
  // State to manage date range for the DatePicker
  // const [dateRange, setDateRange] = useState([
  //   dayjs().subtract(12, "month"), // Initial start date: 12 months ago from today
  //   dayjs(), // Initial end date: today
  // ]);
  const [dateRange, setDateRange] = useState([
    dayjs('2022-01-01'), 
    dayjs('2022-06-31'), 
  ]);
  // State to manage bar group representation
  const [isGroup, setIsGroup] = useState(false);
  // State to manage time period category
  const [timePeriod, setTimePeriod] = useState(null);
 // State to manage grouping option
  const [currentGroup, setCurrentGroup] = useState(null)
  // State to manage subtitles for different charts
  const [subTitle, setSubTitle] = useState("")
  //state to support clear/default functionality
  const [isResetting, setIsResetting] = useState(false);
  const exportRef = useRef();

  // Fetch data whenever the dateRange changes
  useEffect(() => {  
    if(dateRange && category && currentGroup && apiFilter)
    { 
      //apiHarbor || vesselType
      if((category==="time" && timePeriod) || (category!=="time"))
      {
        setLoading(true)
        fetchData();
      }
    }
  }, [dateRange, apiFilter, apiHarbor, vesselType, timePeriod ]);

//currentGroup
  useEffect(() => {
    // Reset harbor, vessel type and group_by values whenever apiFilter and/or visual changes
    setApiHarbor([]);
    setVesselType([]);
    // only if Reset is not true
    if (!isResetting) {
      setCurrentGroup(null);
      // if(category==="time")
      setTimePeriod(null);
    }
  }, [category, visual]);

  useEffect(() => {
    // Reset time period whenever apiFilter, visual, currentGroup changes
    // set subtitles
    let subtitle="";
    if(visual==="bar")
    {
      if(apiFilter==="harbor")
      {
        subtitle="";
        setSubTitle(subtitle);
      }
      else if(apiFilter==="type")
      {
        subtitle="";
        setSubTitle(subtitle);
      }
      else
      {
        setSubTitle("Setting default subtitle");
      }
      // else if(apiFilter==="harbor and type")
      // {
      //   subtitle="";
      //   setSubTitle(subtitle);
      // }
    }
}, [visual, category, currentGroup]);

  useEffect(() => {
    // Reset data whenever apiFilter, visual, currentGroup, timePeriod changes
    setFilteredData([]);
  }, [apiFilter, visual, category, currentGroup, timePeriod]);

  useEffect(() => {
    let filter;
    if (category==="harbor") {

      if(currentGroup==="type")
      {
        filter = "harbor and type";
        setIsGroup(true);
      }
      else if(currentGroup==="none")
      {
        filter = "harbor";
        setIsGroup(false);
      }
      else if(currentGroup==="time")
      {
        filter = "harbor";
        setIsGroup(true);
      }
      else{
        filter = "harbor";
        setIsGroup(false);
      }
    }
    else if (category==="type") {

      if(currentGroup==="harbor")
      {
        filter = "harbor and type";
        setIsGroup(true);
      }
      else if(currentGroup==="none")
      {
        filter = "type";
        setIsGroup(false);
      }
      else if(currentGroup==="time")
      {
        filter = "type";
        setIsGroup(true);
      }
      else{
        console.log(`Error: For ${category} category, wrong group type: ${currentGroup}`)
        filter = "type";
        setIsGroup(false);
      }
    }
    else if (category==="time")
    {
      if(currentGroup==="none")
      {
        filter = "all";
        setIsGroup(false);
      }
      else if(currentGroup==="type")
      {
        filter = "type";
        setIsGroup(true);
      }
      else if(currentGroup==="harbor")
      {
        filter = "harbor";
        setIsGroup(true);
      }
      else{
        console.log(`Error: For ${category} category, wrong group type: ${currentGroup}`)
      }
    }
    else{
      console.log("Wrong category")
    }
    setApiFilter(filter);
  }, [currentGroup]);

  const handleGroupByChange =(group) => {
    setFilteredData([]);
    // if(group==="none")
    // {
    //   // setFilteredData([]);
    //   setCurrentGroup(group);
    //   // setTimePeriod("month");
    //   setIsGroup(false);  
    // }
    // // else if(group==="harbor and type")
    // // {
    // //   setTimePeriod("month");
    // //   setIsGroup(true); 
    // //   setApiFilter(group)
    // //   setTimeout(() => {
    // //     setCurrentGroup(group);
    // //   }, 1000);
    // // }
    // else{
    //   setTimeout(() => {
    //     setCurrentGroup(group);
    //   }, 1000);
    //   // setTimePeriod("month");
    //   setIsGroup(true);  
    // }
    if(category!=="time")
    {
      setTimePeriod("month");
    }
    else
    {
      setTimePeriod(null)
    }
    if(group==="none")
    {
      setCurrentGroup(group);
      setIsGroup(false);  
    }
    else
    {
      setCurrentGroup(group);
      setIsGroup(true);  
    }
    setVesselType([])
    setApiHarbor([])
    
  }

  const handleChartChange = (value) => {
    setVisual(value);
    // Reset the apiFilter based on the visual type
    if (value === "bar") {
      setFilteredData([]);
      // setApiFilter("harbor");
      // setApiHarbor([]);
      // setTimePeriod("month")
    }
    else if (value === "pie") {
      setFilteredData([]);
      // setApiFilter("harbor");
      // setApiHarbor([]);
      // setTimePeriod("month")
    }
    
  }

  const handleVesselTypeChange = (value) => {
    if(value.includes('View All'))
    {
      setVesselType([]);
    }
    else
    {  
      setVesselType(value);
    }
  }

  const handleHarborChange = (value) => {
    if(value.includes('View All'))
    {
      setApiHarbor([]);
    }
    else
    {
      setApiHarbor(value);
    }
  }

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleTimeChange = (value) => {
    setTimePeriod(value)
  }

  const fetchData = async () => {
    // Function to fetch data from the API based on the selected date range
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    let queryString = "";
    
    if(apiFilter)
    {
      if (apiFilter.includes("harbor") && apiFilter.includes("type")) {
        queryString = `harbor=${apiHarbor}&&type=${vesselType}`
      } else if (apiFilter.includes("harbor")) {
        queryString = `harbor=${apiHarbor}&&group_by=${timePeriod}`
      } else if (apiFilter.includes("type")) {
        queryString = `type=${vesselType}&&group_by=${timePeriod}`
      }
      else if (apiFilter.includes("all")) {
        queryString = `group_by=${timePeriod}`
      }
  
      try {
       
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing_visual_overstay?date_from=${dateFrom}&&date_to=${dateTo}&&filter=${apiFilter}&&${queryString}`
        );
        if (!response.ok) {
          throw new Error("API request failed");
        }
        const data = await response.json();
        if(visual && category && currentGroup && visual.includes("bar") && apiFilter!== "harbor and type" )
        {
          const transformedData = data.flatMap((item) => {
             const { Month, Year, Date, Week_Start, Week_End, ...rest } = item;
             // const startDate = item["Week Start"];
             // const endDate = item["Week End"];
   
             if((category==="harbor" || category==="type") && currentGroup==="time")
             {  
               return Object.entries(rest).map(([date, value]) => (
                 {
                   //name: date, // Use the port name as the "name"
                   name: `${Month} ${Year}`,
                   date: date, // Combine start and end dates as the "date"
                   value: value, // Use the count value as the "value"
               }));
             }
             else if(category==="time")
             {    // && (currentGroup==="type" || currentGroup==="harbor")
               return Object.entries(rest).map(([name, value]) => {
                 const entry = {
                   name,
                   value,
                 };
   
                 if (Date !== undefined) {
                   entry.date = `${Date} ${Month} ${Year}`;
                 }
                 else if(Week_Start !==undefined){
                   entry.date = `${Week_Start} - ${Week_End}`;
                 }
                 else{
                   entry.date = `${Month} ${Year}`;
                 }
           
                 return entry;
                 });
             }
             else if((category==="harbor" || category==="type") && currentGroup==="none")
             { 
               const total = {};
               data.forEach((entry) => {
                 Object.entries(entry).forEach(([key, value]) => {
                   if (key !== "Year" && key !== "Month" && key !== "Date" && key !== "Week_Start" && key !== "Week_End") {
                     if (!total[key]) {
                       total[key] = 0;
                     }
                     total[key] += value;
                   }
                 });
               });
   
               return Object.entries(total).map(([name, value]) => ({
                 name: name,
                 date: name,
                 value: value,
               }));
             }
           });
           console.log("transformedData", transformedData)
           
          // if(currentGroup==="none")
          // {
          //   setTimeout(() => {
          //     setFilteredData(transformedData);
          //   }, 2000);
          // }
          // else{
          //   setFilteredData(transformedData);
          // }
          setFilteredData(transformedData);
        }
        // else if(visual.includes("bar") && apiFilter.includes("harbor and type"))
        // { 
        //   const transformData = (data) => {
        //     const allLabelsSet = new Set();
        //     const datasetsMap = {};
          
        //     data.forEach((item) => {
        //       const { Month, Year, ...portsData } = item; // Extract the year, month, and the rest
          
        //       Object.entries(portsData).forEach(([portName, portData]) => {
        //         allLabelsSet.add(portName);
          
        //         Object.entries(portData).forEach(([category, value]) => {
        //           const arrivalKey = `${category} Arrival`;
        //           const departureKey = `${category} Departure`;
          
        //           if (!datasetsMap[arrivalKey]) {
        //             datasetsMap[arrivalKey] = {
        //               label: arrivalKey,
        //               data: {},
        //               backgroundColor: green_shades_list[0],
        //               stack: category,
        //             };
        //           }
          
        //           if (!datasetsMap[departureKey]) {
        //             datasetsMap[departureKey] = {
        //               label: departureKey,
        //               data: {},
        //               backgroundColor: blue_shades_list[0],
        //               stack: category,
        //             };
        //           }
          
        //           datasetsMap[arrivalKey].data[portName] = (datasetsMap[arrivalKey].data[portName] || 0) + value.arrival;
        //           datasetsMap[departureKey].data[portName] = (datasetsMap[departureKey].data[portName] || 0) + value.departure;
        //         });
        //       });
        //     });
          
        //     const labels = Array.from(allLabelsSet);
        //     const datasets = Object.values(datasetsMap).map(dataset => ({
        //       ...dataset,
        //       data: labels.map(label => dataset.data[label] || 0),
        //     }));
          
        //     return { labels, datasets };
        //   };
          
        //   // Usage
        //   const transformedData = transformData(data);
        //   setFilteredData(transformedData);        
          
        // }
        else if(visual.includes("pie"))
        {
          const formatDataForPieChart = (data) => {
            const aggregatedData = data.reduce((acc, item) => {
              Object.entries(item).forEach(([key, value]) => {
                if (key !== "Year" && key !== "Month") {
                  if (!acc[key]) {
                    acc[key] = 0;
                  }
                  acc[key] += value;
                }
              });
              return acc;
            }, {});
    
            return Object.entries(aggregatedData).map(([port, value]) => ({
              Port: port,
              "No of vessels":value,
            }));
          };
          const pieChartData = formatDataForPieChart(data);
          setFilteredData(pieChartData);
        }
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        setError(error.message); // Set error state if data fetching fails
        console.log(error)
        if (error.message) {
          showToastError(`Error : ${error.message}.`);
        }
      }
    }
    else{
      showToastError(`Set API Filter`);
    }
  };

  const handleResetDefaultClick = (task) => {
    setIsResetting(true);  // Disable useEffect while resetting

    resetUserControls({
      setApiFilter,
      setCategory,
      setVisual,
      setApiHarbor,
      setVesselType,
      setFilteredData,
      setDateRange,
      setIsGroup,
      setTimePeriod,
      setCurrentGroup,
      setSubTitle,
      task
    });
  
    // Re-enable the useEffect after resetting
    setTimeout(() => {
      setIsResetting(false);
    }, 2000);
  };

  return (
    <div>
      
      <Visualpageheader />
      <Row className="flex justify-between py-4 items-center w-full">
        <div className="flex justify-start items-center pl-4 pr-1">
          <div className="px-2">
            <div>
              <p className="font-bold">Select a Date Range</p>
            </div>
            <RangePicker
              onChange={(value) => setDateRange(value)}
              defaultValue={dateRange}
                format="DD-MM-YYYY"
            />
          </div>
          {/* chart */}
          <div className="px-2">
            <div>
              <p className="font-bold">Chart</p>
            </div> 
            <Select
              placeholder="Select Chart"
              style={{
                width: 150,
              }}
              onChange={handleChartChange}
              value={visual}
            >
              <Option value="bar">Bar Graph</Option>
              <Option value="pie">Pie Chart</Option>
            </Select>
          </div>
          {/* X-Axis / Catgeory with disabled options */}
          { visual && !visual.includes("sunburst") && (
            <div className="px-2">
              <div>
                <p className="font-bold">{visual === "pie" ? "Category" : "Row"}</p>
              </div>
              <Select
                placeholder="Select Value"
                style={{
                  width: 150,
                }}
                onChange={handleCategoryChange}
                value={category}
                // allowClear // Allow clearing the selection
              >
              <>
                {visual!=="pie" && <Option value="time" disabled={visual === "pie"}>Time</Option>}
                <Option value="harbor" disabled={visual === "line"}>Harbor</Option>
                <Option value="type" disabled={visual === "line"}>Vessel Type</Option>
              </>
              </Select>
            </div> )
          }
          {/* Select grouping */}
          {category==="type" && visual.includes("bar") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Group by</p>
            </div>
            <Select
              placeholder="Select Category"
              style={{
                width: 150,
              }}
              onChange={handleGroupByChange}
              // defaultValue={"none"}
              value={currentGroup}
            >
              <Option value="none">None</Option>
              {/* <Option value="harbor">Harbor</Option> */}
              <Option value="time">Time</Option>
            </Select>
          </div>
          )}
          {category==="harbor" && visual.includes("bar") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Group by</p>
            </div>
            <Select
              placeholder="Select group by"
              style={{
                width: 150,
              }}
              onChange={handleGroupByChange}
              // defaultValue={"none"}
              value={currentGroup}
            >
              <Option value="none">None</Option>
              {/* <Option value="type">Type</Option> */}
              <Option value="time">Time</Option>
            </Select>
          </div>
          )}
          {category==="time" && visual.includes("bar") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Group By</p>
            </div>
            <Select
              placeholder="Select group by"
              style={{
                width: 150,
              }}
              onChange={handleGroupByChange}
              // defaultValue={"none"}
              value={currentGroup}
            >
              <Option value="none">None</Option>
              <Option value="harbor">Harbor</Option>
              <Option value="type">Type</Option>
            </Select>
          </div>
          )}
          {/* time resolution */}
          {visual && (visual.includes("line") || visual.includes("bar")) && category && category.includes("time") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Time Unit</p>
            </div>
            <Select
              placeholder="Select time unit"
              style={{
                width: 150,
              }}
              onChange={handleTimeChange}
              value={timePeriod}
              // defaultValue="month"
            >
              <Option value="month">Months</Option>
              <Option value="week">Weeks</Option>
              <Option value="day">Days</Option>
            </Select>
          </div>
          )}
          {/* Select Harbor */}
          {((category && category === "harbor") || (currentGroup && currentGroup === "harbor")) && !visual.includes("pie") && (
            <div className="px-2">
              <div>
                <p className="font-bold">Harbor</p>
              </div>
              <Select
                placeholder="Select Harbor"
                style={{
                  width: 150,
                }}
                onChange={handleHarborChange}
                //defaultValue="KARACHI"
                options={[{ value: "View All", label: "View All" }].concat(
                  harbor_list.map(item => ({
                  value: item,
                  label: item,
                }))
              )}>
              </Select>
            </div>
          )}
          {/* Select Vessel */}
          {((category && category === "type") || (currentGroup && currentGroup === "type")) && !visual.includes("pie") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Type</p>
            </div>
            <Select
              placeholder="Select Type"
              style={{
                width: 150,
              }}
              value={vesselType}
              onChange={handleVesselTypeChange}
              options={[{ value: "View All", label: "View All" }].concat(
                fishing_vessel_types.map(item => ({
                value: item,
                label: item,
              }))
              )}
            />
          </div>
          )}
        </div>
        <div className="flex justify-end items-center pr-4 pt-5">
          <Tooltip title="Save as Image">
            <Button onClick={() => exportAsImage(exportRef.current, "Fishing-Overstay", dateRange)}
              className="rounded yellow-midnight bg-yellow text-black mr-1 ml-1 inline-flex items-center custom-css-pageheaderButton">
              <div className="flex items-center">
                <FaFileDownload size={18}/>
              </div>
            </Button>
          </Tooltip>
          <Tooltip title="Set Default Visual">
            <Button onClick={() => handleResetDefaultClick("default")}
              className="rounded border-navyblue bg-navyblue text-white mr-1 ml-1 inline-flex items-center custom-css-pageheaderButton">
              <div className="flex items-center">
                <MdOutlineSettingsBackupRestore size={22}/>
              </div>
            </Button>
          </Tooltip>
          {currentGroup && (
            <Tooltip title="Reset Options">
              <Button onClick={() => handleResetDefaultClick("clear")}
                className="rounded border-darkgray bg-darkgray text-white mr-1 ml-1 inline-flex items-center custom-css-pageheaderButton">
                <div className="flex items-center">
                  <RxReset size={22} />
                </div>
              </Button>
            </Tooltip>
          )}
      </div>
      </Row>
      <Row ref={exportRef}>
        <Col span={24}>
          {loading ? (
            <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
          ) : visual && visual === "bar" && category && category === "time" && timePeriod && apiFilter && currentGroup ? (
            <DemoColumn
              isGroup={isGroup}  
              //isGroup={apiFilter === "harbor and type" ? true : false}
              title="Fishing Vessel - Overstay"
              subTitle={subTitle}
              data={filteredData}
              groupby={currentGroup}
            />
          ) :  visual && category && apiFilter && currentGroup && visual === "pie" ? (
            <PieChart
              title="Fishing Vessel - Overstay"
              subTitle={subTitle}
              data={filteredData}
            />
          ) : visual && category && apiFilter && currentGroup && visual === "bar" &&
            (<DemoColumn
              isGroup={isGroup}  
              //isGroup={apiFilter === "harbor and type" ? true : false}
              title="Fishing Vessel - Overstay"
              subTitle={subTitle}
              data={filteredData}
              groupby={currentGroup}
            />) }
        </Col>
      </Row>
    </div>
  );
}

export default OverStay;
