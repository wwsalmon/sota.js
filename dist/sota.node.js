'use strict';

var d3 = require('d3');

/**
 * Function to inject inline styling for sota charts, navbar, layout, etc.
 * @param sotaConfig - sotaConfig object
 */
function setStyles(sotaConfig = sotaConfig){
    const mainWidth = 1500;
    const moduleMargin = 48;
    const numberFont = sotaConfig.numberFont;
    const labelFont = sotaConfig.labelFont;
    const axisStrokeWidth = sotaConfig.separatorStrokeWidth;
    const axisStrokeColor = sotaConfig.lineColor;
    const axisTextMargin = 4;
    let styleSheet = `
.sota-section {
	padding: 48px 0;
	width: 100%
}

.sota-section > p{
  color: #fff;
  font-family: ${labelFont};
  line-height: 1.5;
  max-width: 800px;
  margin: 64px auto;
  padding: 0 24px;
}

.sota-section h1 {
	font-size: 56px;
	font-family: ${numberFont}, sans-serif;
	text-transform: uppercase;
	font-weight: 700;
	text-align: center;
	color: #fff
}

.sota-section-inner {
    position: relative;
	max-width: ${mainWidth}px;
	box-sizing: border-box;
	font-family: "Montserrat", Arial, sans-serif;
	width: 100%;
	padding: 48px 24px;
	margin: 0 auto;
	background-color: #fff;
	grid-template-columns: minmax(0, 1fr)
}

.sota-section-inner:before{
    pointer-events: none;
    content: "";
    position: absolute;
    left: 0;
    top: 32px;
    display: none;
    height: calc(100% - 64px);
}

.sota-section-inner:after{
    content: "";
    clear: both;
    display: table;    
}

.sota-section .sota-module {
	position: absolute;
	float: left;
	width: calc(100% - 48px);
	border-bottom: 1px solid rgba(0,0,0,0.2);
	padding-bottom: 32px;
	margin-bottom: 32px;
}

@media (min-width: 800px) {
    .sota-section-inner:before{
      width: 50%;
      display: block;
        border-right: 1px solid rgba(0,0,0,0.1);
    }
    
    .sota-section .sota-module {
        width: calc(50% - ${24 + moduleMargin / 2}px);
    }
}

@media (min-width: 1200px) {    
    .sota-section .sota-module {
        width: calc(33% - ${16 + 2 * moduleMargin / 3}px);
    }

    .sota-section-inner:before{
        width: calc(33.3% - 6px);
        left: calc(33.3% - 6px);
        border-left: 1px solid rgba(0,0,0,0.1);
    }
}

.sota-module>svg {
	width: 100%
}

.sota-module h3 {
	font-family: ${numberFont}, sans-serif;
	font-weight: 700;
	text-transform: uppercase;
	line-height: 1.1;
}

.sota-module p, ul, ol{
    font-size: 20px;
    line-height: 1.4;
    font-family: ${labelFont};
}

.sota-module hr{
    opacity: 0.5;
    margin: 48px 0;
}

.sota-module img{
    max-width: 100%;
    margin: 32px 0;
}

.sota-module .sota-subtitle {
	font-family: ${labelFont}, serif;
	opacity: 0.4;
	line-height: 1.1;
}

.sota-heavy-label{
    font-weight: 700;
}

.sota-num-label, .sota-num-axis .tick text{
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    fill: ${sotaConfig.labelColor};
}

.sota-text-label, .sota-text-axis .tick text{
    font-family: ${labelFont}, serif;
    fill: black;
}

.sota-num-label.sota-stackedBarChart-label-onBar{
    fill: rgba(255,255,255,0.6);
}

.sota-tooltip {
	background-color: #222;
	color: #fff;
	padding: 12px;
	position: absolute;
	pointer-events: none;
	opacity: 0;
	transform: translate(-50%, -100%);
	white-space: nowrap
}

.sota-gen-axis{
    opacity: 0.4;
}

.sota-gen-axis.sota-gen-xAxis .tick text {
	transform: translateY(${axisTextMargin}px);
}

.sota-gen-axis.sota-gen-yAxis .tick text {
	transform: translateX(${-axisTextMargin - 4}px);
	text-anchor: end
}

.sota-gen-xAxis:not(.sota-text-axis) g.tick:first-of-type text:not(.angled-label){
    text-anchor: start;
}

.sota-gen-xAxis:not(.sota-text-axis) g.tick:last-of-type text:not(.angled-label){
    text-anchor: end;
}

.sota-gen-axis .tick line,
.sota-gen-axis path.domain {
	stroke-width: ${axisStrokeWidth}px;
	stroke: ${axisStrokeColor};
}

.sota-groupedBarChart-xAxis .tick line {
	opacity: 0.2
}

.sota-big {
	font-weight: 700;
	font-size: 96px;
	line-height: 1.0;
	margin-top: -8px;
	font-family: ${labelFont}, serif
}

.sota-section-inner.hide .module{
    border-bottom: none;
}

.sota-section-inner.hide .module > *{
    visibility: hidden;
}

.sota-section-inner:not(.hide) .loading{
    display: none;
}

#sota-navbar ~ .sota-section:before{
    content: "";
    z-index: 4;
    position: sticky;
    top: 64px;
    width: 100%;
    height: 8px;
    background-color: inherit;
    display: block;
}

#sota-navbar{
    color: #fff;
}

#sota-navbar .sz-navbar-item a, #sota-navbar .sz-navbar-item span{
    font-family: ${numberFont};
    line-height: 64px;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    color: #fff;
    height: 64px;
    padding: 0 8px;
    display: block;
}

#sota-navbar .sota-navbar-logo, #sota-navbar .sota-navbar-logo a{
    height: 100%;
    display: flex;
    align-items: center;
}

#sota-navbar .sota-navbar-logo img{
    height: 50%;
}

@media (max-width: 1400px){
    #sota-navbar .sz-navbar-items{
        background-color: #000;
        z-index: 4;
        height: 100vh;
        box-sizing: border-box;
        justify-content: flex-start;
    }

    #sota-navbar div.sz-navbar-item{
        width: 100%;
        margin-bottom: 0;
    }
    
    #sota-navbar .sz-navbar-inner > .sota-navbar-text{
        display: none;
    }
}

@media (min-width: 1400px){
    #sota-navbar .sz-navbar-items{
        margin-left: auto;
    }

    #sota-navbar .sz-navbar-item.sota-navbar-text{
        display: none;
    }
    
    #sota-navbar .sota-navbar-logo{
        margin-right: 24px;
    }
}

#sota-navbar .sota-navbar-text span{
    font-family: ${labelFont};
    font-weight: 700;
}

    `;

    document.head.appendChild(document.createElement('style')).textContent = styleSheet;
    console.log("styles set");
}

/**
 * Function to set colors for sota charts, layout, navbar, etc.
 * @param sotaConfig - sotaConfig object
 */
function setColors(sotaConfig){
    let colorStyle = "";

    for (const section of sotaConfig.sections){
        const sectionSlug = section.slug;
        colorStyle += `
        #sota-section-${sectionSlug}{
            background-color: ${section.colors[0]};
            color: ${section.colors[0]};
        }
        #sota-section-${sectionSlug} .sota-gen-bar, .sota-section-${sectionSlug} .sota-gen-bar{
            fill: ${section.colors[3]};
        }      
        #sota-navbar #sota-navbar-item-${sectionSlug}:hover, #sota-navbar #sota-navbar-item-${sectionSlug}.selected{
            background-color: ${section.colors[0]};            
        }
        @media (max-width: 1400px){
            #sota-navbar #sota-navbar-item-${sectionSlug}{
                background-color: ${section.colors[0]};            
            }        
        }
        `;

        for (const i in section.colors){
            colorStyle+= `
        #sota-section-${sectionSlug} .sota-fill-${+i+1}, .sota-section-${sectionSlug} .sota-fill-${+i+1}{
            fill: ${section.colors[i]};
        }
        #sota-section-${sectionSlug} .sota-stroke-${+i+1}, .sota-section-${sectionSlug} .sota-stroke-${+i+1}{
            stroke: ${section.colors[i]};
        }
        `;
        }
    }

    document.head.appendChild(document.createElement('style')).textContent = colorStyle;
}


/**
 * Function that generates an array of hex codes interpolating between start and end hex codes
 * @param {string} start - 6-digit hex code for starting color, including "#" at beginning
 * @param {string} [end=#ffffff] - 6-digit hex code for ending color, including "#" at beginning
 * @param {number} [steps=8] - Number of steps, equal to the length of the returned array
 * @param {boolean} [includeLast=false] - Whether or not to include the given end value in the final array
 */
function colorInterpolate(start,end="#ffffff",steps=8, includeLast=false){

    const startHex = start.substr(1);
    const startR = parseInt("0x" + startHex.substr(0,2));
    const startG = parseInt("0x" + startHex.substr(2,2));
    const startB = parseInt("0x" + startHex.substr(4,2));

    const endHex = end.substr(1);
    const endR = parseInt("0x" + endHex.substr(0,2));
    const endG = parseInt("0x" + endHex.substr(2,2));
    const endB = parseInt("0x" + endHex.substr(4,2));

    const diffR = endR - startR;
    const diffG = endG - startG;
    const diffB = endB - startB;

    const calcSteps = includeLast ? steps : steps + 1;

    const incR = diffR / calcSteps;
    const incG = diffG / calcSteps;
    const incB = diffB / calcSteps;

    let colorsArray = [start];

    for (let i = 1; i < steps - 1; i++){
        const newR = startR + incR * i;
        const newG = startG + incG * i;
        const newB = startB + incB * i;

        const newHexString = "#" + Math.round(newR).toString(16) + Math.round(newG).toString(16) + Math.round(newB).toString(16);

        colorsArray.push(newHexString);
    }

    let lastColor;

    if (includeLast){
        lastColor = end;
    } else {
        const newR = startR + incR * steps;
        const newG = startG + incG * steps;
        const newB = startB + incB * steps;
        lastColor = "#" + Math.round(newR).toString(16) + Math.round(newG).toString(16) + Math.round(newB).toString(16);
    }

    colorsArray.push(lastColor);

    return colorsArray;
}

var sotaConfig = {
    numberFont: "Montserrat",
    labelFont: "Lora",
    sections: [
        {slug: "default", name: "Default", colors: colorInterpolate("#000000")}
    ],
    separatorStrokeWidth: 1,
    barHeight: 32,
    barMargin: 16,
    labelLeft: 6,
    labelBelow: 8,
    groupLabelMargin: 32,
    legendMargin: 24,
    xAxisTop: 24,
    overflowOffset: 24,
    lineColor: "#777777",
    labelColor: "#777777",
    mainHeight: 300,
    tickSize: 4,
    labelAngle: 30,
    groupedBarChart: {
        barHeight: 24,
        barMargin: 8
    },
    margin: {
        top: 20,
        bottom: 20,
        left: 0,
        right: 0
    },
    swatch: {
        between: 12,
        belowBetween: 8,
        right: 24,
        width: 32,
        height: 24,
        below: 16
    }
};

/**
 * Returns either mouseX value for tooltip position or value so tooltip is at edge of screen and not cut off. Called on mouseMove event
 * @param tooltip
 * @returns {number}
 */
