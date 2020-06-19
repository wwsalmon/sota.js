import * as d3 from "d3";
import {bindTooltip, toPercentage} from "../lib/tooltip.js";
import sotaConfig from "../lib/sotaConfig.js";
import {containerSetup, chartRendered} from "../lib/sotaChartHelpers.js";

/**
 *
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [displayPercentage = true] - Whether to display percentage or value on axis
 * @param {(number|boolean)} [maxVal] - By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max.
 * @param {(number|boolean)} [minVal] - By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min.
 * @param {number} [height = 300] - Height of the graph
 * @param {boolean} [showLegend = true] - Whether or not to show legend
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function multiLineGraph({
                            dataFile,
                            selector = false,
                            title = false,
                            subtitle = false,
                            section = false,
                            minVal,
                            maxVal,
                            height = 300,
                            showLegend = true,
                            inputIsPercentage = false,
                            displayPercentage = true,
                            margin = {
                                "top": 20,
                                "bottom": 20,
                                "left": 24,
                                "right": 0
                            }
                         }) {

    const lineColor = "#bbb";
    const lineWidth = 3;
    const hoverOpacity = 0.8;
    const tickSize = 8;
    const overflowOffset = sotaConfig.overflowOffset;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;
    const xAxisTop = sotaConfig.xAxisTop;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);
    const mainHeight = height - margin.top - margin.bottom;

    d3.csv(dataFile + ".csv").then(data => {
        // DATA PROCESSING

        const subGroups = data.columns.slice(1);
        const groupLabels = d3.map(data, d => d.group).keys()

        let stackedData = [];
        let maxVals = [];
        let minVals = [];
        let maxPerc = [];
        let minPerc = [];

        if (inputIsPercentage){
            for (const group of data){
                let thisData = [];
                for (const subGroup in group){
                    if (subGroup === "group") continue;
                    thisData.push(+group[subGroup]);
                }
                maxVals.push(d3.max(thisData, d => d[0]));
                minVals.push(d3.min(thisData, d => d[0]));
                stackedData.push(thisData);
            }
        }
        else{
            for (const group of data){
                const total = d3.sum(subGroups, subGroup => +group[subGroup]);
                const thisData = [];
                for (const subGroup in group){
                    if (subGroup === "group") continue;
                    const thisPercentage = +group[subGroup] / total * 100;
                    thisData.push([thisPercentage, +group[subGroup]]);
                }
                maxVals.push(d3.max(thisData, d => d[1]));
                minVals.push(d3.min(thisData, d => d[1]));
                maxPerc.push(d3.max(thisData, d => d[0]));
                minPerc.push(d3.min(thisData, d => d[0]));
                stackedData.push(thisData);
            }
        }

        if (minVal == null) { // default setting
            minVal = (inputIsPercentage || displayPercentage) ? 0 : d3.min(minVals);
        }
        else if (minVal === true) { // specified minVal
            minVal = d3.min(minPerc);
        }
        else if (isNaN(minVal) || minVal === "") throw "invalid minVal for graph on " + selector;
        // else custom val

        if (maxVal == null) { // default setting
            maxVal = (inputIsPercentage || displayPercentage) ? 100 : d3.max(maxVals);
        }
        else if (maxVal === true) { // specified maxVal
            maxVal = d3.max(maxPerc);
        }
        else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;
        // else custom val

        const x = d3.scaleBand()
            .domain(subGroups)
            .range([0, mainWidth]);

        const y = d3.scaleLinear()
            .domain([minVal, maxVal]) // for now, hardcode displayPercentage
            .range([mainHeight,0]);

        const fillClassNames = d3.scaleOrdinal()
            .domain(groupLabels)
            .range(d3.map(groupLabels, (d, i) => "sota-fill-" + (groupLabels.length > 3 ? (i + 1) : (2 * i + 1))).keys())

        const strokeClassNames = d3.scaleOrdinal()
            .domain(groupLabels)
            .range(d3.map(groupLabels, (d, i) => "sota-stroke-" + (groupLabels.length > 3 ? (i + 1) : (2 * i + 1))).keys())

        // LEGEND

        let legendHeight = 0;

        if (showLegend){
            let groupLabelWidths = [];

            const legend = svg.append("g")
                .lower()
                .attr("class","sota-gen-legend")
                .attr("transform", `translate(0 ${margin.top})`)

            legend.selectAll("nothing")
                .data(groupLabels)
                .enter()
                .append("text")
                .attr("class","sota-gen-legend-text")
                .text(d => d)
                .attr("x", function(){
                    groupLabelWidths.push(this.getBBox().width);
                })
                .remove();

            if (d3.sum(groupLabelWidths, d => d) + groupLabels.length * (swatchWidth + swatchBetween) + (groupLabels.length - 1) * swatchRight > mainWidth){
                // vertical legends
                let legendLeft = width + overflowOffset - d3.max(groupLabelWidths) - swatchWidth - swatchBetween;

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(groupLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + fillClassNames(d))
                    .attr("x",legendLeft)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                    .attr("width",swatchWidth)
                    .attr("height",swatchHeight)

                legend.selectAll(".sota-gen-legend-text")
                    .data(groupLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                    .text(d => d)
                    .attr("x", legendLeft + swatchWidth + swatchBetween)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                    .attr("alignment-baseline", "central")
                    .attr("dominant-baseline", "central")

                legendHeight = groupLabels.length * swatchHeight + (groupLabels.length - 1) * swatchBelowBetween + swatchBelow;
            }
            else{
                let legendLeft = width + overflowOffset - (d3.sum(groupLabelWidths, d => d) + groupLabels.length * (swatchWidth + swatchBetween) + (groupLabels.length - 1) * swatchRight);

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(groupLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + fillClassNames(d))
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(groupLabelWidths.slice(0,i), d => d))
                    .attr("y", 0)
                    .attr("width", swatchWidth)
                    .attr("height", swatchHeight)

                legend.selectAll(".sota-gen-legend-text")
                    .data(groupLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                    .text(d => d)
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(groupLabelWidths.slice(0, i), d => d))
                    .attr("y", swatchHeight / 2)
                    .attr("alignment-baseline", "central")
                    .attr("dominant-baseline", "central")

                legendHeight = swatchHeight + swatchBelow;
            }
        }

        mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-xAxis sota-text-axis")
            .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
            .style("transform","translateY(" + mainHeight + "px)");

        mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-yAxis sota-num-axis")
            .call(d3.axisLeft(y).tickSize(-tickSize))

        const chartGroups = mainChart.selectAll(".sota-multiLineGraph-group")
            .data(stackedData)
            .join("g")
            .attr("class", (d, i) => `sota-multiLineGraph-group ${strokeClassNames(groupLabels[i])}`)

        chartGroups.selectAll(".sota-multiLineGraph-path")
            .data(d => [d])
            .join("path")
            .attr("class", "sota-multiLineGraph-path")
            .attr("d", d3.line()
                .x((d, i) => x(subGroups[i]) + x.bandwidth() / 2)
                .y(d => y(d[0])))
            .attr("fill","none")
            .style("stroke-width",lineWidth);

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height + legendHeight + "px")
            .style("margin-left", -overflowOffset + "px");

        mainChart.attr("transform", `translate(${margin.left + overflowOffset} ${margin.top + legendHeight})`)
            .attr("width", mainWidth);

        chartRendered(container.node());
    });
}

export default multiLineGraph;