define(['d3', 'helper'], function (d3, helper) {
    var lineGraph = {}; // replace with variable name, find and replace in entire document

    lineGraph.chart = function ({
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
            "right": 0
        } }) {

        var container = d3.select(selector);
        var svg = container.append("svg");
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

        var width = document.querySelector(selector).offsetWidth;

        svg.attr("height", height);

        lineGraph.inputIsPercentage = inputIsPercentage;
        lineGraph.minVal = minVal;
        lineGraph.maxVal = maxVal;
        lineGraph.height = height;
        lineGraph.customTooltipAppend = customTooltipAppend;
        lineGraph.prop5 = prop5;
        lineGraph.prop6 = prop6;
        lineGraph.margin = margin;

        d3.csv("data/" + dataFile + ".csv").then(data => {
            var lineColor = "#bbb";
            var lineWidth = 3;
            var tickSize = 8;
            var circleRad = 9;
            var circleStrokeWidth = 5;
            var hoverOpacity = 0.8;
            // define styling variables here

            var labels = data.map(d => d.label);
            var values = data.map(d => +d.value);

            if (lineGraph.minVal == "minVal"){
                if (inputIsPercentage){
                    lineGraph.minVal = 0;
                }
                else{
                    lineGraph.minVal = Math.min(...values);
                }
            }
            
            if (lineGraph.maxVal == "maxVal"){
                if (inputIsPercentage){
                    lineGraph.maxVal = 100;
                }
                else{
                    lineGraph.maxVal = Math.max(...values);
                }
            }

            // process data here. Create scales, etc.

            x = d3.scaleBand()
                .domain(labels.map(d => d))
                .range([margin.left, width - margin.right]);

            y = d3.scaleLinear()
                .domain([lineGraph.minVal, lineGraph.maxVal])
                .range([height - margin.bottom, margin.top]);

            svg.append("g")
                .attr("class", "module-lineGraph-axis module-lineGraph-xAxis")
                .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
                .style("transform","translateY(" + (height - margin.bottom) + "px)");

            svg.append("g")
                .attr("class","module-lineGraph-axis module-lineGraph-yAxis")
                .call(d3.axisLeft(y).tickSize(-tickSize))
                .style("transform","translateX(" + margin.left + "px)");

            // process tooltip labels

            if (inputIsPercentage) {
                var tooltipAppend = "% " + lineGraph.customTooltipAppend;
            }
            else {
                var tooltipAppend = lineGraph.customTooltipAppend;
            }

            // run main loop here

            svg.selectAll(".module-lineGraph-path")
                .data([values])
                .join("path")
                .attr("class", "module-lineGraph-path")
                .attr("d", d3.line()
                    .x((d, i) => x(labels[i]) + x.bandwidth() / 2)
                    .y(d => y(d)))
                .attr("fill","none")
                .attr("stroke",lineColor)
                .style("stroke-width",lineWidth);

            svg.selectAll(".module-lineGraph-circle")
                .data(values)
                .join("circle")
                .attr("class", "module-lineGraph-circle")
                .attr("cx", (d, i) => x(labels[i]) + x.bandwidth() / 2)
                .attr("cy", d => y(d))
                .attr("r", circleRad)
                .attr("stroke", "white")
                .style("stroke-width", circleStrokeWidth)
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

        });
    }

    return lineGraph.chart;
});