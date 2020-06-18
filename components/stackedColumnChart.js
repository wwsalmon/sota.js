import * as d3 from "d3";
import {toPercentage} from "../lib/tooltip.js";
import {containerSetup, chartRendered} from "../lib/sotaChartHelpers.js";
import sotaConfig from "../lib/sotaConfig.js";

/**
 * Render sota.js stacked column chart
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [displayPercentage = true] - Whether to display percentage or value on axis
 * @param {(number|boolean)} [maxVal] - By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max.
 * @param {(number|boolean)} [minVal] - By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min.
 * @param {number} [mainHeight] - Height of the chart. Defaults to value from sotaConfig
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
export default function ({
                             dataFile,
                             selector = false,
                             title = false,
                             subtitle = false,
                             section = false,
                             inputIsPercentage = false,
                             displayPercentage = true,
                             maxVal = null,
                             minVal = null,
                             mainHeight = sotaConfig.mainHeight,
                             margin = {
                                 "top": 20,
                                 "bottom": 20,
                                 "left": 24,
                                 "right": 0
                             }
                         }) {

    const hoverOpacity = 0.8;
    const tickSize = sotaConfig.tickSize;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const overflowOffset = sotaConfig.overflowOffset;
    const labelAngle = sotaConfig.labelAngle;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, 0);

    d3.csv(dataFile + ".csv").then(data => {

        // data processing
        const valueLabels = data.columns.slice(1);
        const groupLabels = d3.map(data, d => d.group).keys();

        var stackedData = [];

        if (inputIsPercentage){
            data.forEach(d => {
                let prevPercentage = 0;
                let thisPrevPercentages = [];
                let thisData = [];
                for (let valueLabel of valueLabels) {
                    thisPrevPercentages.push(prevPercentage);
                    let thisPercentage = +d[valueLabel];
                    thisData.push([thisPercentage,prevPercentage]);
                    prevPercentage += thisPercentage;
                }
                stackedData.push(thisData);
            })
        }
        else{
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

        const dataset = (displayPercentage || inputIsPercentage) ? stackedData : data.map(d => +d.value);

        if (minVal === null) { // default setting
            minVal = (inputIsPercentage || displayPercentage) ? 0 : d3.min(dataset);
        }
        else if (minVal === true) { // specified minVal
            minVal = d3.min(dataset);
        }
        else if (isNaN(minVal) || minVal === "") throw "invalid minVal for graph on " + selector;
        // else custom val

        if (maxVal === null) { // default setting
            maxVal = (inputIsPercentage || displayPercentage) ? 100 : d3.max(dataset);
        }
        else if (maxVal === true) { // specified maxVal
            maxVal = d3.max(dataset);
        }
        else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;
        // else custom val

        const x = d3.scaleBand()
            .domain(groupLabels)
            .range([0, mainWidth])
            .padding([0.3]);

        const y = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([mainHeight, 0]);

        const classNames = d3.scaleOrdinal()
            .domain(valueLabels)
            .range(d3.map(valueLabels, (d, i) => "sota-fill-" + (valueLabels.length > 3 ? (i + 1) : (2 * i + 1))).keys())

        const yAxis = mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-yAxis sota-num-axis")
            .call(d3.axisLeft(y).tickSize(-tickSize));

        const xAxis = mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-xAxis sota-text-axis")
            .call(d3.axisBottom(x).tickSize(0))
            .attr("transform", `translate(0 ${mainHeight})`);

        let overlap = false;

        const xText = xAxis.selectAll("text");
        const xTextNodes = xText.nodes();

        for (let i in xTextNodes){
            if (i == xTextNodes.length - 1) continue;
            let curr = xTextNodes[+i].getBBox();
            let next = xTextNodes[+i+1].getBBox();
            if (curr.x + curr.width > next.x){ overlap = true; break;}
        }

        if (overlap){
            xText.attr("text-anchor","end")
                .style("transform",`translateY(4px) rotate(-${labelAngle}deg)`)
                .node().classList.add("angled-label")
        }

        // legend

        let legendHeight = 0;

        let valueLabelWidths = [];

        const legend = svg.append("g")
            .lower()
            .attr("class", "sota-gen-legend")
            .attr("transform", `translate(0 ${margin.top})`)

        legend.selectAll("nothing")
            .data(valueLabels)
            .enter()
            .append("text")
            .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
            .text(d => d)
            .attr("x", function () {
                valueLabelWidths.push(this.getBBox().width);
            })
            .remove();

        if (d3.sum(valueLabelWidths, d => d) + valueLabelWidths.length * (swatchWidth + swatchBetween) + (valueLabelWidths.length - 1) * swatchRight > (mainWidth)) {
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
        }
        else {
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

        // main loop for rendering graph

        const chartGroups = mainChart.selectAll(".sota-stackedColumnChart-group")
            .data(stackedData)
            .join("g")
            .attr("class","sota-stackedColumnChart-group")
            .attr("transform",(d, i) => "translate(" + (x(groupLabels[i])) + " 0)")

        chartGroups.selectAll(".sota-stackedColumnChart-bar")
            .data(d => d)
            .join("rect")
            .attr("class", (d, i) => "sota-stackedColumnChart-bar " + classNames(i))
            .attr("x", 0)
            .attr("y", d => y(d[0]+d[1]))
            .attr("width", x.bandwidth())
            .attr("height", d => mainHeight - y(d[0]))
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

        chartGroups.selectAll(".sota-stackedColumnChart-separator")
            .data(d => d)
            .join("rect")
            .attr("class", "sota-stackedColumnChart-separator")
            .attr("fill","white")
            .attr("x", 0)
            .attr("y", (d,i) => y(d[0]) + y(d[1]) - mainHeight)
            .attr("height", d => {
                if (d[0] > 0){
                    return separatorStrokeWidth;
                }
                else{
                    return 0;
                }
            })
            .attr("width", x.bandwidth())

        mainHeight += legendHeight;
        if (overlap){
            let textWidth = [];

            const textElem = xAxis.select("text").node().getBBox();
            const textTop = textElem.y;
            const textHeight = textElem.height;

            xAxis.selectAll("text")
                .each(function(){textWidth.push(this.getBBox().width)})

            const maxTextWidth = d3.max(textWidth);
            const rotatedHeight = maxTextWidth * Math.sin(labelAngle * Math.PI / 180);
            const rotatedTextHeight = textHeight * Math.cos(labelAngle * Math.PI / 180);

            mainHeight += textTop + rotatedHeight + rotatedTextHeight;

        }
        else{
            let textBottom = [];

            xAxis.selectAll("text")
                .each(function(){textBottom.push(this.getBBox().y + this.getBBox().height)})

            mainHeight += +d3.max(textBottom);
        }


        // set widths, heights, offsets

        let height = mainHeight + margin.top + margin.bottom + legendHeight;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        mainChart.attr("transform",`translate(${margin.left+overflowOffset} ${margin.top + legendHeight})`)
            .attr("width",mainWidth)

        chartRendered(container.node());
    });
}
