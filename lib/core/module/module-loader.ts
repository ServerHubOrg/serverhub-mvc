/**
 * Module Loader
 * 
 * ServerHub MVC, MIT License
 * April 7th, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */
import * as path from 'path';

/**
 * Load one module from specific folder with its module name.
 * @param moduleName Name of the module. Ignore the .js extension
 * @param includePath Absolute path to the module directory
 */
function ModuleLoader(moduleName: string, includePath: string): any {
    let mod: any;
    try {
        if (includePath === void 0 || includePath === null || includePath.length === 0) {
            mod = require(moduleName);
            if (mod !== void 0)
                return mod;
        } else {
            let mpath = path.resolve(includePath, moduleName);
            mod = require(mpath);
            if (mod !== void 0)
                return mod;
            else throw new Error('Unbale to import module: ' + mpath);
        }
    } catch (e) {
        console.error(e);
    }
}

export { ModuleLoader };