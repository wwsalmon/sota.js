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

    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const hoverOpacity = 0.8;

    svg.attr("height", height);

    d3.xml("shapes/" + shapeFile + ".svg").then(shape => {

        // import shape and make it a definition

        let importedNode = document.importNode(shape.documentElement, true)
        let firstPath = d3.select(importedNode)
            .select("path")
            .node()
        let firstPathWidth = 0;

        svg.append(() => firstPath)
            .attr("class",function(){
                firstPathWidth = this.getBBox().width;
                return "";
            })
            .remove();

        let scaleFactor = shapeWidth / firstPathWidth;

        svg.append("defs")
            .append("clipPath")
            .attr("id","shapeDef")
            .append(() => firstPath)
            .attr("transform", `scale(${scaleFactor})`)

        d3.csv("data/" + dataFile + ".csv").then(data => {

            // process data
            // percentages is only used for labels so we format it and add % sign

            if (!inputIsPercentage) {
                var values = data.map(d => d.value);
                var totalResp = d3.sum(values, d => d);
                var percentages = values.map(value => d3.format(".1f")(100 * value / totalResp) + "%");
            }
            else {
                var totalResp = 100;
                var percentages = data.map(d => d3.format(".1f")(d.value) + "%");
            }
            
            // since stacked, left coordinate of each bar progresses, so we need this cumulative array

            let prevValue = 0;
            let prevValues = [];
            for (let d of data){
                prevValues.push(prevValue)
                prevValue += +d.value;
            }

            const x = d3.scaleLinear()
                .domain([0, totalResp])
                .range([0, shapeWidth]);

            const classNames = d3.scaleOrdinal()
                .domain(d3.map(data, d=>d.label))
                .range(d3.map(data, (d, i) => "module-fill-" + (i + 1)).keys())

            // main loop

            const mainChart = svg.append("g")
                .attr("class", "sota-mainChart");
                
            mainChart.selectAll(".sota-customBarChart-bar")
                .data(data)
                .join("rect")
                .attr("class", d => "sota-customBarChart-bar " + classNames(d.label))
                .attr("x", (d,i) => x(prevValues[i]))
                .attr("y", 0)
                .attr("width", d => x(d.value))
                .attr("height", height)
                .attr("clip-path", "url(#shapeDef)")
                .on("mouseover", function (d, i) {
                    d3.select(this)
                        .attr("opacity", hoverOpacity);
                    tooltip.style("opacity", 1.0)
                        .html(() => {
                            let retval = d.label + "<br/>Percentage: " + percentages[i];
                            if (!inputIsPercentage) {
                                retval += "<br/>Number of responses: " + values[i];
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

            mainChart.selectAll(".sota-customBarChart-separator")
                .data(data)
                .join("rect")
                .attr("class", "sota-customBarChart-separator")
                .attr("x", (d, i) => {
                    return (i == 0) ? -separatorStrokeWidth : x(prevValues[i]);
                })
                .attr("y", 0)
                .attr("width", separatorStrokeWidth)
                .attr("height", height)
                .attr("fill", "white")
                .attr("clip-path", "url(#shapeDef)")
        });

    })
}