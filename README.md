# sota.js

Charting library for *The Phillipian*'s [annual State of the Academy survey project](http://pdf.phillipian.net/2019/05102019.pdf) by Samson Zhang EDE CXLII (@wwsalmon). Built on d3. Currently WIP.

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

Usage documentation to come.