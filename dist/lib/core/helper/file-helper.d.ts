/// <reference types="node" />
import * as fs from "fs";
import * as nodepath from "path";
declare class FileHelper {
    private static _ServerDirectory;
    private static _WebRoot;
    constructor();
    static readonly ServerDirectory: string;
    static readonly WebRoot: string;
    static ResolveWebPath(...path: string[]): string;
    static ResolveServerPath(...path: string[]): string;
    static readonly NodeFS: typeof fs;
    static readonly NodePath: typeof nodepath;
}
export { FileHelper };
