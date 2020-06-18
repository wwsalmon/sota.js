sota.sotaConfig.sections = [
    {"slug": "sotajs", "name": "sota.js", "colors": sota.colorInterpolate("#222222")},
    {"slug": "politics", "name": "Politics & Worldview", "blurb": "test blurb", "colors": sota.colorInterpolate("#660066", "#dac7d8", 5, true)},
    {"slug": "wellness", "name": "Health & Wellness", "colors": sota.colorInterpolate("#6cb643", "#cae3cb", 5, true)},
    // {"slug": "sex", "name": "Sex", "colors": sota.colorInterpolate("#c6307c", "#f0d3dc", 5, true)},
    // {"slug": "drugs", "name": "Drugs & Alcohol", "colors": sota.colorInterpolate("#e77929", "#fbe3c4", 5, true)},
    {"slug": "discipline", "name": "Discipline", "colors": sota.colorInterpolate("#b43432", "#f0d1ca", 5, true)}
]
sota.sotaConfig.numberFont = "DM Sans";
sota.sotaConfig.labelFont = "Crimson Text";
sota.setColors(sota.sotaConfig);
sota.setStyles(sota.sotaConfig); // for custom sotaConfig; for default options, don't pass any params
sota.createSections(sota.sotaConfig);
sota.sotaNavbar(sota.sotaConfig, "sota.js Demo", "szlogo.png", false, "https://www.samsonzhang.com/");

window.onload = () => {

    sota.barChart({
        title: "What does a graph look like?",
        subtitle: "Here's a bar chart",
        section: "sotajs",
        dataFile: "data/ethnicity",
        totalResp: 1052,
        maxVal: true,
        displayPercentage: true
    });

    sota.multiLineGraph({section: "sotajs", title: "Multilinegraph", dataFile: "data/gpaXincome"});

    sota.barChart({
        selector: "#module-general-ethnicity-d3",
        dataFile: "data/ethnicity",
        totalResp: 1052,
        maxVal: true,
        displayPercentage: true
    });

    sota.pieChart({ section: "sotajs", title: "What type of community do you currently live in?", dataFile: "data/community"});

    sota.lineGraph({ section: "discipline", title: "Discipline over time", subtitle: "Percentage of respondents who have sat before a D.C.", dataFile: "data/disc-time", inputIsPercentage: true, maxVal: 8 });

    sota.stackedBarChart({ section: "discipline", title: "Room Visitations", subtitle: "Do you support a change in room visit rules?", dataFile: "data/room-visit-policy", groupLabelStyle: "onBar" });

    sota.stackedBarChart({ section: "sotajs", title: "How many of your parents graduated from college?", dataFile: "data/parents-college", labelStyle: "aboveBar", showLegend: false });

    sota.customColumnChart({ section: "wellness", title: "Happiness on Campus", subtitle: "In general, do you think that Andover students are happy?", dataFile: "data/happiness", shapeFile: "cloud", shapeHeight:100 });

    sota.columnChart({ section: "wellness", title: "What is your mental and/or emotional support system on campus? Select all that apply", dataFile: "data/support", totalResp: 1052});

    sota.bigNumber({ section: "discipline", title: "Plagiarism", number: "10.8%", subtitle: "of students have plagiarized while at Andover"});

    sota.groupedBarChart({ section: "wellness", title: "Social Media Platforms", dataFile: "data/wellness-social-media", totalResp: {2022:214,2021:275,2020:271,2019:286} });

    sota.stackedColumnChart({ section: "politics", title: "Reverse Racism Percentage by Gender", subtitle: "Do you believe that reverse racism exists?", dataFile: "data/reverse-racism-gender", totalResp: 1032 });

    sota.sotaMasonry();
}