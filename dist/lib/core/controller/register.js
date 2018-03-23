"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error/error");
const index_1 = require("../validate/index");
const index_2 = require("../wrapper/index");
const fs = require("fs");
const path = require("path");
const database_1 = require("../database");
const index_3 = require("../helper/index");
const os = require("os");
let initFileHelper = false;
function Register(controllerJs) {
    let file = Path2File(controllerJs);
    const variables = global['EnvironmentVariables'];
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
        Object.keys(exp).forEach(action => {
            if (['System', 'Console', 'Runtime', 'View'].indexOf(action) !== -1)
                throw new Error('Warning! Reserved action name detected. Please read the document and try again.');
            else if (action.match(/[a-z\d_]+/) === null)
                throw new Error('Warning! Invalid characters detected in action names. Check and retry!');
        });
    }
    catch (error) {
        throw error;
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
    if (!initFileHelper) {
        new index_3.FileHelper();
        initFileHelper = true;
    }
    exp['Runtime'] = {
        DBProvider: provider,
        FileHelper: index_3.FileHelper,
        WAIT: false
    };
    exp['System'] = {
        Version: variables.PackageData['version'].toString(),
        NodeVersion: process.version.toString(),
        Platform: process.platform.toString(),
        Die: (exitCode = 1) => {
            process.exit(exitCode);
        },
        Hardware: {
            TotalMemory: os.totalmem(),
            FreeMemory: os.freemem(),
            NetworkInterfaces: os.networkInterfaces()
        }
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
