let helper = {};

helper.oneDecimal = function (number) {
    return Math.round(number * 10) / 10;
}

export let sotaConfig = {
    separatorStrokeWidth: 2,
    barHeight: 32,
    barMargin: 16,
    groupLabelMargin: 24
}

export default helper;