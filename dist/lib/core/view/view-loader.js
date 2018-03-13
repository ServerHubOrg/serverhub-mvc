"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error/error");
const fs = require("fs");
const path = require("path");
function LoadView(viewFile) {
    let file = Path2File(viewFile);
    let variables = global['EnvironmentVariables'];
    let filepath = path.resolve(variables.ServerBaseDir, variables.ViewDir, viewFile);
    if (!fs.existsSync(filepath))
        throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020201, file.FullName, variables.ViewDir);
    let viewString = fs.readFileSync(filepath).toString();
}
function Path2File(path) {
    if (!path.endsWith('.html'))
        throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020201, path, 'working directory');
    let fileNameMatch = path.match(/\/?([^/\\?!*&^%]*\.html)$/i);
    if (!fileNameMatch)
        throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020201, path, 'working directory');
    let name = fileNameMatch[1];
    let file = {
        FileExt: 'html',
        FileName: name.replace('.html', ''),
        FullName: name
    };
    return file;
}
