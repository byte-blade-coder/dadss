import { Col, Row, Select } from "antd";
import Link from "next/link";
import * as React from "react";
import Map, { Source, Layer } from "react-map-gl";
import * as turf from "@turf/turf";

// const coordinates = [24.800780549836446, 67.02134942614677];
// const splineInterpolate = (line) => {
//   const spline = turf.bezierSpline(line);
//   return spline.geometry.line;
// };
// splineInterpolate()
var line = turf.lineString([
  [67.02134942614677, 24.800780549836446],
  [66.97684719016883, 24.73943689131818],
  [66.8340974759273, 24.667965879965855],
]);
var line1 = turf.lineString([
  [66.89032235640764, 24.82380639434674],
  [66.68528306515881, 24.768774998138564],
  [66.66685924478573, 24.64351475059434],
]);
var line2 = turf.lineString([
  [66.88319055497288, 24.78064658007493],
  [66.75600676271999, 24.755283186362806],
  [66.69182054980732, 24.64675582586195],
]);
var line3 = turf.lineString([
  [66.95213130217539, 24.783884087193506],
  [66.8439656470818, 24.82704277461584],
  [66.66567061121327, 24.80276786171784],
]);

var curved = turf.bezierSpline(line);
var curved1 = turf.bezierSpline(line1);
var curved2 = turf.bezierSpline(line2);
var curved3 = turf.bezierSpline(line3);
var featureCollection = turf.featureCollection([
  curved,
  curved1,
  curved2,
  curved3,
]);

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: curved,
      },
    },
  ],
};
// const curvedGeojson = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",
//       geometry: {
//         type: "LineString",
//         coordinates: turf.bezierSpline(geojson.features[0].geometry.coordinates)
//           .geometry.coordinates,
//       },
//     },
//   ],
// };
// const geojson = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",

//       geometry: {
//         type: "LineString",
//         coordinates: [
//           [67.02134942614677, 24.800780549836446],
//           [66.97684719016883, 24.73943689131818],
//           // [66.94757003301728, 24.712065119634464],
//         ],
//       },
//     },
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
// {
//   type: "Feature",
//   properties: {
//     color: "blue",
//   },
//   geometry: {
//     type: "Point",
//     coordinates: [66.94757003301728, 24.815265119634464],
//   },
// },

// {
//   type: "Feature",
//   properties: {
//     color: "#8B8000",
//   },
//   geometry: {
//     type: "Point",
//     coordinates: [66.94757003301728, 24.715065119634464],
//   },
// },
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
// {
//   type: "Feature",
//   properties: {
//     color: "green",
//   },
//   geometry: {
//     type: "Point",
//     coordinates: [66.94757003301728, 24.725065119634464],
//   },
// },
// {
//   type: "Feature",
//   properties: {
//     color: "black",
//   },
//   geometry: {
//     type: "Point",
//     coordinates: [66.8762669980501, 24.83678956689398],
//   },
// },
// {
//   type: "Feature",
//   properties: {
//     color: "purple",
//   },
//   geometry: {
//     type: "Point",
//     coordinates: [66.84399465985969, 24.845513167009678],
//   },
// },
// {
//   type: "Feature",
//   properties: {
//     color: "yellow",
//   },
//   geometry: {
//     type: "Point",
//     coordinates: [66.99574331390394, 24.8018890200137],
//   },
// },
// {
//   type: "Feature",
//   properties: {
//     color: "yellow",
//   },
//   geometry: {
//     type: "Point",
//     coordinates: [67.15367177738894, 24.776330602379197],
//   },
// },
//   ],
// };

const layerStyle = {
  id: "point",
  type: "line",
  paint: {
    "line-color": "blue",
    "line-width": 2,
  },
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
};
const NarcoticsMap = () => {
  const [viewport, setViewport] = React.useState({
    latitude: 24.800780549836446,
    longitude: 67.02134942614677,
    zoom: 10,
    bearing: 0,
    pitch: 0,
    // maxBounds: [
    //   [60.87, -0.76],
    //   [25.15, 77.96]
    // ]
  });
  const handleChange = (value) => {
  };

  // React.useEffect(()=> {
  //   splineInterpolate(coordinates)
  // }, [])
  return (
    <>
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Col span={24}>
          <Map
            onViewportChange={(newViewport) => setViewport(newViewport)}
            // viewport={viewport}
            {...viewport}
            style={{ width: "100%", height: "69vh" }}
            mapboxAccessToken="pk.eyJ1IjoiYWhtZWRtdXN0YWZhMTIzNCIsImEiOiJjbGQ0N2Z3aDEwOHdjM29tZGptcWdhZjUxIn0.DQxoDg5UgKUAWDeavSrseQ"
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            <Source id="points" type="geojson" data={featureCollection}>
              <Layer {...layerStyle} sourceId="points" />
            </Source>
          </Map>
          {/* <NarcControlPanel /> */}
        </Col>
      </Row>
    </>
  );
};

export default NarcoticsMap;
