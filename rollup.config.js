import {terser} from "rollup-plugin-terser";

export default [
    {
        input: 'index.js',
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
        input: 'index.js',
        output: [
            {
                name: "sota",
                file: 'dist/sota.min.js',
                format: 'umd',
                indent: false,
                globals: {
                    d3: 'd3'
                }
            },
            {
                name: "sota",
                file: 'demo/sota.min.js',
                format: 'umd',
                indent: false,
                globals: {
                    d3: 'd3'
                }
            }
        ],

        external: [ 'd3' ],

        plugins: [
            terser()
        ]
    },
    {
        input: 'index.js',
        output: {
            file: "dist/sota.node.js",
            format: "cjs"
        },
        external: [ 'd3' ]
    }
]