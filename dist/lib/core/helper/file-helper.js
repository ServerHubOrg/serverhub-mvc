"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const nodepath = require("path");
class FileHelper {
    constructor() {
        const variables = global['EnvironmentVariables'];
        if (!FileHelper._ServerDirectory)
            FileHelper._ServerDirectory = variables.ServerBaseDir;
        else
            throw new Error('FileHelper should be used statically.');
        if (!FileHelper._WebRoot)
            FileHelper._WebRoot = nodepath.resolve(FileHelper._ServerDirectory, variables.WebDir);
        else
            throw new Error('FileHelper should be used statically.');
    }
    static get ServerDirectory() {
        return FileHelper._ServerDirectory;
    }
    static get WebRoot() {
        return FileHelper._WebRoot;
    }
    static ResolveWebPath(...path) {
        return nodepath.resolve(FileHelper._WebRoot, ...path);
    }
    static ResolveServerPath(...path) {
        return nodepath.resolve(FileHelper._ServerDirectory, ...path);
    }
}
FileHelper._ServerDirectory = null;
FileHelper._WebRoot = null;
FileHelper.NodeFS = fs;
FileHelper.NodePath = nodepath;
exports.FileHelper = FileHelper;
