import helper from '../helper.js';

var pieChart = {};

pieChart.chart = function ({
    selector,
    dataFile,
    inputIsPercentage = false,
    pieRad = 150,
    pieThick = 80,
    separatorStroke = 8,
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

    pieChart.inputIsPercentage = inputIsPercentage;
    pieChart.pieRad = pieRad;
    pieChart.pieThick = pieThick;
    pieChart.separatorStroke = separatorStroke;
    pieChart.margin = margin;

    d3.csv("data/" + dataFile + ".csv").then(data => {
        var hoverOpacity = 0.8;
        var polylineColor = "#999";
        var polylineStrokeWidth = 2;
        var labels = data.map(d => d.label);

        if (!pieChart.inputIsPercentage) {
            var values = data.map(d => d.value);
            var totalResp = values.reduce((a, b) => +a + +b, 0);
            var percentages = values.map(value => helper.oneDecimal(100 * value / totalResp));
        }
        else {
            var percentages = data.map(d => d.value);
        }

        var pie = d3.pie();
        var pieData = pie(percentages);

        // centered g to place chart in

        var g = svg.append("g")
            .attr("transform", "translate(" + (trueWidth / 2 + margin.left) + "," + (pieRad + margin.top) + ")");

        // create subgroups for labels eventually

        var arc = d3.arc()
            .innerRadius(pieChart.pieRad * 0.8 - pieChart.pieThick * 0.8)
            .outerRadius(pieChart.pieRad * 0.8)

        var outerArc = d3.arc()
            .innerRadius(pieChart.pieRad * 0.9)
            .outerRadius(pieChart.pieRad * 0.9);

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
            .style("stroke-width", pieChart.separatorStroke)
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
                var posA = arc.centroid(d);
                var posB = outerArc.centroid(d);
                var posC = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                posC[0] = pieChart.pieRad * 0.95 * (midangle < Math.PI ? 1: -1);
                return [posA, posB, posC];
            })

        g.selectAll(".sota-pieChart-labelText")
            .data(pieData)
            .join("text")
            .attr("class","sota-pieChart-labelText sota-floatingLabel")
            .text((d, i) => labels[i] + ": " + percentages[i] + "%")
            .attr("alignment-baseline", "central")
            .attr("transform", d => {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = pieChart.pieRad * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style("text-anchor", d => {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })

    });
}

export default pieChart.chart;