// required for graphs to look okay -- specify at minimum a slug and array of colors
sota.sotaConfig.sections = [
    {"slug": "sotajs", "name": "sota.js", "colors": sota.colorInterpolate("#000000")},
    {"slug": "charts", "name": "Chart Gallery", "blurb": "Gallery of all the charts you can make with sota.js",
        "colors": sota.colorInterpolate("#2B193D", "#ffffff", 8, true)},
    {"slug": "content", "name": "Content section", "colors": sota.colorInterpolate("#546e8d"), "content": `
        <div class="demo-content">
            <h2>Demo content</h2>
            <p>This is a demo of a content section. Instead of graphs, you can put raw HTML here and format to your heart's content.</p>
        </div>
    `}
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

    sota.stackedBarChart({selector: "#graph-demo-stack", dataFile: "data/community-stacked", showLegend: false,
        labelStyle: "aboveBar"});

    sota.contentModule({section: "charts", title: "Content Module",
        subtitle: "This module was generated using sota.contentModule",
        content: `<p>Demo data from <a href='https://sota.phillipian.net/'>State of the Academy 2020</a>.
        See all code and data files in the <a href="https://github.com/wwsalmon/sota.js">GitHub repo</a>.
        </p>
    `});

    sota.barChart({section: "charts", dataFile: "data/gallery-class", title: "Bar Chart",
        subtitle: "What class are you in?"});

    sota.pieChart({section: "charts", dataFile: "data/community", title: "Pie Chart",
        subtitle: "Distribution of students by home community type"});

    sota.stackedBarChart({section: "charts", dataFile: "data/gallery-stacked", groupLabelStyle: "onBar",
        title: "Stacked Bar Chart", subtitle: "Perceived socioeconomic class by net income"})

    sota.columnChart({section: "charts", dataFile: "data/gallery-column", title: "Column Chart",
        subtitle: "Top 5 news sources", maxVal: 40});

    sota.stackedColumnChart({section: "charts", dataFile: "data/gallery-stackedCol", title: "Stacked Column Chart",
        subtitle: "Do you think attending Andover affects your chances of attending a selective college?"});

    sota.multiLineGraph({section: "charts", dataFile: "data/gallery-multiline", title: "Multi Line Graph",
        subtitle: "GPA x Gender Identity", maxVal: 30});

    sota.lineGraph({section: "charts", dataFile: "data/gallery-line", title: "Line Graph",
        subtitle: "Approval of sex education at Andover over time", inputIsPercentage: true});

    sota.bigNumber({section: "charts", number: "7.1 hours", title: "Big Number", subtitle: "Average amount of sleep"})

    sota.customColumnChart({section: "charts", title: "Custom Column Chart", subtitle: "Icon from FontAwesome",
        dataFile: "data/gallery-customCol", shapeFile: "shapes/atom", shapeHeight: 250})

    sota.customBarChart({section: "charts", title: "Custom Bar Chart", subtitle: "Icon from FontAwesome",
        dataFile: "data/gallery-customBar", shapeFile: "shapes/fish"})

    // after everything has loaded, use Masonry to fix up layout
    sota.sotaMasonry();
}