function mouseXIfNotOffsreen(tooltip){
    const toSide = tooltip.node().offsetWidth / 2;
    const mouseX = d3.event.pageX;
    if (mouseX - toSide < 0){
        return toSide;
    }
    if (mouseX + toSide > window.innerWidth){
        return window.innerWidth - toSide;
    }
    return mouseX;
}

/**
 * Helper function, returns formatted string from input number
 * @param {number} i
 * @returns {string}
 */
function toPercentage(i){
    return d3.format(".1f")(i) + "%";
}

/**
 * Helper function to bind tooltip to d3 selection
 * @param selection - chart data d3 selection, i.e. bars, the things you want to hover over to bring up the tooltip
 * @param tooltip - tooltip d3 selection
 * @param percentages - percentages data
 * @param labels - labels data
 * @param values - values data
 */
function bindTooltip(selection, tooltip, percentages, labels, values){
    selection.on("mouseover", function (d, i){
        d3.select(this)
            .attr("opacity", sotaConfig.hoverOpacity);
        tooltip.style("opacity", 1.0)
            .html(() => {
                let retval = `<span class="sota-text-label"></span><span class="sota-heavy-label">${labels[i]}</span><br/>Percentage: ${toPercentage(percentages[i])}`;
                if (values) {
                    retval += "<br/>Number of responses: " + values[i];
                }
                retval += "</span>";
                return retval;
            })
            .style("left", mouseXIfNotOffsreen(tooltip) + "px")
            .style("top", (d3.event.pageY) + "px");
    })
        .on("mousemove", d => {
            tooltip.style("left", mouseXIfNotOffsreen(tooltip) + "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("opacity", 1.0);
            tooltip.style("opacity", 0);
        });
}

/**
 * Helper function for setting up container variables based on inputs
 * @param {(string|boolean)} selector
 * @param {(string|boolean)} section
 * @param {(string|boolean)} title
 * @param {(string|boolean)} subtitle
 * @param {{top: number, left: number, bottom: number, right: number}} margin - margin object from component input
 * @param overflowOffset
 * @returns {{container: *, svg, tooltip: *, width: number, mainChart, mainWidth: number}}
 */
function containerSetup(selector, section, title, subtitle, margin, overflowOffset){
    if (!(selector || section)) throw `No selector or section specified for chart with "${dataFile}" dataFile parameter.`;

    const container = selector ? d3.select(selector) : d3.select(`#sota-section-${section} .sota-section-inner`)
        .append("div")
        .attr("class", "sota-module");

    if (section && title) container.append("h3")
        .text(title);

    if (section && subtitle) container.append("div")
        .attr("class","sota-subtitle")
        .append("span")
        .text(subtitle);

    const svg = container.append("svg")
        .style("margin-top", margin.top + "px")
        .style("margin-bottom", margin.bottom + "px");

    const tooltip = d3.select("body").append("div")
        .attr("class", "sota-tooltip");

    const width = container.node().offsetWidth;
    const mainWidth = width - margin.left - margin.right;

    const mainChart = svg.append("g")
        .attr("class", "sota-mainChart")
        .attr("transform", `translate(${margin.left + overflowOffset} 0)`)
        .attr("width", mainWidth);

    return {container, svg, tooltip, width, mainWidth, mainChart};
}

/**
 * Helper function for processing data
 * @param data
 * @param {boolean} inputIsPercentage
 * @param {number} totalResp
 * @returns {Array}
 */
function processData(data, inputIsPercentage, totalResp = null){
    totalResp = (totalResp == null) ? d3.sum(data, d => +d.value) : totalResp;
    const percentages = (inputIsPercentage) ? data.map(d => +d.value) : data.map(d => +d.value / totalResp * 100);
    const values = (inputIsPercentage) ? false : data.map(d => +d.value);
    const labels = data.map(d => d.label);
    return [percentages, values, labels];
}

/**
 * Helper function for dispatching event when chart finishes rendering, for sotaLayout functions to catch
 * @param thisModule
 */
function chartRendered(thisModule){
    const chartRendered = new Event("sotaChartRendered");
    const container = thisModule.closest(".sota-section-inner");
    if (container !== null) container.dispatchEvent(chartRendered);
}

/**
 * Helper function to generate UUIDv4. Code from https://stackoverflow.com/a/2117523/4517586
 * @returns {*}
 */
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

/**
 * Render sota.js bar chart
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [showXAxis = true] - Whether or not to render x axis
 * @param {boolean} [showSeparators = true] - Whether or not to show separators between bars
 * @param {boolean} [displayPercentage = true] - Whether to display percentage or value on bar
 * @param {number} [totalResp] - Number of total responses. Specify if categories are non-exclusive, i.e. if there are less total items than the sum of data points.
 * @param {(number|boolean)} [maxVal] - By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max.
 * @param {(number|boolean)} [minVal] - By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min.
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function barChart({
    dataFile,
    selector = false,
    title = false,
    subtitle = false,
    section = false,
    inputIsPercentage = false,
    showXAxis = true,
    showSeparators = true,
    displayPercentage = true,
    totalResp = null,
    maxVal = null,
    minVal = null,
    margin = sotaConfig.margin
}) {

    const lineColor = "#dddddd";
    const tickSize = sotaConfig.tickSize;
    const separatorOffset = 6;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const labelLeft = sotaConfig.labelLeft;
    const barHeight = sotaConfig.barHeight;
    const barMargin = sotaConfig.barMargin;
    const overflowOffset = sotaConfig.overflowOffset;
    const xAxisTop = sotaConfig.xAxisTop;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(selector, section, title, subtitle, margin, overflowOffset);

    d3.csv(dataFile + ".csv").then(data => {

        const barspace = barHeight + barMargin;
        let mainHeight = data.length * barspace; // if show xAxis, more is added to this

        const [percentages, values, labels] = processData(data, inputIsPercentage, totalResp);
        const dataset = (displayPercentage || inputIsPercentage) ? percentages : values;

        if (minVal == null) { // default setting
            // minVal = (inputIsPercentage || displayPercentage) ? 0 : d3.min(dataset);
            minVal = 0;
        }
        else if (minVal === true) { // specified minVal
            minVal = d3.min(dataset);
        }
        else if (isNaN(minVal) || minVal === "") throw "invalid minVal for graph on " + selector;
        // else custom val

        if (maxVal == null) { // default setting
            maxVal = (inputIsPercentage || displayPercentage) ? 100 : d3.max(dataset);
        }
        else if (maxVal === true) { // specified maxVal
            maxVal = d3.max(dataset);
        }
        else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;
        // else custom val

        const x = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([0, mainWidth]);

        let xAxis;

        if (showXAxis) {
            xAxis = mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-xAxis sota-num-axis")
                .call(d3.axisBottom(x).tickSize(-tickSize))
                .attr("transform", "translate(" + 0 + " " + (mainHeight + xAxisTop) + ")");
        }

        function y(index) { // custom y scale
            return index * barspace;
        }

        mainChart.selectAll(".sota-barChart-bar")
            .data(dataset)
            .join("rect")
            .attr("class", "sota-barChart-bar sota-gen-bar")
            .attr("width", d => x(d))
            .attr("height", barHeight)
            .attr("x", 0)
            .attr("y", (d, i) => y(i));

        mainChart.selectAll(".sota-barChart-hiddenBar")
            .data(dataset)
            .join("rect")
            .attr("class", "sota-barChart-hiddenBar")
            .attr("width", mainWidth)
            .attr("height", barHeight)
            .attr("x", 0)
            .attr("y", (d, i) => y(i))
            .attr("fill", "transparent")
            .call(bindTooltip, tooltip, percentages, labels, values);

        mainChart.selectAll(".sota-barChart-label")
            .data(data)
            .join("text")
            .attr("class", "sota-barChart-label sota-text-label sota-heavy-label")
            .html(d => d.label)
            .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central")
            .attr("x", labelLeft)
            .attr("y", (d, i) => y(i) + barHeight / 2);

        if (showSeparators){
            mainChart.selectAll(".sota-barChart-separator")
                .data(dataset)
                .join("line")
                .attr("class", "sota-barChart-separator")
                .attr("x1", 0)
                .attr("x2", mainWidth)
                .attr("y1", (d, i) => y(i) + barHeight + separatorOffset)
                .attr("y2", (d, i) => y(i) + barHeight + separatorOffset)
                .attr("stroke-width", separatorStrokeWidth)
                .attr("stroke", lineColor);
        }

        mainChart.selectAll(".sota-barChart-value")
            .data(dataset)
            .join("text")
            .attr("class", "sota-barChart-value sota-num-label")
            .html((d, i) => (inputIsPercentage || displayPercentage) ? toPercentage(d) : d)
            .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central")
            .attr("text-anchor", "end")
            .attr("x", mainWidth)
            .attr("y", (d, i) => y(i) + barHeight / 2);

        if (showXAxis){
            let textBottom = [];

            xAxis.selectAll("text")
                .each(function(){textBottom.push(this.getBBox().y + this.getBBox().height);});

            mainHeight += +d3.max(textBottom);
        }

        const height = mainHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        chartRendered(container.node());
    });
}

/**
 * Render sota.js pie chart
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [sorted = true] - Whether or not to sort order of slices by size
 * @param {number} [pieRad = 150] - Radius of pie in chart
 * @param {number} [pieThick = 80] - Thickness of pie slices (this is actually a donut chart)
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function pieChart({
    dataFile,
    selector = false,
    title = false,
    subtitle = false,
    section = false,
    inputIsPercentage = false,
    sorted = true,
    pieRad = 150,
    pieThick = 80,
    margin = sotaConfig.margin
}) {

    const polylineColor = sotaConfig.lineColor;
    const polylineStrokeWidth = sotaConfig.separatorStrokeWidth;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;
    const legendMargin = sotaConfig.legendMargin;
    const overflowOffset = sotaConfig.overflowOffset;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);

    if (mainWidth < pieRad * 2) {
        pieRad = mainWidth / 2;
    }

    if (pieThick > pieRad) {
        pieThick = 50;
    }

    d3.csv(dataFile + ".csv").then(data => {

        const [percentages, values, labels] = processData(data, inputIsPercentage);

        const pie = sorted ? d3.pie() : d3.pie().sort(null);
        const pieData = pie(percentages);

        // generate legend

        let legendHeight = 0;

        let valueLabelWidths = [];

        const classNames = d3.scaleOrdinal()
            .domain(labels)
            .range(d3.map(labels, (d, i) => "sota-fill-" + (labels.length > 3 ? (i + 1) : (2 * i + 1))).keys());

        const legend = mainChart.append("g")
            .lower()
            .attr("class", "sota-gen-legend")
            .attr("transform", `translate(0 ${margin.top})`);

        legend.selectAll("nothing")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "sota-gen-legend-text")
            .text(d => d.label)
            .attr("x", function () {
                valueLabelWidths.push(this.getBBox().width);
            })
            .remove();

        if (d3.sum(valueLabelWidths, d => d) + (labels.length) * (swatchWidth + swatchBetween) + (labels.length - 1) * swatchRight > mainWidth) {
            // vertical legends
            let legendLeft = mainWidth - d3.max(valueLabelWidths) - swatchWidth - swatchBetween;

            legend.selectAll(".sota-gen-legend-swatch")
                .data(labels)
                .join("rect")
                .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                .attr("x", legendLeft)
                .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                .attr("width", swatchWidth)
                .attr("height", swatchHeight);

            legend.selectAll(".sota-gen-legend-text")
                .data(labels)
                .join("text")
                .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                .text(d => d)
                .attr("x", legendLeft + swatchWidth + swatchBetween)
                .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central");

            legendHeight = labels.length * swatchHeight + (labels.length - 1) * swatchBelowBetween + swatchBelow + legendMargin;
        }
        else {
            let legendLeft = mainWidth - (d3.sum(valueLabelWidths, d => d) + labels.length * (swatchWidth + swatchBetween) + (labels.length - 1) * swatchRight);

            legend.selectAll(".sota-gen-legend-swatch")
                .data(labels)
                .join("rect")
                .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(valueLabelWidths.slice(0, i), d => d))
                .attr("y", 0)
                .attr("width", swatchWidth)
                .attr("height", swatchHeight);

            legend.selectAll(".sota-gen-legend-text")
                .data(labels)
                .join("text")
                .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                .text(d => d)
                .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                .attr("y", swatchHeight / 2)
                .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central");

            legendHeight = swatchHeight + swatchBelow + legendMargin;
        }

        // centered g to place chart in

        const g = mainChart.append("g")
            .attr("transform", "translate(" + (mainWidth / 2) + "," + (pieRad + legendHeight) + ")");

        // create subgroups for labels eventually

        const arc = d3.arc()
            .innerRadius(pieRad * 0.8 - pieThick * 0.8)
            .outerRadius(pieRad * 0.8);

        const outerArc = d3.arc()
            .innerRadius(pieRad * 0.9)
            .outerRadius(pieRad * 0.9);

        g.selectAll(".sota-pieChart-slice")
            .data(pieData)
            .join("path")
            .attr("class", (d, i) => "sota-pieChart-slice " + classNames(i))
            .attr("d", arc)
            .attr("stroke", "#fff")
            .style("stroke-width", separatorStrokeWidth)
            .call(bindTooltip, tooltip, percentages, labels, values);
        
        // following code uses https://www.d3-graph-gallery.com/graph/donut_label.html as starting point. Used to be just about verbatim, now modified quite a bit

        let prevOverlap = false;

        g.selectAll(".sota-pieChart-polyline")
            .data(pieData)
            .join("polyline")
            .attr("class","sota-pieChart-polyline")
            .attr("stroke", polylineColor)
            .style("fill", "none")
            .attr("stroke-width", polylineStrokeWidth)
            .attr("points", (d, i) => {
                let posA = arc.centroid(d);
                let posB = outerArc.centroid(d);
                let posC = outerArc.centroid(d);
                const pos = outerArc.centroid(d);
                const prevPos = i > 0 && outerArc.centroid(pieData[i-1]);
                const midangle = (d.endAngle + d.startAngle) / 2;
                const isRight = midangle < Math.PI;
                if (i > 0 && Math.sign(pos[0]) == Math.sign(prevPos[0]) && Math.abs(prevPos[1] - pos[1]) < 20){
                    posC[0] = pieRad * 0.95 * ((prevOverlap ? isRight : !isRight) ? 1 : -1);
                    prevOverlap = true;
                } else {
                    posC[0] = pieRad * 0.95 * ((!prevOverlap ? isRight : !isRight) ? 1: -1);
                    prevOverlap = false;
                }
                return [posA, posB, posC];
            });

        prevOverlap = false;

        g.selectAll(".sota-pieChart-label")
            .data(pieData)
            .join("text")
            .attr("class","sota-pieChart-label sota-num-label")
            .text((d, i) => toPercentage(percentages[i]))
            .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central")
            .attr("transform", (d, i) => {
                const pos = outerArc.centroid(d);
                const prevPos = i > 0 && outerArc.centroid(pieData[i-1]);
                const midangle = (d.endAngle + d.startAngle) / 2;
                const isRight = midangle < Math.PI;
                if (i > 0 && Math.sign(pos[0]) == Math.sign(prevPos[0]) && Math.abs(prevPos[1] - pos[1]) < 20){
                    pos[0] = pieRad * 0.99 * ((prevOverlap ? isRight : !isRight) ? 1 : -1);
                    prevOverlap = true;
                } else {
                    pos[0] = pieRad * 0.99 * ((!prevOverlap ? isRight : !isRight) ? 1 : -1);
                    prevOverlap = false;
                }
                if (i == pieData.length - 1) prevOverlap = false;
                return 'translate(' + pos + ')';
            })
            .style("text-anchor", (d, i) => {
                const pos = outerArc.centroid(d);
                const prevPos = i > 0 && outerArc.centroid(pieData[i-1]);
                const midangle = (d.endAngle + d.startAngle) / 2;
                const isRight = midangle < Math.PI;
                if (i > 0 && Math.sign(pos[0]) == Math.sign(prevPos[0]) && Math.abs(prevPos[1] - pos[1]) < 20){
                    const retval = (prevOverlap ? isRight : !isRight) ? 'start' : 'end';
                    prevOverlap = true;
                    return retval;
                } else {
                    const retval = (!prevOverlap ? isRight : !isRight) ? 'start' : 'end';
                    prevOverlap = false;
                    return retval;
                }
            });

        const height = 2 * pieRad * 0.8 + legendHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        chartRendered(container.node());
    });
}

/**
 * Render sota.js line graph
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {(number|boolean)} [maxVal] - By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max.
 * @param {(number|boolean)} [minVal] - By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min.
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 * @param {number} [height = 300] - Height of the chart. Defaults to 300
 */
function lineGraph({
    dataFile,
    selector = false,
    title = false,
    subtitle = false,
    section = false,
    inputIsPercentage = false,
    minVal = null,
    maxVal = null,
    height = 300,
    margin = {
        "top": 20,
        "bottom": 20,
        "left": 24,
        "right": 0
    } }) {

    const lineColor = "#bbb";
    const lineWidth = 3;
    const tickSize = 8;
    const circleRad = 4;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const hoverOpacity = 0.8;
    const overflowOffset = sotaConfig.overflowOffset;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);

    d3.csv(dataFile + ".csv").then(data => {
        // define styling variables here

        const labels = data.map(d => d.label);
        const values = data.map(d => +d.value);

        if (minVal == null){ // default setting
            minVal = (inputIsPercentage) ? 0 : d3.min(data, d => d.value);
        }
        else if (minVal == true){ // specified minVal
            minVal = d3.min(data, d => d.value);
        }
        else if (isNaN(minVal) || minVal == "") throw "invalid minVal for graph on " + selector;
        // else custom val
        
        if (maxVal == null){ // default setting
            maxVal = (inputIsPercentage) ? 100 : d3.max(data, d => d.value);
        }
        else if (maxVal == true){ // specified maxVal
            maxVal = d3.max(data, d => d.value);
        }
        else if (isNaN(maxVal) || maxVal == "") throw "invalid maxVal for graph on " + selector;
        // else custom val

        // process data here. Create scales, etc.

        const x = d3.scaleBand()
            .domain(labels.map(d => d))
            .range([0, mainWidth]);

        const y = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([height - margin.bottom, margin.top]);

        mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-xAxis sota-text-axis")
            .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
            .style("transform","translateY(" + (height - margin.bottom) + "px)");

        mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-YAxis sota-num-axis")
            .call(d3.axisLeft(y).tickSize(-tickSize));

        // run main loop here

        mainChart.selectAll(".sota-lineGraph-path")
            .data([values])
            .join("path")
            .attr("class", "sota-lineGraph-path")
            .attr("d", d3.line()
                .x((d, i) => x(labels[i]) + x.bandwidth() / 2)
                .y(d => y(d)))
            .attr("fill","none")
            .attr("stroke",lineColor)
            .style("stroke-width",lineWidth);

        mainChart.selectAll(".sota-lineGraph-circle")
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
                    .html(`<span class="sota-tooltip-label">${labels[i]}</span><br/>Value: ` + ((inputIsPercentage) ? toPercentage(d) : d) + "</span>")
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

        mainChart.selectAll(".sota-lineGraph-label")
            .data(values)
            .join("text")
            .attr("class", "sota-lineGraph-label sota-num-label")
            .text((d, i) => {
                if (inputIsPercentage){
                    return d + "%";
                }
            })
            .attr("x", (d, i) => x(labels[i]) + x.bandwidth() / 2)
            .attr("y", d => y(d) - 16)
            .style("text-anchor","middle");

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        chartRendered(container.node());
    });
}

