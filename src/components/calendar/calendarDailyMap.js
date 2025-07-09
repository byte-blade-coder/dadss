import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/en";
import { Col, Row } from "antd";

const HeatDaily = ({ datas, title, subTitle }) => {
  const [fullYearData, setFullYearData] = useState([]);
  const [ships, setShips] = useState([]);
  const [day, setDay] = useState([]);

  dayjs.extend(utc);

  let chartRefs = useRef(null);

  useEffect(() => {
    console.log(datas)
    const uniqueShips = Array.from(new Set(datas.map((entry) => entry.ship)));
    const yearBackFromNow = dayjs().subtract(1, "year").startOf("year");
    // const today = dayjs();
        const today = dayjs("2024-01-01");
    // Get the start date for the last two months
    const startOfLastOneMonths = today.subtract(1, "month").startOf("month");
    // Only consider dates in the last one months
    const dateArrays = Array.from(
      { length: today.diff(startOfLastOneMonths, "days") + 1 },
      (_, i) => startOfLastOneMonths.add(i, "day").format("YYYY-MM-DD")
    );

    const dateArray = Array.from(
      { length: today.diff(startOfLastOneMonths, "days") + 1 },
      (_, i) => startOfLastOneMonths.add(i, "day").format("YYYY-MM-DD")
    ).filter((date) => dayjs(date).month() === 3); // 9 represents October because months are zero-based in JavaScript dates

    const uniqueMonths = Array.from(
      new Set(dateArray.map((d) => dayjs(d).format("MMM")))
    );
    setShips(uniqueShips);
    setDay(dateArray); // Set dates instead of months

    if (datas && datas.length > 0) {
      const response = uniqueShips.map((ship) => {
        const shipEntries = datas.filter((entry) => entry.ship === ship);
        console.log(dateArray)
        const contributionsByDay = dateArray.map((date) => {
          console.log(date)   
          const matchingEntry = shipEntries.find((entry) =>
           dayjs(entry.date).isSame(date, { granularity: "day" })
          // console.log(dayjs(entry.date).isSame(date), date)}
          );
          console.log(matchingEntry)
          return matchingEntry ? matchingEntry.contributions : 0;
        });
        console.log(contributionsByDay)
        return {
          ship: ship,
          contributionsByDay: contributionsByDay,
        };
      });
      console.log(response)
      setFullYearData(response);
    }
  }, [datas]);

  useEffect(() => {
    if (chartRefs && fullYearData) {
      let chart = chartRefs?.current;

      // remove existing svg before showing chart:
      d3.select(".heatmap").remove();
      d3.select(".legend").remove(); // Remove existing legend

      const margin = { top: 50, right: 25, bottom: 50, left: 50 };
      const cellSize = 25; // Adjust the cell size
      const spacing = 5; // Adjust the spacing between cells
      const width = day.length * cellSize + spacing * 500;
      const height = ships.length * cellSize;

      const color = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(fullYearData, (d) => Math.max(...d.contributionsByDay)),
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

      const uniqueMonths = Array.from(
        new Set(day.map((d) => dayjs(d).format("MMM")))
      );
      const uniqueDays = Array.from(
        new Set(day.map((d) => dayjs(d).format("DD")))
      );

      const dayLabels = svg
        .selectAll(".day-label")
        .data(uniqueDays)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * (cellSize + spacing) + cellSize / 2) // Adjust the positioning
        .attr("y", -5)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text((day) => day);

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
      // .attr("transform", (d, i) => `translate(0, ${i * cellSize})`);

      heatmap
        .selectAll(".contribution")
        .data((d) => d.contributionsByDay)
        .enter()
        .append("rect")
        .attr("class", "contribution")
        .attr("width", cellSize)
        .attr("height", cellSize)
        //.attr("x", (d, i) => i * cellSize)
        .attr("x", (d, i) => i * (cellSize + spacing))
        .attr("y", 0)
        .attr("fill", (d) => color(d))
        .on("mouseover", function (event, d) {
          const shipName = d3.select(this.parentNode).datum().ship;
          const dateIndex = d3.select(this).attr("x") / (cellSize + spacing);
          const date = day[dateIndex];
          const contributions = d;
          showTooltip(shipName, date, contributions, event.pageX, event.pageY);
        })
        .on("mouseleave", hideTooltip);
      // Create a legend
      const legend = svg.append("g").attr("class", "legend");

      const legendColor = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(fullYearData, (d) => Math.max(...d.contributionsByDay)),
        ])
        .range(["#E7E7E7", "#F0524D"]);

      const legendScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(fullYearData, (d) => Math.max(...d.contributionsByDay)),
        ])
        .range([0, 100]);

      // Use ticks instead of quantiles
      legend
        .selectAll(".legend-rect")
        .data(legendColor.ticks(5)) // Adjust the number of ticks as needed
        .enter()
        .append("rect")
        .attr("class", "legend-rect")
        .attr("x", 950)
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
        .attr("x", 975)
        .attr("y", (d) => legendScale(d) + 12)
        .style("font-size", "12px")
        .text((d) => Math.round(d));
    }
  }, [fullYearData, day, ships, datas]);

  const showTooltip = (ship, date, contributions, x, y) => {
    const tooltip = d3.select(chartRefs?.current).append("div");
    const tooltipWidth = 250;
    const tooltipHeight = 80;
    const xOffset = 20; // Adjust this value to move tooltip horizontally
    const yOffset = -20; // Adjust this value to move tooltip vertically

    tooltip
      .attr("class", "tooltip")
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
        `Ship: ${ship} <br> Date: ${date} <br> Contributions: ${contributions}`
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
          // overflowX: "scroll",
          overflowX: "hidden",
          // blockOverflow:""
          padding: "20px 15px",
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
        <Col className="mr-5 ">
          <div id="chartsDay" ref={chartRefs}></div>
        </Col>
      </Row>
    </>
  );
};

export default HeatDaily;
