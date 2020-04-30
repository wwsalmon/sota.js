import { sotaConfig, toPercentage } from '../helper.js';

export default function ({
    selector,
    dataFile,
    inputIsPercentage = false,
    showXAxis = true,
    showSeparators = true,
    displayPercentage = true,
    totalResp = null,
    maxVal = null,
    minVal = null,
    margin = {
        "top": 0,
        "bottom": 20,
        "left": 0,
        "right": 0
    } }) {

    const lineColor = "#dddddd";
    const hoverOpacity = 0.8;
    const tickSize = 8;
    const separatorOffset = 6;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const labelLeft = sotaConfig.labelLeft;
    const barHeight = sotaConfig.barHeight;
    const barMargin = sotaConfig.barMargin;
    const overflowOffset = 12;
    const xAxisTop = sotaConfig.xAxisTop;

    var container = d3.select(selector);
    var svg = container.append("svg");
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    var width = document.querySelector(selector).offsetWidth;
    var mainWidth = width - margin.left - margin.right;

    const mainChart = svg.append("g")
        .attr("class", "sota-barChart-mainChart")
        .attr("transform", `translate(${margin.left + overflowOffset} ${margin.right})`)
        .attr("width", mainWidth);

    d3.csv("data/" + dataFile + ".csv").then(data => {

        const barspace = barHeight + barMargin;
        var mainHeight = data.length * barspace; // if show xAxis, more is added to this
        
        if (inputIsPercentage){
            var percentages = data.map(d => +d.value).keys;
        }
        else{
            totalResp = (totalResp == null) ? d3.sum(data, d => +d.value) : totalResp;
            var percentages = data.map(d => +d.value / totalResp * 100)
        }

        var dataset = (displayPercentage || inputIsPercentage) ? percentages : data.map(d => +d.value);
        var labels = data.map(d => d.label);

        if (minVal == null) { // default setting
            minVal = (inputIsPercentage || displayPercentage) ? 0 : d3.min(dataset);
        }
        else if (minVal == true) { // specified minVal
            minVal = d3.min(dataset);
        }
        else if (isNaN(minVal) || minVal == "") throw "invalid minVal for graph on " + selector;
        // else custom val

        if (maxVal == null) { // default setting
            maxVal = (inputIsPercentage || displayPercentage) ? 100 : d3.max(dataset);
        }
        else if (maxVal == true) { // specified maxVal
            maxVal = d3.max(dataset);
        }
        else if (isNaN(maxVal) || maxVal == "") throw "invalid maxVal for graph on " + selector;
        // else custom val

        const x = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([0, mainWidth]);

        if (showXAxis) {
            mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-xAxis")
                .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
                .attr("transform", "translate(" + 0 + " " + (mainHeight + xAxisTop) + ")");

            mainHeight += 20 + xAxisTop;
        }

        function y(index) { // custom y scale
            return index * barspace;
        }

        mainChart.selectAll(".sota-barChart-bar")
            .data(dataset)
            .join("rect")
            .attr("class", "sota-barChart-bar")
            .attr("width", d => x(d))
            .attr("height", barHeight)
            .attr("x", 0)
            .attr("y", (d, i) => y(i))
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(() => {
                        let retval = `<span class="sota-tooltip-label">${data[i].label}</span><br/>Percentage: ${toPercentage(percentages[i])}`;
                        if (!inputIsPercentage) {
                            retval += "<br/>Number of responses: " + data[i].value;
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

        const height = mainHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .attr("transform", `translate(${-overflowOffset} 0)`);
    });
}
