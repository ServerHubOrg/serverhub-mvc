"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const _CachedFiles = new Array(0);
const _CachedCollection = {};
class CacheHelper {
    static Cache(path) {
        let mappedPath = MapCharacters(path);
        if (_CachedFiles.indexOf(mappedPath) !== -1) {
            return _CachedCollection[mappedPath];
        }
        else {
            if (!fs.existsSync(path))
                return void 0;
            _CachedCollection[mappedPath] = {
                FullPath: path,
                Content: fs.readFileSync(path).toString()
            };
            fs.watchFile(path, () => {
                if (!fs.existsSync(path)) {
                    delete _CachedCollection[mappedPath];
                    _CachedFiles.splice(_CachedFiles.indexOf(mappedPath), 1);
                }
                else
                    _CachedCollection[mappedPath] = {
                        FullPath: path,
                        Content: fs.readFileSync(path).toString()
                    };
            });
            _CachedFiles.push(mappedPath);
            return _CachedCollection[mappedPath];
        }
    }
}
function MapCharacters(input) {
    return RW(input);
}
const RW = (source, index = 0) => index < (Matrix.length - 1) ? RW(source.replace.call(source, ...(Matrix[index])), index + 1) : source.replace.call(source, ...(Matrix[index]));
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
exports.default = CacheHelper;
