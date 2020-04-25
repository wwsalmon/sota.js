define(['d3', 'helper'], function (d3, helper) {
    var barChart = {};

    barChart.chart = function ({
        selector,
        dataFile,
        inputIsPercentage = false,
        displayPercentage = true,
        totalResp = null,
        maxVal = null,
        minVal = null,
        barheight = 28,
        barmargin = 16,
        labelmargin = 8,
        separatorOffset = 6,
        separatorStroke = 1.5,
        margin = {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0
        } }) {

        var container = d3.select(selector);
        var svg = container.append("svg");
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

        var containerDOM = document.querySelector(selector);
        var width = containerDOM.offsetWidth;
        var containerX = containerDOM.getBoundingClientRect().left;
        var containerY = containerDOM.getBoundingClientRect().top;

        barChart.maxVal = maxVal;
        barChart.minVal = minVal;
        barChart.inputIsPercentage = inputIsPercentage;
        barChart.displayPercentage = displayPercentage;
        barChart.totalResp = totalResp;
        barChart.barheight = barheight;
        barChart.barmargin = barmargin;
        barChart.labelmargin = labelmargin;
        barChart.separatorOffset = separatorOffset;
        barChart.separatorStroke = separatorStroke;
        barChart.margin = margin;

        d3.csv("data/" + dataFile + ".csv").then(data => {
            var lineColor = "#dddddd";
            var hoverOpacity = 0.8;
            var values = data.map(d => d.value);
            var barspace = barChart.barheight + barChart.barmargin;
            var height = data.length * barspace + barChart.margin.bottom;

            if (!barChart.inputIsPercentage) {
                if (totalResp == null) {
                    totalResp = values.reduce((a, b) => +a + +b, 0)
                }
                var percentages = values.map(value => helper.oneDecimal(100 * value / totalResp));
            }

            // SET DEFAULT maxVal and minVal values

            if (barChart.maxVal == null) {
                if (displayPercentage || inputIsPercentage) {
                    barChart.maxVal = 100;
                }
                else {
                    barChart.maxVal = Math.max(...values);
                }
            }
            else if (barChart.maxVal == "maxVal") {
                if (inputIsPercentage || !displayPercentage) {
                    barChart.maxVal = Math.max(...values);
                }
                else {
                    barChart.maxVal = Math.max(...percentages);
                }
            }

            // else maxVal should be set to number so we can move on

            if (barChart.minVal == null) {
                if (displayPercentage || inputIsPercentage) {
                    barChart.minVal = 0;
                }
                else {
                    barChart.minVal = Math.min(...values);
                }
            }
            else if (barChart.minVal == "minVal") {
                if (inputIsPercentage || !displayPercentage) {
                    barChart.minVal = Math.min(...values);
                }
                else {
                    barChart.minVal = Math.min(...percentages);
                }
            }

            // ekse minVal should be set to number so we can move on

            var xScale = d3.scaleLinear()
                .domain([barChart.minVal, barChart.maxVal])
                .range([0, width]);

            if (!inputIsPercentage && displayPercentage) {
                var dataset = percentages;
                var labelset = values; // show values in tooltip
                var append = "%";
                var tooltipAppend = "";
            }
            else {
                var dataset = values;
                var tooltipAppend = "%";
                if (inputIsPercentage) {
                    var append = "%";
                    var labelset = values; // will just have to show percentages in tooltip
                }
                else {
                    var append = "";
                    var labelset = percentages;
                }
            }

            svg.attr("width", width + barChart.margin.left)
                .attr("height", height + barChart.margin.top + barChart.margin.bottom);

            function yPos(index) {
                return index * barspace;
            }

            svg.selectAll(".module-barchart-bar")
                .data(dataset)
                .join("rect")
                .attr("class", "module-barchart-bar")
                .attr("width", d => xScale(d))
                .attr("height", barChart.barheight)
                .attr("x", barChart.margin.left)
                .attr("y", (d, i) => yPos(i))
                .on("mouseover", function (d, i) {
                    d3.select(this)
                        .attr("opacity", hoverOpacity);
                    tooltip.style("opacity", 1.0)
                        .html(data[i].label + ": " + labelset[i] + tooltipAppend)
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

            svg.selectAll(".module-barchart-labels")
                .data(data)
                .join("text")
                .html(d => d.label)
                .attr("alignment-baseline", "central")
                .attr("class", "module-barchart-labels")
                .attr("x", barChart.labelmargin)
                .attr("y", (d, i) => yPos(i) + barChart.barheight / 2);

            svg.selectAll(".module-barchart-separator")
                .data(dataset)
                .join("line")
                .attr("x1", barChart.margin.left)
                .attr("x2", width)
                .attr("y1", (d, i) => yPos(i) + barChart.barheight + barChart.separatorOffset)
                .attr("y2", (d, i) => yPos(i) + barChart.barheight + barChart.separatorOffset)
                .attr("stroke-width", barChart.separatorStroke)
                .attr("stroke", lineColor);

            svg.selectAll(".module-barchart-value")
                .data(dataset)
                .join("text")
                .html(d => d + append)
                .attr("alignment-baseline", "central")
                .attr("text-anchor", "end")
                .attr("class", "module-barchart-labels")
                .attr("x", width)
                .attr("y", (d, i) => yPos(i) + barChart.barheight / 2);
        });
    }

    return barChart.chart;
});

