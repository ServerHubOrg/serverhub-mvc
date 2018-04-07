/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import { RouteValue } from "../../route";
export default interface Plugin {
    support_version: string;
    version: string;
    phase: string;
    app_name: string;
    main: (request: IncomingMessage, response: ServerResponse, route?: RouteValue) => void;
}
