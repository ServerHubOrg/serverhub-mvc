"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("./cache");
const error_1 = require("../error/error");
const storage_1 = require("../storage/storage");
const content_type_1 = require("../content-type");
const helper_1 = require("../helper");
const npath = require("path");
const nfs = require("fs");
class RCS {
    constructor() {
        this.CacheManager = new cache_1.CacheStorage();
    }
    static Service() {
        return RCS.Instance;
    }
    GenerateEtag() {
        let n = 16;
        let tag = '';
        while (n > 0) {
            tag += ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'][Math.floor(Math.random() * 10)];
            n--;
        }
        return tag;
    }
    Cacheable(uri) {
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
            else
                return false;
        }
        else {
            return void 0;
        }
    }
    GetUri(uri, res, req) {
        let variables = global['EnvironmentVariables'];
        if (this.Cacheable(uri)) {
            if (uri.endsWith('?'))
                uri = uri.substr(0, uri.length - 1);
            let cache;
            if (this.CacheManager.HasCache(uri)) {
                cache = this.CacheManager.HitCache(uri);
            }
            else {
                let info;
                try {
                    info = storage_1.StorageService.Service(global['EnvironmentVariables'].WebDir).FileInfo(uri.substr(1));
                }
                catch (error) {
                    res.writeHead(404, 'content-type: text/html');
                    if (variables.PageNotFound && variables.PageNotFound.length !== 0)
                        res.write(helper_1.CacheHelper.Cache(npath.resolve(variables.ServerBaseDir, variables.PageNotFound)).Content);
                    else
                        res.write(error_1.ErrorManager.RenderErrorAsHTML(error));
                    res.end();
                    return;
                }
                let ext = info.Extension ? info.Extension : '___';
                if (info.Size <= 10 * 1024 * 1024) {
                    try {
                        let file = storage_1.StorageService.Service(variables.WebDir).GetFile(uri.substr(1));
                        cache = new cache_1.Cache(uri, content_type_1.ContentType.GetContentType(ext));
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
                        }
                        catch (err) {
                            this.CacheManager.HitCache(uri);
                        }
                    }
                    catch (error) {
                        res.writeHead(404, 'content-type: text/html');
                        if (variables.PageNotFound && variables.PageNotFound.length !== 0)
                            res.write(helper_1.CacheHelper.Cache(npath.resolve(variables.ServerBaseDir, variables.PageNotFound)).Content);
                        else
                            res.write(error_1.ErrorManager.RenderErrorAsHTML(new Error(error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020706, uri))));
                        res.end();
                        return;
                    }
                    if (!res.headersSent) {
                        res.setHeader('content-type', cache.content_type);
                        res.setHeader('etags', cache.etags);
                        res.write(cache.cache);
                        res.end();
                    }
                }
                else {
                    try {
                        let rangestring = req ? (req.headers['range'] ? req.headers['range'] : req.headers['Range']) : void 0;
                        if (rangestring !== void 0) {
                            let ranges = this.ParseRange(rangestring);
                            let contentrangeHeader = 'bytes=';
                            let buffers = new Array(0);
                            let scanned = 0;
                            ranges.forEach((range, index) => {
                                if (range.End >= info.Size) {
                                    res.statusCode = 416;
                                    res.setHeader('Content-Range', '*/' + info.Size);
                                    res.write(error_1.ErrorManager.RenderErrorAsHTML(new Error('Range Not Satisfiable')));
                                    scanned += 1;
                                    return;
                                }
                                let buff = Buffer.from('');
                                let read = range.Start;
                                let rstream = nfs.createReadStream(info.Path, { start: range.Start, end: range.End });
                                rstream.on('data', d => {
                                    buff = Buffer.concat([buff, d]);
                                });
                                rstream.on('error', () => {
                                    read += rstream.bytesRead;
                                    contentrangeHeader += (range.Start + '-' + (read > 0) ? read : '') + ' ';
                                    buffers.push(buff);
                                    scanned += 1;
                                });
                                rstream.on('close', () => {
                                    contentrangeHeader += (range.Start + '-' + (range.End > 0) ? range.End : '') + ' ';
                                    buffers.push(buff);
                                    scanned += 1;
                                });
                            });
                            const loop = () => {
                                if (scanned === ranges.length) {
                                    res.statusCode = 206;
                                    res.setHeader('Content-Range', contentrangeHeader);
                                    res.setHeader('Accept-Ranges', 'bytes');
                                    buffers.forEach(buf => {
                                        res.write(buf);
                                    });
                                    res.end();
                                    return;
                                }
                                else
                                    setTimeout(loop, 10);
                            };
                            setTimeout(loop, 10);
                        }
                        else {
                            let maxSize = 30 * 1024 * 1024;
                            let rstream = nfs.createReadStream(info.Path);
                            res.statusCode = 200;
                            if (variables.Verbose)
                                console.log("ready to write");
                            res.setHeader('Content-Type', content_type_1.ContentType.GetContentType(info.Extension));
                            res.setHeader('Accept-Ranges', 'bytes');
                            rstream.on('data', data => {
                                res.write(data);
                                if (variables.Verbose)
                                    console.log("wrote", data.length, 'bytes of data');
                            });
                            rstream.on('close', () => {
                                if (variables.Verbose)
                                    console.log('done wrote.');
                                if (rstream.bytesRead < info.Size) {
                                    res.setHeader('Content-Range', `bytes=0-${maxSize}`);
                                    res.statusCode = 206;
                                }
                                res.end();
                            });
                            rstream.on('error', () => {
                                res.setHeader('Content-Range', `bytes=0-${rstream.bytesRead}`);
                                if (variables.Verbose)
                                    console.log('error happended');
                                res.statusCode = 206;
                            });
                            rstream.read(info.Size > maxSize ? maxSize : info.Size);
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
        }
        else
            throw new Error(error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020707, uri));
    }
    ParseRange(rangeString) {
        let unit = 'bytes';
        let content = '';
        if (rangeString.indexOf('=') !== -1) {
            [unit, content] = rangeString.split('=');
        }
        else
            content = rangeString;
        let pairs = new Array(0);
        content.split(',').forEach(g => {
            g = g.trim();
            let vals = g.split('-');
            pairs.push({ Start: vals[0] === '' ? 0 : parseInt(vals[0]), End: vals[1] === '' ? -1 : parseInt(vals[1]) });
        });
        return pairs;
    }
    GetCacheReport(res) {
        res.setHeader('content-type', "text/html");
        let ret = '';
        let entries = this.CacheManager.CacheReport().entries();
        let total = this.CacheManager.CacheSize();
        for (let item of entries) {
            let cache = item[1];
            ret += `<tr><td class='uri'>${item[0]}</td><td class='id'>${cache.id}</td><td class='weight'>${cache.weight}</td><td class='size'>${cache.size} byte</td></tr>`;
        }
        let displaytotal = '';
        if (total > 1024 * 1024 * 1024) {
            displaytotal = total / 1024 / 1024 / 1024 + ' GB';
        }
        else if (total > 1024 * 1024) {
            displaytotal = total / 1024 / 1024 + ' MB';
        }
        else if (total > 1024) {
            displaytotal = total / 1024 + ' KB';
        }
        else
            displaytotal = total + ' Byte';
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
    WCS(cache) {
        let time_array = new Array(0);
        let weight_array = new Array(0);
        let size_array = new Array(0);
        let entries = this.CacheManager.CacheReport().entries();
        let resultObj = {};
        for (let entry of entries) {
            time_array.push(Object.create(entry[1]));
            weight_array.push(Object.create(entry[1]));
            size_array.push(Object.create(entry[1]));
            resultObj[entry[1].id] = 0;
        }
        time_array = time_array.sort((a, b) => {
            return a.time < b.time ? -1 : 1;
        });
        weight_array = weight_array.sort((a, b) => {
            return a.weight < b.weight ? -1 : 1;
        });
        size_array = size_array.sort((a, b) => {
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
        });
        let inc = 0;
        while (inc < cache.size) {
            let last = size_array.pop();
            inc += last.size;
            this.CacheManager.RemoveCache(last.uri);
        }
        this.CacheManager.AddCache(cache);
    }
}
RCS.Instance = new RCS();
exports.RCS = RCS;
