export default function(thisModule){
    const chartRendered = new Event("sotaChartRendered");
    thisModule.closest(".container").dispatchEvent(chartRendered);
}