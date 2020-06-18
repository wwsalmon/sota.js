import * as d3 from "d3";
import {bindTooltip, toPercentage} from "../lib/tooltip.js";
import {containerSetup, processData, chartRendered, uuidv4} from "../lib/sotaChartHelpers.js";
import sotaConfig from "../lib/sotaConfig.js";

export default function ({
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
    const hoverOpacity = 0.8;
    const labelLeft = sotaConfig.labelLeft;
    const labelBelow = sotaConfig.labelBelow;
    const lineColor = sotaConfig.lineColor;
    const coeffLabelBelow = 3;

    d3.xml("shapes/" + shapeFile + ".svg").then(shape => {

        // import shape and make it a definition

        let importedNode = document.importNode(shape.documentElement, true)
        let firstPath = d3.select(importedNode)
            .select("path")
            .node()
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
            .attr("transform", `scale(${scaleFactor})`)

        d3.csv(dataFile + ".csv").then(data => {

            const [percentages, values, labels] = processData(data, inputIsPercentage);

            // since stacked, left coordinate of each bar progresses, so we need this cumulative array

            let prevValue = 0;
            let prevValues = [];
            for (let d of data){
                prevValues.push(prevValue)
                prevValue += +d.value;
            }

            const y = d3.scaleLinear()
                .domain([0, d3.sum(data, d => +d.value)])
                .range([0, shapeHeight]);

            const classNames = d3.scaleOrdinal()
                .domain(labels)
                .range(d3.map(labels, (d, i) => "sota-fill-" + (i + 1)).keys())

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
                .attr("clip-path", "url(#shapeDef"+uniqueID+")")

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

            const height = shapeHeight + margin.top + margin.bottom
            svg.attr("height", height);

            mainChart.attr("transform",`translate(${margin.left} ${margin.top})`)
                .attr("width",width - margin.left - margin.right)

        });

        chartRendered(container.node());
    })
}
