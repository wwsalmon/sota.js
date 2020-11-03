import * as d3 from "d3";
import {toPercentage} from "../lib/tooltip.js";
import {containerSetup, chartRendered, uuidv4} from "../lib/sotaChartHelpers.js";
import sotaConfig from "../lib/sotaConfig.js";

/**
 * Render sota.js stacked bar chart
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [showXAxis = true] - Whether or not to render x axis
 * @param {("none" | "onBar" | "aboveBar")} [labelStyle = "onBar"] - Style of labels for sub-groups (slices of bars). None hides all labels. onBar displays values on the bars, and hides any that don’t fit. aboveBar draws labels above the bar with pointing lines
 * @param {("none" | "onBar")} [groupLabelStyle = "none"] - Style of labels for groups. None hides all labels. onBar displays labels above bars
 * @param {boolean} [showLegend = true] - Whether or not to show legend
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 * @param {string[]} [customColors] - Array of custom color strings to use instead of theme colors. Must have exactly as many colors as value groups in data
 */
function stackedBarChart({
                             dataFile,
                             selector = false,
                             title = false,
                             subtitle = false,
                             section = false,
                             inputIsPercentage = false,
                             showXAxis = true,
                             labelStyle = "onBar", // "none" | "onBar" | "aboveBar"
                             groupLabelStyle = "none", // "none" | "onBar"
                             showLegend = true,
                             margin = sotaConfig.margin,
                             customColors = false,
                         }) {

    const hoverOpacity = 0.8;
    const tickSize = 8;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const barHeight = sotaConfig.barHeight;
    const barMargin = sotaConfig.barMargin;
    const overflowOffset = sotaConfig.overflowOffset;
    const groupLabelMargin = sotaConfig.groupLabelMargin;
    const labelLeft = sotaConfig.labelLeft;
    const labelBelow = sotaConfig.labelBelow;
    const lineColor = sotaConfig.lineColor;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;
    const xAxisTop = sotaConfig.xAxisTop;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);

    d3.csv(dataFile + ".csv").then(data => {

        // define styling variables here

        let barspace = barHeight + barMargin;
        let mainHeight = data.length * barspace;

        let marginBefore = 0;

        if (groupLabelStyle == "onBar") {
            barspace += data.length * groupLabelMargin;
            mainHeight += data.length * groupLabelMargin;
            marginBefore = groupLabelMargin;
        }

        // DATA PROCESSING

        const valueLabels = data.columns.slice(1);
        const groupLabels = d3.map(data, d => d.group).keys()

        // custom colors if specified

        const customColorClass = uuidv4();

        if (customColors) {
            if (customColors.length !== valueLabels.length) {
                throw "Invalid custom colors array. Custom colors array must have exactly as many elements as value groups in the data.";
            }

            let colorStyleString = "";

            for (let i in customColors) {
                colorStyleString += `.sota-fill-${customColorClass}-${+i + 1} { fill: ${customColors[i]} }`
            }

            container.append("style")
                .html(colorStyleString);
        }

        // arrays of values and percentages

        let stackedData = [];

        if (inputIsPercentage) {
            data.forEach(d => {
                let prevPercentage = 0;
                let thisPrevPercentages = [];
                let thisData = [];
                for (let valueLabel of valueLabels) {
                    thisPrevPercentages.push(prevPercentage);
                    let thisPercentage = +d[valueLabel];
                    thisData.push([thisPercentage, prevPercentage]);
                    prevPercentage += thisPercentage;
                }
                stackedData.push(thisData);
            })
        } else {
            data.forEach(d => {
                let prevPercentage = 0;
                let thisPrevPercentages = [];
                let total = d3.sum(valueLabels, k => +d[k]);
                let thisData = [];
                let thisValues = [];
                for (let valueLabel of valueLabels) {
                    thisPrevPercentages.push(prevPercentage);
                    let thisPercentage = +d[valueLabel] / total * 100;
                    thisData.push([thisPercentage, prevPercentage, +d[valueLabel]]);
                    prevPercentage += thisPercentage;
                }
                stackedData.push(thisData);
            });
        }

        const y = d3.scaleBand()
            .domain(groupLabels)
            .range([0, mainHeight])
            .padding([0.2])

        const x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, mainWidth])

        const classNames = d3.scaleOrdinal()
            .domain(valueLabels)
            .range(d3.map(valueLabels, (d, i) => "sota-fill-" + (customColors ? customColorClass + "-" : "") + ((valueLabels.length > 3 || customColors) ? (i + 1) : (2 * i + 1))).keys())

        if (showXAxis) {
            mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-xAxis sota-num-axis")
                .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
                .attr("transform", "translate(" + 0 + " " + (mainHeight + xAxisTop) + ")");

            mainHeight += 20 + xAxisTop;
        }

        // LEGEND

        var legendHeight = 0;

        if (showLegend) {
            let valueLabelWidths = [];

            const legend = svg.append("g")
                .lower()
                .attr("class", "sota-gen-legend")
                .attr("transform", `translate(0 ${margin.top})`)

            legend.selectAll("nothing")
                .data(valueLabels)
                .enter()
                .append("text")
                .attr("class", "sota-gen-legend-text")
                .text(d => d)
                .attr("x", function () {
                    valueLabelWidths.push(this.getBBox().width);
                })
                .remove();

            if (d3.sum(valueLabelWidths, d => d) + valueLabels.length * (swatchWidth + swatchBetween) + (valueLabels.length - 1) * swatchRight > mainWidth) {
                // vertical legends
                let legendLeft = width + overflowOffset - d3.max(valueLabelWidths) - swatchWidth - swatchBetween;

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(valueLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                    .attr("x", legendLeft)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                    .attr("width", swatchWidth)
                    .attr("height", swatchHeight)

                legend.selectAll(".sota-gen-legend-text")
                    .data(valueLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                    .text(d => d)
                    .attr("x", legendLeft + swatchWidth + swatchBetween)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                    .attr("alignment-baseline", "central")
                    .attr("dominant-baseline", "central")

                legendHeight = valueLabels.length * swatchHeight + (valueLabels.length - 1) * swatchBelowBetween + swatchBelow;
            } else {
                let legendLeft = width + overflowOffset - (d3.sum(valueLabelWidths, d => d) + valueLabels.length * (swatchWidth + swatchBetween) + (valueLabels.length - 1) * swatchRight);

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(valueLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(valueLabelWidths.slice(0, i), d => d))
                    .attr("y", 0)
                    .attr("width", swatchWidth)
                    .attr("height", swatchHeight)

                legend.selectAll(".sota-gen-legend-text")
                    .data(valueLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                    .text(d => d)
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                    .attr("y", swatchHeight / 2)
                    .attr("alignment-baseline", "central")
                    .attr("dominant-baseline", "central")

                legendHeight = swatchHeight + swatchBelow;
            }
        }


        // MAIN LOOP

        const chartGroups = mainChart.selectAll(".sota-stackedBarChart-group")
            .data(stackedData)
            .join("g")
            .attr("class", "sota-stackedBarChart-group")
            .attr("transform", (d, i) => "translate(0 " + (y(groupLabels[i]) + marginBefore - barMargin) + ")")

        chartGroups.selectAll(".sota-stackedBarChart-bar")
            .data(d => d)
            .join("rect")
            .attr("class", (d, i) => "sota-stackedBarChart-bar " + classNames(i))
            .attr("x", d => x(d[1]))
            .attr("y", 0)
            .attr("width", d => x(d[0]))
            .attr("height", barHeight)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(() => {
                        let retval = `<span class="sota-text-label"><span class="sota-heavy-label">${valueLabels[i]}</span><br/>Percentage: ${toPercentage(d[0])}`;
                        if (!inputIsPercentage) {
                            retval += "<br/>Number of responses: " + d[2];
                        }
                        retval += "</span>";
                        return retval;
                    })
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mousemove", () => {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("opacity", 1.0);
                tooltip.style("opacity", 0);
            })

        chartGroups.selectAll(".sota-stackedBarChart-separator")
            .data(d => d)
            .join("rect")
            .attr("class", "sota-stackedBarChart-separator")
            .attr("fill", "white")
            .attr("x", d => x(d[1]) + x(d[0]))
            .attr("y", 0)
            .attr("width", d => {
                if (d[0] > 0) {
                    return separatorStrokeWidth;
                } else {
                    return 0;
                }
            })
            .attr("height", barHeight)

        // onBar group label

        if (groupLabelStyle == "onBar") {
            mainChart.selectAll(".sota-stackedBarChart-groupLabel-onBar")
                .data(groupLabels)
                .join("text")
                .attr("class", "sota-stackedBarChart-groupLabel-onBar sota-text-label sota-heavy-label")
                .text(d => d)
                .attr("alignment-baseline", "bottom")
                .attr("dominant-baseline", "bottom")
                .attr("x", 0)
                .attr("y", d => y(d))
        }

        var labelsHeight = 0;

        // onBar value label

        if (labelStyle == "onBar") {
            chartGroups.selectAll(".sota-stackedBarChart-label-onBar")
                .data(d => d)
                .join("text")
                .attr("class", "sota-stackedBarChart-label-onBar sota-num-label")
                .text(d => d3.format(".1f")(d[0]) + "%")
                .attr("alignment-baseline", "central")
                .attr("dominant-baseline", "central")
                .attr("text-anchor", "end")
                .attr("x", d => x(d[1]) + x(d[0]) - labelLeft)
                .attr("y", barHeight / 2)
                .style("display", function (d, i) {
                    if (this.getBBox().x < (i > 0 ? x(d[1]) : margin.left)) {
                        return "none";
                    }
                    return "";
                })
        }

        // aboveBar value label

        else if (labelStyle == "aboveBar") {

            var labelRightBounds = [];

            chartGroups.selectAll(".sota-stackedBarChart-label-aboveBar-text")
                .data(d => d)
                .join("text")
                .attr("class", "sota-stackedBarChart-label-aboveBar-text sota-num-label")
                .text((d, i) => `${valueLabels[i]}: ${d3.format(".1f")(d[0])}%`)
                .attr("x", d => x(d[1]) + x(d[0]) / 2)
                .attr("y", function (d) {
                    labelRightBounds.push([this.getBBox().x, this.getBBox().width]);
                    return -2 * labelBelow;
                })
                .attr("alignment-baseline", "bottom")

            let labelHeights = []

            function getLabelHeight(i) {
                if (i == labelRightBounds.length - 1) {
                    labelHeights[i] = -2;
                    return -2;
                } else if (labelRightBounds[i][0] + labelRightBounds[i][1] + labelLeft > labelRightBounds[i + 1][0]) {
                    labelRightBounds[i + 1][0] = labelRightBounds[i][0] + labelRightBounds[i][1] + labelLeft;
                    let nextHeight = getLabelHeight(i + 1);
                    let thisHeight = nextHeight - 1;
                    labelHeights[i] = thisHeight;
                    return thisHeight;
                } else {
                    getLabelHeight(i + 1);
                    labelHeights[i] = -2;
                    return -2;
                }
            }

            getLabelHeight(0);

            chartGroups.selectAll(".sota-stackedBarChart-label-aboveBar-line")
                .data(d => d)
                .join("polyline")
                .attr("class", "sota-stackedBarChart-label-aboveBar-line")
                .attr("points", (d, i) => {
                    let x1 = x(d[1]) + x(d[0]) / 2;
                    let y1 = barHeight / 2;
                    let x2 = x1;
                    let y2 = (labelHeights[i] + 1) * labelBelow;
                    let x3 = labelRightBounds[i][0] + labelRightBounds[i][1];
                    let y3 = y2;
                    return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
                })
                .attr("stroke-width", separatorStrokeWidth)
                .attr("stroke", lineColor)
                .attr("fill", "none")

            chartGroups.selectAll(".sota-stackedBarChart-label-aboveBar-text")
                .data(d => d)
                .join("text")
                .attr("x", (d, i) => labelRightBounds[i][0])
                .attr("y", (d, i) => labelHeights[i] * labelBelow);

            labelsHeight = -1 * d3.min(labelHeights) * labelBelow + 20;

        }

        const height = mainHeight + margin.top + margin.bottom + legendHeight + labelsHeight;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        mainChart.attr("transform", `translate(${overflowOffset} ${margin.top + legendHeight + labelsHeight})`)
            .attr("width", mainWidth)

        chartRendered(container.node());
    });
}

export default stackedBarChart;