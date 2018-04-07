"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GetCallerFilePath(depth = 2) {
    let originalFunc = Error.prepareStackTrace;
    let callerfile = '';
    try {
        let err = new Error();
        let currentfile;
        Error.prepareStackTrace = function (err, stack) { return stack; };
        currentfile = err.stack.shift().getFileName();
        let readyCount = 0;
        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();
            if (currentfile !== callerfile)
                readyCount += 1;
            if (readyCount === depth)
                break;
        }
    }
    catch (e) { }
    Error.prepareStackTrace = originalFunc;
    return callerfile.replace(/[^|/\\"?*~]+$/, '');
}
exports.StackCaller = GetCallerFilePath;
