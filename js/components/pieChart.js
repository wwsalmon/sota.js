import helper, {sotaConfig} from '../helper.js';

export default function ({
    selector,
    dataFile,
    inputIsPercentage = false,
    pieRad = 150,
    pieThick = 80,
    margin = {
        "top": 0,
        "bottom": 0,
        "left": 0,
        "right": 0
    } }) {

    var container = d3.select(selector);
    var svg = container.append("svg")
        .attr("class", "sota-pieChart");
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    var width = document.querySelector(selector).offsetWidth;

    var trueWidth = width - margin.left - margin.right;

    if (trueWidth < pieRad * 2) {
        pieRad = trueWidth / 2;
    }

    if (pieThick > pieRad) {
        pieThick = 50;
    }

    var height = pieRad * 2 + margin.top + margin.bottom;

    svg.attr("height", height);

    d3.csv("data/" + dataFile + ".csv").then(data => {
        const hoverOpacity = 0.8;
        const polylineColor = "#999";
        const polylineStrokeWidth = 2;
        const separatorStrokeWidth = sotaConfig.separatorStrokeWidth;
        const labels = data.map(d => d.label);

        if (!inputIsPercentage) {
            var values = data.map(d => d.value);
            var totalResp = values.reduce((a, b) => +a + +b, 0);
            var percentages = values.map(value => helper.oneDecimal(100 * value / totalResp));
        }
        else {
            var percentages = data.map(d => d.value);
        }

        const pie = d3.pie();
        const pieData = pie(percentages);

        // centered g to place chart in

        const g = svg.append("g")
            .attr("transform", "translate(" + (trueWidth / 2 + margin.left) + "," + (pieRad + margin.top) + ")");

        // create subgroups for labels eventually

        const arc = d3.arc()
            .innerRadius(pieRad * 0.8 - pieThick * 0.8)
            .outerRadius(pieRad * 0.8)

        const outerArc = d3.arc()
            .innerRadius(pieRad * 0.9)
            .outerRadius(pieRad * 0.9);

        if (inputIsPercentage){
            var labelset = percentages;
            var tooltipAppend = "%";
        }
        else{
            var labelset = values;
            var tooltipAppend = "";
        }

        g.selectAll(".sota-pieChart-slice")
            .data(pieData)
            .join("path")
            .attr("class", (d, i) => "sota-pieChart-slice module-fill-" + (i + 1))
            .attr("d", arc)
            .attr("stroke", "#fff")
            .style("stroke-width", separatorStrokeWidth)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", hoverOpacity);
                tooltip.style("opacity", 1.0)
                    .html(labels[i] + ": " + labelset[i] + tooltipAppend)
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
        
        // following code, especially calculations part, taken more or less directly from https://www.d3-graph-gallery.com/graph/donut_label.html

        g.selectAll(".sota-pieChart-polyline")
            .data(pieData)
            .join("polyline")
            .attr("class","sota-pieChart-polyline")
            .attr("stroke", polylineColor)
            .style("fill", "none")
            .attr("stroke-width", polylineStrokeWidth)
            .attr("points", d => {
                let posA = arc.centroid(d);
                let posB = outerArc.centroid(d);
                let posC = outerArc.centroid(d);
                let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                posC[0] = pieRad * 0.95 * (midangle < Math.PI ? 1: -1);
                return [posA, posB, posC];
            })

        g.selectAll(".sota-pieChart-label")
            .data(pieData)
            .join("text")
            .attr("class","sota-pieChart-label sota-floatingLabel")
            .text((d, i) => labels[i] + ": " + percentages[i] + "%")
            .attr("alignment-baseline", "central")
            .attr("transform", d => {
                let pos = outerArc.centroid(d);
                let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = pieRad * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style("text-anchor", d => {
                let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })

    });
}