/**
 * Wrapper Library Entry
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

/**
 * Wrap and immediate invoke input function string. Return its execution result.
 * 
 * @param {string} obj_string Input function string.
 */
function FunctionWrapper(obj_string: string): Object {
    try {
        if (!strict_mode_check.test(obj_string))
            obj_string = '"use strict";' + obj_string;
        let output = Function(obj_string)();
        if (typeof output === 'object')
            return output;
        else throw new Error();
    } catch (e) {
        throw new Error('Input JavaScript content is not valid. Here is an example: "return {a: function(){} }"');
    }
}

/**
 * A regular expression object that help interpolate "use strict"; to the input string.
 */
const strict_mode_check = new RegExp(`^(?:'use strict';)|(?:"use strict";).*`);

export default FunctionWrapper;