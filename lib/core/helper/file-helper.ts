/**
 * FileHelper Library
 * 
 * ServerHub MVC, MIT License
 * March 14, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import * as fs from "fs";
import * as nodepath from "path";
import { GlobalEnvironmentVariables } from "../global";

/**
 * Provide simple file access operations for controller actions.
 */
class FileHelper {
    private static _ServerDirectory: string = null;
    private static _WebRoot: string = null;

    /**
     * Must be called after ServerHub starts. Or some private variables cannot be initialized.
     */
    constructor() {
        const variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
        if (!FileHelper._ServerDirectory)
            FileHelper._ServerDirectory = variables.ServerBaseDir;
        else throw new Error('FileHelper should be used statically.');
        if (!FileHelper._WebRoot)
            FileHelper._WebRoot = nodepath.resolve(FileHelper._ServerDirectory, variables.WebDir);
        else throw new Error('FileHelper should be used statically.');
    }

    /**
     * Provide readonly access to server working directory.
     */
    public static get ServerDirectory() {
        return FileHelper._ServerDirectory;
    }

    /**
     * Provide readonly access to server web directory.
     */
    public static get WebRoot() {
        return FileHelper._WebRoot;
    }

    /**
     * Resolve virtual web path to actual physical path.
     * @param path Rest parameters, segments of path
     */
    public static ResolveWebPath(...path: string[]): string {
        return nodepath.resolve(FileHelper._WebRoot, ...path);
    }

    /**
     * Resolve virtual server path to actual physical path.
     * @param path Rest parameters, segments of path
     */
    public static ResolveServerPath(...path: string[]): string {
        return nodepath.resolve(FileHelper._ServerDirectory, ...path);
    }

    public static readonly NodeFS = fs;
    public static readonly NodePath = nodepath;
}

export { FileHelper };