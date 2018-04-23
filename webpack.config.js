var webpack = require("webpack");
var path = require("path");
var nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: "./src/index.ts",
    target: "node",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "index.js",
        libraryTarget: "umd",
        umdNamedDefine: true
    },

    externals: [nodeExternals()],

    plugins: [
        // Adds the source-map-support plugin for mapping the error messages back to the source file
        new webpack.BannerPlugin({
            banner: "require('source-map-support').install();",
            raw: true,
            entryOnly:
            false
        })
    ],

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a ".ts" or ".tsx" extension will be handled by "ts-loader".
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.json$/, loader: "json-loader" }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },
};