import * as d3 from "d3";
import {toPercentage} from "../lib/tooltip.js";
import {containerSetup, chartRendered} from "../lib/sotaChartHelpers.js";
import sotaConfig from "../lib/sotaConfig.js";

export default function ({
    dataFile,
    selector = false,
    title = false,
    subtitle = false,
    section = false,
    inputIsPercentage = false,
    minVal = null,
    maxVal = null,
    height = 300,
    customTooltipAppend = "",
    prop5 = "value5",
    prop6 = "value6",
    margin = {
        "top": 20,
        "bottom": 20,
        "left": 24,
        "right": 0
    } }) {

    const lineColor = "#bbb";
    const lineWidth = 3;
    const tickSize = 8;
    const circleRad = 4;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const hoverOpacity = 0.8;
    const overflowOffset = sotaConfig.overflowOffset;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);

    d3.csv(dataFile + ".csv").then(data => {
        // define styling variables here

        const labels = data.map(d => d.label);
        const values = data.map(d => +d.value);

        if (minVal == null){ // default setting
            minVal = (inputIsPercentage) ? 0 : d3.min(data, d => d.value);
        }
        else if (minVal == true){ // specified minVal
            minVal = d3.min(data, d => d.value);
        }
        else if (isNaN(minVal) || minVal == "") throw "invalid minVal for graph on " + selector;
        // else custom val
        
        if (maxVal == null){ // default setting
            maxVal = (inputIsPercentage) ? 100 : d3.max(data, d => d.value);
        }
        else if (maxVal == true){ // specified maxVal
            maxVal = d3.max(data, d => d.value);
        }
        else if (isNaN(maxVal) || maxVal == "") throw "invalid maxVal for graph on " + selector;
        // else custom val

        // process data here. Create scales, etc.

        const x = d3.scaleBand()
            .domain(labels.map(d => d))
            .range([0, mainWidth]);

        const y = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([height - margin.bottom, margin.top]);

        mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-xAxis sota-text-axis")
            .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
            .style("transform","translateY(" + (height - margin.bottom) + "px)");

        mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-YAxis sota-num-axis")
            .call(d3.axisLeft(y).tickSize(-tickSize))

        // run main loop here

        mainChart.selectAll(".sota-lineGraph-path")
            .data([values])
            .join("path")
            .attr("class", "sota-lineGraph-path")
            .attr("d", d3.line()
                .x((d, i) => x(labels[i]) + x.bandwidth() / 2)
                .y(d => y(d)))
            .attr("fill","none")
            .attr("stroke",lineColor)
            .style("stroke-width",lineWidth);

        mainChart.selectAll(".sota-lineGraph-circle")
            .data(values)
            .join("circle")
            .attr("class", "sota-lineGraph-circle")
            .attr("cx", (d, i) => x(labels[i]) + x.bandwidth() / 2)
            .attr("cy", d => y(d))
            .attr("r", circleRad)
            .attr("stroke", "white")
            .style("stroke-width", separatorStrokeWidth)
            // more attributes here
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(`<span class="sota-tooltip-label">${labels[i]}</span><br/>Value: ` + ((inputIsPercentage) ? toPercentage(d) : d) + "</span>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mousemove", d => {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("opacity", 1.0);
                tooltip.style("opacity", 0);
            });

        mainChart.selectAll(".sota-lineGraph-label")
            .data(values)
            .join("text")
            .attr("class", "sota-lineGraph-label sota-num-label")
            .text((d, i) => {
                if (inputIsPercentage){
                    return d + "%";
                }
            })
            .attr("x", (d, i) => x(labels[i]) + x.bandwidth() / 2)
            .attr("y", d => y(d) - 16)
            .style("text-anchor","middle")

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        chartRendered(container.node());
    });
}