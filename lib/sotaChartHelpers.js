import * as d3 from "d3";

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
export function containerSetup(selector, section, title, subtitle, margin, overflowOffset){
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
export function processData(data, inputIsPercentage, totalResp = null){
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
export function chartRendered(thisModule){
    const chartRendered = new Event("sotaChartRendered");
    const container = thisModule.closest(".sota-section-inner");
    if (container !== null) container.dispatchEvent(chartRendered);
}

/**
 * Helper function for hiding d3 selection if out of specified bound
 * @param selection
 * @param marginLeft
 */
export function hideIfOOB(selection,marginLeft){
    console.log(selection);
    for (let item of selection._groups){
        if (Array.isArray(item)){
            for (let subitem of item) {
                hideIfOOBHelper(subitem, marginLeft);
            }
        }
        else{
            hideIfOOBHelper(item, marginLeft);
        }
    }
}

/**
 * Helper function for hideIfOOB helper function
 * @param item
 * @param marginLeft
 */
function hideIfOOBHelper(item,marginLeft){
    if (item.getBBox().x < marginLeft){
        item.style.display = "none";
    }
}

/**
 * Helper function to generate UUIDv4. Code from https://stackoverflow.com/a/2117523/4517586
 * @returns {*}
 */
export function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}