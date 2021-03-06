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
const server_1 = require("./server");
const log_1 = require("./log");
const middleware_1 = require("./middleware");
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
    PluginDir: 'plugin/',
    Verbose: true,
    TLSOptions: void 0,
    RedirectToTLS: true,
    Hostname: 'localhost',
    Port: [80],
    LogConfig: {
        Dir: 'log/',
        MaxSize: 65536,
        Access: true,
        Error: true,
        Runtime: true,
        Filename: 'serverhub'
    }
};
const core_env = {
    platform: process.platform,
    node_version: node_version
};
function RegisterController(controllerJs) {
    return controller.Controller.Register(controllerJs);
}
exports.RegisterController = RegisterController;
function RegisterControllerM(controllerJs) {
    return controller.Controller.RegisterM(controllerJs);
}
exports.RegisterControllerM = RegisterControllerM;
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
function RoutePath(path, request, res) {
    res.setHeader('server', `ServerHub/${global['EnvironmentVariables'].PackageData['version']} (${core_env.platform}) Node.js ${core_env.node_version}`);
    res.setHeader('x-powered-by', `ServerHub`);
    let middlewareExecutor = new middleware_1.MiddlewareExecutor();
    let middlewareResult = middlewareExecutor.Run(request, path) || {
        Req: request,
        Path: path
    };
    path = middlewareResult.Path;
    request = middlewareResult.Req;
    let response = new server_1.ServerHubResponse(res);
    request['__address__'] = request.connection.remoteAddress;
    response.on('finish', () => {
        log_1.LogAccess(request['__address__'] || '::1', path, response.__length__, request['user'] || 'guest', '-', request.method, request['secure'], request.httpVersion, response.statusCode);
    });
    let bPromise = plugin_1.BeforeRoute(request, response);
    let routeResult = ROUTE.RunRoute(path);
    let doneAfterRoutePluginExecution = (errCount) => {
        if (!routeResult)
            return NoRoute(path, request, response);
        let method = request.method.toLowerCase();
        if (routeResult.Controller && routeResult.Action && controller.Controller.Dispatchable(routeResult.Controller, routeResult.Action)) {
            try {
                return (() => { controller.Controller.Dispatch(method, routeResult, request, response); })();
            }
            catch (error) {
                log_1.LogError('runtime', 'Cannot dispatch controller');
                if (!response.headersSent)
                    response.setHeader('content-type', 'text/html');
                if (!response.writable)
                    response.write(error_1.ErrorManager.RenderErrorAsHTML(error));
                response.end();
            }
        }
        else
            return NoRoute(path, request, response);
    };
    let doneBeforeRoutePluginExecution = (errCount) => {
        let aPromise = plugin_1.AfterRoute(request, response, routeResult);
        aPromise.then(doneAfterRoutePluginExecution);
    };
    bPromise.then(doneBeforeRoutePluginExecution);
}
exports.RoutePath = RoutePath;
function NoRoute(path, req, res) {
    let variables = global['EnvironmentVariables'];
    path = path.match(/^([^?]*)/)[1];
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
        return rcs_1.RCS.Service().GetUri(path, res, req);
    let filepath = nodepath.resolve(variables.ServerBaseDir, variables.WebDir, path.substr(1));
    if (!path.endsWith('/') && fs.existsSync(filepath)) {
        if (/\.[a-z\d]*$/i.test(filepath))
            res.setHeader('content-type', content_type_1.ContentType.GetContentType(filepath.match(/\.[a-z\d]*$/i)[0]));
        else
            res.setHeader('content-type', 'text/plain');
        res.write(fs.readFileSync(filepath));
        res.end();
    }
    else {
        res.setHeader('content-type', 'text/html');
        res.writeHead(404);
        let pageNotFound = '';
        if (!variables.PageNotFound || variables.PageNotFound.length === 0)
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
