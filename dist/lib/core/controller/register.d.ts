interface ControllerBundle {
    Name: string;
    FileName: string;
    Controller: Object;
}
declare function Register(controllerJs: string): ControllerBundle;
declare function RegisterM(controllerJs: string): ControllerBundle;
export { Register, RegisterM, ControllerBundle };
