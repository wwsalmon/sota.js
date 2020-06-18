# sota.js

Charting library for *The Phillipian*'s [annual State of the Academy survey project](http://pdf.phillipian.net/2019/05102019.pdf) by Samson Zhang EDE CXLII (@wwsalmon) and Anthony Kim Digital Editor CXLII,CXLIII (@createandbuild). Built on d3. Currently WIP.

# Installation

## Using browser/plain JS:

1. Download or use a cdn to include d3 in your project before sota.js:

<script src="PATH/TO/d3.min.v5.js"></script>

2. Download `dist/sota.min.js` (eventually this will be in releases...) and include it in your project:

<script src="PATH/TO/sota.min.js"></script>

3. In your app or index js, you can now access the `sota` object with functions like `sota.barChart()`.

## Using npm:

Run:

npm i sota.js

d3 is a dependency, so you don't have to worry about it separately.

Then, in your app or index js:

import sota from "sota.js"

And now you have access to the `sota` object with functions like `sota.barChart()`.

# Usage

## Functions

<dl>
<dt><a href="#barChart">barChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [showXAxis], [showSeparators], [displayPercentage], [totalResp], [maxVal], [minVal], [margin])</a></dt>
<dd><p>Render sota.js bar chart</p>
</dd>
<dt><a href="#bigNumber">bigNumber(title, number, subtitle, [selector], [section])</a></dt>
<dd><p>Render big number with subtitle. Not really a chart, no SVG involved, but using JS helps keep ordering correct</p>
</dd>
<dt><a href="#columnChart">columnChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [displayPercentage], [totalResp], [maxVal], [minVal], [mainHeight], [showLegend], [margin])</a></dt>
<dd><p>Render sota.js column chart</p>
</dd>
<dt><a href="#customBarChart">customBarChart(dataFile, [selector], [section], [title], [subtitle], shapeFile, shapeWidth, [inputIsPercentage], [margin])</a></dt>
<dd><p>Render sota.js custom bar chart, using an SVG path as the base</p>
</dd>
<dt><a href="#customColumnChart">customColumnChart(dataFile, [selector], [section], [title], [subtitle], shapeFile, shapeHeight, [inputIsPercentage], [margin])</a></dt>
<dd><p>Render sota.js custom column chart, using an SVG path as the base</p>
</dd>
<dt><a href="#groupedBarChart">groupedBarChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [displayPercentage], [totalResp], [maxVal], [minVal], [margin])</a></dt>
<dd><p>Render sota.js grouped bar chart</p>
</dd>
<dt><a href="#lineGraph">lineGraph(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [maxVal], [minVal], [margin], [height])</a></dt>
<dd><p>Render sota.js line graph</p>
</dd>
<dt><a href="#multiLineGraph">multiLineGraph(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [height], [showLegend], [margin])</a></dt>
<dd></dd>
<dt><a href="#pieChart">pieChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [sorted], [pieRad], [pieThick], [margin])</a></dt>
<dd><p>Render sota.js pie chart</p>
</dd>
<dt><a href="#stackedBarChart">stackedBarChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [showXAxis], [labelStyle], [groupLabelStyle], [showLegend], [margin])</a></dt>
<dd><p>Render sota.js stacked bar chart</p>
</dd>
<dt><a href="#stackedColumnChart">stackedColumnChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [displayPercentage], [maxVal], [minVal], [mainHeight], [margin])</a></dt>
<dd><p>Render sota.js stacked column chart</p>
</dd>
</dl>

<a name="barChart"></a>

## barChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [showXAxis], [showSeparators], [displayPercentage], [totalResp], [maxVal], [minVal], [margin])
Render sota.js bar chart

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataFile | <code>string</code> |  | Relative path to csv data file, excluding file extension, i.e. "data/datafile" |
| [selector] | <code>string</code> |  | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> |  | Either this or selector param is required. Slug for section to add .sota-module container and chart to |
| [title] | <code>string</code> |  | Title to be rendered in h3 tag. Only rendered if section param is used and not selector |
| [subtitle] | <code>string</code> |  | Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector |
| [inputIsPercentage] | <code>boolean</code> | <code>false</code> | Whether or not input data is in percentages |
| [showXAxis] | <code>boolean</code> | <code>true</code> | Whether or not to render x axis |
| [showSeparators] | <code>boolean</code> | <code>true</code> | Whether or not to show separators between bars |
| [displayPercentage] | <code>boolean</code> | <code>true</code> | Whether to display percentage or value on bar |
| [totalResp] | <code>number</code> |  | Number of total responses. Specify if categories are non-exclusive, i.e. if there are less total items than the sum of data points. |
| [maxVal] | <code>number</code> \| <code>boolean</code> |  | By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max. |
| [minVal] | <code>number</code> \| <code>boolean</code> |  | By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min. |
| [margin] | <code>Object</code> |  | Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig |

<a name="bigNumber"></a>

## bigNumber(title, number, subtitle, [selector], [section])
Render big number with subtitle. Not really a chart, no SVG involved, but using JS helps keep ordering correct

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | Title to be rendered in h3 tag |
| number | <code>string</code> | Number to be rendered in .sota-big |
| subtitle | <code>string</code> | Subtitle to follow number |
| [selector] | <code>string</code> | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> | Either this or selector param is required. Slug for section to add .sota-module container and chart to |

<a name="columnChart"></a>

## columnChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [displayPercentage], [totalResp], [maxVal], [minVal], [mainHeight], [showLegend], [margin])
Render sota.js column chart

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataFile | <code>string</code> |  | Relative path to csv data file, excluding file extension, i.e. "data/datafile" |
| [selector] | <code>string</code> |  | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> |  | Either this or selector param is required. Slug for section to add .sota-module container and chart to |
| [title] | <code>string</code> |  | Title to be rendered in h3 tag. Only rendered if section param is used and not selector |
| [subtitle] | <code>string</code> |  | Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector |
| [inputIsPercentage] | <code>boolean</code> | <code>false</code> | Whether or not input data is in percentages |
| [displayPercentage] | <code>boolean</code> | <code>true</code> | Whether to display percentage or values on axis |
| [totalResp] | <code>number</code> |  | Number of total responses. Specify if categories are non-exclusive, i.e. if there are less total items than the sum of data points. |
| [maxVal] | <code>number</code> \| <code>boolean</code> |  | By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max. |
| [minVal] | <code>number</code> \| <code>boolean</code> |  | By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min. |
| [mainHeight] | <code>number</code> |  | Height of the chart. Defaults to value from sotaConfig |
| [showLegend] | <code>boolean</code> | <code>false</code> | Whether to show legend or bottom text labels |
| [margin] | <code>Object</code> |  | Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig |

<a name="customBarChart"></a>

## customBarChart(dataFile, [selector], [section], [title], [subtitle], shapeFile, shapeWidth, [inputIsPercentage], [margin])
Render sota.js custom bar chart, using an SVG path as the base

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataFile | <code>string</code> |  | Relative path to csv data file, excluding file extension, i.e. "data/datafile" |
| [selector] | <code>string</code> |  | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> |  | Either this or selector param is required. Slug for section to add .sota-module container and chart to |
| [title] | <code>string</code> |  | Title to be rendered in h3 tag. Only rendered if section param is used and not selector |
| [subtitle] | <code>string</code> |  | Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector |
| shapeFile | <code>string</code> |  | Relative path to svg shape file, excluding file extension, i.e. "shapes/shapefile" |
| shapeWidth | <code>number</code> |  | Width of shape for chart |
| [inputIsPercentage] | <code>boolean</code> | <code>false</code> | Whether or not input data is in percentages |
| [margin] | <code>Object</code> |  | Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig |

<a name="customColumnChart"></a>

