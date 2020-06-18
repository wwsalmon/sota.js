import * as d3 from "d3";
import sotaConfig from "./sotaConfig.js";

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
        })
}

export {toPercentage, bindTooltip};