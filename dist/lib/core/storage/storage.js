"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const nodepath = require("path");
const error_1 = require("../error/error");
class FileStorage {
    constructor(val, type = 'text/plain') {
        this.CTs = ['image/png',
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
            'application/x-7z-compressed'];
        if (val && type) {
            this.Value = val;
            this.ContentType = type;
        }
        else
            throw new Error('Invalid parameters');
    }
    set Value(val) {
        this.value = val;
    }
    get Value() {
        return this.value;
    }
    set ContentType(val) {
        if (this.CTs.indexOf(val) !== -1)
            this.contentType = val;
        else
            throw new Error('Invalid content-type: ' + val);
    }
    get ContentType() {
        return this.contentType;
    }
}
exports.FileStorage = FileStorage;
class URI {
    set Value(val) {
        this.value = val;
    }
    get Value() {
        return this.value;
    }
}
exports.URI = URI;
const pathRegexp = new RegExp(/^((?:\/[^/?.]*)+)(\/[^/?]*)(\?(?:&?(?:[a-z\d]+=[a-z\d]+)?)+)?$/i);
class StorageService {
    constructor() {
        this.RootDir = '';
    }
    static Service(rootDir) {
        StorageService.Instance.RootDir = rootDir;
        return StorageService.Instance;
    }
    FileInfo(path, basedir) {
        let variables = global['EnvironmentVariables'];
        let filePath = '';
        if (path && basedir) {
            filePath = nodepath.resolve(variables.ServerBaseDir, basedir, path);
        }
        else if (path) {
            filePath = nodepath.resolve(variables.ServerBaseDir, this.RootDir, path);
        }
        else
            throw new Error(error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020705));
        if (!fs.existsSync(filePath))
            throw new Error(error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020706, filePath));
        let stat = fs.fstatSync(fs.openSync(filePath, 'r'));
        let info = {
            FileName: filePath.match(/[^?/]*\.?[^.?/]*$/i)[0],
            Size: stat.size,
            Path: filePath,
            LogicalPath: nodepath.resolve(basedir ? basedir : this.RootDir, path),
            Extension: filePath.match(/\.[^/.?]*$/i)[0]
        };
        return info;
    }
    GetFile(path, basedir) {
        let variables = global['EnvironmentVariables'];
        let filePath = '';
        if (path && basedir) {
            filePath = nodepath.resolve(variables.ServerBaseDir, basedir, path);
        }
        else if (path) {
            filePath = nodepath.resolve(variables.ServerBaseDir, this.RootDir, path);
        }
        else
            throw new Error(error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020705));
        if (!fs.existsSync(filePath))
            throw new Error(error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020706, filePath));
        return fs.readFileSync(filePath);
    }
    GetFileChunk(path, chunk, basedir) {
        let variables = global['EnvironmentVariables'];
        let filePath = '';
        if (path && basedir && chunk && chunk.From) {
            filePath = nodepath.resolve(variables.ServerBaseDir, basedir, path);
        }
        else if (path && chunk && chunk.From) {
            filePath = nodepath.resolve(variables.ServerBaseDir, path);
        }
        else
            throw new Error(error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020705));
        if (!fs.existsSync(filePath))
            throw new Error(error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020706, filePath));
        let buffer = fs.readFileSync(filePath);
        return chunk.Length ? buffer.toString('utf-8', ...[chunk.From, chunk.Length]) : buffer.toString('utf-8', chunk.From);
    }
}
StorageService.Instance = new StorageService();
exports.StorageService = StorageService;
