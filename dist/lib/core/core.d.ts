/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { Route } from '../route/route';
export declare function RegisterController(controllerJs: string): void;
export declare function RegisterControllerM(controllerJs: string): void;
export declare function UpdateGlobalVariable(variable: string, value: Object): boolean;
export declare function SetGlobalVariable(variable: string, value: Object): void;
export declare function RoutePath(path: string, request: IncomingMessage, res: ServerResponse): void;
export declare function RegisterRouter(route: Route): void;
