/**
 * Stack Helper Library
 * 
 * ServerHub MVC, MIT License
 * April 7th, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

/**
 * Get direct caller file path.
 * @param {number} depth The call stack depth to this function. Default value is 2.
 */
function GetCallerFilePath(depth: number = 2): string {
    let originalFunc = Error.prepareStackTrace;
    let callerfile: string = '';
    try {
        let err = new Error();
        let currentfile;
        Error.prepareStackTrace = function (err, stack) { return stack; };
        currentfile = (err.stack as any).shift().getFileName() as string;
        let readyCount = 0;
        while (err.stack.length) {
            callerfile = (err.stack as any).shift().getFileName();
            if (currentfile !== callerfile)
                readyCount += 1;
            if (readyCount === depth)
                break;
        }
    } catch (e) { }
    Error.prepareStackTrace = originalFunc;
    return callerfile ? callerfile.replace(/[^|/\\"?*~]+$/, '') : void 0;
}

export { GetCallerFilePath as StackCaller }