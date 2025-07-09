import { Col, Row, Select } from "antd";
import Link from "next/link";
import * as React from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import NarcControlPanel from "../../utils/NarcControlPanel";

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        color: "orange",
      },
      geometry: {
        type: "Point",
        coordinates: [67.02134942614677, 24.800780549836446],
      },
    },
    // {
    //   type: "Feature",
    //   properties: {
    //     color: "#00FF00",
    //   },
    //   geometry: {
    //     type: "Point",
    //     coordinates: [66.94757003301728, 24.712065119634464],
    //   },
    // },
    {
      type: "Feature",
      properties: {
        color: "blue",
      },
      geometry: {
        type: "Point",
        coordinates: [66.94757003301728, 24.815265119634464],
      },
    },

    {
      type: "Feature",
      properties: {
        color: "#8B8000",
      },
      geometry: {
        type: "Point",
        coordinates: [66.94757003301728, 24.715065119634464],
      },
    },
    // {
    //   type: "Feature",
    //   properties: {
    //     color: "orange",
    //   },
    //   geometry: {
    //     type: "Point",
    //     coordinates: [66.94757003301728, 24.722065119634464],
    //   },
    // },
    {
      type: "Feature",
      properties: {
        color: "green",
      },
      geometry: {
        type: "Point",
        coordinates: [66.94757003301728, 24.725065119634464],
      },
    },
    {
      type: "Feature",
      properties: {
        color: "black",
      },
      geometry: {
        type: "Point",
        coordinates: [66.8762669980501, 24.83678956689398],
      },
    },
    {
      type: "Feature",
      properties: {
        color: "purple",
      },
      geometry: {
        type: "Point",
        coordinates: [66.84399465985969, 24.845513167009678],
      },
    },
    {
      type: "Feature",
      properties: {
        color: "yellow",
      },
      geometry: {
        type: "Point",
        coordinates: [66.99574331390394, 24.8018890200137],
      },
    },
    {
      type: "Feature",
      properties: {
        color: "yellow",
      },
      geometry: {
        type: "Point",
        coordinates: [67.15367177738894, 24.776330602379197],
      },
    },
  ],
};

const layerStyle = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 8,
    "circle-color": ["get", "color"],
  },
};
// const greenLayerStyle = {
//   id: "point",
//   type: "circle",
//   paint: {
//     "circle-radius": 8,
//     "circle-color": "#00FF00",
//   },
// };

const NarcoticsMap = () => {
  const [viewport, setViewport] = React.useState({
    latitude: 24.800780549836446,
    longitude: 67.02134942614677,
    zoom: 10,
    // maxBounds: [
    //   [60.87, -0.76],
    //   [25.15, 77.96]
    // ]
  });
  const handleChange = (value) => {
  };
  return (
    <>
      <Row style={{ marginBottom: 30, padding: 20 }}>
        <Col span={8}>
          <Link href="/">
            back to{" "}
            <span
              style={{ fontSize: 20, fontWeight: "bold", color: "#0659ED" }}
            >
              Dashboard
            </span>
          </Link>
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
          <label className="px-2">Filter</label>
          <Select
            defaultValue="View all"
            style={{
              width: 150,
            }}
            onChange={handleChange}
            options={[
              {
                value: "by Type",
                label: "by Type",
              },
              {
                value: "Heat Map",
                label: "Heat Map",
              },
              {
                value: "Locations",
                label: "Locations",
              },
              {
                value: "by Value",
                label: "by Value",
              },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Col span={24}>
          <Map
            onViewportChange={setViewport}
            {...viewport}
            style={{ width: "100%", height: "69vh" }}
            mapboxAccessToken="pk.eyJ1IjoiYWhtZWRtdXN0YWZhMTIzNCIsImEiOiJjbGQ0N2Z3aDEwOHdjM29tZGptcWdhZjUxIn0.DQxoDg5UgKUAWDeavSrseQ"
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            <Source id="points" type="geojson" data={geojson}>
              <Layer {...layerStyle} sourceId="points" />
            </Source>
          </Map>
          <NarcControlPanel />
        </Col>
      </Row>
    </>
  );
};

export default NarcoticsMap;
