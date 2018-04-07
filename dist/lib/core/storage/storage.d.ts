/// <reference path="../global.d.ts" />
/// <reference types="node" />
export declare class FileStorage {
    private value;
    private contentType;
    Value: string;
    private CTs;
    ContentType: string;
    constructor(val: string, type?: string);
}
export declare class URI {
    private value;
    Value: string;
}
export interface FileChunk {
    From: number;
    Length?: number;
}
export interface FileInfo {
    Name: string;
    FileName: string;
    Size: number;
    Path: string;
    LogicalPath: string;
    Extension: string;
}
export declare class StorageService {
    private static Instance;
    private RootDir;
    private constructor();
    static Service(rootDir: any): StorageService;
    FileInfo(path: string, basedir?: string): FileInfo;
    GetFile(path: string, basedir?: string): Buffer;
    GetFileChunk(path: string, chunk: FileChunk, basedir: string): string;
}
