import {terser} from "rollup-plugin-terser";

export default [
    {
        input: 'js/sota.js',
        output: {
            name: "sota",
            file: 'dist/sota.js',
            format: 'umd',
            globals: {
                d3: 'd3'
            }
        },

        external: [ 'd3' ]
    },
    {
        input: 'js/sota.js',
        output: {
            name: "sota",
            file: 'dist/sota.min.js',
            format: 'umd',
            indent: false,
            globals: {
                d3: 'd3'
            }
        },

        external: [ 'd3' ],

        plugins: [
            terser()
        ]
    },
    {
        input: "js/sota.js",
        output: {
            file: "dist/sota.node.js",
            format: "cjs"
        },
        external: [ 'd3' ]
    }
]