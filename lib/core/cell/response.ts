/**
 * Cell Library - Response
 * 
 * ServerHub MVC, MIT License
 * April 25, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import { Socket } from "net";
import { CellHeaders } from './head';

class CellResponse {
    private _socket: Socket;// should be set to null after response.end() been called.
    private _head: CellHeaders;

    public get connection(): Socket {
        return this._socket;
    }
    public get socket(): Socket {
        return this._socket;
    }

    public addTrailers(headers: CellHeaders) {

    }

    public end(): void {
        this._socket = null;
    }
}