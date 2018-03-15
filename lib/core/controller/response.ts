/**
 * Server Response Library
 * 
 * ServerHub MVC, MIT License
 * March 15, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */


/**
 * Virtual ServerResponse object. An object wrapper.
 */
class SHResponse {
    private _Headers = {};
    private _StatusCode = 0;
    private _Content = new Buffer('', 'utf8');
    private _HeaderSent = false;
    private _WriteHeadCalled = false;
    private _Finished = false;

    public get headersSent() {
        return this._HeaderSent;
    }
    public get finished() {
        return this._Finished;
    }

    public get statusCode() {
        if (this._StatusCode === 0)
            return 200;
        return this._StatusCode;
    }

    public set statusCode(code: number) {
        if (ValidStatusCode.indexOf(code) !== -1)
            this._StatusCode = code;
        else throw new Error('Not a valid status code');
    }

    public getHeaderNames(): Array<string> {
        return Object.keys(this._Headers);
    }

    public hasHeader(name: string): boolean {
        return this._Headers.hasOwnProperty(name);
    }

    public getContent(encoding = 'utf8'): String {
        return this._Content.toString(encoding);
    }

    public getHeader(name: string): any {
        if (this._HeaderSent) // https://nodejs.org/dist/latest-v9.x/docs/api/http.html#http_response_getheader_name
            return void 0;
        else return this._Headers[name];
    }

    public getHeaders(): Object {
        return Object.assign({}, this._Headers);
    }

    public setHeader(prop: string, value: any) {
        if (this._HeaderSent)
            throw new Error('Header already sent');
        if (ValidHeaders.indexOf(prop) !== -1) {
            this._Headers[prop] = value;
        }
    }

    public removeHeader(header: string): boolean {
        if (this._Headers.hasOwnProperty(header)) {
            delete this._Headers[header];
            return true;
        } return false;
    }

    public write(chunk: string | Buffer, encoding = 'utf8'): boolean {
        if (this._Finished)
            throw new Error('Response is already finished.')
        if (this._Content.length > 0) {
            if (Buffer.isBuffer(chunk)) {
                this._Content = Buffer.concat([this._Content, chunk], this._Content.length + (chunk as Buffer).length);
            } else {
                let tempBuf = Buffer.from(chunk);
                this._Content = Buffer.concat([this._Content, tempBuf], this._Content.length + tempBuf.length);
            }
        }
        else if (Buffer.isBuffer(chunk)) this._Content = chunk;
        else this._Content = Buffer.from(chunk.toString());
        this._HeaderSent = true;
        return true;
    }

    public end(chunk?: string | Buffer, encoding = 'utf8'): boolean {
        if (chunk)
            this.write(chunk, encoding)
        this._Finished = true;
        return true;
    }

    public writeHead(code: number, header: Object): boolean {
        // Does not support statusMessage parameter from Node.js.
        if (this._WriteHeadCalled || this._HeaderSent)
            throw new Error('header sent already called.')
        if (ValidStatusCode.indexOf(code) !== -1)
            this._StatusCode = code;
        else throw new Error('Invalid HTTP response status code.');
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


export { SHResponse };