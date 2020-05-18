import * as d3 from "d3";
import sotaConfig from "./sotaConfig.js";

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
