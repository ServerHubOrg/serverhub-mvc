const strict_mode_check = new RegExp(`^(?:'use strict';)|(?:"use strict";).*$`);

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

export default FunctionWrapper;