/**
 * Render sota.js stacked bar chart
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [showXAxis = true] - Whether or not to render x axis
 * @param {("none" | "onBar" | "aboveBar")} [labelStyle = "onBar"] - Style of labels for sub-groups (slices of bars). None hides all labels. onBar displays values on the bars, and hides any that don’t fit. aboveBar draws labels above the bar with pointing lines
 * @param {("none" | "onBar")} [groupLabelStyle = "none"] - Style of labels for groups. None hides all labels. onBar displays labels above bars
 * @param {boolean} [showLegend = true] - Whether or not to show legend
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function stackedBarChart({
                             dataFile,
                             selector = false,
                             title = false,
                             subtitle = false,
                             section = false,
                             inputIsPercentage = false,
                             showXAxis = true,
                             labelStyle = "onBar", // "none" | "onBar" | "aboveBar"
                             groupLabelStyle = "none", // "none" | "onBar"
                             showLegend = true,
                             margin = sotaConfig.margin
                         }) {

    const hoverOpacity = 0.8;
    const tickSize = 8;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const barHeight = sotaConfig.barHeight;
    const barMargin = sotaConfig.barMargin;
    const overflowOffset = sotaConfig.overflowOffset;
    const groupLabelMargin = sotaConfig.groupLabelMargin;
    const labelLeft = sotaConfig.labelLeft;
    const labelBelow = sotaConfig.labelBelow;
    const lineColor = sotaConfig.lineColor;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;
    const xAxisTop = sotaConfig.xAxisTop;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);

    d3.csv(dataFile + ".csv").then(data => {
        
        // define styling variables here

        var barspace = barHeight + barMargin;
        var mainHeight = data.length * barspace;

        var marginBefore = 0;

        if (groupLabelStyle == "onBar"){
            barspace += data.length * groupLabelMargin;
            mainHeight += data.length * groupLabelMargin;
            marginBefore = groupLabelMargin;
        }

        // DATA PROCESSING

        const valueLabels = data.columns.slice(1);
        const groupLabels = d3.map(data, d => d.group).keys();

        // arrays of values and percentages

        var stackedData = [];

        if (inputIsPercentage){
            data.forEach(d => {
                let prevPercentage = 0;
                let thisData = [];
                for (let valueLabel of valueLabels) {
                    let thisPercentage = +d[valueLabel];
                    thisData.push([thisPercentage,prevPercentage]);
                    prevPercentage += thisPercentage;
                }
                stackedData.push(thisData);
            });
        }
        else {
            data.forEach(d => {
                let prevPercentage = 0;
                let total = d3.sum(valueLabels, k => +d[k]);
                let thisData = [];
                for (let valueLabel of valueLabels) {
                    let thisPercentage = +d[valueLabel] / total * 100;
                    thisData.push([thisPercentage, prevPercentage, +d[valueLabel]]);
                    prevPercentage += thisPercentage;
                }
                stackedData.push(thisData);
            });
        }

        const y = d3.scaleBand()
            .domain(groupLabels)
            .range([0,mainHeight])
            .padding([0.2]);
        
        const x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, mainWidth]);

        const classNames = d3.scaleOrdinal()
            .domain(valueLabels)
            .range(d3.map(valueLabels, (d, i) => "sota-fill-" + (valueLabels.length > 3 ? (i + 1) : (2 * i + 1))).keys());

        if (showXAxis) {
            mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-xAxis sota-num-axis")
                .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
                .attr("transform", "translate(" + 0 + " " + (mainHeight + xAxisTop) + ")");

            mainHeight += 20 + xAxisTop;
        }

        // LEGEND

        var legendHeight = 0;

        if (showLegend){
            let valueLabelWidths = [];

            const legend = svg.append("g")
                .lower()
                .attr("class","sota-gen-legend")
                .attr("transform", `translate(0 ${margin.top})`);

            legend.selectAll("nothing")
                .data(valueLabels)
                .enter()
                .append("text")
                .attr("class","sota-gen-legend-text")
                .text(d => d)
                .attr("x", function(){
                    valueLabelWidths.push(this.getBBox().width);
                })
                .remove();

            if (d3.sum(valueLabelWidths, d => d) + valueLabels.length * (swatchWidth + swatchBetween) + (valueLabels.length - 1) * swatchRight > mainWidth){
                // vertical legends
                let legendLeft = width + overflowOffset - d3.max(valueLabelWidths) - swatchWidth - swatchBetween;

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(valueLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                    .attr("x",legendLeft)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                    .attr("width",swatchWidth)
                    .attr("height",swatchHeight);

                legend.selectAll(".sota-gen-legend-text")
                    .data(valueLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                    .text(d => d)
                    .attr("x", legendLeft + swatchWidth + swatchBetween)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                    .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central");

                legendHeight = valueLabels.length * swatchHeight + (valueLabels.length - 1) * swatchBelowBetween + swatchBelow;
            }
            else {
                let legendLeft = width + overflowOffset - (d3.sum(valueLabelWidths, d => d) + valueLabels.length * (swatchWidth + swatchBetween) + (valueLabels.length - 1) * swatchRight);

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(valueLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(valueLabelWidths.slice(0,i), d => d))
                    .attr("y", 0)
                    .attr("width", swatchWidth)
                    .attr("height", swatchHeight);

                legend.selectAll(".sota-gen-legend-text")
                    .data(valueLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                    .text(d => d)
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                    .attr("y", swatchHeight / 2)
                    .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central");

                legendHeight = swatchHeight + swatchBelow;
            }
        }


        // MAIN LOOP

        const chartGroups = mainChart.selectAll(".sota-stackedBarChart-group")
            .data(stackedData)
            .join("g")
            .attr("class","sota-stackedBarChart-group")
            .attr("transform",(d, i) => "translate(0 " + (y(groupLabels[i]) + marginBefore - barMargin) + ")");
            
        chartGroups.selectAll(".sota-stackedBarChart-bar")
            .data(d => d)
            .join("rect")
            .attr("class", (d, i) => "sota-stackedBarChart-bar " + classNames(i))
            .attr("x", d => x(d[1]))
            .attr("y", 0)
            .attr("width", d => x(d[0]))
            .attr("height", barHeight)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(() => {
                        let retval = `<span class="sota-text-label"><span class="sota-heavy-label">${valueLabels[i]}</span><br/>Percentage: ${toPercentage(d[0])}`;
                        if (!inputIsPercentage) {
                            retval += "<br/>Number of responses: " + d[2];
                        }
                        retval += "</span>";
                        return retval;
                    })
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mousemove", () => {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("opacity", 1.0);
                tooltip.style("opacity", 0);
            });

        chartGroups.selectAll(".sota-stackedBarChart-separator")
            .data(d => d)
            .join("rect")
            .attr("class", "sota-stackedBarChart-separator")
            .attr("fill","white")
            .attr("x", d => x(d[1]) + x(d[0]))
            .attr("y", 0)
            .attr("width", d => {
                if (d[0] > 0){
                    return separatorStrokeWidth;
                }
                else {
                    return 0;
                }
            })
            .attr("height", barHeight);

        // onBar group label
            
        if (groupLabelStyle == "onBar"){
            mainChart.selectAll(".sota-stackedBarChart-groupLabel-onBar")
                .data(groupLabels)
                .join("text")
                .attr("class", "sota-stackedBarChart-groupLabel-onBar sota-text-label sota-heavy-label")
                .text(d => d)
                .attr("alignment-baseline", "bottom")
                .attr("x", 0)
                .attr("y", d => y(d));
        }

        var labelsHeight = 0;

        // onBar value label

        if (labelStyle == "onBar"){
            chartGroups.selectAll(".sota-stackedBarChart-label-onBar")
                .data(d => d)
                .join("text")
                .attr("class","sota-stackedBarChart-label-onBar sota-num-label")
                .text(d => d3.format(".1f")(d[0]) + "%")
                .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central")
                .attr("text-anchor", "end")
                .attr("x", d => x(d[1]) + x(d[0]) - labelLeft)
                .attr("y", barHeight / 2)
                .style("display", function(d, i){
                    if (this.getBBox().x < (i > 0 ? x(d[1]) : margin.left)){
                        return "none";
                    }
                    return "";
                });
        }
         
        // aboveBar value label
        
        else if (labelStyle == "aboveBar"){

            var labelRightBounds = [];

            chartGroups.selectAll(".sota-stackedBarChart-label-aboveBar-text")
                .data(d => d)
                .join("text")
                .attr("class", "sota-stackedBarChart-label-aboveBar-text sota-num-label")
                .text((d, i) => `${valueLabels[i]}: ${d3.format(".1f")(d[0])}%`)
                .attr("x", d => x(d[1]) + x(d[0]) / 2)
                .attr("y", function(d){
                    labelRightBounds.push([this.getBBox().x, this.getBBox().width]);
                    return -2 * labelBelow;
                })
                .attr("alignment-baseline", "bottom");

            let labelHeights = [];

            function getLabelHeight(i) {
                if (i == labelRightBounds.length - 1){
                    labelHeights[i] = -2;
                    return -2;
                }
                else if (labelRightBounds[i][0] + labelRightBounds[i][1] + labelLeft > labelRightBounds[i+1][0]){
                    labelRightBounds[i + 1][0] = labelRightBounds[i][0] + labelRightBounds[i][1] + labelLeft;
                    let nextHeight = getLabelHeight(i+1);
                    let thisHeight = nextHeight - 1;
                    labelHeights[i] = thisHeight;
                    return thisHeight;
                }
                else {
                    getLabelHeight(i+1);
                    labelHeights[i] = -2;
                    return -2;
                }
            }

            getLabelHeight(0);

            chartGroups.selectAll(".sota-stackedBarChart-label-aboveBar-line")
                .data(d => d)
                .join("polyline")
                .attr("class", "sota-stackedBarChart-label-aboveBar-line")
                .attr("points", (d, i) => {
                    let x1 = x(d[1]) + x(d[0]) / 2;
                    let y1 = barHeight / 2;
                    let x2 = x1;
                    let y2 = (labelHeights[i] + 1) * labelBelow;
                    let x3 = labelRightBounds[i][0] + labelRightBounds[i][1];
                    let y3 = y2;
                    return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
                })
                .attr("stroke-width", separatorStrokeWidth)
                .attr("stroke", lineColor)
                .attr("fill", "none");

            chartGroups.selectAll(".sota-stackedBarChart-label-aboveBar-text")
                .data(d => d)
                .join("text")
                .attr("x", (d, i) => labelRightBounds[i][0])
                .attr("y", (d, i) => labelHeights[i] * labelBelow);

            labelsHeight = -1 * d3.min(labelHeights) * labelBelow + 20;

        }

        const height = mainHeight + margin.top + margin.bottom + legendHeight + labelsHeight;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        mainChart.attr("transform",`translate(${overflowOffset} ${margin.top + legendHeight + labelsHeight})`)
            .attr("width", mainWidth);

        chartRendered(container.node());
    });
}

/**
 * Render sota.js custom bar chart, using an SVG path as the base
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {string} shapeFile - Relative path to svg shape file, excluding file extension, i.e. "shapes/shapefile"
 * @param {number} shapeWidth - Width of shape for chart
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function customBarChart({
    dataFile,
    selector = false,
    title = false,
    subtitle = false,
    section = false,
    shapeFile,
    shapeWidth = 300,
    inputIsPercentage = false,
    margin = sotaConfig.margin
}) {
    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);

    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const labelLeft = sotaConfig.labelLeft;
    const labelBelow = sotaConfig.labelBelow;
    const lineColor = sotaConfig.lineColor;
    const coeffLabelBelow = 3;

    d3.xml(shapeFile + ".svg").then(shape => {

        // import shape and make it a definition

        let importedNode = document.importNode(shape.documentElement, true);
        let firstPath = d3.select(importedNode)
            .select("path")
            .node();
        let firstPathWidth = 0;
        let firstPathHeight = 0;

        svg.append(() => firstPath)
            .attr("class",function(){
                firstPathWidth = this.getBBox().width;
                firstPathHeight = this.getBBox().height;
                return "";
            })
            .remove();

        let scaleFactor = shapeWidth / firstPathWidth;
        let scaledHeight = firstPathHeight * scaleFactor;

        const uniqueID = uuidv4();

        svg.append("defs")
            .append("clipPath")
            .attr("id","shapeDef"+uniqueID)
            .append(() => firstPath)
            .attr("transform", `scale(${scaleFactor})`);

        d3.csv(dataFile + ".csv").then(data => {

            const [percentages, values, labels] = processData(data, inputIsPercentage);

            // since stacked, left coordinate of each bar progresses, so we need this cumulative array

            let prevValue = 0;
            let prevValues = [];
            for (let d of data){
                prevValues.push(prevValue);
                prevValue += +d.value;
            }

            const x = d3.scaleLinear()
                .domain([0, d3.sum(data, d => +d.value)])
                .range([0, shapeWidth]);

            const classNames = d3.scaleOrdinal()
                .domain(d3.map(data, d=>d.label))
                .range(d3.map(data, (d, i) => "sota-fill-" + (i + 1)).keys());

            // main loop

            mainChart.selectAll(".sota-customBarChart-bar")
                .data(data)
                .join("rect")
                .attr("class", d => "sota-customBarChart-bar " + classNames(d.label))
                .attr("x", (d,i) => x(prevValues[i]))
                .attr("y", 0)
                .attr("width", d => x(d.value))
                .attr("height", scaledHeight)
                .attr("clip-path", "url(#shapeDef"+uniqueID+")")
                .call(bindTooltip, tooltip, percentages, labels, values);

            mainChart.selectAll(".sota-customBarChart-separator")
                .data(data)
                .join("rect")
                .attr("class", "sota-customBarChart-separator")
                .attr("x", (d, i) => (i == 0) ? -separatorStrokeWidth : x(prevValues[i]))
                .attr("y", 0)
                .attr("width", separatorStrokeWidth)
                .attr("height", scaledHeight)
                .attr("fill", "white")
                .attr("clip-path", "url(#shapeDef"+uniqueID+")");

            // draw labels. Code taken just about verbatim from stackedBarChart aboveBar label

            var labelRightBounds = [];

            mainChart.selectAll(".sota-customBarChart-label-aboveBar-text")
                .data(data)
                .join("text")
                .attr("class", "sota-customBarChart-label-aboveBar-text")
                .html((d,i) => `<tspan class="sota-text-label sota-heavy-label">${d.label}:</tspan><tspan class="sota-num-label"> ${toPercentage(percentages[i])}</tspan>`)
                .attr("x", (d,i) => x(prevValues[i]) + x(d.value) / 2 + labelLeft)
                .attr("y", function (d) {
                    labelRightBounds.push([this.getBBox().x, this.getBBox().width]);
                    return scaledHeight + 3 * labelBelow;
                })
                .attr("alignment-baseline", "top");

            let labelHeights = [];

            function getLabelHeight(i) {
                if (i == labelRightBounds.length - 1) {
                    labelHeights[i] = coeffLabelBelow;
                    return coeffLabelBelow;
                }
                else if (labelRightBounds[i][0] + labelRightBounds[i][1] + 2 * labelLeft > labelRightBounds[i + 1][0]) {
                    labelRightBounds[i + 1][0] = labelRightBounds[i][0] + labelRightBounds[i][1] + 2 * labelLeft;
                    let nextHeight = getLabelHeight(i + 1);
                    let thisHeight = nextHeight + 1;
                    labelHeights[i] = thisHeight;
                    return thisHeight;
                }
                else {
                    getLabelHeight(i + 1);
                    labelHeights[i] = coeffLabelBelow;
                    return coeffLabelBelow;
                }
            }

            getLabelHeight(0);

            mainChart.selectAll(".sota-customBarChart-label-aboveBar-line")
                .data(data)
                .join("polyline")
                .attr("class", "sota-customBarChart-label-aboveBar-line")
                .attr("points", (d, i) => {
                    let x1 = x(prevValues[i]) + x(d.value) / 2;
                    let y1 = scaledHeight - labelBelow;
                    let x2 = x1;
                    let y2 = scaledHeight + (labelHeights[i] + 1) * labelBelow;
                    let x3 = labelRightBounds[i][0] + labelRightBounds[i][1];
                    let y3 = y2;
                    return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
                })
                .attr("stroke-width", separatorStrokeWidth)
                .attr("stroke", lineColor)
                .attr("fill", "none");

            mainChart.selectAll(".sota-customBarChart-label-aboveBar-text")
                .data(data)
                .join("text")
                .attr("x", (d, i) => labelRightBounds[i][0])
                .attr("y", (d, i) => scaledHeight + labelHeights[i] * labelBelow);

            let labelsHeight = d3.max(labelHeights) * labelBelow + 20;

            let height = scaledHeight + margin.top + margin.bottom + labelsHeight;

            svg.attr("height", height);

            mainChart.attr("transform",`translate(${margin.left} ${margin.top})`);

        });

        chartRendered(container.node());
    });
}

/**
 * Render sota.js column chart
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [displayPercentage = true] - Whether to display percentage or values on axis
 * @param {number} [totalResp] - Number of total responses. Specify if categories are non-exclusive, i.e. if there are less total items than the sum of data points.
 * @param {(number|boolean)} [maxVal] - By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max.
 * @param {(number|boolean)} [minVal] - By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min.
 * @param {number} [mainHeight] - Height of the chart. Defaults to value from sotaConfig
 * @param {boolean} [showLegend = false] - Whether to show legend or bottom text labels
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function columnChart({
                             dataFile,
                             selector = false,
                             title = false,
                             subtitle = false,
                             section = false,
                             inputIsPercentage = false,
                             displayPercentage = true,
                             totalResp = null,
                             maxVal = null,
                             minVal = null,
                             mainHeight = sotaConfig.mainHeight,
                             showLegend = false, // if false, x axis shown instead
                             margin = {
                                 "top": 20,
                                 "bottom": 20,
                                 "left": 24,
                                 "right": 0
                             }
                         }) {
    const overflowOffset = sotaConfig.overflowOffset;
    const tickSize = sotaConfig.tickSize;
    const labelAngle = sotaConfig.labelAngle;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);

    d3.csv(dataFile + ".csv").then(data => {

        const [percentages, values, labels] = processData(data, inputIsPercentage, totalResp);
        const dataset = (displayPercentage || inputIsPercentage) ? percentages : values;

        if (minVal === null) { // default setting
            minVal = (inputIsPercentage || displayPercentage) ? 0 : d3.min(dataset);
        }
        else if (minVal === true) { // specified minVal
            minVal = d3.min(dataset);
        }
        else if (isNaN(minVal) || minVal === "") throw "invalid minVal for graph on " + selector;
        // else custom val

        if (maxVal === null) { // default setting
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
            .range(d3.map(labels, (d, i) => "sota-fill-" + (i + 1)).keys());

        let legendHeight = 0;
        let overlap = false;
        let xAxis;

        if (showLegend){

            let valueLabelWidths = [];

            const legend = svg.append("g")
                .lower()
                .attr("class", "sota-gen-legend")
                .attr("transform", `translate(0 ${margin.top})`);

            legend.selectAll("nothing")
                .data(data)
                .enter()
                .append("text")
                .attr("class", "sota-gen-legend-text")
                .text(d => d.label)
                .attr("x", function () {
                    valueLabelWidths.push(this.getBBox().width);
                })
                .remove();

            if (d3.sum(valueLabelWidths, d => d) + valueLabelWidths.length * swatchBetween + (valueLabelWidths.length - 1) * swatchRight > mainWidth) {
                // vertical legends
                let legendLeft = width - d3.max(valueLabelWidths) - swatchWidth - swatchBetween;

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(labels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                    .attr("x", legendLeft)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                    .attr("width", swatchWidth)
                    .attr("height", swatchHeight);

                legend.selectAll(".sota-gen-legend-text")
                    .data(labels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text sota-text-label")
                    .text(d => d)
                    .attr("x", legendLeft + swatchWidth + swatchBetween)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                    .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central");

                legendHeight = labels.length * swatchHeight + (labels.length - 1) * swatchBelowBetween + swatchBelow;
            }
            else {
                let legendLeft = width - (d3.sum(valueLabelWidths, d => d) + labels.length * (swatchWidth + swatchBetween) + (labels.length - 1) * swatchRight);

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(labels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(valueLabelWidths.slice(0, i), d => d))
                    .attr("y", 0)
                    .attr("width", swatchWidth)
                    .attr("height", swatchHeight);

                legend.selectAll(".sota-gen-legend-text")
                    .data(labels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text sota-text-label")
                    .text(d => d)
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                    .attr("y", swatchHeight / 2)
                    .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central");

                legendHeight = swatchHeight + swatchBelow;
            }
        }
        else {
            xAxis = mainChart.append("g")
                .attr("class", "sota-gen-axis sota-gen-xAxis sota-text-axis")
                .call(d3.axisBottom(x).tickSize(0))
                .attr("transform", `translate(0 ${mainHeight})`);

            // fix xAxis label overlap

            const xText = xAxis.selectAll("text");
            const xTextNodes = xText.nodes();

            for (let i in xTextNodes){
                if (i == xTextNodes.length - 1) continue;
                let curr = xTextNodes[+i].getBBox();
                let next = xTextNodes[+i+1].getBBox();
                if (curr.x + curr.width > next.x){ overlap = true; break;}
            }

            if (overlap){
                xText.attr("text-anchor","end")
                    .style("transform",`translateY(4px) rotate(-${labelAngle}deg)`)
                    .node().classList.add("angled-label");
            }
        }

        const yAxis = mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-yAxis sota-num-axis")
            .call(d3.axisLeft(y).tickSize(-tickSize));

        // loop through to render stuff

        mainChart.selectAll(".sota-columnChart-bar")
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
            .call(bindTooltip, tooltip, percentages, labels, values);

        // get mainHeight based on x axis

        if (showLegend) {
            mainHeight += legendHeight;
        } else {
            if (overlap){
                let textWidth = [];

                const textElem = xAxis.select("text").node().getBBox();
                const textTop = textElem.y;
                const textHeight = textElem.height;

                xAxis.selectAll("text")
                    .each(function(){textWidth.push(this.getBBox().width);});

                const maxTextWidth = d3.max(textWidth);
                const rotatedHeight = maxTextWidth * Math.sin(labelAngle * Math.PI / 180);
                const rotatedTextHeight = textHeight * Math.cos(labelAngle * Math.PI / 180);

                mainHeight += textTop + rotatedHeight + rotatedTextHeight;

            }
            else {
                let textBottom = [];

                xAxis.selectAll("text")
                    .each(function(){textBottom.push(this.getBBox().y + this.getBBox().height);});

                mainHeight += +d3.max(textBottom);
            }
        }

        // set widths, heights, offsets

        let height = mainHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        mainChart.attr("transform", `translate(${margin.left + overflowOffset} ${margin.top + legendHeight})`)
            .attr("width", mainWidth);

        chartRendered(container.node());
    });
}

/**
 * Render sota.js grouped bar chart
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [displayPercentage = true] - Whether to display percentage or value on axis
 * @param {number} [totalResp] - Number of total responses. Specify if categories are non-exclusive, i.e. if there are less total items than the sum of data points.
 * @param {(number|boolean)} [maxVal] - By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max.
 * @param {(number|boolean)} [minVal] - By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min.
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function groupedBarChart({
                             dataFile,
                             selector = false,
                             title = false,
                             subtitle = false,
                             section = false,
                             totalResp = null, // dictionary: subgroup -- total
                             inputIsPercentage = false,
                             displayPercentage = true,
                             minVal = 0, // default 0, only option is hard overwrite
                             maxVal = null,
                             margin = sotaConfig.margin
                         }) {

    // define styling variables here

    const hoverOpacity = 0.8;
    const barHeight = sotaConfig.groupedBarChart.barHeight;
    const barMargin = sotaConfig.groupedBarChart.barMargin;
    const overflowOffset = sotaConfig.overflowOffset;
    const groupLabelMargin = sotaConfig.groupLabelMargin;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;
    const xAxisTop = sotaConfig.xAxisTop;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);

    d3.csv(dataFile + ".csv").then(data => {

        // data processing

        /*
        if inputIsPercentage
            xScale: 0 to 100
            don't do any processing on input data
        else if displayPercentage
            xScale: 0 to 100
            process input data: d / totalResp[group]
         else
            xScale: 0 to max(totalResp)
            don't process input data
         */

        window.wow = data;

        const subGroups = data.columns.splice(1);
        const groupLabels = d3.map(data, d => d.group).keys();

        const allGroupValues = d3.map(data, d => {
            let subGroupValues = [];
            for (let subGroup of subGroups){
                subGroupValues.push(+d[subGroup]);
            }
            return d3.max(subGroupValues);
        }).keys();

        const valueMax = d3.max(allGroupValues, d => +d);

        if (maxVal == null){
            maxVal = (inputIsPercentage || displayPercentage) ? 100 : valueMax;
        }
        else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;

        const barspace = barHeight + barMargin;
        const groupHeight = barspace * subGroups.length;
        let mainHeight = (groupHeight + groupLabelMargin) * data.length;

        const x = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([0,mainWidth]);

        const groupY = d3.scaleOrdinal()
            .domain(d3.map(data, d => d.group))
            .range(d3.map(data, (d, i) => (groupHeight + groupLabelMargin) * i).keys());

        const y = d3.scaleOrdinal()
            .domain(subGroups)
            .range(d3.map(subGroups, (d, i) => barspace * i).keys());

        const xAxis = mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-xAxis sota-groupedBarChart-xAxis sota-num-axis")
            .call(d3.axisBottom(x).tickSize(-(mainHeight + xAxisTop)))
            .attr("transform", "translate(" + 0 + " " + (mainHeight + xAxisTop) + ")");

        mainHeight += 20 + xAxisTop;

        // loop through to render stuff

        const chartGroups = mainChart.selectAll(".sota-groupedBarChart-group")
            .data(data)
            .join("g")
            .attr("class", "sota-groupedBarChart-group")
            .attr("transform", (d, i) => `translate(0 ${groupY(d.group)})`);

        const classNames = d3.scaleOrdinal()
            .domain(subGroups)
            .range(d3.map(subGroups, (d, i) => "sota-fill-" + (i + 1)).keys());

        chartGroups.selectAll(".sota-gen-bar")
            .data(d => {
                let dataset = [];
                for (let key of subGroups){dataset.push(+d[key]);}
                return dataset;
            })
            .join("rect")
            .attr("class",(d, i) => `sota-gen-bar ${classNames(subGroups[i])}`)
            .attr("y", (d,i) => +y(subGroups[i]) + +groupLabelMargin)
            .attr("x", 0)
            .attr("width", (d, i) => x((inputIsPercentage) ? d : d / totalResp[subGroups[i]] * 100))
            .attr("height", barHeight)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(() => {
                        let retval = `<span class="sota-text-label"><span class="sota-heavy-label">${subGroups[i]}</span><br/>Percentage: ${toPercentage((inputIsPercentage) ? d : d / totalResp[subGroups[i]] * 100)}`;
                        if (!inputIsPercentage) {
                            retval += "<br/>Number of responses: " + d;
                        }
                        retval += "</span>";
                        return retval;
                    })
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mousemove", () => {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("opacity", 1.0);
                tooltip.style("opacity", 0);
            });

        mainChart.selectAll(".sota-gen-groupLabel")
            .data(groupLabels)
            .join("text")
            .attr("class","sota-gen-groupLabel sota-text-label sota-heavy-label")
            .text(d => d)
            .attr("alignment-baseline", "bottom")
            .attr("x", 0)
            .attr("y", d => +groupY(d) + +groupLabelMargin)
            .attr("transform", "translate(0 -8)");


        // set widths, heights, offsets
        let height = mainHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        mainChart.attr("transform",`translate(${margin.left + overflowOffset} ${margin.top})`)
            .attr("width",mainWidth);

        chartRendered(container.node());
    });
}

