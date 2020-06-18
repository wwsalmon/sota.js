import colorInterpolate from "./colorInterpolate.js";

export default {
    numberFont: "Montserrat",
    labelFont: "Lora",
    sections: [
        {slug: "default", name: "Default", colors: colorInterpolate("#000000")}
    ],
    separatorStrokeWidth: 1,
    barHeight: 32,
    barMargin: 16,
    labelLeft: 6,
    labelBelow: 8,
    groupLabelMargin: 32,
    legendMargin: 24,
    xAxisTop: 24,
    overflowOffset: 24,
    lineColor: "#777777",
    labelColor: "#777777",
    mainHeight: 300,
    tickSize: 4,
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
