import * as d3 from "d3";
import {bindTooltip, toPercentage} from "../lib/tooltip.js";
import {containerSetup, processData, chartRendered} from "../lib/sotaChartHelpers.js";
import sotaConfig from "../lib/sotaConfig.js";

/**
 * Render sota.js pie chart
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [sorted = true] - Whether or not to sort order of slices by size
 * @param {number} [pieRad = 150] - Radius of pie in chart
 * @param {number} [pieThick = 80] - Thickness of pie slices (this is actually a donut chart)
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function pieChart({
    dataFile,
    selector = false,
    title = false,
    subtitle = false,
    section = false,
    inputIsPercentage = false,
    sorted = true,
    pieRad = 150,
    pieThick = 80,
    margin = sotaConfig.margin
}) {

    const polylineColor = sotaConfig.lineColor;
    const polylineStrokeWidth = sotaConfig.separatorStrokeWidth;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;
    const legendMargin = sotaConfig.legendMargin;
    const overflowOffset = sotaConfig.overflowOffset;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);

    if (mainWidth < pieRad * 2) {
        pieRad = mainWidth / 2;
    }

    if (pieThick > pieRad) {
        pieThick = 50;
    }

    d3.csv(dataFile + ".csv").then(data => {

        const [percentages, values, labels] = processData(data, inputIsPercentage);

        const pie = sorted ? d3.pie() : d3.pie().sort(null);
        const pieData = pie(percentages);

        // generate legend

        let legendHeight = 0;

        let valueLabelWidths = [];

        const classNames = d3.scaleOrdinal()
            .domain(labels)
            .range(d3.map(labels, (d, i) => "sota-fill-" + (labels.length > 3 ? (i + 1) : (2 * i + 1))).keys())

        const legend = mainChart.append("g")
            .lower()
            .attr("class", "sota-gen-legend")
            .attr("transform", `translate(0 ${margin.top})`)

        legend.selectAll("nothing")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "sota-gen-legend-text")
            .text(d => d.label)
            .attr("x", function () {
                valueLabelWidths.push(this.getBBox().width);
            })
            .remove();

        if (d3.sum(valueLabelWidths, d => d) + (labels.length) * (swatchWidth + swatchBetween) + (labels.length - 1) * swatchRight > mainWidth) {
            // vertical legends
            let legendLeft = mainWidth - d3.max(valueLabelWidths) - swatchWidth - swatchBetween;

            legend.selectAll(".sota-gen-legend-swatch")
                .data(labels)
                .join("rect")
                .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                .attr("x", legendLeft)
                .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                .attr("width", swatchWidth)
                .attr("height", swatchHeight)

            legend.selectAll(".sota-gen-legend-text")
                .data(labels)
                .join("text")
                .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                .text(d => d)
                .attr("x", legendLeft + swatchWidth + swatchBetween)
                .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central")

            legendHeight = labels.length * swatchHeight + (labels.length - 1) * swatchBelowBetween + swatchBelow + legendMargin;
        }
        else {
            let legendLeft = mainWidth - (d3.sum(valueLabelWidths, d => d) + labels.length * (swatchWidth + swatchBetween) + (labels.length - 1) * swatchRight);

            legend.selectAll(".sota-gen-legend-swatch")
                .data(labels)
                .join("rect")
                .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(valueLabelWidths.slice(0, i), d => d))
                .attr("y", 0)
                .attr("width", swatchWidth)
                .attr("height", swatchHeight)

            legend.selectAll(".sota-gen-legend-text")
                .data(labels)
                .join("text")
                .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                .text(d => d)
                .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                .attr("y", swatchHeight / 2)
                .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central")

            legendHeight = swatchHeight + swatchBelow + legendMargin;
        }

        // centered g to place chart in

        const g = mainChart.append("g")
            .attr("transform", "translate(" + (mainWidth / 2) + "," + (pieRad + legendHeight) + ")");

        // create subgroups for labels eventually

        const arc = d3.arc()
            .innerRadius(pieRad * 0.8 - pieThick * 0.8)
            .outerRadius(pieRad * 0.8)

        const outerArc = d3.arc()
            .innerRadius(pieRad * 0.9)
            .outerRadius(pieRad * 0.9);

        g.selectAll(".sota-pieChart-slice")
            .data(pieData)
            .join("path")
            .attr("class", (d, i) => "sota-pieChart-slice " + classNames(i))
            .attr("d", arc)
            .attr("stroke", "#fff")
            .style("stroke-width", separatorStrokeWidth)
            .call(bindTooltip, tooltip, percentages, labels, values);
        
        // following code uses https://www.d3-graph-gallery.com/graph/donut_label.html as starting point. Used to be just about verbatim, now modified quite a bit

        let prevOverlap = false;

        g.selectAll(".sota-pieChart-polyline")
            .data(pieData)
            .join("polyline")
            .attr("class","sota-pieChart-polyline")
            .attr("stroke", polylineColor)
            .style("fill", "none")
            .attr("stroke-width", polylineStrokeWidth)
            .attr("points", (d, i) => {
                let posA = arc.centroid(d);
                let posB = outerArc.centroid(d);
                let posC = outerArc.centroid(d);
                const pos = outerArc.centroid(d);
                const prevPos = i > 0 && outerArc.centroid(pieData[i-1]);
                const midangle = (d.endAngle + d.startAngle) / 2;
                const isRight = midangle < Math.PI;
                if (i > 0 && Math.sign(pos[0]) == Math.sign(prevPos[0]) && Math.abs(prevPos[1] - pos[1]) < 20){
                    posC[0] = pieRad * 0.95 * ((prevOverlap ? isRight : !isRight) ? 1 : -1);
                    prevOverlap = true;
                } else{
                    posC[0] = pieRad * 0.95 * ((!prevOverlap ? isRight : !isRight) ? 1: -1);
                    prevOverlap = false;
                }
                return [posA, posB, posC];
            })

        prevOverlap = false;

        g.selectAll(".sota-pieChart-label")
            .data(pieData)
            .join("text")
            .attr("class","sota-pieChart-label sota-num-label")
            .text((d, i) => toPercentage(percentages[i]))
            .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central")
            .attr("transform", (d, i) => {
                const pos = outerArc.centroid(d);
                const prevPos = i > 0 && outerArc.centroid(pieData[i-1]);
                const midangle = (d.endAngle + d.startAngle) / 2;
                const isRight = midangle < Math.PI;
                if (i > 0 && Math.sign(pos[0]) == Math.sign(prevPos[0]) && Math.abs(prevPos[1] - pos[1]) < 20){
                    pos[0] = pieRad * 0.99 * ((prevOverlap ? isRight : !isRight) ? 1 : -1);
                    prevOverlap = true;
                } else{
                    pos[0] = pieRad * 0.99 * ((!prevOverlap ? isRight : !isRight) ? 1 : -1);
                    prevOverlap = false;
                }
                if (i == pieData.length - 1) prevOverlap = false;
                return 'translate(' + pos + ')';
            })
            .style("text-anchor", (d, i) => {
                const pos = outerArc.centroid(d);
                const prevPos = i > 0 && outerArc.centroid(pieData[i-1]);
                const midangle = (d.endAngle + d.startAngle) / 2;
                const isRight = midangle < Math.PI;
                if (i > 0 && Math.sign(pos[0]) == Math.sign(prevPos[0]) && Math.abs(prevPos[1] - pos[1]) < 20){
                    const retval = (prevOverlap ? isRight : !isRight) ? 'start' : 'end';
                    prevOverlap = true;
                    return retval;
                } else{
                    const retval = (!prevOverlap ? isRight : !isRight) ? 'start' : 'end';
                    prevOverlap = false;
                    return retval;
                }
            })

        const height = 2 * pieRad * 0.8 + legendHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        chartRendered(container.node());
    });
}

export default pieChart;