/**
 * Render sota.js stacked column chart
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [displayPercentage = true] - Whether to display percentage or value on axis
 * @param {(number|boolean)} [maxVal] - By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max.
 * @param {(number|boolean)} [minVal] - By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min.
 * @param {number} [mainHeight] - Height of the chart. Defaults to value from sotaConfig
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function stackedColumnChart({
                             dataFile,
                             selector = false,
                             title = false,
                             subtitle = false,
                             section = false,
                             inputIsPercentage = false,
                             displayPercentage = true,
                             maxVal = null,
                             minVal = null,
                             mainHeight = sotaConfig.mainHeight,
                             margin = {
                                 "top": 20,
                                 "bottom": 20,
                                 "left": 24,
                                 "right": 0
                             }
                         }) {

    const hoverOpacity = 0.8;
    const tickSize = sotaConfig.tickSize;
    const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
    const overflowOffset = sotaConfig.overflowOffset;
    const labelAngle = sotaConfig.labelAngle;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, 0);

    d3.csv(dataFile + ".csv").then(data => {

        // data processing
        const valueLabels = data.columns.slice(1);
        const groupLabels = d3.map(data, d => d.group).keys();

        var stackedData = [];

        if (inputIsPercentage){
            data.forEach(d => {
                let prevPercentage = 0;
                let thisData = [];
                for (let valueLabel of valueLabels) {
                    let thisPercentage = +d[valueLabel];
                    thisData.push([thisPercentage,prevPercentage]);
                    prevPercentage += thisPercentage;
                }
                stackedData.push(thisData);
            });
        }
        else {
            data.forEach(d => {
                let prevPercentage = 0;
                let total = d3.sum(valueLabels, k => +d[k]);
                let thisData = [];
                for (let valueLabel of valueLabels) {
                    let thisPercentage = +d[valueLabel] / total * 100;
                    thisData.push([thisPercentage, prevPercentage, +d[valueLabel]]);
                    prevPercentage += thisPercentage;
                }
                stackedData.push(thisData);
            });
        }

        const dataset = (displayPercentage || inputIsPercentage) ? stackedData : data.map(d => +d.value);

        if (minVal === null) { // default setting
            minVal = (inputIsPercentage || displayPercentage) ? 0 : d3.min(dataset);
        }
        else if (minVal === true) { // specified minVal
            minVal = d3.min(dataset);
        }
        else if (isNaN(minVal) || minVal === "") throw "invalid minVal for graph on " + selector;
        // else custom val

        if (maxVal === null) { // default setting
            maxVal = (inputIsPercentage || displayPercentage) ? 100 : d3.max(dataset);
        }
        else if (maxVal === true) { // specified maxVal
            maxVal = d3.max(dataset);
        }
        else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;
        // else custom val

        const x = d3.scaleBand()
            .domain(groupLabels)
            .range([0, mainWidth])
            .padding([0.3]);

        const y = d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([mainHeight, 0]);

        const classNames = d3.scaleOrdinal()
            .domain(valueLabels)
            .range(d3.map(valueLabels, (d, i) => "sota-fill-" + (valueLabels.length > 3 ? (i + 1) : (2 * i + 1))).keys());

        const yAxis = mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-yAxis sota-num-axis")
            .call(d3.axisLeft(y).tickSize(-tickSize));

        const xAxis = mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-xAxis sota-text-axis")
            .call(d3.axisBottom(x).tickSize(0))
            .attr("transform", `translate(0 ${mainHeight})`);

        let overlap = false;

        const xText = xAxis.selectAll("text");
        const xTextNodes = xText.nodes();

        for (let i in xTextNodes){
            if (i == xTextNodes.length - 1) continue;
            let curr = xTextNodes[+i].getBBox();
            let next = xTextNodes[+i+1].getBBox();
            if (curr.x + curr.width > next.x){ overlap = true; break;}
        }

        if (overlap){
            xText.attr("text-anchor","end")
                .style("transform",`translateY(4px) rotate(-${labelAngle}deg)`)
                .node().classList.add("angled-label");
        }

        // legend

        let legendHeight = 0;

        let valueLabelWidths = [];

        const legend = svg.append("g")
            .lower()
            .attr("class", "sota-gen-legend")
            .attr("transform", `translate(0 ${margin.top})`);

        legend.selectAll("nothing")
            .data(valueLabels)
            .enter()
            .append("text")
            .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
            .text(d => d)
            .attr("x", function () {
                valueLabelWidths.push(this.getBBox().width);
            })
            .remove();

        if (d3.sum(valueLabelWidths, d => d) + valueLabelWidths.length * (swatchWidth + swatchBetween) + (valueLabelWidths.length - 1) * swatchRight > (mainWidth)) {
            // vertical legends
            let legendLeft = width + overflowOffset - d3.max(valueLabelWidths) - swatchWidth - swatchBetween;

            legend.selectAll(".sota-gen-legend-swatch")
                .data(valueLabels)
                .join("rect")
                .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                .attr("x", legendLeft)
                .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                .attr("width", swatchWidth)
                .attr("height", swatchHeight);

            legend.selectAll(".sota-gen-legend-text")
                .data(valueLabels)
                .join("text")
                .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                .text(d => d)
                .attr("x", legendLeft + swatchWidth + swatchBetween)
                .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central");

            legendHeight = valueLabels.length * swatchHeight + (valueLabels.length - 1) * swatchBelowBetween + swatchBelow;
        }
        else {
            let legendLeft = width + overflowOffset - (d3.sum(valueLabelWidths, d => d) + valueLabels.length * (swatchWidth + swatchBetween) + (valueLabels.length - 1) * swatchRight);

            legend.selectAll(".sota-gen-legend-swatch")
                .data(valueLabels)
                .join("rect")
                .attr("class", d => "sota-gen-legend-swatch " + classNames(d))
                .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(valueLabelWidths.slice(0, i), d => d))
                .attr("y", 0)
                .attr("width", swatchWidth)
                .attr("height", swatchHeight);

            legend.selectAll(".sota-gen-legend-text")
                .data(valueLabels)
                .join("text")
                .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                .text(d => d)
                .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(valueLabelWidths.slice(0, i), d => d))
                .attr("y", swatchHeight / 2)
                .attr("alignment-baseline", "central")
.attr("dominant-baseline", "central");

            legendHeight = swatchHeight + swatchBelow;
        }

        // main loop for rendering graph

        const chartGroups = mainChart.selectAll(".sota-stackedColumnChart-group")
            .data(stackedData)
            .join("g")
            .attr("class","sota-stackedColumnChart-group")
            .attr("transform",(d, i) => "translate(" + (x(groupLabels[i])) + " 0)");

        chartGroups.selectAll(".sota-stackedColumnChart-bar")
            .data(d => d)
            .join("rect")
            .attr("class", (d, i) => "sota-stackedColumnChart-bar " + classNames(i))
            .attr("x", 0)
            .attr("y", d => y(d[0]+d[1]))
            .attr("width", x.bandwidth())
            .attr("height", d => mainHeight - y(d[0]))
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(() => {
                        let retval = `<span class="sota-text-label"><span class="sota-heavy-label">${valueLabels[i]}</span><br/>Percentage: ${toPercentage(d[0])}`;
                        if (!inputIsPercentage) {
                            retval += "<br/>Number of responses: " + d[2];
                        }
                        retval += "</span>";
                        return retval;
                    })
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mousemove", () => {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("opacity", 1.0);
                tooltip.style("opacity", 0);
            });

        chartGroups.selectAll(".sota-stackedColumnChart-separator")
            .data(d => d)
            .join("rect")
            .attr("class", "sota-stackedColumnChart-separator")
            .attr("fill","white")
            .attr("x", 0)
            .attr("y", (d,i) => y(d[0]) + y(d[1]) - mainHeight)
            .attr("height", d => {
                if (d[0] > 0){
                    return separatorStrokeWidth;
                }
                else {
                    return 0;
                }
            })
            .attr("width", x.bandwidth());

        mainHeight += legendHeight;
        if (overlap){
            let textWidth = [];

            const textElem = xAxis.select("text").node().getBBox();
            const textTop = textElem.y;
            const textHeight = textElem.height;

            xAxis.selectAll("text")
                .each(function(){textWidth.push(this.getBBox().width);});

            const maxTextWidth = d3.max(textWidth);
            const rotatedHeight = maxTextWidth * Math.sin(labelAngle * Math.PI / 180);
            const rotatedTextHeight = textHeight * Math.cos(labelAngle * Math.PI / 180);

            mainHeight += textTop + rotatedHeight + rotatedTextHeight;

        }
        else {
            let textBottom = [];

            xAxis.selectAll("text")
                .each(function(){textBottom.push(this.getBBox().y + this.getBBox().height);});

            mainHeight += +d3.max(textBottom);
        }


        // set widths, heights, offsets

        let height = mainHeight + margin.top + margin.bottom + legendHeight;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .style("margin-left", -overflowOffset + "px");

        mainChart.attr("transform",`translate(${margin.left+overflowOffset} ${margin.top + legendHeight})`)
            .attr("width",mainWidth);

        chartRendered(container.node());
    });
}

/**
 * Render sota.js custom column chart, using an SVG path as the base
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {string} shapeFile - Relative path to svg shape file, excluding file extension, i.e. "shapes/shapefile"
 * @param {number} shapeHeight - Height of shape for chart
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function customColumnChart({
    dataFile,
    selector = false,
    title = false,
    subtitle = false,
    section = false,
    shapeFile,
    shapeHeight = 300,
    inputIsPercentage = false,
    margin = sotaConfig.margin
}) {

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, 0);

    const separatorStrokeHeight = sotaConfig.separatorStrokeWidth;

    d3.xml(shapeFile + ".svg").then(shape => {

        // import shape and make it a definition

        let importedNode = document.importNode(shape.documentElement, true);
        let firstPath = d3.select(importedNode)
            .select("path")
            .node();
        let firstPathWidth = 0;
        let firstPathHeight = 0;

        svg.append(() => firstPath)
            .attr("class",function(){
                firstPathWidth = this.getBBox().width;
                firstPathHeight = this.getBBox().height;
                return "";
            })
            .remove();

        let scaleFactor = shapeHeight / firstPathHeight;
        let scaledWidth = firstPathWidth * scaleFactor;

        const uniqueID = uuidv4();

        svg.append("defs")
            .append("clipPath")
            .attr("id","shapeDef"+uniqueID)
            .append(() => firstPath)
            .attr("transform", `scale(${scaleFactor})`);

        d3.csv(dataFile + ".csv").then(data => {

            const [percentages, values, labels] = processData(data, inputIsPercentage);

            // since stacked, left coordinate of each bar progresses, so we need this cumulative array

            let prevValue = 0;
            let prevValues = [];
            for (let d of data){
                prevValues.push(prevValue);
                prevValue += +d.value;
            }

            const y = d3.scaleLinear()
                .domain([0, d3.sum(data, d => +d.value)])
                .range([0, shapeHeight]);

            const classNames = d3.scaleOrdinal()
                .domain(labels)
                .range(d3.map(labels, (d, i) => "sota-fill-" + (i + 1)).keys());

            // main loop

            mainChart.selectAll(".sota-customColumnChart-bar")
                .data(data)
                .join("rect")
                .attr("class", d => "sota-customColumnChart-bar " + classNames(d.label))
                .attr("x", 0)
                .attr("y", (d,i) => y(prevValues[i]))
                .attr("width", scaledWidth)
                .attr("height", d => y(d.value))
                .attr("clip-path", "url(#shapeDef"+uniqueID+")")
                .call(bindTooltip, tooltip, percentages, labels, values);

            mainChart.selectAll(".sota-customColumnChart-separator")
                .data(data)
                .join("rect")
                .attr("class", "sota-customColumnChart-separator")
                .attr("x", 0)
                .attr("y", (d, i) => (i == 0) ? -separatorStrokeHeight : y(prevValues[i]))
                .attr("width", scaledWidth)
                .attr("height", separatorStrokeHeight)
                .attr("fill", "white")
                .attr("clip-path", "url(#shapeDef"+uniqueID+")");

            // draw labels - horizontal lines to the left and right from the center of the rectangle

            // var labelRightBounds = [];
            //
            // mainChart.selectAll(".sota-customColumnChart-label-aboveBar-text")
            //     .data(data)
            //     .join("text")
            //     .attr("class", "sota-customColumnChart-label-aboveBar-text")
            //     .text((d,i) => `${d.label}: ${toPercentage(percentages[i])}`)
            //     .attr("x", (d,i) => x(prevValues[i]) + x(d.value) / 2 + labelLeft)
            //     .attr("y", function (d) {
            //         labelRightBounds.push([this.getBBox().x, this.getBBox().width]);  //fix
            //         return scaledHeight + 3 * labelBelow;
            //     })
            //     .attr("alignment-baseline", "top")
            //
            // let labelHeights = []
            //
            // function getLabelHeight(i) {
            //     if (i == labelRightBounds.length - 1) {
            //         labelHeights[i] = coeffLabelBelow;
            //         return coeffLabelBelow;
            //     }
            //     else if (labelRightBounds[i][0] + labelRightBounds[i][1] + 2 * labelLeft > labelRightBounds[i + 1][0]) {
            //         labelRightBounds[i + 1][0] = labelRightBounds[i][0] + labelRightBounds[i][1] + 2 * labelLeft;
            //         let nextHeight = getLabelHeight(i + 1);
            //         let thisHeight = nextHeight + 1;
            //         labelHeights[i] = thisHeight;
            //         return thisHeight;
            //     }
            //     else {
            //         getLabelHeight(i + 1);
            //         labelHeights[i] = coeffLabelBelow;
            //         return coeffLabelBelow;
            //     }
            // }
            //
            // getLabelHeight(0);
            //
            // mainChart.selectAll(".sota-customColumnChart-label-aboveBar-line")
            //     .data(data)
            //     .join("polyline")
            //     .attr("class", "sota-customColumnChart-label-aboveBar-line")
            //     .attr("points", (d, i) => {
            //         let x1 = x(prevValues[i]) + x(d.value) / 2;
            //         let y1 = scaledHeight - labelBelow;
            //         let x2 = x1;
            //         let y2 = scaledHeight + (labelHeights[i] + 1) * labelBelow;
            //         let x3 = labelRightBounds[i][0] + labelRightBounds[i][1];
            //         let y3 = y2;
            //         return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
            //     })
            //     .attr("stroke-height", separatorStrokeHeight)
            //     .attr("stroke", lineColor)
            //     .attr("fill", "none")
            //
            // mainChart.selectAll(".sota-customColumnChart-label-aboveBar-text")
            //     .data(data)
            //     .join("text")
            //     .attr("x", (d, i) => labelRightBounds[i][0])
            //     .attr("y", (d, i) => scaledHeight + labelHeights[i] * labelBelow);
            //
            // let labelsHeight = d3.max(labelHeights) * labelBelow + 20;
            //
            // let height = scaledHeight + margin.top + margin.bottom + labelsHeight;
            //
            // svg.attr("height", height);

            const height = shapeHeight + margin.top + margin.bottom;
            svg.attr("height", height);

            mainChart.attr("transform",`translate(${margin.left} ${margin.top})`)
                .attr("width",width - margin.left - margin.right);

        });

        chartRendered(container.node());
    });
}

/**
 *
 * @param {string} dataFile - Relative path to csv data file, excluding file extension, i.e. "data/datafile"
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 * @param {string} [title] - Title to be rendered in h3 tag. Only rendered if section param is used and not selector
 * @param {string} [subtitle] - Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector
 * @param {boolean} [inputIsPercentage = false] - Whether or not input data is in percentages
 * @param {boolean} [displayPercentage = true] - Whether to display percentage or value on axis
 * @param {(number|boolean)} [maxVal] - By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max.
 * @param {(number|boolean)} [minVal] - By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min.
 * @param {number} [height = 300] - Height of the graph
 * @param {boolean} [showLegend = true] - Whether or not to show legend
 * @param {{top: number, left: number, bottom: number, right: number}} [margin] - Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig
 */
