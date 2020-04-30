import { sotaConfig, hideIfOOB, toPercentage } from '../helper.js';

export default function ({
    selector,
    dataFile,
    inputIsPercentage = false,
    showXAxis = true,
    labelStyle = "onBar", // "none" | "onBar" | "aboveBar" 
    groupLabelStyle = "none", // "none" | "onBar" | "left"
    showLegend = true,
    prop5 = "value5",
    prop6 = "value6",
    margin = {
        "top": 20,
        "bottom": 20,
        "left": 6,
        "right": 20
    } }) {

    var container = d3.select(selector);
    var svg = container.append("svg");
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    const mainChart = svg.append("g")
        .attr("class", "sota-stackedBarChart-mainChart");

    var width = document.querySelector(selector).offsetWidth;

    d3.csv("data/" + dataFile + ".csv").then(data => {
        const hoverOpacity = 0.8;
        const tickSize = 8;
        const axisMargin = 16;
        const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
        const barHeight = sotaConfig.barHeight;
        const barMargin = sotaConfig.barMargin;
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
        
        // define styling variables here

        if (labelStyle == "aboveBar"){
            margin.top += labelBelow + 20;
        }

        var barspace = barHeight + barMargin;
        var height = data.length * barspace + axisMargin + margin.top;
        var marginBefore = 0;

        if (groupLabelStyle == "onBar"){
            barspace += data.length * groupLabelMargin;
            height += data.length * groupLabelMargin;
            marginBefore = groupLabelMargin;
        }

        if (showXAxis){
            height += barMargin;
        }

        svg.attr("width", width)
            .attr("height", height);

        // DATA PROCESSING

        const valueLabels = data.columns.slice(1);
        const groupLabels = d3.map(data, d => d.group).keys()

        // arrays of values and percentages

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

        const y = d3.scaleBand()
            .domain(groupLabels)
            .range([height - margin.bottom, margin.top])
            .padding([0.2])
        
        const x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width - margin.left - margin.right])

        const classNames = d3.scaleOrdinal()
            .domain(valueLabels)
            .range(d3.map(valueLabels, (d, i) => "module-fill-" + (i + 1)).keys())

        if (showXAxis) {
            mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-xAxis")
                .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
                .attr("transform", "translate(" + margin.left + " " + (height - margin.bottom) + ")");
        }

        // LEGEND

        var legendHeight = 0;

        if (showLegend){
            let valueLabelWidths = [];

            const legend = svg.append("g")
                .lower()
                .attr("class","sota-gen-legend")

            legend.selectAll("nothing")
                .data(valueLabels)
                .enter()
                .append("text")
                .attr("class","sota-gen-legend-text")
                .text(d => d)
                .attr("x", function(d){
                    valueLabelWidths.push(this.getBBox().width);
                })
                .remove();

            if (d3.sum(valueLabelWidths, d => d) + 3 * swatchBetween + 2 * swatchRight > width - margin.left - margin.right){
                // vertical legends
                let legendLeft = width - margin.right - d3.max(valueLabelWidths) - swatchWidth - swatchBetween;

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(valueLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                    .attr("x",legendLeft)
                    .attr("y", (d, i) => margin.top + (swatchHeight + swatchBelowBetween) * i)
                    .attr("width",swatchWidth)
                    .attr("height",swatchHeight)

                legend.selectAll(".sota-gen-legend-text")
                    .data(valueLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text")
                    .text(d => d)
                    .attr("x", legendLeft + swatchWidth + swatchBetween)
                    .attr("y", (d, i) => margin.top + (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                    .attr("alignment-baseline", "central")

                legendHeight = valueLabels.length * swatchHeight + (valueLabels.length - 1) * swatchBelowBetween + swatchBelow;
            }
            else{
                let legendLeft = width - margin.right - (d3.sum(valueLabelWidths, d => d) + valueLabels.length * (swatchWidth + swatchBetween) + (valueLabels.length - 1) * swatchRight);

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(valueLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(valueLabelWidths.slice(0,i), d => d))
                    .attr("y", 0)
                    .attr("width", swatchWidth)
                    .attr("height", swatchHeight)

                legend.selectAll(".sota-gen-legend-text")
                    .data(valueLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text")
                    .text(d => d)
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                    .attr("y", swatchHeight / 2)
                    .attr("alignment-baseline", "central")

                legendHeight = swatchHeight + swatchBelow;
            }
        }


        // MAIN LOOP

        const chartGroups = mainChart.selectAll(".sota-stackedBarChart-group")
            .data(stackedData)
            .join("g")
            .attr("class","sota-stackedBarChart-group")
            .attr("transform",(d, i) => "translate(0 " + (y(groupLabels[i]) + marginBefore - barMargin) + ")")
            
        chartGroups.selectAll(".sota-stackedBarChart-bar")
            .data(d => d)
            .join("rect")
            .attr("class", (d, i) => "sota-stackedBarChart-bar " + classNames(i))
            .attr("x", d => margin.left + x(d[1]))
            .attr("y", 0)
            .attr("width", d => x(d[0]))
            .attr("height", barHeight)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(() => {
                        let retval = `<span class="sota-tooltip-label">${valueLabels[i]}</span><br/>Percentage: ${toPercentage(d[0])}`;
                        if (!inputIsPercentage) {
                            retval += "<br/>Number of responses: " + d[2];
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

        chartGroups.selectAll(".sota-stackedBarChart-separator")
            .data(d => d)
            .join("rect")
            .attr("class", "sota-stackedBarChart-separator")
            .attr("fill","white")
            .attr("x", d => margin.left + x(d[1]) + x(d[0]))
            .attr("y", 0)
            .attr("width", d => {
                if (d[0] > 0){
                    return separatorStrokeWidth;
                }
                else{
                    return 0;
                }
            })
            .attr("height", barHeight)

        // onBar group label
            
        if (groupLabelStyle == "onBar"){
            mainChart.selectAll(".sota-stackedBarChart-groupLabel-onBar")
                .data(groupLabels)
                .join("text")
                .attr("class", "sota-stackedBarChart-groupLabel-onBar")
                .text(d => d)
                .attr("alignment-baseline", "bottom")
                .attr("x", margin.left)
                .attr("y", d => y(d))
        }

        var labelsHeight = 0;

        // onBar value label

        if (labelStyle == "onBar"){
            chartGroups.selectAll(".sota-stackedBarChart-label-onBar")
                .data(d => d)
                .join("text")
                .attr("class","sota-stackedBarChart-label-onBar")
                .text(d => d3.format(".1f")(d[0]) + "%")
                .attr("alignment-baseline", "central")
                .attr("text-anchor", "end")
                .attr("x", d => x(d[1]) + x(d[0]) + margin.left - labelLeft)
                .attr("y", barHeight / 2)
                .call(hideIfOOB,margin.left)
        }
         
        // aboveBar value label
        
        else if (labelStyle == "aboveBar"){

            var labelRightBounds = [];

            chartGroups.selectAll(".sota-stackedBarChart-label-aboveBar-text")
                .data(d => d)
                .join("text")
                .attr("class", "sota-stackedBarChart-label-aboveBar-text")
                .text((d, i) => `${valueLabels[i]}: ${d3.format(".1f")(d[0])}%`)
                .attr("x", d => margin.left + x(d[1]) + x(d[0]) / 2)
                .attr("y", function(d){
                    labelRightBounds.push([this.getBBox().x, this.getBBox().width]);
                    return -2 * labelBelow;
                })
                .attr("alignment-baseline", "bottom")

            let labelHeights = []

            function getLabelHeight(i) {
                if (i == labelRightBounds.length - 1){
                    labelHeights[i] = -2;
                    return -2;
                }
                else if (labelRightBounds[i][0] + labelRightBounds[i][1] + labelLeft > labelRightBounds[i+1][0]){
                    labelRightBounds[i + 1][0] = labelRightBounds[i][0] + labelRightBounds[i][1] + labelLeft;
                    let nextHeight = getLabelHeight(i+1);
                    let thisHeight = nextHeight - 1;
                    labelHeights[i] = thisHeight;
                    return thisHeight;
                }
                else{
                    getLabelHeight(i+1);
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
                    let x1 = margin.left + x(d[1]) + x(d[0]) / 2;
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

            labelsHeight = -1 * d3.min(labelHeights) * labelBelow;

        }

        svg.attr("height", height + legendHeight + labelsHeight);
        mainChart.attr("transform",`translate(0 ${legendHeight + labelsHeight})`)

    });
}