define(['barChart','masonry'], function(barChart, masonry){

    // D3/sota.js

    var selector = "#module-general-ethnicity-d3";
    var dataFile = "ethnicity";
    barChart({ selector: selector, dataFile: dataFile, totalResp: 1052, maxVal: "maxVal" });

    // MASONRY LAYOUT

    var elem = document.querySelector('.container');
    var msnry = new masonry(elem, {
        itemSelector: '.module',
        columnWidth: '.module'
    });
});