function multiLineGraph({
                            dataFile,
                            selector = false,
                            title = false,
                            subtitle = false,
                            section = false,
                            minVal,
                            maxVal,
                            height = 300,
                            showLegend = true,
                            inputIsPercentage = false,
                            displayPercentage = true,
                            margin = {
                                "top": 20,
                                "bottom": 20,
                                "left": 24,
                                "right": 0
                            }
                         }) {
    const lineWidth = 3;
    const tickSize = 8;
    const overflowOffset = sotaConfig.overflowOffset;
    const swatchBetween = sotaConfig.swatch.between;
    const swatchRight = sotaConfig.swatch.right;
    const swatchWidth = sotaConfig.swatch.width;
    const swatchHeight = sotaConfig.swatch.height;
    const swatchBelowBetween = sotaConfig.swatch.belowBetween;
    const swatchBelow = sotaConfig.swatch.below;

    const {container, svg, tooltip, width, mainWidth, mainChart} = containerSetup(
        selector, section, title, subtitle, margin, overflowOffset);
    const mainHeight = height - margin.top - margin.bottom;

    d3.csv(dataFile + ".csv").then(data => {
        // DATA PROCESSING

        const subGroups = data.columns.slice(1);
        const groupLabels = d3.map(data, d => d.group).keys();

        let stackedData = [];
        let maxVals = [];
        let minVals = [];
        let maxPerc = [];
        let minPerc = [];

        if (inputIsPercentage){
            for (const group of data){
                let thisData = [];
                for (const subGroup in group){
                    if (subGroup === "group") continue;
                    thisData.push(+group[subGroup]);
                }
                maxVals.push(d3.max(thisData, d => d[0]));
                minVals.push(d3.min(thisData, d => d[0]));
                stackedData.push(thisData);
            }
        }
        else {
            for (const group of data){
                const total = d3.sum(subGroups, subGroup => +group[subGroup]);
                const thisData = [];
                for (const subGroup in group){
                    if (subGroup === "group") continue;
                    const thisPercentage = +group[subGroup] / total * 100;
                    thisData.push([thisPercentage, +group[subGroup]]);
                }
                maxVals.push(d3.max(thisData, d => d[1]));
                minVals.push(d3.min(thisData, d => d[1]));
                maxPerc.push(d3.max(thisData, d => d[0]));
                minPerc.push(d3.min(thisData, d => d[0]));
                stackedData.push(thisData);
            }
        }

        if (minVal == null) { // default setting
            minVal = (inputIsPercentage || displayPercentage) ? 0 : d3.min(minVals);
        }
        else if (minVal === true) { // specified minVal
            minVal = d3.min(minPerc);
        }
        else if (isNaN(minVal) || minVal === "") throw "invalid minVal for graph on " + selector;
        // else custom val

        if (maxVal == null) { // default setting
            maxVal = (inputIsPercentage || displayPercentage) ? 100 : d3.max(maxVals);
        }
        else if (maxVal === true) { // specified maxVal
            maxVal = d3.max(maxPerc);
        }
        else if (isNaN(maxVal) || maxVal === "") throw "invalid maxVal for graph on " + selector;
        // else custom val

        const x = d3.scaleBand()
            .domain(subGroups)
            .range([0, mainWidth]);

        const y = d3.scaleLinear()
            .domain([minVal, maxVal]) // for now, hardcode displayPercentage
            .range([mainHeight,0]);

        const fillClassNames = d3.scaleOrdinal()
            .domain(groupLabels)
            .range(d3.map(groupLabels, (d, i) => "sota-fill-" + (groupLabels.length > 3 ? (i + 1) : (2 * i + 1))).keys());

        const strokeClassNames = d3.scaleOrdinal()
            .domain(groupLabels)
            .range(d3.map(groupLabels, (d, i) => "sota-stroke-" + (groupLabels.length > 3 ? (i + 1) : (2 * i + 1))).keys());

        // LEGEND

        let legendHeight = 0;

        if (showLegend){
            let groupLabelWidths = [];

            const legend = svg.append("g")
                .lower()
                .attr("class","sota-gen-legend")
                .attr("transform", `translate(0 ${margin.top})`);

            legend.selectAll("nothing")
                .data(groupLabels)
                .enter()
                .append("text")
                .attr("class","sota-gen-legend-text")
                .text(d => d)
                .attr("x", function(){
                    groupLabelWidths.push(this.getBBox().width);
                })
                .remove();

            if (d3.sum(groupLabelWidths, d => d) + groupLabels.length * (swatchWidth + swatchBetween) + (groupLabels.length - 1) * swatchRight > mainWidth){
                // vertical legends
                let legendLeft = width + overflowOffset - d3.max(groupLabelWidths) - swatchWidth - swatchBetween;

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(groupLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + fillClassNames(d))
                    .attr("x",legendLeft)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i)
                    .attr("width",swatchWidth)
                    .attr("height",swatchHeight);

                legend.selectAll(".sota-gen-legend-text")
                    .data(groupLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                    .text(d => d)
                    .attr("x", legendLeft + swatchWidth + swatchBetween)
                    .attr("y", (d, i) => (swatchHeight + swatchBelowBetween) * i + swatchHeight / 2)
                    .attr("alignment-baseline", "central")
                    .attr("dominant-baseline", "central");

                legendHeight = groupLabels.length * swatchHeight + (groupLabels.length - 1) * swatchBelowBetween + swatchBelow;
            }
            else {
                let legendLeft = width + overflowOffset - (d3.sum(groupLabelWidths, d => d) + groupLabels.length * (swatchWidth + swatchBetween) + (groupLabels.length - 1) * swatchRight);

                legend.selectAll(".sota-gen-legend-swatch")
                    .data(groupLabels)
                    .join("rect")
                    .attr("class", d => "sota-gen-legend-swatch " + fillClassNames(d))
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + d3.sum(groupLabelWidths.slice(0,i), d => d))
                    .attr("y", 0)
                    .attr("width", swatchWidth)
                    .attr("height", swatchHeight);

                legend.selectAll(".sota-gen-legend-text")
                    .data(groupLabels)
                    .join("text")
                    .attr("class", "sota-gen-legend-text sota-text-label sota-heavy-label")
                    .text(d => d)
                    .attr("x", (d, i) => legendLeft + i * (swatchWidth + swatchBetween + swatchRight) + swatchWidth + swatchBetween + d3.sum(groupLabelWidths.slice(0, i), d => d))
                    .attr("y", swatchHeight / 2)
                    .attr("alignment-baseline", "central")
                    .attr("dominant-baseline", "central");

                legendHeight = swatchHeight + swatchBelow;
            }
        }

        mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-xAxis sota-text-axis")
            .call(d3.axisBottom(x).ticks(data.length).tickSize(-tickSize))
            .style("transform","translateY(" + mainHeight + "px)");

        mainChart.append("g")
            .attr("class", "sota-gen-axis sota-gen-yAxis sota-num-axis")
            .call(d3.axisLeft(y).tickSize(-tickSize));

        const chartGroups = mainChart.selectAll(".sota-multiLineGraph-group")
            .data(stackedData)
            .join("g")
            .attr("class", (d, i) => `sota-multiLineGraph-group ${strokeClassNames(groupLabels[i])}`);

        chartGroups.selectAll(".sota-multiLineGraph-path")
            .data(d => [d])
            .join("path")
            .attr("class", "sota-multiLineGraph-path")
            .attr("d", d3.line()
                .x((d, i) => x(subGroups[i]) + x.bandwidth() / 2)
                .y(d => y(d[0])))
            .attr("fill","none")
            .style("stroke-width",lineWidth);

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height + legendHeight + "px")
            .style("margin-left", -overflowOffset + "px");

        mainChart.attr("transform", `translate(${margin.left + overflowOffset} ${margin.top + legendHeight})`)
            .attr("width", mainWidth);

        chartRendered(container.node());
    });
}

