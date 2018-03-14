"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DBProvider {
    constructor(config) {
        if (config) {
            this.Configuration = config;
        }
        else
            config = void 0;
    }
}
exports.DBProvider = DBProvider;
