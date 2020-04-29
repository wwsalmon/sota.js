import { sotaConfig } from '../helper.js';

export default function ({
    selector,
    dataFile,
    shapeFile,
    shapeWidth = 200,
    inputIsPercentage = false,
    height = 300,
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

    d3.xml("shapes/" + shapeFile + ".svg").then(shape => {
        var importedNode = document.importNode(shape.documentElement, true)
        
        svg.append("defs")
            .append("svg")
            .attr("id","shape-def")
            .attr("x",0)
            .attr("y",0)
            .attr("width", shapeWidth)
            .append(() => importedNode.cloneNode(true));

        var shapeContainer = svg.append("g")
            .attr("transform", `translate(${(width - shapeWidth) / 2} 0)`);

        shapeContainer.append("use")
            .attr("xlink:href", "#shape-def")

        console.log(shape.select("#shape-def"));
    })

    d3.csv("data/" + dataFile + ".csv").then(data => {
        var hoverOpacity = 0.8;
        // define styling variables here

        // PROCESS values AND percentages

        var labels = data.map(d => d.label);

        if (!inputIsPercentage) {
            var values = data.map(d => d.value);
            var totalResp = d3.sum(values, d => d);
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

    });
}