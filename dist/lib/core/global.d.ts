export interface GlobalEnvironmentVariables {
    ServerBaseDir: string;
    Port: Array<number>;
    PageNotFound: string;
    ControllerDir: string;
    ViewDir: string;
    ModelDir: string;
    Controllers: Array<string>;
    WebDir: string;
    MaxCacheSize: number;
    DBProvider: string;
    DBConnectionString: string;
    PackageData: Object;
    DefaultPages: Array<string>;
    AsyncOperationTimeout: number;
    PluginDir: string;
    Verbose: boolean;
    TLSOptions: TLSConfiguration;
    RedirectToTLS: true;
    Hostname: string;
    LogConfig: LogConfiguration;
}
export interface LogConfiguration {
    Dir: string;
    MaxSize: number;
    Access: boolean;
    Error: boolean;
    Runtime: boolean;
    Filename: string;
}
export interface TLSConfiguration {
    Port: Array<number>;
    Cert: string;
    Key: string;
    CA: string;
}
