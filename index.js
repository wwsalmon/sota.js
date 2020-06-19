// required for graphs to look okay -- specify at minimum a slug and array of colors
sota.sotaConfig.sections = [
    {"slug": "sotajs", "name": "sota.js", "colors": sota.colorInterpolate("#222222")},
    {"slug": "politics", "name": "Politics & Worldview", "blurb": "test blurb", "colors": sota.colorInterpolate("#660066", "#dac7d8", 5, true)},
    {"slug": "wellness", "name": "Health & Wellness", "colors": sota.colorInterpolate("#6cb643", "#cae3cb", 5, true)},
    {"slug": "discipline", "name": "Discipline", "colors": sota.colorInterpolate("#b43432", "#f0d1ca", 5, true)}
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

    sota.barChart({title: "What does a graph look like?", subtitle: "Here's a bar chart", section: "sotajs",
        dataFile: "data/ethnicity", totalResp: 1052, maxVal: true, displayPercentage: true});

    sota.multiLineGraph({section: "sotajs", title: "Multilinegraph", dataFile: "data/gpaXincome", maxVal: 30});

    sota.barChart({selector: "#module-general-ethnicity-d3", dataFile: "data/ethnicity", totalResp: 1052, maxVal: true,
        displayPercentage: true});

    sota.pieChart({ section: "sotajs", title: "What type of community do you currently live in?",
        dataFile: "data/community"});

    sota.lineGraph({ section: "discipline", title: "Discipline over time",
        subtitle: "Percentage of respondents who have sat before a D.C.", dataFile: "data/disc-time",
        inputIsPercentage: true, maxVal: 8 });

    sota.stackedBarChart({ section: "discipline", title: "Room Visitations",
        subtitle: "Do you support a change in room visit rules?", dataFile: "data/room-visit-policy",
        groupLabelStyle: "onBar" });

    sota.stackedBarChart({ section: "sotajs", title: "How many of your parents graduated from college?",
        dataFile: "data/parents-college", labelStyle: "aboveBar", showLegend: false });

    sota.customColumnChart({ section: "wellness", title: "Happiness on Campus",
        subtitle: "In general, do you think that Andover students are happy?", dataFile: "data/happiness",
        shapeFile: "shapes/cloud", shapeHeight:100 });

    sota.columnChart({ section: "wellness",
        title: "What is your mental and/or emotional support system on campus? Select all that apply",
        dataFile: "data/support", totalResp: 1052});

    sota.bigNumber({ section: "discipline", title: "Plagiarism", number: "10.8%",
        subtitle: "of students have plagiarized while at Andover"});

    sota.groupedBarChart({ section: "wellness", title: "Social Media Platforms",
        dataFile: "data/wellness-social-media", totalResp: {2022:214,2021:275,2020:271,2019:286} });

    sota.stackedColumnChart({ section: "politics", title: "Reverse Racism Percentage by Gender",
        subtitle: "Do you believe that reverse racism exists?", dataFile: "data/reverse-racism-gender",
        totalResp: 1032 });

    // after everything has loaded, use Masonry to fix up layout
    sota.sotaMasonry();
}