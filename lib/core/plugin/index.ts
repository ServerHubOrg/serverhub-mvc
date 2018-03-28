/**
 * Plugin Support Library
 * 
 * ServerHub MVC, MIT License
 * March 27, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import LoadAsModule from "./plugin-loader";
import Plugin from "./type";
import { GlobalEnvironmentVariables } from "../global";
import * as path from 'path';
import * as fs from 'fs';
import { IncomingMessage, ServerResponse } from "http";
import { RouteValue } from "../../route";

const BeforeRoutePlugins = new Array<Plugin>(0);
const AfterRoutePlugins = new Array<Plugin>(0);
const RegisteredPlugins = new Array<string>(0);


function BeforeRoute(request: IncomingMessage, response: ServerResponse, final: (request: IncomingMessage, response: ServerResponse) => void) {
    let fi = Promise.all(BeforeRoutePlugins.map((plugin) => {
        plugin.main(request, response);
        if (response.headersSent) {
            return Promise.reject('Before-route phase plugins MUSTN\'T modify response content.');
        } else return Promise.resolve(true);
    })).then(() => {
        final(request, response);
    }).catch((reason) => {
        console.error('Error happens when running some before-route phase plugins. The reason is:');
        console.error('\t' + reason)
    });
}
function AfterRoute(request: IncomingMessage, response: ServerResponse, route: RouteValue, final: (request: IncomingMessage, response: ServerResponse) => void) {
    let fi = Promise.all(AfterRoutePlugins.map((plugin) => {
        plugin.main(request, response, Object.assign({}, route));
        if (response.headersSent) {
            return Promise.reject('After-route phase plugins MUSTN\'T modify response content.');
        } else return Promise.resolve(true);
    })).then(() => {
        final(request, response);
    }).catch((reason) => {
        console.error('Error happens when running some after-route phase plugins. The reason is:');
        console.error('\t' + reason)
    });
}

function AutoRegister(): Object {
    let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
    let go_through = true;
    let count = 0;
    let pluginPath = path.resolve(variables.ServerBaseDir, variables.PluginDir);
    if (!fs.existsSync(pluginPath))
        return {
            done: true,
            count: 0
        };
    fs.readdirSync(pluginPath).forEach(plugin_name => {
        if (!go_through)
            return;
        let plugin_path = path.resolve(pluginPath, plugin_name)
        let m = LoadAsModule(plugin_path) as Plugin;
        if (m !== void 0) {
            if (RegisteredPlugins.indexOf(m.app_name) !== -1) {
                throw new Error('A duplicated plugin found. There is already a plugin named ' + m.app_name + ' exists!');
            }
            switch (m.phase) {
                case 'before-route': BeforeRoutePlugins.push(Object.assign({}, m)); break;
                default: AfterRoutePlugins.push(Object.assign({}, m));
            }
            RegisteredPlugins.push(m.app_name);
            go_through = true;
            count++;
        }
        else go_through = false;
    });
    return {
        done: go_through,
        count: count
    };
}

function RegisterPlugin(plugin_name: string): boolean {
    let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
    let plugin_path = path.resolve(variables.ServerBaseDir, variables.PluginDir, plugin_name)
    let m = LoadAsModule(plugin_path) as Plugin;
    if (m !== void 0) {
        if (RegisteredPlugins.indexOf(m.app_name) !== -1) {
            throw new Error('A duplicated plugin found. There is already a plugin named ' + m.app_name + ' exists!');
        }
        switch (m.phase) {
            case 'before-route': BeforeRoutePlugins.push(Object.assign({}, m)); break;
            default: AfterRoutePlugins.push(Object.assign({}, m));
                RegisteredPlugins.push(m.app_name);
        }
        return true;
    }
    return false;
}

function GetRegisteredPlugins(): Array<string> {
    return RegisteredPlugins.slice(0);
}

export { AutoRegister, BeforeRoute, AfterRoute, RegisterPlugin, GetRegisteredPlugins };