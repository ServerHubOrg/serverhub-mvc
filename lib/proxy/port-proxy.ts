import { createServer, IncomingMessage, ServerResponse, Server as HTTPServer } from "http";
import { createServer as screateServer, Server as HTTPSServer } from "https";
import { isIPv4 as IsIPv4 } from "net";
import * as request from "request";
import { TLSConfiguration } from "../core/global";
import * as colors from 'colors';

/**
 * Proxy (Port Forwarding) Library
 * 
 * Zhongdong Yang, 2018-8-27
 * 
 * Forward all requests coming in the specificed port to another port on a target server (localhost is recommended).
 * 
 * If configure proxy to another server, such as google.com, service may fail to serve due to same origin policy.
 */

export interface IRedirectEntry {
    Hostname: string;
    ForwardHostname: string;
    ForwardPort: number;
}

export interface IRedirectTable extends Array<IRedirectEntry> { };

/**
 * Check if an input string is a valid hostname (not IP schema).
 * @param str String to test
 */
function IsDomain (str: string): boolean {
    if (str.match(/^([?a-z0-9-.\+]{2,256}\.[a-z]{2,4}\b)|(localhost)$/i)) return true;
    else return false;
}

/**
 * Try to hit one registered redirection configuration in storage.
 * @param str Target domain with port number to query. eg: localhost:8080
 * @param col RedirectEntry table collection
 */
function QueryDomain (str: string, col: IRedirectTable): IRedirectEntry {
    let entry: IRedirectEntry = void 0;
    let host = str.match(/([^:]+)(?::[\d]+)?$/i)[1];
    col.forEach(ent => {
        if (host.endsWith(ent.Hostname))
            entry = {
                ForwardHostname: ent.ForwardHostname,
                ForwardPort: ent.ForwardPort,
                Hostname: ent.Hostname
            } as IRedirectEntry;
    });
    return entry;
}

/**
 * Combine HTTP protocol, hostname and port number to a simplified string.
 * @param tls Whether this is a TLS connection
 * @param host Hostname
 * @param port Port number
 */
function GetHostString (tls: boolean, host: string, port: number): string {
    let str = host + ([80, 443].includes(port) ? '' : ':' + port.toString()) + '/';
    if (tls) {
        return 'https://' + str;
    } else {
        return 'http://' + str;
    }
}

const filteredTable: IRedirectTable = new Array<IRedirectEntry>(0);
let TLS = false;

/**
 * Handles incoming requests and forwards to another port.
 * @param req Incoming HTTP(S) request
 * @param res Outgoing response
 */
const connectionListener = async (req: IncomingMessage, res: ServerResponse) => {
    let entry = QueryDomain(req.headers.host, filteredTable);
    if (req.headers && req.headers.host && entry) {
        try {
            let options = {
                headers: req.headers,
                method: req.method,
                followAllRedirects: true,
                followRedirect: true
            } as request.CoreOptions;

            options.headers.referer = GetHostString(!!TLS, entry.ForwardHostname, entry.ForwardPort);
            options.headers.host = entry.ForwardHostname + ':' + entry.ForwardPort;
            options.host = entry.ForwardHostname + ':' + entry.ForwardPort;
            
            let r = request(GetHostString(!!TLS, entry.ForwardHostname, entry.ForwardPort), options);
            r.on('response', (rs) => {
                res.writeHead(rs.statusCode, rs.headers);
            });
            r.pipe(res);

            if (req.method !== 'GET') {
                req.pipe(r);
            }
        } catch (e) {
            if (res.headersSent) res.end('');
            else {
                res.writeHead(502, 'Proxy Error');
                res.end((e as Error).message);
            }
        }
    } else {
        res.setHeader('content-type', 'text/plain');
        res.writeHead(404, 'Service Not Found');
        res.end('Your service is not available.');
    }
};

let PROXY_LISTENING = false;
let PROXY_COUNT = 1;

/**
 * Register configuration and start a proxy server.
 * @param table Configuration table
 * @param proxy_port Port to start proxy listener
 * @param https Apply if you want to start a TLS listener
 */
export default function (table: IRedirectTable, proxy_port = 8080, https?: TLSConfiguration): void {
    if (PROXY_LISTENING) {
        console.log(colors.red('!! Only one instance of proxy is allowed to register. Proxy ' + PROXY_COUNT + ' (' + proxy_port + ') cannot be registered.'));
        return;
    }
    PROXY_LISTENING = true;
    PROXY_COUNT++;

    if (table) {
        // validation
        table.forEach(ent => {
            if ((IsIPv4(ent.Hostname) || IsDomain(ent.Hostname)) && ent.ForwardPort < 65536 && ent.ForwardPort > 0) {
                filteredTable.push(ent);
            }
        });
        let server: HTTPServer | HTTPSServer;
        if (!https) {
            server = createServer(connectionListener)
        } else {
            TLS = true;
            server = screateServer({
                key: https.Key,
                cert: https.Cert,
                ca: https.CA
            }, connectionListener);
        }
        server.on('listening', () => {
            console.log('ServerHub Proxy started listening on', proxy_port, https ? `with TLS` : '');
        })
        server.listen(proxy_port);
    } else throw new Error('A redirection configuration table is required.');
}