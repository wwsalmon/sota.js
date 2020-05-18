import * as d3 from "d3";
import {sotaConfig, toPercentage, bindTooltip, processData} from '../helper.js';

export default function ({
    selector,
    dataFile,
    inputIsPercentage = false,
    pieRad = 150,
    pieThick = 80,
    margin = sotaConfig.margin
}) {

    const hoverOpacity = 0.8;
    const polylineColor = "#999";
    const polylineStrokeWidth = 2;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;

    var container = d3.select(selector);
    var svg = container.append("svg")
        .attr("class", "sota-pieChart");
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    var width = document.querySelector(selector).offsetWidth;
    var mainWidth = width - margin.left - margin.right;

    var trueWidth = width - margin.left - margin.right;

    if (trueWidth < pieRad * 2) {
        pieRad = trueWidth / 2;
    }

    if (pieThick > pieRad) {
        pieThick = 50;
    }

    var height = pieRad * 2 + margin.top + margin.bottom;

    d3.csv(dataFile + ".csv").then(data => {

        const [percentages, values, labels] = processData(data, inputIsPercentage);
        const pie = d3.pie();
        const pieData = pie(percentages);

        // generate legend

        let legendHeight = 0;

        let valueLabelWidths = [];

        const classNames = d3.scaleOrdinal()
            .domain(labels)
            .range(d3.map(labels, (d, i) => "module-fill-" + (i + 1)).keys())

        const legend = svg.append("g")
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

        if (d3.sum(valueLabelWidths, d => d) + 3 * swatchBetween + 2 * swatchRight > mainWidth) {
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
                .attr("class", "sota-gen-legend-text")
                .text(d => d)
                .attr("x", legendLeft + swatchWidth + swatchBetween)
                .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                .attr("alignment-baseline", "central")

            legendHeight = labels.length * swatchHeight + (labels.length - 1) * swatchBelowBetween + swatchBelow;
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
                .attr("class", "sota-gen-legend-text")
                .text(d => d)
                .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                .attr("y", swatchHeight / 2)
                .attr("alignment-baseline", "central")

            legendHeight = swatchHeight + swatchBelow;
        }

        // centered g to place chart in

        const g = svg.append("g")
            .attr("transform", "translate(" + (trueWidth / 2) + "," + (pieRad + margin.top + legendHeight) + ")");

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
            .attr("class", (d, i) => "sota-pieChart-slice module-fill-" + (i + 1))
            .attr("d", arc)
            .attr("stroke", "#fff")
            .style("stroke-width", separatorStrokeWidth)
            .call(bindTooltip, tooltip, percentages, labels, values);
        
        // following code, especially calculations part, taken more or less directly from https://www.d3-graph-gallery.com/graph/donut_label.html

        g.selectAll(".sota-pieChart-polyline")
            .data(pieData)
            .join("polyline")
            .attr("class","sota-pieChart-polyline")
            .attr("stroke", polylineColor)
            .style("fill", "none")
            .attr("stroke-width", polylineStrokeWidth)
            .attr("points", d => {
                let posA = arc.centroid(d);
                let posB = outerArc.centroid(d);
                let posC = outerArc.centroid(d);
                let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                posC[0] = pieRad * 0.95 * (midangle < Math.PI ? 1: -1);
                return [posA, posB, posC];
            })

        g.selectAll(".sota-pieChart-label")
            .data(pieData)
            .join("text")
            .attr("class","sota-pieChart-label sota-floatingLabel")
            .text((d, i) => toPercentage(percentages[i]))
            .attr("alignment-baseline", "central")
            .attr("transform", d => {
                let pos = outerArc.centroid(d);
                let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = pieRad * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style("text-anchor", d => {
                let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })

        svg.attr("height", height + legendHeight);

    });
}