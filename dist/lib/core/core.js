"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller = require("./controller/index");
const error_1 = require("./error/error");
const nodepath = require("path");
const fs = require("fs");
const content_type_1 = require("./content-type");
const rcs_1 = require("./cache/rcs");
const index_1 = require("./helper/index");
const plugin_1 = require("./plugin");
const node_version = process.version;
global['EnvironmentVariables'] = global['EnvironmentVariables'] ? global['EnvironmentVariables'] : {
    ServerBaseDir: __dirname,
    ControllerDir: 'controller/',
    ViewDir: 'view/',
    ModelDir: 'model/',
    PageNotFound: '',
    WebDir: 'www/',
    MaxCacheSize: 350,
    DBProvider: 'mysql',
    DBConnectionString: null,
    DefaultPages: ['index.html', 'default.html', 'page.html'],
    AsyncOperationTimeout: 10000,
    PluginDir: 'plugin/'
};
const core_env = {
    platform: process.platform,
    node_version: node_version
};
function RegisterController(controllerJs) {
    return controller.Controller.Register(controllerJs);
}
exports.RegisterController = RegisterController;
function UpdateGlobalVariable(variable, value) {
    if (global['EnvironmentVariables'].hasOwnProperty(variable)) {
        global['EnvironmentVariables'][variable] = value;
        return true;
    }
    return false;
}
exports.UpdateGlobalVariable = UpdateGlobalVariable;
function SetGlobalVariable(variable, value) {
    global['EnvironmentVariables'][variable] = value;
}
exports.SetGlobalVariable = SetGlobalVariable;
function RoutePath(path, request, response) {
    response.setHeader('server', `ServerHub/${global['EnvironmentVariables'].PackageData['version']} (${core_env.platform}) Node.js ${core_env.node_version}`);
    plugin_1.BeforeRoute(request, response, (requ, resp) => {
        let routeResult = ROUTE.RunRoute(path);
        plugin_1.AfterRoute(requ, resp, routeResult, (req, res) => {
            if (!routeResult)
                return NoRoute(path, req, res);
            let method = req.method.toLowerCase();
            if (routeResult.Controller && routeResult.Action && controller.Controller.Dispatchable(routeResult.Controller, routeResult.Action)) {
                try {
                    return (() => { controller.Controller.Dispatch(method, routeResult, req, res); })();
                }
                catch (error) {
                    console.error(error);
                    if (!res.headersSent)
                        res.setHeader('content-type', 'text/html');
                    if (!res.writable)
                        res.write(error_1.ErrorManager.RenderErrorAsHTML(error));
                    res.end();
                }
            }
            else
                return NoRoute(path, req, res);
        });
    });
}
exports.RoutePath = RoutePath;
function NoRoute(path, req, res) {
    let variables = global['EnvironmentVariables'];
    if (path === '/') {
        let hasmatch = false;
        variables.DefaultPages.forEach(ele => {
            if (hasmatch)
                return;
            let temppath = '';
            if (ele.indexOf('/') === 0)
                temppath = ele.slice(1);
            else
                temppath = ele;
            let checkPath = nodepath.resolve(variables.ServerBaseDir, variables.WebDir, temppath);
            if (fs.existsSync(checkPath)) {
                path = '/' + temppath;
                hasmatch = true;
            }
        });
    }
    if (rcs_1.RCS.Service().Cacheable(path))
        return rcs_1.RCS.Service().GetUri(path, res);
    let filepath = nodepath.resolve(variables.ServerBaseDir, variables.WebDir, path.substr(1));
    if (fs.existsSync(filepath)) {
        res.setHeader('content-type', content_type_1.ContentType.GetContentType(path.match(/\.[a-z\d]*$/i)[0]));
        res.write(fs.readFileSync(filepath));
        res.end();
    }
    else {
        res.setHeader('content-type', 'text/html');
        res.writeHead(404);
        let pageNotFound = '';
        if (variables.PageNotFound !== null && variables.PageNotFound.length === 0)
            pageNotFound = index_1.CacheHelper.Cache(nodepath.resolve(__dirname, '404.html')).Content;
        else
            pageNotFound = index_1.CacheHelper.Cache(nodepath.resolve(variables.ServerBaseDir, variables.PageNotFound)).Content;
        res.write(pageNotFound);
        res.end();
    }
}
var ROUTE;
function RegisterRouter(route) {
    ROUTE = route;
}
exports.RegisterRouter = RegisterRouter;
