"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const https_1 = require("https");
const net_1 = require("net");
const request = require("request");
const colors = require("colors");
;
function IsDomain(str) {
    if (str.match(/^([?a-z0-9-.\+]{2,256}\.[a-z]{2,4}\b)|(localhost)$/i))
        return true;
    else
        return false;
}
function QueryDomain(str, col) {
    let entry = void 0;
    let host = str.match(/([^:]+)(?::[\d]+)?$/i)[1];
    col.forEach(ent => {
        if (host.endsWith(ent.Hostname))
            entry = {
                RemoteHostname: ent.RemoteHostname,
                RemotePort: ent.RemotePort,
                Hostname: ent.Hostname
            };
    });
    return entry;
}
function GetHostString(tls, host, port) {
    let str = host + ([80, 443].includes(port) ? '' : ':' + port.toString()) + '/';
    if (tls) {
        return 'https://' + str;
    }
    else {
        return 'http://' + str;
    }
}
const filteredTable = new Array(0);
let TLS = false;
const connectionListener = (req, res) => __awaiter(this, void 0, void 0, function* () {
    let entry = QueryDomain(req.headers.host, filteredTable);
    if (req.headers && req.headers.host && entry) {
        try {
            let options = {
                headers: req.headers,
                method: req.method,
                followAllRedirects: true,
                followRedirect: true
            };
            options.headers.referer = GetHostString(!!TLS, entry.RemoteHostname, entry.RemotePort);
            options.headers.host = entry.RemoteHostname + ':' + entry.RemotePort;
            options.host = entry.RemoteHostname + ':' + entry.RemotePort;
            console.log(options.headers);
            let r = request(GetHostString(!!TLS, entry.RemoteHostname, entry.RemotePort), options);
            r.on('response', (rs) => {
                res.writeHead(rs.statusCode, rs.headers);
            });
            r.pipe(res);
            if (req.method !== 'GET') {
                req.pipe(r);
            }
        }
        catch (e) {
            if (res.headersSent)
                res.end('');
            else {
                res.writeHead(502, 'Proxy Error');
                res.end(e.message);
            }
        }
    }
    else {
        res.setHeader('content-type', 'text/plain');
        res.writeHead(404, 'Service Not Found');
        res.end('Your service is not available.');
    }
});
let PROXY_LISTENING = false;
let PROXY_COUNT = 1;
function default_1(table, proxy_port = 8080, https) {
    if (PROXY_LISTENING) {
        console.log(colors.red('!! Only one instance of proxy is allowed to register. Proxy ' + PROXY_COUNT + ' (' + proxy_port + ') cannot be registered.'));
        return;
    }
    PROXY_LISTENING = true;
    PROXY_COUNT++;
    if (table) {
        table.forEach(ent => {
            if ((net_1.isIPv4(ent.Hostname) || IsDomain(ent.Hostname)) && ent.RemotePort < 65536 && ent.RemotePort > 0) {
                filteredTable.push(ent);
            }
        });
        let server;
        if (!https) {
            server = http_1.createServer(connectionListener);
        }
        else {
            TLS = true;
            server = https_1.createServer({
                key: https.Key,
                cert: https.Cert,
                ca: https.CA
            }, connectionListener);
        }
        server.on('listening', () => {
            console.log('ServerHub Proxy started listening on', proxy_port, https ? `with TLS` : '');
        });
        server.listen(proxy_port);
    }
    else
        throw new Error('A redirection configuration table is required.');
}
exports.default = default_1;
