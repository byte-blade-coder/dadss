
import dayjs from "dayjs";
export const resetUserControls = (setters) => {
    const {
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
    } = setters;
  
    if(task==="default")
    {
        console.log("Setting default user controls")
        // setApiFilter("all");
        setCategory("time");
        setVisual("bar");
        // setApiHarbor([]);
        // setVesselType([]);
        // setFilteredData([]);
        setDateRange([
          dayjs('2022-01-01'), 
          dayjs('2022-06-31')
        ]);
        setIsGroup(false);
        setTimePeriod("month");
        setCurrentGroup("harbor");
        // setSubTitle("Setting default subtitle");
    }
    else
    {
        console.log("Resetting user controls")
        setApiFilter("");
        setCategory(null);
        setVisual(null);
        // setApiHarbor([]);
        // setVesselType([]);
        // setFilteredData([]);
        setDateRange([
            dayjs('2022-01-01'), 
            dayjs('2022-06-31')
        ]);
        setIsGroup(false);
        setTimePeriod(null);
        setCurrentGroup(null);
    }
  };
  