## customColumnChart(dataFile, [selector], [section], [title], [subtitle], shapeFile, shapeHeight, [inputIsPercentage], [margin])
Render sota.js custom column chart, using an SVG path as the base

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataFile | <code>string</code> |  | Relative path to csv data file, excluding file extension, i.e. "data/datafile" |
| [selector] | <code>string</code> |  | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> |  | Either this or selector param is required. Slug for section to add .sota-module container and chart to |
| [title] | <code>string</code> |  | Title to be rendered in h3 tag. Only rendered if section param is used and not selector |
| [subtitle] | <code>string</code> |  | Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector |
| shapeFile | <code>string</code> |  | Relative path to svg shape file, excluding file extension, i.e. "shapes/shapefile" |
| shapeHeight | <code>number</code> |  | Height of shape for chart |
| [inputIsPercentage] | <code>boolean</code> | <code>false</code> | Whether or not input data is in percentages |
| [margin] | <code>Object</code> |  | Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig |

<a name="groupedBarChart"></a>

## groupedBarChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [displayPercentage], [totalResp], [maxVal], [minVal], [margin])
Render sota.js grouped bar chart

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataFile | <code>string</code> |  | Relative path to csv data file, excluding file extension, i.e. "data/datafile" |
| [selector] | <code>string</code> |  | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> |  | Either this or selector param is required. Slug for section to add .sota-module container and chart to |
| [title] | <code>string</code> |  | Title to be rendered in h3 tag. Only rendered if section param is used and not selector |
| [subtitle] | <code>string</code> |  | Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector |
| [inputIsPercentage] | <code>boolean</code> | <code>false</code> | Whether or not input data is in percentages |
| [displayPercentage] | <code>boolean</code> | <code>true</code> | Whether to display percentage or value on axis |
| [totalResp] | <code>number</code> |  | Number of total responses. Specify if categories are non-exclusive, i.e. if there are less total items than the sum of data points. |
| [maxVal] | <code>number</code> \| <code>boolean</code> |  | By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max. |
| [minVal] | <code>number</code> \| <code>boolean</code> |  | By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min. |
| [margin] | <code>Object</code> |  | Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig |

<a name="lineGraph"></a>

## lineGraph(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [maxVal], [minVal], [margin], [height])
Render sota.js line graph

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataFile | <code>string</code> |  | Relative path to csv data file, excluding file extension, i.e. "data/datafile" |
| [selector] | <code>string</code> |  | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> |  | Either this or selector param is required. Slug for section to add .sota-module container and chart to |
| [title] | <code>string</code> |  | Title to be rendered in h3 tag. Only rendered if section param is used and not selector |
| [subtitle] | <code>string</code> |  | Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector |
| [inputIsPercentage] | <code>boolean</code> | <code>false</code> | Whether or not input data is in percentages |
| [maxVal] | <code>number</code> \| <code>boolean</code> |  | By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max. |
| [minVal] | <code>number</code> \| <code>boolean</code> |  | By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min. |
| [margin] | <code>Object</code> |  | Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig |
| [height] | <code>number</code> | <code>300</code> | Height of the chart. Defaults to 300 |

<a name="multiLineGraph"></a>

## multiLineGraph(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [height], [showLegend], [margin])
**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataFile | <code>string</code> |  | Relative path to csv data file, excluding file extension, i.e. "data/datafile" |
| [selector] | <code>string</code> |  | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> |  | Either this or selector param is required. Slug for section to add .sota-module container and chart to |
| [title] | <code>string</code> |  | Title to be rendered in h3 tag. Only rendered if section param is used and not selector |
| [subtitle] | <code>string</code> |  | Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector |
| [inputIsPercentage] | <code>boolean</code> | <code>false</code> | Whether or not input data is in percentages |
| [height] | <code>number</code> | <code>300</code> | Height of the graph |
| [showLegend] | <code>boolean</code> | <code>true</code> | Whether or not to show legend |
| [margin] | <code>Object</code> |  | Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig |

<a name="pieChart"></a>

## pieChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [sorted], [pieRad], [pieThick], [margin])
Render sota.js pie chart

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataFile | <code>string</code> |  | Relative path to csv data file, excluding file extension, i.e. "data/datafile" |
| [selector] | <code>string</code> |  | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> |  | Either this or selector param is required. Slug for section to add .sota-module container and chart to |
| [title] | <code>string</code> |  | Title to be rendered in h3 tag. Only rendered if section param is used and not selector |
| [subtitle] | <code>string</code> |  | Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector |
| [inputIsPercentage] | <code>boolean</code> | <code>false</code> | Whether or not input data is in percentages |
| [sorted] | <code>boolean</code> | <code>true</code> | Whether or not to sort order of slices by size |
| [pieRad] | <code>number</code> | <code>150</code> | Radius of pie in chart |
| [pieThick] | <code>number</code> | <code>80</code> | Thickness of pie slices (this is actually a donut chart) |
| [margin] | <code>Object</code> |  | Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig |

<a name="stackedBarChart"></a>

## stackedBarChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [showXAxis], [labelStyle], [groupLabelStyle], [showLegend], [margin])
Render sota.js stacked bar chart

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataFile | <code>string</code> |  | Relative path to csv data file, excluding file extension, i.e. "data/datafile" |
| [selector] | <code>string</code> |  | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> |  | Either this or selector param is required. Slug for section to add .sota-module container and chart to |
| [title] | <code>string</code> |  | Title to be rendered in h3 tag. Only rendered if section param is used and not selector |
| [subtitle] | <code>string</code> |  | Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector |
| [inputIsPercentage] | <code>boolean</code> | <code>false</code> | Whether or not input data is in percentages |
| [showXAxis] | <code>boolean</code> | <code>true</code> | Whether or not to render x axis |
| [labelStyle] | <code>&quot;none&quot;</code> \| <code>&quot;onBar&quot;</code> \| <code>&quot;aboveBar&quot;</code> | <code>&quot;onBar&quot;</code> | Style of labels for sub-groups (slices of bars). None hides all labels. onBar displays values on the bars, and hides any that don’t fit. aboveBar draws labels above the bar with pointing lines |
| [groupLabelStyle] | <code>&quot;none&quot;</code> \| <code>&quot;onBar&quot;</code> | <code>&quot;none&quot;</code> | Style of labels for groups. None hides all labels. onBar displays labels above bars |
| [showLegend] | <code>boolean</code> | <code>true</code> | Whether or not to show legend |
| [margin] | <code>Object</code> |  | Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig |

<a name="stackedColumnChart"></a>

## stackedColumnChart(dataFile, [selector], [section], [title], [subtitle], [inputIsPercentage], [displayPercentage], [maxVal], [minVal], [mainHeight], [margin])
Render sota.js stacked column chart

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataFile | <code>string</code> |  | Relative path to csv data file, excluding file extension, i.e. "data/datafile" |
| [selector] | <code>string</code> |  | Either this or section param is required. Query selector for container div to render chart in, i.e. "#selector." |
| [section] | <code>string</code> |  | Either this or selector param is required. Slug for section to add .sota-module container and chart to |
| [title] | <code>string</code> |  | Title to be rendered in h3 tag. Only rendered if section param is used and not selector |
| [subtitle] | <code>string</code> |  | Subtitle to be rendered in .sota-subtitle div. Only rendered if section param is used and not selector |
| [inputIsPercentage] | <code>boolean</code> | <code>false</code> | Whether or not input data is in percentages |
| [displayPercentage] | <code>boolean</code> | <code>true</code> | Whether to display percentage or value on axis |
| [maxVal] | <code>number</code> \| <code>boolean</code> |  | By default, either 100 for percentages or max of data for non-percentages is used as scale maximum value. If maxVal is set to true, max of dataset is used for percentages instead of 100. If a number is specified, that number is used as the max. |
| [minVal] | <code>number</code> \| <code>boolean</code> |  | By default, either 0 for percentages or min of data for non-percentages is used as scale minimum value. If minVal is set to true, min of dataset is used for percentages instead of 0. If a number is specified, that number is used as the min. |
| [mainHeight] | <code>number</code> |  | Height of the chart. Defaults to value from sotaConfig |
| [margin] | <code>Object</code> |  | Object containing top, left, bottom, right margins for chart. Defaults to values from sotaConfig |

