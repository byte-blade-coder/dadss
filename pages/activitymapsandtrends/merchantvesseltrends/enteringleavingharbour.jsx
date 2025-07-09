import React, { useEffect, useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { BsArrowLeft } from "react-icons/bs";
import { Col, Row, Select, Button, message, Tooltip } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";
import { harbor_list, merchant_harbor_list, ais_type_summary } from "../../../src/helper/dropdown";
import {generateColors, color_shades, green_shades_list, blue_shades_list} from "../../../src/helper/colorPalette";
import CustomDropdownWithCheckbox from "../../../src/components/dropdown/DropdownListWithCheckBox";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { RxReset } from "react-icons/rx";
import { resetUserControls } from "../../../src/utils/resetUserControl";
const { RangePicker } = DatePicker;

const MultiBiDirectionalBar = dynamic(
  () => import("../../../src/components/barchart/Basic2DBar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const DivergingBarChart = dynamic(
  () => import("../../../src/components/barchart/StackedBarChart2Directional"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const Sunburst = dynamic(
  () => import("../../../src/components/sunburstChart/sunBurst"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function EnteringLeavingHarbour() {
  // State to control loading state
  const [loading, setLoading] = useState(true);
  // State to store error message, if any
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs('2023-08-15'), 
    dayjs('2023-10-06'), 
  ]);
  const [filteredData, setFilteredData] = useState("");
  //State to set api query parameter
  const [apiFilter, setApiFilter] = useState("all");
  //State to set categpry/x-axis value
  const [category, setCategory] = useState("harbor");
  //State to set chart or graph type
  const [visual, setVisual] = useState("bar");
  //State to set harbor
  const [apiHarbor, setApiHarbor] = useState([]);
  //State to set api query parameter
  const [vesselType, setVesselType] = useState([]);
  // State to manage bar group representation
  const [isGroup, setIsGroup] = useState(false);
  // State to manage time period category
  const [timePeriod, setTimePeriod] = useState("month");
  // State to manage grouping option
  const [currentGroup, setCurrentGroup] = useState("none")
  // State to manage subtitles for different charts
  const [subTitle, setSubTitle] = useState("")
  //state to support clear/default functionality
  const [isResetting, setIsResetting] = useState(false);

  const exportRef = useRef();
  const [messageApi, contextHolder] = message.useMessage();
  
  // Fetch data whenever the dateRange changes
  useEffect(() => {  
    if(dateRange)
    {
      if(category && currentGroup && apiFilter)
      {
        fetchDataforHarborTrend();
      }
    }
    else{
      setLoading(true)
      messageApi.info({content: "Please select a date range to view the chart.",  
        duration: 8,
        style: {
          position: "fixed",
          left: "40%",
          top: "52px"
        },});
    }
  }, [dateRange, apiFilter, apiHarbor, vesselType, timePeriod, category ]); //currentGroup, 

//currentGroup
  useEffect(() => {
    // Reset harbor, vessel type and group_by values whenever apiFilter and/or visual changes
    setApiHarbor([]);
    setVesselType([]);   
    if (!isResetting) {
      // setCurrentGroup(null);
      setCurrentGroup("none");
      // if(category==="time")
      setTimePeriod(null);
    }
  }, [category, visual]);

  useEffect(() => {
    // Reset time period whenever apiFilter, visual, currentGroup changes
    setTimePeriod("month");

    let subtitle="";
    if(visual==="bar")
    {
      if(apiFilter==="harbor")
      {
        subtitle="Arrivals and Departures according to Harbor type";
        setSubTitle(subtitle);
      }
      else if(apiFilter==="type")
      {
        subtitle="";
        setSubTitle(subtitle);
      }
      else if(apiFilter==="harbor and type")
      {
        subtitle="";
        setSubTitle(subtitle);
      }
    }
}, [category, visual, currentGroup]);

  useEffect(() => {
    // Reset data whenever apiFilter, visual, currentGroup, timePeriod changes
    setFilteredData([]);
  }, [apiFilter, visual, category, currentGroup, timePeriod]);

  useEffect(() => {

    console.log(category, currentGroup)
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
        console.log(`Error: For ${category} category, wrong group type: ${currentGroup}`);
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
  }, [currentGroup, category]);

  const handleGroupByChange =(group) => {
    setFilteredData([]);
    // if(group==="none")
    // {
    //   // setFilteredData([]);
    //   setCurrentGroup(group);
    //   setIsGroup(false);  
    // }
    // else if(group==="harbor and type")
    // {
    //   setTimePeriod("month");
    //   setIsGroup(true); 
    //   setApiFilter(group)
    //   setTimeout(() => {
    //     setCurrentGroup(group);
    //   }, 1000);
    //   console.log("Current group:",group, timePeriod, apiFilter)
    // }
    // else{
    //   if(apiFilter==="harbor and type")
    //   {
    //     console.log("here")
    //     setApiFilter("harbor");
    //   }
    //   setTimeout(() => {
    //     setCurrentGroup(group);
    //   }, 1000);
    //   setTimePeriod("month");
    //   setIsGroup(true);  
    //   console.log(group, timePeriod)
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
      setApiFilter("all");
      setApiHarbor([]);
      setTimePeriod("month")
    }
    else if (value === "sunburst") {
      setFilteredData([]);
      setApiFilter("harbor and type");
    }
    
  }

  const handleVesselTypeChange = (value) => {
    if(value==='View All')
    {
      setVesselType([]);
    }
    else
    {  
      setVesselType(value);
    }
    console.log(value);
  }

  const handleHarborChange = (value) => {
    if(value==='View All')
    {
      setApiHarbor([]);
    }
    else
    {
      setApiHarbor(value);
    }
    console.log(value);
  }

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleTimeChange = (value) => {
    // console.log("time ", value)
    setTimePeriod(value)
  }

  const fetchDataforHarborTrend = async () => {
    // Function to fetch data from the API based on the selected date range
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    let queryString = "";
    
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
    // console.log("queryString: ", queryString)
    console.log("APi filter: ", apiFilter, "Category", category, "Group BY: ", currentGroup)
    try {
     
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/mer_visual_harbor?date_from=${dateFrom}&&date_to=${dateTo}&&filter=${apiFilter}&&${queryString}`
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();

      if(visual.includes("bar") && category.includes("time"))
      {
        if(currentGroup==="harbor" || currentGroup==="type")
        { 
          const transformData = (data) => {
            let labels;
            let ports;

            if (data[0].hasOwnProperty('Month') && data[0].hasOwnProperty('Year') && !data[0].hasOwnProperty('Date')) 
            {
              labels = data?.map((item) => `${item.Month} ${item.Year}`);
              ports = Object.keys(data[0]).filter((key) => !['Year', 'Month'].includes(key));
            } 
            else if (data[0].hasOwnProperty('Date')) 
            {
              labels = data?.map((item) => `${item.Date} ${item.Month} ${item.Year}`);
              ports = Object.keys(data[0]).filter((key) => !['Date', 'Year', 'Month'].includes(key));
            } 
            else if (data[0].hasOwnProperty('Week_Start') && data[0].hasOwnProperty('Week_End')) 
            {
              labels = data?.map((item) => `${item.Week_Start} - ${item.Week_End}`);
              ports = Object.keys(data[0]).filter((key) => !['Year', 'Week_Start', 'Week_End'].includes(key));
            } 
            else 
            {
              throw new Error('Unknown data format');
            }
            
            const datasets = [];
            const colorMap = {}; // To store a unique color for each category
            const color_shades = generateColors(Object.keys(ports).length, 'Paired'); // Adjust as per your color generation function

            ports.forEach((port, index) => {

              // let colorIndex = (index * 1) % color_shades.length;
              let colorIndex = index;
              if (!colorMap[port]) {
                colorMap[port] = color_shades[colorIndex]; // Assign the next color in sequence
              }

              const arrivalDataset = {
                label: port,
                data: data.map((item) => (item[port]?.arrival != null ? item[port].arrival : 0)),
                backgroundColor: colorMap[port],
                //backgroundColor:  green_shades_list[arrivalColorIndex],
                stack: port, // Unique stack for each port
              };
          
              const departureDataset = {
                //label: `${port} Departure`,
                label: port,
                data: data.map((item) => (item[port]?.departure != null ? item[port].departure : 0)),
                // backgroundColor:  color_shades[colorIndex],
                backgroundColor: colorMap[port],
                stack: port, // Unique stack for each port
              };
          
              datasets.push(arrivalDataset, departureDataset);
            });
          
            return {
              labels,
              datasets,
            };
          };
        
          const transformedData = transformData(data);
          console.log("transformedData", transformedData, "is Grouped?", isGroup)
          console.log( "for: Filter-> ", apiFilter,"and Grouped->", currentGroup)
          setFilteredData(transformedData);
        }
        else{
          const transformData = (data) => {

            // Extract labels for the x-axis
            let labels;
            if (data[0].hasOwnProperty('Month') && data[0].hasOwnProperty('Year') && !data[0].hasOwnProperty('Date')) 
            {
              labels = data?.map((item) => `${item.Month} ${item.Year}`);
            } 
            else if (data[0].hasOwnProperty('Date')) 
            {
              labels = data?.map((item) => `${item.Date} ${item.Month} ${item.Year}`);
            } 
            else if (data[0].hasOwnProperty('Week_Start') && data[0].hasOwnProperty('Week_End')) 
            {
              labels = data?.map((item) => `${item.Week_Start} - ${item.Week_End}`);
            } 
            const color_shades = generateColors(data.length, 'Paired');

            // Prepare datasets for arrival and departure
            const arrivalDataset = {
              label: "Arrival",
              data: data.map(item => item.arrival),
              backgroundColor: data.map((item, index) => color_shades[index]),
              stack: 'combined',
            };
          
            const departureDataset = {
              label: "Departure",
              data: data.map(item => item.departure),
              backgroundColor: data.map((item, index) => color_shades[index]),
              stack: 'combined',
            };
          
            return {
              labels,
              datasets: [arrivalDataset, departureDataset], 
            };
          };

          console.log("Time not grouped")
          const transformedData = transformData(data);
          setFilteredData(transformedData);
        }
        
      }
      else if(visual.includes("bar") && apiFilter!== "harbor and type" && !apiFilter.includes("all") && (category==="harbor" || category==="type"))
      {
        if(currentGroup==="none")
        {
          // const transformedData = Object.values(data.reduce((acc, item) => {
          //   const { Year, Month, Week_End, Week_Start, Date, ...ports } = item;
            
          //   Object.entries(ports).forEach(([port, values]) => {
          //       if (!acc[port]) {
          //           acc[port] = { date: port, arrival: 0, departure: 0 };
          //       }
          //       acc[port].arrival += values.arrival;
          //       acc[port].departure += -values.departure;
          //      // acc[port].lastDeparture = values.departure; 
          //   });
        
          //   return acc;
          // }, {}));
          
          const transformData = (data) => {
            const ports = Object.keys(data[0]).filter(key => !['Year', 'Month'].includes(key));
            const labels = ports;
            const color_shades = generateColors(ports.length, 'Paired');
          
            const arrivalData = Array(ports.length).fill(0);
            const departureData = Array(ports.length).fill(0);
          
            data.forEach(monthData => {
              ports.forEach((port, index) => {
                arrivalData[index] += monthData[port].arrival;
                departureData[index] += monthData[port].departure;
              });
            });
          
            // Prepare the datasets
            const arrivalDataset = {
              label: "Arrival",
              data: arrivalData, // Total arrivals per port
              backgroundColor: color_shades, // Color shades for each port
              stack: 'combined',
            };
          
            const departureDataset = {
              label: "Departure",
              data: departureData, // Total departures per port
              backgroundColor: color_shades, // Same colors for arrivals and departures
              stack: 'combined',
            };

            return {
              labels,
              datasets: [arrivalDataset, departureDataset],
            };
          };          
        
          const transformedData = transformData(data);
          console.log("transformedData", transformedData, "for: Filter-> ", apiFilter,"and Grouped->", currentGroup)
          setFilteredData(transformedData);
        }
        
        else if(currentGroup==="time") //if currentGroup is harbor or type
        { 
          const transformData = (data) => {
            if (!data || !Array.isArray(data) || data.length === 0) {
              return 'wrongdata';
            }
          
            const ports = Object.keys(data[0]).filter((key) => !['Year', 'Month'].includes(key));
            const labels = ports; // Use ports as labels
          
            const datasets = [];
            let index = 0;
            const colorMap = {}; // To store a unique color for each category
            const color_shades = generateColors(Object.keys(data).length, 'Paired'); // Adjust as per your color generation function

            data.forEach((item) => {
              const dateLabel = `${item.Month} ${item.Year}`;

              // Generate or reuse the color for this category
              if (!colorMap[dateLabel]) {
                colorMap[dateLabel] = color_shades[index]; // Assign the next color in sequence
                index++; // Increment the index for the next category
              }

              const arrivalDataset = {
                label: dateLabel,
                //label: `${dateLabel} Arrival`,
                data: ports.map((port) => (item[port]?.arrival != null ? item[port].arrival : 0)),
                // backgroundColor: color_shades[blueIndex % color_shades.length],
                backgroundColor: colorMap[dateLabel],
                stack: dateLabel,
              };
          
              const departureDataset = {               
                label: dateLabel,
                //label: `${dateLabel} Departure`,
                data: ports.map((port) => (item[port]?.departure != null ? item[port].departure : 0)),
                backgroundColor: colorMap[dateLabel],
                //backgroundColor: blue_shades_list[blueIndex % blue_shades_list.length],
                stack: dateLabel,
              };
          
              datasets.push(arrivalDataset, departureDataset);
              // greenIndex += 2;
              // blueIndex += 1;
            });
          
            return {
              labels,
              datasets,
            };
          };
        
          const transformedData = transformData(data);
          console.log("transformedData", transformedData, "is Grouped?", isGroup)
          console.log("for: Filter-> ", apiFilter,"and Grouped->", currentGroup)
          setFilteredData(transformedData);
        }
        // currentGroup!=="time" && currentGroup!=="none"
      }
      // apiFilter.includes("harbor and type")
      else if(visual.includes("bar") && apiFilter==="harbor and type"  && (category==="harbor" || category==="type"))
      { 
        console.log("Now working for Filter: ", apiFilter, data)
        const transformData = (data) => {
          const allLabelsSet = new Set();
          const datasetsMap = {};
          const colorMap = {}; // To store a unique color for each category
          const color_shades = generateColors(Object.keys(data).length, 'Paired'); // Adjust as per your color generation function

          data.forEach((item) => {
            const { Month, Year, ...portsData } = item; // Extract the year, month, and the rest
  
            Object.entries(portsData).forEach(([portName, portData]) => {
              allLabelsSet.add(portName);
              
              let index = 0
              Object.entries(portData).forEach(([category, value]) => {
                // console.log("ENTRIES", index)
                let colorIndex = (index * 1) % color_shades.length;

                // Generate or reuse the color for this category            
                if (!colorMap[category]) {
                  colorMap[category] = color_shades[index]; // Assign the next color in sequence
                  index++; // Increment the index for the next category
                }

                const arrivalKey = `${category} Arrival`;
                const departureKey = `${category} Departure`;
        
                if (!datasetsMap[arrivalKey]) {
                  datasetsMap[arrivalKey] = {
                    label: category,
                    data: {},
                    backgroundColor: colorMap[category],
                    stack: category,
                  };
                }
        
                if (!datasetsMap[departureKey]) {
                  datasetsMap[departureKey] = {
                    label: category,
                    data: {},
                    backgroundColor: colorMap[category],
                    stack: category,
                  };
                }
        
                datasetsMap[arrivalKey].data[portName] = (datasetsMap[arrivalKey].data[portName] || 0) + value.arrival;
                datasetsMap[departureKey].data[portName] = (datasetsMap[departureKey].data[portName] || 0) + value.departure;
                // index++;
              });
            });
          });
        
          const labels = Array.from(allLabelsSet);
          const datasets = Object.values(datasetsMap).map(dataset => ({
            ...dataset,
            data: labels.map(label => dataset.data[label] || 0),
          }));
        
          return { labels, datasets };
        };
        
        // Usage
        const transformedData = transformData(data);
        console.log(transformedData);
        setFilteredData(transformedData);        
        
      }
      else if(visual.includes("sunburst")){


        if(apiFilter.includes("harbor and type"))
        {
          console.log("Sunburst data formation")
          function transformData(apiResponse) {
            const root = {
              name: "Root",
              children: [],
            };
          
            apiResponse.forEach((item) => {
              const { Year, Month, ...ports } = item;
              const locationNames = Object.keys(ports);
          
              locationNames.forEach((locationName) => {
                // Check if the location node exists, create if not
                let locationNode = root.children.find(
                  (node) => node.name === locationName
                );
                if (!locationNode) {
                  locationNode = {
                    name: locationName,
                    children: [],
                  };
                  root.children.push(locationNode);
                }
          
                // Check if the year node exists, create if not
                let yearNode = locationNode.children.find((node) => node.name === Year);
                if (!yearNode) {
                  yearNode = {
                    name: Year,
                    children: [],
                  };
                  locationNode.children.push(yearNode);
                }
          
                // Check if the month node exists, create if not
                let monthNode = yearNode.children.find((node) => node.name === Month);
                if (!monthNode) {
                  monthNode = {
                    name: Month,
                    children: [],
                  };
                  yearNode.children.push(monthNode);
                }
          
                // Add vessel types
                const vesselTypes = ports[locationName];
                Object.keys(vesselTypes).forEach((vesselType) => {
                  let vesselTypeNode = monthNode.children.find(
                    (node) => node.name === vesselType
                  );
                  if (!vesselTypeNode) {
                    vesselTypeNode = {
                      name: vesselType,
                      children: [],
                    };
                    monthNode.children.push(vesselTypeNode);
                  }
          
                  // Add arrival and departure categories
                  const categories = vesselTypes[vesselType];
                  Object.keys(categories).forEach((category) => {
                    let categoryNode = vesselTypeNode.children.find(
                      (node) => node.name === category
                    );
                    if (!categoryNode) {
                      categoryNode = {
                        name: category,
                        value: categories[category],
                      };
                      vesselTypeNode.children.push(categoryNode);
                    } else {
                      categoryNode.value = categories[category];
                    }
                  });
                });
              });
            });
          
            return root;
          }
          const transformedData = transformData(data);
          console.log("Sunburst transformed data: ", transformedData);
          setFilteredData(transformedData);
        }
        else{

        }
      }
      setLoading(false); // Set loading state to false after data is fetched
    } catch (error) {
      setError(error.message); // Set error state if data fetching fails
      console.log(error)
      setLoading(false); // Set loading state to false after data is fetched
      if (error.message) {
        showToastError(`Error : ${error.message}.`);
      }
    }
  };

  const handleResetDefaultClick = (task) => {
    setIsResetting(true);  // Disable useEffect while resetting

    resetUserControls({
      setApiFilter,
      // setCategory,
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
  // console.log( "apiFilter", apiFilter, "apiHarbor", apiHarbor, "vesselType", vesselType, "timePeriod", timePeriod, "currentGroup", currentGroup,"visual" ,visual)

  return (
    <div>
      <Visualpageheader/>
      {contextHolder}
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
              <Option value="sunburst">Sunburst Graph</Option>
            </Select>
          </div>
          {/* X-Axis / Catgeory with disabled options */}
          { visual && !visual.includes("sunburst") && (
            <div className="px-2">
              <div>
                <p className="font-bold">{visual === "pie" ? "Category" : "Row"}</p>
              </div>
              <Select
                // mode={visual === "line" ? "default" : "multiple"}
                mode="default"
                placeholder="Select Value"
                style={{
                  width: 150,
                }}
                onChange={handleCategoryChange}
                value={category}
                // allowClear // Allow clearing the selection
                // onChange={handleFilterChange}
                // value={apiFilter}
                // value={
                //   visual !== "bar"
                //     ? apiFilter
                //     : apiFilter === "harbor"
                //     ? ["harbor"]
                //     : apiFilter === "type"
                //     ? ["type"]
                //     : apiFilter === "all"
                //     ? ["all"]
                //     : ["harbor", "type"]
                // }
              >
              <>
                <Option value="time">Time</Option>
                <Option value="harbor">Harbor</Option>
                <Option value="type">Vessel Type</Option>
              </>
              </Select>
            </div> )
          }
           {/* harbor category */}
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
              <Option value="time">Time</Option>
              {/* <Option value="type">Type</Option> */}
            </Select>
          </div>
          )}
           {/* type category */}
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
              <Option value="time">Time</Option>
              {/* <Option value="harbor">Harbor</Option> */}
            </Select>
          </div>
          )}
           {/* time category apiFlter==="all"*/}
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
          {/* harbor and type category */}
          {/* {apiFilter==="harbor and type" && visual.includes("bar") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Group By</p>
            </div>
            <Select
              placeholder="Select group by"
              style={{
                width: 150,
              }}
              //defaultValue="Tanker"
              onChange={handleGroupByChange}
              defaultValue={"none"}
              value={currentGroup}
            >
              <Option value="none">None</Option>
              <Option value="harbor">Harbor Wise</Option>
              <Option value="harbor and type">Type Wise</Option>
              <Option value="time">Time Wise</Option>
            </Select>
          </div>
          )} */}
          {/* time resolution && category && category.includes("time") */}
          {/* currentGroup.includes("time") || */}
          {visual && visual.includes("bar") && ( apiFilter==="all" || category==="time") && (
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
          {/* Select Harbor (((currentGroup && currentGroup === "harbor")) && !visual.includes("pie") && category && category === "harbor") || */}
          {apiFilter?.includes("harbor") && visual.includes("bar") && (
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
                  merchant_harbor_list.map(item => ({
                  value: item,
                  label: item,
                }))
              )}>
              </Select>
            </div>
          )}
          {/* Select Vessel (category && category === "type" (currentGroup && currentGroup === "type")) && !visual.includes("pie") ) || */}
          {apiFilter?.includes("type") && visual.includes("bar") && (
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
                  ais_type_summary.map(item => ({
                  value: item,
                  label: item,
                }))
                )}
              />
            </div>
          )}
          {/* {apiFilter==="harbor and type" && visual.includes("bar") && (
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
              options={[{ value: "View All", label: "View All" }].concat(
                merchant_harbor_list.map(item => ({
                value: item,
                label: item,
              }))
            )}>
            </Select>
          </div>
          )} */}
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

      <Row ref={exportRef} className="mt-2" >
          <Col span={24}>
            {loading ? (
              <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
            ) : dateRange && visual === "sunburst" ? (
              <Sunburst
                title="Merchant Harbor Activity - Sunburst"
                subTitle={subTitle}
                data={filteredData}
              />
            ) : dateRange && visual === "bar" && currentGroup === "none" ? (
              <MultiBiDirectionalBar
                title="Merchant Vessel - Entering Leaving"
                subTitle={subTitle}
                data={filteredData}
              />
            ) : dateRange && visual === "bar" && isGroup === true ? (
                // showChart === "true" ? (
              <DivergingBarChart
                title="Merchant Vessel - Entering Leaving Grouped"
                subTitle={subTitle}
                data={filteredData}
                chart={currentGroup}
                isGroup={isGroup}
                apiFilter={apiFilter}
                //currentGroup={currentGroup}
              /> 
                // ) : ( <p>Loading chart...</p>) 
            ) : (null) }
          </Col>
      </Row>
    </div>
  );
}

export default EnteringLeavingHarbour;
export async function getServerSideProps(context) {
  return {
    props: {
      title: `Entering and Leaving Harbor`,
    },
  };
}
