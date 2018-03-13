/**
 * View Loader
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import { GlobalEnvironmentVariables } from "../global";
import { ErrorManager, CompileTimeError, RuntimeError } from '../error/error';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Load view file to string
 * @param viewFile View file name
 */
function LoadView(viewFile): string {
    let file = Path2File(viewFile);
    let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
    let filepath = path.resolve(variables.ServerBaseDir, variables.ViewDir, viewFile);
    if (!fs.existsSync(filepath))
        throw ErrorManager.RenderError(RuntimeError.SH020201, file.FullName, variables.ViewDir);
    let viewString = fs.readFileSync(filepath).toString();
    return viewString;
}

/**
 * File literal info.
 */
interface File {
    FileName: string;
    FileExt: string;
    FullName: string
}

/**
 * Convert file path to file basic info (literal).
 * @param path Input file path
 */
function Path2File(path: string): File {
    if (!path.endsWith('.html'))
        throw ErrorManager.RenderError(RuntimeError.SH020201, path, 'working directory');
    let fileNameMatch = path.match(/\/?([^/\\?!*&^%]*\.html)$/i);
    if (!fileNameMatch)
        throw ErrorManager.RenderError(RuntimeError.SH020201, path, 'working directory');
    let name = fileNameMatch[1];
    let file = {
        FileExt: 'html',
        FileName: name.replace('.html', ''),
        FullName: name
    } as File;
    return file;
}


export default LoadView;