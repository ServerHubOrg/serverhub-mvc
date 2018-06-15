"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const log_1 = require("../log");
function ModuleLoader(moduleName, includePath) {
    let mod;
    try {
        if (includePath === void 0 || includePath === null || includePath.length === 0) {
            mod = require(moduleName);
            if (mod !== void 0)
                return mod;
        }
        else {
            let mpath = path.resolve(includePath, moduleName);
            mod = require(mpath);
            if (mod !== void 0)
                return mod;
            else
                throw new Error('Unbale to import module: ' + mpath);
        }
    }
    catch (e) {
        log_1.LogError('runtime', e.toString());
    }
}
exports.ModuleLoader = ModuleLoader;
