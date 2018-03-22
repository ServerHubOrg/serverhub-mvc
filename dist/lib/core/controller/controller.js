"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("./register");
const error_1 = require("../error/error");
const view_1 = require("../view/view");
const model_1 = require("../model/model");
const response_1 = require("./response");
const PlantableVariables = ["View", "Runtime", "Console"];
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
        if (this.Has(controllerName)) {
            let controller = this.Controllers[controllerName].Controller;
            let matched = false;
            Object.keys(controller).map(action => {
                if (action === actionName.toLowerCase()) {
                    let context = model_1.ReadModel(controllerName);
                    controller['View'] = () => {
                        return context;
                    };
                    let shResponse = new response_1.SHResponse();
                    try {
                        context = controller[action](dispatch.Request, shResponse, dispatch.Method);
                        if (shResponse.headersSent)
                            dispatch.Response.writeHead(shResponse.statusCode, shResponse.getHeaders());
                        if (shResponse.getContent())
                            dispatch.Response.write(shResponse.getContent());
                    }
                    catch (e) {
                        if (e.message.match(/.*not.*define/i))
                            console.error('Undefined reference. Did you missed a "this" reference while using controller scope variables?');
                        else
                            throw e;
                    }
                    delete controller['View'];
                    if (!shResponse.headersSent) {
                        dispatch.Response.setHeader('content-type', 'text/html; charset=utf-8');
                        if (!shResponse.finished)
                            dispatch.Response.write(view_1.ApplyModel(controllerName, context));
                    }
                    dispatch.Response.end();
                    matched = true;
                }
            });
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
    }
}
class Controller {
    static Register(controller) {
        Controller.Collection.Add(register_1.Register(controller));
    }
    static Unregister(controllerName) {
        Controller.Collection.Remove(controllerName);
    }
    static Dispatch(method, route, request, response) {
        return Controller.Collection.DispatchController(route.Controller, route.Action, route.Id, route.Search, {
            Method: method,
            Request: request,
            Response: response
        });
    }
    static Dispatchable(controllerName, actionName) {
        return Controller.Collection.HasAction(controllerName, actionName);
    }
}
Controller.Collection = new ControllerCollection();
exports.Controller = Controller;
