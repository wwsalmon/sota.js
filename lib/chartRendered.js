export default function(thisModule){
    const chartRendered = new Event("sotaChartRendered");
    thisModule.closest(".sota-section-inner").dispatchEvent(chartRendered);
}