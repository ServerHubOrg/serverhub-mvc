/**
 * Controller Library
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

import { GlobalEnvironmentVariables } from "../global";
import { IncomingMessage, ServerResponse, OutgoingHttpHeaders } from "http";
import { ControllerBundle, Register } from "./register";
import { RuntimeError, ErrorManager } from "../error/error";
import { ApplyModel } from '../view/view';
import { ReadModel } from '../model/model';
import { Route, RouteValue } from "../../route/route";
import { SHResponse } from "./response";

const PlantableVariables = ["View", "Runtime", "Console"];

/**
 * Controller storage service provider
 */
class ControllerCollection {
    private Controllers = {};
    public Add(bundle: ControllerBundle): void {
        this.Controllers[bundle.Name] = bundle;
    }
    public Remove(controllerName: string): ControllerBundle {
        if (this.Controllers.hasOwnProperty(controllerName)) {
            let bundle = this.Controllers[controllerName];
            delete this.Controllers[controllerName];
            return bundle;
        }
        return void 0;
    }
    public Has(controllerName: string): boolean {
        if (this.Controllers.hasOwnProperty(controllerName)) {
            return true;
        }
        return false;
    }
    public DispatchController(controllerName: string, actionName: string, idString: string, search: string, dispatch: ControllDispatch): boolean {
        if (this.Has(controllerName)) {
            let controller = (this.Controllers[controllerName] as ControllerBundle).Controller as Object;
            let matched = false;
            Object.keys(controller).map(action => {
                if (action === actionName.toLowerCase()) {
                    let context = ReadModel(controllerName);

                    controller['View'] = () => {
                        return context;
                    };

                    try {
                        let shResponse = new SHResponse();
                        context = controller[action](dispatch.Request, shResponse, dispatch.Method);
                        // context = controller[action](dispatch.Request, dispatch.Response, dispatch.Method);
                        dispatch.Response.writeHead(shResponse.statusCode,shResponse.getHeaders() as OutgoingHttpHeaders);
                        dispatch.Response.write(shResponse.getContent());
                    } catch (e) {
                        if ((e as Error).message.match(/.*not.*define/i))
                            console.error('Undefined reference. Did you missed a "this" reference while using controller scope variables?')
                        else throw e;
                    }

                    delete controller['View'];

                    if (!dispatch.Response.headersSent) {
                        dispatch.Response.setHeader('content-type', 'text/html; charset=utf-8');

                        if (!dispatch.Response.writable)
                            dispatch.Response.write(ApplyModel(controllerName, context));
                    }
                    dispatch.Response.end();
                    matched = true;
                }
            });
            return matched;
        } else throw new Error(ErrorManager.RenderError(RuntimeError.SH020101, controllerName));
    }
}


/**
 * Controller operations
 */
export class Controller {
    private static Collection = new ControllerCollection();

    /**
     * Register a new controller
     * @param controller Controller file name
     */
    public static Register(controller: string) {
        Controller.Collection.Add(Register(controller));
    }

    /**
     * Unregister a controller (not frequently used)
     * @param controllerName Controller file name
     */
    public static Unregister(controllerName: string) {
        Controller.Collection.Remove(controllerName);
    }

    /**
     * Dispatch a controller.
     * @param method HTTP method
     * @param route Current hit route path
     * @param request HTTP request info
     * @param response Server response
     */
    public static Dispatch(method: string, route: RouteValue, request: IncomingMessage, response: ServerResponse): boolean {
        return Controller.Collection.DispatchController(route.Controller, route.Action, route.Id, route.Search, {
            Method: method,
            Request: request,
            Response: response
        } as ControllDispatch);
    }

}

/**
 * Contains values that will be passed to custom controller action.
 */
interface ControllDispatch {
    Method: string;
    Request: IncomingMessage;
    Response: ServerResponse;
}


