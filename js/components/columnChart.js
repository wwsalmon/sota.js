import {sotaConfig, toPercentage} from '../helper.js';

export default function ({
                             selector,
                             dataFile,
                             inputIsPercentage = false,
                             displayPercentage = true,
                             totalResp = null,
                             maxVal = null,
                             minVal = null,
                             mainHeight = sotaConfig.mainHeight,
                             showLegend = false,
                             margin = {
                                 "top": 20,
                                 "bottom": 20,
                                 "left": 24,
                                 "right": 0
                             }
                         }) {

    // define styling variables here

    const hoverOpacity = 0.8;
    const overflowOffset = sotaConfig.overflowOffset;
    const xAxisTop = sotaConfig.xAxisTop;
    const tickSize = sotaConfig.tickSize;

    const container = d3.select(selector);
    const svg = container.append("svg");
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    const mainChart = svg.append("g")
        .attr("class", "sota-mainChart");

    const width = document.querySelector(selector).offsetWidth;
    const mainWidth = width - margin.left - margin.right;

    d3.csv("data/" + dataFile + ".csv").then(data => {

        let percentages;

        if (inputIsPercentage){
            percentages = data.map(d => +d.value).keys;
        }
        else{
            totalResp = (totalResp == null) ? d3.sum(data, d => +d.value) : totalResp;
            percentages = data.map(d => +d.value / totalResp * 100)
        }

        const dataset = (displayPercentage || inputIsPercentage) ? percentages : data.map(d => +d.value);
        const labels = data.map(d => d.label);

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
        else if (maxVal === true) { // specified maxVal
            maxVal = d3.max(dataset);
        }
        else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;
        // else custom val

        const x = d3.scaleBand()
            .domain(labels)
            .range([0, mainWidth])
            .padding([0.3]);

        const y = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([mainHeight, 0]);

        const classNames = d3.scaleOrdinal()
            .domain(labels)
            .range(d3.map(labels, (d, i) => "module-fill-" + (i + 1)).keys())

        const xAxis = mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-xAxis")
            .call(d3.axisBottom(x).tickSize(0))
            .attr("transform", `translate(0 ${mainHeight})`);

        const yAxis = mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-yAxis")
            .call(d3.axisLeft(y).tickSize(-tickSize));

        // loop through to render stuff

        mainChart.selectAll("sota-columnChart-bar")
            .data(dataset)
            .join("rect")
            .attr("class", (d,i) => {
                let retval = "sota-columnChart-bar sota-gen-bar";
                retval += (showLegend) ? ` ${classNames(labels[i])}` : "";
                return retval;
            })
            .attr("x", (d,i) => x(labels[i]))
            .attr("y", d => y(d))
            .attr("width", x.bandwidth())
            .attr("height", d => mainHeight - y(d))
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(() => {
                        let retval = `<span class="sota-tooltip-label">${labels[i]}</span><br/>Percentage: ${toPercentage(percentages[i])}`;
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

        // get mainHeight based on x axis

        let textBottom = [];

        xAxis.selectAll("text")
            .each(function(){textBottom.push(this.getBBox().y + this.getBBox().height)})

        mainHeight += +d3.max(textBottom);

        // set widths, heights, offsets

        let height = mainHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .attr("transform", `translate(${-overflowOffset} 0)`);

        mainChart.attr("transform", `translate(${margin.left + overflowOffset} ${margin.top})`)
            .attr("width", mainWidth)

    });
}