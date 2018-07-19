import { MIDDLEWARE_COLLECTION } from "./register";
import { IncomingMessage } from "http";
import { MiddlewareBundle } from "./middleware";
import { ErrorManager } from "../error/error";


export default class MiddlewareExecutor {
    private exec_index = 0;

    public Run (req: IncomingMessage, path: string): MiddlewareBundle {
        let bundle = null;
        let res: MiddlewareBundle = void 0;
        while (bundle !== void 0) {
            bundle = this.Step(res || {
                Req: req,
                Path: path
            } as MiddlewareBundle)
            if (bundle) res = bundle;
        }
        return res;
    }

    private Step (mb: MiddlewareBundle): MiddlewareBundle {
        if (this.exec_index < MIDDLEWARE_COLLECTION.length) {
            try {
                let filter = MIDDLEWARE_COLLECTION[this.exec_index].Filter;
                if (typeof filter === 'string' && this.exec_index !== 0 && !mb.Path.startsWith(filter)) {
                    this.exec_index++;
                    return void 0;
                } else if (filter instanceof RegExp && this.exec_index !== 0 && filter.test(mb.Path) === false) {
                    this.exec_index++;
                    return void 0
                }
                this.exec_index++;
                return MIDDLEWARE_COLLECTION[this.exec_index - 1].Main(mb.Req, mb.Path) || mb;
            } catch (e) {
                throw ErrorManager.RenderError(e);
            }
        } return void 0;
    }
}
