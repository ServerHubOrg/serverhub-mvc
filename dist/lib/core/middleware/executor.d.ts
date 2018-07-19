/// <reference types="node" />
import { IncomingMessage } from "http";
import { MiddlewareBundle } from "./middleware";
export default class MiddlewareExecutor {
    private exec_index;
    Run(req: IncomingMessage, path: string): MiddlewareBundle;
    private Step(mb);
}
