import { sotaConfig } from '../helper.js';

export default function ({
    selector,
    dataFile,
    inputIsPercentage = false,
    height = 300,
    prop1 = "value1",
    prop2 = "value2",
    prop3 = "value3",
    prop4 = "value4",
    prop5 = "value5",
    prop6 = "value6",
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

    var width = document.querySelector(selector).offsetWidth;

    svg.attr("height", height);

    d3.csv("data/" + dataFile + ".csv").then(data => {
        var hoverOpacity = 0.8;
        // define styling variables here

        // PROCESS values AND percentages

        var labels = data.map(d => d.label);

        if (!inputIsPercentage) {
            var values = data.map(d => d.value);
            var totalResp = values.reduce((a, b) => +a + +b, 0);
            var percentages = values.map(value => 100 * value / totalResp);
        }
        else {
            var percentages = data.map(d => d.value);
        }

        // process data here. Create scales, etc.

        // LABELSET for tooltip:

        if (inputIsPercentage) {
            var labelset = percentages;
            var tooltipAppend = "%";
        }
        else {
            var labelset = values;
            var tooltipAppend = "";
        }

        // run main loop here

        svg.selectAll(".sota-boilerplate-bar")
            .data(dataset)
            .join("rect")
            .attr("class", "sota-boilerplate-bar")
            // more attributes here
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(d3.format(".1f")(labels[i]) + ": " + labelset[i] + tooltipAppend)
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