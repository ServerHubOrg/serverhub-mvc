"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_loader_1 = require("./plugin-loader");
const path = require("path");
const fs = require("fs");
const BeforeRoutePlugins = new Array(0);
const AfterRoutePlugins = new Array(0);
const RegisteredPlugins = new Array(0);
function BeforeRoute(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let index = 0;
        let errorCount = 0;
        for (; index < BeforeRoutePlugins.length; index++) {
            let plugin = BeforeRoutePlugins[index];
            try {
                let exeRes = plugin.main(request, response);
                if (exeRes instanceof Promise) {
                    yield exeRes;
                }
                if (response.headersSent) {
                    throw new Error('Before-route phase plugins MUSTN\'T modify response content.');
                }
            }
            catch (e) {
                console.error('Error happens when running some before-route phase plugins:');
                console.error(e);
                errorCount++;
            }
        }
        return errorCount;
    });
}
exports.BeforeRoute = BeforeRoute;
function AfterRoute(request, response, route) {
    return __awaiter(this, void 0, void 0, function* () {
        let index = 0;
        let errorCount = 0;
        for (; index < AfterRoutePlugins.length; index++) {
            let plugin = AfterRoutePlugins[index];
            try {
                let exeRes = plugin.main(request, response, route);
                if (exeRes instanceof Promise) {
                    yield exeRes;
                }
                if (response.headersSent) {
                    throw new Error('After-route phase plugins MUSTN\'T modify response content.');
                }
            }
            catch (e) {
                console.error('Error happens when running some after-route phase plugins:');
                console.error(e);
                errorCount++;
            }
        }
        return errorCount;
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
