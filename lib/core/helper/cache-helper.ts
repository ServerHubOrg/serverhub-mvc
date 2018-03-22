/**
 * FileHelper Library
 * 
 * ServerHub MVC, MIT License
 * March 21, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

/**
 * CacheHelper is designed to cache any text based files (not just user generated files). The only limit is file size. File longer than 2097150 (2*1024^2) will not be cacheable.
 * This helper can only be used inside ServerHub, and developers can not get access to it.
 */

import * as fs from 'fs';

interface CacheResult {
    FullPath: string;
    Content: string;
}

const _CachedFiles = new Array<string>(0);
const _CachedCollection = {} as Object;

/**
 * CacheHelper provide several static function members that can fetch and cachce specific content with a file watching callback.
 */
class CacheHelper {

    /**
     * Return cached content.
     * @param path Full path, which is a physical path of the content.
     */
    public static Cache(path: string): CacheResult {
        let mappedPath = MapCharacters(path);
        if (_CachedFiles.indexOf(mappedPath) !== -1) {
            return _CachedCollection[mappedPath];
        } else {
            if (fs.statSync(path).isDirectory() || !fs.existsSync(path)) return { FullPath: path, Content: '' } as CacheResult;
            _CachedCollection[mappedPath] = {
                FullPath: path
                , Content: fs.readFileSync(path).toString()
            };

            fs.watchFile(path, () => {
                if (fs.statSync(path).isDirectory() || !fs.existsSync(path)) {
                    delete _CachedCollection[mappedPath]; _CachedFiles.splice(_CachedFiles.indexOf(mappedPath), 1)
                }
                else
                    _CachedCollection[mappedPath] = {
                        FullPath: path
                        , Content: fs.readFileSync(path).toString()
                    };
            });
            _CachedFiles.push(mappedPath);
            return _CachedCollection[mappedPath];
        }
    }
}

/**
 * Wrap invalid characters to "_XX" like strings.
 * @param input original input string.
 */
function MapCharacters(input: string): string {
    return RW(input);
}

const RW = (source: string, index = 0) => index < (Matrix.length - 1) ? RW(source.replace.call(source, ...(Matrix[index])), index + 1) : source.replace.call(source, ...(Matrix[index]));

const Matrix = [
    [/(\!)/g, '_21'],
    [/(\#)/g, '_23'],
    [/(\%)/g, '_25'],
    [/(\&)/g, '_26'],
    [/(\')/g, '_27'],
    [/(\()/g, '_28'],
    [/(\))/g, '_29'],
    [/(\+)/g, '_2B'],
    [/(\,)/g, '_2C'],
    [/(\/)/g, '_2F'],
    [/(\:)/g, '_3A'],
    [/(\;)/g, '_3B'],
    [/(\>)/g, '_3E'],
    [/(\.)/g, '_56'],
    [/(\[)/g, '_5B'],
    [/(\\)/g, '_5C'],
    [/(\])/g, '_5D'],
    [/(\^)/g, '_5E'],
    [/(\`)/g, '_60'],
    [/(\{)/g, '_7B'],
    [/(\})/g, '_7D'],
    [/(\~)/g, '_7E']
];

export default CacheHelper;