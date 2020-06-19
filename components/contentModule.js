import * as d3 from "d3";

/**
 * Render big number with subtitle. Not really a chart, no SVG involved, but using JS helps keep ordering correct
 * @param {string} title - Title to be rendered in h3 tag
 * @param {string} content - HTML conetnt to be rendered beneath subtitle
 * @param {string} subtitle - Subtitle to follow number
 * @param {string} [selector] - Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector."
 * @param {string} [section] - Either this or selector param is required. Slug for section to add .sota-module container and chart to
 */
function contentModule({
                       title, content, subtitle,
                       selector = false,
                       section = false
                   }){
    if (!(selector || section)) throw `No selector or section specified for chart with "${title}" title parameter.`;

    const container = selector ? d3.select(selector) : d3.select(`#sota-section-${section} .sota-section-inner`)
        .append("div")
        .attr("class", "sota-module");

    container.append("h3").text(title);

    container.append("div")
        .attr("class","sota-subtitle")
        .append("span")
        .text(subtitle);

    container.append("div")
        .html(content);
}

export default contentModule;