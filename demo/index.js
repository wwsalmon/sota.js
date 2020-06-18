sota.sotaConfig.sections = [
    {"slug": "sotajs", "name": "sota.js", "colors": sota.colorInterpolate("#222222")},
    {"slug": "politics", "name": "Politics & Worldview", "colors": sota.colorInterpolate("#660066", "#dac7d8", 5, true)},
    {"slug": "wellness", "name": "Health & Wellness", "colors": sota.colorInterpolate("#6cb643", "#cae3cb", 5, true)},
    // {"slug": "sex", "name": "Sex", "colors": sota.colorInterpolate("#c6307c", "#f0d3dc", 5, true)},
    // {"slug": "drugs", "name": "Drugs & Alcohol", "colors": sota.colorInterpolate("#e77929", "#fbe3c4", 5, true)},
    {"slug": "discipline", "name": "Discipline", "colors": sota.colorInterpolate("#b43432", "#f0d1ca", 5, true)}
]
sota.sotaConfig.numberFont = "DM Sans";
sota.sotaConfig.labelFont = "Crimson Text";
sota.setColors(sota.sotaConfig);
sota.setStyles(sota.sotaConfig); // for custom sotaConfig; for default options, don't pass any params
sota.sotaNavbar(sota.sotaConfig, "sota.js Demo", "szlogo.png", false, "https://www.samsonzhang.com/");

window.onload = () => {

    // sota.createSections(sota.sotaConfig);
    //
    // sota.barChart({
    //     title: "What does a graph look like?",
    //     subtitle: "Here's a bar chart",
    //     section: "sotajs",
    //     dataFile: "data/ethnicity",
    //     totalResp: 1052,
    //     maxVal: true,
    //     displayPercentage: true
    // });

    // sota.multiLineGraph({selector: "#module-general-income-d3", dataFile: "data/gpaXincome"});

    // sota.barChart({
    //     selector: "#demo-ethnicity-d3",
    //     dataFile: "data/ethnicity",
    //     totalResp: 1052,
    //     maxVal: true,
    //     displayPercentage: true
    // });

    sota.barChart({
        selector: "#module-general-ethnicity-d3",
        dataFile: "data/ethnicity",
        totalResp: 1052,
        maxVal: true,
        displayPercentage: true
    });

    // sota.pieChart({ selector: "#module-general-community-d3", dataFile: "data/community"});

    sota.lineGraph({ selector: "#module-discipline-time-d3", dataFile: "data/disc-time", inputIsPercentage: true, maxVal: 8 });

    sota.stackedBarChart({ selector: "#module-discipline-room-visits", dataFile: "data/room-visit-policy", groupLabelStyle: "onBar" });

    // sota.stackedBarChart({ selector: "#module-general-parents-college", dataFile: "data/parents-college", labelStyle: "aboveBar", showLegend: false });

    sota.customColumnChart({ selector: "#wellness-cloud-svg", dataFile: "data/happiness", shapeFile: "cloud", shapeHeight:100 });

    sota.columnChart({ selector: "#wellness-support", dataFile: "data/support", totalResp: 1052});

    sota.groupedBarChart({ selector: "#wellness-social-media", dataFile: "data/wellness-social-media", totalResp: {2022:214,2021:275,2020:271,2019:286} });

    sota.stackedColumnChart({ selector: "#module-politics-reverse-racism-gender", dataFile: "data/reverse-racism-gender", totalResp: 1032 });

    sota.sotaMasonry();
}