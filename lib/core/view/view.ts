/**
 * View Support
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import { GlobalEnvironmentVariables } from "../global";
import { ErrorManager, CompileTimeError, RuntimeError } from "../error/error";
import * as path from 'path';
import * as fs from 'fs';


export function ApplyModel(view: string, model: Object): string {
    let cache = QueryViewCache(view);
    let htmlFile = '';
    if (cache) {
        htmlFile = cache.ContentCache
    } else {
        viewToWatch.push(view);
        WatchViewChange();
        let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
        let htmlpath = path.resolve(variables.ServerBaseDir, variables.ViewDir, view + '.html');
        if (!fs.existsSync(htmlpath))
            return '';
        htmlFile = fs.readFileSync(htmlpath).toString();
        let tempcache = {
            ViewName: view,
            ContentCache: htmlFile
        } as ViewCache;
        UpdateViewCache(tempcache);
    }
    let result = '';

    if (!model || Object.keys(model).length === 0)
        result = htmlFile.replace(/\$\$\{[a-z.\d_$]*\}/ig, '');
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


interface ViewCache {
    ViewName: string;
    ContentCache: string;
}

const viewToWatch: Array<string> = [];
const cachedViews: Array<ViewCache> = [];

/**
 * Watch for view file change and automatically update cache.
 */
function WatchViewChange(): void {

    let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;


    while (viewToWatch.length > 0) {
        let view = viewToWatch[0];

        let viewpath = path.resolve(variables.ServerBaseDir, variables.ViewDir, view + '.html');

        let tempcache = {
            ViewName: view,
            ContentCache: ''
        } as ViewCache;

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

/**
 * Query view cache from ServerHub cache.
 * @param view View name, without extension
 */
function QueryViewCache(view: string): ViewCache {
    let hit = -1;
    cachedViews.forEach((cache, idx) => {
        if (hit < 0 && cache.ViewName === view) {
            hit = idx;
        }
    });
    if (hit > -1)
        return cachedViews[hit];
    else return void 0;
}

/**
 * Update or create new view cache
 * @param cache New cache item
 */
function UpdateViewCache(cache: ViewCache): void {
    let hit = -1;
    cachedViews.forEach((cache, idx) => {
        if (hit < 0 && cache.ViewName === cache.ViewName) {
            hit = idx;
        }
    });
    if (hit > -1) {
        cachedViews[hit] = cache;
    }
    else cachedViews.push(cache);
}