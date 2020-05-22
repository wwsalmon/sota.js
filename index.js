import barChart from "./components/barChart.js";
import pieChart from "./components/pieChart.js";
import lineGraph from "./components/lineGraph.js";
import stackedBarChart from "./components/stackedBarChart.js";
import customBarChart from "./components/customBarChart.js";
import columnChart from "./components/columnChart.js";
import groupedBarChart from "./components/groupedBarChart.js";
import stackedColumnChart from "./components/stackedColumnChart.js";
import setColors from "./lib/setColors.js";
import setStyles from "./lib/setStyles.js";
import sotaConfig from "./lib/sotaConfig.js";

let sota = {};

sota.barChart = barChart;
sota.pieChart = pieChart;
sota.lineGraph = lineGraph;
sota.stackedBarChart = stackedBarChart;
sota.customBarChart = customBarChart;
sota.columnChart = columnChart;
sota.groupedBarChart = groupedBarChart;
sota.stackedColumnChart = stackedColumnChart;
sota.setColors = setColors;
sota.setStyles = setStyles;
sota.sotaConfig = sotaConfig;

sota.setParam = function(prop, value){
    this.sotaConfig[prop] = value;
}

sota.getParam = function(prop){
    return this.sotaConfig[prop];
}

export default sota;