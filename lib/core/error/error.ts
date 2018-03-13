/**
 * Error Library
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import { GlobalEnvironmentVariables } from "../global";
export class ErrorManager {
    public static RenderError(errorEnum: CompileTimeError | RuntimeError, ...params): string {
        if (params === void 0)
            throw new Error('SH000000: Fatal error, code not correct');
        if (CompileTimeError[errorEnum] !== void 0) {
            let errortemplate = ErrorTemplate[CompileTimeError[errorEnum]] as string;
            params.forEach((ele, idx) => {
                if (errortemplate.indexOf('$${' + idx + '}') !== -1)
                    errortemplate = errortemplate.replace('$${' + idx + '}', ele);
            });
            return CompileTimeError[errorEnum] + ': ' + errortemplate;
        } else if (RuntimeError[errorEnum] !== void 0) {
            let errortemplate = ErrorTemplate[RuntimeError[errorEnum]];
            params.forEach((ele, idx) => {
                if (errortemplate.indexOf('$${' + idx + '}') !== -1)
                    errortemplate = errortemplate.replace('$${' + idx + '}', ele);
            });
            return RuntimeError[errorEnum] + ': ' + errortemplate;
        }
    }
    public static RenderErrorAsHTML(error: Error): string {
        let stack = '';
        let stackvalue = (error.stack as string).split('\n');
        stackvalue.forEach(ele => {
            stack += `<p class='stack'>${ele.replace(/\s/g, '&nbsp;').replace(/at/g, '<span class="at">at</span>')}</p>`;
        });
        let message = `<h2>Error ${error.message}</h2>`;
        return `<html DOCTYPE><head>
            <style>
                h2{
                    font-family: 'Segoe UI', sans-serif;
                }
                span.at{
                    color: #757575;
                }
                p.stack{
                    font-size:14px;
                    line-height:20px;
                    margin:0;
                    padding:0;
                    font-family:monospace;
                }
                p.footer span.framework{
                    font-size: 12px;
                    font-family: "Segoe UI", sans-serif;
                    color: #424242;
                    font-weight: bold;
                }
                p.footer span.text{
                    font-size: 12px;
                    font-family: "Segoe UI", sans-serif;
                    color: #757575
                }
            </style>
            </head><body>` + message + stack + `<hr/><p class='footer'><span class='framework'>ServerHub</span>&nbsp;<span class='text'>POWERED</span></p></body></html>`;
    }
}

export enum CompileTimeError {
    // - controller
    SH010101 = 0x010101,
    SH010102 = 0x010102,
    SH010103 = 0x010103
    // TODO
};

export enum RuntimeError {
    // - controller
    SH020101 = 0x020101,
    SH020102 = 0x020102,
    // - view
    SH020201 = 0x020501,
    // - model
    SH020401 = 0x020401,
    SH020402 = 0x020402,
    // - network
    SH020501 = 0x020501,
    // - server
    SH020701 = 0x020701,
    SH020702 = 0x020702,
    SH020703 = 0x020703,
    SH020704 = 0x020704,
    SH020705 = 0x020705,
    SH020706 = 0x020706,
    SH020707 = 0x020707,
};

const ErrorTemplate = {
    SH010101: "Controller '$${0}' is not a valid controller.", // 0：controllerName.ext, .ext is expected to be .js, see doc/Errors.md.
    SH010102: "Controller path '$${0}' does not exist on '$${1}'.", // 0：controllerName.js; 1: controllerPath, see global['EnvironmentVariables'].
    SH010103: "Unresolved controller file.",
    SH020101: "Controller '$${0}' not registered.", // 0: controllerName.
    SH020102: "Default router not found.",
    SH020201: "View file '$${0}' does not exist on '$${1}'.", // 0：viewFileName.js; 1: viewPath, see global['EnvironmentVariables'].
    SH020401: "Model file '$${0}' does not exist on '$${1}'.", // 0：modelFileName.js; 1: modelPath, see global['EnvironmentVariables'].
    SH020402: "Model file '$${0}' is not valid.", // 0：modelFileName.js.
    SH020701: "AppStart method not found.",
    SH020702: "Allocated cache size exceeded limitation.",
    SH020703: "Content pointer index overflow in storage services.",
    SH020704: "File '$${0}' already exists in storage services.", // 0: file path
    SH020705: "File path invalid in storage services.",
    SH020706: "File '$${0}' does not exist.", // 0: file path.
    SH020707: "URI '$${0}' is not cacheable.", // 0: resource URI.
}