import * as d3 from "d3";
import {containerSetup} from "../lib/sotaChartHelpers.js";

export default function ({
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
        .attr("class","subtitle")
        .append("span")
        .text(subtitle);
}