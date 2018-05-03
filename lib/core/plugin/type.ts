import { IncomingMessage, ServerResponse } from "http";
import { Route, RouteValue } from "../../route";

/**
 * Plugin Type Definition
 * 
 * ServerHub MVC, MIT License
 * March 27, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

/**
 * Provide type definition for plugins. All properties are lower-case because
 * it is a mapping for developers using Node.js (CamelCase for inner use)
 */
export default interface Plugin {
    version_support: string;
    version: string;
    phase: string;
    app_name: string;
    main: (request: IncomingMessage, response: ServerResponse, route?: RouteValue) => Promise<boolean>;
}