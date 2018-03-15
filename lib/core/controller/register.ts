/**
 * Controller Register
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import { GlobalEnvironmentVariables } from "../global";
import { ErrorManager, CompileTimeError, RuntimeError } from '../error/error';
import { ControllerValidation } from '../validate/index';
import Wrapper from '../wrapper/index';
import * as fs from 'fs';
import * as path from 'path';
import { DBMySQL } from "../database";
import { FileHelper } from "../helper/index";
import * as os from 'os';

let initFileHelper = false;
/**
 * COntains information of a custom controller.
 */
export interface ControllerBundle {
    Name: string,
    FileName: string,
    Controller: Object
}


/**
 * Parse controller file to controller instance.
 * @param controllerJs Controller file name
 */
export function Register(controllerJs: string): ControllerBundle {
    // console.log(global['EnvironmentVariables'].ServerBaseDir);
    let file = Path2File(controllerJs);
    const variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
    let filepath = path.resolve(variables.ServerBaseDir, variables.ControllerDir, controllerJs);
    if (!fs.existsSync(filepath))
        throw ErrorManager.RenderError(CompileTimeError.SH010102, file.FullName, variables.ControllerDir);
    let scriptFile = fs.readFileSync(filepath).toString();
    let exp = void 0;
    try {
        let output = Wrapper(scriptFile);
        if (new ControllerValidation().Validate(output))
            exp = output;
        else throw new Error();

        Object.keys(exp).forEach(action => {
            if (['System', 'Console', 'Runtime','View'].indexOf(action) !== -1)
                throw new Error('Warning! Reserved action name detected. Please read the document and try again.')
            else if (action.match(/[a-z\d_]+/) === null)
                throw new Error('Warning! Invalid characters detected in action names. Check and retry!')
        })
    } catch (error) {
        if ((error as Error).message.indexOf('Warning') > -1)
            throw error;
        throw ErrorManager.RenderError(CompileTimeError.SH010103);
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
        })
    }
    switch (variables.DBProvider) {
        case 'mysql': ;
        default: provider = config !== null ? new DBMySQL(config) : new DBMySQL();
    }

    if (!initFileHelper) {
        new FileHelper(); // set up FileHelper private variables.
        initFileHelper = true;
    }


    exp['Runtime'] = {
        DBProvider: provider,
        FileHelper: FileHelper
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
    }

    let bundle = {
        Name: file.FileName,
        FileName: file.FullName,
        Controller: exp
    };
    return bundle;
}

/**
 * File literal info
 */
interface File {
    FileName: string;
    FileExt: string;
    FullName: string
}

/**
 * Convert file path to file literal info
 * @param path Input file path
 */
function Path2File(path: string): File {
    if (!path.endsWith('.js'))
        throw ErrorManager.RenderError(CompileTimeError.SH010101, path);
    let fileNameMatch = path.match(/\/?([^/\\?!*&^%]*\.js)$/i);
    if (!fileNameMatch)
        throw ErrorManager.RenderError(CompileTimeError.SH010101, path);
    let name = fileNameMatch[1];
    let file = {
        FileExt: 'js',
        FileName: name.replace('.js', ''),
        FullName: name
    } as File;
    return file;
}