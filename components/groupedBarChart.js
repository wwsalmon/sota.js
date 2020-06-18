import * as d3 from "d3";
import {toPercentage} from "../lib/tooltip.js";
import {containerSetup, chartRendered} from "../lib/sotaChartHelpers.js";
import sotaConfig from "../lib/sotaConfig.js";

/**
 * Render sota.js grouped bar chart * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [displayPercentage = true] - Whether to display percentage or value on axis
 * @param {number} [totalResp] - Number of total responses. Specify if categories are non-exclusive, i.e. if there are less total items than the sum of data points.
 * @param {(number|boolean)} [maxVal] - By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max.
 * @param {(number|boolean)} [minVal] - By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min.
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
export default function ({
                             dataFile,
                             selector = false,
                             title = false,
                             subtitle = false,
                             section = false,
                             totalResp = null, // dictionary: subgroup -- total
                             inputIsPercentage = false,
                             displayPercentage = true,
                             minVal = 0, // default 0, only option is hard overwrite
                             maxVal = null,
                             margin = sotaConfig.margin
                         }) {

    // define styling variables here

    const hoverOpacity = 0.8;
    const tickSize = 8;
    const barHeight = sotaConfig.groupedBarChart.barHeight;
    const barMargin = sotaConfig.groupedBarChart.barMargin;
    const overflowOffset = sotaConfig.overflowOffset;
    const groupLabelMargin = sotaConfig.groupLabelMargin;
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

        // data processing

        /*
        if inputIsPercentage
            xScale: 0 to 100
            don't do any processing on input data
        else if displayPercentage
            xScale: 0 to 100
            process input data: d / totalResp[group]
         else
            xScale: 0 to max(totalResp)
            don't process input data
         */

        window.wow = data;

        const subGroups = data.columns.splice(1);
        const groupLabels = d3.map(data, d => d.group).keys()

        const allGroupValues = d3.map(data, d => {
            let subGroupValues = [];
            for (let subGroup of subGroups){
                subGroupValues.push(+d[subGroup])
            }
            return d3.max(subGroupValues);
        }).keys()

        const valueMax = d3.max(allGroupValues, d => +d)

        if (maxVal == null){
            maxVal = (inputIsPercentage || displayPercentage) ? 100 : valueMax;
        }
        else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;

        const barspace = barHeight + barMargin;
        const groupHeight = barspace * subGroups.length;
        let mainHeight = (groupHeight + groupLabelMargin) * data.length;

        const x = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([0,mainWidth])

        const groupY = d3.scaleOrdinal()
            .domain(d3.map(data, d => d.group))
            .range(d3.map(data, (d, i) => (groupHeight + groupLabelMargin) * i).keys())

        const y = d3.scaleOrdinal()
            .domain(subGroups)
            .range(d3.map(subGroups, (d, i) => barspace * i).keys())

        const xAxis = mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-xAxis sota-groupedBarChart-xAxis sota-num-axis")
            .call(d3.axisBottom(x).tickSize(-(mainHeight + xAxisTop)))
            .attr("transform", "translate(" + 0 + " " + (mainHeight + xAxisTop) + ")");

        mainHeight += 20 + xAxisTop;

        // loop through to render stuff

        const chartGroups = mainChart.selectAll(".sota-groupedBarChart-group")
            .data(data)
            .join("g")
            .attr("class", "sota-groupedBarChart-group")
            .attr("transform", (d, i) => `translate(0 ${groupY(d.group)})`)

        const classNames = d3.scaleOrdinal()
            .domain(subGroups)
            .range(d3.map(subGroups, (d, i) => "sota-fill-" + (i + 1)).keys())

        chartGroups.selectAll(".sota-gen-bar")
            .data(d => {
                let dataset = [];
                for (let key of subGroups){dataset.push(+d[key])}
                return dataset;
            })
            .join("rect")
            .attr("class",(d, i) => `sota-gen-bar ${classNames(subGroups[i])}`)
            .attr("y", (d,i) => +y(subGroups[i]) + +groupLabelMargin)
            .attr("x", 0)
            .attr("width", (d, i) => x((inputIsPercentage) ? d : d / totalResp[subGroups[i]] * 100))
            .attr("height", barHeight)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(() => {
                        let retval = `<span class="sota-text-label"><span class="sota-heavy-label">${subGroups[i]}</span><br/>Percentage: ${toPercentage((inputIsPercentage) ? d : d / totalResp[subGroups[i]] * 100)}`;
                        if (!inputIsPercentage) {
                            retval += "<br/>Number of responses: " + d;
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

        mainChart.selectAll(".sota-gen-groupLabel")
            .data(groupLabels)
            .join("text")
            .attr("class","sota-gen-groupLabel sota-text-label sota-heavy-label")
            .text(d => d)
            .attr("alignment-baseline", "bottom")
            .attr("x", 0)
            .attr("y", d => +groupY(d) + +groupLabelMargin)
            .attr("transform", "translate(0 -8)")


        // set widths, heights, offsets
        let height = mainHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        mainChart.attr("transform",`translate(${margin.left + overflowOffset} ${margin.top})`)
            .attr("width",mainWidth)

        chartRendered(container.node());
    });
}