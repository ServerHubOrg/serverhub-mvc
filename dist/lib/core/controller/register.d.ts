export interface ControllerBundle {
    Name: string;
    FileName: string;
    Controller: Object;
}
export declare function Register(controllerJs: string): ControllerBundle;
