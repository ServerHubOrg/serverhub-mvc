/**
 * MySQL DBProvider
 * 
 * ServerHub MVC, MIT License
 * March 14, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import { DBProvider, IConfigObject } from "./base";
import * as mysql from "mysql";

class DBMySQL extends DBProvider {
    protected readonly Name = "MySQL Provider";
    protected readonly Version = '0.1.0-b';
    constructor(config?: IConfigObject) {
        super(config);
    }
    public GetConnection(config?: IConfigObject): Object {
        let tempConfig = {};
        if (config) {
            // ignore constructor configuration
            tempConfig['user'] = config.Username;
            tempConfig['password'] = config.Password;
            tempConfig['host'] = config.Host;
        } else if (this.Configuration) {
            tempConfig['user'] = this.Configuration.Username;
            tempConfig['password'] = this.Configuration.Password;
            tempConfig['host'] = this.Configuration.Host;
        } else throw new Error('Either constructor or method configuration must be provided');

        let conn = mysql.createConnection(tempConfig);
        return conn;
    }
}

export { DBMySQL };