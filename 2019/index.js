let colorsArray = {
    "general": ["#234F84","#0f64a0","#0087bf","#54a5cf","#86c6e3","#b4dbea","#e4f2f7"],
    "politics": ["#660066", "#7a2475", "#935d96", "#a880ac", "#bd98ba", "#dac7d8"],
    "wellness": ["#6cb643", "#99c872", "#b2d593", "#cae3cb"],
    "sex": ["#c6307c", "#d5739d", "#e1aac0", "#f0d3dc"],
    "drugs": ["#e77929", "#efa05e", "#f3b572", "#f6cc99", "#fbe3c4"],
    "discipline": ["#b43432", "#d47173", "#e4a8a6", "#f0d1ca"]
}

sota.setColors(colorsArray);

sota.setStyles("../fonts",sota.sotaConfig); // for custom sotaConfig; for default options, don't pass any params

sota.barChart({ selector: "#module-general-ethnicity-d3", dataFile: "data/ethnicity", totalResp: 1052, maxVal: true, displayPercentage: true });

sota.pieChart({ selector: "#module-general-community-d3", dataFile: "data/community"});

sota.lineGraph({ selector: "#module-discipline-time-d3", dataFile: "data/disc-time", inputIsPercentage: true, maxVal: 8 });

sota.stackedBarChart({ selector: "#module-discipline-room-visits", dataFile: "data/room-visit-policy", groupLabelStyle: "onBar" });

sota.stackedBarChart({ selector: "#module-general-parents-college", dataFile: "data/parents-college", labelStyle: "aboveBar", showLegend: false });

sota.customColumnChart({ selector: "#wellness-cloud-svg", dataFile: "data/happiness", shapeFile: "cloud", shapeHeight:100 });

sota.columnChart({ selector: "#wellness-support", dataFile: "data/support", totalResp: 1052});

sota.groupedBarChart({ selector: "#wellness-social-media", dataFile: "data/wellness-social-media", totalResp: {2022:214,2021:275,2020:271,2019:286} });

<<<<<<< HEAD
sota.stackedColumnChart({ selector: "#module-politics-reverse-racism-gender", dataFile: "data/reverse-racism-gender", totalResp: 1032 })

const sections = document.querySelectorAll(".container");

sections.forEach((e) => {
    const msnry = new Masonry(e, {
        itemSelector: ".module",
        columnWidth: ".module",
        gutter: 48
    })
})
=======
sota.stackedColumnChart({ selector: "#module-politics-reverse-racism-gender", dataFile: "data/reverse-racism-gender", totalResp: 1032});

sota.stackedColumnChart({ selector: "#module-politics-abortionXgender-d3", dataFile: "data/abortionXgender", totalResp: 1015 });
>>>>>>> f08f0da5b258fde98446ae28e564e45e93283b89
