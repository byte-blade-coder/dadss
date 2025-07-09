import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { Col, Row } from "antd";

const HeatWeek = ({ datas, title, subTitle }) => {
  const [fullYearData, setFullYearData] = useState([]);
  const [ships, setShips] = useState([]);
  const [weeks, setWeeks] = useState([]);

  let chartRefs = useRef(null);

  useEffect(() => {
    const uniqueShips = Array.from(new Set(datas.map((entry) => entry.ship)));
    const today = dayjs("2024-01-01");
    const yearBackFromNow = today.subtract(0, "month").startOf("month");
console.log(yearBackFromNow)
    const weekArray = Array.from({ length: 52 }, (_, i) =>
      i < 8 ? `0${i + 1}` : `${i + 1}`
    );

    setShips(uniqueShips);
    setWeeks(weekArray);

    const response = uniqueShips.map((ship) => {
      const shipEntries = datas.filter((entry) => entry.ship === ship);
      const contributionsByWeek = Array.from({ length: 52 }, (_, i) => {
        const weekStart = yearBackFromNow
          .startOf("year")
          .add(i * 7, "day")
          .startOf("day"); // Start of the day is added
        const weekEnd = weekStart.add(6, "day").endOf("day"); // End of the day is added
        const contributions = shipEntries
          .filter(
            (entry) =>
              dayjs(entry.date).isAfter(weekStart) &&
              dayjs(entry.date).isBefore(weekEnd)
          )
          .reduce((acc, entry) => acc + entry.contributions, 0);

        return contributions;
      });
      return {
        ship: ship,
        contributionsByWeek: contributionsByWeek,
      };
    });

    setFullYearData(response);
  }, [datas]);

  useEffect(() => {
    if (chartRefs && fullYearData) {
      let chart = chartRefs?.current;

      // remove existing svg before showing chart:
      d3.select(chart).selectAll("*").remove();

      const margin = { top: 50, right: 25, bottom: 50, left: 50 };
      const cellSize = 14;
      const spacing = 5;
      const width = 80 * cellSize; // Adjusted width to fit 54 weeks
      const height = ships.length * cellSize;

      const color = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(fullYearData, (d) => Math.max(...d.contributionsByWeek)),
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
        new Set(datas.map((entry) => dayjs(entry.date).format("MMM")))
      );
      const monthLabels = svg
        .selectAll(".month-label")
        .data(uniqueMonths)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * (4 * (cellSize + spacing)) + 2 * cellSize)
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

      heatmap
        .selectAll(".contribution")
        .data((d) => d.contributionsByWeek)
        .enter()
        .append("rect")
        .attr("class", "contribution")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", (d, i) => i * (cellSize + spacing) + cellSize)
        .attr("y", 0)
        .attr("fill", (d) => color(d))
        .on("mouseover", function (event, d) {
          const shipName = d3.select(this.parentNode).datum().ship;
          const weekNumber = Math.floor(
            d3.select(this).attr("x") / (cellSize + spacing)
          );
          const contributions = d;
          showTooltip(
            shipName,
            weekNumber + 1,
            contributions,
            event.pageX,
            event.pageY
          );
        })
        .on("mouseleave", hideTooltip);

      // Create a legend
      const legend = svg
        .append("g")
        .attr("class", "legend")
        // .attr("transform", `translate(${width - 100}, 0)`);
        .attr("transform", `translate(${width - 100}, 0)`);

      const legendColor = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(fullYearData, (d) => Math.max(...d.contributionsByWeek)),
        ])
        .range(["#E7E7E7", "#F0524D"]);

      const legendScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(fullYearData, (d) => Math.max(...d.contributionsByWeek)),
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
  }, [fullYearData, weeks, ships, datas]);

  const showTooltip = (ship, week, contributions, x, y) => {
    const offset = -10; // Adjust this offset as needed
    const tooltip = d3.select(chartRefs?.current).append("div");
    const xOffset = 20; // Adjust this value to move tooltip horizontally
    const yOffset = -20; // Adjust this value to move tooltip vertically
    const tooltipWidth = 250;
    const tooltipHeight = 80;

    tooltip
      .attr("class", "tooltip")
      .style("left", x - tooltipWidth / 2 + xOffset + "px")
      .style("top", y - tooltipHeight + yOffset + "px")
      .style("position", "absolute")
      .style("background-color", "#1f1f1f")
      .style("padding", "12px 20px")
      .style("color", "#ffffff")
      .style("width", "250px")
      .style("z-index", "10")
      .style("line-height", "19px")
      .style("position", "fixed")
      .html(
        `Ship: ${ship} <br> Week: ${week} <br> Contributions: ${contributions}`
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
        <Col>
          <div id="heatmapByMonth" ref={chartRefs}></div>
        </Col>
      </Row>
    </>
  );
};

export default HeatWeek;
