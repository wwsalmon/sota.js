define(['barchart','masonry'], function(szBarChart, masonry){

    // D3/sota.js

    var selector = "#module-general-ethnicity-d3";
    var dataFile = "ethnicity";
    szBarChart({ selector: selector, dataFile: dataFile, totalResp: 1052, maxVal: "maxVal" });

    // MASONRY LAYOUT

    console.log(masonry);

    var elem = document.querySelector('.container');
    var msnry = new masonry(elem, {
        itemSelector: '.module',
        columnWidth: '.module'
    });
});

// Highcharts

// var chart = Highcharts.chart('module-general-ethnicity', {
//     title: {
//         text: 'What is your ethnicity?'
//     },
//     xAxis: {
//         categories: ['African', 'African American', 'Asian American', 'East Asian', 'Ethnically Jewish', 'Hispanic', 'Latinx', 'Middle Eastern', 'Native American', 'Pacific Islander', 'South Asian', 'Southeast Asian', 'West Indian/Caribbean', 'White', 'White Hispanic', 'Other']
//     },
//     yAxis: {
//         min: 0,
//         title: {
//             text: 'Responses',
//             verticalAlign: 'center'
//         },
//         labels: {
//             overflow: 'justify'
//         }
//     },
//     legend: {
//         enabled: false
//     },
//     tooltip: {
//         formatter: function () {
//             return '<b>' + this.x + '</b><br>' +
//                 this.series.name + ': <b>' + this.y + '</b><br>' + 'Percentage: <b>' + (this.y / 10.50).toFixed(1) + '%</b>';
//         }
//     },
//     series: [{
//         data: [25, 67, 202, 143, 58, 53, 56, 33, 14, 6, 53, 54, 20, 552, 34, 12],
//         type: 'bar',
//         dataLabels: {
//             enabled: false
//         },
//         name: 'Responses'
//     }]
// });