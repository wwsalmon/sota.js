define(['barChart','pieChart','masonry'], function(barChart, pieChart, masonry){

    // D3/sota.js

    barChart({ selector: "#module-general-ethnicity-d3", dataFile: "ethnicity", totalResp: 1052, maxVal: "maxVal" });

    margin = {
        "top": 100,
        "bottom": 0,
        "left": 200,
        "right": 100
    }

    pieChart({ selector: "#module-general-community-d3", dataFile: "community", margin: margin});

    // MASONRY LAYOUT

    setTimeout(function(){
        var elem = document.querySelector('.container');
        var msnry = new masonry(elem, {
            itemSelector: '.module',
            columnWidth: '.module'
        });
    }, 200);
});