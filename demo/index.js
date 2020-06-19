// required for graphs to look okay -- specify at minimum a slug and array of colors
sota.sotaConfig.sections = [
    {"slug": "sotajs", "name": "sota.js", "colors": sota.colorInterpolate("#000000")},
    {"slug": "charts", "name": "Chart Gallery", "blurb": "Gallery of all the charts you can make with sota.js",
        "colors": sota.colorInterpolate("#2B193D", "#ffffff", 5, true)}
]

// optional styling configuration
sota.sotaConfig.numberFont = "DM Sans"; // optional -- defaults to Montserrat
sota.sotaConfig.labelFont = "Crimson Text"; // optional -- defaults to Lora

// required for graphs to look okay -- call functions to inject color, style CSS based on sotaConfig
sota.setColors(sota.sotaConfig);
sota.setStyles(sota.sotaConfig);

// required only if you want to generate default layout containers. Can also specify directly through HTML and use selectors for graphs
sota.createSections(sota.sotaConfig);

// optional, render navbar based on sotaConfig.sections
// make sure you call createSections first!
sota.sotaNavbar(sota.sotaConfig, "sota.js Demo", "szlogo.png", false, "https://www.samsonzhang.com/");

// render graphs inside window.onload so they will be able to find parent containers dynamically created above
window.onload = () => {

    sota.barChart({selector: "#graph-demo", dataFile: "data/demo", totalResp: 100});

    sota.pieChart({selector: "#graph-demo-pie", dataFile: "data/community"});

    sota.stackedBarChart({selector: "#graph-demo-stack", dataFile: "data/community-stacked", showLegend: false, labelStyle: "aboveBar"});

    // after everything has loaded, use Masonry to fix up layout
    sota.sotaMasonry();
}