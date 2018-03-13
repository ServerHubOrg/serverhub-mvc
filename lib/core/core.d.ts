/**
 * Type Definition for core.ts
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

export function RegisterController(controllerJs: string): void;

export function UpdateGlobalVariable(variable: string, value: Object): boolean;

export function SetGlobalVariable(variable: string, value: Object): void;

export function RoutePath(path: string, req: any, res: any): void;
export function RegisterRouter(route: any): void;
