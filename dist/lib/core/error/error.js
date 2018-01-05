"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorManager {
    static RenderError(errorEnum, ...params) {
        if (params === void 0)
            throw new Error('SH000000: Fatal error, code not correct');
        if (CompileTimeError[errorEnum] !== void 0) {
            let errortemplate = ErrorTemplate[CompileTimeError[errorEnum]];
            params.forEach((ele, idx) => {
                if (errortemplate.indexOf('$${' + idx + '}') !== -1)
                    errortemplate = errortemplate.replace('$${' + idx + '}', ele);
            });
            return CompileTimeError[errorEnum] + ': ' + errortemplate;
        }
        else if (RuntimeError[errorEnum] !== void 0) {
            let errortemplate = ErrorTemplate[RuntimeError[errorEnum]];
            params.forEach((ele, idx) => {
                if (errortemplate.indexOf('$${' + idx + '}') !== -1)
                    errortemplate = errortemplate.replace('$${' + idx + '}', ele);
            });
            return RuntimeError[errorEnum] + ': ' + errortemplate;
        }
    }
    static RenderErrorAsHTML(error) {
        let stack = '';
        let stackvalue = error.stack.split('\n');
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
exports.ErrorManager = ErrorManager;
var CompileTimeError;
(function (CompileTimeError) {
    CompileTimeError[CompileTimeError["SH010101"] = 65793] = "SH010101";
    CompileTimeError[CompileTimeError["SH010102"] = 65794] = "SH010102";
    CompileTimeError[CompileTimeError["SH010103"] = 65795] = "SH010103";
})(CompileTimeError = exports.CompileTimeError || (exports.CompileTimeError = {}));
;
var RuntimeError;
(function (RuntimeError) {
    RuntimeError[RuntimeError["SH020101"] = 131329] = "SH020101";
    RuntimeError[RuntimeError["SH020102"] = 131330] = "SH020102";
    RuntimeError[RuntimeError["SH020201"] = 132353] = "SH020201";
    RuntimeError[RuntimeError["SH020401"] = 132097] = "SH020401";
    RuntimeError[RuntimeError["SH020402"] = 132098] = "SH020402";
    RuntimeError[RuntimeError["SH020501"] = 132353] = "SH020501";
})(RuntimeError = exports.RuntimeError || (exports.RuntimeError = {}));
;
const ErrorTemplate = {
    SH010101: "Controller '$${0}' is not a valid controller.",
    SH010102: "Controller path '$${0}' does not exist on '$${1}'.",
    SH010103: "Unresolved controller file.",
    SH020101: "Controller '$${0}' not registered.",
    SH020102: "Default router not found.",
    SH020201: "View file '$${0}' does not exist on '$${1}'.",
    SH020401: "Model file '$${0}' does not exist on '$${1}'.",
    SH020402: "Model file '$${0}' is not valid.",
};
