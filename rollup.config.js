import {terser} from "rollup-plugin-terser";

export default [
    {
        input: 'js/sota.js',
        output: {
            name: "sota",
            file: 'dist/sota.min.js',
            format: 'umd',
            indent: false
        },

        plugins: [
            terser()
        ]
    },
    {
        input: "js/sota.js",
        output: {
            file: "dist/sota.node.js",
            format: "cjs"
        }
    }
]