declare abstract class DBProvider {
    protected readonly abstract Name: string;
    protected readonly abstract Version: string;
    protected Configuration: IConfigObject;
    constructor(config?: IConfigObject);
    abstract GetConnection(config?: IConfigObject): any;
}
interface IConfigObject {
    Host: string;
    Username: string;
    Password: string;
    [x: string]: string;
}
export { DBProvider, IConfigObject };
