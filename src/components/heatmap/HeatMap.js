import React, { useEffect, useMemo, useState } from "react";
// import ReactMapGL from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
import { Select, Switch } from "antd";
// import * as React from "react";
import Map, { Source, Layer } from "react-map-gl";
// import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// import { heatmapLayer } from "../../utils/mapStyle.js";
import ControlPanel from "../../utils/ControlPanel.js";
import { Checkbox, Col, Row } from "antd";
import Heading from "../title/Heading.js";
const Index = () => {
  const [value, setValue] = useState(1);
  const [heatLevel, setHeatLevel] = useState(10);
  let initialHeatColor = [
    "interpolate",
    ["linear"],
    ["heatmap-density"],
    0,
    "rgba(33,102,172,0)",
    0.2,
    "rgb(103,169,207)",
    0.4,
    "rgb(209,229,240)",
    // 0.6,
    // "rgb(253,219,199)",
    0.8,
    "rgb(239,138,98)",
    0.9,
    "rgb(255,201,101)",
  ];
  const [heatColor, setHeatColor] = useState(initialHeatColor);
  const [viewport, setViewport] = useState({
    latitude: 24.800780549836446,
    longitude: 67.02134942614677,
    zoom: 10,
    // maxBounds: [
    //   [60.87, -0.76],
    //   [25.15, 77.96]
    // ]
  });
  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.02134942614677, 24.800780549836446],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.99226599303242, 24.747986132760566],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.78978616434811, 24.8384238794835],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.78978616434811, 24.8291238794835],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.78978616434811, 24.8291238794835],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.77978616434811, 24.8291238794835],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.84379272211923, 24.856201006090885],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.90097613622981, 24.835540861548807],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.9375099841338, 24.81247430145269],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.97298487992462, 24.786038589052712],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.01110715599835, 24.794690897111536],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.06087790912527, 24.75334664683186],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.01957877671207, 24.7922875377221],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.94757003301728, 24.705265119634464],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.94757003301728, 24.805265119634464],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.94757003301728, 24.815265119634464],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.94757003301728, 24.712065119634464],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.94757003301728, 24.715065119634464],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.94757003301728, 24.722065119634464],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.94757003301728, 24.725065119634464],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [66.8219895854309, 24.828665432316253],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.04424383378083, 24.767825566062896],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.04430946553673, 24.757711811504706],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.0461467339108, 24.75493111512516],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.0477879953277, 24.752560652729596],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.04879844138136, 24.751577494451542],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.0500254115894, 24.750397694251],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.05096368292497, 24.74921788285055],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.05190195426053, 24.748234698128346],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.0528402255961, 24.74725150562897],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.05377849693167, 24.746202758391007],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.05276805087797, 24.748431335694992],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.0542837199585, 24.746923773067614],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [67.05579938903901, 24.745678381453946],
        },
      },
    ],
  };

  const MAX_ZOOM_LEVEL = 12;
  // if(heatLevel)
  const heatmapLayer = {
    id: "heatmap",
    maxzoom: MAX_ZOOM_LEVEL,
    type: "heatmap",
    paint: {
      // Increase the heatmap weight based on frequency and property magnitude
      "heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 1],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        1,
        MAX_ZOOM_LEVEL,
        3,
      ],

      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      "heatmap-color": heatColor,
      // Adjust the heatmap radius by zoom level
      "heatmap-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        2,
        MAX_ZOOM_LEVEL,
        40,
      ],

      // Transition from heatmap to circle layer by zoom level
      "heatmap-opacity": 1,
    },
  };

  const onChange = (checkedValues) => {
  };
  useEffect(() => {
    if (value <= 10 && value >= 9) {
      initialHeatColor[12] = "#FF0700";
      setHeatColor(initialHeatColor);
    }
    if (value <= 9 && value >= 8) {
      initialHeatColor[12] = "#FF6E00";

      setHeatColor(initialHeatColor);
    }
    if (value <= 8 && value >= 7) {
      initialHeatColor[12] = "#FFC600";
      setHeatColor(initialHeatColor);
    }
    if (value <= 7 && value >= 6) {
      initialHeatColor[12] = "#FFD700";
      setHeatColor(initialHeatColor);
    }
    if (value <= 6 && value >= 5) {
      initialHeatColor[12] = "#7EBF00";
      setHeatColor(initialHeatColor);
    }
    if (value <= 5 && value >= 4) {
      initialHeatColor[12] = "#4DA600";
      setHeatColor(initialHeatColor);
    }
    if (value <= 4 && value >= 3) {
      initialHeatColor[12] = "#005E45";
      setHeatColor(initialHeatColor);
    }
    if (value <= 3 && value >= 2) {
      initialHeatColor[12] = "#002BA9";
      setHeatColor(initialHeatColor);
    }
    if (value <= 2 && value >= 1) {
      initialHeatColor[12] = "#0000F0";
      setHeatColor(initialHeatColor);
    }
    if (value <= 1 && value >= 0) {
      initialHeatColor[12] = "#00008E";
      setHeatColor(heatColor);
    }
  }, [value]);

  const onHandleChange = (checked) => {
  };
  const handleChange = (value) => {
  };
  return (
    <>
      <Row className="p-4">
        <Col span={4}>
          <div className="flex items-center">
            <p className="text-lg font-bold pr-2">Summer</p>
            <Switch
              style={{ backgroundColor: "gray" }}
              onChange={onHandleChange}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className="flex items-center">
            <p className="text-lg font-bold pr-2">Winter</p>
            <Switch
              style={{ backgroundColor: "gray" }}
              onChange={onHandleChange}
            />
          </div>
        </Col>
        <Col span={6}>
          <label className="px-2">Vessel type:</label>
          <Select
            defaultValue="View all"
            style={{
              width: 150,
            }}
            onChange={handleChange}
            options={[
              {
                value: "View all",
                label: "View all",
              },
              {
                value: "Small",
                label: "Small",
              },
              {
                value: "Medium",
                label: "Medium",
              },
              {
                value: "Large",
                label: "Large",
              },
            ]}
          />
        </Col>
        <Col span={6}>
          <label className="px-2">Year</label>
          <Select
            defaultValue="View all"
            style={{
              width: 150,
            }}
            onChange={handleChange}
            options={[
              {
                value: "View all",
                label: "View all",
              },
              {
                value: "Year 2016",
                label: "Year 2016",
              },
              {
                value: "Year 2017",
                label: "Year 2017",
              },
              {
                value: "Year 2018",
                label: "Year 2018",
              },
              {
                value: "Year 2019",
                label: "Year 2019",
              },
              {
                value: "Year 2020",
                label: "Year 2020",
              },
              {
                value: "Year 2022",
                label: "Year 2022",
              },
            ]}
          />
        </Col>
      </Row>
      <Heading
        level={3}
        className="whitespace-nowrap font-normal "
        text="Fishing Vessel Concentration at Sea/ Fishing Density (POL)"
      />
      <Map
        {...viewport}
        width="100vw"
        height="100vh"
        //  mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={setViewport}
        mapboxAccessToken="pk.eyJ1IjoiYWhtZWRtdXN0YWZhMTIzNCIsImEiOiJjbGQ0N2Z3aDEwOHdjM29tZGptcWdhZjUxIn0.DQxoDg5UgKUAWDeavSrseQ"
        style={{ width: "100%", height: "70vh" }}
        // mapStyle="mapbox://styles/mapbox/dark-v9"
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {geojson && (
          <Source type="geojson" data={geojson}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
        {/* <Source id="my-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source> */}
      </Map>
      <ControlPanel setHeat={setHeatLevel} setValue={setValue} value={value} />
    </>
  );
};

export default Index;
