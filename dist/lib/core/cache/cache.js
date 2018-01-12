"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cache {
    get id() {
        return this._id;
    }
    get uri() {
        return this._uri;
    }
    get content_type() {
        return this._content_type;
    }
    GenerateId() {
        let n = 32;
        let id = '';
        while (n > 0) {
            id += ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'][Math.floor(Math.random() * 10)];
            n--;
        }
        return id;
    }
    constructor(uri, content_type) {
        if (!uri || !content_type)
            throw new Error("Required parameters not satisfied.");
        this._id = this.GenerateId();
        this._uri = uri;
        this._content_type = content_type;
    }
}
exports.Cache = Cache;
class CacheReportInfo {
}
exports.CacheReportInfo = CacheReportInfo;
class CacheStorage {
    constructor() {
        this.Caches = new Map();
    }
    AddCache(cache) {
        if (this.Caches) {
            if (!this.Caches.has(cache.uri)) {
                if (!this.TotalCache)
                    this.TotalCache = cache.size;
                else
                    this.TotalCache += cache.size;
                this.Caches.set(cache.uri, cache);
            }
            else
                throw new Error('Cache already exists, cannot be added more than once.');
        }
        else {
            this.Caches = new Map([[cache.uri, cache]]);
            this.TotalCache = cache.size;
        }
        this.Caches.get(cache.uri).weight = 1;
    }
    RemoveCache(key) {
        if (this.Caches && this.Caches.has(key)) {
            let cache = this.Caches.get(key);
            this.Caches.delete(key);
            this.TotalCache -= cache.size;
            return cache;
        }
        else
            return void 0;
    }
    UpdateCache(cache) {
        if (this.Caches && this.Caches.has(cache.uri)) {
            this.TotalCache -= this.Caches.get(cache.uri).size;
            cache.weight = this.Caches.get(cache.uri).weight;
            this.Caches.set(cache.uri, cache);
            this.TotalCache += cache.size;
            return true;
        }
        else
            return false;
    }
    CacheSize() {
        return this.TotalCache ? this.TotalCache : 0;
    }
    HasCache(uri) {
        if (this.Caches && this.Caches.has(uri))
            return true;
        return false;
    }
    HitCache(uri) {
        if (this.Caches && this.Caches.has(uri)) {
            let cache = this.Caches.get(uri);
            cache.weight++;
            this.Caches.set(uri, cache);
            return cache;
        }
    }
    ClearCache() {
        this.Caches = void 0;
        this.TotalCache = 0;
    }
    CacheReport() {
        let arr = new Map();
        this.Caches.forEach(ele => {
            let obj = {
                size: ele.size,
                uri: ele.uri,
                id: ele.id,
                weight: ele.weight,
                time: ele.date_time
            };
            arr.set(ele.uri, obj);
        });
        return arr;
    }
}
exports.CacheStorage = CacheStorage;
