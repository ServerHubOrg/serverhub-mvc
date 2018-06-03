/**
 * Global Environment Variable Definition Entry
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

/**
 * Interface of global environment variables. 
 * With TypeScript, import this file and use `let variables = global['EnvironmentVariables'] 
 * as GlobalEnvironmentVariables` to get access to the environment variables.
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
    MaxCacheSize: number; // unit byte
    DBProvider: string;
    DBConnectionString: string;
    PackageData: Object;
    DefaultPages: Array<string>;
    AsyncOperationTimeout: number; // milliseconds
    PluginDir: string;
    Verbose: boolean;
    TLSOptions: TLSConfiguration;
    RedirectToTLS: true;
    Hostname: string;
    LogConfig: LogConfiguration;
};

export interface LogConfiguration {
    Dir: string;
    MaxSize: number;
    Access: boolean;
    Error: boolean;
    Runtime: boolean;
    Filename: string;
}
export interface TLSConfiguration {
    Port: number;
    Cert: string;
    Key: string;
    CA: string;
}
