interface CacheResult {
    FullPath: string;
    Content: string;
}
declare class CacheHelper {
    static Cache(path: string): CacheResult;
}
export default CacheHelper;
export { CacheResult };
