"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("./register");
const error_1 = require("../error/error");
const view_1 = require("../view/view");
const model_1 = require("../model/model");
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
                    controller['Console'] = global.console;
                    controller['Runtime'] = {
                        branch: 'beta'
                    };
                    try {
                        context = controller[action](dispatch.Request, dispatch.Response, dispatch.Method);
                    }
                    catch (e) {
                        if (e.message.match(/.*not.*define/i))
                            console.error('Undefined function called. Did you missed a "this" reference while calling "View()"?');
                    }
                    PlantableVariables.forEach((variable) => {
                        delete controller[variable];
                    });
                    dispatch.Response.setHeader('content-type', 'text/html; charset=utf-8');
                    dispatch.Response.write(view_1.ApplyModel(controllerName, context));
                    dispatch.Response.end();
                    matched = true;
                }
            });
            return matched;
        }
        else
            throw new Error(error_1.ErrorManager.RenderError(error_1.RuntimeError.SH020101, controllerName));
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
}
Controller.Collection = new ControllerCollection();
exports.Controller = Controller;
