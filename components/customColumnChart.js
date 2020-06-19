import * as d3 from "d3";
import {bindTooltip, toPercentage} from "../lib/tooltip.js";
import {containerSetup, processData, chartRendered, uuidv4} from "../lib/sotaChartHelpers.js";
import sotaConfig from "../lib/sotaConfig.js";

/**
 * Render sota.js custom column chart, using an SVG path as the base
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {string} shapeFile - Relative path to svg shape file, excluding file extension, i.e. "shapes/shapefile"
 * @param {number} shapeHeight - Height of shape for chart
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function customColumnChart({
    dataFile,
    selector = false,
    title = false,
    subtitle = false,
    section = false,
    shapeFile,
    shapeHeight = 300,
    inputIsPercentage = false,
    margin = sotaConfig.margin
}) {

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, 0);

    const separatorStrokeHeight = sotaConfig.separatorStrokeWidth;
    const hoverOpacity = 0.8;
    const labelBelow = sotaConfig.labelBelow;
    const lineColor = sotaConfig.lineColor;
    const coeffLabelBelow = 3;

    d3.xml(shapeFile + ".svg").then(shape => {

        // import shape and make it a definition

        let importedNode = document.importNode(shape.documentElement, true)
        let firstPath = d3.select(importedNode)
            .select("path")
            .node()
        let firstPathWidth = 0;
        let firstPathHeight = 0;

        svg.append(() => firstPath)
            .attr("class",function(){
                firstPathWidth = this.getBBox().width;
                firstPathHeight = this.getBBox().height;
                return "";
            })
            .remove();

        let scaleFactor = shapeHeight / firstPathHeight;
        let scaledWidth = firstPathWidth * scaleFactor;

        const uniqueID = uuidv4();

        svg.append("defs")
            .append("clipPath")
            .attr("id","shapeDef"+uniqueID)
            .append(() => firstPath)
            .attr("transform", `scale(${scaleFactor})`)

        d3.csv(dataFile + ".csv").then(data => {

            const [percentages, values, labels] = processData(data, inputIsPercentage);

            // since stacked, left coordinate of each bar progresses, so we need this cumulative array

            let prevValue = 0;
            let prevValues = [];
            for (let d of data){
                prevValues.push(prevValue)
                prevValue += +d.value;
            }

            const y = d3.scaleLinear()
                .domain([0, d3.sum(data, d => +d.value)])
                .range([0, shapeHeight]);

            const classNames = d3.scaleOrdinal()
                .domain(labels)
                .range(d3.map(labels, (d, i) => "sota-fill-" + (i + 1)).keys())

            // main loop

            mainChart.selectAll(".sota-customColumnChart-bar")
                .data(data)
                .join("rect")
                .attr("class", d => "sota-customColumnChart-bar " + classNames(d.label))
                .attr("x", 0)
                .attr("y", (d,i) => y(prevValues[i]))
                .attr("width", scaledWidth)
                .attr("height", d => y(d.value))
                .attr("clip-path", "url(#shapeDef"+uniqueID+")")
                .call(bindTooltip, tooltip, percentages, labels, values);

            mainChart.selectAll(".sota-customColumnChart-separator")
                .data(data)
                .join("rect")
                .attr("class", "sota-customColumnChart-separator")
                .attr("x", 0)
                .attr("y", (d, i) => (i == 0) ? -separatorStrokeHeight : y(prevValues[i]))
                .attr("width", scaledWidth)
                .attr("height", separatorStrokeHeight)
                .attr("fill", "white")
                .attr("clip-path", "url(#shapeDef"+uniqueID+")")

            // draw labels - horizontal lines to the left and right from the center of the rectangle

            mainChart.selectAll(".sota-customColumnChart-label-line")
                .data(data)
                .join("polyline")
                .attr("class", "sota-customColumnChart-label-line")
                .attr("points", (d, i) => {
                    const x1 = scaledWidth / 2;
                    const y1 = (y(prevValues[i]) + y(d.value)) / 2
                    const x2 = mainWidth;
                    const y2 = y1;
                    return `${x1},${y1} ${x2},${y2}`;
                })
                .attr("stroke-width", separatorStrokeHeight)
                .attr("stroke", lineColor)
                .attr("fill", "none");

            mainChart.selectAll(".sota-customColumnChart-label-text")
                .data(data)
                .join("text")
                .html((d,i) => `<tspan class="sota-text-label sota-heavy-label">${d.label}:</tspan><tspan class="sota-num-label"> ${toPercentage(percentages[i])}</tspan>`)
                .attr("text-anchor", "end")
                .attr("alignment-baseline", "bottom")
                .attr("dominant-baseline", "bottom")
                .attr("x", mainWidth)
                .attr("y", (d,i) => (y(prevValues[i]) + y(d.value)) / 2 - labelBelow);

            const height = shapeHeight + margin.top + margin.bottom
            svg.attr("height", height);

            mainChart.attr("transform",`translate(${margin.left} ${margin.top})`)
                .attr("width",width - margin.left - margin.right);

            chartRendered(container.node());
        });
    })
}

export default customColumnChart;