import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import testingData from "./tempData";

const classBreakStyles = {
  "< 35%": {
    fillColor: "#0000ff50",
    weight: 3,
    color: "#0000ff",
    fillOpacity: 0.5,
  },
  "35 - 50%": {
    fillColor: "#00ff0050",
    weight: 3,
    color: "#00ff00",
    fillOpacity: 0.5,
  },
  "50 - 75%": {
    fillColor: "#ffff0050",
    weight: 3,
    color: "#ffff00",
    fillOpacity: 0.5,
  },
  "> 75%": {
    fillColor: "#ff000050",
    weight: 3,
    color: "#ff0000",
    fillOpacity: 0.5,
  },
};

const getStyle = (value) => {
  if (value <= 35) return classBreakStyles["< 35%"];
  if (value > 35 && value <= 50) return classBreakStyles["35 - 50%"];
  if (value > 50 && value <= 75) return classBreakStyles["50 - 75%"];
  return classBreakStyles["> 75%"];
};

const ChoroplethMap = () => {
  const [geoJSONData, setGeoJSONData] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [areaCount, setAreaCount] = useState(geoJSONData.features.length);

  const _onCreated = async (e) => {
    const layer = e.layer;
    const latLngs = layer.getLatLngs()[0];
    const coordinates = latLngs.map((latLng) => [latLng.lng, latLng.lat]);

    let temp = [];
    for (let i = 0; i < testingData.length; i++) {
      if (
        coordinates[2][0] > testingData[i].geometry.coordinates[0] &&
        coordinates[2][1] > testingData[i].geometry.coordinates[1] &&
        coordinates[0][0] < testingData[i].geometry.coordinates[0] &&
        coordinates[0][1] < testingData[i].geometry.coordinates[1]
      ) {
        temp.push(i);
      }
    }

    const nPercentage = Math.floor((temp.length / testingData.length) * 100);

    setAreaCount((prevCount) => {
      const newCount = prevCount + 1;

      const newFeature = {
        type: "Feature",
        properties: {
          name: `Area ${newCount}`,
          value: nPercentage,
        },
        geometry: {
          type: "Polygon",
          coordinates: [coordinates],
        },
      };

      layer.feature = newFeature;

      setGeoJSONData((prevData) => ({
        type: "FeatureCollection",
        features: [...prevData.features, newFeature],
      }));

      return newCount;
    });
  };

  const _onDeleted = (e) => {
    const deletedLayers = e.layers;
    const deletedNames = [];

    deletedLayers.eachLayer((layer) => {
      deletedNames.push(layer.feature.properties.name);
    });

    setGeoJSONData((prevData) => ({
      type: "FeatureCollection",
      features: prevData.features.filter(
        (feature) => !deletedNames.includes(feature.properties.name)
      ),
    }));

    setAreaCount((prevCount) => Math.max(0, prevCount - deletedNames.length));
  };

  useEffect(() => {
    if (geoJSONData.features.length) {
      console.log("geoJSONData", geoJSONData.features);
    }
  }, [geoJSONData.features]);

  return (
    <MapContainer
      center={[24, 65]}
      zoom={6}
      style={{ height: "70vh", width: "100%" }}
    >
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={_onCreated}
          onDeleted={_onDeleted}
          draw={{
            rectangle: {
              showArea: false
            },
            polyline: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polygon: false,
          }}
        />
      </FeatureGroup>

      <TileLayer
        url={`${process.env.NEXT_PUBLIC_SERVER_MAPS_ENDPOINT}/my-offline-tiles/DGVtiles/{z}/{x}/{y}.png`}
        maxZoom={7}
        minZoom={1}
      />

      {geoJSONData.features.length > 0 &&
        geoJSONData.features.map((feature, index) => (
          <GeoJSON
            key={index} // Add a unique key for each GeoJSON component
            data={feature}
            style={getStyle(feature.properties.value)}
            onEachFeature={(featureMin, layer) => {
              if (featureMin.properties && featureMin.properties.name) {
                layer.bindPopup(featureMin.properties.name);
              }
            }}
          />
        ))}
    </MapContainer>
  );
};

export default ChoroplethMap;