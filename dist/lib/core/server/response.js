"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const head_1 = require("./head");
const util_1 = require("../util");
const StatusCode = [
    100,
    101,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    300,
    301,
    302,
    303,
    304,
    307,
    308,
    400,
    401,
    403,
    404,
    405,
    406,
    407,
    408,
    409,
    410,
    411,
    412,
    413,
    414,
    415,
    416,
    417,
    418,
    426,
    428,
    429,
    431,
    451,
    500,
    501,
    502,
    503,
    504,
    505,
    511
];
class CellResponse {
    constructor(res, directWrite = true) {
        this._finished = false;
        this._headersSent = false;
        this._sendDate = true;
        this._socket = res.connection;
        this._DIRECT_WRITE = directWrite;
        this._contentBuffer = Buffer.from('');
        this._res = res;
    }
    get connection() {
        return this._socket;
    }
    get socket() {
        return this._socket;
    }
    get statusCode() {
        return this._statusCode;
    }
    set statusCode(code) {
        if (typeof code === 'string') {
            try {
                code = parseInt(code);
            }
            catch (e) {
                code = 200;
            }
        }
        if (StatusCode.includes(code)) {
            this._statusCode = code;
        }
        else
            this._statusCode = 200;
    }
    get finished() {
        return this._finished;
    }
    get headersSent() {
        return this._headersSent;
    }
    get sendDate() {
        return this._sendDate;
    }
    set sendDate(willSend) {
        this._sendDate = willSend;
    }
    get statusMessage() {
        return this._statusMessage;
    }
    set statusMessage(msg) {
        this._statusMessage = msg;
    }
    addTrailers(headers) {
        if (head_1.ValidHeaders(headers))
            if (this._DIRECT_WRITE) {
                this._res.addTrailers(headers);
            }
            else {
                Object.keys(headers).forEach(he => {
                    this.setHeader(he, headers[he]);
                });
            }
    }
    end(data, encoding, callback) {
        this._socket = null;
        this._finished = true;
        if (this._DIRECT_WRITE) {
            if (!this._res.headersSent)
                this._res.writeHead(this._statusCode, this._statusMessage, this._head);
            return this._res.end(data, encoding, callback);
        }
        if (data) {
            let __encoding = encoding || 'utf8';
            this.write(data, __encoding);
        }
        if (callback) {
            callback();
        }
        if (this._sendDate && !this._head.hasOwnProperty('Date')) {
            if (this._headersSent) {
                this.addTrailers({ 'Date': `${util_1.Generate_DayName()}, ${util_1.Generate_Day()} ${util_1.Generate_Month()} ${util_1.Generate_Year()} ${util_1.Generate_Hours()}:${util_1.Generate_Minutes()}:${util_1.Generate_Seconds()} GMT` });
            }
        }
    }
    getHeader(name) {
        let __name = head_1.TransformHeader(name);
        if (this._head.hasOwnProperty(__name))
            return this._head[__name];
        else
            return void 0;
    }
    getHeaderNames() {
        return Object.keys(this._head);
    }
    getHeaders() {
        return Object.assign({}, this._head);
    }
    getContentBuffer() {
        return Buffer.concat([this._contentBuffer]);
    }
    hasHeader(name) {
        let __name = head_1.TransformHeader(name);
        return Object.keys(this._head).includes(__name);
    }
    removeHeader(name) {
        let __name = head_1.TransformHeader(name);
        if (this._head.hasOwnProperty(__name))
            delete this._head[__name];
    }
    setHeader(name, value) {
        let __name = head_1.TransformHeader(name);
        let head = Object.defineProperty({}, __name, { value: value });
        if (!head_1.ValidHeaders(head))
            return void 0;
        if (__name === 'Date') {
            let date = value instanceof Date ? value : new Date();
            head[__name] = `${util_1.Generate_DayName(date.getDay())}, ${util_1.Generate_Day(date.getDate())} ${util_1.Generate_Month(date.getMonth())} ${util_1.Generate_Year(date.getFullYear())} ${util_1.Generate_Hours(date.getHours())}:${util_1.Generate_Minutes(date.getMinutes())}:${util_1.Generate_Seconds(date.getSeconds())} GMT`;
            this._head[__name] = head[__name];
            head = void 0;
        }
        else {
            this._head[__name] = value;
        }
    }
    setTimeout(msecs, callback) {
        if (this._DIRECT_WRITE) {
            return this._res.setTimeout(msecs, callback);
        }
        else {
            this._socket.setTimeout(msecs, callback);
            return this;
        }
    }
    write(chunk, encoding = 'utf8', callback) {
        if (!this._headersSent) {
            this._headersSent = true;
            if (this._DIRECT_WRITE) {
                this._res.writeHead(this._statusCode, this._statusMessage, this._head);
                return this._res.write(chunk, encoding, callback);
            }
            else {
                if (chunk instanceof Buffer)
                    this._contentBuffer = Buffer.from(chunk);
                else
                    this._contentBuffer = Buffer.from(chunk, encoding);
                return true;
            }
        }
        else {
            if (this._DIRECT_WRITE)
                return this._res.write(chunk, encoding, callback);
            else if (chunk instanceof Buffer) {
                let tempBuffer = Buffer.concat([this._contentBuffer, chunk]);
                this._contentBuffer = tempBuffer;
            }
            else {
                let tempBuffer = Buffer.from(chunk, encoding);
                this._contentBuffer = Buffer.concat([this._contentBuffer, tempBuffer]);
                ;
            }
            return true;
        }
    }
}
