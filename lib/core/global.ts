/**
 * Interface of global environment variables. With TypeScript, import this file and use `let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables` to get access to the environment variables.
 */
export interface GlobalEnvironmentVariables {
    ServerBaseDir: string;
    Port: number;
    PageNotFound: string;
    ControllerDir: string;
    ViewDir: string;
    ModelDir: string;
    Controllers: Array<string>;
    WebDir: string;
    MaxCacheSize: number; // byte
};
