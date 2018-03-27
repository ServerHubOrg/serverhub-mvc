"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class PluginValidation extends base_1.default {
    Validate(m) {
        let variables = global['EnvironmentVariables'];
        if (!m.hasOwnProperty('version_support') || variables.PackageData['version'] < m['version_support']) {
            throw new Error('Unsupported Node.js version. This package requires at least version ' + m['version_support'] + ' to work properly.');
        }
        if (!m.hasOwnProperty('app_name')) {
            throw new Error('Plugin should provide a readable name');
        }
        else {
            let name = m['app_name'];
            if (/^serverhub-plugin-[a-z][-a-z\d]+$/.test(name) === false) {
                throw new Error('Plugin names must looks like "serverhub-plugin-abc-def". See docs for more information.');
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
        }
        else if (!(m['main'] instanceof Function)) {
            throw new Error('"main" must be a function.');
        }
        else if (m['phase'] === 'before-route' && m['main'].length !== 2) {
            throw new Error('Before-route phase entry must have 2 parameters.');
        }
        else if (m['phase'] === 'after-route' && m['main'].length !== 3) {
            throw new Error('After-route phase entry must have 3 parameters.');
        }
        return true;
    }
    PassFunction(definition) { return false; }
}
exports.default = PluginValidation;
