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
        if (errorEnum === void 0)
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
        } else throw new Error('ErrorManager cannot determine your error');
    }
    public static RenderErrorAsHTML(error: Error): string {
        if (!(error instanceof Error))
            throw new Error('Error not defined');
        let stack = '';
        let stackvalue = (error.stack as string).split('\n');
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
    SH020706: "Resource '$${0}' does not exist.", // 0: file path.
    SH020707: "URI '$${0}' is not cacheable.", // 0: resource URI.
}