// D3.JS

var svg = d3.select("#module-general-ethnicity-d3").append("svg");

var width = 400;

d3.csv("data/ethnicity.csv").then(data => {

    var percentages = data.map(d => d.percentage);

    var margin = {
        "top": 0,
        "bottom": 40,
        "left": 20
    }

    var barheight = 24;
    var barmargin = 8;
    var barspace = barheight + barmargin;
    var xScale = d3.scaleLinear()
        .domain([0,Math.max(...percentages)])
        .range([0,width]);

    var height = data.length * barspace + margin.bottom;

    svg.attr("width", width + margin.left)
        .attr("height", height + margin.top + margin.bottom);

    function yPos(index){
        return index * barspace;
    }

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", d => xScale(d.percentage))
        .attr("height", barheight)
        .attr("x", margin.left)
        .attr("y", (d, i) => yPos(i));
});

// HIGHCHARTS

var chart = Highcharts.chart('module-general-ethnicity', {
    title: {
        text: 'What is your ethnicity?'
    },
    xAxis: {
        categories: ['African', 'African American', 'Asian American', 'East Asian', 'Ethnically Jewish', 'Hispanic', 'Latinx', 'Middle Eastern', 'Native American', 'Pacific Islander', 'South Asian', 'Southeast Asian', 'West Indian/Caribbean', 'White', 'White Hispanic', 'Other']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Responses',
            verticalAlign: 'center'
        },
        labels: {
            overflow: 'justify'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.x + '</b><br>' +
                this.series.name + ': <b>' + this.y + '</b><br>' + 'Percentage: <b>' + (this.y / 10.50).toFixed(1) + '%</b>';
        }
    },
    series: [{
        data: [25, 67, 202, 143, 58, 53, 56, 33, 14, 6, 53, 54, 20, 552, 34, 12],
        type: 'bar',
        dataLabels: {
            enabled: false
        },
        name: 'Responses'
    }]
});