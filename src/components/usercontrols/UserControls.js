import React, { useState, useEffect , useRef} from "react";
import dayjs from "dayjs";
import { Col, Row, Select, Button, DatePicker, Tooltip, Segmented, Popover, Checkbox, Divider, Radio  } from "antd";
import {BarChartOutlined, LineChartOutlined, PieChartOutlined} from "@ant-design/icons"
import { resetUserControls } from "../../utils/resetUserControl";
import { exportAsImage } from "../../utils/exportAsImg";
import { merchant_harbor_list, ais_type_summary, harbor_list, type_list,fishing_vessel_types } from "../helper/dropdown";
import { FaFileDownload } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { RxReset } from "react-icons/rx";
import { AiFillFilter } from "react-icons/ai";
import { GrClear } from "react-icons/gr";
import styled from "styled-components";
import SunburstIcon from "../../public/assets/sunburst.svg";
const { RangePicker } = DatePicker;

const UserControlsInterface = ({category, setCategory, visual, setVisual, apiHarbor, setApiHarbor, vesselType, setVesselType, 
    timePeriod, setTimePeriod, currentGroup, setCurrentGroup, handleVesselTypeChange, handleHarborChange, handleCategoryChange, 
    handleTimeChange}) => {

    // const [apiFilter, setApiFilter] = useState("");
    // const [filteredData, setFilteredData] = useState([]);
    // const [dateRange, setDateRange] = useState([
    //     dayjs('2022-01-01'), 
    //     dayjs('2022-06-31'), 
    // ]);
    // const [isGroup, setIsGroup] = useState(false);
    // const [subTitle, setSubTitle] = useState("")
    const [isResetting, setIsResetting] = useState(false);
    const [open, setOpen] = useState(false);

   // Temporary states for popover
   const [tempTimePeriod, setTempTimePeriod] = useState(timePeriod);
   const [tempHarbors, setTempHarbors] = useState(apiHarbor);
   const [tempTypes, setTempTypes] = useState(vesselType);

    useEffect(() => {
        // Reset harbor, vessel type and group_by values whenever apiFilter and/or visual changes
        setApiHarbor([]);
        setVesselType([]);
        // only if Reset is not true
        if (!isResetting) {
        // console.log("useEffect(1): Reset group_by values whenever apiFilter and/or visual changes")
        setCurrentGroup(null);
        }
    }, [category, visual]);

    useEffect(() => {
        // Reset time period whenever apiFilter, visual, currentGroup changes
        // only if Reset is not true
        if (!isResetting) {
        setTimePeriod(null);
        }
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
        // Reset data whenever apiFilter, visual, currentGroup, timePeriod, category changes
        setFilteredData([]);
    }, [apiFilter, visual, category, currentGroup, timePeriod]);

    useEffect(()=> {
        //Reset the category when visual changes only if Reset is not true
        if (!isResetting) {
          setCategory(null);
        }
    }, [visual])

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
    }, [currentGroup]);

    const handleCategoryChange = (value) => {
        setCategory(value);
    };

    const handleVesselTypeChange = (value) => {
        if(value.includes('View All'))
        {
        setVesselType([]);
        }
        else
        {  
        setTempTypes(value);
        // setVesselType(value);
        }
    }

    const handleHarborChange = (value) => {
        if(value.includes('View All'))
        {
        setTempHarbors([]);
        }
        else
        {
        setTempHarbors(value);
        // setApiHarbor(value);
        }
    }

    const handleTimeChange = (event) => {
        setTempTimePeriod(event.target.value)
        // setTimePeriod(event.target.value)
    };

    const hide = () => {
        setOpen(false);
    };

    const clearFilters = () => {
        setApiHarbor([])
        setVesselType([])
        // setTimePeriod('')
    }

    const applyFilters = () => {
        setTimePeriod(tempTimePeriod);
        setApiHarbor(tempHarbors);
        setVesselType(tempTypes);
        setOpen(false); // Close popover after applying
    };

    const cancelFilters = () => {
        setTempTimePeriod(timePeriod)
        setTempHarbors(apiHarbor)
        setTempTypes(vesselType)
        setOpen(false); // Close popover after applying
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const isFilterActive = timePeriod || apiHarbor.length > 0 || vesselType.length > 0;
  
    const harborOptions = [
      ...merchant_harbor_list.map((harbor) => ({
        label: harbor.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
        value: harbor,
      }))
    ];
    
    const vesselTypeOptions = [
      ...ais_type_summary.map((type) => ({
        label: type,
        value: type,
      }))
    ];
  
    const timeUnitOptions = [
      { label: 'Months', value: 'month' },
      { label: 'Weeks', value: 'week'},
      { label: 'Days', value: 'day'},
    ];
  
    const harborFilter = (
      <div className="px-2">
        <div>
          <p className="font-bold mb-2">Select Harbor</p>
        </div>
        <Checkbox.Group
          options={harborOptions}
          defaultValue={['View All']}
          disabled={(category==="harbor" || currentGroup==="harbor") ? false : true}
          onChange={handleHarborChange}
          value={tempHarbors}
          style={{width: "100%", display: 'flex', flexWrap: 'wrap' }}
        />
      </div>
    )
    
    const typeFilter = (
      <div className="px-2">
        <div>
          <p className="font-bold mb-2">Select Vessel Type</p>
        </div>
        <Checkbox.Group
          options={vesselTypeOptions}
          defaultValue={['View All']}
          disabled={(category==="type" || currentGroup==="type") ? false : true}
          onChange={handleVesselTypeChange}
          value={tempTypes}
          style={{width: "100%", display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', textAlign: 'center',alignItems: 'center',  }}
        />
      </div>
    )
    
    const timeGranularity = (
      <div className="px-2">
        <div>
          <p className="font-bold mb-2">Select Time Unit</p>
        </div>
        <Radio.Group 
          options={timeUnitOptions}
          defaultValue={'month'}
          disabled={(category==="time") ? false : true}
          onChange={handleTimeChange} 
          value={tempTimePeriod}/>
      </div>
    )
  
    return (
      <>
        <UserControls className="flex justify-start items-center pl-4 pr-1">
        {/* chart */}
            <div class="px-2">
            <div>
                <p className="font-bold">Chart</p>
            </div>
            <Segmented
                options={[
                    {   
                    label: (<Tooltip title="Line Chart"></Tooltip>),value: 'line', icon: <LineChartOutlined />,},
                    { value: 'bar', icon: <BarChartOutlined />,},
                    { value: 'pie', icon: <PieChartOutlined />,},
                    { value: 'sunburst', icon: <SunburstIcon style={{marginTop: "2px"}}/>,},
                ]}
                onChange={handleChartChange}
                value={visual}
                // style={{
                //   marginBottom: 24,
                // }}
                />
            {/* </div> */}
            </div>
            {/* X-Axis */}
            {/* { visual && visual==="bar" && (
            <div className="px-2">
                <div>
                <p className="font-bold">Row</p>
                </div>
                <Select
                // mode="default"
                placeholder="Select row value"
                style={ visual === "bar" ? ({
                    // width: 220,
                    // height: "1rem",
                    width: 150,
                }): ({
                    width: 150,
                })}
                onChange={handleCategoryChange}
                // value={category}
                >
                <>
                <Option value="time">Time</Option>
                <Option value="harbor">Harbor</Option>
                <Option value="type">Vessel Type</Option>
                </>
                </Select>
            </div> )
            }
            { visual && visual==="line" && (
            <div className="px-2">
                <div>
                <p className="font-bold">Row</p>
                </div>
                <Select
                // mode="default"
                placeholder="Select row value"
                style={{
                    width: 150,
                }}
                onChange={handleCategoryChange}
                defaultValue="time"
                >
                <>
                <Option value="time">Time</Option>
                </>
                </Select>
            </div> )
            }
            { visual && visual==="pie" && (
            <div className="px-2">
                <div>
                <p className="font-bold">Row</p>
                </div>
                <Select
                // mode="default"
                placeholder="Select row value"
                style={{
                    width: 150,
                }}
                onChange={handleCategoryChange}
                >
                <>
                <Option value="harbor">Harbor</Option>
                <Option value="type">Vessel Type</Option>
                </>
                </Select>
            </div> )
            } */}
            {/* X-Axis / Catgeory with disabled options */}
            { visual && !visual.includes("sunburst") && (
            <div className="px-2">
                <div>
                <p className="font-bold">{visual === "pie" ? "Category" : "X-axis"}</p>
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
                <Option value="harbor">Harbor</Option>
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
                <Option value="type">Type</Option>
                <Option value="time">Time</Option>
            </Select>
            </div>
            )}
            {category==="time" && (
            <div className="px-2">
            <div>
                <p className="font-bold">{visual === "line" ? "Category" : "Group By"}</p>
            </div>
            <Select
                placeholder={visual === "line" ? "Select category": "Select group by"}
                style={{
                width: 150,
                }}
                onChange={handleGroupByChange}
                // defaultValue={"none"}
                value={currentGroup}
            >
                {visual!=="line" && <Option value="none">None</Option>}
                <Option value="harbor">Harbor</Option>
                <Option value="type">Type</Option>
            </Select>
            </div>
            )}            
            {((visual && visual.includes("bar")) || (visual && visual.includes("line")))  && currentGroup && (
            <FilterDiv>
                <div>
                <p className="font-bold">Filters</p>
                </div>
                <Popover
                content={(<div><div className="flex justify-end"><a className="mr-2" onClick={hide} style={{marginTop: "-6px",fontSize: "14px"}}>x</a>
                </div>{timeGranularity}<Divider />{harborFilter}<Divider />{typeFilter}<Divider />
                <div className="inline-flex justify-between w-full"><p className="clear-filters ml-2 text-red font-medium" onClick={clearFilters}>Clear All Filters</p>
                <div className="flex"><p className="apply-filters mr-3 text-darkgray font-medium" onClick={cancelFilters}>Cancel</p>
                <p className="apply-filters mr-2 text-navyblue font-bold" onClick={applyFilters}>Apply</p></div></div></div>)}
                // title="Title"
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
                >
                <Button className="popover-btn rounded bg-white text-darkgray mr-1 ml-1 inline-flex items-center 
                    custom-css-pageheaderButton" style={{padding: "4px 10px"}}>
                    <div className="flex items-center">
                    <AiFillFilter size={22} color={isFilterActive ? "#0958d9" : "#555555"} />
                    </div>
                </Button>
                </Popover>
            </FilterDiv>
            )}
            {visual && category && currentGroup && (
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
            )}
            {/* time resolution */}
            {/* Select Harbor */}
            {apiFilter && apiFilter==="harbor and type"}
        </UserControls>
      </>
    );
  };
  
  const UserControls = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 1rem; /* 16px pl-4*/
    padding-right: 0.25rem; /* 4px pr-1*/
  
    .ant-segmented{
      display: inline-flex;
      align-items: center;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      transition: border 0.2s, box-shadow 0.2s;
      color: rgba(0, 0, 0, 0.88);
      padding: 0px 0px 0px; font-size: 24px; background-color: #fff
    }
    .ant-segmented-group{
      gap: 1px;
    }
    .ant-segmented-item{
      padding: 0px 0px 1px;
    }
    .ant-segmented-item:hover{
      background-color: lightgray;
      font-weight: 500;
    }
    .ant-segmented .ant-segmented-item-selected {
      //  #4096ff;
      background-color: rgba(6,57,112,0.9);
      color: rgba(255, 255, 255, 0.88);
      font-weight: 500;
    }
    .ant-segmented .ant-segmented-item-label {
      padding: 0 8px 2px;
      line-height: 22px;
    }
    // .ant-segmented-item-label:hover{
    //   background-color: rgba(6,57,112,0.9);
    // }
  
  `;
  
  const FilterDiv = styled.div`
    .ant-popover{
      width: 30rem !important;
    }
    .ant-btn .popover-btn:active{
      color: #063970 !important;
    }
    .ant-divider-horizontal{
      margin: 12px 0px !important;
    }
  `;

export default UserControlsInterface;
  