/**
 * Type Definition of cache.ts
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

export class CacheStorage {
    constructor();
    public AddCache(cache: Cache): void;

    public RemoveCache(key: string): Cache;

    public UpdateCache(cache: Cache): boolean;

    public HitCache(uri: string): Cache;

    public ClearCache(): void;

    public CacheReport(): Map<string, number>;
}

export class Cache {
    public etags: string;
    public cache: object;
    public date_time: number;
    public expires: number;
    public weight: number;
    constructor(uri: string, content_type: string);
}