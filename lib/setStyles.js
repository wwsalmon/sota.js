import sotaConfig from "./sotaConfig.js";

export default function(fontsPath, thisSotaConfig = sotaConfig){
    const mainWidth = 1500;
    const moduleMargin = 48;
    const axisStrokeWidth = thisSotaConfig.separatorStrokeWidth;
    const axisStrokeColor = thisSotaConfig.lineColor;
    const axisTextMargin = 4;
    let styleSheet = `
@font-face {
	font-family: "Gotham";
	font-weight: 700;
	src: url("${fontsPath}/Gotham/GothamBold.ttf")
}

@font-face {
	font-family: "Gotham";
	font-weight: 700;
	font-style: italic;
	src: url("${fontsPath}/Gotham/GothamBoldItalic.ttf")
}

@font-face {
	font-family: "Gotham";
	src: url("${fontsPath}/Gotham/GothamBook.ttf")
}

@font-face {
	font-family: "Gotham";
	font-style: italic;
	src: url("${fontsPath}/Gotham/GothamBookItalic.ttf")
}

@font-face {
	font-family: "Gotham";
	font-weight: 300;
	src: url("${fontsPath}/Gotham/GothamLight.ttf")
}

@font-face {
	font-family: "Gotham";
	font-weight: 300;
	font-style: italic;
	src: url("${fontsPath}/Gotham/GothamLightItalic.ttf")
}

@font-face {
	font-family: 'Mercury Text G1';
	src: url("${fontsPath}/Mercury/MercuryTextG1-Roman.otf");
	font-weight: normal;
	font-style: normal
}

@font-face {
	font-family: 'Mercury Text G1';
	src: url("${fontsPath}/Mercury/MercuryTextG1-Italic.otf");
	font-weight: normal;
	font-style: italic
}

@font-face {
	font-family: 'Mercury Text G1';
	src: url("${fontsPath}/Mercury/MercuryTextG1-Bold.otf");
	font-weight: bold;
	font-style: normal
}

@font-face {
	font-family: 'Mercury Text G1';
	src: url("${fontsPath}/Mercury/MercuryTextG1-BoldItalic.otf");
	font-weight: bold;
	font-style: italic
}

@font-face {
	font-family: 'Mercury Text G1';
	src: url("${fontsPath}/Mercury/MercuryTextG1-Semibold.otf");
	font-weight: 600;
	font-style: normal
}

@font-face {
	font-family: 'Mercury Text G1';
	src: url("${fontsPath}/Mercury/MercuryTextG1-SemiboldItalic.otf");
	font-weight: 600;
	font-style: italic
}

body{
    margin: 0;
}

section {
	padding: 48px 0;
	width: 100%
}

h1 {
	font-size: 56px;
	font-family: 'Gotham', sans-serif;
	text-transform: uppercase;
	font-weight: 700;
	text-align: center;
	color: #fff
}

.container {
    position: relative;
	max-width: ${mainWidth}px;
	box-sizing: border-box;
	font-family: "Gotham", Arial, sans-serif;
	width: 100%;
	padding: 48px 24px;
	margin: 0 auto;
	background-color: #fff;
	grid-template-columns: minmax(0, 1fr)
}

.container:before{
    pointer-events: none;
    content: "";
    position: absolute;
    left: 0;
    top: 32px;
    display: none;
    height: calc(100% - 64px);
}

.container:after{
    content: "";
    clear: both;
    display: table;    
}

.module {
	position: absolute;
	float: left;
	width: calc(100% - 48px);
	border-bottom: 1px solid rgba(0,0,0,0.2);
	padding-bottom: 32px;
	margin-bottom: 32px;
}

@media (min-width: 800px) {
    .container:before{
      width: 50%;
      display: block;
        border-right: 1px solid rgba(0,0,0,0.1);
    }
    
    .module {
        width: calc(50% - ${24 + moduleMargin / 2}px);
    }
}

@media (min-width: 1200px) {    
    .module {
        width: calc(33% - ${16 + 2 * moduleMargin / 3}px);
    }

    .container:before{
        width: 33.3%;
        left: 33.3%;
        border-left: 1px solid rgba(0,0,0,0.1);
    }
}

.module>svg {
	width: 100%
}

.module h3 {
	font-family: 'Gotham', sans-serif;
	font-weight: 700;
	text-transform: uppercase;
	line-height: 1.1;
}

.module p{
    line-height: 1.4;
}

.module .subtitle {
	font-family: "Mercury Text G1", serif;
	opacity: 0.4;
	line-height: 1.1;
}

text{
    fill: red;
}

.sota-heavy-label{
    font-weight: 700;
}

.sota-num-label, .sota-num-axis .tick text{
    font-family: "Gotham", sans-serif;
    font-size: 14px;
    fill: ${sotaConfig.labelColor};
}

.sota-text-label, .sota-text-axis .tick text{
    font-family: "Mercury Text G1", serif;
    fill: black;
}

.sota-num-label.sota-stackedBarChart-label-onBar{
    fill: rgba(255,255,255,0.6);
}

.tooltip {
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
	font-family: "Mercury Text G1", serif
}
    `;

    document.head.appendChild(document.createElement('style')).textContent = styleSheet;
    console.log("styles set");
}
