/**
 * Type Definition for rcs.ts
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

export class RCS {
    public static Service(): RCS;
    public GetUri(uri: string, res: any): void;
    public Cacheable(uri: string): boolean
}