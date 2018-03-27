"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
function LoadAsModule(module_path) {
    let m = {};
    try {
        m = require(module_path);
    }
    catch (error) {
        throw error;
    }
    finally {
        if (new validate_1.PluginValidation().Validate(m))
            return m;
        else
            return void 0;
    }
}
exports.default = LoadAsModule;
