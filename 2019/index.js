define(['barChart','pieChart','masonry'], function(barChart, pieChart, masonry){

    // D3/sota.js

    barChart({ selector: "#module-general-ethnicity-d3", dataFile: "ethnicity", totalResp: 1052, maxVal: "maxVal" });
    pieChart({ selector: "#module-general-community-d3", datafile: "community"});

    // MASONRY LAYOUT

    setTimeout(function(){
        var elem = document.querySelector('.container');
        var msnry = new masonry(elem, {
            itemSelector: '.module',
            columnWidth: '.module'
        });
    }, 200);
});