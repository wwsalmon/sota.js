define(['d3', 'helper'], function (d3, helper) {
    var pieChart = {};

    pieChart.chart = function ({
        selector,
        dataFile,
        inputIsPercentage = false,
        legend = true,
        labels = false,
        pieRad = 180,
        pieThick = 100,
        separatorStroke = 8,
        margin = {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0
        } }) {

        var container = d3.select(selector);
        var containerDOM = document.querySelector(selector);
        var svg = container.append("svg");
        var tooltip = container.append("div")
            .attr("class","tooltip");

        var width = containerDOM.offsetWidth;
        var containerX = containerDOM.getBoundingClientRect().left;
        var containerY = containerDOM.getBoundingClientRect().top;

        var trueWidth = width - margin.left - margin.right;

        if (trueWidth < pieRad * 2) {
            pieRad = trueWidth / 2;
        }

        if (pieThick > pieRad){
            pieThick = 50;
        }

        var height = pieRad * 2 + margin.top + margin.bottom;

        svg.attr("height", height);

        pieChart.inputIsPercentage = inputIsPercentage;
        pieChart.legend = legend;
        pieChart.labels = labels;
        pieChart.pieRad = pieRad;
        pieChart.pieThick = pieThick;
        pieChart.separatorStroke = separatorStroke;
        pieChart.margin = margin;

        d3.csv("data/" + dataFile + ".csv").then(data => {
            if (!pieChart.inputIsPercentage) {
                var values = data.map(d => d.value);
                var totalResp = values.reduce((a, b) => +a + +b, 0);
                var percentages = values.map(value => helper.oneDecimal(100 * value / totalResp));
            }
            else {
                var percentages = data.map(d => d.value);
            }

            // centered g to place chart in

            var g = svg.append("g")
                .attr("transform", "translate(" + (trueWidth / 2 + margin.left) + "," + (pieRad + margin.top) + ")");

            var pie = d3.pie();
            var pieData = pie(percentages);

            g.selectAll("path")
                .data(pieData)
                .join("path")
                .attr("d", d3.arc()
                    .innerRadius(pieChart.pieRad - pieChart.pieThick)
                    .outerRadius(pieChart.pieRad)
                )
                .attr("class", (d, i) => "module-fill-" + (i + 1))
                .attr("stroke", "#fff")
                .style("stroke-width", pieChart.separatorStroke)
                .on("mouseover", (d, i) => {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1.0);
                    tooltip.html(data[i].label)
                        .style("left", (d3.event.pageX - containerX) + "px")
                        .style("top", (d3.event.pageY - containerY + 280) + "px");
                })
                .on("mousemove", d => {
                    tooltip.style("left", (d3.event.pageX - containerX) + "px")
                        .style("top", (d3.event.pageY - containerY + 280) + "px");
                })
                .on("mouseout", d => {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0);
                });

            // percentages always has percentages. Values only defined if !pieChart.inputIsPercentage
        });
    }

    return pieChart.chart;
});