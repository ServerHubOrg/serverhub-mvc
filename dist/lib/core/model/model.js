"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error/error");
const path = require("path");
const fs = require("fs");
const modelToWatch = [];
const cachedModels = [];
function WatchModelChange() {
    let variables = global['EnvironmentVariables'];
    while (modelToWatch.length > 0) {
        let model = modelToWatch[0];
        let modelpath = path.resolve(variables.ServerBaseDir, variables.ModelDir, model + '.json');
        let tempcache = {
            ModelName: model,
            ContentCache: '',
            ParsedCache: {}
        };
        fs.watchFile(modelpath, (curr, prev) => {
            if (!fs.existsSync(modelpath)) {
                tempcache = {
                    ModelName: model,
                    ContentCache: '',
                    ParsedCache: {}
                };
                return;
            }
            let modelFile = fs.readFileSync(modelpath).toString();
            tempcache.ContentCache = modelFile;
            let result = '';
            if (modelFile && modelFile.length > 0) {
                try {
                    let modelObj = JSON.parse(modelFile);
                    if (modelObj === void 0)
                        throw new Error();
                    tempcache.ParsedCache = modelObj;
                }
                catch (e) {
                    throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020402, model + '.json');
                }
            }
            else
                throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020401, model + '.json');
            UpdateModelCache(tempcache);
        });
        UpdateModelCache(tempcache);
        modelToWatch.splice(0, 1);
    }
}
function QueryModelCache(model) {
    let hit = -1;
    cachedModels.forEach((cache, idx) => {
        if (hit < 0 && cache.ModelName === model) {
            hit = idx;
        }
    });
    if (hit > -1)
        return cachedModels[hit];
    else
        return void 0;
}
function UpdateModelCache(cache) {
    let hit = -1;
    cachedModels.forEach((cache, idx) => {
        if (hit < 0 && cache.ModelName === cache.ModelName) {
            hit = idx;
        }
    });
    if (hit > -1) {
        cachedModels[hit] = cache;
    }
    else
        cachedModels.push(cache);
}
function ReadModel(model) {
    let cache = QueryModelCache(model);
    if (cache) {
        return cache.ParsedCache;
    }
    else {
        modelToWatch.push(model);
        WatchModelChange();
        let variables = global['EnvironmentVariables'];
        let modelpath = path.resolve(variables.ServerBaseDir, variables.ModelDir, model + '.json');
        if (!fs.existsSync(modelpath))
            throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020401, model + '.json', variables.ModelDir);
        if (!fs.existsSync(modelpath))
            return {};
        let modelFile = fs.readFileSync(modelpath).toString();
        let result = '';
        if (modelFile && modelFile.length > 0) {
            try {
                let modelObj = JSON.parse(modelFile);
                if (modelObj === void 0)
                    throw new Error();
                UpdateModelCache({
                    ModelName: model,
                    ContentCache: modelFile,
                    ParsedCache: modelObj
                });
                return modelObj;
            }
            catch (e) {
                throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020402, model + '.json');
            }
        }
        else
            throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020401, model + '.json');
    }
}
exports.ReadModel = ReadModel;
