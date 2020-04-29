import { sotaConfig } from '../helper.js';

export default function ({
    selector,
    dataFile,
    inputIsPercentage = false,
    minVal = "minVal",
    maxVal = "maxVal",
    height = 300,
    customTooltipAppend = "",
    prop5 = "value5",
    prop6 = "value6",
    margin = {
        "top": 20,
        "bottom": 20,
        "left": 24,
        "right": 20
    } }) {

    const container = d3.select(selector);
    const svg = container.append("svg")
        .attr("class", "sota-lineGraph");
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");
    const width = document.querySelector(selector).offsetWidth;

    svg.attr("height", height);

    d3.csv("data/" + dataFile + ".csv").then(data => {
        const lineColor = "#bbb";
        const lineWidth = 3;
        const tickSize = 8;
        const circleRad = 9;
        const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
        const hoverOpacity = 0.8;
        // define styling variables here

        const labels = data.map(d => d.label);
        const values = data.map(d => +d.value);

        if (minVal == "minVal"){
            if (inputIsPercentage){
                minVal = 0;
            }
            else{
                minVal = d3.min(values);
            }
        }
        
        if (maxVal == "maxVal"){
            if (inputIsPercentage){
                maxVal = 100;
            }
            else{
                maxVal = d3.max(values);
            }
        }

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

        // process tooltip labels

        if (inputIsPercentage) {
            var tooltipAppend = "% " + customTooltipAppend;
        }
        else {
            var tooltipAppend = customTooltipAppend;
        }

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
                    .html(labels[i] + ": " + d + tooltipAppend)
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
            .style("text-anchor","middle")

    });
}