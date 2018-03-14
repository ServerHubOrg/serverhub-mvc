"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const mysql = require("mysql");
class DBMySQL extends base_1.DBProvider {
    constructor(config) {
        super(config);
        this.Name = "MySQL Provider";
        this.Version = '0.1.0-b';
    }
    GetConnection(config) {
        let tempConfig = {};
        if (config) {
            tempConfig['user'] = config.Username;
            tempConfig['password'] = config.Password;
            tempConfig['host'] = config.Host;
        }
        else if (this.Configuration) {
            tempConfig['user'] = this.Configuration.Username;
            tempConfig['password'] = this.Configuration.Password;
            tempConfig['host'] = this.Configuration.Host;
        }
        else
            throw new Error('Either constructor or method configuration must be provided');
        let conn = mysql.createConnection(tempConfig);
        return conn;
    }
}
exports.DBMySQL = DBMySQL;
