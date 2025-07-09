import React, { useState } from "react";

function ControlPanel(props) {
  const { setHeat, setValue, value } = props;
  const handleClick = (event) => {
    const barWidth = event.currentTarget.offsetWidth;
    const clickPosition = event.nativeEvent.offsetX;
    const newValue = Math.ceil((clickPosition / barWidth) * 10);
    setValue(newValue);
  };

  const handleHeat = (e) => {

    setHeat(e);
  };
  return (
    <div
      style={{
        position: "absolute",
        top: 485,
        left: 385,
        backgroundColor: "white",
        padding: 5,
        borderRadius: 3,
        width: "330px",
      }}
    >
      <h3 className="p-2" style={{ fontSize: 20 }}>
        Layer 1
      </h3>
      <hr />
      {/* <div className="input p-2">
        <input
          type="checkbox"
          name="allday"
          style={{ marginRight: 20 }}
          // checked={allDays}
          // onChange={evt => onChangeAllDays(evt.target.checked)}
        /> */}
      <p className="px-2" style={{ fontSize: 16, paddingTop: 10 }}>
        Boat (Count - Distinct)
      </p>
      {/* </div> */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 18,
          paddingTop: 10,
        }}
      >
        {/* <label style={{ paddingRight: 20 }}>Each Day:</label> */}
        {/* <input
          type="range"
          style={{ background: "green"}}
          // min={1}
        /> */}
        {/* <div style={{ width: "100%" }}>
          <Slider
            trackStyle={{ backgrounColor: "blue" }}
            marks={marks}
            included={false}
            onChange={handleHeat}
            defaultValue={100}
          />
        </div> */}
        {/* <GradientBar marks={marks} onChange={handleHeat} defaultValue={10} /> */}
        <div
          onChange={handleHeat}
          defaultValue={10}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              marginLeft: "10px",
              width: "300px",
              height: "17px",
              border: "1px solid black",
              background:
                "linear-gradient(to right,darkblue, blue, green, yellow, orange, red)",
            }}
            onClick={handleClick}
          />
          <div style={{ marginLeft: "4px" }}>
            {/* {value} */}
            {value === 1 && <div></div>}
            {value === 2 && <div></div>}
            {value === 3 && <div></div>}
            {value === 4 && <div></div>}
            {value === 5 && <div></div>}
            {value === 6 && <div></div>}
            {value === 7 && <div></div>}
            {value === 8 && <div></div>}
            {value === 9 && <div></div>}
            {value > 9 && <div></div>}
          </div>
        </div>
      </div>
      {/* <hr /> */}
      {/* <p>
        Data source:
        <a href="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson">
          geojson
        </a>
      </p> */}
    </div>
  );
}

export default React.memo(ControlPanel);
