/// <reference types="node" />
import { Cache } from './cache';
import { ServerResponse, IncomingMessage } from 'http';
export declare class RCS {
    private constructor();
    private static Instance;
    static Service(): RCS;
    private CacheManager;
    private GenerateEtag();
    Cacheable(uri: string): boolean;
    GetUri(uri: string, res: ServerResponse, req: IncomingMessage): void;
    GetCacheReport(res: ServerResponse): void;
    WCS(cache: Cache): void;
}
