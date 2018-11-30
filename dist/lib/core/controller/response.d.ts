/// <reference types="node" />
declare class SHResponse {
    private _Headers;
    private _StatusCode;
    private _Content;
    private _HeaderSent;
    private _WriteHeadCalled;
    private _Finished;
    readonly headersSent: boolean;
    readonly finished: boolean;
    statusCode: number;
    getHeaderNames(): Array<string>;
    hasHeader(name: string): boolean;
    getContent(): String;
    getHeader(name: string): any;
    getHeaders(): Object;
    setHeader(prop: string, value: any): void;
    removeHeader(header: string): boolean;
    write(chunk: string | Buffer | Object, encoding?: string): boolean;
    end(chunk?: string | Buffer, encoding?: string): boolean;
    writeHead(code: number, header: Object): boolean;
}
export { SHResponse };
