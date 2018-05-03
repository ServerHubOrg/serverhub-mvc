/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import { RouteValue } from "../../route";
declare function BeforeRoute(request: IncomingMessage, response: ServerResponse): Promise<number>;
declare function AfterRoute(request: IncomingMessage, response: ServerResponse, route: RouteValue): Promise<number>;
declare function AutoRegister(): Object;
declare function RegisterPlugin(plugin_name: string): boolean;
declare function GetRegisteredPlugins(): Array<string>;
export { AutoRegister, BeforeRoute, AfterRoute, RegisterPlugin, GetRegisteredPlugins };
