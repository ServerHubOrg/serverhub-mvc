/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import { RouteValue } from "../../route/route";
export declare class Controller {
    private static Collection;
    static Register(controller: string): void;
    static Unregister(controllerName: string): void;
    static Dispatch(method: string, route: RouteValue, request: IncomingMessage, response: ServerResponse): Promise<boolean>;
    static Dispatchable(controllerName: string, actionName: string): boolean;
}
