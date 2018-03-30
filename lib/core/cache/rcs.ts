/**
 * Resource Caching Service Library
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import { Cache, CacheStorage, CacheReportInfo } from './cache';
import { ServerResponse } from 'http';
import { ErrorManager, RuntimeError } from '../error/error';
import { StorageService, FileInfo } from '../storage/storage';
import { GlobalEnvironmentVariables } from '../global';
import { ContentType } from '../content-type';
import { CacheHelper } from '../helper';
import * as npath from 'path';
import * as nfs from 'fs';
export class RCS {
    private constructor() { }
    private static Instance = new RCS();

    public static Service(): RCS {
        return RCS.Instance;
    }

    private CacheManager = new CacheStorage();

    private GenerateEtag(): string {
        let n = 16;
        let tag = '';
        while (n > 0) {
            tag += ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'][Math.floor(Math.random() * 10)];
            n--;
        }
        return tag;
    }


    /**
     * Check whether a resource is cacheable for ServerHub. Detailed information, please refer to doc/Cache. Can only be used on HTTP request.
     * @param uri URI of target resource.
     */
    public Cacheable(uri: string): boolean {
        let reg = new RegExp(/^((?:\/[^/?.]*)+)(\/[^/?><#!\\|"'`]*)(\?(?:&?(?:[a-z\d]+=[a-z\d]+)?)+)?$/i);
        let shorreg = new RegExp(/^(\/[^/?><#!\\|"'`]*)(\?(?:&?(?:[a-z\d]+=[a-z\d]+)?)+)?$/i);

        let match = uri.match(reg);
        let shortmatch = uri.match(shorreg);
        if (match || shortmatch) {
            let basedir = match ? match[1] : void 0;
            let file = match ? match[2] : shortmatch[1];
            let search = match ? match[3] : shortmatch[2];
            if (file && file !== '/' && (search === void 0 || search === '?'))
                return true;
            else return false;
        } else {
            return void 0;
        }
    }

    public GetUri(uri: string, res: ServerResponse): void {
        let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
        if (this.Cacheable(uri)) {
            if (uri.endsWith('?'))
                uri = uri.substr(0, uri.length - 1);

            let cache: Cache;


            if (this.CacheManager.HasCache(uri)) {
                cache = this.CacheManager.HitCache(uri);
            }
            else {
                let info: FileInfo;
                try {
                    info = StorageService.Service((global['EnvironmentVariables'] as GlobalEnvironmentVariables).WebDir).FileInfo(uri.substr(1));
                } catch (error) {
                    res.writeHead(404, 'content-type: text/html');
                    if (variables.PageNotFound && variables.PageNotFound.length !== 0)
                        res.write(CacheHelper.Cache(npath.resolve(variables.ServerBaseDir, variables.PageNotFound)).Content);
                    else
                        res.write(ErrorManager.RenderErrorAsHTML(error));
                    res.end();
                    return;
                }
                let ext = info.Extension ? info.Extension : '___';

                if (info.Size <= 10 * 1024 * 1024) {
                    try {
                        let file = StorageService.Service(variables.WebDir).GetFile(uri.substr(1));
                        cache = new Cache(uri, ContentType.GetContentType(ext));
                        cache.etags = this.GenerateEtag();
                        cache.cache = file;
                        cache.date_time = new Date().getTime();
                        cache.size = info.Size;
                        cache.expires = 72000000;
                        try {
                            let maxsize = variables.MaxCacheSize * 1024 * 1024;
                            if (cache.size + this.CacheManager.CacheSize() <= maxsize)
                                this.CacheManager.AddCache(cache);
                            else if (cache.size <= maxsize)
                                this.WCS(cache);
                        } catch (err) {
                            this.CacheManager.HitCache(uri);
                        }
                    } catch (error) {
                        res.writeHead(404, 'content-type: text/html');
                        if (variables.PageNotFound && variables.PageNotFound.length !== 0)
                            res.write(CacheHelper.Cache(npath.resolve(variables.ServerBaseDir, variables.PageNotFound)).Content);
                        else
                            res.write(ErrorManager.RenderErrorAsHTML(new Error(ErrorManager.RenderError(RuntimeError.SH020706, uri))));
                        res.end();
                        return;
                    }
                    if (!res.headersSent) {
                        res.setHeader('content-type', cache.content_type);
                        res.setHeader('etags', cache.etags);
                        res.write(cache.cache);
                        res.end();
                    }
                } else {
                    // file too large to cache. // larger than 10MB.
                    try {
                        let rstream = nfs.createReadStream(info.Path);
                        res.setHeader('Content-Type', ContentType.GetContentType(info.Extension));
                        rstream.on('data', data => {
                            res.write(data);
                        });
                        rstream.on('close', () => {
                            res.end();
                        });
                        rstream.read();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }

        } else throw new Error(ErrorManager.RenderError(RuntimeError.SH020707, uri));
    }

    public GetCacheReport(res: ServerResponse) {
        res.setHeader('content-type', "text/html");
        let ret = '';
        let entries = this.CacheManager.CacheReport().entries();
        let total = this.CacheManager.CacheSize();
        for (let item of entries) {
            let cache = item[1];
            ret += `<tr><td class='uri'>${item[0]}</td><td class='id'>${cache.id}</td><td class='weight'>${cache.weight}</td><td class='size'>${cache.size} byte</td></tr>`;
            // total += cache.size;
        }
        let displaytotal = '';
        if (total > 1024 * 1024 * 1024) {
            displaytotal = total / 1024 / 1024 / 1024 + ' GB';
        } else if (total > 1024 * 1024) {
            displaytotal = total / 1024 / 1024 + ' MB';
        } else if (total > 1024) {
            displaytotal = total / 1024 + ' KB';
        } else displaytotal = total + ' Byte';

        let value = `<html><head>
            <title>ServerHub | Cache Report</title>
            <style>
                body{
                    font-family: 'Segoe UI', sans-serif;
                    color: #424242;
                }
                ul{
                    list-style:none;
                }
                table thead {
                    font-weight: bold;
                }
                table tbody td{
                    font-family: monospace;
                }
                td.uri{
                    color: #2196f3;
                }

                td.id{
                    color: #757575;
                }

                td.weight{
                    color: #424242;
                    font-weight: bold;
                }
                
                td.weight{
                    color: #757575;
                    font-weight: bold;
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
        </head><body>
        <h2>Cache Usage Report</h2><table border=0><thead><tr><td>URI</td><td>ID</td><td>Weight</td><td>Resource Size</td></tr></thead><tbody>`;
        value += ret;
        value += `</tbody><tr><td colspan=4>Total cache memory usage: ${displaytotal}</td></tr></table><hr/><p class='footer'><span class='framework'>ServerHub</span>&nbsp;<span class='text'>POWERED</span></p></body></html>`;
        res.write(value);
        res.end();
    }

    public WCS(cache: Cache): void {
        let time_array = new Array<CacheReportInfo>(0);
        let weight_array = new Array<CacheReportInfo>(0);
        let size_array = new Array<CacheReportInfo>(0);
        let entries = this.CacheManager.CacheReport().entries();
        let resultObj = {};
        for (let entry of entries) {
            time_array.push(Object.create(entry[1]));
            weight_array.push(Object.create(entry[1]));
            size_array.push(Object.create(entry[1]));
            resultObj[entry[1].id] = 0;
        }
        time_array = time_array.sort((a: CacheReportInfo, b: CacheReportInfo) => {
            return a.time < b.time ? -1 : 1;
        });
        weight_array = weight_array.sort((a: CacheReportInfo, b: CacheReportInfo) => {
            return a.weight < b.weight ? -1 : 1;
        });
        size_array = size_array.sort((a: CacheReportInfo, b: CacheReportInfo) => {
            return a.size < b.size ? -1 : 1;
        });
        let n = 0;
        while (n < size_array.length) {
            resultObj[time_array[n].id] += (n + 1) * 0.1;
            resultObj[size_array[n].id] += (n + 1) * 0.2;
            resultObj[weight_array[n].id] += (n + 1) * 0.7;
            n++;
        }
        size_array.map(ele => {
            Object.defineProperty(ele, 'priority', {
                value: resultObj[ele.id]
            });
        });
        size_array.sort((a, b) => {
            return a['priority'] - b['priority'] < 0 ? 1 : -1;
        })
        let inc = 0;
        while (inc < cache.size) {
            let last = size_array.pop();
            inc += last.size;
            this.CacheManager.RemoveCache(last.uri);
        }
        this.CacheManager.AddCache(cache);
    }
}