import Validator, { FunctionDefinition } from "./base";
export default class ControllerValidation extends Validator {
    readonly RequiredFunctions: {
        FunctionName: string;
        Required: boolean;
        ParamRequirement: number;
    }[];
    private Target;
    constructor();
    Validate(obj: Object): boolean;
    protected PassFunction(definition: FunctionDefinition): boolean;
}
