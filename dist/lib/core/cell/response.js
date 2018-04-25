"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CellResponse {
    get connection() {
        return this._socket;
    }
    get socket() {
        return this._socket;
    }
    addTrailers(headers) {
    }
    end() {
        this._socket = null;
    }
}
