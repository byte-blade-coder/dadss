import React, { useState, useEffect } from 'react';
//import { BidirectionalBar } from '@ant-design/charts';
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const DivergingBarChart = dynamic(
    () => import("../../src/components/barchart/StackedBarChart2Directional"),
    {
      ssr: false,
      loading: () => (
        <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
      ),
    }
  );
// const BidirectionalBar = dynamic(
//     () => import('@ant-design/charts/lib/plots/bidirectional-bar'),
//     {
//       ssr: false,
//       loading: () => (
//         <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
//       ),
//     }
//   );

const MultiBiDirectionalBar = dynamic(
    () => import("../../src/components/barchart/DivergingGroupedBarChartNivo"),
    {
        ssr: false,
        loading: () => (
        <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
        ),
    }
    );

const BiDirectionalGroupedBarChartD3 = dynamic(
    () => import("../../src/components/barchart/BiDirectionalGroupedBarChartD3"),
    {
      ssr: false,
      loading: () => (
        <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
      ),
    }
  );
//component 1
// const DemoBidirectionalGroupedBar = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // Simulate data fetching
//     const fetchedData = [
//       { port: 'KARACHI', type: 'arrival', value: 131 },
//       { port: 'KARACHI', type: 'departure', value: 112 },
//       { port: 'PORT QASIM', type: 'arrival', value: 72 },
//       { port: 'PORT QASIM', type: 'departure', value: 75 },
//       { port: 'KARACHI', type: 'arrival', value: 214 },
//       { port: 'KARACHI', type: 'departure', value: 232 },
//       { port: 'PORT QASIM', type: 'arrival', value: 123 },
//       { port: 'PORT QASIM', type: 'departure', value: 130 },
//     ];
//     setData(fetchedData);
//   }, []);

//   const config = {
//     data,
//     xField: 'port',
//     yField: ['arrival', 'departure'],
//     seriesField: 'type',
//     layout: 'vertical',
//     isGroup: true,
//     color: ['#4083DE', '#59CB89'], // Customize colors as needed
//     barWidthRatio: 0.3,
//     label: {
//       position: 'middle',
//       style: {
//         fill: '#FFFFFF',
//         opacity: 0.6,
//       },
//     },
//     yAxis: {
//       max: 300, // Adjust the max value as needed
//     },
//   };

//   return <BidirectionalBar {...config} />;
// };

// export default DemoBidirectionalGroupedBar;


//component 2 //fazool tareen
// const data = [
//   { name: 'KARACHI', arrivals: 131 + 214, departures: 112 + 232 },
//   { name: 'PORT QASIM', arrivals: 72 + 123, departures: 75 + 130 },
// ];

// function App() {
//   return (
//     <div className="App">
//       <h1>Bidirectional Grouped Bar Chart</h1>
//       <BiDirectionalGroupedBarChartD3 data={data} />
//     </div>
//   );
// }

// export default App;

//component 3

// const data = [
//     {
//         "Year": 2023,
//         "Month": "August",
//         "KARACHI": {
//             "arrival": 31,
//             "departure": -12
//         },
//         "PORT QASIM": {
//             "arrival": 7,
//             "departure": -5
//         },
//     },
//     {
//         "Year": 2023,
//         "Month": "September",
//         "KARACHI": {
//             "arrival": 14,
//             "departure": -32
//         },
//         "PORT QASIM": {
//             "arrival": 23,
//             "departure": -30
//         },
//     },
// ];

// const transformData = (data) => {
//     // Flatten and transform the data
//     return data.flatMap(item => {
//         const { Year, Month, ...ports } = item;
//         return Object.entries(ports).flatMap(([port, counts]) => {
//             return [
//                 // {
//                 //     id: port,
//                 //     month: `${Month} ${Year}`,
//                 //     type: 'arrival',
//                 //     value: counts.arrival
//                 // },
//                 // {
//                 //     id: port,
//                 //     month: `${Month} ${Year}`,
//                 //     type: 'departure',
//                 //     value: counts.departure
//                 // }
//                 {
//                     id: port,
//                     month: `${Month} ${Year}`,
//                     departure: counts.departure,
//                     arrival: counts.arrival
//                 },
//             ];
//         });
//     });
// };

// const formatteddata = transformData(data)

