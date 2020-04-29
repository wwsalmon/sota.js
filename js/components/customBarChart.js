import { sotaConfig } from '../helper.js';

export default function ({
    selector,
    dataFile,
    shapeFile,
    shapeWidth = 300,
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

        // import shape and make it a definition

        var importedNode = document.importNode(shape.documentElement, true)

        var firstPath = d3.select(importedNode)
            .select("path")

        console.log(firstPath);

        let shapeCurrentWidth = 0;

        var shapeContainer = svg.append("g");

        shapeContainer.append(() => firstPath._groups[0][0])
            .attr("class", "sota-shapePath")
            .attr("transform",function(){
                return `scale(${shapeWidth / this.getBBox().width})`
            })

        d3.csv("data/" + dataFile + ".csv").then(data => {

            // process data

            if (!inputIsPercentage) {
                var values = data.map(d => d.value);
                var totalResp = d3.sum(values, d => d);
                var percentages = values.map(value => 100 * value / totalResp);
            }
            else {
                var percentages = data.map(d => d.value);
            }

            // configure labelset

            if (inputIsPercentage) {
                var labelset = d3.map(percentages, d => d3.format(".1f")(d) + "%");
            }
            else {
                var labelset = values;
            }

        });

    })

    d3.csv("data/" + dataFile + ".csv").then(data => {
        var hoverOpacity = 0.8;
        // define styling variables here

        // PROCESS values AND percentages

        var labels = data.map(d => d.label);

        // process data here. Create scales, etc.

        // LABELSET for tooltip:

        // run main loop here

    });
}