import * as d3 from "d3";

export default function(data, inputIsPercentage, totalResp = null){
    totalResp = (totalResp == null) ? d3.sum(data, d => +d.value) : totalResp;
    const percentages = (inputIsPercentage) ? data.map(d => +d.value) : data.map(d => +d.value / totalResp * 100);
    const values = (inputIsPercentage) ? false : data.map(d => +d.value);
    const labels = data.map(d => d.label);
    return [percentages, values, labels];
}