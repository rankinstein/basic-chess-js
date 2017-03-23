console.log("Hello there!");
import * as d3 from 'd3';

window.d3 = d3;

const data = [
  [0, 0, 0, 0, 3, 5, 6, 0],
  [0, 0, 0, 0, 3, 5, 6, 0],
  [0, 0, 0, 0, 3, 5, 6, 0],
  [0, 0, 0, 0, 0, 0, 0, 40],
  [4, 5, 2, 0, 0, 0, 0, 0],
  [4, 5, 2, 0, 0, 0, 0, 0],
  [4, 5, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 40, 0, 0, 0, 0],
];

const margin = {top: 20, right: 25, bottom: 20, left: 25};
const width = 700 - margin.left - margin.right;
const height = 650 - margin.top - margin.bottom;
const innerRadius = Math.min(width, height) * 0.39;
const outerRadius = innerRadius * 1.04;

var colors = ["#C4C4C4","#69B40F","#EC1D25","#C8125C","#008FC8","#10218B","#134B24","#737373"];

const fill = d3.scaleOrdinal()
      .domain(d3.range(colors.length))
      .range(colors);

/* SVG Canvas */
const svg = d3.select("#chart")
      .append("svg:svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("svg:g")
      .attr("transform", `translate(${margin.left + width/2}, ${margin.top + height/2})`);

const chord = d3.chord()
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending)(data)

/********
 *        Outer Arc
 *********/
const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

const g = svg.selectAll("g.group")
      .data(chord.groups)
      .enter().append("svg:g")
      .attr("class", d => `group ${d.index}`);

g.append("svg:path")
  .attr("class", "arc")
  .style("stroke", d => fill(d.index))
  .style("fill", d => fill(d.index))
  .attr("d", arc)
  .style("opacity", 0)
  .transition().duration(1000)
  .style("opacity", 0.4);

/***
 * Inner ribbons
 */
const chords = svg.selectAll("path.cord")
      .data(chord)
      .enter().append("svg:path")
      .attr("class", "chord")
      .style("stroke", d => d3.rgb(fill(d.source.index)).darker())
      .style("fill", d => fill(d.source.index))
      .attr("d", d3.ribbon().radius(innerRadius))
      .attr("opacity", 0.3);

debugger;
d3.select("body")
  .append("svg")
  .attr("width", 50)
  .attr("height", 50)
  .append("circle")
  .attr("cx", 25)
  .attr("cy", 25)
  .attr("r", 25)
  .style("fill", "purple");
