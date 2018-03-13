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
            return cache;
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
                time: ele.date_time
            } as CacheReportInfo;
            arr.set(ele.uri, obj);
        });
        return arr;
    }
}