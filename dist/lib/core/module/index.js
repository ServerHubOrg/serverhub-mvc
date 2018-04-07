"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const module_loader_1 = require("./module-loader");
const helper_1 = require("../helper");
function LoadModuleFrom(name, relativePath) {
    if (relativePath.match(/^(?:\~?[/])|(?:[A-Z]:[\\/])/i)) {
        throw new Error('Must be relative path.');
    }
    else {
        let modpath = path.resolve(helper_1.StackCaller(2), relativePath);
        return module_loader_1.ModuleLoader(name, modpath);
    }
}
exports.LoadModuleFrom = LoadModuleFrom;
function LoadModule(name) {
    throw new Error('Not implemented');
}
exports.LoadModule = LoadModule;
