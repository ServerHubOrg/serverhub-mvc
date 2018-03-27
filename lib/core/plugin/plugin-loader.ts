/**
 * Plugin File Loader
 * 
 * ServerHub MVC, MIT License
 * March 27, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import { GlobalEnvironmentVariables } from "../global";
import { PluginValidation } from "../validate";

/**
 * Load script as module.
 * @param {string} module_path Path to the module.
 */
export default function LoadAsModule(module_path: string): Object {
    let m = {} as Object;
    try {
        m = require(module_path);
    } catch (error) {
        throw error;
    } finally {
        if (new PluginValidation().Validate(m))
            return m;
        else return void 0;
    }
}


