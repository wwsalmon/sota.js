define(['d3', 'helper'], function (d3, helper) {
    return function ({
        selector,
        dataFile,
        inputIsPercentage = false,
        displayPercentage = true,
        totalResp = null,
        margin = {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0
        } }) {

        var svg = d3.select(selector).append("svg");

        var width = document.querySelector(selector).offsetWidth;
        var height = width - margin.left - margin.right + margin.top + margin.bottom;

        this.inputIsPercentage = inputIsPercentage;
        this.displayPercentage = displayPercentage;
        this.totalResp = totalResp;
        this.margin = margin;

        d3.csv("data/" + dataFile + ".csv").then(data => {

        });
    }
});