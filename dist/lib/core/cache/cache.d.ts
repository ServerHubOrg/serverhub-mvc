export declare class Cache {
    private _id;
    private _uri;
    private _content_type;
    readonly id: string;
    readonly uri: string;
    readonly content_type: string;
    private GenerateId();
    etags: string;
    cache: object | string;
    date_time: number;
    expires: number;
    weight: number;
    size: number;
    modify_time: Date;
    constructor(uri: string, content_type: string);
}
export declare class CacheReportInfo {
    size: number;
    weight: number;
    time: number;
    id: string;
    uri: string;
    modify_time: Date;
}
export declare class CacheStorage {
    private Caches;
    private TotalCache;
    constructor();
    AddCache(cache: Cache): void;
    RemoveCache(key: string): Cache;
    UpdateCache(cache: Cache): boolean;
    CacheSize(): number;
    HasCache(uri: string): boolean;
    HitCache(uri: string): Cache;
    ClearCache(): void;
    CacheReport(): Map<string, CacheReportInfo>;
}