const HomePage = () => {

    const [apiFilter, setApiFilter] = useState("harbor");
    //State to set chart or graph type
    const [visual, setVisual] = useState("bar");
    //State to set visual type
    const [chart, setChart] = useState("activity");
    //State to set harbor
    const [apiHarbor, setApiHarbor] = useState([]);
    //State to set api query parameter
      const [vesselType, setVesselType] = useState([]);
    // State to store filtered data
    const [filteredData, setFilteredData] = useState([]);
    // State to manage bar group representation
    const [isGroup, setIsGroup] = useState(true);
    // State to manage time period category
    const [timePeriod, setTimePeriod] = useState("month");
    // State to manage date range for the DatePicker
    const [dateRange, setDateRange] = useState([
      dayjs('2023-08-15'), 
      dayjs('2023-10-05'), 
    ]);
    const [currentGroup, setCurrentGroup] = useState("harbor")
    const [showChart, setShowChart] = useState(false);

    // Fetch data whenever the dateRange changes
    useEffect(() => {

        fetchDataforHarborTrend();
    }, []);


    
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
    try {
     
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/mer_visual_harbor?date_from=${dateFrom}&&date_to=${dateTo}&&filter=${apiFilter}&&${queryString}`
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
      if(visual.includes("bar") && apiFilter!== "harbor and type"  && !apiFilter.includes("all") )
      {
        if(currentGroup==="none")
        {
          const transformedData = Object.values(data.reduce((acc, item) => {
            const { Year, Month, Week_End, Week_Start, Date, ...ports } = item;
            console.log("Here is data: ", item)
            
            Object.entries(ports).forEach(([port, values]) => {
                if (!acc[port]) {
                    acc[port] = { date: port, arrival: 0, departure: 0 };
                }
                acc[port].arrival += values.arrival;
                acc[port].departure += -values.departure;
               // acc[port].lastDeparture = values.departure; 
            });
        
            return acc;
          }, {}));

          console.log("transformedData", transformedData)
          setFilteredData(transformedData);
        }
        
        else if(currentGroup!=="time" && currentGroup!=="none") //if currentGroup is harbor or type
        {  
          console.log("Transforming data for: ", currentGroup, ", Grouped type.")

          const transformData = (data) => {
              if (!Array.isArray(data) || data.length === 0) {
                  return {
                    labels: [],
                    datasets: [],
                  };
                }
            const labels = data?.map((item) => `${item.Month} ${item.Year}`);
            const ports = Object.keys(data[0]).filter((key) => !['Year', 'Month'].includes(key));
            
            const datasets = [];
          
            ports.forEach((port) => {
              const arrivalDataset = {
                label: `${port}`,
              //   data: data.map((item) => item[port]?.arrival),
                  data: data.map((item) => (item[port]?.arrival != null ? item[port].arrival : 0)),
                backgroundColor: getRandomColor(),
                stack: 'Stack 0',
              };
          
              const departureDataset = {
                label: `${port}`,
              //   data: data.map((item) => item[port]?.departure),
              data: data.map((item) => (item[port]?.departure != null ? item[port].departure : 0)),
                backgroundColor: getRandomColor(),
                stack: 'Stack 1',
              };
          
              datasets.push(arrivalDataset, departureDataset);
            });
          
            return {
              labels,
              datasets,
            };
          };
          
          const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          };
        
          const transformedData = transformData(data);
          console.log("transformedData", transformedData, "is Grouped?", isGroup)
          setFilteredData(transformedData);
        }

        else if(currentGroup==="time")
        {  
          const transformedData = data.flatMap((item) => {
            const { Month, Year, Date, Week_Start, Week_End, ...rest } = item;
 
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
          });
          console.log("transformedData", transformedData)
          setFilteredData(transformedData);
        }
        
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
                //date: `${portName}\n${Month} ${Year}`, // Combine Month and Year as the "date"
                value: value, // Use the category's value as the "value"
                //name: `${portName}`,
                //date: category,
                //value:
            }));
          });
        });
        
          console.log("transformedData", transformedData)
          setFilteredData(data);
      }
      else if(visual.includes("bar") && apiFilter.includes("all"))
      {
        console.log("Transforming data for: ", "\nfilter: ", apiFilter, " , Grouped type.", currentGroup)
        const formattedData = data.map(item => {
          const { Year, Month, ...rest } = item;
          // return {
          //     date: `${Month} ${Year}`,
          //     ...rest
          // };
          const departure = Math.abs(rest.departure);

          return {
            date:  `${Month} ${Year}`,
            arrival: rest.arrival,
            departure,
          };
        });
        setFilteredData(formattedData);
      }
      //setLoading(false); // Set loading state to false after data is fetched
    } catch (error) {
        console.log("error ", error)
      //setError(error.message); // Set error state if data fetching fails
      //setLoading(false); // Set loading state to false after data is fetched
    }
  };

    return (
        <div style={{ height: 500 }}>
             <DivergingBarChart
                title="Merchant Vessel - Entering Leaving Grouped"
                data={filteredData}
                chart={chart}
                //isGroup={false}
                //currentGroup={currentGroup}
                /> 
        </div>
    );
};

export default HomePage;


