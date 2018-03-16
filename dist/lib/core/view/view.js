"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error/error");
const path = require("path");
const fs = require("fs");
function ApplyModel(view, model) {
    let variables = global['EnvironmentVariables'];
    let htmlpath = path.resolve(variables.ServerBaseDir, variables.ViewDir, view + '.html');
    if (!fs.existsSync(htmlpath))
        throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020201, view + '.html', variables.ViewDir);
    let htmlFile = fs.readFileSync(htmlpath).toString();
    let result = '';
    if (!model || Object.keys(model).length === 0)
        result = htmlFile.replace(/\$\$\{[a-z.\d_$]*\}/ig, '');
    else if (htmlFile && htmlFile.length > 0) {
        try {
            let keys = Object.keys(model);
            keys.forEach(ele => {
                let reg = new RegExp(`(\\$\\$\\{${view}\\.${ele}\\})`, 'g');
                htmlFile = htmlFile.replace(reg, model[ele]);
            });
            result = htmlFile;
        }
        catch (e) {
            throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020402, model + '.json');
        }
    }
    return result;
}
exports.ApplyModel = ApplyModel;
