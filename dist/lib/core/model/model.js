"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error/error");
const path = require("path");
const fs = require("fs");
function ReadModel(model) {
    let variables = global['EnvironmentVariables'];
    let modelpath = path.resolve(variables.ServerBaseDir, variables.ModelDir, model + '.json');
    if (!fs.existsSync(modelpath))
        throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020401, model + '.json', variables.ModelDir);
    let modelFile = fs.readFileSync(modelpath).toString();
    let result = '';
    if (modelFile && modelFile.length > 0) {
        try {
            let modelObj = JSON.parse(modelFile);
            if (modelObj === void 0)
                throw new Error();
            return modelObj;
        }
        catch (e) {
            throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020402, model + '.json');
        }
    }
    else
        throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020401, model + '.json');
}
exports.ReadModel = ReadModel;
