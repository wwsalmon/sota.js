import sotaConfig from "./sotaConfig.js";

export default function(fontsPath, thisSotaConfig = sotaConfig){
    const mainWidth = 1500;
    const moduleMargin = 24;
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

body {
	margin: 0
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
	max-width: ${mainWidth}px;
	box-sizing: border-box;
	font-family: "Gotham", Arial, sans-serif;
	width: 100%;
	padding: 48px 24px;
	margin: 0 auto;
	display: grid;
	column-gap: ${moduleMargin}px;
	background-color: #fff;
	grid-template-columns: minmax(0, 1fr)
}

.container .module-two-wide {
	grid-column: 1/3
}

@media (min-width: 800px) {
	.container {
		grid-template-columns: repeat(2, minmax(0, 1fr))
	}
}

@media (min-width: 1200px) {
	.container {
		grid-template-columns: repeat(3, minmax(0, 1fr))
	}
}

.module {
	position: relative;
	width: 100%
}

.module>svg {
	width: 100%
}

.module h3 {
	font-family: 'Gotham', sans-serif;
	font-weight: 700;
	text-transform: uppercase
}

.module .subtitle {
	font-family: "Mercury Text G1", serif;
	opacity: 0.4
}

.module text {
	pointer-events: none
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

.tooltip .sota-tooltip-label {
	font-weight: 700
}

.sota-barChart-label,
.sota-pieChart-label,
.sota-gen-groupLabel {
	font-family: 'Mercury Text G1', serif;
	font-weight: 700
}

.sota-floatingLabel {
	font-weight: 700
}

.sota-gen-axis.sota-gen-xAxis .tick text {
	transform: translateY(${axisTextMargin}px);
}

.sota-gen-axis.sota-gen-yAxis .tick text {
	transform: translateX(${-axisTextMargin - 4}px);
	text-anchor: end
}

.sota-gen-axis .tick text {
	color: #999;
	font-size: 16px;
	font-family: 'Gotham', sans-serif;
	font-weight: 700
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
}