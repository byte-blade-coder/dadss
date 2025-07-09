import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select, message } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import moment from "moment";
import { BsArrowLeft } from "react-icons/bs";
import dayjs from "dayjs";
import { showToastError, showToastSuccess } from "../../../src/helper/MyToast";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
import { FaFileDownload } from "react-icons/fa";
import exportAsImage from "../../../src/utils/exportAsImg";
import { merchant_harbor_list, ais_type_summary } from "../../../src/helper/dropdown";
import {generateColors, green_shades_list, blue_shades_list} from "../../../src/helper/colorPalette";
// import DivergingBarChart from "../../../src/components/barchart/DivergingBarPlotGrouped";

const { RangePicker } = DatePicker;
const DemoLine = dynamic(
  () => import("../../../src/components/linechart/MultiLine"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const BasicBar = dynamic(
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

const Sunburst = dynamic(
  () => import("../../../src/components/sunburstChart/sunBurst"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const FishingActivityTrends = () => {
  // State to control loading state
  const [loading, setLoading] = useState(true);
  // State to store error message, if any
  const [error, setError] = useState(null);
  //State to set api query parameter
  const [apiFilter, setApiFilter] = useState("harbor");
  //State to set chart or graph type
  const [visual, setVisual] = useState("bar");
  //State to set harbor
  const [apiHarbor, setApiHarbor] = useState([]);
  //State to set api query parameter
  const [vesselType, setVesselType] = useState([]);
  // State to store filtered data
  const [filteredData, setFilteredData] = useState([]);
  // State to manage bar group representation
  const [isGroup, setIsGroup] = useState(false);
  // State to manage time period category
  const [timePeriod, setTimePeriod] = useState("month");
  // State to manage date range for the DatePicker
  // const [dateRange, setDateRange] = useState([
  //   dayjs().subtract(11, "month"), // Initial start date: 12 months ago from today
  //   dayjs(), // Initial end date: today
  // ]);
  const [dateRange, setDateRange] = useState([
    dayjs('2023-08-15'), 
    dayjs('2023-10-06'), 
  ]);
  const exportRef = useRef();

  // State to manage grouping option
  const [currentGroup, setCurrentGroup] = useState("none")
  // State to manage subtitles for different charts
  const [subTitle, setSubTitle] = useState("")
  // State to manage visibility of a chart
  // const [showChart, setShowChart] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // useEffect(() => {
  //   console.log("Delaying Chart rendering")
  //   if(chart === "entering leaving")
  //   {
  //    const timer = setTimeout(() => {
  //     setShowChart(true);
  //     setLoading(true)
  //    }, 3000); // 3000 milliseconds = 3 seconds

  //     // Clean up the timer if the component unmounts
  //   return () => clearTimeout(timer);
  //   }

  // }, [currentGroup]);

  // Fetch data whenever the dateRange changes
  useEffect(() => {
    if(dateRange)
    {
      fetchDataforActivityTrend();
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
    if(visual==="line")
    {
      if(apiFilter==="harbor")
      {
        subtitle = `Aggregated merchant vessel data for the specified date range, providing insights into the number of vessels present at KARACHI, PORT QASIM, and GWADAR ports.`;
        setSubTitle(subtitle);
      }
      else if(apiFilter==="type")
      {
        subtitle = `Aggregated merchant vessel data for the specified date range, providing insights into the vessel count that is categorized by vessel type.`;
        setSubTitle(subtitle);
      }

    }
    else if(visual==="bar")
    {
      if(apiFilter==="harbor")
      {
        subtitle = `Merchant vessel data for the specified date range, providing insights into the number of vessels present at KARACHI, PORT QASIM, and GWADAR ports.`;
        setSubTitle(subtitle);
      }
      else if(apiFilter==="type")
      {
        subtitle = `Merchant vessel data for the specified date range, providing insights into the vessel count that is categorized by vessel type.`;
        setSubTitle(subtitle);
      }
      else if(apiFilter==="harbor and type")
      {
        subtitle = `Merchant vessel data for the specified date range, providing insights into the vessel count that is , categorized by vessel type, present at the ports.`;
        setSubTitle(subtitle);
      }
      
    }
    else if(visual==="pie")
    {
      if(apiFilter==="harbor")
      {
        subtitle = `Aggregated merchant vessel data for the specified date range, providing insights into the number of vessels present at KARACHI, PORT QASIM, and GWADAR ports.`;
        setSubTitle(subtitle);
      }
      else if(apiFilter==="type")
      {
        subtitle = `Aggregated merchant vessel data for the specified date range, providing insights into the vessel count that is categorized by vessel type.`;
        setSubTitle(subtitle);
      }
    }
    else if(visual==="sunburst")
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
    else{
      // setApiFilter("harbor");
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
    if (value === "line") {
      setFilteredData([]);
      setApiFilter("harbor");
      setTimePeriod("month")
    }
    else if (value === "bar") {
      setFilteredData([]);
      setApiFilter("harbor");
      setApiHarbor([]);
      setTimePeriod("month")
    }
    else if (value === "pie") {
      setFilteredData([]);
      setApiFilter("harbor");
    }
    else if (value === "sunburst") {
      setFilteredData([]);
      setApiFilter("harbor and type");
    }
  }

  // const handleVisualChange = (value) => {
  //   if(value==="activity")
  //   {
  //     setFilteredData([]);
  //     setVisual("line");
  //     setApiFilter("harbor");
  //   }
  //   else if(value==="entering leaving")
  //   {
  //     // message.warning("Deselect Harbor/Type to set data filter to Date");
  //     setFilteredData([]);
  //     setVisual("bar");
  //     setCurrentGroup("none");
  //     setApiFilter("all");
  //     //console.log("Enter Leave Data: ", visual, filteredData)
  //   }
  //   setChart(value);
  // }

  const handleVesselTypeChange = (value) => {
    if(value==='View All')
    {
      setVesselType([]);
    }
    else
    {  
      setVesselType(value);
    }
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
  }

  const handleFilterChange = (value) => {
    if (visual === "line") {
      setApiFilter(value);
      setTimePeriod("month");
    } else 
    {
      if (value.length === 0) {
        message.warning("At least one type must be selected");
      }
      else 
      { 
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
        setApiFilter(filter);
      }}
  };

  const handleTimeChange = (value) => {
    setTimePeriod(value)
  }
  
  const fetchDataforActivityTrend = async () => {
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
    try {
     
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/mer_visual_act_trend?date_from=${dateFrom}&&date_to=${dateTo}&&filter=${apiFilter}&&${queryString}`
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
      if(visual.includes("line"))
      {  //concatinate the month and year value
        const extractedData = data.map((item) => {
          const { Month, Year, Date, Week_Start, Week_End, ...rest } = item;
          return {
            data: Object.entries(rest).map(([location, value]) => {

              const entry = {
                location,
                value,
              };

              if (Date !== undefined) {
                entry.monthYear = `${Date} ${Month} ${Year}`;
              }
              else if(Week_Start !==undefined){
                entry.monthYear = `${Week_Start} - ${Week_End}`;
              }
              else{
                entry.monthYear = `${Month} ${Year}`;
              }
        
              return entry;
            }),
          };
        });

        //location extracted
        const locations = extractedData.flatMap((item) =>
          item.data.map((entry) => entry.location)
        );
        const uniqueLocations = [...new Set(locations)];

        //grouped the location according to the month  and year
        const groupedData = uniqueLocations.map((location) => ({
          location,
          data: extractedData.flatMap((item) =>
            item.data.filter((entry) => entry.location === location)
          ),
        }));
        // console.log(groupedData)
        setFilteredData(groupedData);
      }
      else if(visual.includes("bar") && apiFilter!== "harbor and type" )
      {
        const transformedData = data.flatMap((item) => {
          const { Month, Year, Date, Week_Start, Week_End, ...rest } = item;
          // const startDate = item["Week Start"];
          // const endDate = item["Week End"];

          if(currentGroup!=="time" && currentGroup!=="none")
          {  
            return Object.entries(rest).map(([date, value]) => (
              {
                //name: date, // Use the port name as the "name"
                name: `${Month} ${Year}`,
                date: date, // Combine start and end dates as the "date"
                value: value, // Use the count value as the "value"
            }));
          }
          else if(currentGroup==="time")
          {  
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
          else if(currentGroup==="none")
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
        setFilteredData(transformedData);
      }
      else if(visual.includes("bar") && apiFilter.includes("harbor and type"))
      {
        const transformedData = data.flatMap((item) => {
          const { Year, Month, ...rest } = item;
          return Object.entries(rest).flatMap(([portName, portData]) => {
            return Object.entries(portData).map(([category, value]) => (
              {
                name: category, // Use the port name as the "name"
                date: `${portName}`, // Combine Month and Year as the "date"
                value: value, // Use the category's value as the "value"
            }));
          });
        });
        
          console.log("3D transformedData", transformedData)
          setFilteredData(transformedData);
      }
      else if(visual.includes("pie")){
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
      else if(visual.includes("sunburst")){
        console.log("Sunburst data formation")

        if(apiFilter==="harbor and type")
        {
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
              let yearNode = locationNode.children.find(
                (node) => node.name === Year
              );
              if (!yearNode) {
                yearNode = {
                  name: Year,
                  children: [],
                };
                locationNode.children.push(yearNode);
              }
        
              // Check if the month node exists, create if not
              let monthNode = yearNode.children.find(
                (node) => node.name === Month
              );
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
                let vesselNode = monthNode.children.find(
                  (node) => node.name === vesselType
                );
                if (!vesselNode) {
                  vesselNode = {
                    name: vesselType,
                    value: vesselTypes[vesselType],
                  };
                  monthNode.children.push(vesselNode);
                }
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

                if (Month && Year) {
                  // Check if the year node exists, create if not
                  let yearNode = locationNode.children.find(
                    (node) => node.name === Year
                  );
                  if (!yearNode) {
                    yearNode = {
                      name: Year,
                      children: [],
                    };
                    locationNode.children.push(yearNode);
                  }
  
                  // Check if the month node exists, create if not
                  let monthNode = yearNode.children.find(
                    (node) => node.name === Month
                  );
                  if (!monthNode) {
                    monthNode = {
                      name: Month,
                      children: [],
                      value: item[locationName],
                      // value: item[locationName].departures,
                    };
                    yearNode.children.push(monthNode);
                  }
                }
              });
            });
            return root;
          }
          
          const transformedData = transformData(data);
          console.log(transformedData);
          setFilteredData(transformedData);
        }
      }
      setLoading(false); // Set loading state to false after data is fetched
    } catch (error) {
      setError(error.message); // Set error state if data fetching fails
      setLoading(false); // Set loading state to false after data is fetched
      console.log(error)
      if (error.message) {
        showToastError(`Error : ${error.message}.`);
      }
    }
  };

  return (
    <>
      <div style={{ overflowY: "hidden" }}>

        <Visualpageheader/>

        <div className="flex justify-end items-center p-6">
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
              defaultValue="bar"
            >
              <Option value="line">Line Chart</Option>
              <Option value="bar">Bar Graph</Option>
              <Option value="pie">Pie Chart</Option>
              <Option value="sunburst">Sunburst Chart</Option>
            </Select>
          </div>
         {/* {!visual.includes("sunburst") && (  */}
          <div className="px-2">
            <div>
              <p className="font-bold">Data Group</p>
              {/* <p className="font-bold">Graph Parameters</p> */}
            </div>
            <Select
              //mode={visual === "line" ? "default" : "multiple"}
              mode={visual === "line" || visual === "pie"  ? "default" : "multiple"}
              //mode={visual !== "bar" ? "default" : visual === "bar" && chart === "activity" ? "multiple" : "default"}
              placeholder="Select Chart"
              style={ visual === "bar" ? ({
                width: 220,
                height: "1rem",
              }): ({
                width: 150,
                //height: "1rem",
              })}
              onChange={handleFilterChange}
              // value={apiFilter}
              value={
                visual !== "bar"
                  ? apiFilter
                  : apiFilter === "harbor"
                  ? ["harbor"]
                  : apiFilter === "type"
                  ? ["type"]
                  : ["harbor", "type"]
              }
            >
              <>
                <Option value="harbor">Harbor</Option>
                <Option value="type">Vessel Type</Option>
              </>
            </Select>
          </div>
          {apiFilter.includes("harbor") && visual.includes("line") && (
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
          {apiFilter==="harbor and type" && visual.includes("bar") && (
            <div className="px-2">
               {/* && chart.includes("activity")  */}
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
          {/* Select Vessel */}
          {apiFilter.includes("type") && visual.includes("line") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Type</p>
            </div>
            <Select
              placeholder="Select Type"
              style={{
                width: 150,
              }}
              //defaultValue="Tanker"
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
          { apiFilter==="harbor and type" && visual.includes("bar") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Type</p>
            </div>
            <Select
              placeholder="Select Type"
              style={{
                width: 150,
              }}
              //defaultValue="Tanker"
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
              <Option value="time">Time Wise</Option>
            </Select>
          </div>
          )}
           {/* time category */}
          {visual.includes("line") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Time</p>
            </div>
            <Select
              placeholder="Select time category"
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
          {visual.includes("bar") && currentGroup.includes("time") && (
            <div className="px-2">
            <div>
              <p className="font-bold">Time</p>
            </div>
            <Select
              placeholder="Select time category"
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
              defaultValue={dateRange}
                format="DD-MM-YYYY"
            />
          </div>
          <Button onClick={() => exportAsImage(exportRef.current, "Merchant-Activity-Trend", dateRange)}
            className="rounded yellow-midnight bg-yellow text-black mr-1 ml-2 inline-flex items-center custom-css-pageheaderButton mt-5">
            <div className="flex items-center gap-x-3">
              <FaFileDownload />
              Save as Image
            </div>
          </Button>
        </div>
        <Row ref={exportRef}>
          {contextHolder}
          <Col span={24}>
            {loading ? (
              <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
            ) :  visual === "line" ? (
              <DemoLine
                title="Merchant Activity"
                subTitle={subTitle} 
                data={filteredData}
              />
            ) : visual === "bar" ? (
              <BasicBar
                isGroup={isGroup}  
                //isGroup={apiFilter === "harbor and type" ? true : false}
                title="Merchant Activity"
                subTitle={subTitle}
                data={filteredData}
                groupby={currentGroup}
              />
            ) : visual === "pie" ? (
              <PieChart
                title="Merchant Activity"
                subTitle={subTitle}
                data={filteredData}
              />
            ) : visual === "sunburst"? (
              <Sunburst
                title="Merchant Activity - Sunburst"
                subTitle={subTitle}
                data={filteredData}
              />
            ) : ( <p>Loading chart...</p>) }
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FishingActivityTrends;
