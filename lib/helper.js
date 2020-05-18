import * as d3 from "d3";

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