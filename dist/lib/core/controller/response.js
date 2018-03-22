"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
class SHResponse {
    constructor() {
        this._Headers = {};
        this._StatusCode = 0;
        this._Content = new Buffer('', 'utf8');
        this._HeaderSent = false;
        this._WriteHeadCalled = false;
        this._Finished = false;
    }
    get headersSent() {
        return this._HeaderSent;
    }
    get finished() {
        return this._Finished;
    }
    get statusCode() {
        if (this._StatusCode === 0)
            return 200;
        return this._StatusCode;
    }
    set statusCode(code) {
        if (ValidStatusCode.indexOf(code) !== -1)
            this._StatusCode = code;
        else
            throw new Error('Not a valid status code');
    }
    getHeaderNames() {
        return Object.keys(this._Headers);
    }
    hasHeader(name) {
        return this._Headers.hasOwnProperty(name);
    }
    getContent(encoding = 'utf8') {
        return this._Content.toString(encoding);
    }
    getHeader(name) {
        if (this._HeaderSent)
            return void 0;
        else
            return this._Headers[name];
    }
    getHeaders() {
        return Object.assign({}, this._Headers);
    }
    setHeader(prop, value) {
        if (this._HeaderSent)
            throw new Error('Header already sent');
        if (ValidHeaders.indexOf(prop) !== -1) {
            this._Headers[prop] = value;
        }
    }
    removeHeader(header) {
        if (this._Headers.hasOwnProperty(header)) {
            delete this._Headers[header];
            return true;
        }
        return false;
    }
    write(chunk, encoding = 'utf8') {
        if (this._Finished)
            throw new Error('Response is already finished.');
        let value = (typeof (chunk) === 'string' || Buffer.isBuffer(chunk)) ? chunk : helper_1.JSONX(chunk);
        if (this._Content.length > 0) {
            if (Buffer.isBuffer(value)) {
                this._Content = Buffer.concat([this._Content, value], this._Content.length + value.length);
            }
            else {
                let tempBuf = Buffer.from(value);
                this._Content = Buffer.concat([this._Content, tempBuf], this._Content.length + tempBuf.length);
            }
        }
        else if (Buffer.isBuffer(value))
            this._Content = value;
        else
            this._Content = Buffer.from(value.toString());
        this._HeaderSent = true;
        return true;
    }
    end(chunk, encoding = 'utf8') {
        if (chunk)
            this.write(chunk, encoding);
        this._Finished = true;
        return true;
    }
    writeHead(code, header) {
        if (this._WriteHeadCalled || this._HeaderSent)
            throw new Error('header sent already called.');
        if (ValidStatusCode.indexOf(code) !== -1)
            this._StatusCode = code;
        else
            throw new Error('Invalid HTTP response status code.');
        this._WriteHeadCalled = true;
        if (header)
            Object.keys(header).forEach(headerKey => {
                if (ValidHeaders.indexOf(headerKey) !== -1) {
                    this._Headers[headerKey] = header[headerKey];
                }
            });
        this._HeaderSent = true;
        return true;
    }
}
exports.SHResponse = SHResponse;
const ValidHeaders = [
    'Accept',
    'Accept-Charset',
    'Accept-Encoding',
    'Accept-Language',
    'Accept-Ranges',
    'Access-Control-Allow-Credentials', 'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Origin',
    'Access-Control-Expose-Headers',
    'Access-Control-Max-Age',
    'Access-Control-Request-Headers',
    'Access-Control-Request-Method',
    'Age',
    'Allow',
    'Authorization',
    'Cache-Control',
    'Connection',
    'Content-Disposition',
    'Content-Encoding',
    'Content-Language',
    'Content-Length',
    'Content-Location',
    'Content-Range',
    'Content-Security-Policy',
    'Content-Security-Policy-Report-Only',
    'Content-Type',
    'Cookie',
    'DNT',
    'Date',
    'ETag',
    'Expect',
    'Expect-CT',
    'Expires',
    'Forwarded',
    'From',
    'Host',
    'If-Match',
    'If-Modified-Since',
    'If-Range',
    'If-None-Match',
    'If-Unmodified-Since',
    'Keep-Alive',
    'Last-Modified',
    'Origin',
    'Proxy-Authenticate',
    'Proxy-Authorization',
    'Public-Key-Pins',
    'Public-Key-Pins-Report-Only',
    'Range',
    'Referer',
    'Referer-Policy',
    'Retry-After',
    'Server',
    'Set-Cookie',
    'SourceMap',
    'Strict-Transport-Security',
    'TE',
    'Timing-Allow-Origin',
    'Tk',
    'Trailer',
    'Transfer-Encoding',
    'Upgrade-Insecure-Requests',
    'User-Agent',
    'Vary',
    'Via',
    'WWW-Authenticate',
    'Warning',
    'X-Content-Type-Options',
    'X-DNS-Prefetch-Control',
    'X-Frame-Options',
    'X-XSS-Protectio'
];
const ValidStatusCode = [100, 101, 200, 201, 202, 203, 204, 205, 206, 300, 301, 302, 303, 304, 307, 308, 400, 401, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 426, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 511];
