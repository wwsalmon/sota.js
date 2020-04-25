define(['d3', 'helper'], function (d3, helper) {
    return function ({
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

        var svg = d3.select(selector).append("svg");

        var width = document.querySelector(selector).offsetWidth;

        this.maxVal = maxVal;
        this.minVal = minVal;
        this.inputIsPercentage = inputIsPercentage;
        this.displayPercentage = displayPercentage;
        this.totalResp = totalResp;
        this.barheight = barheight;
        this.barmargin = barmargin;
        this.labelmargin = labelmargin;
        this.separatorOffset = separatorOffset;
        this.separatorStroke = separatorStroke;
        this.margin = margin;

        d3.csv("data/" + dataFile + ".csv").then(data => {
            var lineColor = "#dddddd"; // this is a really random place to define it lol

            var values = data.map(d => d.value);

            if (!this.inputIsPercentage) {
                if (totalResp == null) {
                    totalResp = values.reduce((a, b) => +a + +b, 0)
                }
                var percentages = values.map(value => helper.oneDecimal(100 * value / totalResp));
            }

            // SET DEFAULT maxVal and minVal values

            if (this.maxVal == null) {
                if (displayPercentage || inputIsPercentage) {
                    this.maxVal = 100;
                }
                else {
                    this.maxVal = Math.max(...values);
                }
            }
            else if (this.maxVal == "maxVal") {
                if (inputIsPercentage || !displayPercentage) {
                    this.maxVal = Math.max(...values);
                }
                else {
                    this.maxVal = Math.max(...percentages);
                }
            }

            // else maxVal should be set to number so we can move on

            if (this.minVal == null) {
                if (displayPercentage || inputIsPercentage) {
                    this.minVal = 0;
                }
                else {
                    this.minVal = Math.min(...values);
                }
            }
            else if (this.minVal == "minVal") {
                if (inputIsPercentage || !displayPercentage) {
                    this.minVal = Math.min(...values);
                }
                else {
                    this.minVal = Math.min(...percentages);
                }
            }

            // ekse minVal should be set to number so we can move on

            if (!inputIsPercentage && displayPercentage) {
                var dataset = percentages;
                var append = "%";
            }
            else {
                var dataset = values;
                if (inputIsPercentage) {
                    var append = "%";
                }
                else {
                    var append = "";
                }
            }

            var barspace = this.barheight + this.barmargin;

            var xScale = d3.scaleLinear()
                .domain([this.minVal, this.maxVal])
                .range([0, width]);

            var height = data.length * barspace + this.margin.bottom;

            svg.attr("width", width + this.margin.left)
                .attr("height", height + this.margin.top + this.margin.bottom);

            function yPos(index) {
                return index * barspace;
            }

            svg.selectAll(".module-barchart-bar")
                .data(dataset)
                .join("rect")
                .attr("class", "module-barchart-bar")
                .attr("width", d => xScale(d))
                .attr("height", this.barheight)
                .attr("x", this.margin.left)
                .attr("y", (d, i) => yPos(i));

            svg.selectAll(".module-barchart-labels")
                .data(data)
                .join("text")
                .html(d => d.label)
                .attr("alignment-baseline", "central")
                .attr("class", "module-barchart-labels")
                .attr("x", this.labelmargin)
                .attr("y", (d, i) => yPos(i) + this.barheight / 2);

            svg.selectAll(".module-barchart-separator")
                .data(dataset)
                .join("line")
                .attr("x1", this.margin.left)
                .attr("x2", width)
                .attr("y1", (d, i) => yPos(i) + this.barheight + this.separatorOffset)
                .attr("y2", (d, i) => yPos(i) + this.barheight + this.separatorOffset)
                .attr("stroke-width", this.separatorStroke)
                .attr("stroke", lineColor);

            svg.selectAll(".module-barchart-value")
                .data(dataset)
                .join("text")
                .html(d => d + append)
                .attr("alignment-baseline", "central")
                .attr("text-anchor", "end")
                .attr("class", "module-barchart-labels")
                .attr("x", width)
                .attr("y", (d, i) => yPos(i) + this.barheight / 2);
        });
    }
});

