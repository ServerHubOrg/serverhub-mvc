"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("./register");
const error_1 = require("../error/error");
class MiddlewareExecutor {
    constructor() {
        this.exec_index = 0;
    }
    Run(req, path) {
        let bundle = null;
        let res = void 0;
        while (bundle !== void 0) {
            bundle = this.Step(res || {
                Req: req,
                Path: path
            });
            if (bundle)
                res = bundle;
        }
        return res;
    }
    Step(mb) {
        if (this.exec_index < register_1.MIDDLEWARE_COLLECTION.length) {
            try {
                let filter = register_1.MIDDLEWARE_COLLECTION[this.exec_index].Filter;
                if (typeof filter === 'string' && this.exec_index !== 0 && !mb.Path.startsWith(filter)) {
                    this.exec_index++;
                    return void 0;
                }
                else if (filter instanceof RegExp && this.exec_index !== 0 && filter.test(mb.Path) === false) {
                    this.exec_index++;
                    return void 0;
                }
                this.exec_index++;
                return register_1.MIDDLEWARE_COLLECTION[this.exec_index - 1].Main(mb.Req, mb.Path) || mb;
            }
            catch (e) {
                throw error_1.ErrorManager.RenderError(e);
            }
        }
        return void 0;
    }
}
exports.default = MiddlewareExecutor;
