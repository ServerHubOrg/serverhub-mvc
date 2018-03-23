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

    public HasAction(controllerName: string, actionName: string): boolean {
        actionName = actionName.toLowerCase();
        return (this.Controllers.hasOwnProperty(controllerName) && this.Controllers[controllerName].Controller.hasOwnProperty(actionName));
    }

    public async DispatchController(controllerName: string, actionName: string, idString: string, search: string, dispatch: ControllDispatch): Promise<boolean> {
        const __innerOperations = async () => {
            if (this.Has(controllerName)) {
                let controller = (this.Controllers[controllerName] as ControllerBundle).Controller as Object;
                let matched = false;
                Object.keys(controller).map(async action => {
                    if (action === actionName.toLowerCase()) {
                        let context = ReadModel(controllerName);

                        controller['View'] = () => {
                            return context;
                        };

                        let shResponse = new SHResponse();
                        try {
                            context = await controller[action](dispatch.Request, shResponse, dispatch.Method);
                        } catch (e) {
                            if ((e as Error).message.match(/.*not.*define/i))
                                console.error('Undefined reference. Did you missed a "this" reference while using controller scope variables?')
                            else throw e;
                        }
                        (function wait(_wait) {
                            if (_wait)
                                setTimeout(wait, 10, controller['Runtime']['WAIT']);
                            else {
                                if (shResponse.headersSent)
                                    dispatch.Response.writeHead(shResponse.statusCode, shResponse.getHeaders() as OutgoingHttpHeaders);
                                // if (shResponse.finished)
                                if (shResponse.getContent())
                                    dispatch.Response.write(shResponse.getContent());

                                delete controller['View'];

                                if (!shResponse.headersSent) {
                                    // if (!dispatch.Response.headersSent) {
                                    dispatch.Response.setHeader('content-type', 'text/html; charset=utf-8');

                                    if (!shResponse.finished)
                                        dispatch.Response.write(ApplyModel(controllerName, context));
                                }
                                dispatch.Response.end();
                                matched = true;
                            }
                        })(controller['Runtime']['WAIT']);
                    }
                });
                return matched;
            } else {
                if (Object.keys(this.Controllers).length === 0) {
                    dispatch.Response.setHeader('content-type', 'text/html; charset=utf-8');
                    dispatch.Response.write('No controller registered, empty route dispatched.');
                    dispatch.Response.end();
                } else
                    throw new Error(ErrorManager.RenderError(RuntimeError.SH020101, controllerName));
            }
        }

        return __innerOperations().then(() => {
            return true;
        }).catch(() => {
            return false;
        })
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
    public static async Dispatch(method: string, route: RouteValue, request: IncomingMessage, response: ServerResponse): Promise<boolean> {
        return Controller.Collection.DispatchController(route.Controller, route.Action, route.Id, route.Search, {
            Method: method,
            Request: request,
            Response: response
        } as ControllDispatch).then(() => true).catch(() => false);
    }

    public static Dispatchable(controllerName: string, actionName: string): boolean {
        return Controller.Collection.HasAction(controllerName, actionName);
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


