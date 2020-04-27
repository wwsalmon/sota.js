import helper from '../helper.js';

export default function ({
    selector,
    dataFile,
    inputIsPercentage = false,
    showXAxis = true,
    writePercentageOnBar = true,
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

    d3.csv("data/" + dataFile + ".csv").then(data => {
        const hoverOpacity = 0.8;
        const tickSize = 8;
        
        const barHeight = 28;
        const barMargin = 16;
        
        // define styling variables here
        
        const barspace = barHeight + barMargin;
        const height = data.length * barspace + margin.bottom;

        svg.attr("width", width)
            .attr("height", height);

        // DATA PROCESSING

        const subgroups = data.columns.slice(1);
        const groups = d3.map(data, d => d.group).keys()

        const y = d3.scaleBand()
            .domain(groups)
            .range([height - margin.bottom, margin.top])
            .padding([0.2])
        
        const x = d3.scaleLinear()
            .domain([0, 100])
            .range([margin.left, width - margin.right])

        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c', '#377eb8', '#4daf4a'])

        svg.append("g")
            .attr("class", "sota-lineGraph-axis sota-lineGraph-xAxis")
            .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
            .style("transform", "translateY(" + (height - margin.bottom) + "px)");

        svg.append("g")
            .attr("class", "sota-lineGraph-axis sota-lineGraph-yAxis")
            .call(d3.axisLeft(y).tickSize(-tickSize))
            .style("transform", "translateX(" + margin.left + "px)");

        data.forEach(d => {
            let total = 0;
            for (let i in subgroups){ name = subgroups[i]; total += +d[name]}
            for (let i in subgroups){ name = subgroups[i]; d[name] = d[name] / total * 100}
        })

        const stackedData = d3.stack().keys(subgroups)(data);

        // MAIN LOOP

        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .join("g")
            .attr("fill",d=>color(d.key))
            .selectAll("rect")
            .data(d=>d)
            .join("rect")
            .attr("y", d => y(d.data.group))
            .attr("x", d=>x(d[0]))
            .attr("width",d=>x(d[1]) - x(d[0]))
            .attr("height", barHeight)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                console.log(subgroups[i],d.data,d.data[subgroups[i]]); // broken
                tooltip.style("opacity", 1.0)
                    .html("test")
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