/**
 * Render big number with subtitle. Not really a chart, no SVG involved, but using JS helps keep ordering correct
 * @param {string} title - Title to be rendered in h3 tag
 * @param {string} number - Number to be rendered in .sota-big
 * @param {string} subtitle - Subtitle to follow number
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 */
function bigNumber({
                             title, number, subtitle,
                             selector = false,
                             section = false
                         }){
    if (!(selector || section)) throw `No selector or section specified for chart with "${title}" title parameter.`;

    const container = selector ? d3.select(selector) : d3.select(`#sota-section-${section} .sota-section-inner`)
        .append("div")
        .attr("class", "sota-module");

    container.append("h3").text(title);

    container.append("div")
        .attr("class","sota-big")
        .append("span")
        .text(number);

    container.append("div")
        .attr("class","sota-subtitle")
        .append("span")
        .text(subtitle);
}

// import * as Masonry from "masonry-layout";

/**
 * Function to generate masonry layout on sota containers and modules
 */
function sotaMasonry(){
    const sections = document.querySelectorAll(".sota-section-inner");

    sections.forEach((e) => {
        let count = 0;
        const total = e.querySelectorAll(".sota-module svg").length;

        if (total === 0){
            const msnry = new Masonry(e, {
                itemSelector: ".sota-module",
                columnWidth: ".sota-module",
                gutter: 48
            });
            return;
        }

        const loading = document.createElement("p");
        loading.innerHTML = "Loading...";
        loading.classList.add("loading");

        e.prepend(loading);

        e.addEventListener("sotaChartRendered", () => {
            count++;

            if (count === total) {
                e.classList.remove("hide");

                const msnry = new Masonry(e, {
                    itemSelector: ".sota-module",
                    columnWidth: ".sota-module",
                    gutter: 48
                });
            }
        });
    });
}

