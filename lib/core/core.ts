/**
 * Core Entry
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import * as controller from './controller/index';
import { GlobalEnvironmentVariables } from './global';
import { IncomingMessage, ServerResponse } from 'http';
import { ErrorManager, RuntimeError } from './error/error';
import * as nodepath from 'path';
import * as fs from 'fs';
import { ContentType } from './content-type';
import { Route } from '../route/route';
import { RCS } from './cache/rcs';


const node_version = process.version;

// Export initial values to global object of Node.
global['EnvironmentVariables'] = global['EnvironmentVariables'] ? global['EnvironmentVariables'] : {
    ServerBaseDir: __dirname,
    ControllerDir: 'controller/',
    ViewDir: 'view/',
    ModelDir: 'model/',
    PageNotFound: '404.html',
    WebDir: 'www/',
    MaxCacheSize: 350, // MB
    DBProvider: 'mysql',
    DBConnectionString: null
} as GlobalEnvironmentVariables;

/**
 * Environment variables for ServerHub.
 */
const core_env = {
    platform: process.platform,
    node_version: node_version
}

/**
 * Expose to developer using ServerHub. Developers can use this function to register custom controllers.
 * @param controllerJs Controller file name
 */
export function RegisterController(controllerJs: string) {
    return controller.Controller.Register(controllerJs);
}

/**
 * Update global variable with new value.
 * @param variable Which global variable to update
 * @param value New value of the global variable.
 */
export function UpdateGlobalVariable(variable: string, value: Object): boolean {
    if (global['EnvironmentVariables'].hasOwnProperty(variable)) { global['EnvironmentVariables'][variable] = value; return true; }
    return false;
}

/**
 * Can both update and add new global variable.
 * @param variable What global variable to set
 * @param value Value of the variable
 */
export function SetGlobalVariable(variable: string, value: Object): void {
    global['EnvironmentVariables'][variable] = value;
}


// var PreOrderMiddleware = new Array<(req: IncomingMessage, res: ServerResponse, next: any) => void>(0);
// var PostOrderMiddleware = new Array<(req: IncomingMessage, res: ServerResponse, next: any) => void>(0);


// export enum MiddlewareType {
//     POST = 1,
//     PRE = 0
// };
// export function Use(type: MiddlewareType, middleware: (req: IncomingMessage, res: ServerResponse, next: any) => void): void {
//     if (!middleware)
//         return;
//     if (type === MiddlewareType.POST) {
//         PostOrderMiddleware.push(middleware);
//     } else if (type === MiddlewareType.PRE) {
//         PreOrderMiddleware.push(middleware);
//     }
// }


/**
 * Route a specific path.
 * @param path Path to be routed.
 * @param req Incomming message (request)
 * @param res Server response (response)
 */
export function RoutePath(path: string, req: IncomingMessage, res: ServerResponse): void {


    // TODO: Should be removed.
    if (path.indexOf('changrui0926') !== -1)
        return RCS.Service().GetCacheReport(res);

    let routeResult = ROUTE.RunRoute(path);
    res.setHeader('server', `ServerHub/${(global['EnvironmentVariables'] as GlobalEnvironmentVariables).PackageData['version']} (${core_env.platform}) Node.js ${core_env.node_version}`);

    if (!routeResult)
        return NoRoute(path, req, res);

    let method = req.method.toLowerCase();
    if (routeResult.Controller && routeResult.Action) {
        try {
            return (() => { controller.Controller.Dispatch(method, routeResult, req, res); })();
        } catch (error) {
            console.error(error);
            if (!res.headersSent)
                res.setHeader('content-type', 'text/html');
            if (!res.writable)
                res.write(ErrorManager.RenderErrorAsHTML(error));
            res.end();
        }

    } else
        return NoRoute(path, req, res);
}

function NoRoute(path: string, req: IncomingMessage, res: ServerResponse): void {
    let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;

    // if cacheable, do not fetch from file system.
    if (RCS.Service().Cacheable(path))
        return RCS.Service().GetUri(path, res);

    let filepath = nodepath.resolve(variables.ServerBaseDir, variables.WebDir, path.substr(1));
    if (fs.existsSync(filepath)) {
        res.setHeader('content-type', ContentType.GetContentType(path.match(/\.[a-z\d]*$/i)[0]));
        res.write(fs.readFileSync(filepath));
        res.end();
    } else {
        res.setHeader('content-type', 'text/html');
        res.writeHead(404);
        res.write(fs.readFileSync(nodepath.resolve(__dirname, '404.html')).toString());
        res.end();
    }
}
var ROUTE: Route;
export function RegisterRouter(route: Route): void {
    ROUTE = route;
}
