/**
 * Plugin Validation Library
 * 
 * ServerHub MVC, MIT License
 * March 27, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import Validator, { FunctionDefinition } from "./base";
import { GlobalEnvironmentVariables } from "../global";



export default class PluginValidation extends Validator {
    protected RequiredFunctions: Array<FunctionDefinition>;
    public Validate(m: Object): boolean {
        let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;

        if (!m.hasOwnProperty('version_support') || variables.PackageData['version'] < m['version_support']) {
            throw new Error('Unsupported Node.js version. This package requires at least version ' + m['version_support'] + ' to work properly.');
        }

        if (!m.hasOwnProperty('app_name')) {
            throw new Error('Plugin should provide a readable name');
        }else {
            let name = m['app_name'] as string;
            if(/^serverhub-plugin-[a-z][-a-z\d]+$/.test(name)===false){
                throw new Error('Plugin names must looks like "serverhub-plugin-abc-def". See docs for more information.')
            }
        }

        if (!m.hasOwnProperty('version')) {
            throw new Error('"version" must be defined in plugins.');
        }

        if (!m.hasOwnProperty('phase') || ['before-route', 'after-route'].indexOf(m['phase']) === -1) {
            throw new Error('"phase" is required and must be one of "before-route" and "after-route".');
        }

        if (!m.hasOwnProperty('main')) {
            throw new Error('"main" is a required entry for plugins.');
        } else if (!(m['main'] instanceof Function)) {
            throw new Error('"main" must be a function.');
        } else if (m['phase'] === 'before-route' && (m['main'] as Function).length !== 2) {
            // request, response
            throw new Error('Before-route phase entry must have 2 parameters.');
        } else if (m['phase'] === 'after-route' && (m['main'] as Function).length !== 3) {
            // request, response, route value.
            throw new Error('After-route phase entry must have 3 parameters.');
        }
        return true;
    }

    protected PassFunction(definition: FunctionDefinition): boolean { return false; }
}