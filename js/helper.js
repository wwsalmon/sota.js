export function hideIfOOB(elems,marginLeft){
    for (let item of elems._groups){
        if (Array.isArray(item)){
            for (let subitem of item) {
                hideIfOOBHelper(subitem, marginLeft);
            }
        }
        else{
            hideIfOOBHelper(item, marginLeft);
        }
    }
}

function hideIfOOBHelper(item,marginLeft){
    if (item.getBBox().x < marginLeft){
        item.style.display = "none";
    }
}

export function toPercentage(i){
    return d3.format(".1f")(i) + "%";
}

export let sotaConfig = {
    separatorStrokeWidth: 2,
    barHeight: 32,
    barMargin: 16,
    labelLeft: 6,
    labelBelow: 8,
    groupLabelMargin: 32,
    xAxisTop: 24,
    overflowOffset: 24,
    lineColor: "#999999",
    mainHeight: 300,
    tickSize: 8,
    labelAngle: 30,
    groupedBarChart: {
        barHeight: 24,
        barMargin: 8
    },
    margin: {
        top: 20,
        bottom: 20,
        left: 0,
        right: 0
    },
    swatch: {
        between: 12,
        belowBetween: 8,
        right: 24,
        width: 32,
        height: 24,
        below: 16
    }
}