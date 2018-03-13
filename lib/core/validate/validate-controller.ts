import IValidator, { FunctionDefinition } from "./base";
export default class ControllerValidation extends IValidator {
    readonly RequiredFunctions = [{
        FunctionName: 'index',
        Required: true,
        ParamRequirement: 2
    }, {
        FunctionName: 'primary',
        Required: false,
        ParamRequirement: 2
    }];
    private Target: Object;
    constructor() {
        super();
    }
    public Validate(obj: Object): boolean {
        if (obj)
            this.Target = obj;
        else throw new Error('File content must not be empty');
        let allpass = true;
        this.RequiredFunctions.forEach(func => {
            if (allpass) allpass = this.PassFunction(func);
        });
        return allpass;
    }
    protected PassFunction(definition: FunctionDefinition): boolean {
        if (this.Target === void 0 || this.Target === null)
            throw new Error('Validate() method must be called before checking each function');

        if (!this.Target.hasOwnProperty(definition.FunctionName)) {
            if (definition.Required) throw new Error(`Custom controller must implement ${definition.FunctionName}() method.`);
            else return true;
        } else {
            // check parameters.
            if (this.Target[definition.FunctionName].length >= definition.ParamRequirement)
                return true;
            else return definition.Required ? false : true;
        }
    }
}