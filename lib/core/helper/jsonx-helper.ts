/** 
 * JSON Convert Helper
 * 
 * ServerHub MVC, MIT License
 * March 22, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 * Convert JavaScript object instance to identical string object in JavaScript style (without double-quote).
 * 
 * Modified from DevChache/object2jsstr
 */

import * as jsb from "js-beautify";

let btf = jsb as Function;


function Convert(obj, options = {
    indent_size: 4,
    indent_char: ' '
}) {
    return btf(Object2String(obj), options);
}


function Object2String(obj: Object) {
    if (typeof obj === void 0)
        return;
    var lines = new Array(0);
    if (typeof obj === 'object') {
        if (obj instanceof Array) {
            // array
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
        } else {
            // object
            let keys = Object.keys(obj);
            lines.push('{');
            for (var key of keys) {
                lines = lines.concat([key, ':', Object2String(obj[key]), ',']);
            }
            lines.push('},');
        }
    } else if (typeof obj === 'string') { // string
        obj = (obj as string).replace(/'/g, '\\\'');
        lines = lines.concat(['\'', obj, '\',']);
    }
    else if (typeof obj === 'boolean' || typeof obj === 'number') // boolean, number
        lines.push((obj as any).toString() + ',');
    let res = lines.join('');
    res = res.replace(',,', ',');
    res = res.replace(',}', '}');
    res = res.replace(',]', ']');
    return res.replace(/,$/, '');
}


export { Convert };