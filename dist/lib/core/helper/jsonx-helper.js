"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsb = require("js-beautify");
let btf = jsb;
function Convert(obj, options = {
        indent_size: 4,
        indent_char: ' '
    }) {
    return btf(Object2String(obj), options);
}
exports.Convert = Convert;
function Object2String(obj) {
    if (typeof obj === void 0)
        return;
    var lines = new Array(0);
    if (typeof obj === 'object') {
        if (obj instanceof Array) {
            lines.push('[');
            for (let index = 0; index < obj.length; index++) {
                let content = Object2String(obj[index]);
                if (index !== 0 && content !== void 0) {
                    lines.push(',');
                    lines.push(content);
                }
                else if (content !== void 0)
                    lines.push(content);
            }
            lines.push('],');
        }
        else {
            let keys = Object.keys(obj);
            lines.push('{');
            for (var key of keys) {
                lines = lines.concat([key, ':', Object2String(obj[key]), ',']);
            }
            lines.push('},');
        }
    }
    else if (typeof obj === 'string') {
        obj = obj.replace(/'/g, '\\\'');
        lines = lines.concat(['\'', obj, '\',']);
    }
    else if (typeof obj === 'boolean' || typeof obj === 'number')
        lines.push(obj.toString() + ',');
    let res = lines.join('');
    res = res.replace(',,', ',');
    res = res.replace(',}', '}');
    res = res.replace(',]', ']');
    return res.replace(/,$/, '');
}
