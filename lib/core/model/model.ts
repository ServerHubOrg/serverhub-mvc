/**
 * Model Library
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */


// TODO: use model-loader

import { GlobalEnvironmentVariables } from "../global";
import { ErrorManager, CompileTimeError, RuntimeError } from "../error/error";
import * as path from 'path';
import * as fs from 'fs';


export function ReadModel(model: string): Object {
    let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;

    let modelpath = path.resolve(variables.ServerBaseDir, variables.ModelDir, model + '.json');
    if (!fs.existsSync(modelpath))
        throw ErrorManager.RenderError(RuntimeError.SH020401, model + '.json', variables.ModelDir);
    let modelFile = fs.readFileSync(modelpath).toString();
    let result = '';
    if (modelFile && modelFile.length > 0) {
        try {
            let modelObj = JSON.parse(modelFile);
            if (modelObj === void 0) throw new Error();
            return modelObj;
        } catch (e) {
            throw ErrorManager.RenderError(RuntimeError.SH020402, model + '.json');
        }
    } else throw ErrorManager.RenderError(RuntimeError.SH020401, model + '.json');
}