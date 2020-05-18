import * as d3 from "d3";

export function hideIfOOB(elems,marginLeft){
    for (let item of elems._groups){
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

export function mouseXIfNotOffsreen(tooltip){
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

export function processData(data, inputIsPercentage, totalResp = null){
    totalResp = (totalResp == null) ? d3.sum(data, d => +d.value) : totalResp;
    const percentages = (inputIsPercentage) ? data.map(d => +d.value).keys : data.map(d => +d.value / totalResp * 100);
    const values = (inputIsPercentage) ? false : data.map(d => +d.value);
    const labels = data.map(d => d.label);
    return [percentages, values, labels];
}

export function toPercentage(i){
    return d3.format(".1f")(i) + "%";
}

export function bindTooltip(selection, tooltip, percentages, labels, values){
    selection.on("mouseover", function (d, i){
        d3.select(this)
            .attr("opacity", sotaConfig.hoverOpacity);
        tooltip.style("opacity", 1.0)
            .html(() => {
                let retval = `<span class="sota-tooltip-label">${labels[i]}</span><br/>Percentage: ${toPercentage(percentages[i])}`;
                if (values) {
                    retval += "<br/>Number of responses: " + values[i];
                }
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
    })

}

export let sotaConfig = {
    separatorStrokeWidth: 2,
    barHeight: 32,
    barMargin: 16,
    labelLeft: 6,
    labelBelow: 8,
    groupLabelMargin: 32,
    xAxisTop: 24,
    overflowOffset: 24,
    lineColor: "#999999",
    mainHeight: 300,
    tickSize: 8,
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
}
