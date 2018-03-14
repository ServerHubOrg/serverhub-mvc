"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller = require("./controller/index");
const error_1 = require("./error/error");
const nodepath = require("path");
const fs = require("fs");
const content_type_1 = require("./content-type");
const rcs_1 = require("./cache/rcs");
const package_version = process.env.npm_package_version;
const node_version = process.version;
global['EnvironmentVariables'] = global['EnvironmentVariables'] ? global['EnvironmentVariables'] : {
    ServerBaseDir: __dirname,
    ControllerDir: 'controller/',
    ViewDir: 'view/',
    ModelDir: 'model/',
    PageNotFound: '404.html',
    WebDir: 'www',
    MaxCacheSize: 200,
    DBProvider: 'mysql',
    DBConnectionString: null
};
const core_env = {
    platform: process.platform,
    version: '0.0.2',
    node_version: process.version
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
function RoutePath(path, req, res) {
    res.setHeader('server', `ServerHub/${package_version} (${process.platform}) Node.js/${node_version}`);
    if (path.indexOf('changrui0926') !== -1)
        return rcs_1.RCS.Service().GetCacheReport(res);
    let routeResult = ROUTE.RunRoute(path);
    res.setHeader('server', `ServerHub/${core_env.version} (${core_env.platform}) Node.js ${core_env.node_version}`);
    if (!routeResult)
        return NoRoute(path, req, res);
    let method = req.method.toLowerCase();
    if (routeResult.Controller && routeResult.Action) {
        try {
            return (() => { controller.Controller.Dispatch(method, routeResult, req, res); })();
        }
        catch (error) {
            res.setHeader('content-type', 'text/html');
            res.write(error_1.ErrorManager.RenderErrorAsHTML(error));
            res.end();
        }
    }
    return NoRoute(path, req, res);
}
exports.RoutePath = RoutePath;
function NoRoute(path, req, res) {
    let variables = global['EnvironmentVariables'];
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
        res.write(fs.readFileSync(nodepath.resolve(__dirname, '404.html')).toString());
        res.end();
    }
}
var ROUTE;
function RegisterRouter(route) {
    ROUTE = route;
}
exports.RegisterRouter = RegisterRouter;
