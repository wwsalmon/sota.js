export default function(thisModule){
    const chartRendered = new Event("sotaChartRendered");
    const container = thisModule.closest(".sota-section-inner");
    if (container !== null) container.dispatchEvent(chartRendered);
}