/**
 * Function to render navbar. *Run after createSections*
 * @param sotaConfig - sotaConfig object
 * @param {string|boolean} [text=false] - Text to display in navbar
 * @param {string|boolean} [logo=false] - Relative path to logo to display in navbar
 * @param {string|boolean} [textLink=false] - Link for navbar text
 * @param {string|boolean} [logoLink=false] - Link for navbar logo
 */
function sotaNavbar(sotaConfig, text="", logo=false, textLink=false, logoLink = false){
    const container = document.getElementById("sota-navbar");
    container.classList.add("sz-navbar");

    let navbarHTML = `
    <div class="sz-navbar-left sz-navbar-inner">
      <input type="checkbox" id="sz-navbar-check">
      <label for="sz-navbar-check" class="sz-navbar-hamburger">☰</label>`;

    if (logo) navbarHTML += logoLink ?
        `<div class="sota-navbar-logo"><a href="${logoLink}"><img src="${logo}" alt="Navbar logo"></a></div>` :
        `<div class="sota-navbar-logo"><img src="${logo}" alt="Navbar logo"></div>`;

    navbarHTML += textLink ?
        `<div class="sota-navbar-text"><span><a href="${textLink}"><${text}</a></span></div>` :
        `<div class="sota-navbar-text"><span>${text}</span></div>`;

    navbarHTML += "<div class=\"sz-navbar-items\">";

    navbarHTML += textLink ?
        `<div class="sota-navbar-text sz-navbar-item"><span><a href="${textLink}"><${text}</a></span></div>` :
        `<div class="sota-navbar-text sz-navbar-item"><span>${text}</span></div>`;

    for (const section of sotaConfig.sections){
        navbarHTML += `<div class="sz-navbar-item" id="sota-navbar-item-${section.slug}"><a href="#sota-section-${section.slug}">${section.name}</a></div>`;
    }

    navbarHTML += "</div>";

    container.innerHTML = navbarHTML;

    // color changing on scroll

    const sectionElems = [];

    for (const section of sotaConfig.sections){
        sectionElems.push(document.getElementById("sota-section-" + section.slug));
    }

    console.log(sectionElems);

    window.onload = () => {
        changeColors();
    };

    window.addEventListener("scroll", () => {
        changeColors();
    });

    function changeColors(){
        if (window.innerWidth > 600){
            for (const i in sectionElems){
                const sectionElem = sectionElems[i];
                const section = sotaConfig.sections[i];
                const navbarItem = document.getElementById("sota-navbar-item-" + section.slug);
                if (window.scrollY >= sectionElem.offsetTop && window.scrollY < sectionElem.offsetTop + sectionElem.offsetHeight){
                    navbarItem.classList.add("selected");
                } else {
                    navbarItem.classList.remove("selected");
                }
            }
        }
    }

    const navbarItems = document.querySelectorAll("#sota-navbar .sz-navbar-item");
    const navbarCheck = document.getElementById("sz-navbar-check");

    for (let i = 0; i < navbarItems.length; i++){
        navbarItems[i].addEventListener("click", () => {
            changeColors();
            navbarCheck.checked = false;
        });
    }
}

