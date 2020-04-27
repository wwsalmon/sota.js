import sota from '../js/sota.js';
import '../js/d3.v5.min.js';

// D3/sota.js

sota.barChart({ selector: "#module-general-ethnicity-d3", dataFile: "ethnicity", totalResp: 1052, maxVal: "maxVal", displayPercentage: false });

sota.pieChart({ selector: "#module-general-community-d3", dataFile: "community"});

sota.lineGraph({ selector: "#module-discipline-time-d3", dataFile: "disc-time", inputIsPercentage: true, maxVal: 8 })

sota.stackedBarChart({ selector: "#module-discipline-room-visits", dataFile: "room-visit-policy", inputIsPercentage: false })