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

export let sotaConfig = {
    separatorStrokeWidth: 2,
    barHeight: 32,
    barMargin: 16,
    labelLeft: 6,
    groupLabelMargin: 24
}