import { ServerResponse, OutgoingHttpHeaders } from "http";
import { Writable } from "stream";
import * as net from 'net';

class ServerHubResponse implements ServerResponse {
    public __length__ = 0;
    get __res__ () {
        return this.res;
    }
    private res: ServerResponse;
    get statusCode () {
        return this.res.statusCode;
    };
    get statusMessage () {
        return this.res.statusMessage;
    }
    get upgrading () {
        return this.res.upgrading;
    };
    get chunkedEncoding () {
        return this.res.chunkedEncoding;
    };
    get shouldKeepAlive () {
        return this.res.shouldKeepAlive;
    };
    get useChunkedEncodingByDefault () {
        return this.res.useChunkedEncodingByDefault;
    };
    get sendDate () {
        return this.res.sendDate;
    };
    get finished () {
        return this.res.finished;
    };
    get headersSent () {
        return this.res.headersSent;
    };
    get connection () {
        return this.res.connection;
    };
    get writable () {
        return this.res.writable;
    };
    set statusCode (number: number) {
        this.res.statusCode = number;
    }
    set statusMessage (m: string) {
        this.res.statusMessage = m;
    }
    set upgrading (v: boolean) {
        this.res.upgrading = v;
    };
    set chunkedEncoding (v: boolean) {
        this.res.chunkedEncoding = v;
    };
    set shouldKeepAlive (v: boolean) {
        this.res.shouldKeepAlive = v;
    };
    set useChunkedEncodingByDefault (v: boolean) {
        this.res.useChunkedEncodingByDefault = v;
    };
    set sendDate (v: boolean) {
        this.res.sendDate = v;
    };
    set connection (s: net.Socket) {
        this.res.connection = s;

    };
    set writable (v: boolean) {
        this.res.writable = v;
    };
    get writableHighWaterMark () {
        return this.res.writableHighWaterMark;
    };

    constructor(res: ServerResponse) {
        this.res = res;
    }
    public write (chunk: any, cb?: Function): boolean;
    public write (chunk: any, encoding?: string, cb?: Function): boolean;
    public write (chunk: any, encoding?: string | Function, cb?: Function): boolean {
        if (typeof chunk === 'string')
            this.__length__ += chunk.length;
        else if (chunk instanceof Buffer)
            this.__length__ += chunk.byteLength;
        else this.__length__ += chunk.toString().length;
        if (encoding && typeof encoding === 'string')
            return this.res.write(chunk.toString(), encoding, cb);
        else return this.res.write(chunk, cb);
    }

    public _write (chunk: any, encoding: string, callback: (err?: Error) => void): void { this.res._write(chunk, encoding, callback) };
    public _writev?(chunks: Array<{ chunk: any, encoding: string }>, callback: (err?: Error) => void): void { this.res._writev(chunks, callback) };
    public _destroy (err: Error, callback: Function): void { this.res._destroy(err, callback) };
    public _final (callback: Function): void { this.res._final(callback) };
    public pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T { return this.res.pipe<T>(destination, options) };
    public setDefaultEncoding (encoding: string): this { this.res.setDefaultEncoding(encoding); return this };
    public end (cb?: Function): void;
    public end (chunk: any, cb?: Function): void;
    public end (chunk: any, encoding?: string, cb?: Function): void;
    public end (chunk: any, encoding?: string | Function, cb?: Function): void {
        if (typeof chunk === 'string')
            this.__length__ += chunk.length;
        else if (chunk instanceof Buffer)
            this.__length__ += chunk.byteLength;
        else if (chunk && !(chunk instanceof Function)) { this.__length__ += chunk.toString().length; }
        else return this.res.end(chunk); // execute as callback function.

        if (encoding && typeof encoding === 'string')
            return this.res.end(chunk.toString(), encoding, cb);
        else return this.res.end(chunk, cb);
    };
    public cork (): void { this.res.cork() };
    public uncork (): void { this.res.uncork() };
    public assignSocket (socket: net.Socket): void { this.res.assignSocket(socket) };
    public detachSocket (socket: net.Socket): void { this.res.detachSocket(socket) };
    public writeContinue (callback?: () => void): void { this.res.writeContinue(callback) };
    public writeHead (statusCode: number, headers?: OutgoingHttpHeaders): void;
    public writeHead (statusCode: number, reasonPhrase?: string, headers?: OutgoingHttpHeaders): void;
    public writeHead (statusCode: number, reasonPhrase?: string | OutgoingHttpHeaders, headers?: OutgoingHttpHeaders): void {
        if (reasonPhrase && typeof reasonPhrase === 'string') {
            this.res.writeHead(statusCode, reasonPhrase, headers);
        } else this.res.writeHead(statusCode, reasonPhrase as OutgoingHttpHeaders);
    };
    public setTimeout (msecs: number, callback?: () => void): this { this.res.setTimeout(msecs, callback); return this; };
    public destroy (error: Error): void { return this.res.destroy(error); };
    public setHeader (name: string, value: number | string | string[]): void { return this.res.setHeader(name, value); };
    public getHeader (name: string): number | string | string[] | undefined { return this.res.getHeader(name) };
    public getHeaders (): OutgoingHttpHeaders { return this.res.getHeaders() };
    public getHeaderNames (): string[] { return this.res.getHeaderNames(); };
    public hasHeader (name: string): boolean { return this.res.hasHeader(name); };
    public removeHeader (name: string): void { return this.res.removeHeader(name); };
    public addTrailers (headers: OutgoingHttpHeaders | Array<[string, string]>): void { return this.res.addTrailers(headers); };
    public flushHeaders (): void { return this.res.flushHeaders() };
    public addListener (event: string, listener: (...args: any[]) => void): this { this.res.addListener(event, listener); return this; };
    public emit (event: string | symbol, ...args: any[]): boolean { return this.res.emit(event, ...args); };
    public on (event: string, listener: (...args: any[]) => void): this { this.res.on(event, listener); return this; };
    public once (event: string, listener: (...args: any[]) => void): this { this.res.once(event, listener); return this; };
    public prependListener (event: string, listener: (...args: any[]) => void): this { this.res.prependListener(event, listener); return this; };
    public prependOnceListener (event: string, listener: (...args: any[]) => void): this { this.res.prependOnceListener; return this; };
    public removeListener (event: string, listener: (...args: any[]) => void): this { this.res.removeListener(event, listener); return this; };
    public removeAllListeners (event?: string | symbol): this { this.res.removeAllListeners(event); return this; };
    public setMaxListeners (n: number): this { this.res.setMaxListeners(n); return this; };
    public getMaxListeners (): number { return this.res.getMaxListeners() };
    public listeners (event: string | symbol): Function[] { return this.res.listeners(event); };
    public listenerCount (type: string | symbol): number { return this.res.listenerCount(type) };
    public eventNames (): Array<string | symbol> { return this.res.eventNames() };
}

export { ServerHubResponse };