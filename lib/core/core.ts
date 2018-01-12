import * as controller from './controller/controller';
import { GlobalEnvironmentVariables } from './global';
import { IncomingMessage, ServerResponse } from 'http';
import { ErrorManager, RuntimeError } from './error/error';
import * as nodepath from 'path';
import * as fs from 'fs';
import { ContentType } from './content-type';
import { Route } from '../route/route';
import { RCS } from './cache/rcs';

const package_version = process.env.npm_package_version;
const node_version = process.version;

global['EnvironmentVariables'] = global['EnvironmentVariables'] ? global['EnvironmentVariables'] : {
    ServerBaseDir: __dirname,
    ControllerDir: 'controller/',
    ViewDir: 'view/',
    ModelDir: 'model/',
    PageNotFound: '404.html',
    WebDir: 'www',
    MaxCacheSize: 200, // MB
} as GlobalEnvironmentVariables;

const core_env = {
    platform: process.platform,
    version: '0.0.2',
    node_version: process.version
}

export function RegisterController(controllerJs: string) {
    return controller.Controller.Register(controllerJs);
}

export function UpdateGlobalVariable(variable: string, value: Object): boolean {
    if (global['EnvironmentVariables'].hasOwnProperty(variable)) { global['EnvironmentVariables'][variable] = value; return true; }
    return false;
}

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

export function RoutePath(path: string, req: IncomingMessage, res: ServerResponse): void {
    // TODO: Should be removed.

    res.setHeader('server', `ServerHub/${package_version} (${process.platform}) Node.js/${node_version}`);


    if (path.indexOf('changrui0926') !== -1)
        return RCS.Service().GetCacheReport(res);


    let routeResult = ROUTE.RunRoute(path);
    res.setHeader('server', `ServerHub/${core_env.version} (${core_env.platform}) Node.js ${core_env.node_version}`);
    // console.log(routeResult); // TODO, remove when release
    if (!routeResult)
        return NoRoute(path, req, res);
    // TODO
    // Map route to custom controllers.
    // let pathMatch = path.match(/(\/[a-z0-9._]*)/g);

    let method = req.method.toLowerCase();
    if (routeResult.Controller && routeResult.Action) {
        // if (pathMatch[0].indexOf('.') !== -1) {
        //     // no dot allowed in controller names.
        //     return NoRoute(path, req, res);
        // }
        try {
            return (() => { controller.Controller.Dispatch(method, routeResult, req, res); })();
        } catch (error) {
            res.setHeader('content-type', 'text/html');
            res.write(ErrorManager.RenderErrorAsHTML(error));
            res.end();
        }

    }
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
