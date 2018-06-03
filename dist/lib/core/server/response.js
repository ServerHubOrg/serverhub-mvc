"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerHubResponse {
    constructor(res) {
        this.__length__ = 0;
        this.res = res;
    }
    get __res__() {
        return this.res;
    }
    get statusCode() {
        return this.res.statusCode;
    }
    ;
    get statusMessage() {
        return this.res.statusMessage;
    }
    get upgrading() {
        return this.res.upgrading;
    }
    ;
    get chunkedEncoding() {
        return this.res.chunkedEncoding;
    }
    ;
    get shouldKeepAlive() {
        return this.res.shouldKeepAlive;
    }
    ;
    get useChunkedEncodingByDefault() {
        return this.res.useChunkedEncodingByDefault;
    }
    ;
    get sendDate() {
        return this.res.sendDate;
    }
    ;
    get finished() {
        return this.res.finished;
    }
    ;
    get headersSent() {
        return this.res.headersSent;
    }
    ;
    get connection() {
        return this.res.connection;
    }
    ;
    get writable() {
        return this.res.writable;
    }
    ;
    set statusCode(number) {
        this.res.statusCode = number;
    }
    set statusMessage(m) {
        this.res.statusMessage = m;
    }
    set upgrading(v) {
        this.res.upgrading = v;
    }
    ;
    set chunkedEncoding(v) {
        this.res.chunkedEncoding = v;
    }
    ;
    set shouldKeepAlive(v) {
        this.res.shouldKeepAlive = v;
    }
    ;
    set useChunkedEncodingByDefault(v) {
        this.res.useChunkedEncodingByDefault = v;
    }
    ;
    set sendDate(v) {
        this.res.sendDate = v;
    }
    ;
    set connection(s) {
        this.res.connection = s;
    }
    ;
    set writable(v) {
        this.res.writable = v;
    }
    ;
    get writableHighWaterMark() {
        return this.res.writableHighWaterMark;
    }
    ;
    write(chunk, encoding, cb) {
        if (typeof chunk === 'string')
            this.__length__ += chunk.length;
        else if (chunk instanceof Buffer)
            this.__length__ += chunk.byteLength;
        else
            this.__length__ += chunk.toString().length;
        if (encoding && typeof encoding === 'string')
            return this.res.write(chunk.toString(), encoding, cb);
        else
            return this.res.write(chunk, cb);
    }
    _write(chunk, encoding, callback) { this.res._write(chunk, encoding, callback); }
    ;
    _writev(chunks, callback) { this.res._writev(chunks, callback); }
    ;
    _destroy(err, callback) { this.res._destroy(err, callback); }
    ;
    _final(callback) { this.res._final(callback); }
    ;
    pipe(destination, options) { return this.res.pipe(destination, options); }
    ;
    setDefaultEncoding(encoding) { this.res.setDefaultEncoding(encoding); return this; }
    ;
    end(chunk, encoding, cb) {
        if (typeof chunk === 'string')
            this.__length__ += chunk.length;
        else if (chunk instanceof Buffer)
            this.__length__ += chunk.byteLength;
        else if (chunk && !(chunk instanceof Function)) {
            this.__length__ += chunk.toString().length;
        }
        else
            return this.res.end(chunk);
        if (encoding && typeof encoding === 'string')
            return this.res.end(chunk.toString(), encoding, cb);
        else
            return this.res.end(chunk, cb);
    }
    ;
    cork() { this.res.cork(); }
    ;
    uncork() { this.res.uncork(); }
    ;
    assignSocket(socket) { this.res.assignSocket(socket); }
    ;
    detachSocket(socket) { this.res.detachSocket(socket); }
    ;
    writeContinue(callback) { this.res.writeContinue(callback); }
    ;
    writeHead(statusCode, reasonPhrase, headers) {
        if (reasonPhrase && typeof reasonPhrase === 'string') {
            this.res.writeHead(statusCode, reasonPhrase, headers);
        }
        else
            this.res.writeHead(statusCode, reasonPhrase);
    }
    ;
    setTimeout(msecs, callback) { this.res.setTimeout(msecs, callback); return this; }
    ;
    destroy(error) { return this.res.destroy(error); }
    ;
    setHeader(name, value) { return this.res.setHeader(name, value); }
    ;
    getHeader(name) { return this.res.getHeader(name); }
    ;
    getHeaders() { return this.res.getHeaders(); }
    ;
    getHeaderNames() { return this.res.getHeaderNames(); }
    ;
    hasHeader(name) { return this.res.hasHeader(name); }
    ;
    removeHeader(name) { return this.res.removeHeader(name); }
    ;
    addTrailers(headers) { return this.res.addTrailers(headers); }
    ;
    flushHeaders() { return this.res.flushHeaders(); }
    ;
    addListener(event, listener) { this.res.addListener(event, listener); return this; }
    ;
    emit(event, ...args) { return this.res.emit(event, ...args); }
    ;
    on(event, listener) { this.res.on(event, listener); return this; }
    ;
    once(event, listener) { this.res.once(event, listener); return this; }
    ;
    prependListener(event, listener) { this.res.prependListener(event, listener); return this; }
    ;
    prependOnceListener(event, listener) { this.res.prependOnceListener; return this; }
    ;
    removeListener(event, listener) { this.res.removeListener(event, listener); return this; }
    ;
    removeAllListeners(event) { this.res.removeAllListeners(event); return this; }
    ;
    setMaxListeners(n) { this.res.setMaxListeners(n); return this; }
    ;
    getMaxListeners() { return this.res.getMaxListeners(); }
    ;
    listeners(event) { return this.res.listeners(event); }
    ;
    listenerCount(type) { return this.res.listenerCount(type); }
    ;
    eventNames() { return this.res.eventNames(); }
    ;
}
exports.ServerHubResponse = ServerHubResponse;
