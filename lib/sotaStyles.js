import sotaConfig from "./sotaConfig.js";

/**
 * Function to inject inline styling for sota charts, navbar, layout, etc.
 * @param sotaConfig - sotaConfig object
 */
function setStyles(sotaConfig = sotaConfig){
    const mainWidth = 1500;
    const moduleMargin = 48;
    const numberFont = sotaConfig.numberFont;
    const labelFont = sotaConfig.labelFont;
    const axisStrokeWidth = sotaConfig.separatorStrokeWidth;
    const axisStrokeColor = sotaConfig.lineColor;
    const axisTextMargin = 4;
    let styleSheet = `
.sota-section {
	padding: 48px 0;
	width: 100%
}

.sota-section > p{
  color: #fff;
  font-family: ${labelFont};
  line-height: 1.5;
  max-width: 800px;
  margin: 64px auto;
  padding: 0 24px;
}

.sota-section h1 {
	font-size: 56px;
	font-family: ${numberFont}, sans-serif;
	text-transform: uppercase;
	font-weight: 700;
	text-align: center;
	color: #fff
}

.sota-section-inner {
    position: relative;
	max-width: ${mainWidth}px;
	box-sizing: border-box;
	font-family: "Montserrat", Arial, sans-serif;
	width: 100%;
	padding: 48px 24px;
	margin: 0 auto;
	background-color: #fff;
	grid-template-columns: minmax(0, 1fr)
}

.sota-section-inner:before{
    pointer-events: none;
    content: "";
    position: absolute;
    left: 0;
    top: 32px;
    display: none;
    height: calc(100% - 64px);
}

.sota-section-inner:after{
    content: "";
    clear: both;
    display: table;    
}

.sota-section .sota-module {
	position: absolute;
	float: left;
	width: calc(100% - 48px);
	border-bottom: 1px solid rgba(0,0,0,0.2);
	padding-bottom: 32px;
	margin-bottom: 32px;
}

@media (min-width: 800px) {
    .sota-section-inner:before{
      width: 50%;
      display: block;
        border-right: 1px solid rgba(0,0,0,0.1);
    }
    
    .sota-section .sota-module {
        width: calc(50% - ${24 + moduleMargin / 2}px);
    }
}

@media (min-width: 1200px) {    
    .sota-section .sota-module {
        width: calc(33% - ${16 + 2 * moduleMargin / 3}px);
    }

    .sota-section-inner:before{
        width: calc(33.3% - 6px);
        left: calc(33.3% - 6px);
        border-left: 1px solid rgba(0,0,0,0.1);
    }
}

.sota-module>svg {
	width: 100%
}

.sota-module h3 {
	font-family: ${numberFont}, sans-serif;
	font-weight: 700;
	text-transform: uppercase;
	line-height: 1.1;
}

.sota-module p, ul, ol{
    font-size: 20px;
    line-height: 1.4;
    font-family: ${labelFont};
}

.sota-module hr{
    opacity: 0.5;
    margin: 48px 0;
}

.sota-module img{
    max-width: 100%;
    margin: 32px 0;
}

.sota-module .sota-subtitle {
	font-family: ${labelFont}, serif;
	opacity: 0.4;
	line-height: 1.1;
}

.sota-heavy-label{
    font-weight: 700;
}

.sota-num-label, .sota-num-axis .tick text{
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    fill: ${sotaConfig.labelColor};
}

.sota-text-label, .sota-text-axis .tick text{
    font-family: ${labelFont}, serif;
    fill: black;
}

.sota-num-label.sota-stackedBarChart-label-onBar{
    fill: rgba(255,255,255,0.6);
}

.sota-tooltip {
	background-color: #222;
	color: #fff;
	padding: 12px;
	position: absolute;
	pointer-events: none;
	opacity: 0;
	transform: translate(-50%, -100%);
	white-space: nowrap
}

.sota-gen-axis{
    opacity: 0.4;
}

.sota-gen-axis.sota-gen-xAxis .tick text {
	transform: translateY(${axisTextMargin}px);
}

.sota-gen-axis.sota-gen-yAxis .tick text {
	transform: translateX(${-axisTextMargin - 4}px);
	text-anchor: end
}

.sota-gen-xAxis:not(.sota-text-axis) g.tick:first-of-type text:not(.angled-label){
    text-anchor: start;
}

.sota-gen-xAxis:not(.sota-text-axis) g.tick:last-of-type text:not(.angled-label){
    text-anchor: end;
}

.sota-gen-axis .tick line,
.sota-gen-axis path.domain {
	stroke-width: ${axisStrokeWidth}px;
	stroke: ${axisStrokeColor};
}

.sota-groupedBarChart-xAxis .tick line {
	opacity: 0.2
}

.sota-big {
	font-weight: 700;
	font-size: 96px;
	line-height: 1.0;
	margin-top: -8px;
	font-family: ${labelFont}, serif
}

.sota-section-inner.hide .module{
    border-bottom: none;
}

.sota-section-inner.hide .module > *{
    visibility: hidden;
}

.sota-section-inner:not(.hide) .loading{
    display: none;
}

#sota-navbar ~ .sota-section:before{
    content: "";
    z-index: 4;
    position: sticky;
    top: 64px;
    width: 100%;
    height: 8px;
    background-color: inherit;
    display: block;
}

#sota-navbar{
    color: #fff;
}

#sota-navbar .sz-navbar-item a, #sota-navbar .sz-navbar-item span{
    font-family: ${numberFont};
    line-height: 64px;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    color: #fff;
    height: 64px;
    padding: 0 8px;
    display: block;
}

#sota-navbar .sota-navbar-logo, #sota-navbar .sota-navbar-logo a{
    height: 100%;
    display: flex;
    align-items: center;
}

#sota-navbar .sota-navbar-logo img{
    height: 50%;
}

@media (max-width: 1400px){
    #sota-navbar .sz-navbar-items{
        background-color: #000;
        z-index: 4;
        height: 100vh;
        box-sizing: border-box;
        justify-content: flex-start;
    }

    #sota-navbar div.sz-navbar-item{
        width: 100%;
        margin-bottom: 0;
    }
    
    #sota-navbar .sz-navbar-inner > .sota-navbar-text{
        display: none;
    }
}

@media (min-width: 1400px){
    #sota-navbar .sz-navbar-items{
        margin-left: auto;
    }

    #sota-navbar .sz-navbar-item.sota-navbar-text{
        display: none;
    }
    
    #sota-navbar .sota-navbar-logo{
        margin-right: 24px;
    }
}

#sota-navbar .sota-navbar-text span{
    font-family: ${labelFont};
    font-weight: 700;
}

    `;

    document.head.appendChild(document.createElement('style')).textContent = styleSheet;
    console.log("styles set");
}