/**
 * Function to render sections. *Run before sotaNavbar*
 * @param sotaConfig - sotaConfig object
 */
function createSections(sotaConfig){
    for (const section of sotaConfig.sections){
        const sectionSlug = section.slug;

        if (d3.select("body").select(`#sota-section-${sectionSlug}`).size() > 0){
            continue;
        }

        const container = d3.select("body")
            .append("div")
            .attr("id", `sota-section-${sectionSlug}`)
            .attr("class", "sota-section");

        container.append("h1").text(section.name);

        if (section.blurb !== undefined) container.append("p").text(section.blurb);

        container.append("div").attr("class", "sota-section-inner");
    }
}

let sota = {};

sota.barChart = barChart;
sota.pieChart = pieChart;
sota.lineGraph = lineGraph;
sota.stackedBarChart = stackedBarChart;
sota.customBarChart = customBarChart;
sota.columnChart = columnChart;
sota.groupedBarChart = groupedBarChart;
sota.stackedColumnChart = stackedColumnChart;
sota.customColumnChart = customColumnChart;
sota.multiLineGraph = multiLineGraph;
sota.bigNumber = bigNumber;
sota.setColors = setColors;
sota.setStyles = setStyles;
sota.sotaConfig = sotaConfig;
sota.colorInterpolate = colorInterpolate;
sota.sotaMasonry = sotaMasonry;
sota.sotaNavbar = sotaNavbar;
sota.createSections = createSections;

sota.setParam = function(prop, value){
    this.sotaConfig[prop] = value;
};

sota.getParam = function(prop){
    return this.sotaConfig[prop];
};

module.exports = sota;
