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
        let message = `<h1>Error ${error.message}</h1>`;
        return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Internal Error</title>
    <style>
        body {
            margin: 0;
        }

        h1 {
            font-size: 20px;
            font-family: 'Roboto Mono', monospace;
            margin-bottom: 8px;
            margin-top: 0;
        }

        p {
            color: #666666;
            font-size: 16px;
            margin-top: 4px;
            margin-bottom: 4px;
            max-width: 800px;
        }

        p.stack{
            margin-top: 8px;
        }

        p.stack span.at{
            color: #9e9e9e;
        }

        hr {
            border: 0;
            border-top: 1.5px solid #9e9e9e;
            max-width: 256px;
            margin: 16px 0 0 0;
        }

        * {
            font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-decoration: none;
        }

        a {
            color: #2196f3;
        }

        a:hover {
            text-decoration: solid #2196f3 underline;
        }

        section.content {
            width: calc(100% - 64px);
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 32px;
            left: 32px;
            bottom: 32px;
            right: 32px;
        }

        div.errorinfo{
            width: 100%;
            display: block;
            overflow-wrap: break-word;
        }

        div.stackinfo{
            overflow-y: auto;
            overflow-wrap: break-word;
        }

        @media screen and (max-width:500px) {
            section.content {
                width: calc(100% - 32px);
                left: 16px;
                right: 16px;
            }

            hr {
                max-width: 64px;
            }
        }

        @media screen and (max-height:420px) {
            section.content {
                width: calc(100% - 32px);
                left: 16px;
                right: 16px;
            }

            hr {
                max-width: 64px;
            }
        }
    </style>
</head>

<body>
    <main>
        <section class="content">
            <div class='errorinfo'>
                ${message}
                <p class='sublink'>Try
                    <a href="/">home page</a>
                </p>
                <hr>
            </div>
            <div class='stackinfo'>
                ${stack}
            </div>
        </section>
    </main>
</body>

</html>
            
            `;
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
    RuntimeError[RuntimeError["SH020701"] = 132865] = "SH020701";
    RuntimeError[RuntimeError["SH020702"] = 132866] = "SH020702";
    RuntimeError[RuntimeError["SH020703"] = 132867] = "SH020703";
    RuntimeError[RuntimeError["SH020704"] = 132868] = "SH020704";
    RuntimeError[RuntimeError["SH020705"] = 132869] = "SH020705";
    RuntimeError[RuntimeError["SH020706"] = 132870] = "SH020706";
    RuntimeError[RuntimeError["SH020707"] = 132871] = "SH020707";
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
    SH020701: "AppStart method not found.",
    SH020702: "Allocated cache size exceeded limitation.",
    SH020703: "Content pointer index overflow in storage services.",
    SH020704: "File '$${0}' already exists in storage services.",
    SH020705: "File path invalid in storage services.",
    SH020706: "Resource '$${0}' does not exist.",
    SH020707: "URI '$${0}' is not cacheable.",
};
