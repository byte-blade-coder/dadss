import { Col, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
// import "./style.css";
import { schemeCategory10 } from "d3-scale-chromatic"; // Importing a color scheme

function Stackbar(props) {
  const { title, subTitle, data } = props;

  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 230, bottom: 50, left: 60 };
    const width = 1000; // Adjusted width
    const height = 550; // Adjusted height

    const x = d3
      .scaleBand()
      .domain(data[0].data.map((entry) => entry.date))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(
          data.flatMap((d) => d.data),
          (entry) => Math.min(entry.departures, entry.arrivals)
        ),
        d3.max(
          data.flatMap((d) => d.data),
          (entry) => Math.max(entry.departures, entry.arrivals)
        ),
      ])
      .nice()
      .rangeRound([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(["Arrivals", "Departures"])
      .range(["#1f77b4", "#ff7f0e"]);

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const stackedData = data.map((locationData) => {
      return {
        location: locationData.location,
        data: locationData.data.map((entry) => ({
          date: entry.date,
          arrivals: entry.arrivals,
          departures: entry.departures,
        })),
      };
    });
    const stack = d3.stack().keys(["arrivals", "departures"]);

    stackedData.forEach((locationData) => {
      const stackedValues = stack(locationData.data);

      g.selectAll("g")
        .data(stackedValues)
        .enter()
        .append("g")
        .attr("fill", (d) => color(d.key))
        .selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.data.date))
        .attr("y", (d) => y(d[1]))
        // .attr("height", (d) => y(d[0]) - y(d[1]))
        .attr("height", (d) => Math.abs(y(d[0]) - y(d[1]))) // Use absolute value to correctly represent negative values
        .attr("width", x.bandwidth())
        .on("mouseover", (event, d) => {
          const formatValue = d3.format(".2f");
          const tooltip = d3.select("#tooltip");
          tooltip.style("display", "inline-block");
          tooltip
            .html(
              //   `<strong>${d.data.date}</strong><br>Location: ${
              //     locationData.location
              //   }<br>Arrivals: ${formatValue(d.data.arrivals)}
              // <br>Departures: ${formatValue(-d.data.departures)}`

              `<strong>${d.data.date}</strong><br>Location: ${
                locationData.location
              }<br>Arrivals: ${formatValue(d.data.arrivals)}
    <br>Departures: ${
      d.data.departures >= 0
        ? formatValue(d.data.departures)
        : "-" + formatValue(-d.data.departures)
    }`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 20 + "px");
        })
        .on("mouseout", () => {
          d3.select("#tooltip").style("display", "none");
        });
    });

    g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)");

    g.append("g").call(
      d3
        .axisLeft(y)
        .ticks(10)
        .tickSize(-width + margin.left + margin.right)
    );

    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right + 30},${margin.top})` // Adjusted x value
      )

      .selectAll("g")
      .data(["Arrivals", "Departures"]) // Updated legend labels
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", color); // Using color scale directly for legend colors

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text((d) => d);
  }, [data]);
  return (
    <Row
      style={{
        display: "flex",
        justifyContent: "center",
        background: "white",
        padding: "20px 5px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: 10,
        overflow: "hidden", // Hide scrollbar
        position: "relative", // Fix the screen
      }}
    >
      <Col span={22}>
        <p style={{ fontSize: 24 }}>{title}</p>
        <div className="">
          <div className="StackedBarChart">
            <div className="ScrollableContainer">
              <svg ref={svgRef} width={1200} height={600}></svg>
            </div>
            <div
              id="tooltip"
              style={{
                position: "fixed",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "5px",
              }}
            ></div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default Stackbar;
