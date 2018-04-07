import { DBProvider, IConfigObject } from "./base";
declare class DBMySQL extends DBProvider {
    protected readonly Name: string;
    protected readonly Version: string;
    constructor(config?: IConfigObject);
    GetConnection(config?: IConfigObject): Object;
}
export { DBMySQL };
