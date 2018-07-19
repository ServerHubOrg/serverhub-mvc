import { Middleware } from "./middleware";

const MIDDLEWARE_COLLECTION = new Array<Middleware>(0);


export default function (mw: Middleware) {
    MIDDLEWARE_COLLECTION.push(mw);
}

export { MIDDLEWARE_COLLECTION };