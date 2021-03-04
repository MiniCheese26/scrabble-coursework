"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const config = {
    mode: "production",
    entry: "./src/index.tsx",
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].[contenthash].js"
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            },
            {
                test: /\.(png|woff|woff2)$/i,
                exclude: /node_modules/,
                loader: "file-loader"
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            Types: [
                path.resolve(__dirname, "src/App/types/"),
                path.resolve(__dirname, "../sharedTypes")
            ],
            Styles: path.resolve(__dirname, "src/App/styles/"),
            Components: path.resolve(__dirname, "src/App/components"),
            Resources: path.resolve(__dirname, "src/App/resources"),
            Pages: path.resolve(__dirname, "src/App/pages"),
            Classes: path.resolve(__dirname, "src/App/classes")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
        }),
        /*new ESLintPlugin({
            //extensions: ["js", "jsx", "ts", "tsx"]
        }),*/
        new clean_webpack_plugin_1.CleanWebpackPlugin(),
    ],
    stats: "minimal"
};
exports.default = config;
