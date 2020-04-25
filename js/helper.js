define(function(){
    var helper = [];

    helper.oneDecimal = function (number) {
        return Math.round(number * 10) / 10;
    }

    return helper;
})