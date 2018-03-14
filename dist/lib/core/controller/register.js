"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error/error");
const index_1 = require("../validate/index");
const index_2 = require("../wrapper/index");
const fs = require("fs");
const path = require("path");
const database_1 = require("../database");
function Register(controllerJs) {
    let file = Path2File(controllerJs);
    let variables = global['EnvironmentVariables'];
    let filepath = path.resolve(variables.ServerBaseDir, variables.ControllerDir, controllerJs);
    if (!fs.existsSync(filepath))
        throw error_1.ErrorManager.RenderError(error_1.CompileTimeError.SH010102, file.FullName, variables.ControllerDir);
    let scriptFile = fs.readFileSync(filepath).toString();
    let exp = void 0;
    try {
        let output = index_2.default(scriptFile);
        if (new index_1.ControllerValidation().Validate(output))
            exp = output;
        else
            throw new Error();
    }
    catch (error) {
        throw error_1.ErrorManager.RenderError(error_1.CompileTimeError.SH010103);
    }
    exp['Console'] = global.console;
    let provider = void 0;
    let config = null;
    if (variables.DBConnectionString) {
        let secs = variables.DBConnectionString.split(';');
        config = { Host: 'local', Username: 'username', Password: 'password' };
        secs.forEach(sec => {
            if (sec.match(/^host=/i)) {
                config['Host'] = sec.match(/^host=(.*)$/i)[1];
            }
            if (sec.match(/^(?:usr)|(?:user(?:name)?)=/i)) {
                config['Username'] = sec.match(/^(?:(?:usr)|(?:user(?:name)?))=(.*)$/i)[1];
            }
            if (sec.match(/^(?:password)|(?:pwd)=/i)) {
                config['Password'] = sec.match(/^(?:(?:password)|(?:pwd))=(.+)$/i)[1];
            }
        });
    }
    switch (variables.DBProvider) {
        case 'mysql': ;
        default: provider = config !== null ? new database_1.DBMySQL(config) : new database_1.DBMySQL();
    }
    exp['Runtime'] = {
        DBProvider: provider
    };
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
