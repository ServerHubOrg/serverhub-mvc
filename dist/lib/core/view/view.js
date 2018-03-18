"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error/error");
const path = require("path");
const fs = require("fs");
function ApplyModel(view, model) {
    let cache = QueryViewCache(view);
    let htmlFile = '';
    if (cache) {
        htmlFile = cache.ContentCache;
    }
    else {
        viewToWatch.push(view);
        WatchViewChange();
        let variables = global['EnvironmentVariables'];
        let htmlpath = path.resolve(variables.ServerBaseDir, variables.ViewDir, view + '.html');
        if (!fs.existsSync(htmlpath))
            return '';
        htmlFile = fs.readFileSync(htmlpath).toString();
        let tempcache = {
            ViewName: view,
            ContentCache: htmlFile
        };
        UpdateViewCache(tempcache);
    }
    let result = '';
    if (!model || Object.keys(model).length === 0)
        result = htmlFile.replace(/\$\$\{[a-z.\d_$]*\}/ig, '');
    else if (htmlFile && htmlFile.length > 0) {
        try {
            let keys = Object.keys(model);
            keys.forEach(ele => {
                let reg = new RegExp(`(\\$\\$\\{${view}\\.${ele}\\})`, 'g');
                htmlFile = htmlFile.replace(reg, model[ele]);
            });
            result = htmlFile;
        }
        catch (e) {
            throw error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020402, model + '.json');
        }
    }
    return result;
}
exports.ApplyModel = ApplyModel;
const viewToWatch = [];
const cachedViews = [];
function WatchViewChange() {
    let variables = global['EnvironmentVariables'];
    while (viewToWatch.length > 0) {
        let view = viewToWatch[0];
        let viewpath = path.resolve(variables.ServerBaseDir, variables.ViewDir, view + '.html');
        let tempcache = {
            ViewName: view,
            ContentCache: ''
        };
        fs.watchFile(viewpath, (curr, prev) => {
            if (!fs.existsSync(viewpath)) {
                tempcache = {
                    ViewName: view,
                    ContentCache: ''
                };
                return;
            }
            let viewFile = fs.readFileSync(viewpath).toString();
            tempcache.ContentCache = viewFile;
            UpdateViewCache(tempcache);
        });
        UpdateViewCache(tempcache);
        viewToWatch.splice(0, 1);
    }
}
function QueryViewCache(view) {
    let hit = -1;
    cachedViews.forEach((cache, idx) => {
        if (hit < 0 && cache.ViewName === view) {
            hit = idx;
        }
    });
    if (hit > -1)
        return cachedViews[hit];
    else
        return void 0;
}
function UpdateViewCache(cache) {
    let hit = -1;
    cachedViews.forEach((cache, idx) => {
        if (hit < 0 && cache.ViewName === cache.ViewName) {
            hit = idx;
        }
    });
    if (hit > -1) {
        cachedViews[hit] = cache;
    }
    else
        cachedViews.push(cache);
}
