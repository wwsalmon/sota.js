import * as d3 from "d3";
import {bindTooltip, toPercentage} from "../lib/tooltip.js";
import processData from "../lib/processData.js";
import sotaConfig from "../lib/sotaConfig.js";
import chartRendered from "../lib/chartRendered.js";

export default function ({
    selector,
    dataFile,
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

    const container = d3.select(selector);
    const svg = container.append("svg");
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    const width = container.node().offsetWidth;
    const mainWidth = width - margin.left - margin.right;

    const mainChart = svg.append("g")
        .attr("class", "sota-barChart-mainChart")
        .attr("transform", `translate(${margin.left + overflowOffset} ${margin.top})`)
        .attr("width", mainWidth);

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
            .range(d3.map(labels, (d, i) => "module-fill-" + (labels.length > 3 ? (i + 1) : (2 * i + 1))).keys())

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

        const height = 2 * pieRad + legendHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        chartRendered(container.node());
    });
}