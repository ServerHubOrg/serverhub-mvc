/**
 * Storage interface definition and storage service provider.
 */


/// <reference path="../global.ts" />
import * as fs from "fs";
import * as nodepath from "path";
import { GlobalEnvironmentVariables } from "../global";
import { ErrorManager, RuntimeError } from '../error/error';

export class FileStorage {
    private value: string;
    private contentType: string;

    set Value(val: string) {
        this.value = val;
    }
    get Value(): string {
        return this.value;
    }
    private CTs = ['image/png',
        'image/jpeg',
        'image/jpeg',
        'text/plain',
        'image/gif',
        'image/svg',
        'image/webp',
        'audio/weba',
        'video/webm',
        'font/woff',
        'font/woff2',
        'font/ttf',
        'application/vnd.ms-fontobject',
        'application/pdf',
        'text/html',
        'text/html;charset=utf-8',
        'application/json',
        'application/xml',
        'application/js',
        'application/typescript',
        'image/x-icon',
        'text/css',
        'application/x-7z-compressed']
    set ContentType(val: string) {
        if (this.CTs.indexOf(val) !== -1)
            this.contentType = val;
        else throw new Error('Invalid content-type: ' + val);
    }
    get ContentType(): string {
        return this.contentType;
    }
    constructor(val: string, type = 'text/plain') {
        if (val && type) {
            this.Value = val;
            this.ContentType = type;
        }
        else throw new Error('Invalid parameters');
    }
}


export class URI {
    private value: string;
    set Value(val: string) {
        this.value = val;
    }
    get Value(): string {
        return this.value;
    }
}

const pathRegexp = new RegExp(/^((?:\/[^/?.]*)+)(\/[^/?]*)(\?(?:&?(?:[a-z\d]+=[a-z\d]+)?)+)?$/i);

/**
 * Defines the start index of target chunk and length of it.
 */
export interface FileChunk {
    From: number;
    Length?: number;
}

/**
 * Provide basic information of files.
 */
export interface FileInfo {
    FileName: string;
    Size: number;
    Path: string;
    LogicalPath: string; // relative to server_root_dir
    Extension: string;
}

/**
 * Provide ability and utils to get access to file system with virtual path and highly abstract interfaces.
 */
export class StorageService {
    private static Instance = new StorageService();
    private RootDir = '';
    private constructor() {
    }

    /**
     * Get the service instance of storage.
     */
    public static Service(rootDir): StorageService {
        StorageService.Instance.RootDir = rootDir;
        return StorageService.Instance;
    }

    public FileInfo(path: string, basedir?: string): FileInfo {
        let variables =
            global['EnvironmentVariables'] as GlobalEnvironmentVariables;
        let filePath = '';
        if (path && basedir) {
            filePath = nodepath.resolve(variables.ServerBaseDir, basedir, path);
        } else if (path) {
            filePath = nodepath.resolve(variables.ServerBaseDir, this.RootDir, path);
        } else throw new Error(ErrorManager.RenderError(RuntimeError.SH020705));


        if (!fs.existsSync(filePath))
            throw new Error(ErrorManager.RenderError(RuntimeError.SH020706, filePath));

        let stat = fs.fstatSync(fs.openSync(filePath, 'r'));
        let info = {
            FileName: filePath.match(/[^?/]*\.?[^.?/]*$/i)[0] as string,
            Size: stat.size,
            Path: filePath,
            LogicalPath: nodepath.resolve(basedir ? basedir : this.RootDir, path),
            Extension: filePath.match(/\.[^/.?]*$/i)[0] as string
        } as FileInfo;
        return info;
    }
    /**
     * Get full file content with a path relative to server base dir.
     * @param path path to the target file
     * @param basedir base path of the target file
     */
    public GetFile(path: string, basedir?: string): Buffer {
        let variables =
            global['EnvironmentVariables'] as GlobalEnvironmentVariables;
        let filePath = '';
        if (path && basedir) {
            filePath = nodepath.resolve(variables.ServerBaseDir, basedir, path);
        } else if (path) {
            filePath = nodepath.resolve(variables.ServerBaseDir, this.RootDir, path);
        } else throw new Error(ErrorManager.RenderError(RuntimeError.SH020705));


        if (!fs.existsSync(filePath))
            throw new Error(ErrorManager.RenderError(RuntimeError.SH020706, filePath));

        return fs.readFileSync(filePath);
    }

    /**
     * 
     * @param path path to the target file
     * @param chunk file chunk
     * @param basedir base path of the target file
     */
    public GetFileChunk(path: string, chunk: FileChunk, basedir: string): string {
        let variables =
            global['EnvironmentVariables'] as GlobalEnvironmentVariables;
        let filePath = '';
        if (path && basedir && chunk && chunk.From) {
            filePath = nodepath.resolve(variables.ServerBaseDir, basedir, path);
        } else if (path && chunk && chunk.From) {
            filePath = nodepath.resolve(variables.ServerBaseDir, path);
        } else throw new Error(ErrorManager.RenderError(RuntimeError.SH020705));

        if (!fs.existsSync(filePath))
            throw new Error(ErrorManager.RenderError(RuntimeError.SH020706, filePath));

        let buffer = fs.readFileSync(filePath);
        return chunk.Length ? buffer.toString('utf-8', ...[chunk.From, chunk.Length]) : buffer.toString('utf-8', chunk.From);
    }
}