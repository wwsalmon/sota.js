define(['barChart','pieChart','lineGraph','masonry'], function(barChart, pieChart,lineGraph, masonry){

    // D3/sota.js

    barChart({ selector: "#module-general-ethnicity-d3", dataFile: "ethnicity", totalResp: 1052, maxVal: "maxVal", displayPercentage: false });

    pieChart({ selector: "#module-general-community-d3", dataFile: "community"});

    lineGraph({ selector: "#module-discipline-time-d3", dataFile: "disc-time", inputIsPercentage: true, maxVal: 8 })

    // MASONRY LAYOUT

    setTimeout(function(){
        var containers = document.querySelectorAll(".container");

        for (i = 0; i < containers.length; i++){
            new masonry(containers[i], {
                itemSelector: ".module",
                columnWidth: ".module"
            });
        }

    }, 200);
});