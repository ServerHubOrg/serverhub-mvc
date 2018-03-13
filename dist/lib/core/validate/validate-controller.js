"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class ControllerValidation extends base_1.default {
    constructor() {
        super();
        this.RequiredFunctions = [{
                FunctionName: 'index',
                Required: true,
                ParamRequirement: 3
            }, {
                FunctionName: 'primary',
                Required: false,
                ParamRequirement: 2
            }];
    }
    Validate(obj) {
        if (obj)
            this.Target = obj;
        else
            throw new Error('File content must not be empty');
        let allpass = true;
        this.RequiredFunctions.forEach(func => {
            if (allpass)
                allpass = this.PassFunction(func);
        });
        return allpass;
    }
    PassFunction(definition) {
        if (this.Target === void 0 || this.Target === null)
            throw new Error('Validate() method must be called before checking each function');
        if (!this.Target.hasOwnProperty(definition.FunctionName)) {
            if (definition.Required)
                throw new Error(`Custom controller must implement ${definition.FunctionName}() method.`);
            else
                return true;
        }
        else {
            if (this.Target[definition.FunctionName].length >= definition.ParamRequirement)
                return true;
            else
                return definition.Required ? false : true;
        }
    }
}
exports.default = ControllerValidation;
