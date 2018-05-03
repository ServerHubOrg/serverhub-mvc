/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import { RouteValue } from "../../route";
export default interface Plugin {
    version_support: string;
    version: string;
    phase: string;
    app_name: string;
    main: (request: IncomingMessage, response: ServerResponse, route?: RouteValue) => Promise<boolean>;
}
