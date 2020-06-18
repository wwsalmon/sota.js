import * as d3 from "d3";
import {bindTooltip, toPercentage} from "../lib/tooltip.js";
import {containerSetup, processData, chartRendered} from "../lib/sotaChartHelpers.js";
import sotaConfig from "../lib/sotaConfig.js";

export default function ({
    dataFile,
    selector = false,
    title = false,
    subtitle = false,
    section = false,
    inputIsPercentage = false,
    showXAxis = true,
    showSeparators = true,
    displayPercentage = true,
    totalResp = null,
    maxVal = null,
    minVal = null,
    margin = sotaConfig.margin
}) {

    const lineColor = "#dddddd";
    const hoverOpacity = 0.8;
    const tickSize = sotaConfig.tickSize;
    const separatorOffset = 6;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const labelLeft = sotaConfig.labelLeft;
    const barHeight = sotaConfig.barHeight;
    const barMargin = sotaConfig.barMargin;
    const overflowOffset = sotaConfig.overflowOffset;
    const xAxisTop = sotaConfig.xAxisTop;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(selector, section, title, subtitle, margin, overflowOffset);

    d3.csv(dataFile + ".csv").then(data => {

        const barspace = barHeight + barMargin;
        let mainHeight = data.length * barspace; // if show xAxis, more is added to this

        const [percentages, values, labels] = processData(data, inputIsPercentage, totalResp);
        const dataset = (displayPercentage || inputIsPercentage) ? percentages : values;

        if (minVal == null) { // default setting
            minVal = (inputIsPercentage || displayPercentage) ? 0 : d3.min(dataset);
        }
        else if (minVal === true) { // specified minVal
            minVal = d3.min(dataset);
        }
        else if (isNaN(minVal) || minVal === "") throw "invalid minVal for graph on " + selector;
        // else custom val

        if (maxVal == null) { // default setting
            maxVal = (inputIsPercentage || displayPercentage) ? 100 : d3.max(dataset);
        }
        else if (maxVal === true) { // specified maxVal
            maxVal = d3.max(dataset);
        }
        else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;
        // else custom val

        const x = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([0, mainWidth]);

        let xAxis;

        if (showXAxis) {
            xAxis = mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-xAxis sota-num-axis")
                .call(d3.axisBottom(x).tickSize(-tickSize))
                .attr("transform", "translate(" + 0 + " " + (mainHeight + xAxisTop) + ")");
        }

        function y(index) { // custom y scale
            return index * barspace;
        }

        mainChart.selectAll(".sota-barChart-bar")
            .data(dataset)
            .join("rect")
            .attr("class", "sota-barChart-bar sota-gen-bar")
            .attr("width", d => x(d))
            .attr("height", barHeight)
            .attr("x", 0)
            .attr("y", (d, i) => y(i))

        mainChart.selectAll(".sota-barChart-hiddenBar")
            .data(dataset)
            .join("rect")
            .attr("class", "sota-barChart-hiddenBar")
            .attr("width", mainWidth)
            .attr("height", barHeight)
            .attr("x", 0)
            .attr("y", (d, i) => y(i))
            .attr("fill", "transparent")
            .call(bindTooltip, tooltip, percentages, labels, values)

        mainChart.selectAll(".sota-barChart-label")
            .data(data)
            .join("text")
            .attr("class", "sota-barChart-label sota-text-label sota-heavy-label")
            .html(d => d.label)
            .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central")
            .attr("x", labelLeft)
            .attr("y", (d, i) => y(i) + barHeight / 2);

        if (showSeparators){
            mainChart.selectAll(".sota-barChart-separator")
                .data(dataset)
                .join("line")
                .attr("class", "sota-barChart-separator")
                .attr("x1", 0)
                .attr("x2", mainWidth)
                .attr("y1", (d, i) => y(i) + barHeight + separatorOffset)
                .attr("y2", (d, i) => y(i) + barHeight + separatorOffset)
                .attr("stroke-width", separatorStrokeWidth)
                .attr("stroke", lineColor);
        }

        mainChart.selectAll(".sota-barChart-value")
            .data(dataset)
            .join("text")
            .attr("class", "sota-barChart-value sota-num-label")
            .html((d, i) => (inputIsPercentage || displayPercentage) ? toPercentage(d) : d)
            .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central")
            .attr("text-anchor", "end")
            .attr("x", mainWidth)
            .attr("y", (d, i) => y(i) + barHeight / 2);

        if (showXAxis){
            let textBottom = [];

            xAxis.selectAll("text")
                .each(function(){textBottom.push(this.getBBox().y + this.getBBox().height)})

            mainHeight += +d3.max(textBottom);
        }

        const height = mainHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        chartRendered(container.node());
    });
}
