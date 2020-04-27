import { sotaConfig } from '../helper.js';

export default function ({
    selector,
    dataFile,
    inputIsPercentage = false,
    displayPercentage = true,
    totalResp = null,
    maxVal = null,
    minVal = null,
    margin = {
        "top": 0,
        "bottom": 0,
        "left": 0,
        "right": 0
    } }) {

    var container = d3.select(selector);
    var svg = container.append("svg");
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    var width = document.querySelector(selector).offsetWidth;

    d3.csv("data/" + dataFile + ".csv").then(data => {
        const lineColor = "#dddddd";
        const hoverOpacity = 0.8;
        const separatorOffset = 6;
        const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
        const labelMargin = 8;
        const barHeight = sotaConfig.barHeight;
        const barMargin = sotaConfig.barMargin;

        const values = data.map(d => d.value);
        const barspace = barHeight + barMargin;
        const height = data.length * barspace + margin.bottom + margin.top;

        if (!inputIsPercentage) {
            if (totalResp == null) {
                totalResp = values.reduce((a, b) => +a + +b, 0)
            }
            var percentages = values.map(value => 100 * value / totalResp);
        }

        // SET DEFAULT maxVal and minVal values

        if (maxVal == null) {
            if (displayPercentage || inputIsPercentage) {
                maxVal = 100;
            }
            else {
                maxVal = Math.max(...values);
            }
        }
        else if (maxVal == "maxVal") {
            if (inputIsPercentage || !displayPercentage) {
                maxVal = Math.max(...values);
            }
            else {
                maxVal = Math.max(...percentages);
            }
        }

        if (minVal == null) {
            if (displayPercentage || inputIsPercentage) {
                minVal = 0;
            }
            else {
                minVal = Math.min(...values);
            }
        }
        else if (minVal == "minVal") {
            if (inputIsPercentage || !displayPercentage) {
                minVal = Math.min(...values);
            }
            else {
                minVal = Math.min(...percentages);
            }
        }

        const xScale = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([0, width]);

        if (!inputIsPercentage && displayPercentage) {
            var dataset = percentages;
            var labelset = values; // show values in tooltip
            var append = "%";
            var tooltipAppend = "";
        }
        else {
            var dataset = values;
            var tooltipAppend = "%";
            if (inputIsPercentage) {
                var append = "%";
                var labelset = values; // will just have to show percentages in tooltip
            }
            else {
                var append = "";
                var labelset = percentages;
            }
        }

        svg.attr("width", width)
            .attr("height", height);

        function yPos(index) {
            return index * barspace;
        }

        svg.selectAll(".sota-barChart-bar")
            .data(dataset)
            .join("rect")
            .attr("class", "sota-barChart-bar")
            .attr("width", d => xScale(d))
            .attr("height", barHeight)
            .attr("x", margin.left)
            .attr("y", (d, i) => yPos(i))
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(data[i].label + ": " + d3.format(".1f")(labelset[i]) + tooltipAppend)
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

        svg.selectAll(".sota-barChart-label")
            .data(data)
            .join("text")
            .attr("class", "sota-barChart-label")
            .html(d => d.label)
            .attr("alignment-baseline", "central")
            .attr("x", labelMargin)
            .attr("y", (d, i) => yPos(i) + barHeight / 2);

        svg.selectAll(".sota-barChart-separator")
            .data(dataset)
            .join("line")
            .attr("class", "sota-barChart-separator")
            .attr("x1", margin.left)
            .attr("x2", width)
            .attr("y1", (d, i) => yPos(i) + barHeight + separatorOffset)
            .attr("y2", (d, i) => yPos(i) + barHeight + separatorOffset)
            .attr("stroke-width", separatorStrokeWidth)
            .attr("stroke", lineColor);

        svg.selectAll(".sota-barChart-value")
            .data(dataset)
            .join("text")
            .attr("class", "sota-barChart-value")
            .html(d => d3.format(".1f")(d) + append)
            .attr("alignment-baseline", "central")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", (d, i) => yPos(i) + barHeight / 2);
    });
}
