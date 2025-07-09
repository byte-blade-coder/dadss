import React, { useState, useEffect } from "react";
import { BidirectionalBar } from '@ant-design/plots';
import { Column } from "@ant-design/plots";
import { Col, Row, Select, Tooltip } from "antd";
import { FaRegQuestionCircle  } from "react-icons/fa";
import {generateColors} from "../../helper/colorPalette";
import Heading from "../../../src/components/title/Heading";
import { LoadingOutlined } from "@ant-design/icons";
import { GrCircleInformation } from "react-icons/gr"; 

const DemoBidirectionalBar = (props) => {
  const { title, subTitle, data, isGroup } = props;
  // console.log(props)

  const [check, setCheck] = useState(false);

  useEffect(() => {
    const dataStatus = checkData(data);
  
    if(dataStatus === 'rightData')
    {
      setCheck(true)
      // setFilteredData(data);
    }
    else if(dataStatus === 'noData' || dataStatus === 'wrongdata')
    {
      setCheck(false)
      // setFilteredData(null);
   }
  
  }, [data]);

  const checkData = (data) => {
    if (!data || data.length === 0) {
      return 'noData';
    }
  
    // Check if data has labels or datasets directly
    if (data.labels || data.datasets) {
      return 'wrongdata';
    }
    else  return 'rightData';
  };


  const config = {
    // data,
    xField: 'date',
    //xField: 'name',
    //seriesField: 'type',
    //isGroup: 'true',
    layout: 'vertical',
    // color: ['green', 'blue'], 
    color: ['green', 'blue'], 
    barWidthRatio: 0.3,
    // label: {
    //     position: 'middle',
    //     style: {
    //         fill: '#FFFFFF',
    //         opacity: 0.6,
    //     },
    // },
    style: {
      fill: (d) => {
        if (d.groupKey === 'arrival') return '#64DAAB';
        return '#6395FA';
      },
    },
    yField: ['arrival', 'departure'],
    // yField: 'value',
    yAxis: {
      arrival: {
        min: 0, // Set minimum value for the 'arrivals' y-axis
        //max: 400, // Set maximum value for the 'arrivals' y-axis
        title: {
          text: 'Arrivals',
        },
      },
      departure: {
        min: 0, // Set minimum value for the 'departures' y-axis
        //max: 400, // Set maximum value for the 'departures' y-axis
        title: {
          text: 'Departures',
        },
      },
    },
    // xAxis: {
    //   date: {
    //     title: {
    //       font: {
    //         size: 24,
    //       }
    //     }
    //   }
    // }
  };
  // return <BidirectionalBar {...config} />;
 
  return (
    <>
     {!data && (
        <div>
          
          <p> </p>
          {/* <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
            <p style={{ fontSize: 24 }}>{title} </p>
            <p style={{ fontSize: 16 }}> {subTitle}</p>
          </div>
          <div>No data available for the chart.</div> */}
        </div>
      )
    }

      {check ? (<Row
        style={{
          display: "flex",
          justifyContent: "center",
          background: "white",
          padding: "20px 5px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: 10,
        }}
      >
        <Col span={22}>
          <Tooltip title={subTitle}>
            <div className="flex">
              <Heading className="ml-5" level={3} text={title} />
              {subTitle && <FaRegQuestionCircle  className="ml-1 mt-2" size={18} />}
            </div>
          </Tooltip>
          {/* <p style={{ fontSize: 24 }}>{title}</p>
          <p style={{ paddingBottom: 20 }}>{subTitle}</p> */}
        <BidirectionalBar data={data} {...config} />
        </Col>
      </Row>) : (
        <div>
            <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
        </div>
      )}
    </>
  );
};

export default DemoBidirectionalBar;
