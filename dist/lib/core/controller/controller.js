"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("./register");
const error_1 = require("../error/error");
const view_1 = require("../view/view");
const model_1 = require("../model/model");
const response_1 = require("./response");
const PlantableVariables = ["View", "Runtime", "Console"];
const SearchRegex = /(((?:[-a-z\d$_.+!*'(),]|(?:%[\da-f]{2}))|[;:@&=])+)/i;
const QueryRegex = /((?:(?:[-a-z\d$_.+!*'(),]|(?:%[\da-f]{2}))|[;:@])+)=((?:(?:[-a-z\d$_.+!*'(),]|(?:%[\da-f]{2}))|[;:@])+)/i;
class ControllerCollection {
    constructor() {
        this.Controllers = {};
    }
    Add(bundle) {
        this.Controllers[bundle.Name] = bundle;
    }
    Remove(controllerName) {
        if (this.Controllers.hasOwnProperty(controllerName)) {
            let bundle = this.Controllers[controllerName];
            delete this.Controllers[controllerName];
            return bundle;
        }
        return void 0;
    }
    Has(controllerName) {
        if (this.Controllers.hasOwnProperty(controllerName)) {
            return true;
        }
        return false;
    }
    HasAction(controllerName, actionName) {
        actionName = actionName.toLowerCase();
        return (this.Controllers.hasOwnProperty(controllerName) && this.Controllers[controllerName].Controller.hasOwnProperty(actionName));
    }
    DispatchController(controllerName, actionName, idString, search, dispatch) {
        return __awaiter(this, void 0, void 0, function* () {
            let searchGroup = new Map();
            if (search && search.length > 2) {
                if (!SearchRegex.test(search))
                    console.error('search not valid:', search);
                else {
                    let all = search.match(SearchRegex)[1];
                    all.split('&').forEach(query => {
                        let match = query.match(QueryRegex);
                        if (match && match.length === 3) {
                            searchGroup.set(match[1], match[2]);
                        }
                    });
                }
            }
            const __innerOperations = () => __awaiter(this, void 0, void 0, function* () {
                if (this.Has(controllerName)) {
                    let controller = this.Controllers[controllerName].Controller;
                    let matched = false;
                    Object.keys(controller).map((action) => __awaiter(this, void 0, void 0, function* () {
                        if (action === actionName.toLowerCase()) {
                            let context = model_1.ReadModel(controllerName);
                            controller['View'] = () => {
                                return context;
                            };
                            let shResponse = new response_1.SHResponse();
                            let variables = global['EnvironmentVariables'];
                            let timeout = variables.AsyncOperationTimeout;
                            const wait_loop = (_wait) => {
                                if (_wait && timeout > 0) {
                                    timeout = timeout ? timeout - 10 : 10;
                                    setTimeout(wait_loop, 10, controller['Runtime']['WAIT']);
                                }
                                else {
                                    if (timeout <= 0) {
                                        console.error('Request to:', dispatch.Request.url, 'timeout because current timeout limit is', variables.AsyncOperationTimeout, 'milliseconds');
                                    }
                                    if (shResponse.headersSent)
                                        dispatch.Response.writeHead(shResponse.statusCode, shResponse.getHeaders());
                                    if (shResponse.getContent())
                                        dispatch.Response.write(shResponse.getContent());
                                    delete controller['View'];
                                    if (!shResponse.headersSent) {
                                        dispatch.Response.setHeader('content-type', 'text/html; charset=utf-8');
                                        if (!shResponse.finished)
                                            dispatch.Response.write(view_1.ApplyModel(controllerName, context));
                                    }
                                    dispatch.Response.end();
                                    shResponse = void 0;
                                    matched = true;
                                }
                            };
                            try {
                                context = yield controller[action](dispatch.Request, shResponse, dispatch.Method, idString, searchGroup);
                            }
                            catch (e) {
                                if (e.message.match(/.*not.*define/i))
                                    console.error('Undefined reference. Did you missed a "this" reference while using controller scope variables?');
                                else
                                    throw e;
                            }
                            wait_loop(controller['Runtime']['WAIT']);
                        }
                    }));
                    return matched;
                }
                else {
                    if (Object.keys(this.Controllers).length === 0) {
                        dispatch.Response.setHeader('content-type', 'text/html; charset=utf-8');
                        dispatch.Response.write('No controller registered, empty route dispatched.');
                        dispatch.Response.end();
                    }
                    else
                        throw new Error(error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020101, controllerName));
                }
            });
            return __innerOperations().then(() => {
                return true;
            }).catch(() => {
                return false;
            });
        });
    }
}
class Controller {
    static Register(controller) {
        Controller.Collection.Add(register_1.Register(controller));
    }
    static RegisterM(controller) {
        Controller.Collection.Add(register_1.RegisterM(controller));
    }
    static Unregister(controllerName) {
        Controller.Collection.Remove(controllerName);
    }
    static Dispatch(method, route, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return Controller.Collection.DispatchController(route.Controller, route.Action, route.Id, route.Search, {
                Method: method,
                Request: request,
                Response: response
            }).then(() => true).catch(() => false);
        });
    }
    static Dispatchable(controllerName, actionName) {
        return Controller.Collection.HasAction(controllerName, actionName);
    }
}
Controller.Collection = new ControllerCollection();
exports.Controller = Controller;
