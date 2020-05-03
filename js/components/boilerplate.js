import '../d3.v5.min.js';
import { sotaConfig } from '../helper.js';

export default function ({
                             selector,
                             dataFile,
                             inputIsPercentage = false,
                             margin = sotaConfig.margin
                         }) {

    // define styling variables here

    const hoverOpacity = 0.8;
    const overflowOffset = sotaConfig.overflowOffset;

    const container = d3.select(selector);
    const svg = container.append("svg");
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    const mainChart = svg.append("g")
        .attr("class", "sota-mainChart");

    const width = document.querySelector(selector).offsetWidth;
    const mainWidth = width - margin.left - margin.right;

    d3.csv(dataFile + ".csv").then(data => {

        // data processing

        // loop through to render stuff

        // set widths, heights, offsets

        let mainHeight = 0; // define mainHeight and height at some point
        let height = mainHeight + margin.top + margin.bottom;

        svg.style("width", width + 2 * overflowOffset + "px")
            .attr("height", height)
            .attr("transform", `translate(${-overflowOffset} 0)`);

        mainChart.attr("transform",`translate(${margin.left} ${margin.top})`)
            .attr("width",mainWidth)

    });
}