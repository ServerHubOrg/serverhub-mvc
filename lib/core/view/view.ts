import { GlobalEnvironmentVariables } from "../global";
import { ErrorManager, CompileTimeError, RuntimeError } from "../error/error";
import * as path from 'path';
import * as fs from 'fs';


export function ApplyModel(view: string, model: Object): string {
    let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
    let htmlpath = path.resolve(variables.ServerBaseDir, variables.ViewDir, view + '.html');
    if (!fs.existsSync(htmlpath))
        throw ErrorManager.RenderError(RuntimeError.SH020201, view + '.html', variables.ViewDir);
    let htmlFile = fs.readFileSync(htmlpath).toString();

    let result = '';
    if (!model || Object.keys(model).length === 0)
        result = htmlFile.replace(/\$\$\{[a-z.]*\}/ig, '');
    else
        if (htmlFile && htmlFile.length > 0) {
            try {
                let keys = Object.keys(model);
                keys.forEach(ele => {
                    let reg = new RegExp(`(\\$\\$\\{${view}\\.${ele}\\})`, 'g');
                    htmlFile = htmlFile.replace(reg, model[ele]);
                });
                result = htmlFile;
            } catch (e) {
                throw ErrorManager.RenderError(RuntimeError.SH020402, model + '.json');
            }
        }
    return result;
}