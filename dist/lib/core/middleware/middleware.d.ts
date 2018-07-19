/// <reference types="node" />
import { IncomingMessage } from "http";
export interface MiddlewareBundle {
    Path: string;
    Req: IncomingMessage;
}
export interface Middleware {
    Main: (req: IncomingMessage, path?: string) => MiddlewareBundle;
    Filter: string | RegExp;
}