/**
 * Function to set colors for sota charts, layout, navbar, etc.
 * @param sotaConfig - sotaConfig object
 */
function setColors(sotaConfig){
    let colorStyle = "";

    for (const section of sotaConfig.sections){
        const sectionSlug = section.slug;
        colorStyle += `
        #sota-section-${sectionSlug}{
            background-color: ${section.colors[0]};
            color: ${section.colors[0]};
        }
        #sota-section-${sectionSlug} .sota-gen-bar, .sota-section-${sectionSlug} .sota-gen-bar{
            fill: ${section.colors[3]};
        }      
        #sota-navbar #sota-navbar-item-${sectionSlug}:hover, #sota-navbar #sota-navbar-item-${sectionSlug}.selected{
            background-color: ${section.colors[0]};            
        }
        @media (max-width: 1400px){
            #sota-navbar #sota-navbar-item-${sectionSlug}{
                background-color: ${section.colors[0]};            
            }        
        }
        `

        for (const i in section.colors){
            colorStyle+= `
        #sota-section-${sectionSlug} .sota-fill-${+i+1}, .sota-section-${sectionSlug} .sota-fill-${+i+1}{
            fill: ${section.colors[i]};
        }
        #sota-section-${sectionSlug} .sota-stroke-${+i+1}, .sota-section-${sectionSlug} .sota-stroke-${+i+1}{
            stroke: ${section.colors[i]};
        }
        `
        }
    }

    document.head.appendChild(document.createElement('style')).textContent = colorStyle;
}


/**
 * Function that generates an array of hex codes interpolating between start and end hex codes
 * @param {string} start - 6-digit hex code for starting color, including "#" at beginning
 * @param {string} [end=#ffffff] - 6-digit hex code for ending color, including "#" at beginning
 * @param {number} [steps=8] - Number of steps, equal to the length of the returned array
 * @param {boolean} [includeLast=false] - Whether or not to include the given end value in the final array
 */
function colorInterpolate(start,end="#ffffff",steps=8, includeLast=false){

    const startHex = start.substr(1);
    const startR = parseInt("0x" + startHex.substr(0,2));
    const startG = parseInt("0x" + startHex.substr(2,2));
    const startB = parseInt("0x" + startHex.substr(4,2));

    const endHex = end.substr(1);
    const endR = parseInt("0x" + endHex.substr(0,2));
    const endG = parseInt("0x" + endHex.substr(2,2));
    const endB = parseInt("0x" + endHex.substr(4,2));

    const diffR = endR - startR;
    const diffG = endG - startG;
    const diffB = endB - startB;

    const calcSteps = includeLast ? steps : steps + 1;

    const incR = diffR / calcSteps;
    const incG = diffG / calcSteps;
    const incB = diffB / calcSteps;

    let colorsArray = [start];

    for (let i = 1; i < steps - 1; i++){
        const newR = startR + incR * i;
        const newG = startG + incG * i;
        const newB = startB + incB * i;

        const newHexString = "#" + Math.round(newR).toString(16) + Math.round(newG).toString(16) + Math.round(newB).toString(16);

        colorsArray.push(newHexString);
    }

    let lastColor;

    if (includeLast){
        lastColor = end;
    } else{
        const newR = startR + incR * steps;
        const newG = startG + incG * steps;
        const newB = startB + incB * steps;
        lastColor = "#" + Math.round(newR).toString(16) + Math.round(newG).toString(16) + Math.round(newB).toString(16);
    }

    colorsArray.push(lastColor);

    return colorsArray;
}

export {setStyles, setColors, colorInterpolate};