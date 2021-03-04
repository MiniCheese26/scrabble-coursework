import * as path from "path";

const moduleAliases = require("./package.json")._moduleAliases;

const alias = {};

for (const key in moduleAliases) {
    alias[key] = path.resolve(__dirname, moduleAliases[key]);
}

export default {
    resolve: { alias }
};