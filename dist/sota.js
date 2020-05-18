(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
    typeof define === 'function' && define.amd ? define(['d3'], factory) :
    (global = global || self, global.sota = factory(global.d3));
}(this, (function (d3) { 'use strict';

    function hideIfOOB(elems,marginLeft){
        for (let item of elems._groups){
            if (Array.isArray(item)){
                for (let subitem of item) {
                    hideIfOOBHelper(subitem, marginLeft);
                }
            }
            else {
                hideIfOOBHelper(item, marginLeft);
            }
        }
    }

    function hideIfOOBHelper(item,marginLeft){
        if (item.getBBox().x < marginLeft){
            item.style.display = "none";
        }
    }

    function mouseXIfNotOffsreen(tooltip){
        const toSide = tooltip.node().offsetWidth / 2;
        const mouseX = d3.event.pageX;
        if (mouseX - toSide < 0){
            return toSide;
        }
        if (mouseX + toSide > window.innerWidth){
            return window.innerWidth - toSide;
        }
        return mouseX;
    }

    function processData(data, inputIsPercentage, totalResp = null){
        totalResp = (totalResp == null) ? d3.sum(data, d => +d.value) : totalResp;
        const percentages = (inputIsPercentage) ? data.map(d => +d.value).keys : data.map(d => +d.value / totalResp * 100);
        const values = (inputIsPercentage) ? false : data.map(d => +d.value);
        const labels = data.map(d => d.label);
        return [percentages, values, labels];
    }

    function toPercentage(i){
        return d3.format(".1f")(i) + "%";
    }

    function bindTooltip(selection, tooltip, percentages, labels, values){
        selection.on("mouseover", function (d, i){
            d3.select(this)
                .attr("opacity", sotaConfig.hoverOpacity);
            tooltip.style("opacity", 1.0)
                .html(() => {
                    let retval = `<span class="sota-tooltip-label">${labels[i]}</span><br/>Percentage: ${toPercentage(percentages[i])}`;
                    if (values) {
                        retval += "<br/>Number of responses: " + values[i];
                    }
                    return retval;
                })
                .style("left", mouseXIfNotOffsreen(tooltip) + "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mousemove", d => {
            tooltip.style("left", mouseXIfNotOffsreen(tooltip) + "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("opacity", 1.0);
            tooltip.style("opacity", 0);
        });

    }

    let sotaConfig = {
        separatorStrokeWidth: 2,
        barHeight: 32,
        barMargin: 16,
        labelLeft: 6,
        labelBelow: 8,
        groupLabelMargin: 32,
        xAxisTop: 24,
        overflowOffset: 24,
        lineColor: "#999999",
        mainHeight: 300,
        tickSize: 8,
        labelAngle: 30,
        groupedBarChart: {
            barHeight: 24,
            barMargin: 8
        },
        margin: {
            top: 20,
            bottom: 20,
            left: 0,
            right: 0
        },
        swatch: {
            between: 12,
            belowBetween: 8,
            right: 24,
            width: 32,
            height: 24,
            below: 16
        }
    };

    function barChart ({
        selector,
        dataFile,
        inputIsPercentage = false,
        showXAxis = true,
        showSeparators = true,
        displayPercentage = true,
        totalResp = null,
        maxVal = null,
        minVal = null,
        margin = sotaConfig.margin
    }) {

        const lineColor = "#dddddd";
        const tickSize = sotaConfig.tickSize;
        const separatorOffset = 6;
        const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
        const labelLeft = sotaConfig.labelLeft;
        const barHeight = sotaConfig.barHeight;
        const barMargin = sotaConfig.barMargin;
        const overflowOffset = sotaConfig.overflowOffset;
        const xAxisTop = sotaConfig.xAxisTop;

        const container = d3.select(selector);
        const svg = container.append("svg");
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

        const width = document.querySelector(selector).offsetWidth;
        const mainWidth = width - margin.left - margin.right;

        const mainChart = svg.append("g")
            .attr("class", "sota-barChart-mainChart")
            .attr("transform", `translate(${margin.left + overflowOffset} ${margin.right})`)
            .attr("width", mainWidth);

        d3.csv(dataFile + ".csv").then(data => {

            const barspace = barHeight + barMargin;
            let mainHeight = data.length * barspace; // if show xAxis, more is added to this

            const [percentages, values, labels] = processData(data, inputIsPercentage, totalResp);
            const dataset = (displayPercentage || inputIsPercentage) ? percentages : values;

            if (minVal == null) { // default setting
                minVal = (inputIsPercentage || displayPercentage) ? 0 : d3.min(dataset);
            }
            else if (minVal === true) { // specified minVal
                minVal = d3.min(dataset);
            }
            else if (isNaN(minVal) || minVal === "") throw "invalid minVal for graph on " + selector;
            // else custom val

            if (maxVal == null) { // default setting
                maxVal = (inputIsPercentage || displayPercentage) ? 100 : d3.max(dataset);
            }
            else if (maxVal === true) { // specified maxVal
                maxVal = d3.max(dataset);
            }
            else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;
            // else custom val

            const x = d3.scaleLinear()
                .domain([minVal, maxVal])
                .range([0, mainWidth]);

            let xAxis;

            if (showXAxis) {
                xAxis = mainChart.append("g")
                    .attr("class", "sota-gen-axis sota-gen-xAxis")
                    .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
                    .attr("transform", "translate(" + 0 + " " + (mainHeight + xAxisTop) + ")");
            }

            function y(index) { // custom y scale
                return index * barspace;
            }

            mainChart.selectAll(".sota-barChart-bar")
                .data(dataset)
                .join("rect")
                .attr("class", "sota-barChart-bar sota-gen-bar")
                .attr("width", d => x(d))
                .attr("height", barHeight)
                .attr("x", 0)
                .attr("y", (d, i) => y(i))
                .call(bindTooltip, tooltip, percentages, labels, values);

            mainChart.selectAll(".sota-barChart-label")
                .data(data)
                .join("text")
                .attr("class", "sota-barChart-label")
                .html(d => d.label)
                .attr("alignment-baseline", "central")
                .attr("x", labelLeft)
                .attr("y", (d, i) => y(i) + barHeight / 2);

            if (showSeparators){
                mainChart.selectAll(".sota-barChart-separator")
                    .data(dataset)
                    .join("line")
                    .attr("class", "sota-barChart-separator")
                    .attr("x1", 0)
                    .attr("x2", mainWidth)
                    .attr("y1", (d, i) => y(i) + barHeight + separatorOffset)
                    .attr("y2", (d, i) => y(i) + barHeight + separatorOffset)
                    .attr("stroke-width", separatorStrokeWidth)
                    .attr("stroke", lineColor);
            }

            mainChart.selectAll(".sota-barChart-value")
                .data(dataset)
                .join("text")
                .attr("class", "sota-barChart-value")
                .html((d, i) => (inputIsPercentage || displayPercentage) ? toPercentage(d) : d)
                .attr("alignment-baseline", "central")
                .attr("text-anchor", "end")
                .attr("x", mainWidth)
                .attr("y", (d, i) => y(i) + barHeight / 2);

            if (showXAxis){
                let textBottom = [];

                xAxis.selectAll("text")
                    .each(function(){textBottom.push(this.getBBox().y + this.getBBox().height);});

                mainHeight += +d3.max(textBottom);
            }

            const height = mainHeight + margin.top + margin.bottom;

            svg.style("width", width + 2 * overflowOffset + "px")
                .attr("height", height)
                .style("margin-left", -overflowOffset);
        });
    }

    function pieChart ({
        selector,
        dataFile,
        inputIsPercentage = false,
        pieRad = 150,
        pieThick = 80,
        margin = sotaConfig.margin
    }) {
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
                .range(d3.map(labels, (d, i) => "module-fill-" + (i + 1)).keys());

            const legend = svg.append("g")
                .lower()
                .attr("class", "sota-gen-legend")
                .attr("transform", `translate(0 ${margin.top})`);

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
                    .attr("height", swatchHeight);

                legend.selectAll(".sota-gen-legend-text")
                    .data(labels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text")
                    .text(d => d)
                    .attr("x", legendLeft + swatchWidth + swatchBetween)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                    .attr("alignment-baseline", "central");

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
                    .attr("height", swatchHeight);

                legend.selectAll(".sota-gen-legend-text")
                    .data(labels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text")
                    .text(d => d)
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                    .attr("y", swatchHeight / 2)
                    .attr("alignment-baseline", "central");

                legendHeight = swatchHeight + swatchBelow;
            }

            // centered g to place chart in

            const g = svg.append("g")
                .attr("transform", "translate(" + (trueWidth / 2) + "," + (pieRad + margin.top + legendHeight) + ")");

            // create subgroups for labels eventually

            const arc = d3.arc()
                .innerRadius(pieRad * 0.8 - pieThick * 0.8)
                .outerRadius(pieRad * 0.8);

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
                });

            g.selectAll(".sota-pieChart-label")
                .data(pieData)
                .join("text")
                .attr("class","sota-pieChart-label sota-floatingLabel")
                .text((d, i) => toPercentage(percentages[i]))
                .attr("alignment-baseline", "central")
                .attr("transform", d => {
                    let pos = outerArc.centroid(d);
                    let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    pos[0] = pieRad * 0.99 * (midangle < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                .style("text-anchor", d => {
                    let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    return (midangle < Math.PI ? 'start' : 'end')
                });

            svg.attr("height", height + legendHeight);

        });
    }

    function lineGraph ({
        selector,
        dataFile,
        inputIsPercentage = false,
        minVal = null,
        maxVal = null,
        height = 300,
        customTooltipAppend = "",
        prop5 = "value5",
        prop6 = "value6",
        margin = {
            "top": 20,
            "bottom": 20,
            "left": 24,
            "right": 0
        } }) {

        const container = d3.select(selector);
        const svg = container.append("svg")
            .attr("class", "sota-lineGraph");
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");
        const width = document.querySelector(selector).offsetWidth;

        svg.attr("height", height);

        d3.csv(dataFile + ".csv").then(data => {
            const lineColor = "#bbb";
            const lineWidth = 3;
            const tickSize = 8;
            const circleRad = 9;
            const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
            const hoverOpacity = 0.8;
            // define styling variables here

            const labels = data.map(d => d.label);
            const values = data.map(d => +d.value);

            if (minVal == null){ // default setting
                minVal = (inputIsPercentage) ? 0 : d3.min(data, d => d.value);
            }
            else if (minVal == true){ // specified minVal
                minVal = d3.min(data, d => d.value);
            }
            else if (isNaN(minVal) || minVal == "") throw "invalid minVal for graph on " + selector;
            // else custom val
            
            if (maxVal == null){ // default setting
                maxVal = (inputIsPercentage) ? 100 : d3.max(data, d => d.value);
            }
            else if (maxVal == true){ // specified maxVal
                maxVal = d3.max(data, d => d.value);
            }
            else if (isNaN(maxVal) || maxVal == "") throw "invalid maxVal for graph on " + selector;
            // else custom val

            // process data here. Create scales, etc.

            const x = d3.scaleBand()
                .domain(labels.map(d => d))
                .range([margin.left, width - margin.right]);

            const y = d3.scaleLinear()
                .domain([minVal, maxVal])
                .range([height - margin.bottom, margin.top]);

            svg.append("g")
                .attr("class", "sota-gen-axis sota-gen-xAxis")
                .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
                .style("transform","translateY(" + (height - margin.bottom) + "px)");

            svg.append("g")
                .attr("class", "sota-gen-axis sota-gen-YAxis")
                .call(d3.axisLeft(y).tickSize(-tickSize))
                .style("transform","translateX(" + margin.left + "px)");

            // run main loop here

            svg.selectAll(".sota-lineGraph-path")
                .data([values])
                .join("path")
                .attr("class", "sota-lineGraph-path")
                .attr("d", d3.line()
                    .x((d, i) => x(labels[i]) + x.bandwidth() / 2)
                    .y(d => y(d)))
                .attr("fill","none")
                .attr("stroke",lineColor)
                .style("stroke-width",lineWidth);

            svg.selectAll(".sota-lineGraph-circle")
                .data(values)
                .join("circle")
                .attr("class", "sota-lineGraph-circle")
                .attr("cx", (d, i) => x(labels[i]) + x.bandwidth() / 2)
                .attr("cy", d => y(d))
                .attr("r", circleRad)
                .attr("stroke", "white")
                .style("stroke-width", separatorStrokeWidth)
                // more attributes here
                .on("mouseover", function (d, i) {
                    d3.select(this)
                        .attr("opacity", hoverOpacity);
                    tooltip.style("opacity", 1.0)
                        .html(`<span class="sota-tooltip-label">${labels[i]}</span><br/>Value: ` + ((inputIsPercentage) ? toPercentage(d) : d) + "</span>")
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
                });

            svg.selectAll(".sota-lineGraph-label")
                .data(values)
                .join("text")
                .attr("class", "sota-lineGraph-label sota-floatingLabel")
                .text((d, i) => {
                    if (inputIsPercentage){
                        return d + "%";
                    }
                })
                .attr("x", (d, i) => x(labels[i]) + x.bandwidth() / 2)
                .attr("y", d => y(d) - 16)
                .style("text-anchor","middle");

        });
    }

    function stackedBarChart ({
                                 selector,
                                 dataFile,
                                 inputIsPercentage = false,
                                 showXAxis = true,
                                 labelStyle = "onBar", // "none" | "onBar" | "aboveBar"
                                 groupLabelStyle = "none", // "none" | "onBar" | "left"
                                 showLegend = true,
                                 prop5 = "value5",
                                 prop6 = "value6",
                                 margin = sotaConfig.margin
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

        var container = d3.select(selector);
        var svg = container.append("svg");
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

        var width = document.querySelector(selector).offsetWidth;
        var mainWidth = width - margin.left - margin.right;

        const mainChart = svg.append("g")
            .attr("class", "sota-stackedBarChart-mainChart")
            .attr("transform", `translate(${margin.left + overflowOffset} ${margin.right})`)
            .attr("width", mainWidth);

        d3.csv(dataFile + ".csv").then(data => {
            
            // define styling variables here

            var barspace = barHeight + barMargin;
            var mainHeight = data.length * barspace;

            var marginBefore = 0;

            if (groupLabelStyle == "onBar"){
                barspace += data.length * groupLabelMargin;
                mainHeight += data.length * groupLabelMargin;
                marginBefore = groupLabelMargin;
            }

            // DATA PROCESSING

            const valueLabels = data.columns.slice(1);
            const groupLabels = d3.map(data, d => d.group).keys();

            // arrays of values and percentages

            var stackedData = [];

            if (inputIsPercentage){
                data.forEach(d => {
                    let prevPercentage = 0;
                    let thisData = [];
                    for (let valueLabel of valueLabels) {
                        let thisPercentage = +d[valueLabel];
                        thisData.push([thisPercentage,prevPercentage]);
                        prevPercentage += thisPercentage;
                    }
                    stackedData.push(thisData);
                });
            }
            else {
                data.forEach(d => {
                    let prevPercentage = 0;
                    let total = d3.sum(valueLabels, k => +d[k]);
                    let thisData = [];
                    for (let valueLabel of valueLabels) {
                        let thisPercentage = +d[valueLabel] / total * 100;
                        thisData.push([thisPercentage, prevPercentage, +d[valueLabel]]);
                        prevPercentage += thisPercentage;
                    }
                    stackedData.push(thisData);
                });
            }

            const y = d3.scaleBand()
                .domain(groupLabels)
                .range([0,mainHeight])
                .padding([0.2]);
            
            const x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, mainWidth]);

            const classNames = d3.scaleOrdinal()
                .domain(valueLabels)
                .range(d3.map(valueLabels, (d, i) => "module-fill-" + (i + 1)).keys());

            if (showXAxis) {
                mainChart.append("g")
                    .attr("class", "sota-gen-axis sota-gen-xAxis")
                    .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
                    .attr("transform", "translate(" + 0 + " " + (mainHeight + xAxisTop) + ")");

                mainHeight += 20 + xAxisTop;
            }

            // LEGEND

            var legendHeight = 0;

            if (showLegend){
                let valueLabelWidths = [];

                const legend = svg.append("g")
                    .lower()
                    .attr("class","sota-gen-legend")
                    .attr("transform", `translate(0 ${margin.top})`);

                legend.selectAll("nothing")
                    .data(valueLabels)
                    .enter()
                    .append("text")
                    .attr("class","sota-gen-legend-text")
                    .text(d => d)
                    .attr("x", function(){
                        valueLabelWidths.push(this.getBBox().width);
                    })
                    .remove();

                if (d3.sum(valueLabelWidths, d => d) + 3 * swatchBetween + 2 * swatchRight > mainWidth){
                    // vertical legends
                    let legendLeft = mainWidth - d3.max(valueLabelWidths) - swatchWidth - swatchBetween;

                    legend.selectAll(".sota-gen-legend-swatch")
                        .data(valueLabels)
                        .join("rect")
                        .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                        .attr("x",legendLeft)
                        .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                        .attr("width",swatchWidth)
                        .attr("height",swatchHeight);

                    legend.selectAll(".sota-gen-legend-text")
                        .data(valueLabels)
                        .join("text")
                        .attr("class", "sota-gen-legend-text")
                        .text(d => d)
                        .attr("x", legendLeft + swatchWidth + swatchBetween)
                        .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                        .attr("alignment-baseline", "central");

                    legendHeight = valueLabels.length * swatchHeight + (valueLabels.length - 1) * swatchBelowBetween + swatchBelow;
                }
                else {
                    let legendLeft = mainWidth - (d3.sum(valueLabelWidths, d => d) + valueLabels.length * (swatchWidth + swatchBetween) + (valueLabels.length - 1) * swatchRight);

                    legend.selectAll(".sota-gen-legend-swatch")
                        .data(valueLabels)
                        .join("rect")
                        .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                        .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(valueLabelWidths.slice(0,i), d => d))
                        .attr("y", 0)
                        .attr("width", swatchWidth)
                        .attr("height", swatchHeight);

                    legend.selectAll(".sota-gen-legend-text")
                        .data(valueLabels)
                        .join("text")
                        .attr("class", "sota-gen-legend-text")
                        .text(d => d)
                        .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                        .attr("y", swatchHeight / 2)
                        .attr("alignment-baseline", "central");

                    legendHeight = swatchHeight + swatchBelow;
                }
            }


            // MAIN LOOP

            const chartGroups = mainChart.selectAll(".sota-stackedBarChart-group")
                .data(stackedData)
                .join("g")
                .attr("class","sota-stackedBarChart-group")
                .attr("transform",(d, i) => "translate(0 " + (y(groupLabels[i]) + marginBefore - barMargin) + ")");
                
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
                            let retval = `<span class="sota-tooltip-label">${valueLabels[i]}</span><br/>Percentage: ${toPercentage(d[0])}`;
                            if (!inputIsPercentage) {
                                retval += "<br/>Number of responses: " + d[2];
                            }
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
                });

            chartGroups.selectAll(".sota-stackedBarChart-separator")
                .data(d => d)
                .join("rect")
                .attr("class", "sota-stackedBarChart-separator")
                .attr("fill","white")
                .attr("x", d => x(d[1]) + x(d[0]))
                .attr("y", 0)
                .attr("width", d => {
                    if (d[0] > 0){
                        return separatorStrokeWidth;
                    }
                    else {
                        return 0;
                    }
                })
                .attr("height", barHeight);

            // onBar group label
                
            if (groupLabelStyle == "onBar"){
                mainChart.selectAll(".sota-stackedBarChart-groupLabel-onBar")
                    .data(groupLabels)
                    .join("text")
                    .attr("class", "sota-stackedBarChart-groupLabel-onBar sota-gen-groupLabel")
                    .text(d => d)
                    .attr("alignment-baseline", "bottom")
                    .attr("x", 0)
                    .attr("y", d => y(d));
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
                    .attr("x", d => x(d[1]) + x(d[0]) - labelLeft)
                    .attr("y", barHeight / 2)
                    .call(hideIfOOB,margin.left);
            }
             
            // aboveBar value label
            
            else if (labelStyle == "aboveBar"){

                var labelRightBounds = [];

                chartGroups.selectAll(".sota-stackedBarChart-label-aboveBar-text")
                    .data(d => d)
                    .join("text")
                    .attr("class", "sota-stackedBarChart-label-aboveBar-text")
                    .text((d, i) => `${valueLabels[i]}: ${d3.format(".1f")(d[0])}%`)
                    .attr("x", d => x(d[1]) + x(d[0]) / 2)
                    .attr("y", function(d){
                        labelRightBounds.push([this.getBBox().x, this.getBBox().width]);
                        return -2 * labelBelow;
                    })
                    .attr("alignment-baseline", "bottom");

                let labelHeights = [];

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
                    else {
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
                    .attr("fill", "none");

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
                .style("margin-left", -overflowOffset);

            mainChart.attr("transform",`translate(${overflowOffset} ${margin.top + legendHeight + labelsHeight})`)
                .attr("width", mainWidth);

        });
    }

    function customBarChart ({
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
        const labelLeft = sotaConfig.labelLeft;
        const labelBelow = sotaConfig.labelBelow;
        const lineColor = sotaConfig.lineColor;
        const coeffLabelBelow = 3;

        d3.xml("shapes/" + shapeFile + ".svg").then(shape => {

            // import shape and make it a definition

            let importedNode = document.importNode(shape.documentElement, true);
            let firstPath = d3.select(importedNode)
                .select("path")
                .node();
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
                .attr("transform", `scale(${scaleFactor})`);

            d3.csv(dataFile + ".csv").then(data => {

                const [percentages, values, labels] = processData(data, inputIsPercentage);
                
                // since stacked, left coordinate of each bar progresses, so we need this cumulative array

                let prevValue = 0;
                let prevValues = [];
                for (let d of data){
                    prevValues.push(prevValue);
                    prevValue += +d.value;
                }

                const x = d3.scaleLinear()
                    .domain([0, d3.sum(data, d => +d.value)])
                    .range([0, shapeWidth]);

                const classNames = d3.scaleOrdinal()
                    .domain(d3.map(data, d=>d.label))
                    .range(d3.map(data, (d, i) => "module-fill-" + (i + 1)).keys());

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
                    .call(bindTooltip, tooltip, percentages, labels, values);

                mainChart.selectAll(".sota-customBarChart-separator")
                    .data(data)
                    .join("rect")
                    .attr("class", "sota-customBarChart-separator")
                    .attr("x", (d, i) => (i == 0) ? -separatorStrokeWidth : x(prevValues[i]))
                    .attr("y", 0)
                    .attr("width", separatorStrokeWidth)
                    .attr("height", scaledHeight)
                    .attr("fill", "white")
                    .attr("clip-path", "url(#shapeDef)");

                // draw labels. Code taken just about verbatim from stackedBarChart aboveBar label

                var labelRightBounds = [];

                mainChart.selectAll(".sota-customBarChart-label-aboveBar-text")
                    .data(data)
                    .join("text")
                    .attr("class", "sota-customBarChart-label-aboveBar-text")
                    .text((d,i) => `${d.label}: ${toPercentage(percentages[i])}`)
                    .attr("x", (d,i) => x(prevValues[i]) + x(d.value) / 2 + labelLeft)
                    .attr("y", function (d) {
                        labelRightBounds.push([this.getBBox().x, this.getBBox().width]);
                        return scaledHeight + 3 * labelBelow;
                    })
                    .attr("alignment-baseline", "top");

                let labelHeights = [];

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
                    .attr("fill", "none");

                mainChart.selectAll(".sota-customBarChart-label-aboveBar-text")
                    .data(data)
                    .join("text")
                    .attr("x", (d, i) => labelRightBounds[i][0])
                    .attr("y", (d, i) => scaledHeight + labelHeights[i] * labelBelow);

                let labelsHeight = d3.max(labelHeights) * labelBelow + 20;

                let height = scaledHeight + margin.top + margin.bottom + labelsHeight;

                svg.attr("height", height);

                mainChart.attr("transform",`translate(${margin.left} ${margin.top})`)
                    .attr("width",width - margin.left - margin.right);

            });

        });
    }

    function columnChart ({
                                 selector,
                                 dataFile,
                                 inputIsPercentage = false,
                                 displayPercentage = true,
                                 totalResp = null,
                                 maxVal = null,
                                 minVal = null,
                                 mainHeight = sotaConfig.mainHeight,
                                 showLegend = false, // if false, x axis shown instead
                                 margin = {
                                     "top": 20,
                                     "bottom": 20,
                                     "left": 24,
                                     "right": 0
                                 }
                             }) {
        const overflowOffset = sotaConfig.overflowOffset;
        const tickSize = sotaConfig.tickSize;
        const labelAngle = sotaConfig.labelAngle;
        const swatchBetween = sotaConfig.swatch.between;
        const swatchRight = sotaConfig.swatch.right;
        const swatchWidth = sotaConfig.swatch.width;
        const swatchHeight = sotaConfig.swatch.height;
        const swatchBelowBetween = sotaConfig.swatch.belowBetween;
        const swatchBelow = sotaConfig.swatch.below;

        const container = d3.select(selector);
        const svg = container.append("svg");
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

        const mainChart = svg.append("g")
            .attr("class", "sota-mainChart");

        const width = document.querySelector(selector).offsetWidth;
        const mainWidth = width - margin.left - margin.right;

        d3.csv(dataFile + ".csv").then(data => {

            const [percentages, values, labels] = processData(data, inputIsPercentage, totalResp);
            const dataset = (displayPercentage || inputIsPercentage) ? percentages : values;

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
                .domain(labels)
                .range([0, mainWidth])
                .padding([0.3]);

            const y = d3.scaleLinear()
                .domain([minVal, maxVal])
                .range([mainHeight, 0]);

            const classNames = d3.scaleOrdinal()
                .domain(labels)
                .range(d3.map(labels, (d, i) => "module-fill-" + (i + 1)).keys());

            let legendHeight = 0;
            let overlap = false;
            let xAxis;

            if (showLegend){

                let valueLabelWidths = [];

                const legend = svg.append("g")
                    .lower()
                    .attr("class", "sota-gen-legend")
                    .attr("transform", `translate(0 ${margin.top})`);

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

                if (d3.sum(valueLabelWidths, d => d) + valueLabelWidths.length * swatchBetween + (valueLabelWidths.length - 1) * swatchRight > mainWidth) {
                    // vertical legends
                    let legendLeft = mainWidth - d3.max(valueLabelWidths) - swatchWidth - swatchBetween;

                    legend.selectAll(".sota-gen-legend-swatch")
                        .data(labels)
                        .join("rect")
                        .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                        .attr("x", legendLeft)
                        .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                        .attr("width", swatchWidth)
                        .attr("height", swatchHeight);

                    legend.selectAll(".sota-gen-legend-text")
                        .data(labels)
                        .join("text")
                        .attr("class", "sota-gen-legend-text")
                        .text(d => d)
                        .attr("x", legendLeft + swatchWidth + swatchBetween)
                        .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                        .attr("alignment-baseline", "central");

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
                        .attr("height", swatchHeight);

                    legend.selectAll(".sota-gen-legend-text")
                        .data(labels)
                        .join("text")
                        .attr("class", "sota-gen-legend-text")
                        .text(d => d)
                        .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                        .attr("y", swatchHeight / 2)
                        .attr("alignment-baseline", "central");

                    legendHeight = swatchHeight + swatchBelow;
                }
            }
            else {
                xAxis = mainChart.append("g")
                    .attr("class", "sota-gen-axis sota-gen-xAxis")
                    .call(d3.axisBottom(x).tickSize(0))
                    .attr("transform", `translate(0 ${mainHeight})`);

                // fix xAxis label overlap

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
                        .style("transform",`translateY(4px) rotate(-${labelAngle}deg)`);
                }
            }

            const yAxis = mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-yAxis")
                .call(d3.axisLeft(y).tickSize(-tickSize));

            // loop through to render stuff

            mainChart.selectAll(".sota-columnChart-bar")
                .data(dataset)
                .join("rect")
                .attr("class", (d,i) => {
                    let retval = "sota-columnChart-bar sota-gen-bar";
                    retval += (showLegend) ? ` ${classNames(labels[i])}` : "";
                    return retval;
                })
                .attr("x", (d,i) => x(labels[i]))
                .attr("y", d => y(d))
                .attr("width", x.bandwidth())
                .attr("height", d => mainHeight - y(d))
                .call(bindTooltip, tooltip, percentages, labels, values);

            // get mainHeight based on x axis

            if (showLegend) {
                mainHeight += legendHeight;
            } else {
                if (overlap){
                    let textWidth = [];

                    const textElem = xAxis.select("text").node().getBBox();
                    const textTop = textElem.y;
                    const textHeight = textElem.height;

                    xAxis.selectAll("text")
                        .each(function(){textWidth.push(this.getBBox().width);});

                    const maxTextWidth = d3.max(textWidth);
                    const rotatedHeight = maxTextWidth * Math.sin(labelAngle * Math.PI / 180);
                    const rotatedTextHeight = textHeight * Math.cos(labelAngle * Math.PI / 180);

                    mainHeight += textTop + rotatedHeight + rotatedTextHeight;

                }
                else {
                    let textBottom = [];

                    xAxis.selectAll("text")
                        .each(function(){textBottom.push(this.getBBox().y + this.getBBox().height);});

                    mainHeight += +d3.max(textBottom);
                }
            }

            // set widths, heights, offsets

            let height = mainHeight + margin.top + margin.bottom;

            svg.style("width", width + 2 * overflowOffset + "px")
                .attr("height", height)
                .style("margin-left", -overflowOffset);

            mainChart.attr("transform", `translate(${margin.left + overflowOffset} ${margin.top + legendHeight})`)
                .attr("width", mainWidth);

        });
    }

    function groupedBarChart ({
                                 selector,
                                 dataFile,
                                 totalResp = null, // dictionary: subgroup -- total
                                 inputIsPercentage = false,
                                 displayPercentage = true,
                                 minVal = 0, // default 0, only option is hard overwrite
                                 maxVal = null,
                                 margin = sotaConfig.margin
                             }) {

        // define styling variables here

        const hoverOpacity = 0.8;
        const barHeight = sotaConfig.groupedBarChart.barHeight;
        const barMargin = sotaConfig.groupedBarChart.barMargin;
        const overflowOffset = sotaConfig.overflowOffset;
        const groupLabelMargin = sotaConfig.groupLabelMargin;
        const xAxisTop = sotaConfig.xAxisTop;

        const container = d3.select(selector);
        const svg = container.append("svg");
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

        const mainChart = svg.append("g")
            .attr("class", "sota-mainChart");

        const width = document.querySelector(selector).offsetWidth;
        const mainWidth = width - margin.left - margin.right;

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
            const groupLabels = d3.map(data, d => d.group).keys();

            const allGroupValues = d3.map(data, d => {
                let subGroupValues = [];
                for (let subGroup of subGroups){
                    subGroupValues.push(+d[subGroup]);
                }
                return d3.max(subGroupValues);
            }).keys();

            const valueMax = d3.max(allGroupValues, d => +d);

            if (maxVal == null){
                maxVal = (inputIsPercentage || displayPercentage) ? 100 : valueMax;
            }
            else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;

            const barspace = barHeight + barMargin;
            const groupHeight = barspace * subGroups.length;
            let mainHeight = (groupHeight + groupLabelMargin) * data.length;

            const x = d3.scaleLinear()
                .domain([minVal, maxVal])
                .range([0,mainWidth]);

            const groupY = d3.scaleOrdinal()
                .domain(d3.map(data, d => d.group))
                .range(d3.map(data, (d, i) => (groupHeight + groupLabelMargin) * i).keys());

            const y = d3.scaleOrdinal()
                .domain(subGroups)
                .range(d3.map(subGroups, (d, i) => barspace * i).keys());

            const xAxis = mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-xAxis sota-groupedBarChart-xAxis")
                .call(d3.axisBottom(x).tickSize(-(mainHeight + xAxisTop)))
                .attr("transform", "translate(" + 0 + " " + (mainHeight + xAxisTop) + ")");

            mainHeight += 20 + xAxisTop;

            // loop through to render stuff

            const chartGroups = mainChart.selectAll(".sota-groupedBarChart-group")
                .data(data)
                .join("g")
                .attr("class", "sota-groupedBarChart-group")
                .attr("transform", (d, i) => `translate(0 ${groupY(d.group)})`);

            const classNames = d3.scaleOrdinal()
                .domain(subGroups)
                .range(d3.map(subGroups, (d, i) => "module-fill-" + (i + 1)).keys());

            chartGroups.selectAll(".sota-gen-bar")
                .data(d => {
                    let dataset = [];
                    for (let key of subGroups){dataset.push(+d[key]);}
                    return dataset;}
                    )
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
                            let retval = `<span class="sota-tooltip-label">${subGroups[i]}</span><br/>Percentage: ${toPercentage((inputIsPercentage) ? d : d / totalResp[subGroups[i]] * 100)}`;
                            if (!inputIsPercentage) {
                                retval += "<br/>Number of responses: " + d;
                            }
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
                });

            mainChart.selectAll(".sota-gen-groupLabel")
                .data(groupLabels)
                .join("text")
                .attr("class","sota-gen-groupLabel")
                .text(d => d)
                .attr("alignment-baseline", "bottom")
                .attr("x", 0)
                .attr("y", d => +groupY(d) + +groupLabelMargin)
                .attr("transform", "translate(0 -8)");


            // set widths, heights, offsets
            let height = mainHeight + margin.top + margin.bottom;

            svg.style("width", width + 2 * overflowOffset + "px")
                .attr("height", height)
                .style("margin-left", -overflowOffset);

            mainChart.attr("transform",`translate(${margin.left + overflowOffset} ${margin.top})`)
                .attr("width",mainWidth);

        });
    }

    function stackedColumnChart ({
                                 selector,
                                 dataFile,
                                 inputIsPercentage = false,
                                 displayPercentage = true,
                                 totalResp = null,
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
        const swatchBetween = sotaConfig.swatch.between;
        const swatchRight = sotaConfig.swatch.right;
        const swatchWidth = sotaConfig.swatch.width;
        const swatchHeight = sotaConfig.swatch.height;
        const swatchBelowBetween = sotaConfig.swatch.belowBetween;
        const swatchBelow = sotaConfig.swatch.below;

        const container = d3.select(selector);
        const svg = container.append("svg");
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

        const mainChart = svg.append("g")
            .attr("class", "sota-stackedColumnChart-mainChart");

        const width = document.querySelector(selector).offsetWidth;
        const mainWidth = width - margin.left - margin.right;

        d3.csv(dataFile + ".csv").then(data => {

            // data processing
            const valueLabels = data.columns.slice(1);
            const groupLabels = d3.map(data, d => d.group).keys();

            var stackedData = [];

            if (inputIsPercentage){
                data.forEach(d => {
                    let prevPercentage = 0;
                    let thisData = [];
                    for (let valueLabel of valueLabels) {
                        let thisPercentage = +d[valueLabel];
                        thisData.push([thisPercentage,prevPercentage]);
                        prevPercentage += thisPercentage;
                    }
                    stackedData.push(thisData);
                });
            }
            else {
                data.forEach(d => {
                    let prevPercentage = 0;
                    let total = d3.sum(valueLabels, k => +d[k]);
                    let thisData = [];
                    for (let valueLabel of valueLabels) {
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
                .range(d3.map(valueLabels, (d, i) => "module-fill-" + (i + 1)).keys());

            const yAxis = mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-yAxis")
                .call(d3.axisLeft(y).tickSize(-tickSize));

            const xAxis = mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-xAxis")
                .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
                .attr("transform", "translate(" + 0 + " " + (mainHeight) + ")");

            // legend

            let legendHeight = 0;

            let valueLabelWidths = [];

            const legend = svg.append("g")
                .lower()
                .attr("class", "sota-gen-legend")
                .attr("transform", `translate(0 ${margin.top})`);

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

            if (d3.sum(valueLabelWidths, d => d) + valueLabelWidths.length * swatchBetween + (valueLabelWidths.length - 1) * swatchRight > mainWidth) {
                // vertical legends
                let legendLeft = mainWidth - d3.max(valueLabelWidths) - swatchWidth - swatchBetween;

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(valueLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                    .attr("x", legendLeft)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                    .attr("width", swatchWidth)
                    .attr("height", swatchHeight);

                legend.selectAll(".sota-gen-legend-text")
                    .data(valueLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text")
                    .text(d => d)
                    .attr("x", legendLeft + swatchWidth + swatchBetween)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                    .attr("alignment-baseline", "central");

                legendHeight = valueLabels.length * swatchHeight + (valueLabels.length - 1) * swatchBelowBetween + swatchBelow;
            }
            else {
                let legendLeft = mainWidth - (d3.sum(valueLabelWidths, d => d) + valueLabels.length * (swatchWidth + swatchBetween) + (valueLabels.length - 1) * swatchRight);

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(valueLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(valueLabelWidths.slice(0, i), d => d))
                    .attr("y", 0)
                    .attr("width", swatchWidth)
                    .attr("height", swatchHeight);

                legend.selectAll(".sota-gen-legend-text")
                    .data(valueLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text")
                    .text(d => d)
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                    .attr("y", swatchHeight / 2)
                    .attr("alignment-baseline", "central");

                legendHeight = swatchHeight + swatchBelow;
            }

            // main loop for rendering graph

            const chartGroups = mainChart.selectAll(".sota-stackedColumnChart-group")
                .data(stackedData)
                .join("g")
                .attr("class","sota-stackedColumnChart-group")
                .attr("transform",(d, i) => "translate(" + (x(groupLabels[i])) + " 0)");

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
                            let retval = `<span class="sota-tooltip-label">${valueLabels[i]}</span><br/>Percentage: ${toPercentage(d[0])}`;
                            if (!inputIsPercentage) {
                                retval += "<br/>Number of responses: " + d[2];
                            }
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
                });

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
                    else {
                        return 0;
                    }
                })
                .attr("width", x.bandwidth());


            mainHeight += legendHeight;
            {
                let textBottom = [];

                xAxis.selectAll("text")
                    .each(function(){textBottom.push(this.getBBox().y + this.getBBox().height);});

                mainHeight += +d3.max(textBottom);
            }


            // set widths, heights, offsets

            let height = mainHeight + margin.top + margin.bottom + legendHeight;

            svg.style("width", width + 2 * overflowOffset + "px")
                .attr("height", height)
                .style("margin-left", -overflowOffset);

            mainChart.attr("transform",`translate(${margin.left+overflowOffset} ${margin.top + legendHeight})`)
                .attr("width",mainWidth);

        });
    }

    let sota = {};

    sota.barChart = barChart;
    sota.pieChart = pieChart;
    sota.lineGraph = lineGraph;
    sota.stackedBarChart = stackedBarChart;
    sota.customBarChart = customBarChart;
    sota.columnChart = columnChart;
    sota.groupedBarChart = groupedBarChart;
    sota.stackedColumnChart = stackedColumnChart;

    /*
    TO COPY PASTE WHEN IMPORTING NEW COMPONENTS

    import boilerplate from "./components/boilerplate.js";
    sota.boilerplate = boilerplate;
    */

    return sota;

})));
