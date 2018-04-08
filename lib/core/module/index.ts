/**
 * Module Library
 * 
 * ServerHub MVC, MIT License
 * April 7th, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import * as path from 'path';
import { ModuleLoader } from "./module-loader";
import { StackCaller } from "../helper";
import { GlobalEnvironmentVariables } from '../global';

/**
 * Load module with its name and relative path
 * @param name Module name
 * @param relativePath Module relative path
 */
function LoadModuleFrom(name: string, relativePath: string): any {
    if (relativePath.match(/^(?:\~?[/])|(?:[A-Z]:[\\/])/i)) {
        throw new Error('Must be relative path.');
    } else {
        let stackCallerPath = StackCaller(2);
        let searchpath = '';
        if (stackCallerPath)
            searchpath = stackCallerPath;
        else {
            if (this['__controller_type__'] === 'partial') {
                let variables = (global['EnvironmentVariables'] as GlobalEnvironmentVariables);
                searchpath = path.resolve(variables.ServerBaseDir, variables.ControllerDir);
            }
            else throw new Error('Unable to determine module type or not supported.')
        }
        let modpath = path.resolve(searchpath, relativePath);
        return ModuleLoader(name, modpath);
    }
}

function LoadModule(name: string): any {
    throw new Error('Not implemented');
}

export { LoadModuleFrom, LoadModule };