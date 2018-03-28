"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_loader_1 = require("./plugin-loader");
const path = require("path");
const fs = require("fs");
const BeforeRoutePlugins = new Array(0);
const AfterRoutePlugins = new Array(0);
const RegisteredPlugins = new Array(0);
function BeforeRoute(request, response, final) {
    let fi = Promise.all(BeforeRoutePlugins.map((plugin) => {
        plugin.main(request, response);
        if (response.headersSent) {
            return Promise.reject('Before-route phase plugins MUSTN\'T modify response content.');
        }
        else
            return Promise.resolve(true);
    })).then(() => {
        final(request, response);
    }).catch((reason) => {
        console.error('Error happens when running some before-route phase plugins. The reason is:');
        console.error('\t' + reason);
    });
}
exports.BeforeRoute = BeforeRoute;
function AfterRoute(request, response, route, final) {
    let fi = Promise.all(AfterRoutePlugins.map((plugin) => {
        plugin.main(request, response, Object.assign({}, route));
        if (response.headersSent) {
            return Promise.reject('After-route phase plugins MUSTN\'T modify response content.');
        }
        else
            return Promise.resolve(true);
    })).then(() => {
        final(request, response);
    }).catch((reason) => {
        console.error('Error happens when running some after-route phase plugins. The reason is:');
        console.error('\t' + reason);
    });
}
exports.AfterRoute = AfterRoute;
function AutoRegister() {
    let variables = global['EnvironmentVariables'];
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
        let plugin_path = path.resolve(pluginPath, plugin_name);
        let m = plugin_loader_1.default(plugin_path);
        if (m !== void 0) {
            if (RegisteredPlugins.indexOf(m.app_name) !== -1) {
                throw new Error('A duplicated plugin found. There is already a plugin named ' + m.app_name + ' exists!');
            }
            switch (m.phase) {
                case 'before-route':
                    BeforeRoutePlugins.push(Object.assign({}, m));
                    break;
                default: AfterRoutePlugins.push(Object.assign({}, m));
            }
            RegisteredPlugins.push(m.app_name);
            go_through = true;
            count++;
        }
        else
            go_through = false;
    });
    return {
        done: go_through,
        count: count
    };
}
exports.AutoRegister = AutoRegister;
function RegisterPlugin(plugin_name) {
    let variables = global['EnvironmentVariables'];
    let plugin_path = path.resolve(variables.ServerBaseDir, variables.PluginDir, plugin_name);
    let m = plugin_loader_1.default(plugin_path);
    if (m !== void 0) {
        if (RegisteredPlugins.indexOf(m.app_name) !== -1) {
            throw new Error('A duplicated plugin found. There is already a plugin named ' + m.app_name + ' exists!');
        }
        switch (m.phase) {
            case 'before-route':
                BeforeRoutePlugins.push(Object.assign({}, m));
                break;
            default:
                AfterRoutePlugins.push(Object.assign({}, m));
                RegisteredPlugins.push(m.app_name);
        }
        return true;
    }
    return false;
}
exports.RegisterPlugin = RegisterPlugin;
function GetRegisteredPlugins() {
    return RegisteredPlugins.slice(0);
}
exports.GetRegisteredPlugins = GetRegisteredPlugins;
