import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BidirectionalBarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous contents

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x0 = d3.scaleBand()
      .domain(data.map(d => d.name))
      .rangeRound([0, width])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(['arrivals', 'departures'])
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.arrivals, d.departures))])
      .nice()
      .rangeRound([height, 0]);

    const xAxis = svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0));

    const yAxis = svg.append("g")
      .call(d3.axisLeft(y).ticks(null, "s"));

    const color = d3.scaleOrdinal()
      .range(["#4083DE", "#59CB89"]);

    const barGroups = svg.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", d => `translate(${x0(d.name)},0)`);

    barGroups.selectAll("rect")
      .data(d => ['arrivals', 'departures'].map(key => ({ key, value: d[key] })))
      .enter().append("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key));

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0));

    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    const legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(['arrivals', 'departures'].slice().reverse())
      .enter().append("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(d => d);

  }, [data]);

  return (
    <svg ref={svgRef} width={800} height={400}>
      <g transform={`translate(50,20)`}></g>
    </svg>
  );
};

export default BidirectionalBarChart;
