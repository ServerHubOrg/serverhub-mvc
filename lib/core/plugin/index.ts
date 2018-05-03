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


async function BeforeRoute(request: IncomingMessage, response: ServerResponse) {
    let index = 0;
    let errorCount = 0;
    for (; index < BeforeRoutePlugins.length; index++) {
        let plugin = BeforeRoutePlugins[index];
        try {
            let exeRes = plugin.main(request, response) as Promise<boolean>;
            if (exeRes instanceof Promise) {
                await exeRes;
            }
            if (response.headersSent) {
                throw new Error('Before-route phase plugins MUSTN\'T modify response content.');
            }
        } catch (e) {
            console.error('Error happens when running some before-route phase plugins:');
            console.error(e);
            errorCount++;
        }
    }
    return errorCount;
}
async function AfterRoute(request: IncomingMessage, response: ServerResponse, route: RouteValue) {
    let index = 0;
    let errorCount = 0;
    for (; index < AfterRoutePlugins.length; index++) {
        let plugin = AfterRoutePlugins[index];
        try {
            let exeRes = plugin.main(request, response, route) as Promise<boolean>;
            if (exeRes instanceof Promise) {
                await exeRes;
            }
            if (response.headersSent) {
                throw new Error('After-route phase plugins MUSTN\'T modify response content.');
            }
        } catch (e) {
            console.error('Error happens when running some after-route phase plugins:');
            console.error(e);
            errorCount++;
        }
    }
    return errorCount;
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