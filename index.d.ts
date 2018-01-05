import { Route } from "./dist/lib/route/route";

export declare function Run(config: ServerHubConfig, appstart: (route: Route) => void): void;

export declare interface ServerHubConfig {
    Port: number;
    BaseDir: string;
    WebDir: string;
    PageNotFound: string;
    ControllerDir: string;
    ViewDir: string;
    ModelDir: string;
    Controllers: Array<string>;
}