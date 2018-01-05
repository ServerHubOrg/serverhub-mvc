"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error/error");
const fs = require("fs");
const path = require("path");
function Register(controllerJs) {
    console.log(global['EnvironmentVariables'].ServerBaseDir);
    let file = Path2File(controllerJs);
    let variables = global['EnvironmentVariables'];
    let filepath = path.resolve(variables.ServerBaseDir, variables.ControllerDir, controllerJs);
    if (!fs.existsSync(filepath))
        throw error_1.ErrorManager.RenderError(error_1.CompileTimeError.SH010102, file.FullName, variables.ControllerDir);
    let scriptFile = fs.readFileSync(filepath).toString();
    let exp = void 0;
    try {
        if (scriptFile)
            exp = eval(scriptFile);
        else
            throw new Error();
        if (!exp)
            throw new Error();
    }
    catch (error) {
        throw error_1.ErrorManager.RenderError(error_1.CompileTimeError.SH010103);
    }
    let bundle = {
        Name: file.FileName,
        FileName: file.FullName,
        Controller: exp
    };
    return bundle;
}
exports.Register = Register;
function Path2File(path) {
    if (!path.endsWith('.js'))
        throw error_1.ErrorManager.RenderError(error_1.CompileTimeError.SH010101, path);
    let fileNameMatch = path.match(/\/?([^/\\?!*&^%]*\.js)$/i);
    if (!fileNameMatch)
        throw error_1.ErrorManager.RenderError(error_1.CompileTimeError.SH010101, path);
    let name = fileNameMatch[1];
    let file = {
        FileExt: 'js',
        FileName: name.replace('.js', ''),
        FullName: name
    };
    return file;
}
