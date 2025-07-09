import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Heatmap } from "@ant-design/plots";
import { Col, Row } from "antd";

const AntHeatmap = (props) => {
  const { title, subTitle } = props;
  const [data, setData] = useState([
    {
      g: 541,
      l: 85,
      tmp: 858,
    },
    {
      g: 937,
      l: 165,
      tmp: 299,
    },
    {
      g: 566,
      l: 131,
      tmp: 326,
    },
    {
      g: 738,
      l: 130,
      tmp: 262,
    },
    {
      g: 85,
      l: 207,
      tmp: 184,
    },
    {
      g: 321,
      l: 273,
      tmp: 312,
    },
    {
      g: 552,
      l: 153,
      tmp: 367,
    },
    {
      g: 698,
      l: 254,
      tmp: 194,
    },
    {
      g: 409,
      l: 240,
      tmp: 754,
    },
    {
      g: 905,
      l: 84,
      tmp: 891,
    },
    {
      g: 186,
      l: 127,
      tmp: 55,
    },
    {
      g: 636,
      l: 117,
      tmp: 97,
    },
    {
      g: 990,
      l: 29,
      tmp: 549,
    },
    {
      g: 284,
      l: 79,
      tmp: 570,
    },
    {
      g: 28,
      l: 313,
      tmp: 320,
    },
    {
      g: 146,
      l: 204,
      tmp: 206,
    },
    {
      g: 257,
      l: 327,
      tmp: 540,
    },
    {
      g: 277,
      l: 212,
      tmp: 766,
    },
    {
      g: 352,
      l: 343,
      tmp: 944,
    },
    {
      g: 875,
      l: 76,
      tmp: 789,
    },
    {
      g: 969,
      l: 160,
      tmp: 934,
    },
    {
      g: 909,
      l: 153,
      tmp: 779,
    },
    {
      g: 227,
      l: 194,
      tmp: 471,
    },
    {
      g: 618,
      l: 316,
      tmp: 400,
    },
    {
      g: 910,
      l: 98,
      tmp: 289,
    },
    {
      g: 718,
      l: 181,
      tmp: 409,
    },
    {
      g: 285,
      l: 248,
      tmp: 894,
    },
    {
      g: 89,
      l: 303,
      tmp: 567,
    },
    {
      g: 900,
      l: 195,
      tmp: 132,
    },
    {
      g: 780,
      l: 253,
      tmp: 741,
    },
    {
      g: 337,
      l: 243,
      tmp: 715,
    },
    {
      g: 156,
      l: 206,
      tmp: 720,
    },
    {
      g: 238,
      l: 11,
      tmp: 244,
    },
    {
      g: 303,
      l: 174,
      tmp: 320,
    },
    {
      g: 607,
      l: 234,
      tmp: 1,
    },
    {
      g: 460,
      l: 127,
      tmp: 176,
    },
    {
      g: 85,
      l: 235,
      tmp: 548,
    },
    {
      g: 938,
      l: 198,
      tmp: 423,
    },
    {
      g: 336,
      l: 387,
      tmp: 607,
    },
    {
      g: 331,
      l: 1,
      tmp: 535,
    },
    {
      g: 320,
      l: 342,
      tmp: 635,
    },
    {
      g: 620,
      l: 178,
      tmp: 345,
    },
    {
      g: 20,
      l: 275,
      tmp: 561,
    },
    {
      g: 878,
      l: 227,
      tmp: 375,
    },
    {
      g: 42,
      l: 212,
      tmp: 115,
    },
    {
      g: 383,
      l: 12,
      tmp: 422,
    },
    {
      g: 821,
      l: 242,
      tmp: 756,
    },
    {
      g: 737,
      l: 319,
      tmp: 676,
    },
    {
      g: 810,
      l: 180,
      tmp: 834,
    },
    {
      g: 145,
      l: 11,
      tmp: 552,
    },
    {
      g: 119,
      l: 122,
      tmp: 801,
    },
    {
      g: 634,
      l: 198,
      tmp: 816,
    },
    {
      g: 980,
      l: 168,
      tmp: 44,
    },
    {
      g: 595,
      l: 296,
      tmp: 188,
    },
    {
      g: 729,
      l: 100,
      tmp: 88,
    },
    {
      g: 635,
      l: 279,
      tmp: 362,
    },
    {
      g: 40,
      l: 284,
      tmp: 441,
    },
    {
      g: 334,
      l: 238,
      tmp: 231,
    },
    {
      g: 351,
      l: 362,
      tmp: 724,
    },
    {
      g: 70,
      l: 217,
      tmp: 816,
    },
    {
      g: 515,
      l: 245,
      tmp: 567,
    },
    {
      g: 515,
      l: 545,
      tmp: 0,
    },
  ]);

  const { mapdata, isLoading } = useSelector(
    (state) => state.fetchMultiplePatroltypeBasedData
  );

  // useEffect(() => {
  //   asyncFetch();
  // }, []);

  // const asyncFetch = () => {
  //   fetch("https://gw.alipayobjects.com/os/antvdemo/assets/data/heatmap.json")
  //     .then((response) => response.json())
  //     .then((json) => setData(json))
  //     .catch((error) => {
  //     });
  // };
  const config = {
    data,
    type: "density",
    xField: "g",
    yField: "l",
    colorField: "tmp",
    color:
      "#F51D27-#FA541C-#FF8C12-#FFC838-#FAFFA8-#80FF73-#12CCCC-#1890FF-#6E32C2",
    legend: {
      position: "bottom",
    },
    annotations: [
      {
        type: "image",
        start: ["min", "max"],
        // end: ["max", "min"],
        src: "/images/map.png",
      },
    ],
  };

  return (
    <Row
      style={{
        display: "flex",
        justifyContent: "center",
        background: "white",
        padding: "20px 14px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: 10,
      }}
    >
      <Col span={24}>
        <p style={{ fontSize: 24 }}>{title}</p>
        <p style={{ paddingBottom: 20 }}>{subTitle}</p>
        <Heatmap {...config} style={{ height: "70vh" }} />
      </Col>
    </Row>
  );
};

export default AntHeatmap;
