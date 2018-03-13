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
    let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
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
    } catch (error) {
        throw ErrorManager.RenderError(CompileTimeError.SH010103);
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