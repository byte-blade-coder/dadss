import React, { useEffect, useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { BsArrowLeft } from "react-icons/bs";
import { Col, Row, Select,Button, message } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import { harbor_list, merchant_harbor_list, type_list,fishing_vessel_types } from "../../../src/helper/dropdown";
import {generateColors, color_shades, green_shades_list, blue_shades_list} from "../../../src/helper/colorPalette";
import CustomDropdownWithCheckbox from "../../../src/components/dropdown/DropdownListWithCheckBox";

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
const BiDirectionalBar = dynamic(
  () => import("../../../src/components/barchart/BiDirectionalBarChart"),
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
  // const [dateRange, setDateRange] = useState([
  //   dayjs().subtract(12, "month"),
  //   dayjs(),
  // ]);
  const [dateRange, setDateRange] = useState([
    dayjs('2022-01-01'), 
    dayjs('2022-05-31'), 
  ]);
  const [filteredData, setFilteredData] = useState("");
   //State to set api query parameter
   const [apiFilter, setApiFilter] = useState("all");
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

   const exportRef = useRef();
   const [messageApi, contextHolder] = message.useMessage();

  // Fetch data whenever the dateRange changes
  useEffect(() => {  
    if(dateRange)
    {
      fetchDataforFishingHarborTrend();
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
  }, [dateRange, apiFilter, apiHarbor, vesselType, timePeriod, currentGroup ]);

//currentGroup
  useEffect(() => {
    // Reset harbor, vessel type and group_by values whenever apiFilter and/or visual changes
    setApiHarbor([]);
    setVesselType([]);
    setCurrentGroup("none");
  }, [apiFilter, visual]);

  useEffect(() => {
    // Reset time period whenever apiFilter, visual, currentGroup changes
    setTimePeriod("month");

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
      else if(apiFilter==="harbor and type")
      {
        subtitle="";
        setSubTitle(subtitle);
      }
    }
}, [apiFilter, visual, currentGroup]);

  useEffect(() => {
    // Reset data whenever apiFilter, visual, currentGroup, timePeriod changes
    setFilteredData([]);
  }, [apiFilter, visual, currentGroup, timePeriod]);

  const handleGroupByChange =(group) => {
    setFilteredData([]);
    if(group==="none")
    {
      // setFilteredData([]);
      setCurrentGroup(group);
      setIsGroup(false);  
    }
    else if(group==="harbor and type")
    {
      setTimePeriod("month");
      setIsGroup(true); 
      setApiFilter(group)
      setTimeout(() => {
        setCurrentGroup(group);
      }, 1000);
    }
    else{
      if(apiFilter==="harbor and type")
      {
        setApiFilter("harbor");
      }
      setTimeout(() => {
        setCurrentGroup(group);
      }, 1000);
      setTimePeriod("month");
      setIsGroup(true);  
    }
    
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

  const handleFilterChange = (value) => {

    let filter;
    if (value.includes("harbor") && value.includes("type")) {
      filter = "harbor and type";
      setIsGroup(true);
    } 
    else if (value.includes("harbor")) {
      filter = "harbor";
      setIsGroup(false);
    } 
    else if (value.includes("type")) {
      filter = "type";
      setIsGroup(false);
    }
    else if (value.includes("all"))
    {
      filter = "all";
      setIsGroup(false);
    }
    setApiFilter(filter);
  };

  const handleTimeChange = (value) => {
    // if(value === "month") {
    //   setDateRange([
    //     dayjs('2022-02-01'), 
    //     dayjs('2022-05-31')
    //   ]);
    // }
    // else if(value === "week") {
    //   setDateRange([
    //     dayjs('2022-03-08'), 
    //     dayjs('2022-04-30')
    //   ]);
    // }
    // else if(value === "day") {
    //   setDateRange([
    //     dayjs('2022-04-22'), 
    //     dayjs('2022-05-14')
    //   ]);
    // }
    setTimePeriod(value)
  }
  // const handledate = (value) => {
  //   setDateRange(value)
  // }

  const fetchDataforFishingHarborTrend = async () => {
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

    try {
     
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing_visual_harbor?date_from=${dateFrom}&&date_to=${dateTo}&&filter=${apiFilter}&&${queryString}`
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
      if(visual.includes("bar") && apiFilter!== "harbor and type" && !apiFilter.includes("all") )
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
        
        else if(currentGroup!=="time" && currentGroup!=="none") //if currentGroup is harbor or type
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
                data: ports.map((port) => (item[port]?.arrival != null ? item[port].arrival : 0)),
                backgroundColor: colorMap[dateLabel],
                // backgroundColor: green_shades_list[greenIndex % green_shades_list.length],
                stack: dateLabel,
              };
          
              const departureDataset = {
                label: dateLabel,
                data: ports.map((port) => (item[port]?.departure != null ? item[port].departure : 0)),
                backgroundColor: colorMap[dateLabel],
                stack: dateLabel,
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
          console.log("for: Filter-> ", apiFilter,"and Grouped->", currentGroup)
          setFilteredData(transformedData);
        }

        else if(currentGroup==="time")
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

              if (!colorMap[port]) {
                colorMap[port] = color_shades[index]; // Assign the next color in sequence
              }

              const arrivalDataset = {
                label: port,
                //label: `${port} Arrival`,
                data: data.map((item) => (item[port]?.arrival != null ? item[port].arrival : 0)),
                backgroundColor: colorMap[port],
                // backgroundColor:  green_shades_list[arrivalColorIndex],
                stack: port, // Unique stack for each port
              };
          
              const departureDataset = {
                label: port,
                //label: `${port} Departure`,
                data: data.map((item) => (item[port]?.departure != null ? item[port].departure : 0)),
                backgroundColor: colorMap[port],
                //backgroundColor:  blue_shades_list[departureColorIndex],
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
        
      }
      else if(visual.includes("bar") && apiFilter.includes("harbor and type"))
      { 
        const transformData = (data) => {
          const allLabelsSet = new Set();
          const datasetsMap = {};
          const colorMap = {}; // To store a unique color for each category
          const color_shades = generateColors(Object.keys(data).length, 'Paired'); // Adjust as per your color generation function

          data.forEach((item) => {
            const { Month, Year, ...portsData } = item; // Extract the year, month, and the rest
        
            Object.entries(portsData).forEach(([portName, portData]) => {
              allLabelsSet.add(portName);
        
              let index = 0;
              Object.entries(portData).forEach(([category, value]) => {
                
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
                index++;
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
      else if(visual.includes("bar") && apiFilter.includes("all"))
      {
        // const formattedData = data.map(item => {
        //   const { Year, Month, Date, Week_Start, Week_End, ...rest } = item;
        //   // return {
        //   //     date: `${Month} ${Year}`,
        //   //     ...rest
        //   // };
        //   const departure = Math.abs(rest.departure);

        //   return {
        //     date:  `${Month} ${Year}`,
        //     arrival: rest.arrival,
        //     departure,
        //   };
        // });
        const transformData = (data) => {

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

        const transformedData = transformData(data);
        setFilteredData(transformedData);
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

  return (
    <div>

      <Visualpageheader/>
      {contextHolder}
      <div className="flex justify-end items-center px-6 py-2">
          <div className="px-2">
            <div>
              <p className="font-bold">Chart</p>
            </div>
            <Select
              placeholder="Select Chart"
              style={{
                width: 150,
              }}
              //  onChange={handleChartChange}
              defaultValue="bar"
              >
            <Option value="bar">Bar Graph</Option>
          </Select>
          </div>
         {!visual.includes("sunburst") && ( 
          <div className="px-2">
            <div>
              <p className="font-bold">Data Group</p>
              {/* <p className="font-bold">Graph Parameters</p> */}
            </div>
            <Select
              //mode={visual === "line" ? "default" : "multiple"}
              mode="default"
              placeholder="Select Chart"
              style={{
                width: 150,}}
              onChange={handleFilterChange}
              // value={apiFilter}
              value={
                visual !== "bar"
                  ? apiFilter
                  : apiFilter === "harbor"
                  ? ["harbor"]
                  : apiFilter === "type"
                  ? ["type"]
                  : apiFilter === "all"
                  ? ["all"]
                  : ["harbor", "type"]
              }
            >
              <>
                <Option value="all">Time</Option>
                <Option value="harbor">Harbor</Option>
                <Option value="type">Vessel Type</Option>
              </>
            </Select>
          </div>)}
          {apiFilter.includes("harbor") && visual.includes("bar") && (
            <div className="px-2">
              <div>
                <p className="font-bold">Harbor</p>
              </div>
              {/* <CustomDropdownWithCheckbox
                options={harbor_list.map(item => ({
                  value: item,
                  label: item,
                }))}
                onChange={handleHarborChange}
                defaultSelected={["KARACHI"]} // Optional default selected
              /> */}
            <Select
              mode="multiple"
              placeholder="Select Harbor"
              style={{
                width: 200,
                // maxWidth: 250,
              }}
              maxTagCount={1} // Limits the number of visible selected options
              // dropdownStyle={{ width: 150 }} 
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
          {apiFilter.includes("type") && visual.includes("bar") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Type</p>
            </div>
            <Select
              mode="multiple"
              placeholder="Select Type"
              style={{
                width: 200,
                // maxWidth: 250,
              }}
              maxTagCount={1}
              //defaultValue="Tanker"
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
          {/* Select grouping */}
          {apiFilter==="type" && visual.includes("bar") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Group By</p>
            </div>
            <Select
              placeholder="Select Group by"
              style={{
                width: 150,
              }}
              onChange={handleGroupByChange}
              defaultValue={"none"}
              value={currentGroup}
            >
               <Option value="none">None</Option>
              <Option value="type">Type Wise</Option>
              <Option value="time">Time Wise</Option>
            </Select>
          </div>
          )}
          {apiFilter==="harbor" && visual.includes("bar") && (
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
              {/* <Option value="harbor and type">Type Wise</Option> */}
              <Option value="time">Time Wise</Option>
            </Select>
          </div>
          )}
          {apiFilter==="harbor and type" && visual.includes("bar") && (
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
          )}
           {/* time category */}
          {visual.includes("bar") && (currentGroup.includes("time") || apiFilter==="all") && (
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
              defaultValue="month"
            >
              <Option value="month">Months</Option>
              <Option value="week">Weeks</Option>
              <Option value="day">Days</Option>
            </Select>
          </div>
          )}
          {/* //date range */}
          <div className="px-2">
            <div>
              <p className="font-bold">Select a Date Range</p>
            </div>
            <RangePicker
              onChange={(value) => setDateRange(value)}
              // onChange={handledate}
              defaultValue={dateRange}
              value={dateRange}
                format="DD-MM-YYYY"
            />
          </div>
          <Button onClick={() => exportAsImage(exportRef.current, "Fishing-Harbor-Trend", dateRange)}
            className="rounded yellow-midnight bg-yellow text-black mr-1 ml-2 inline-flex items-center custom-css-pageheaderButton mt-5">
            <div className="flex items-center gap-x-3">
              <FaFileDownload />
              Save as Image
            </div>
          </Button>
      </div>
      <Row ref={exportRef}  className="mt-2">
          <Col span={24}>
            {loading ? (
              <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
            ) : visual === "sunburst" ? (
              <Sunburst
                title="Fishing Boats Leaving and Entering Harbour - Sunburst"
                subTitle={subTitle}
                data={filteredData}
              />
            ) : visual === "bar" && currentGroup === "none" ? (
              <MultiBiDirectionalBar
                title="Fishing Boats Leaving and Entering Harbour"
                subTitle={subTitle}
                data={filteredData}
              />
            ) : visual === "bar" && isGroup === true ? (
              <DivergingBarChart
                title="Fishing Boats Leaving and Entering Harbour - Grouped"
                subTitle={subTitle}
                data={filteredData}
                chart={currentGroup}
                isGroup={isGroup}
                apiFilter={apiFilter}
                //currentGroup={currentGroup}
              /> 
            ) : ( <p>Loading chart...</p>) }
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
