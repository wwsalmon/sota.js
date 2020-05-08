import barChart from "./components/barChart.js";
import pieChart from "./components/pieChart.js";
import lineGraph from "./components/lineGraph.js";
import stackedBarChart from "./components/stackedBarChart.js";
import customBarChart from "./components/customBarChart.js";
import columnChart from "./components/columnChart.js";
import groupedBarChart from "./components/groupedBarChart.js";
import stackedColumnChart from "./components/stackedColumnChart.js";

let sota = {};

sota.barChart = barChart;
sota.pieChart = pieChart;
sota.lineGraph = lineGraph;
sota.stackedBarChart = stackedBarChart;
sota.customBarChart = customBarChart;
sota.columnChart = columnChart;
sota.groupedBarChart = groupedBarChart;
sota.stackedColumnChart = stackedColumnChart;

export default sota;

/*
TO COPY PASTE WHEN IMPORTING NEW COMPONENTS

import boilerplate from "./components/boilerplate.js";
sota.boilerplate = boilerplate;
*/
