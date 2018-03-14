/**
 * DBProvider Base
 * 
 * ServerHub MVC, MIT License
 * March 14, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

abstract class DBProvider {
    protected readonly abstract Name: string;
    protected readonly abstract Version: string;
    protected Configuration: IConfigObject;
    constructor(config?: IConfigObject) {
        if (config) {
            this.Configuration = config;
        } else config = void 0;
    }
    public abstract GetConnection(config?: IConfigObject);
}

interface IConfigObject {
    Host: string;
    Username: string;
    Password: string;
    [x: string]: string;
}

export { DBProvider, IConfigObject };