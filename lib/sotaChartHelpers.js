import * as d3 from "d3";

export function containerSetup(selector, section, title, subtitle){
    if (!(selector || section)) throw `No selector or section specified for chart with "${dataFile}" dataFile parameter.`;

    const container = selector ? d3.select(selector) : d3.select(`#sota-section-${section} .sota-section-inner`)
        .append("div")
        .attr("class", "sota-module");

    if (section && title) container.append("h3")
        .text(title);

    if (section && subtitle) container.append("div")
        .attr("class","subtitle")
        .append("span")
        .text(subtitle);

    return container;
}

export function processData(data, inputIsPercentage, totalResp = null){
    totalResp = (totalResp == null) ? d3.sum(data, d => +d.value) : totalResp;
    const percentages = (inputIsPercentage) ? data.map(d => +d.value) : data.map(d => +d.value / totalResp * 100);
    const values = (inputIsPercentage) ? false : data.map(d => +d.value);
    const labels = data.map(d => d.label);
    return [percentages, values, labels];
}

export function chartRendered(thisModule){
    const chartRendered = new Event("sotaChartRendered");
    const container = thisModule.closest(".sota-section-inner");
    if (container !== null) container.dispatchEvent(chartRendered);
}

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

function hideIfOOBHelper(item,marginLeft){
    if (item.getBBox().x < marginLeft){
        item.style.display = "none";
    }
}