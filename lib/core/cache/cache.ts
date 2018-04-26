import { StorageService, FileInfo } from "../storage/storage";
import { GlobalEnvironmentVariables } from "../global";
import { ContentType } from "../content-type";

/**
 * Cache Manage Library
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

export class Cache {
    private _id: string;
    private _uri: string;
    private _content_type: string;

    get id(): string {
        return this._id;
    }

    get uri(): string {
        return this._uri;
    }

    get content_type(): string {
        return this._content_type;
    }

    private GenerateId(): string {
        let n = 32;
        let id = '';
        while (n > 0) {
            id += ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'][Math.floor(Math.random() * 10)];
            n--;
        }
        return id;
    }
    public etags: string;
    public cache: object | string;
    public date_time: number;
    public expires: number;
    public weight: number;
    public size: number;
    public modify_time: Date;
    constructor(uri: string, content_type: string) {
        if (!uri || !content_type)
            throw new Error("Required parameters not satisfied.");
        this._id = this.GenerateId();
        this._uri = uri;
        this._content_type = content_type;
    }
}
export class CacheReportInfo {
    size: number;
    weight: number;
    time: number;
    id: string;
    uri: string;
    modify_time: Date
}
function GenerateEtag(): string {
    let n = 16;
    let tag = '';
    while (n > 0) {
        tag += ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'][Math.floor(Math.random() * 10)];
        n--;
    }
    return tag;
}
export class CacheStorage {
    private Caches: Map<string, Cache>;

    private TotalCache: number;

    constructor() {
        this.Caches = new Map<string, Cache>();
    }
    public AddCache(cache: Cache): void {
        if (this.Caches) {
            if (!this.Caches.has(cache.uri)) {
                if (!this.TotalCache)
                    this.TotalCache = cache.size;
                else
                    this.TotalCache += cache.size;
                this.Caches.set(cache.uri, cache);
            }
            else throw new Error('Cache already exists, cannot be added more than once.');
        } else {
            this.Caches = new Map<string, Cache>([[cache.uri, cache]]);
            this.TotalCache = cache.size;
        }

        this.Caches.get(cache.uri).weight = 1;
    }

    public RemoveCache(key: string): Cache {
        if (this.Caches && this.Caches.has(key)) {
            let cache = this.Caches.get(key);
            this.Caches.delete(key);
            this.TotalCache -= cache.size;
            return cache;
        } else return void 0;
    }

    public UpdateCache(cache: Cache): boolean {
        if (this.Caches && this.Caches.has(cache.uri)) {
            this.TotalCache -= this.Caches.get(cache.uri).size;
            cache.weight = this.Caches.get(cache.uri).weight;
            this.Caches.set(cache.uri, cache);
            this.TotalCache += cache.size;
            return true;
        } else return false;
    }
    public CacheSize(): number {
        return this.TotalCache ? this.TotalCache : 0;
    }
    public HasCache(uri: string): boolean {
        if (this.Caches && this.Caches.has(uri))
            return true;
        return false;
    }

    public HitCache(uri: string): Cache {
        if (this.Caches && this.Caches.has(uri)) {
            let cache = this.Caches.get(uri);
            cache.weight++;
            this.Caches.set(uri, cache);
            setTimeout(() => {
                this.SelfUpdate(cache);
            }, 0)
            return cache;
        }
    }

    private SelfUpdate(cache: Cache) {
        let variables = global['EnvironmentVariables'] as GlobalEnvironmentVariables;
        let uri = cache.uri.startsWith('/') ? cache.uri.substr(1) : cache.uri;
        let info: FileInfo;
        try {
            info = StorageService.Service((global['EnvironmentVariables'] as GlobalEnvironmentVariables).WebDir).FileInfo(uri);
            let file = StorageService.Service(variables.WebDir).GetFile(uri);
            let ext = info.Extension ? info.Extension : '___';
            let ncache = new Cache(cache.uri, ContentType.GetContentType(ext));
            ncache.etags = GenerateEtag();
            ncache.cache = file;
            ncache.date_time = new Date().getTime();
            ncache.modify_time = info.ModifiedTime;
            ncache.size = info.Size;
            ncache.expires = 604800;
            if (ncache.size !== info.Size) {
                let templateTotal = this.TotalCache - ncache.size + info.Size;
                let maxsize = variables.MaxCacheSize * 1024 * 1024;
                if (templateTotal > maxsize) {
                    throw new Error('Cache too large');
                }
            }
            this.UpdateCache(ncache);
        } catch (error) {
            this.RemoveCache(cache.uri);
        }

    }

    public ClearCache(): void {
        this.Caches = void 0;
        this.TotalCache = 0;
    }

    public CacheReport(): Map<string, CacheReportInfo> {
        let arr = new Map<string, CacheReportInfo>();
        this.Caches.forEach(ele => {
            let obj = {
                size: ele.size,
                uri: ele.uri,
                id: ele.id,
                weight: ele.weight,
                time: ele.date_time,
                modify_time: ele.modify_time
            } as CacheReportInfo;
            arr.set(ele.uri, obj);
        });
        return arr;
    }
}