import { TLSConfiguration } from "../core/global";
export interface IRedirectEntry {
    Hostname: string;
    RemoteHostname: string;
    RemotePort: number;
}
export interface IRedirectTable extends Array<IRedirectEntry> {
}
export default function (table: IRedirectTable, proxy_port?: number, https?: TLSConfiguration): void;
