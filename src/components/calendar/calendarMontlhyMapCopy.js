import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// Extend dayjs with the plugin
dayjs.extend(isSameOrAfter);

import "dayjs/locale/en";
import { Col, Row } from "antd";

const HeatMonth = ({ datas, title, subTitle }) => {
  console.log(datas)
  const [fullYearData, setFullYearData] = useState([]);
  const [ships, setShips] = useState([]);
  const [months, setMonth] = useState([]);

  dayjs.extend(utc);

  let chartRefs = useRef(null);

  useEffect(() => {
    const uniqueShips = Array.from(new Set(datas.map((entry) => entry.ship)));
    const yearBackFromNow = dayjs().subtract(1, "year").startOf("year");
    const today = dayjs();
    const dateArray = Array.from({ length: 12 }, (_, i) =>
      dayjs().startOf("year").add(i, "month").format("MMM")
    );

    setShips(uniqueShips);
    setMonth(dateArray);

    const response = uniqueShips.map((ship) => {
      const shipEntries = datas.filter((entry) => entry.ship === ship);
      const contributionsByMonth = Array.from({ length: 12 }, (_, i) => {       
        console.log(i)
        const year = 2024;
        // const monthStart = dayjs().startOf("year").add(0, "month");
        // const monthEnd = monthStart.add(1, "month").subtract(1, "day");

        const monthStart = dayjs().year(year).startOf("year").add(i, "month");
        const monthEnd = monthStart.add(1, "month").subtract(1, "day");

        console.log("Ship Entries for " + ship + ":", shipEntries);

        console.log("Month Start:", monthStart.format("YYYY-MM-DD"));
        console.log("Month End:", monthEnd.format("YYYY-MM-DD"));

        const sampleEntries = datas.filter((entry) => 
         {dayjs(entry.date).isSameOrAfter(monthStart) && dayjs(entry.date).isBefore(monthEnd),
          console.log( dayjs(entry.date).isSameOrAfter(monthStart), 
          dayjs(entry.date).isBefore(monthEnd.add(1, 'day')), entry)
         }
        )
        // .reduce((acc, entry) => {acc + entry.contributions, console.log(acc,  entry)}, 0);;
        // .add(1, 'day')
        // const monthStart = dayjs().startOf("year").add(i, "month");
        // const monthEnd = monthStart.add(1, "month").subtract(1, "day");

        console.log("Filtered Entries for January:", sampleEntries);
        // const contributions = shipEntries
        //   .filter(
        //     (entry) =>
        //     {  dayjs(entry.date).isSame(monthStart) || dayjs(entry.date).isAfter(monthStart)
        //     //   ,
        //     //   console.log( dayjs(entry.date).isSame(monthStart) || dayjs(entry.date).isAfter(monthStart)),
        //     // console.log("Entry Date:", entry.date),
        //     // console.log("Entry Date:", dayjs(entry.date).format("YYYY-MM-DD"))
        //     }
        //   )
        //   .filter(
        //     (entry) =>
        //      { dayjs(entry.date).isSame(monthEnd) || dayjs(entry.date).isBefore(monthEnd),
        //       console.log( dayjs(entry.date).isSame(monthStart) || dayjs(entry.date).isAfter(monthStart))}
        //   )
        //   .reduce((acc, entry) => {acc + entry.contributions, console.log(acc,  entry)}, 0);
       
      // console.log(contributions)
          return sampleEntries;
        
      });
      return {
        ship: ship,
        contributionsByMonth: contributionsByMonth,
      };
    });

    setFullYearData(response);
  }, [datas]);

  useEffect(() => {
    if (chartRefs && fullYearData) {
      let chart = chartRefs?.current;

      // remove existing svg before showing chart:
      d3.select(".heatmap").remove();
      d3.select(".legend").remove(); // Remove existing legend

      const margin = { top: 50, right: 25, bottom: 50, left: 50 };
      const cellSize = 30;
      const spacing = 5; // Additional spacing between month labels\
      const width = (months.length + spacing) * cellSize;
      const height = ships.length * cellSize;

      const color = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(fullYearData, (d) => Math.max(...d.contributionsByMonth)),
        ])
        .range(["#E7E7E7", "#F0524D"]);

      const svg = d3
        .select(chart)
        .append("svg")
        .attr("class", "heatmap")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const shipLabels = svg
        .selectAll(".ship-label")
        .data(fullYearData)
        .enter()
        .append("text")
        .attr("x", -5)
        .attr("y", (d, i) => i * (cellSize + spacing) + cellSize / 2)
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .text((d) => d.ship);

      const monthLabels = svg
        .selectAll(".month-label")
        .data(months)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * (cellSize + spacing) + cellSize / 2)
        .attr("y", -5)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text((d) => d);

      const heatmap = svg
        .selectAll(".heatmap-row")
        .data(fullYearData)
        .enter()
        .append("g")
        .attr("class", "heatmap-row")
        .attr(
          "transform",
          (d, i) => `translate(0, ${i * (cellSize + spacing)})`
        );
      // .attr("transform", (d, i) => `translate(0, ${i * cellSize })`);

      heatmap
        .selectAll(".contribution")
        .data((d) => d.contributionsByMonth)
        .enter()
        .append("rect")
        .attr("class", "contribution")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", (d, i) => i * (cellSize + spacing))
        .attr("y", 0)
        .attr("fill", (d) => color(d))

        .on("mouseover", function (event, d) {

          const shipName = d3.select(this.parentNode).datum().ship;
          const month =
            months[d3.select(this).attr("x") / (cellSize + spacing)];
          const contributions = d;
          console.log(d3.select(this.parentNode).datum())
          showTooltip(shipName, month, contributions, event.pageX, event.pageY);
        })
        .on("mouseleave", hideTooltip);

      // Create a legend
      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 50}, 0)`);

      const legendColor = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(fullYearData, (d) => Math.max(...d.contributionsByMonth)),
        ])
        .range(["#E7E7E7", "#F0524D"]);

      const legendScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(fullYearData, (d) => Math.max(...d.contributionsByMonth)),
        ])
        .range([0, 100]);

      // Use ticks instead of quantiles
      legend
        .selectAll(".legend-rect")
        .data(legendColor.ticks(5)) // Adjust the number of ticks as needed
        .enter()
        .append("rect")
        .attr("class", "legend-rect")
        .attr("x", 0)
        .attr("y", (d) => legendScale(d))
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", (d) => legendColor(d));

      legend
        .selectAll(".legend-text")
        .data(legendColor.ticks(5)) // Adjust the number of ticks as needed
        .enter()
        .append("text")
        .attr("class", "legend-text")
        .attr("x", 30)
        .attr("y", (d) => legendScale(d) + 12)
        .style("font-size", "12px")
        .text((d) => Math.round(d));
    }
  }, [fullYearData, months, ships, datas]);

  const showTooltip = (ship, month, contributions, x, y) => {
    const tooltip = d3.select(chartRefs?.current).append("div");
    const xOffset = 20; // Adjust this value to move tooltip horizontally
    const yOffset = -20; // Adjust this value to move tooltip vertically
    const tooltipWidth = 250;
    const tooltipHeight = 80;

    tooltip
      .attr("class", "tooltip")
      // .style("left", +"px")
      // .style("top", +"px")
      .style("left", x - tooltipWidth / 2 + xOffset + "px")
      .style("top", y - tooltipHeight + yOffset + "px")
      .style("background-color", "#1f1f1f")
      .style("padding", "12px 20px")
      .style("color", "#ffffff")
      .style("width", "250px")
      .style("z-index", "10")
      .style("line-height", "19px")
      .style("position", "fixed")
      .html(
        `Ship: ${ship} <br> Month: ${month} <br> Contributions: ${contributions}`
      );
  };

  const hideTooltip = () => {
    d3.select(".tooltip").remove();
  };

  return (
    <>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          background: "white",
          overflowX: "hidden",
          padding: "20px 5px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: 10,
          height: "auto",
        }}
      >
        <Col span={22}>
          <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
            <p style={{ fontSize: 24 }}>{title} </p>
            <p style={{ fontSize: 16 }}> {subTitle}</p>
          </div>
        </Col>
        <Col
          style={{
            //  display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div id="charts" ref={chartRefs}></div>
        </Col>
      </Row>
    </>
  );
};

export default HeatMonth;
