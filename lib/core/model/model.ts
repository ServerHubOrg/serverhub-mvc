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

interface ModelCache {
    ModelName: string;
    ContentCache: string;
    ParsedCache: Object;
}

const modelToWatch: Array<string> = [];
const cachedModels: Array<ModelCache> = [];

/**
 * Watch for model file change and automatically update cache.
 */
function WatchModelChange(): void {

    let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;


    while (modelToWatch.length > 0) {
        let model = modelToWatch[0];

        let modelpath = path.resolve(variables.ServerBaseDir, variables.ModelDir, model + '.json');

        let tempcache = {
            ModelName: model,
            ContentCache: '',
            ParsedCache: {}
        } as ModelCache;

        fs.watchFile(modelpath, (curr, prev) => {
            if (!fs.existsSync(modelpath)) {
                tempcache = {
                    ModelName: model,
                    ContentCache: '',
                    ParsedCache: {}
                };
                UpdateModelCache(tempcache);
                return;
            }
            let modelFile = fs.readFileSync(modelpath).toString();
            tempcache.ContentCache = modelFile;
            let result = '';
            if (modelFile && modelFile.length > 0) {
                try {
                    let modelObj = JSON.parse(modelFile);
                    if (modelObj === void 0) throw new Error();
                    tempcache.ParsedCache = modelObj;
                } catch (e) {
                    throw ErrorManager.RenderError(RuntimeError.SH020402, model + '.json');
                }
            } else throw ErrorManager.RenderError(RuntimeError.SH020401, model + '.json');
            UpdateModelCache(tempcache);
        });
        UpdateModelCache(tempcache);
        modelToWatch.splice(0, 1);
    }
}

/**
 * Query model cache from ServerHub cache.
 * @param model Model name, without extension
 */
function QueryModelCache(model: string): ModelCache {
    let hit = -1;
    cachedModels.forEach((cache, idx) => {
        if (hit < 0 && cache.ModelName === model) {
            hit = idx;
        }
    });
    if (hit > -1)
        return cachedModels[hit];
    else return void 0;
}

/**
 * Update or create new model cache
 * @param cache New cache item
 */
function UpdateModelCache(cache: ModelCache): void {
    let hit = -1;
    cachedModels.forEach((cache, idx) => {
        if (hit < 0 && cache.ModelName === cache.ModelName) {
            hit = idx;
        }
    });
    if (hit > -1) {
        cachedModels[hit] = cache;
    }
    else cachedModels.push(cache);
}

/**
 * Read model from disk, will automatically update model cache once the file on disk changes.
 * @param model model name, with extension '.json'
 */
export function ReadModel(model: string): Object {
    let cache = QueryModelCache(model);
    if (cache) {
        return cache.ParsedCache;
    }
    else {
        modelToWatch.push(model);
        WatchModelChange();

        let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
        let modelpath = path.resolve(variables.ServerBaseDir, variables.ModelDir, model + '.json');

        if (!fs.existsSync(modelpath)) {
            UpdateModelCache({
                ModelName: model,
                ContentCache: '',
                ParsedCache: {}
            });
            return {};
        }
        let modelFile = fs.readFileSync(modelpath).toString();
        let result = '';
        if (modelFile && modelFile.length > 0) {
            try {
                let modelObj = JSON.parse(modelFile);
                if (modelObj === void 0) throw new Error();
                UpdateModelCache({
                    ModelName: model,
                    ContentCache: modelFile,
                    ParsedCache: modelObj
                } as ModelCache);
                return modelObj;
            } catch (e) {
                throw ErrorManager.RenderError(RuntimeError.SH020402, model + '.json');
            }
        } else throw ErrorManager.RenderError(RuntimeError.SH020401, model + '.json');
    }
}