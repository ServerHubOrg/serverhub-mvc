import { GlobalEnvironmentVariables } from "../global";
import { ErrorManager, CompileTimeError, RuntimeError } from '../error/error';
import * as fs from 'fs';
import * as path from 'path';
export interface ControllerBundle {
    Name: string,
    FileName: string,
    Controller: Object
}
export function Register(controllerJs: string): ControllerBundle {
    console.log(global['EnvironmentVariables'].ServerBaseDir);
    let file = Path2File(controllerJs);
    let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
    let filepath = path.resolve(variables.ServerBaseDir, variables.ControllerDir, controllerJs);
    if (!fs.existsSync(filepath))
        throw ErrorManager.RenderError(CompileTimeError.SH010102, file.FullName, variables.ControllerDir);
    let scriptFile = fs.readFileSync(filepath).toString();
    let exp = void 0;
    try {
        if (scriptFile)
            exp = eval(scriptFile);
        else throw new Error();
        if (!exp)
            throw new Error();
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

interface File {
    FileName: string;
    FileExt: string;
    FullName: string
}
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