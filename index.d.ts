import { Route } from "./dist/lib/route/route";
import { TLSConfiguration, LogConfiguration } from "./dist/lib/core/global";
import { IncomingMessage } from "http";
import { MiddlewareBundle } from "./dist/lib/core/middleware/middleware";

export declare function Run (config: ServerHubConfig, appstart: (route: Route) => void): void;

export declare function Middleware (pathFilter: string, main: (req: IncomingMessage, path?: string) => MiddlewareBundle): void;

export declare interface ServerHubConfig {
    Port: Array<number>;
    BaseDir: string;
    WebDir: string;
    PageNotFound: string;
    ControllerDir: string;
    ViewDir: string;
    ModelDir: string;
    Controllers: Array<string>;
    MaxCacheSize: number;
    DBProvider: string;
    DBConnectionString: string;
    DefaultPages: Array<string>;
    AsyncOperationTimeout: number;
    TLSOptions: TLSConfiguration;
    SSLOptions: TLSConfiguration;
    RedirectToTLS: boolean;
    Hostname: string;
    LogConfig: LogConfiguration
}

export declare function Module (name: string): any;
export declare function module (name: string): any;
export declare function Load (name: string): any;
export declare function load (name: string): any;
export declare function ModuleFrom (name: string, relativePath: string): any;
export declare function moduleFrom (name: string, relativePath: string): any;
export declare function LoadFrom (name: string, relativePath: string): any;
export declare function loadFrom (name: string, relativePath: string): any;