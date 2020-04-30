import { sotaConfig } from '../helper.js';

export default function ({
    selector,
    dataFile,
    shapeFile,
    shapeWidth = 300,
    inputIsPercentage = false,
    margin = sotaConfig.margin
}) {

    var container = d3.select(selector);
    var svg = container.append("svg");
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    const mainChart = svg.append("g")
        .attr("class", "sota-mainChart");

    var width = document.querySelector(selector).offsetWidth;

    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const hoverOpacity = 0.8;
    const labelLeft = sotaConfig.labelLeft;
    const labelBelow = sotaConfig.labelBelow;
    const lineColor = sotaConfig.lineColor;
    const coeffLabelBelow = 3;

    d3.xml("shapes/" + shapeFile + ".svg").then(shape => {

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

        let scaleFactor = shapeWidth / firstPathWidth;
        let scaledHeight = firstPathHeight * scaleFactor;

        svg.append("defs")
            .append("clipPath")
            .attr("id","shapeDef")
            .append(() => firstPath)
            .attr("transform", `scale(${scaleFactor})`)

        d3.csv("data/" + dataFile + ".csv").then(data => {

            // process data
            // percentages is only used for labels so we format it and add % sign

            if (!inputIsPercentage) {
                var values = data.map(d => d.value);
                var totalResp = d3.sum(values, d => d);
                var percentages = values.map(value => d3.format(".1f")(100 * value / totalResp) + "%");
            }
            else {
                var totalResp = 100;
                var percentages = data.map(d => d3.format(".1f")(d.value) + "%");
            }
            
            // since stacked, left coordinate of each bar progresses, so we need this cumulative array

            let prevValue = 0;
            let prevValues = [];
            for (let d of data){
                prevValues.push(prevValue)
                prevValue += +d.value;
            }

            const x = d3.scaleLinear()
                .domain([0, totalResp])
                .range([0, shapeWidth]);

            const classNames = d3.scaleOrdinal()
                .domain(d3.map(data, d=>d.label))
                .range(d3.map(data, (d, i) => "module-fill-" + (i + 1)).keys())

            // main loop
                
            mainChart.selectAll(".sota-customBarChart-bar")
                .data(data)
                .join("rect")
                .attr("class", d => "sota-customBarChart-bar " + classNames(d.label))
                .attr("x", (d,i) => x(prevValues[i]))
                .attr("y", 0)
                .attr("width", d => x(d.value))
                .attr("height", scaledHeight)
                .attr("clip-path", "url(#shapeDef)")
                .on("mouseover", function (d, i) {
                    d3.select(this)
                        .attr("opacity", hoverOpacity);
                    tooltip.style("opacity", 1.0)
                        .html(() => {
                            let retval = `<span class="sota-tooltip-label">${data[i].label}</span><br/>Percentage: ${percentages[i]}`;
                            if (!inputIsPercentage) {
                                retval += "<br/>Number of responses: " + values[i];
                            }
                            return retval;
                        })
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
                })

            mainChart.selectAll(".sota-customBarChart-separator")
                .data(data)
                .join("rect")
                .attr("class", "sota-customBarChart-separator")
                .attr("x", (d, i) => (i == 0) ? -separatorStrokeWidth : x(prevValues[i]))
                .attr("y", 0)
                .attr("width", separatorStrokeWidth)
                .attr("height", scaledHeight)
                .attr("fill", "white")
                .attr("clip-path", "url(#shapeDef)")

            // draw labels. Code taken just about verbatim from stackedBarChart aboveBar label

            var labelRightBounds = [];

            mainChart.selectAll(".sota-customBarChart-label-aboveBar-text")
                .data(data)
                .join("text")
                .attr("class", "sota-customBarChart-label-aboveBar-text")
                .text((d,i) => `${d.label}: ${percentages[i]}`)
                .attr("x", (d,i) => x(prevValues[i]) + x(d.value) / 2 + labelLeft)
                .attr("y", function (d) {
                    labelRightBounds.push([this.getBBox().x, this.getBBox().width]);
                    return scaledHeight + 3 * labelBelow;
                })
                .attr("alignment-baseline", "top")

            let labelHeights = []

            function getLabelHeight(i) {
                if (i == labelRightBounds.length - 1) {
                    labelHeights[i] = coeffLabelBelow;
                    return coeffLabelBelow;
                }
                else if (labelRightBounds[i][0] + labelRightBounds[i][1] + 2 * labelLeft > labelRightBounds[i + 1][0]) {
                    labelRightBounds[i + 1][0] = labelRightBounds[i][0] + labelRightBounds[i][1] + 2 * labelLeft;
                    let nextHeight = getLabelHeight(i + 1);
                    let thisHeight = nextHeight + 1;
                    labelHeights[i] = thisHeight;
                    return thisHeight;
                }
                else {
                    getLabelHeight(i + 1);
                    labelHeights[i] = coeffLabelBelow;
                    return coeffLabelBelow;
                }
            }

            getLabelHeight(0);

            mainChart.selectAll(".sota-customBarChart-label-aboveBar-line")
                .data(data)
                .join("polyline")
                .attr("class", "sota-customBarChart-label-aboveBar-line")
                .attr("points", (d, i) => {
                    let x1 = x(prevValues[i]) + x(d.value) / 2;
                    let y1 = scaledHeight - labelBelow;
                    let x2 = x1;
                    let y2 = scaledHeight + (labelHeights[i] + 1) * labelBelow;
                    let x3 = labelRightBounds[i][0] + labelRightBounds[i][1];
                    let y3 = y2;
                    return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
                })
                .attr("stroke-width", separatorStrokeWidth)
                .attr("stroke", lineColor)
                .attr("fill", "none")

            mainChart.selectAll(".sota-customBarChart-label-aboveBar-text")
                .data(data)
                .join("text")
                .attr("x", (d, i) => labelRightBounds[i][0])
                .attr("y", (d, i) => scaledHeight + labelHeights[i] * labelBelow);

            let labelsHeight = d3.max(labelHeights) * labelBelow + 20;

            let height = scaledHeight + margin.top + margin.bottom + labelsHeight;

            svg.attr("height", height);

            mainChart.attr("transform",`translate(${margin.left} ${margin.top})`)
                .attr("width",width - margin.left - margin.right)

        });

    })
}